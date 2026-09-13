<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Assistant\DTOs\UnitPublicDTO;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AssistantOrchestratorService
{
    private string $provider;
    private string $geminiApiKey;
    private string $geminiModel;
    private string $geminiFallbackModel;
    private string $openrouterApiKey;
    private string $openrouterModel;
    private string $openrouterFallbackModel;
    private string $openrouterBaseUrl;
    private float $totalBudget;
    private float $perRequestTimeout;
    private int $maxIterations;

    public function __construct(
        private readonly RestrictedAssistantCatalogService $catalogService,
        private readonly ?HossamKnowledgeService $knowledgeService = null,
    ) {
        $this->geminiApiKey = (string) (config('assistant.gemini.api_key') ?: config('services.gemini.key') ?: env('GEMINI_API_KEY', ''));
        $this->geminiModel = (string) (config('assistant.gemini.model') ?: env('GEMINI_MODEL', 'gemini-2.5-flash'));
        $this->geminiFallbackModel = (string) (config('assistant.gemini.fallback_model') ?: env('GEMINI_FALLBACK_MODEL', 'gemini-2.0-flash'));

        $this->openrouterApiKey = (string) (config('assistant.openrouter.api_key') ?: config('services.openrouter.api_key') ?: env('OPENROUTER_API_KEY', ''));
        $this->openrouterModel = (string) (config('assistant.openrouter.model') ?: config('services.openrouter.model') ?: env('OPENROUTER_MODEL', 'google/gemini-2.5-flash'));
        $this->openrouterFallbackModel = (string) (config('assistant.openrouter.fallback_model') ?: config('services.openrouter.fallback_model') ?: env('OPENROUTER_FALLBACK_MODEL', 'qwen/qwen-2.5-7b-instruct:free'));
        $this->openrouterBaseUrl = rtrim((string) (config('assistant.openrouter.base_url') ?: config('services.openrouter.base_url') ?: 'https://openrouter.ai/api/v1'), '/');

        // Auto-detect active AI provider based on available key or explicit config
        $configuredProvider = (string) config('assistant.provider', env('ASSISTANT_PROVIDER', ''));
        if (!empty($configuredProvider)) {
            $this->provider = strtolower($configuredProvider);
        } elseif (!empty($this->geminiApiKey)) {
            $this->provider = 'gemini';
        } elseif (!empty($this->openrouterApiKey)) {
            $this->provider = 'openrouter';
        } else {
            $this->provider = '';
        }

        // Generous thinking time / timeouts (can be customized via .env)
        $this->totalBudget = (float) config('assistant.total_budget_seconds', 40.0);
        $this->perRequestTimeout = (float) config('assistant.per_request_timeout_seconds', 30.0);
        $this->maxIterations = (int) config('assistant.max_tool_iterations', 2);
    }

    /**
     * Check if at least one AI provider API key is configured.
     */
    public function hasApiKey(): bool
    {
        return !empty($this->geminiApiKey) || !empty($this->openrouterApiKey);
    }

    /**
     * Sanitize and redact sensitive phone numbers from text before transmitting to external LLMs.
     */
    public function sanitizePhoneNumbers(string $text): string
    {
        return preg_replace('/\b(?:\+?20|0)?1[0125]\d{8}\b/', '[رقم هاتف]', $text);
    }

    /**
     * Process user chat turn with intelligent multi-model orchestration, self-learning, and fail-closed safety.
     *
     * @param  string  $message
     * @param  array  $history
     * @param  string  $locale
     * @return array{reply: string, recommended_units: array, quick_replies: array, is_fallback?: bool}
     */
    public function chat(
        string $message,
        array $history = [],
        string $locale = 'ar',
        array $pageContext = []
    ): array {
        $startTime = microtime(true);
        $locale = in_array($locale, ['ar', 'en'], true) ? $locale : 'ar';
        $cleanMessage = mb_substr(trim($message), 0, (int) config('assistant.max_message_chars', 1000));

        // Strict redaction of phone numbers from current user message BEFORE any external dispatch
        $cleanMessage = $this->sanitizePhoneNumbers($cleanMessage);

        if (empty($cleanMessage)) {
            return $this->getSafeFallbackResponse($locale);
        }

        $normalizedPageContext = $this->normalizePageContext($pageContext, $locale);

        // 1. Instant check in self-learned knowledge base / canned FAQ (<5ms response)
        if ($this->knowledgeService !== null && empty($history)) {
            try {
                $instantResponse = $this->knowledgeService->findCannedOrLearnedResponse($cleanMessage, $locale);
                if ($instantResponse !== null && !empty($instantResponse['reply'])) {
                    return [
                        'reply' => $this->sanitizeOutputText($instantResponse['reply']),
                        'recommended_units' => $instantResponse['recommended_units'] ?? [],
                        'quick_replies' => $instantResponse['quick_replies'] ?? $this->buildQuickReplies($locale, !empty($instantResponse['recommended_units'])),
                        'is_fallback' => false,
                    ];
                }
            } catch (\Throwable $e) {
                Log::warning('HossamKnowledgeService instant check error: ' . $e->getMessage());
            }
        }

        // 2. If no external API key is configured, route directly to rich local intent engine
        if (!$this->hasApiKey()) {
            return $this->handleLocalRuleBasedResponse($cleanMessage, $locale, [], $normalizedPageContext);
        }

        // 3. Orchestrate turn using the configured LLM model
        try {
            return $this->orchestrateLlmTurn($cleanMessage, $history, $locale, $startTime, $normalizedPageContext);
        } catch (\Throwable $e) {
            Log::warning('AssistantOrchestrator failure, activating fail-closed fallback', [
                'error_class' => get_class($e),
                'error_code' => $e->getCode(),
                'error_message' => $e->getMessage(),
                'locale' => $locale,
            ]);

            return $this->handleLocalRuleBasedResponse($cleanMessage, $locale, [], $normalizedPageContext);
        }
    }

    private function orchestrateLlmTurn(string $userMessage, array $history, string $locale, float $startTime, array $normalizedPageContext = []): array
    {
        $sanitizedHistory = $this->sanitizeHistory($history);

        // Pre-search relevant inventory matching user's keywords/budget to inject into system prompt
        $preloadedUnits = $this->preSearchRelevantUnits($userMessage, $locale);
        $systemPrompt = $this->buildSystemPrompt($locale, $preloadedUnits, $normalizedPageContext);

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ...$sanitizedHistory,
            [
                'role' => 'user',
                'content' => "<user_inquiry>\n" . htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8') . "\n</user_inquiry>",
            ],
        ];

        $tools = $this->getToolDefinitions();
        $recommendedUnits = [];
        $collectedReply = '';

        // Add preloaded units to recommendedUnits as baseline
        foreach ($preloadedUnits as $unit) {
            $card = $unit->toCardPayload();
            $recommendedUnits[$card['id']] = $card;
        }

        // If user is on a project page, preload units from that specific project as well
        if (!empty($normalizedPageContext['project_slug'])) {
            try {
                $projUnitsPag = $this->catalogService->listUnitsForProject($normalizedPageContext['project_slug'], [], 1, 4, $locale);
                foreach ($projUnitsPag->toCardPayload() as $card) {
                    if (!isset($recommendedUnits[$card['id']])) {
                        $recommendedUnits[$card['id']] = $card;
                    }
                }
            } catch (\Throwable $e) {
                // Ignore gracefully
            }
        }

        for ($iteration = 0; $iteration < $this->maxIterations; $iteration++) {
            $elapsed = microtime(true) - $startTime;
            $remainingBudget = $this->totalBudget - $elapsed;

            if ($remainingBudget < 2.0) {
                Log::info('Assistant turn budget boundary reached, terminating iteration', [
                    'elapsed' => round($elapsed, 3),
                    'iteration' => $iteration,
                ]);
                break;
            }

            $requestTimeout = max(2.0, min($this->perRequestTimeout, $remainingBudget));
            $response = $this->callModel($messages, $tools, $requestTimeout);

            if (!$response || !isset($response['choices'][0]['message'])) {
                break;
            }

            $assistantMsg = $response['choices'][0]['message'];
            $messages[] = $assistantMsg;

            $toolCalls = $assistantMsg['tool_calls'] ?? [];

            if (!empty($toolCalls)) {
                foreach ($toolCalls as $toolCall) {
                    $toolName = (string) ($toolCall['function']['name'] ?? '');
                    $callId = (string) ($toolCall['id'] ?? uniqid('call_'));
                    $rawArgs = $toolCall['function']['arguments'] ?? '{}';
                    $args = is_array($rawArgs) ? $rawArgs : (json_decode($rawArgs, true) ?: []);

                    $toolResult = $this->catalogService->executeTool($toolName, $args, $locale);

                    if (!empty($toolResult['recommended_units'])) {
                        foreach ($toolResult['recommended_units'] as $card) {
                            $recommendedUnits[$card['id']] = $card;
                        }
                    }

                    $messages[] = [
                        'role' => 'tool',
                        'tool_call_id' => $callId,
                        'name' => $toolName,
                        'content' => json_encode($toolResult, JSON_UNESCAPED_UNICODE),
                    ];
                }
            } else {
                $collectedReply = (string) ($assistantMsg['content'] ?? '');
                break;
            }
        }

        if (empty(trim($collectedReply))) {
            return $this->handleLocalRuleBasedResponse($userMessage, $locale, array_values($recommendedUnits), $normalizedPageContext);
        }

        // Clean output, linkify unit names, and build quick replies
        $cleanReply = $this->sanitizeOutputText($collectedReply);
        $cleanReply = $this->injectUnitLinks($cleanReply, $recommendedUnits, $locale);
        $finalUnits = array_values(array_slice($recommendedUnits, 0, 6));
        $quickReplies = $this->buildQuickReplies($locale, !empty($finalUnits));

        // Self-Learning: Store high-quality AI consultation in persistent knowledge base
        if ($this->knowledgeService !== null && !empty($cleanReply) && mb_strlen($cleanReply) > 25) {
            try {
                $this->knowledgeService->learn($userMessage, $cleanReply, $quickReplies, $locale);
            } catch (\Throwable $e) {
                // Non-blocking
            }
        }

        return [
            'reply' => $cleanReply,
            'recommended_units' => $finalUnits,
            'quick_replies' => $quickReplies,
            'is_fallback' => false,
        ];
    }

    /**
     * Dispatch LLM call to the appropriate provider (Gemini or OpenRouter).
     */
    private function callModel(array $messages, array $tools, float $timeout = 30.0): ?array
    {
        // 1. If Gemini is active or only Gemini API key is configured
        if ($this->provider === 'gemini' || (!empty($this->geminiApiKey) && empty($this->openrouterApiKey))) {
            $geminiRes = $this->callGemini($messages, $tools, $timeout);
            if ($geminiRes !== null) {
                return $geminiRes;
            }
        }

        // 2. If OpenRouter is configured
        if (!empty($this->openrouterApiKey)) {
            $openRouterRes = $this->callOpenRouter($messages, $tools, $timeout);
            if ($openRouterRes !== null) {
                return $openRouterRes;
            }
        }

        // 3. Failover to Gemini if OpenRouter failed and Gemini key is available
        if (!empty($this->geminiApiKey) && $this->provider !== 'gemini') {
            return $this->callGemini($messages, $tools, $timeout);
        }

        return null;
    }

    /**
     * Direct call to Google Gemini REST API.
     */
    private function callGemini(array $messages, array $tools, float $timeout = 30.0, ?string $model = null): ?array
    {
        if (empty($this->geminiApiKey)) {
            return null;
        }

        $model = $model ?: $this->geminiModel;

        $systemInstruction = '';
        $contents = [];

        foreach ($messages as $msg) {
            $role = $msg['role'] ?? 'user';
            $content = (string) ($msg['content'] ?? '');

            if ($role === 'system') {
                $systemInstruction = $content;
                continue;
            }

            // Map standard chat roles to Gemini roles
            $geminiRole = match ($role) {
                'assistant' => 'model',
                default => 'user',
            };

            $contents[] = [
                'role' => $geminiRole,
                'parts' => [
                    ['text' => $content],
                ],
            ];
        }

        $payload = [
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => 0.45,
                'maxOutputTokens' => 3000,
            ],
        ];

        if (!empty($systemInstruction)) {
            $payload['system_instruction'] = [
                'parts' => [
                    ['text' => $systemInstruction],
                ],
            ];
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$this->geminiApiKey}";

        try {
            $response = Http::timeout((int) ceil($timeout))
                ->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                $replyText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if (!empty($replyText)) {
                    return [
                        'choices' => [
                            [
                                'message' => [
                                    'role' => 'assistant',
                                    'content' => $replyText,
                                ],
                            ],
                        ],
                    ];
                }
            } else {
                Log::warning('Gemini API error response', [
                    'status' => $response->status(),
                    'body' => mb_substr($response->body(), 0, 500),
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Gemini API call exception (model: ' . $model . '): ' . $e->getMessage());
        }

        // Fallback to secondary Gemini model if primary failed
        if ($model === $this->geminiModel && !empty($this->geminiFallbackModel) && $this->geminiFallbackModel !== $model) {
            Log::info('Gemini primary model failed, trying fallback model: ' . $this->geminiFallbackModel);
            return $this->callGemini($messages, $tools, $timeout, $this->geminiFallbackModel);
        }

        return null;
    }

    /**
     * Call OpenRouter completion endpoint.
     */
    private function callOpenRouter(array $messages, array $tools, float $timeout = 30.0): ?array
    {
        if (empty($this->openrouterApiKey)) {
            return null;
        }

        $payload = [
            'model' => $this->openrouterModel,
            'messages' => $messages,
            'tools' => !empty($tools) ? $tools : null,
            'tool_choice' => !empty($tools) ? 'auto' : null,
            'temperature' => 0.45,
            'max_tokens' => 2500,
        ];

        try {
            $response = Http::timeout((int) ceil($timeout))
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->openrouterApiKey,
                    'HTTP-Referer' => 'https://familyhome-co.com',
                    'X-Title' => 'Family Home Real Estate Assistant',
                ])
                ->post("{$this->openrouterBaseUrl}/chat/completions", array_filter($payload));

            if ($response->successful()) {
                return $response->json();
            }

            // Fallback model on OpenRouter if primary failed
            if (!empty($this->openrouterFallbackModel) && $this->openrouterFallbackModel !== $this->openrouterModel) {
                $payload['model'] = $this->openrouterFallbackModel;
                $fallbackResponse = Http::timeout((int) ceil($timeout))
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $this->openrouterApiKey,
                        'HTTP-Referer' => 'https://familyhome-co.com',
                        'X-Title' => 'Family Home Real Estate Assistant',
                    ])
                    ->post("{$this->openrouterBaseUrl}/chat/completions", array_filter($payload));

                if ($fallbackResponse->successful()) {
                    return $fallbackResponse->json();
                }
            }
        } catch (\Throwable $e) {
            Log::info('OpenRouter LLM call failure: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Pre-search active units matching the user inquiry to enrich system prompt context.
     *
     * @return UnitPublicDTO[]
     */
    private function preSearchRelevantUnits(string $message, string $locale): array
    {
        $filters = [];

        // Price extraction
        if (preg_match('/(\d+(?:\.\d+)?)\s*(?:مليون|ملايين|م)/iu', $message, $m)) {
            $filters['max_price'] = (float) $m[1] * 1000000;
            $filters['sort'] = 'price_desc';
        } elseif (preg_match('/(?:بسعر|سعر|بـ|ميزانية)\s*(\d{5,})/iu', $message, $m)) {
            $filters['max_price'] = (float) $m[1];
        }

        // Room count extraction
        if (preg_match('/(كبيره|كبيرة|واسعه|واسعة|large|spacious)/iu', $message)) {
            $filters['rooms'] = 3;
        } elseif (preg_match('/(\d+)\s*(?:غرف|غرفة|غرفه|rooms)/iu', $message, $rm)) {
            $filters['rooms'] = (int) $rm[1];
        }

        if (preg_match('/(إيجار|ايجار|rent)/iu', $message)) {
            $filters['transaction'] = 'rent';
        }

        $units = $this->catalogService->listUnits($filters, 4, $locale);
        if (empty($units) && isset($filters['rooms'])) {
            unset($filters['rooms']);
            $units = $this->catalogService->listUnits($filters, 4, $locale);
        }

        return $units;
    }

    private function sanitizeHistory(array $history): array
    {
        $maxTurns = (int) config('assistant.max_history_turns', 6);
        $sliced = array_slice($history, -$maxTurns);
        $clean = [];

        foreach ($sliced as $item) {
            if (!is_array($item) || empty($item['role']) || empty($item['content'])) {
                continue;
            }
            $role = in_array($item['role'], ['user', 'assistant'], true) ? $item['role'] : 'user';
            $content = mb_substr(strip_tags((string) $item['content']), 0, 1000);

            // Strip control characters
            $content = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $content);

            // Redact phone numbers from history turns
            $content = $this->sanitizePhoneNumbers($content);

            $clean[] = [
                'role' => $role,
                'content' => $content,
            ];
        }

        return $clean;
    }

    private function sanitizeOutputText(string $text): string
    {
        // 1. Strip script, iframe, object, embed, style tags
        $cleaned = preg_replace('/<(script|style|iframe|embed|object)[^>]*>.*?<\/\\1>/is', '', $text);

        // 2. Disallow dangerous URI schemes in markdown links or text
        $cleaned = preg_replace('/javascript\s*:/i', 'blocked:', $cleaned);
        $cleaned = preg_replace('/data\s*:\s*text\/html/i', 'blocked:', $cleaned);

        // 3. Remove raw HTML tags to ensure safe markdown rendering
        $cleaned = strip_tags($cleaned);

        return trim($cleaned);
    }

    private function buildSystemPrompt(string $locale, array $preloadedUnits = [], array $pageContext = []): string
    {
        // Fetch verified company contact info
        $companyContactSection = \App\Domain\Assistant\Services\AssistantContactResolver::formatCompanyPromptSection($locale);

        $inventoryContext = '';
        if (!empty($preloadedUnits)) {
            $items = [];
            foreach ($preloadedUnits as $u) {
                $line = "• **{$u->name}** | السعر: " . number_format($u->price) . " ج.م | الغرف: {$u->rooms} | المساحة: {$u->areaSqm} م² | الدفع: {$u->paymentMethod} | الرابط: {$u->url}";
                if (!empty($u->agentName)) {
                    $line .= " | الوكيل: {$u->agentName}";
                    if (!empty($u->agentPhone)) $line .= " (هاتف: {$u->agentPhone})";
                    if (!empty($u->agentWhatsapp)) $line .= " (واتساب: {$u->agentWhatsapp})";
                }
                $items[] = $line;
            }
            $inventoryContext = "\n\nالوحدات العقارية المتاحة فعلياً في كتالوج الشركة والمطابقة لبحث العميل:\n" . implode("\n", $items);
        }

        $pageContextSection = '';
        if (!empty($pageContext['page_type']) && $pageContext['page_type'] !== 'unknown') {
            $desc = [];
            if (!empty($pageContext['project_name'])) {
                $pLine = "المشروع المعروض بالصفحة الحالية: «{$pageContext['project_name']}» (Slug: {$pageContext['project_slug']})";
                if (!empty($pageContext['agent_name'])) {
                    $pLine .= " | الوكيل العقاري المسؤول: {$pageContext['agent_name']}";
                    if (!empty($pageContext['agent_phone'])) $pLine .= " (هاتف: {$pageContext['agent_phone']})";
                    if (!empty($pageContext['agent_whatsapp'])) $pLine .= " (واتساب: {$pageContext['agent_whatsapp']})";
                }
                $desc[] = $pLine;
                if (!empty($pageContext['summary'])) {
                    $s = $pageContext['summary'];
                    $parts = [];
                    if (!empty($s['location'])) $parts[] = "الموقع: {$s['location']}";
                    if (!empty($s['price_range'])) $parts[] = "نطاق الأسعار: {$s['price_range']}";
                    if (!empty($s['units_count'])) $parts[] = "إجمالي الوحدات: {$s['units_count']}";
                    if (!empty($parts)) $desc[] = implode(' | ', $parts);
                }
            }
            if (!empty($pageContext['unit_name'])) {
                $uLine = "الوحدة المعروضة بالصفحة الحالية: «{$pageContext['unit_name']}»" .
                    (!empty($pageContext['unit_price']) ? " | السعر: " . number_format((float)$pageContext['unit_price']) . " ج.م" : "") .
                    (!empty($pageContext['unit_rooms']) ? " | الغرف: {$pageContext['unit_rooms']}" : "");
                if (!empty($pageContext['agent_name'])) {
                    $uLine .= " | الوكيل العقاري المسؤول: {$pageContext['agent_name']}";
                    if (!empty($pageContext['agent_phone'])) $uLine .= " (هاتف: {$pageContext['agent_phone']})";
                    if (!empty($pageContext['agent_whatsapp'])) $uLine .= " (واتساب: {$pageContext['agent_whatsapp']})";
                }
                $desc[] = $uLine;
            }
            if (!empty($pageContext['title'])) {
                $desc[] = "عنوان الصفحة: {$pageContext['title']}";
            }
            if (!empty($pageContext['pathname']) || !empty($pageContext['url'])) {
                $desc[] = "رابط الصفحة: " . ($pageContext['pathname'] ?: $pageContext['url']);
            }
            if (!empty($pageContext['page_type'])) {
                $desc[] = "نوع الصفحة: {$pageContext['page_type']}";
            }

            if ($locale === 'en') {
                $pageContextSection = "\n\nCURRENT BROWSER PAGE CONTEXT:\n" .
                    implode("\n", $desc) . "\n\n" .
                    "PAGE CONTEXT INSTRUCTIONS:\n" .
                    "1. You know exactly what page the user is currently browsing on Family Home website.\n" .
                    "2. If the user asks 'Where am I?', 'What page am I on?', 'What am I viewing?', tell them accurately about the current page, welcoming them warmly.\n" .
                    "3. If the user refers to 'this project', 'this apartment', 'the prices here', or asks for available units without naming them, they are referring to the project/unit on their current page.\n";
            } else {
                $pageContextSection = "\n\nمعلومات الصفحة الحالية التي يتصفحها العميل الآن على موقع فاميلي هوم:\n" .
                    implode("\n", $desc) . "\n\n" .
                    "تعليمات خاصة بصفحة العميل الحالية:\n" .
                    "1. أنت تعرف بدقة الصفحة التي يتصفحها العميل الآن في الموقع.\n" .
                    "2. إذا سأل العميل: «أنا فين؟»، «أنا في أي صفحة؟»، «بتصفح إيه دلوقتي؟»، أو «تعرف مكاني؟»، أخبره فوراً بالصفحة التي يشاهدها وتفاصيلها بترحيب ولباقة.\n" .
                    "3. إذا سأل العميل عن «هذا المشروع»، «المشروع ده»، «الوحدة دي»، «الأسعار هنا»، فهو يقصد المشروع أو الوحدة المعروضة بالصفحة الحالية مباشرة.\n";
            }
        }

        if ($locale === 'en') {
            return <<<EOT
# IDENTITY & PERSONA
You are **Hossam**, the senior real estate and investment advisor at **Family Home** — Egypt's trusted property consultancy.
You are a warm, knowledgeable, and genuinely helpful advisor who treats every client like a VIP.
Your communication style is professional yet personable — like a trusted friend who happens to be an expert.

# THINKING PROCESS (Internal — DO NOT show this to the user)
Before every response, silently think through:
1. **Intent Detection:** What does the user actually want? (Browse, compare, get advice, calculate, book a visit, ask about a specific project/unit, or just chat?)
2. **Context Awareness:** What do I know about their budget, location preference, purpose (living vs investment), and current page?
3. **Data Check:** Do I have relevant units/projects in the data below or should I use tools to search?
4. **Value-Add:** What extra insight can I provide? (Financial comparison, area growth potential, similar alternatives)

# CORE BEHAVIOR RULES
1. **Be genuinely helpful:** Don't just list properties — explain WHY each one fits the client's needs. Add context about the area, developer reputation, and investment potential.
2. **Use verified data ONLY:** Never invent property details. Use the tools and data provided below.
3. **Ask clarifying questions when needed:** If the user's request is vague (e.g., "I want an apartment"), ask smart follow-up questions:
   - "What's your target budget range?"
   - "Which area do you prefer — East Cairo, West Cairo, or the coast?"
   - "Is this for personal living or investment?"
   - "Do you prefer ready-to-move or off-plan with installments?"
4. **Provide financial intelligence:** When discussing properties, include:
   - Monthly installment breakdown when relevant
   - Cash discount percentage vs installment total
   - Expected annual appreciation rate for the area (15-30% for prime areas)
   - Rental yield potential if investment-focused
5. **Structure your responses:** Use headers, bullet points, and emojis for readability. Keep responses comprehensive but scannable.
6. **Proactive suggestions:** Always end with a relevant suggestion or next step — don't leave the conversation hanging.

# AVAILABLE TOOLS
Use these tools proactively when you need data:
- **search_units**: Search active units with filters (max_price, min_price, rooms, transaction type, area, payment method)
- **find_project**: Get project details by slug
- **list_units_for_project**: List units in a specific project
- **get_unit_in_project**: Verify a specific unit within a project
- **list_projects**: List all active projects

# RESPONSE FORMAT GUIDELINES
- Use **bold** for property names, prices, and key figures
- Use emojis sparingly but effectively: 🏠 🏢 💰 📍 🛏️ 📐 🔑 📊 💡 ✅
- Include price, rooms, area (sqm), payment method, and location for each property recommendation
- When comparing options, use a brief comparison format highlighting trade-offs
- Keep responses between 150-400 words — detailed enough to be useful, concise enough to be readable

# EXAMPLE INTERACTIONS
**User:** "I want an apartment for 5 million"
**Good Response:** Search for units within budget → present 2-3 options with details → compare them briefly → add investment insight → suggest next step

**User:** "Which is better — cash or installments?"
**Good Response:** Explain both with real numbers → provide specific scenarios → recommend based on their situation → offer to calculate for a specific unit

**User:** "Tell me about New Cairo projects"
**Good Response:** Use list_projects tool → filter New Cairo → present with area context → highlight growth potential → suggest top picks
{$pageContextSection}
{$companyContactSection}
{$inventoryContext}
EOT;
        }

        return <<<EOT
# الهوية والشخصية
أنت **«حسام»**، كبير المستشارين العقاريين والاستثماريين في شركة **«فاميلي هوم» (Family Home)** — الشركة الرائدة في الاستشارات العقارية في مصر.
شخصيتك: مستشار ودود، خبير، وصادق. أسلوبك في الكلام مصري راقي — تستخدم اللهجة المصرية المهنية بطريقة تخلّي العميل يحس إنه بيتكلم مع صاحبه الخبير مش موظف خدمة عملاء.
أنت مش بتبيع — أنت بتنصح بصدق وتساعد العميل ياخد أحسن قرار.

# طريقة التفكير (داخلية — لا تعرضها للعميل)
قبل كل رد، فكّر في الخطوات دي بصمت:
1. **فهم النيّة:** العميل عايز إيه بالظبط؟ (يتصفح، يقارن، ياخد نصيحة، يحسب أقساط، يحجز معاينة، يسأل عن مشروع/وحدة معينة، ولا مجرد كلام عام؟)
2. **السياق المتاح:** إيه اللي أعرفه عن ميزانيته، المنطقة المفضلة، الهدف (سكن ولا استثمار)، والصفحة اللي بيتصفحها؟
3. **البيانات المتاحة:** هل عندي وحدات/مشاريع مناسبة في البيانات المتاحة، ولا محتاج أستخدم أدوات البحث؟
4. **القيمة المضافة:** إيه النصيحة أو المعلومة الإضافية اللي أقدر أضيفها؟ (مقارنة مالية، إمكانات النمو، بدائل مشابهة)

# قواعد العمل الأساسية
1. **كن مفيد بجد:** متقعدش تسرد عقارات وخلاص — اشرح **ليه** كل عقار مناسب للعميل. أضف سياق عن المنطقة، سمعة المطوّر، والإمكانات الاستثمارية.
2. **بيانات حقيقية فقط:** لا تخترع أبداً تفاصيل عقارية. استخدم الأدوات والبيانات المتاحة أدناه.
3. **اسأل أسئلة توضيحية لما تحتاج:** لو طلب العميل غامض (مثلاً: «عايز شقة»)، اسأل أسئلة ذكية:
   - «ميزانيتك بتتراوح بين كام وكام تقريباً؟»
   - «بتفضل منطقة معينة — شرق القاهرة، غرب القاهرة، ولا الساحل؟»
   - «الشقة دي للسكن الشخصي ولا استثمار؟»
   - «تحب استلام فوري ولا على الخريطة بنظام تقسيط؟»
4. **قدّم ذكاء مالي:** لما تتكلم عن عقارات، أضف:
   - تفاصيل القسط الشهري لما يكون مناسب
   - نسبة خصم الكاش مقابل إجمالي التقسيط
   - معدل الزيادة السنوية المتوقعة للمنطقة (15-30% في المناطق المميزة)
   - العائد الإيجاري المتوقع لو العميل بيفكر في استثمار
5. **نظّم ردودك:** استخدم عناوين، نقاط، وإيموجي للوضوح. خلّي الرد شامل لكن سهل القراءة.
6. **اقتراحات استباقية:** دايماً اختم باقتراح مناسب أو خطوة تالية — متسبش المحادثة معلّقة.

# الأدوات المتاحة
استخدم الأدوات دي بشكل استباقي لما تحتاج بيانات:
- **search_units**: للبحث عن وحدات نشطة بفلاتر (max_price, min_price, rooms, transaction, payment_method)
- **find_project**: لعرض تفاصيل مشروع معين عبر الـ slug
- **list_units_for_project**: لعرض الوحدات التابعة لمشروع محدد
- **get_unit_in_project**: للتحقق من تفاصيل وحدة معينة
- **list_projects**: لعرض المشاريع النشطة

# إرشادات تنسيق الرد
- استخدم **خط عريض** لأسماء العقارات والأسعار والأرقام المهمة
- استخدم الإيموجي بشكل مناسب: 🏠 🏢 💰 📍 🛏️ 📐 🔑 📊 💡 ✅
- لكل ترشيح عقاري، اذكر: السعر، عدد الغرف، المساحة (م²)، طريقة الدفع، والموقع
- عند المقارنة بين خيارات، وضّح المميزات والعيوب لكل خيار
- خلّي ردودك بين 150-400 كلمة — شاملة ومفيدة لكن مختصرة وسهلة القراءة

# أمثلة على التفاعل المثالي
**العميل:** «عايز شقة بـ 5 مليون»
**الرد الجيد:** ابحث عن وحدات في حدود الميزانية ← اعرض 2-3 خيارات بالتفاصيل ← قارن بينهم باختصار ← أضف نصيحة استثمارية ← اقترح خطوة تالية

**العميل:** «كاش ولا تقسيط أحسن؟»
**الرد الجيد:** اشرح الاتنين بأرقام حقيقية ← قدّم سيناريوهات محددة ← انصح بناءً على حالته ← اعرض تحسب على وحدة معينة

**العميل:** «إيه المشاريع اللي في التجمع؟»
**الرد الجيد:** استخدم أداة list_projects ← فلتر التجمع ← اعرض مع سياق المنطقة ← وضّح إمكانات النمو ← رشّح أفضل الخيارات

# تعليمات الأمان والخصوصية
- لا تشارك أرقام هواتف أو بيانات شخصية لأي مشتري أو عميل آخر (حافظ على سرية بيانات العملاء تماماً).
- أما بيانات التواصل الرسمية للشركة والوكيل العقاري المسؤول المرفوعة باسمه الوحدة/المشروع، فتشاركها بكل دقة عند الطلب أو الرغبة في المعاينة والتواصل.
- لا تخترع أبداً أرقام هواتف أو إيميلات أو بيانات تواصل أو أسعار وهمية غير موجودة في قاعدة البيانات.
{$pageContextSection}
{$companyContactSection}
{$inventoryContext}
EOT;
    }

    private function getToolDefinitions(): array
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'search_units',
                    'description' => 'Search active units across all projects with filters such as price, rooms, and transaction type',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'transaction' => ['type' => 'string', 'enum' => ['sale', 'rent']],
                            'min_price' => ['type' => 'number', 'description' => 'Minimum price in EGP'],
                            'max_price' => ['type' => 'number', 'description' => 'Maximum price in EGP'],
                            'rooms' => ['type' => 'integer', 'description' => 'Number of rooms / bedrooms'],
                            'min_area_sqm' => ['type' => 'number', 'description' => 'Minimum area in square meters'],
                            'payment_method' => ['type' => 'string', 'enum' => ['cash', 'installment']],
                            'sort' => ['type' => 'string', 'enum' => ['price_asc', 'price_desc', 'newest']],
                            'limit' => ['type' => 'integer', 'description' => 'Max units to return (default 6)'],
                        ],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'find_project',
                    'description' => 'Get public details of an active project by its slug',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'project_slug' => ['type' => 'string', 'description' => 'The slug of the project'],
                        ],
                        'required' => ['project_slug'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'list_units_for_project',
                    'description' => 'List active units belonging to a specific active project with pagination and optional filters',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'project_slug' => ['type' => 'string', 'description' => 'The project slug'],
                            'page' => ['type' => 'integer', 'description' => 'Page number (default 1)'],
                            'per_page' => ['type' => 'integer', 'description' => 'Units per page (max 12, default 6)'],
                            'filters' => [
                                'type' => 'object',
                                'properties' => [
                                    'transaction' => ['type' => 'string', 'enum' => ['sale', 'rent']],
                                    'min_price' => ['type' => 'number'],
                                    'max_price' => ['type' => 'number'],
                                    'rooms' => ['type' => 'integer'],
                                    'payment_method' => ['type' => 'string', 'enum' => ['cash', 'installment']],
                                    'sort' => ['type' => 'string', 'enum' => ['price_asc', 'price_desc', 'newest']],
                                ],
                            ],
                        ],
                        'required' => ['project_slug'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_unit_in_project',
                    'description' => 'Get a specific active unit verified within its project (Anti-IDOR)',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'project_slug' => ['type' => 'string', 'description' => 'The project slug'],
                            'unit_slug' => ['type' => 'string', 'description' => 'The unit slug'],
                        ],
                        'required' => ['project_slug', 'unit_slug'],
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'list_projects',
                    'description' => 'List active real estate projects available in Family Home',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'limit' => ['type' => 'integer', 'description' => 'Number of projects (default 6)'],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Deterministic local fallback when LLM is offline or no API key is provided.
     * Guaranteed to return only active projects and units without external dependencies.
     */
    private function handleLocalRuleBasedResponse(string $message, string $locale, array $preloadedUnits = [], array $pageContext = []): array
    {
        $cleanMsg = trim($message);
        $lowerMsg = mb_strtolower($cleanMsg);
        $companyContact = \App\Domain\Assistant\Services\AssistantContactResolver::getCompanyContact();
        $whatsappUrl = $companyContact['whatsapp_url'] ?: ('https://wa.me/' . preg_replace('/[^\d]/', '', (string) config('assistant.default_whatsapp', '201000000000')) . '?text=' . urlencode($locale === 'en' ? 'Hello Family Home, I would like to inquire about properties' : 'مرحباً فاميلي هوم، أود الاستفسار عن العقارات المتاحة'));
        $companyPhone = $companyContact['phone'] ?: '';
        $companyEmail = $companyContact['email'] ?: '';
        $companyAddress = $companyContact['address'] ?: '';

        // 0. Inquiry about Current Page / Location
        if (preg_match('/(أنا فين|انا فين|في أي صفحة|في اي صفحه|أنا في أي صفحة|انا في اي صفحه|في انهي صفحة|في انهي صفحه|انهي صفحة|انهي صفحه|اي صفحه|أي صفحة|بتصفح إيه|بتصفح ايه|تعرف الصفحة|تعرف الصفحه|الصفحة اللي أنا فيها|الصفحه الى انا فيها|الصفحة الحالية|الصفحه الحاليه|مكاني فين|وين أنا|وين انا|where am i|what page|current page|which page)/iu', $cleanMsg)) {
            $pType = $pageContext['page_type'] ?? 'unknown';
            $pTitle = $pageContext['title'] ?? '';

            if ($pType === 'project' && !empty($pageContext['project_name'])) {
                $projName = $pageContext['project_name'];
                $summary = $pageContext['summary'] ?? null;
                $reply = $locale === 'en'
                    ? "You are currently browsing the **{$projName}** project page! 🏢\n\n" .
                      ($summary ? "📍 **Location:** {$summary['location']}\n💰 **Price Range:** {$summary['price_range']}\n🔢 **Available Units:** {$summary['units_count']}\n\n" : "") .
                      "Would you like to explore available units, payment plans, or schedule a site visit?"
                    : "أنت تتصفح حالياً صفحة مشروع **{$projName}**! 🏢\n\n" .
                      ($summary ? "📍 **الموقع:** {$summary['location']}\n💰 **نطاق الأسعار:** {$summary['price_range']}\n🔢 **الوحدات المتاحة:** {$summary['units_count']} وحدة\n\n" : "") .
                      "يسعدني تزويدك بأنظمة السداد، أو تفاصيل الوحدات المتوفرة بالمشروع، أو ترتيب معاينة ميدانية مجانية!";

                $units = [];
                if (!empty($pageContext['project_slug'])) {
                    $pag = $this->catalogService->listUnitsForProject($pageContext['project_slug'], [], 1, 4, $locale);
                    $units = $pag->toCardPayload();
                }

                return [
                    'reply' => $reply,
                    'recommended_units' => $units,
                    'quick_replies' => $locale === 'en'
                        ? ['Available units in project', 'Payment plans', 'Book a visit']
                        : ['الوحدات المتاحة في المشروع', 'أنظمة السداد والتقسيط', 'حجز موعد معاينة'],
                    'is_fallback' => false,
                ];
            }

            if ($pType === 'unit' && !empty($pageContext['unit_name'])) {
                $unitName = $pageContext['unit_name'];
                $price = !empty($pageContext['unit_price']) ? number_format((float)$pageContext['unit_price']) . ' ج.م' : '';
                $rooms = !empty($pageContext['unit_rooms']) ? "{$pageContext['unit_rooms']} غرف" : '';
                $reply = $locale === 'en'
                    ? "You are currently viewing unit: **{$unitName}**! 🏠\n\n" .
                      ($price ? "💰 **Price:** {$price}\n" : "") .
                      ($rooms ? "🛏️ **Bedrooms:** {$rooms}\n\n" : "") .
                      "Would you like to know the installment plan for this unit or book an inspection?"
                    : "أنت تتصفح حالياً تفاصيل الوحدة: **{$unitName}**! 🏠\n\n" .
                      ($price ? "💰 **السعر:** {$price}\n" : "") .
                      ($rooms ? "🛏️ **عدد الغرف:** {$rooms}\n\n" : "") .
                      "هل ترغب في معرفة تفاصيل التقسيط والمقدم المتاح لهذه الوحدة، أو حجز موعد للمعاينة؟";

                return [
                    'reply' => $reply,
                    'recommended_units' => [],
                    'quick_replies' => $locale === 'en'
                        ? ['Payment & installment options', 'Book a visit', 'Other units']
                        : ['أنظمة السداد والمقدم', 'حجز موعد معاينة', 'وحدات مشابهة'],
                    'is_fallback' => false,
                ];
            }

            if ($pType === 'deals') {
                $reply = $locale === 'en'
                    ? "You are on the **Exclusive Real Estate Deals & Opportunities** page! 💎\n\nHere you will find properties with instant cash discounts and premier flexible installment plans. How can I assist you?"
                    : "أنت تتصفح حالياً صفحة **الصفقات والفرص العقارية الحصرية (اللقطات)**! 💎\n\nتضم هذه الصفحة أفضل الفرص الاستثمارية بخصومات كاش حصرية وأنظمة سداد مرنة. كيف أستطيع مساعدتك اليوم؟";
                return [
                    'reply' => $reply,
                    'recommended_units' => [],
                    'quick_replies' => $locale === 'en'
                        ? ['Show top deals', 'Apartments for sale', 'Contact team']
                        : ['أفضل الصفقات', 'شقق للبيع بالتقسيط', 'تواصل مع فريق المبيعات'],
                    'is_fallback' => false,
                ];
            }

            if ($pType === 'units_catalog') {
                $reply = $locale === 'en'
                    ? "You are currently on our **Property Catalog** browsing available units across Egypt! 🏘️\n\nTell me your budget or preferred location, and I will filter the top matches for you."
                    : "أنت تتصفح حالياً **كتالوج الوحدات العقارية المتاحة** للبيع والإيجار في فاميلي هوم! 🏘️\n\nأخبرني بميزانيتك أو موقعك المفضل، وسأقوم بفرز وترشيح أفضل الوحدات المناسبة لك فوراً.";
                return [
                    'reply' => $reply,
                    'recommended_units' => [],
                    'quick_replies' => $locale === 'en'
                        ? ['Apartments for sale', 'Villas', 'Commercial units']
                        : ['شقق للبيع بالتقسيط', 'فيلات مستقلة', 'وحدات تجارية وإدارية'],
                    'is_fallback' => false,
                ];
            }

            if ($pType === 'projects_catalog') {
                $reply = $locale === 'en'
                    ? "You are currently exploring our **Real Estate Projects Directory**! 🏢\n\nFeaturing premier developments across New Cairo, New Capital, Sheikh Zayed, and North Coast. Which area are you interested in?"
                    : "أنت تتصفح حالياً **دليل المشاريع العقارية الكبرى** في فاميلي هوم! 🏢\n\nيضم أحدث المشروعات السكنية والاستثمارية في القاهرة الجديدة، العاصمة الإدارية، والشيخ زايد، والساحل الشمالي. أي منطقة تود استكشافها؟";
                return [
                    'reply' => $reply,
                    'recommended_units' => [],
                    'quick_replies' => $locale === 'en'
                        ? ['New Cairo projects', 'New Capital projects', 'North Coast']
                        : ['مشاريع القاهرة الجديدة', 'مشاريع العاصمة الإدارية', 'مشاريع الساحل الشمالي'],
                    'is_fallback' => false,
                ];
            }

            // General / Home or with title
            $descName = !empty($pTitle) ? $pTitle : (!empty($pageContext['pathname']) ? $pageContext['pathname'] : 'موقع فاميلي هوم');
            $reply = $locale === 'en'
                ? "You are currently browsing **{$descName}** on Family Home! 🤝\n\nI am Hossam, your real estate advisor. How can I help you today?"
                : "أنت تتصفح حالياً: **{$descName}** في موقع فاميلي هوم! 🤝\n\nأنا «حسام»، مستشارك العقاري. يسعدني مساعدتك في استعراض الوحدات أو الرد على أي استفسار عقاري أو مالي!";

            return [
                'reply' => $reply,
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Featured projects', 'Apartments for sale', 'Contact team']
                    : ['المشاريع المميزة', 'شقق للبيع بالتقسيط', 'تواصل مع فريق المبيعات'],
                'is_fallback' => false,
            ];
        }

        // Contextual: User asks about "المشروع ده" while on a project page
        if ($pageContext['page_type'] === 'project' && !empty($pageContext['project_slug']) && preg_match('/(المشروع ده|هذا المشروع|المشروع هذا|عن المشروع|تفاصيل المشروع|نظام السداد هنا|الاسعار هنا|الأسعار هنا|الوحدات هنا)/iu', $cleanMsg)) {
            $projDto = $this->catalogService->findProject($pageContext['project_slug'], $locale);
            $pag = $this->catalogService->listUnitsForProject($pageContext['project_slug'], [], 1, 6, $locale);
            $projName = $pageContext['project_name'] ?? $projDto?->name ?? 'المشروع الحالي';
            $loc = $projDto?->locationAddress ?? $pageContext['summary']['location'] ?? null;

            $reply = $locale === 'en'
                ? "Here is the verified information for **{$projName}**:\n\n" .
                  ($loc ? "📍 **Location:** {$loc}\n\n" : "") .
                  "Here are the active units available in this project:"
                : "إليك كافة التفاصيل المعتمدة لمشروع **{$projName}**:\n\n" .
                  ($loc ? "📍 **الموقع:** {$loc}\n\n" : "") .
                  "وهذه أبرز الوحدات المتاحة حالياً داخل المشروع:";

            return [
                'reply' => $reply,
                'recommended_units' => $pag->toCardPayload(),
                'quick_replies' => $locale === 'en'
                    ? ['Payment plans', 'Book a visit', 'Contact team']
                    : ['أنظمة السداد والتقسيط', 'حجز موعد معاينة', 'تواصل عبر واتساب'],
                'is_fallback' => false,
            ];
        }

        // Contextual: User asks about "الوحدة دي" while on a unit page
        if ($pageContext['page_type'] === 'unit' && !empty($pageContext['unit_name']) && preg_match('/(الوحدة دي|الوحده دي|هذه الوحدة|الشقة دي|الشقه دي|سعرها كام|تفاصيل الوحدة|تفاصيل الشقة)/iu', $cleanMsg)) {
            $unitName = $pageContext['unit_name'];
            $price = !empty($pageContext['unit_price']) ? number_format((float)$pageContext['unit_price']) . ' ج.م' : 'تواصل لمعرفة السعر';
            $rooms = !empty($pageContext['unit_rooms']) ? "{$pageContext['unit_rooms']} غرف" : '';

            $reply = $locale === 'en'
                ? "Here are the details for **{$unitName}**:\n\n💰 **Price:** {$price}\n" . ($rooms ? "🛏️ **Bedrooms:** {$rooms}\n\n" : "\n") .
                  "Would you like to review payment schedules or arrange a viewing?"
                : "إليك تفاصيل الوحدة التي تشاهدها الآن (**{$unitName}**):\n\n💰 **السعر:** {$price}\n" . ($rooms ? "🛏️ **عدد الغرف:** {$rooms}\n\n" : "\n") .
                  "هل تود معرفة نظام التقسيط والدفعة المقدمة لهذه الوحدة، أو ترتيب موعد لمعاينتها على الطبيعة؟";

            return [
                'reply' => $reply,
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Payment plans', 'Book inspection', 'Similar properties']
                    : ['أنظمة التقسيط والمقدم', 'حجز موعد معاينة', 'وحدات مشابهة'],
                'is_fallback' => false,
            ];
        }

        // 1. WhatsApp / Customer Support / Agent Contact inquiry
        if (preg_match('/(تواصل عبر واتساب|واتساب|تواصل معي|تواصل مع|خدمة العملاء|خدمه العملاء|رقم التليفون|رقم الهاتف|ارقامكم|عنوانكم|مقركم|فين مكتبكم|بيانات التواصل|معلومات التواصل|تواصل معاكم|رقم الوكيل|مين الوكيل|المستشار العقاري|whatsapp|contact us|phone number|broker|agent)/iu', $cleanMsg)) {
            // Check if user specifically asked about the agent or broker of the current page's unit/project
            $hasAgentQuery = preg_match('/(الوكيل|المسؤول|المستشار|صاحب|مالك|agent|broker)/iu', $cleanMsg);
            $agentName = $pageContext['agent_name'] ?? null;
            $agentPhone = $pageContext['agent_phone'] ?? null;
            $agentWa = $pageContext['agent_whatsapp'] ?? null;

            if ($hasAgentQuery && !empty($agentName)) {
                $cleanAgentWa = $agentWa ? preg_replace('/[^\d]/', '', $agentWa) : null;
                $agentWaUrl = $cleanAgentWa ? "https://wa.me/{$cleanAgentWa}" : null;

                $details = [];
                if ($agentPhone) $details[] = ($locale === 'en' ? "📞 **Phone:** {$agentPhone}" : "📞 **الهاتف المباشر:** {$agentPhone}");
                if ($agentWaUrl) $details[] = ($locale === 'en' ? "💬 **WhatsApp:** [Chat on WhatsApp]({$agentWaUrl})" : "💬 **واتساب المباشر:** [اضغط هنا للمحادثة عبر واتساب]({$agentWaUrl})");

                if (!empty($details)) {
                    $reply = $locale === 'en'
                        ? "The real estate advisor managing this property is **{$agentName}**:\n\n" . implode("\n", $details) . "\n\nYou can reach out directly to coordinate details or book an inspection!"
                        : "الوكيل العقاري المسؤول عن هذا العقار هو **{$agentName}**:\n\n" . implode("\n", $details) . "\n\nيمكنك التواصل معه مباشرة لتنسيق كافة التفاصيل أو حجز موعد معاينة ميدانية!";
                } else {
                    $reply = $locale === 'en'
                        ? "The advisor assigned to this property is **{$agentName}**. For immediate assistance, our central sales team will connect you directly:\n\n💬 **WhatsApp:** [Chat with Family Home]({$whatsappUrl})" . ($companyPhone ? "\n📞 **Phone:** {$companyPhone}" : "")
                        : "الوكيل العقاري المسؤول عن هذا العقار هو **{$agentName}**. للتواصل الفوري، يقوم فريق مبيعات فاميلي هوم المركزي بربطك به مباشرة:\n\n💬 **واتساب فاميلي هوم:** [اضغط هنا للمحادثة الفورية]({$whatsappUrl})" . ($companyPhone ? "\n📞 **هاتف الإدارة:** {$companyPhone}" : "");
                }
            } else {
                // Official company contact details
                $companyDetails = [];
                if ($companyPhone) $companyDetails[] = ($locale === 'en' ? "📞 **Phone:** {$companyPhone}" : "📞 **الهاتف:** {$companyPhone}");
                $companyDetails[] = ($locale === 'en' ? "💬 **Direct WhatsApp:** [Chat on WhatsApp]({$whatsappUrl})" : "💬 **واتساب المبيعات والدعم:** [اضغط هنا للتواصل عبر واتساب مباشرة]({$whatsappUrl})");
                if ($companyEmail) $companyDetails[] = ($locale === 'en' ? "✉️ **Email:** {$companyEmail}" : "✉️ **البريد الإلكتروني:** {$companyEmail}");
                if ($companyAddress) $companyDetails[] = ($locale === 'en' ? "📍 **Address:** {$companyAddress}" : "📍 **المقر الرئيسي:** {$companyAddress}");

                $reply = $locale === 'en'
                    ? "We are delighted to assist you directly through **Family Home** official verified contacts:\n\n" . implode("\n", $companyDetails) . "\n\nOur advisory team is available daily to help you find the ideal property and schedule free site viewings."
                    : "يسعدنا تواصلك المباشر مع شركة **فاميلي هوم** عبر قنوات الاتصال الرسمية والمعتمدة:\n\n" . implode("\n", $companyDetails) . "\n\nفريق مستشارينا متواجد يومياً لمساعدتك في اختيار أنسب عقار وترتيب معاينات ميدانية مجانية.";
            }

            return [
                'reply' => $reply,
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Featured projects', 'Apartments for sale', 'Best investment areas']
                    : ['المشاريع المميزة', 'شقق للبيع بالتقسيط', 'أفضل مناطق الاستثمار'],
                'is_fallback' => true,
            ];
        }

        // 2. Installments & Payment Plans inquiry (e.g. "شقق للبيع بالتقسيط")
        if (preg_match('/(شقق للبيع بالتقسيط|شقق بنظام التقسيط|شقق بالتقسيط|شقق تقسيط|شقق قسط|عايز شقه قسط|عايز شقة قسط|أنظمة السداد|انظمة السداد|نظام التقسيط|انظمه التقسيط|أطول فترة سداد|اطول فتره سداد|أقل مقدم|اقل مقدم|اقساط|أقساط|installment|down payment)/iu', $cleanMsg)) {
            $installmentUnits = $this->catalogService->listUnits(['payment_method' => 'installment'], 4, $locale);
            $unitCards = array_map(fn($u) => $u->toCardPayload(), $installmentUnits);

            $reply = $locale === 'en'
                ? "At **Family Home**, we provide a prime portfolio of apartments and residential units with flexible, bank-interest-free payment plans:\n\n• **Down Payment:** Typically starting from 10% to 15%.\n• **Payment Terms:** Spread over 6, 8, and up to 10 years in equal installments.\n• **Handover:** Diverse options ranging from immediate delivery to 1–3 years.\n\nHere are some of our top available installment units:"
                : "نوفر في **فاميلي هوم** باقة مميزة من أفضل الشقق والوحدات السكنية بأنظمة تقسيط مريحة تناسب ميزانيتك وبدون فوائد بنكية:\n\n• **المقدم:** يبدأ من 10% إلى 15% فقط.\n• **فترة السداد:** تمتد من 6 إلى 8 سنوات وتصل حتى 10 سنوات بأقساط متساوية.\n• **الاستلام:** خيارات متنوعة تشمل الاستلام الفوري، أو خلال 1 إلى 3 سنوات.\n\nإليك باقة من أبرز الوحدات المتاحة للتقسيط حالياً:";

            return [
                'reply' => $reply,
                'recommended_units' => $unitCards,
                'quick_replies' => $locale === 'en'
                    ? ['Featured projects', 'Best investment areas', 'Contact via WhatsApp']
                    : ['المشاريع المميزة', 'أفضل مناطق الاستثمار', 'تواصل عبر واتساب'],
                'is_fallback' => true,
            ];
        }

        // 3. Investment Opportunities & Growth Areas
        if (preg_match('/(مناطق ليها مستقبل استثماري|مناطق لها مستقبل استثماري|مستقبل استثماري|أفضل مناطق الاستثمار|افضل مناطق الاستثمار|أفضل استثمار|افضل استثمار|استثمار عقاري|عائد استثماري|فرص الاستثمار|أعلى عائد|اعلى عائد|شقق لقطة|شقق لقطه|best investment|best areas to invest|high roi)/iu', $cleanMsg)) {
            $activeUnits = $this->catalogService->listUnits([], 4, $locale);
            $unitCards = array_map(fn($u) => $u->toCardPayload(), $activeUnits);

            $reply = $locale === 'en'
                ? "Egypt's real estate market offers exceptional capital growth, with the highest-yield opportunities concentrated in 4 strategic destinations:\n\n1. **New Cairo (Fifth Settlement & Golden Square):** High market liquidity, steady rental demand, and annual capital appreciation of 20% to 30%.\n2. **New Administrative Capital:** The future administrative hub and corporate headquarters offering massive capital upside upon full operation.\n3. **Sheikh Zayed & New Zayed:** Upscale, master-planned residential communities with sustained appreciation and high executive demand.\n4. **North Coast (Ras El Hekma & Sidi Heneish):** World-class international tourism destination delivering exceptional seasonal rental yields in foreign currencies.\n\nHere are selected top property opportunities available in our catalog:"
                : "سوق العقارات في مصر يشهد طفرة نمو قوية، وتتركز أفضل الفرص الاستثمارية ذات العائد المرتفع في 4 وجهات رئيسية:\n\n1. **القاهرة الجديدة (التجمع الخامس وجولدن سكوير):** المنطقة الأكثر طلباً وسرعة في إعادة البيع والإيجار، بعائد رأسمالي سنوي يتراوح بين 20% و30%.\n2. **العاصمة الإدارية الجديدة:** المركز المستقبلي للشركات العالمية والمقرات الحكومية، وتمنحك أعلى زيادة رأسمالية حتى تاريخ التشغيل الكامل للمقرات.\n3. **الشيخ زايد وتوسعاتها (زايد الجديدة):** مجتمعات عمرانية راقية متكاملة الخدمات مع طلب قوي ومستمر من الصفوة والعائلات.\n4. **الساحل الشمالي (رأس الحكمة وسيدي حنيش):** وجهة سياحية واستثمارية عالمية تحقق عوائد إيجارية سياحية قياسية بالعملة الصعبة.\n\nإليك نخبة من أفضل الوحدات المعروضة لدينا حالياً:";

            return [
                'reply' => $reply,
                'recommended_units' => $unitCards,
                'quick_replies' => $locale === 'en'
                    ? ['Featured projects', 'Apartments for sale', 'Contact via WhatsApp']
                    : ['المشاريع المميزة', 'شقق للبيع بالتقسيط', 'تواصل عبر واتساب'],
                'is_fallback' => true,
            ];
        }

        // 4. Cash vs Installments inquiry
        if (preg_match('/(كاش ولا تقسيط|كاش ولا قسط|اشتري كاش ولا قسط|خصم الكاش|أيهما أفضل كاش ولا تقسيط|انهي افضل كاش ولا تقسيط|cash vs installment)/iu', $cleanMsg)) {
            $reply = $locale === 'en'
                ? "A smart financial decision! The best route depends on your cash flow and investment horizon:\n\n• **Cash Purchase:** Gives you an immediate discount of **20% to 35%** off total property value. Excellent if you have surplus liquid capital and want immediate rental yield or instant handover.\n• **Installment Purchase:** Serves as the ultimate hedge against currency inflation; you pay fixed nominal installments over 6–10 years while property asset value compounds rapidly.\n\nLet me know your target budget or monthly capacity to guide you to the perfect unit!"
                : "سؤال مالي واستثماري ممتاز! الاختيار الأنسب يعتمد على طبيعة سيولتك المالية:\n\n• **الشراء كاش (Cash):** يمنحك خصماً فورياً هائلاً يتراوح بين **20% إلى 35%** من إجمالي سعر العقار، وهو الخيار الأمثل إذا كانت لديك سيولة فائضة تبحث عن تجميدها في أصل جاهز للتأجير أو السكن الفوري.\n• **الشراء بالتقسيط (Installment):** أفضل وسيلة للتحوط ضد التضخم؛ حيث تدفع أقساطاً ثابتة على مدى 6 إلى 10 سنوات بقيمة نقدية تقل مع الوقت، بينما ترتفع القيمة السوقية للعقار بمعدلات قياسية.\n\nإذا كان لديك ميزانية محددة للكاش أو المقدم الشهري، أخبرني لأقترح لك أنسب الخيارات!";

            return [
                'reply' => $reply,
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Apartments for sale', 'Featured projects', 'Contact via WhatsApp']
                    : ['شقق للبيع بالتقسيط', 'المشاريع المميزة', 'تواصل عبر واتساب'],
                'is_fallback' => true,
            ];
        }

        // 5. Greetings & Small talk
        if (preg_match('/^(سلام|السلام عليكم|سلام عليكم|مرحبا|مرحب|أهلا|اهلا|أهلاً|صباح الخير|مساء الخير|ازيك|عامل ايه|شخبارك|كيف حالك|مين انت|hello|hi|hey|who are you)/iu', $cleanMsg)) {
            $reply = $locale === 'en'
                ? "Hello and welcome to **Family Home**! 🤝\n\nI am **Hossam**, your real estate advisor. Whether you are searching for your dream residence or a high-ROI investment, I am here to provide transparent guidance, financial breakdown, and our finest deals across Egypt.\n\nHow can I help you today?"
                : "أهلاً ومرحباً بك في **فاميلي هوم**! 🤝\n\nأنا «حسام»، مستشارك العقاري والاستثماري. سواء كنت تبحث عن بيت أحلامك أو فرصة استثمارية ذكية، أنا هنا لمساعدتك بنصيحة صادقة وتحليل مالي دقيق لأفضل العروض والمشاريع المتاحة بدون عمولة شراء.\n\nكيف أقدر أساعدك اليوم؟";

            return [
                'reply' => $reply,
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Featured projects', 'Apartments for sale', 'Best investment areas', 'Contact via WhatsApp']
                    : ['المشاريع المميزة', 'شقق للبيع بالتقسيط', 'أفضل مناطق الاستثمار', 'تواصل عبر واتساب'],
                'is_fallback' => true,
            ];
        }

        // 6. Specific Project Inquiry (Check if user is asking about a project by name or slug)
        $activeProjects = $this->catalogService->listProjects(10, $locale);
        $projectFound = null;

        foreach ($activeProjects as $proj) {
            $projNameLower = mb_strtolower($proj->name);
            $projSlugLower = mb_strtolower($proj->slug);

            if (str_contains($lowerMsg, $projNameLower) || str_contains($lowerMsg, $projSlugLower)) {
                $projectFound = $proj;
                break;
            }
        }

        if ($projectFound) {
            $pagination = $this->catalogService->listUnitsForProject($projectFound->slug, [], 1, 6, $locale);
            $units = $pagination->toCardPayload();

            $reply = $locale === 'en'
                ? "Here are the active units available in project **{$projectFound->name}** (Page 1 of {$pagination->lastPage}, Total: {$pagination->total} units):"
                : "إليك الوحدات النشطة المتاحة في مشروع **{$projectFound->name}** (الصفحة 1 من {$pagination->lastPage}، بإجمالي {$pagination->total} وحدة):";

            if ($pagination->total === 0) {
                $reply = $locale === 'en'
                    ? "Currently, there are no active units listed under project **{$projectFound->name}**. Feel free to explore our other projects!"
                    : "لا توجد وحدات نشطة معروضة حالياً ضمن مشروع **{$projectFound->name}**. يمكنك استعراض باقي المشاريع المتاحة لدينا!";
            }

            return [
                'reply' => $reply,
                'recommended_units' => $units,
                'quick_replies' => $this->buildQuickReplies($locale, !empty($units)),
                'is_fallback' => true,
            ];
        }

        // 7. Featured Projects Inquiry
        if (preg_match('/(المشاريع المميزة|المشاريع المميزه|المشاريع المتاحة|المشاريع المتاحه|استعراض المشاريع|مشاريعكم|المشاريع|featured projects|top projects|available projects)/iu', $cleanMsg)) {
            if (!empty($activeProjects)) {
                $itemsList = [];
                foreach (array_slice($activeProjects, 0, 5) as $p) {
                    $details = [];
                    if ($p->locationAddress) $details[] = $p->locationAddress;
                    if ($p->installmentYears) $details[] = ($locale === 'en' ? "Installments up to {$p->installmentYears} yrs" : "تقسيط حتى {$p->installmentYears} سنوات");
                    if ($p->downPayment) $details[] = ($locale === 'en' ? "Down payment from {$p->downPayment}%" : "مقدم {$p->downPayment}%");
                    $detailStr = !empty($details) ? ' (' . implode('، ', $details) . ')' : '';
                    $itemsList[] = "• **{$p->name}**{$detailStr}";
                }

                $reply = $locale === 'en'
                    ? "Here are the premier real estate projects available at **Family Home**:\n\n" . implode("\n", $itemsList) . "\n\nWhich project would you like to explore its available units and pricing?"
                    : "إليك أبرز المشاريع العقارية الرائدة المتاحة حالياً لدى **فاميلي هوم**:\n\n" . implode("\n", $itemsList) . "\n\nعن أي مشروع تود معرفة تفاصيل وحداته وأسعاره؟";

                $featuredUnits = $this->catalogService->listUnits([], 4, $locale);
                $unitCards = array_map(fn($u) => $u->toCardPayload(), $featuredUnits);

                return [
                    'reply' => $reply,
                    'recommended_units' => $unitCards,
                    'quick_replies' => $locale === 'en'
                        ? ['Apartments for sale', 'Best investment areas', 'Contact via WhatsApp']
                        : ['شقق للبيع بالتقسيط', 'أفضل مناطق الاستثمار', 'تواصل عبر واتساب'],
                    'is_fallback' => true,
                ];
            }
        }

        // 8. General search by unit keyword & budget (e.g. "عايز شقه تكون كبيره بسعر 10 مليون")
        if (preg_match('/(فيلا|فيلات|فلل|شقة|شقه|شقق|دوبلكس|بنتهاوس|استوديو|ستوديو|مكتب|مكاتب|محل|محلات|وحدة|وحدات|التجمع|زايد|العاصمة|الساحل|مدينة نصر|سعر|بسعر|بمبلغ|ميزانية|ميزانيه|مليون|ملايين|كبيره|كبيرة|واسعه|واسعة|villa|apartment|apt|studio|office|shop|budget|price)/iu', $cleanMsg)) {
            $filters = [];
            $maxPrice = null;
            $minPrice = null;

            // Extract budget in Millions
            if (preg_match('/(\d+(?:\.\d+)?)\s*(?:مليون|ملايين|م)/iu', $cleanMsg, $m)) {
                $val = (float) $m[1] * 1000000;
                if (preg_match('/(أكثر من|اكثر من|فوق|أعلى من|اعلى من|above|more than)/iu', $cleanMsg)) {
                    $minPrice = $val;
                } else {
                    $maxPrice = $val;
                }
            } elseif (preg_match('/(\d+(?:\.\d+)?)\s*(?:ألف|الف|k)/iu', $cleanMsg, $m)) {
                $val = (float) $m[1] * 1000;
                if (preg_match('/(أكثر من|اكثر من|فوق|أعلى من|اعلى من|above|more than)/iu', $cleanMsg)) {
                    $minPrice = $val;
                } else {
                    $maxPrice = $val;
                }
            } elseif (preg_match('/(?:بسعر|سعر|بـ|بمبلغ|حدود|ميزانية|ميزانيه)\s*(\d{5,})/iu', $cleanMsg, $m)) {
                $maxPrice = (float) $m[1];
            }

            if ($maxPrice !== null) {
                $filters['max_price'] = $maxPrice;
                $filters['sort'] = 'price_desc';
            }
            if ($minPrice !== null) {
                $filters['min_price'] = $minPrice;
                $filters['sort'] = 'price_asc';
            }

            // Room requirements (e.g. "كبيرة", "3 غرف")
            if (preg_match('/(كبيره|كبيرة|واسعه|واسعة|large|spacious)/iu', $cleanMsg)) {
                $filters['rooms'] = 3;
            } elseif (preg_match('/(\d+)\s*(?:غرف|غرفة|غرفه|rooms)/iu', $cleanMsg, $rm)) {
                $filters['rooms'] = (int) $rm[1];
            }

            // Detect rent vs sale
            if (preg_match('/(إيجار|ايجار|للايجار|للإيجار|rent)/iu', $cleanMsg)) {
                $filters['transaction'] = 'rent';
            }

            $matchedUnits = $this->catalogService->listUnits($filters, 4, $locale);
            if (empty($matchedUnits) && isset($filters['rooms'])) {
                // If no exact match with room count, broaden by price
                unset($filters['rooms']);
                $matchedUnits = $this->catalogService->listUnits($filters, 4, $locale);
            }
            if (empty($matchedUnits) && ($maxPrice !== null || $minPrice !== null)) {
                $matchedUnits = $this->catalogService->listUnits([], 4, $locale);
            }

            if (!empty($matchedUnits)) {
                $unitCards = array_map(fn($u) => $u->toCardPayload(), $matchedUnits);

                if ($maxPrice !== null) {
                    $formattedPrice = number_format($maxPrice, 0, '.', ',');
                    $reply = $locale === 'en'
                        ? "Here are our finest available properties within your budget of **{$formattedPrice} EGP**:"
                        : "إليك أفضل الشقق والوحدات العقارية المتاحة لدينا في حدود ميزانية **{$formattedPrice} ج.م** (مرتبة من الأعلى قيمة):";
                } elseif ($minPrice !== null) {
                    $formattedPrice = number_format($minPrice, 0, '.', ',');
                    $reply = $locale === 'en'
                        ? "Here are properties starting from **{$formattedPrice} EGP**:"
                        : "إليك أفضل العقارات المتاحة بدءاً من **{$formattedPrice} ج.م** فما فوق:";
                } else {
                    $reply = $locale === 'en'
                        ? "Based on your search, here are top matching properties available in our portfolio:"
                        : "بناءً على طلبك، إليك مجموعة من أفضل الوحدات العقارية المتاحة لدينا:";
                }

                return [
                    'reply' => $reply,
                    'recommended_units' => $unitCards,
                    'quick_replies' => $this->buildQuickReplies($locale, true),
                    'is_fallback' => true,
                ];
            }
        }

        // 9. Intelligent General Fallback
        if (!empty($activeProjects)) {
            $projectNames = implode('، ', array_map(fn($p) => $p->name, array_slice($activeProjects, 0, 4)));
            $reply = $locale === 'en'
                ? "I am here to guide your property search at **Family Home**! You can ask me about:\n\n• **Featured Projects:** Such as {$projectNames}\n• **Installment Properties:** Plans extending up to 10 years without bank interest\n• **High-ROI Investment Areas:** New Cairo, Sheikh Zayed, and New Capital\n• **Project Units:** e.g., 'What units belong to project X?'\n\nWhat would you like to explore?"
                : "أنا هنا لمساعدتك في استكشاف أفضل الفرص العقارية لدى **فاميلي هوم**! يمكنك سؤالي عن:\n\n• **المشاريع المتميزة:** مثل {$projectNames}\n• **شقق بالتقسيط:** بأنظمة سداد تصل حتى 10 سنوات بدون فوائد\n• **أفضل مناطق الاستثمار:** في التجمع الخامس، الشيخ زايد، والعاصمة الإدارية\n• **وحدات مشروع معين:** مثل «ما الوحدات التابعة لمشروع X؟»\n\nعن أي منها تود الاستفسار؟";

            return [
                'reply' => $reply,
                'recommended_units' => $preloadedUnits,
                'quick_replies' => $this->buildQuickReplies($locale, !empty($preloadedUnits)),
                'is_fallback' => true,
            ];
        }

        return $this->getSafeFallbackResponse($locale);
    }

    /**
     * Safely inject markdown links for recognized unit names and slugs.
     */
    private function injectUnitLinks(string $text, array $cards, string $locale): string
    {
        if (empty($cards)) {
            return $text;
        }

        foreach ($cards as $card) {
            $name = (string) ($card['name'] ?? '');
            $url = (string) ($card['url'] ?? '');

            if (empty($name) || empty($url) || mb_strlen($name) < 3) {
                continue;
            }

            if (str_contains($text, "({$url})")) {
                continue;
            }

            $escaped = preg_quote($name, '/');
            // If the name is bolded like **Name**, turn it into link
            if (preg_match('/\*\*' . $escaped . '\*\*/u', $text)) {
                $text = preg_replace('/\*\*' . $escaped . '\*\*/u', "[{$name}]({$url})", $text, 1);
            }
        }

        return $text;
    }

    private function getSafeFallbackResponse(string $locale): array
    {
        return [
            'success' => true,
            'is_fallback' => true,
            'reply' => $locale === 'en'
                ? 'Hello! I am Hossam from Family Home. Would you like to explore our active projects or check available units?'
                : 'أهلاً بك! أنا «حسام» من فاميلي هوم. تحب أساعدك في استعراض أحدث المشاريع العقارية أو الوحدات المتاحة للبيع والإيجار؟',
            'recommended_units' => [],
            'quick_replies' => $locale === 'en'
                ? ['Show available projects', 'Apartments for sale', 'Contact our team']
                : ['استعراض المشاريع المتاحة', 'شقق للبيع بالتقسيط', 'تواصل مع فريق المبيعات'],
        ];
    }

    private function buildQuickReplies(string $locale, bool $hasUnits): array
    {
        if ($locale === 'en') {
            return $hasUnits
                ? ['More units in this project', 'Installment options', 'Book a viewing']
                : ['Featured projects', 'Apartments for sale', 'Contact via WhatsApp'];
        }

        return $hasUnits
            ? ['وحدات أخرى في المشروع', 'أنظمة السداد والتقسيط', 'حجز موعد معاينة']
            : ['المشاريع المميزة', 'شقق للبيع بالتقسيط', 'تواصل عبر واتساب'];
    }

    /**
     * Normalize and enrich client-supplied page context (URL, pathname, title, project, unit).
     */
    private function normalizePageContext(array $pageContext, string $locale): array
    {
        $normalized = [
            'url' => (string) ($pageContext['url'] ?? ''),
            'pathname' => (string) ($pageContext['pathname'] ?? ''),
            'title' => (string) ($pageContext['title'] ?? ''),
            'project_id' => $pageContext['project_id'] ?? null,
            'project_name' => $pageContext['project_name'] ?? null,
            'project_slug' => $pageContext['project_slug'] ?? null,
            'unit_id' => $pageContext['unit_id'] ?? null,
            'unit_name' => $pageContext['unit_name'] ?? null,
            'unit_slug' => $pageContext['unit_slug'] ?? null,
            'unit_price' => $pageContext['unit_price'] ?? null,
            'unit_rooms' => $pageContext['unit_rooms'] ?? null,
            'area_name' => $pageContext['area_name'] ?? null,
            'agent_name' => $pageContext['agent_name'] ?? null,
            'agent_phone' => $pageContext['agent_phone'] ?? null,
            'agent_whatsapp' => $pageContext['agent_whatsapp'] ?? null,
            'page_type' => $pageContext['page_type'] ?? 'unknown',
            'summary' => null,
        ];

        $rawUrl = $normalized['url'] ?: $normalized['pathname'];
        $path = (string) (parse_url($rawUrl, PHP_URL_PATH) ?? $normalized['pathname']);

        // Infer project slug from URL path if missing
        if (empty($normalized['project_slug']) && preg_match('~/(?:ar|en)?/?projects/([^/?#]+)~i', $path, $m)) {
            $candidate = urldecode($m[1]);
            if ($candidate !== 'projects') {
                $normalized['project_slug'] = $candidate;
            }
        }

        // Infer unit slug from URL path if missing
        if (empty($normalized['unit_slug']) && preg_match('~/(?:ar|en)?/?units/([^/?#]+)~i', $path, $m)) {
            $candidate = urldecode($m[1]);
            if ($candidate !== 'deals' && $candidate !== 'units') {
                $normalized['unit_slug'] = $candidate;
            }
        }

        // If project_slug is resolved, fetch project details
        if (!empty($normalized['project_slug'])) {
            $normalized['page_type'] = 'project';
            try {
                $projectDto = $this->catalogService->findProject($normalized['project_slug'], $locale);
                if ($projectDto) {
                    $normalized['summary'] = [
                        'name' => $projectDto->name,
                        'location' => $projectDto->locationAddress,
                        'installment_years' => $projectDto->installmentYears,
                        'down_payment' => $projectDto->downPayment,
                        'agent_name' => $projectDto->agentName,
                        'agent_phone' => $projectDto->agentPhone,
                        'agent_whatsapp' => $projectDto->agentWhatsapp,
                    ];
                    if (empty($normalized['project_name'])) {
                        $normalized['project_name'] = $projectDto->name;
                    }
                    $normalized['agent_name'] = $projectDto->agentName;
                    $normalized['agent_phone'] = $projectDto->agentPhone;
                    $normalized['agent_whatsapp'] = $projectDto->agentWhatsapp;
                }
            } catch (\Throwable $e) {
                // Ignore DB error
            }
        } elseif (!empty($normalized['unit_slug'])) {
            $normalized['page_type'] = 'unit';
            try {
                $unitDto = $this->catalogService->findUnit($normalized['unit_slug'], $locale);
                if ($unitDto) {
                    if (empty($normalized['unit_name'])) {
                        $normalized['unit_name'] = $unitDto->name;
                    }
                    if (empty($normalized['unit_price'])) {
                        $normalized['unit_price'] = $unitDto->price;
                    }
                    if (empty($normalized['unit_rooms'])) {
                        $normalized['unit_rooms'] = $unitDto->rooms;
                    }
                    $normalized['agent_name'] = $unitDto->agentName;
                    $normalized['agent_phone'] = $unitDto->agentPhone;
                    $normalized['agent_whatsapp'] = $unitDto->agentWhatsapp;
                    $normalized['whatsapp_url'] = $unitDto->whatsappUrl;
                }
            } catch (\Throwable $e) {
                // Ignore DB error
            }
        } elseif (str_contains($path, '/units/deals')) {
            $normalized['page_type'] = 'deals';
        } elseif (preg_match('~/(?:ar|en)?/?units/?$~i', $path)) {
            $normalized['page_type'] = 'units_catalog';
        } elseif (preg_match('~/(?:ar|en)?/?projects/?$~i', $path)) {
            $normalized['page_type'] = 'projects_catalog';
        } elseif (str_contains($path, '/about')) {
            $normalized['page_type'] = 'about';
        } elseif (str_contains($path, '/contact')) {
            $normalized['page_type'] = 'contact';
        } elseif (str_contains($path, '/compare')) {
            $normalized['page_type'] = 'compare';
        } elseif ($path === '/' || $path === '/ar' || $path === '/en' || empty($path)) {
            $normalized['page_type'] = 'home';
        }

        return $normalized;
    }
}

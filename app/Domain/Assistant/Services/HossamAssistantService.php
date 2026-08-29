<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HossamAssistantService
{
    private string $apiKey;
    private string $model;
    private string $fallbackModel;
    private string $baseUrl;

    public function __construct(
        private \App\Domain\Listings\Services\SettingsService $settingsService
    ) {
        $this->apiKey = (string) config('services.openrouter.api_key', env('OPENROUTER_API_KEY', ''));
        $this->model = (string) config('services.openrouter.model', env('OPENROUTER_MODEL', 'openrouter/free'));
        $this->fallbackModel = (string) config('services.openrouter.fallback_model', env('OPENROUTER_FALLBACK_MODEL', 'openrouter/free'));
        $this->baseUrl = rtrim((string) config('services.openrouter.base_url', env('OPENROUTER_BASE_URL', 'https://openrouter.ai/api/v1')), '/');
    }

    /**
     * Process a chat turn with Hossam: searches DB for matching inventory & queries LLM.
     *
     * @param  string  $message
     * @param  array  $history
     * @param  string  $locale
     * @return array{reply: string, recommended_units: array}
     */
    public function chat(string $message, array $history = [], string $locale = 'ar'): array
    {
        // 1. Search database for relevant active listings based on query keywords
        $searchResult = $this->searchRelevantUnits($message, $locale);
        $matchingUnits = $searchResult['units'];
        $hasSpecificConstraints = $searchResult['has_constraints'];

        // 2. Build system instructions & inventory context
        $systemPrompt = $this->buildSystemPrompt($matchingUnits, $locale);

        // 3. Format message history for OpenRouter
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        // Append past history (limited to last 15 turns for richer context)
        $trimmedHistory = array_slice($history, -15);
        foreach ($trimmedHistory as $turn) {
            if (isset($turn['role'], $turn['content']) && in_array($turn['role'], ['user', 'assistant'])) {
                $messages[] = [
                    'role' => $turn['role'],
                    'content' => (string) $turn['content'],
                ];
            }
        }

        // Add current user message
        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        // 4. Request completion from OpenRouter — openrouter/free first
        $candidateModels = array_values(array_unique(array_filter([
            $this->model,
            'openrouter/free',
            'meta-llama/llama-3.3-70b-instruct:free',
            'qwen/qwen3-8b:free',
            'google/gemma-3-27b-it:free',
            $this->fallbackModel,
        ])));

        $reply = null;
        foreach ($candidateModels as $candidate) {
            $reply = $this->callOpenRouter($messages, $candidate);
            if (! empty($reply)) {
                break;
            }
        }

        // 4b. Smart fallback: if AI failed but we have DB results, build a helpful template reply
        if (empty($reply)) {
            $reply = $this->buildSmartFallback($matchingUnits, $message, $locale);
        }

        // 5. Context-driven Property Cards Display
        // Show cards ONLY if the LLM explicitly tagged [SHOW_CARDS] or if the user explicitly asked to see/view/send listings/links
        $userExplicitlyWantsCards = (bool) preg_match('/(وريني|ابعتلي|عرض|شوف|عايز اشوف|عايز|لينك|لينكات|رابط|روابط|كروت|عقارات|شقق|شقه|فلل|فلا|فله|فيلا|وحدات|مشاريع|صور|تفاصيل|ميزانية|اسعار|أسعار|كام السعر|قسط|مقدم|عايز اشتري|عايز احجز|رشحلي|اقتراح|show me|send me|listings|properties|apartments|villas|units|projects|price|budget|recommend|suggest|available|options)/iu', $message);

        $shouldShowCards = false;
        if (str_contains($reply, '[SHOW_CARDS]')) {
            $shouldShowCards = true;
            $reply = trim(str_replace(['[SHOW_CARDS]', '[show_cards]'], '', $reply));
        } elseif ($hasSpecificConstraints && $userExplicitlyWantsCards && ! empty($matchingUnits)) {
            $shouldShowCards = true;
        }

        $recommendedCards = ($shouldShowCards && ! empty($matchingUnits))
            ? $this->formatUnitCards($matchingUnits, $locale)
            : [];

        // 6. Auto-linkify unit & project names mentioned in the reply
        $reply = $this->injectUnitLinks($reply, $matchingUnits, $locale);

        return [
            'reply' => $reply,
            'recommended_units' => $recommendedCards,
        ];
    }

    /**
     * Search database for units matching user request.
     */
    /**
     * Search database for units matching user request with smart parametric extraction.
     */
    private function searchRelevantUnits(string $message, string $locale): array
    {
        try {
            // Normalize Arabic digits (٠-٩) to English digits
            $eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            $western = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            $normalizedMessage = str_replace($eastern, $western, $message);
            $lowerMessage = mb_strtolower($normalizedMessage, 'UTF-8');

            $query = Unit::query()
                ->where('is_active', true)
                ->with(['area', 'type', 'images', 'user', 'project']);

            $hasSpecificConstraints = false;

            // 1. Smart Price Extraction
            $toValue = function ($numStr, $isMillion, $isThousand) {
                $val = (float) str_replace([',', ' '], '', $numStr);
                if ($isMillion) return $val * 1000000;
                if ($isThousand) return $val * 1000;
                if ($val < 100) return $val * 1000000; // e.g. "5" in "اقل من 5" means 5 million
                return $val;
            };

            // Range: "بين X و Y" / "من X إلى Y"
            if (preg_match('/(?:بين|من)\s*(\d+(?:\.\d+)?)\s*(مليون|الف|ألف)?\s*(?:و|إلى|الي|لـ|ل)\s*(\d+(?:\.\d+)?)\s*(مليون|الف|ألف)?/u', $lowerMessage, $m)) {
                $isMil1 = ! empty($m[2]) && mb_strpos($m[2], 'مليون') !== false;
                $isMil2 = (! empty($m[4]) && mb_strpos($m[4], 'مليون') !== false) || $isMil1;
                $minPrice = $toValue($m[1], $isMil1 || $isMil2, false);
                $maxPrice = $toValue($m[3], $isMil2, false);
                $query->whereBetween('price', [$minPrice, $maxPrice]);
                $hasSpecificConstraints = true;
            }
            // Max Price: "أقل من X" / "تحت X" / "حد أقصى X" / "مش أكتر من X"
            elseif (preg_match('/(?:أقل\s*من|اقل\s*من|تحت|حد\s*أقصى|حد\s*اقصى|مش\s*أكتر\s*من|مش\s*اكتر\s*من|اقل|أقل|max|under|below|less\s*than)\s*(\d+(?:\.\d+)?)\s*(مليون|الف|ألف|k|m)?/u', $lowerMessage, $m)) {
                $isMil = (! empty($m[2]) && (mb_strpos($m[2], 'مليون') !== false || mb_strpos($m[2], 'm') !== false)) || (float) $m[1] < 100;
                $isK = ! empty($m[2]) && (mb_strpos($m[2], 'الف') !== false || mb_strpos($m[2], 'ألف') !== false || mb_strpos($m[2], 'k') !== false);
                $maxPrice = $toValue($m[1], $isMil, $isK);
                $query->where('price', '<=', $maxPrice);
                $hasSpecificConstraints = true;
            }
            // Min Price: "أكثر من X" / "اكتر من X" / "فوق X" / "حد أدنى X"
            elseif (preg_match('/(?:أكثر\s*من|اكتر\s*من|فوق|حد\s*أدنى|حد\s*ادنى|أزيد\s*من|ازيد\s*من|more\s*than|above|min)\s*(\d+(?:\.\d+)?)\s*(مليون|الف|ألف|k|m)?/u', $lowerMessage, $m)) {
                $isMil = (! empty($m[2]) && (mb_strpos($m[2], 'مليون') !== false || mb_strpos($m[2], 'm') !== false)) || (float) $m[1] < 100;
                $isK = ! empty($m[2]) && (mb_strpos($m[2], 'الف') !== false || mb_strpos($m[2], 'ألف') !== false || mb_strpos($m[2], 'k') !== false);
                $minPrice = $toValue($m[1], $isMil, $isK);
                $query->where('price', '>=', $minPrice);
                $hasSpecificConstraints = true;
            }
            // Target Budget: "ميزانية X" / "معايا X" / "في حدود X" / "بسعر X"
            elseif (preg_match('/(?:ميزانية|ميزانيتي|معايا|معي|بميزانية|في\s*حدود|سعر|بـ|بحوالي|حوالي|budget)\s*(\d+(?:\.\d+)?)\s*(مليون|الف|ألف|k|m)?/u', $lowerMessage, $m)) {
                $isMil = (! empty($m[2]) && (mb_strpos($m[2], 'مليون') !== false || mb_strpos($m[2], 'm') !== false)) || (float) $m[1] < 100;
                $isK = ! empty($m[2]) && (mb_strpos($m[2], 'الف') !== false || mb_strpos($m[2], 'ألف') !== false || mb_strpos($m[2], 'k') !== false);
                $targetVal = $toValue($m[1], $isMil, $isK);
                $query->whereBetween('price', [$targetVal * 0.7, $targetVal * 1.25]);
                $hasSpecificConstraints = true;
            }

            // 2. Property Subtype Extraction — with common typos and colloquial Arabic
            $subtypeKeywords = [
                'شقة' => ['شقة', 'شقه', 'شأة', 'شأه', 'شقق', 'apartment', 'flat'],
                'فيلا' => ['فيلا', 'فلا', 'فله', 'فيلات', 'فلل', 'villa', 'villas'],
                'شاليه' => ['شاليه', 'شالية', 'شاليهات', 'chalet'],
                'دوبلكس' => ['دوبلكس', 'دوبلكس', 'duplex'],
                'استوديو' => ['استوديو', 'استديو', 'ستوديو', 'studio'],
                'مكتب' => ['مكتب', 'مكاتب', 'office', 'إداري', 'اداري'],
                'محل' => ['محل', 'محلات', 'تجاري', 'shop', 'commercial'],
                'تاون هاوس' => ['تاون هاوس', 'تاون', 'توين هاوس', 'توين', 'townhouse', 'twin house'],
                'بنتهاوس' => ['بنتهاوس', 'بنت هاوس', 'penthouse'],
            ];

            foreach ($subtypeKeywords as $key => $keywords) {
                foreach ($keywords as $kw) {
                    if (mb_stripos($lowerMessage, $kw) !== false) {
                        $query->where(function ($q) use ($keywords) {
                            foreach ($keywords as $w) {
                                $q->orWhere('name', 'LIKE', "%{$w}%")
                                  ->orWhere('description_ar', 'LIKE', "%{$w}%")
                                  ->orWhere('description_en', 'LIKE', "%{$w}%");
                            }
                        });
                        $hasSpecificConstraints = true;
                        break 2;
                    }
                }
            }

            // 3. Area Extraction
            $areas = Area::select('id', 'name_ar', 'name_en', 'slug')->get();
            $matchedAreaId = null;
            foreach ($areas as $area) {
                if (($area->name_ar && mb_stripos($lowerMessage, $area->name_ar) !== false) ||
                    ($area->name_en && mb_stripos($lowerMessage, $area->name_en) !== false) ||
                    ($area->slug && mb_stripos($lowerMessage, $area->slug) !== false)) {
                    $matchedAreaId = $area->id;
                    break;
                }
            }
            if (! $matchedAreaId) {
                if (preg_match('/(تجمع|التجمع|new cairo|fifth settlement)/iu', $lowerMessage)) {
                    $matchedArea = $areas->first(fn ($a) => mb_stripos($a->name_ar, 'تجمع') !== false || mb_stripos($a->name_en, 'cairo') !== false);
                    $matchedAreaId = $matchedArea?->id;
                } elseif (preg_match('/(زايد|الشيخ زايد|zayed)/iu', $lowerMessage)) {
                    $matchedArea = $areas->first(fn ($a) => mb_stripos($a->name_ar, 'زايد') !== false || mb_stripos($a->name_en, 'zayed') !== false);
                    $matchedAreaId = $matchedArea?->id;
                } elseif (preg_match('/(ساحل|الساحل|north coast)/iu', $lowerMessage)) {
                    $matchedArea = $areas->first(fn ($a) => mb_stripos($a->name_ar, 'ساحل') !== false || mb_stripos($a->name_en, 'coast') !== false);
                    $matchedAreaId = $matchedArea?->id;
                }
            }
            if ($matchedAreaId) {
                $query->where('area_id', $matchedAreaId);
                $hasSpecificConstraints = true;
            }

            // 4. Rooms Extraction
            if (preg_match('/(\d+)\s*(?:غرف|غرفة|غرفه|نوم|rooms|bedrooms)/iu', $lowerMessage, $rm)) {
                $query->where('rooms', (int) $rm[1]);
                $hasSpecificConstraints = true;
            } elseif (preg_match('/(غرفتين|2 غرف)/iu', $lowerMessage)) {
                $query->where('rooms', 2);
                $hasSpecificConstraints = true;
            } elseif (preg_match('/(غرفة واحدة|غرفه واحده|1 غرفة)/iu', $lowerMessage)) {
                $query->where('rooms', 1);
                $hasSpecificConstraints = true;
            }

            // 5. Transaction & Payment
            if (preg_match('/(إيجار|ايجار|أجر|rent|rental)/iu', $lowerMessage)) {
                $query->where('transaction', 'rent');
                $hasSpecificConstraints = true;
            } elseif (preg_match('/(بيع|شراء|اشتري|تمليك|sale|buy)/iu', $lowerMessage) || ! empty($maxPrice) || ! empty($minPrice)) {
                $query->where('transaction', 'sale');
            }

            if (preg_match('/(تقسيط|قسط|مقدم|installment)/iu', $lowerMessage)) {
                $query->whereIn('payment_method', ['installment', 'both']);
                $hasSpecificConstraints = true;
            } elseif (preg_match('/(كاش|نقدي|cash)/iu', $lowerMessage)) {
                $query->whereIn('payment_method', ['cash', 'both']);
                $hasSpecificConstraints = true;
            }

            // Order by priority & return results
            $units = $query->orderByDesc('is_pinned')
                ->orderByDesc('priority_points')
                ->orderByDesc('created_at')
                ->take(4)
                ->get();

            // Always ensure we have at least 3-4 top active listings to recommend
            if ($units->count() < 3) {
                $fallback = Unit::query()
                    ->where('is_active', true)
                    ->with(['area', 'type', 'images', 'user', 'project'])
                    ->orderByDesc('is_deal')
                    ->orderByDesc('is_pinned')
                    ->orderByDesc('priority_points')
                    ->orderByDesc('created_at')
                    ->take(4)
                    ->get();
                $units = $units->merge($fallback)->unique('id')->take(4);
            }

            return [
                'units' => $units->all(),
                'has_constraints' => $hasSpecificConstraints,
            ];
        } catch (\Throwable $e) {
            Log::warning('HossamAssistant: DB search error', ['error' => $e->getMessage()]);

            return [
                'units' => [],
                'has_constraints' => false,
            ];
        }
    }

    /**
     * Build high-IQ bilingual system prompt defining Hossam's persona as a top-tier Consultative Merchant & Sales Advisor.
     * The entire prompt is generated in the user's language (Arabic or English).
     */
    private function buildSystemPrompt(array $units, string $locale): string
    {
        $currency = config('app.currency', 'EGP');
        $companyPhone = $this->settingsService->get('phone', '');
        $companyWhatsapp = $this->settingsService->get('company_whatsapp', '');
        $companyContact = $companyWhatsapp ?: $companyPhone;

        if ($locale === 'en') {
            return $this->buildEnglishPrompt($units, $currency, $locale, $companyContact);
        }

        return $this->buildArabicPrompt($units, $currency, $locale, $companyContact);
    }

    /**
     * Build English system prompt — optimized for high conversion & consultative selling.
     */
    private function buildEnglishPrompt(array $units, string $currency, string $locale, string $companyContact): string
    {
        $inventoryText = $this->formatInventoryText($units, $currency, $locale);
        $contactContext = !empty($companyContact) ? "\n- General Company Contact / WhatsApp: {$companyContact}" : "";

        return <<<PROMPT
You are "Hossam" — Senior Real Estate Sales & Investment Consultant at "Family Home". Respond in professional, persuasive, friendly English.

YOUR MISSION & SALES STRATEGY:
1. **Proactively Suggest Units with Direct Links:** Whenever the client asks about properties, locations, budgets, or investments, always recommend 1 to 3 relevant properties from the list below. Make every property name a direct clickable markdown link: `[Property Name](URL)`.
2. **Contact & Agent Access:** You have access to the agent's specific WhatsApp number for each unit (provided in the list below). If the user wants to proceed, mention the agent's WhatsApp number.{$contactContext}
3. **Sales Persuasion & Value:** Don't just list units — persuade the client why each property is a smart catch.
4. **Accurate Numbers:** Clearly calculate down payments, installments, and payment plans.
5. **Display Interactive Cards:** Whenever you suggest any unit, always append `[SHOW_CARDS]` at the very end of your response.
6. **Concise & Direct:** Be helpful and consultative. Never repeat introductory greetings in every message.

AVAILABLE PORTFOLIO UNITS:
{$inventoryText}
PROMPT;
    }

    /**
     * Build Arabic system prompt — optimized for high conversion & consultative selling.
     */
    private function buildArabicPrompt(array $units, string $currency, string $locale, string $companyContact): string
    {
        $inventoryText = $this->formatInventoryText($units, $currency, $locale);
        $contactContext = !empty($companyContact) ? "\n- رقم التواصل العام للموقع / واتساب: {$companyContact}" : "";

        return <<<PROMPT
أنت «حسام» — مستشار مبيعات واستثمار عقاري محترف وخبير في شركة «فاميلي هوم (Family Home)». ردّ دائماً باللغة العربية بأسلوب راقٍ ومقنع وودود.

استراتيجية الإقناع والبيع الاستشاري:
1. **اقتراح الوحدات بالروابط المباشرة دائماً:** رشّح 1 إلى 3 وحدات من القائمة المتاحة أدناه. اجعل اسم العقار رابط ماركداون مباشر بالصيغة: `[اسم العقار](الرابط)`.
2. **الوصول لأرقام التواصل:** أنت لديك وصول لرقم هاتف الوكيل الخاص بكل وحدة (موضح في تفاصيل الوحدة بالأسفل). إذا أراد العميل الحجز أو التواصل، قدم له رقم واتساب الوكيل الخاص بالوحدة.{$contactContext}
3. **فن الإقناع وإبراز القيمة:** أقنع العميل بذكاء لماذا تمثل هذه الوحدة «فرصة مميزة».
4. **حسابات دقيقة:** احسب المقدم والأقساط وفترة السداد بالأرقام والنسب المئوية بشكل واضح.
5. **إظهار كروت الوحدات:** عندما ترشح أي وحدات من القائمة، ضع دائماً الوسم الخفي `[SHOW_CARDS]` في نهاية ردك لظهور كروت العقارات المصورة وروابط الواتساب.
6. **اللباقة وعدم التكرار:** كن استشارياً ناصحاً، ولا تكرر رسائل الترحيب في كل رد.

قائمة العقارات والفرص المتاحة في محفظة فاميلي هوم:
{$inventoryText}
PROMPT;
    }

    /**
     * Format inventory text bilingually based on locale.
     */
    private function formatInventoryText(array $units, string $currency, string $locale): string
    {
        if (empty($units)) {
            return $locale === 'en'
                ? 'No specific units currently pulled from the database.'
                : 'لا توجد وحدات محددة مسحوبة حالياً.';
        }

        $list = [];
        $settingsWhatsapp = $this->settingsService->get('company_whatsapp', '');
        $settingsPhone = $this->settingsService->get('phone', '');

        foreach ($units as $u) {
            $areaName = $locale === 'en'
                ? ($u->area?->name_en ?? $u->area?->name ?? 'Prime Location')
                : ($u->area?->name_ar ?? $u->area?->name ?? 'موقع متميز');
            $priceFormatted = number_format((float) $u->price) . ' ' . $currency;
            
            $agentWhatsapp = $u->user?->whatsapp ?? $u->user?->phone ?? $settingsWhatsapp ?: $settingsPhone;
            $agentContact = !empty($agentWhatsapp) ? preg_replace('/[^\d+]/', '', (string) $agentWhatsapp) : 'N/A';

            if ($locale === 'en') {
                $payment = $u->payment_method === 'installment' ? 'Installment' : ($u->payment_method === 'both' ? 'Cash or Installment' : 'Cash');
                $downPayment = $u->down_payment ? ' (Down payment: ' . number_format((float) $u->down_payment) . ' ' . $currency . ')' : '';
                $years = $u->installment_years ? ' (Over ' . $u->installment_years . ' years)' : '';
                $slug = $u->slug_en ?? $u->slug;
                $url = '/' . $locale . '/units/' . $slug;

                $list[] = '- Property: [' . $u->name . '](' . $url . ') | Price: ' . $priceFormatted . ' | Area: ' . $areaName . ' | Rooms: ' . $u->rooms . ' | Size: ' . $u->area_sqm . ' sqm | Payment: ' . $payment . $downPayment . $years . ' | Agent WhatsApp: ' . $agentContact . ' | Markdown link: [' . $u->name . '](' . $url . ')';
            } else {
                $payment = $u->payment_method === 'installment' ? 'تقسيط' : ($u->payment_method === 'both' ? 'كاش أو تقسيط' : 'كاش');
                $downPayment = $u->down_payment ? ' (مقدم: ' . number_format((float) $u->down_payment) . ' ' . $currency . ')' : '';
                $years = $u->installment_years ? ' (تقسيط على ' . $u->installment_years . ' سنوات)' : '';
                $slug = $u->slug_ar ?? $u->slug;
                $url = '/' . $locale . '/units/' . $slug;

                $list[] = '- اسم العقار: [' . $u->name . '](' . $url . ') | السعر: ' . $priceFormatted . ' | المنطقة: ' . $areaName . ' | الغرف: ' . $u->rooms . ' | المساحة: ' . $u->area_sqm . ' م² | نظام الدفع: ' . $payment . $downPayment . $years . ' | واتساب الوكيل: ' . $agentContact . ' | رابط الماركداون: [' . $u->name . '](' . $url . ')';
            }
        }

        return implode("\n", $list);
    }

    /**
     * Build a smart fallback reply when all AI models fail.
     * Uses DB search results to provide a helpful response instead of a generic greeting.
     */
    private function buildSmartFallback(array $units, string $message, string $locale): string
    {
        $currency = config('app.currency', 'EGP');

        // If we have matching units from the DB, present them directly
        if (! empty($units)) {
            if ($locale === 'en') {
                $reply = "Here are the best available properties matching your request:\n\n";
                foreach (array_slice($units, 0, 3) as $u) {
                    $areaName = $u->area?->name_en ?? $u->area?->name ?? 'Prime Location';
                    $slug = $u->slug_en ?? $u->slug;
                    $url = '/' . $locale . '/units/' . $slug;
                    $price = number_format((float) $u->price) . ' ' . $currency;
                    $reply .= "• [{$u->name}]({$url}) — **{$price}** | {$areaName} | {$u->rooms} rooms | {$u->area_sqm} sqm\n";
                }
                $reply .= "\nWould you like more details about any of these? Or tell me your budget and preferences for a better match. [SHOW_CARDS]";
            } else {
                $reply = "أهلاً بك! دي أفضل العقارات المتاحة حسب طلبك:\n\n";
                foreach (array_slice($units, 0, 3) as $u) {
                    $areaName = $u->area?->name_ar ?? $u->area?->name ?? 'موقع متميز';
                    $slug = $u->slug_ar ?? $u->slug;
                    $url = '/' . $locale . '/units/' . $slug;
                    $price = number_format((float) $u->price) . ' ' . $currency;
                    $reply .= "• [{$u->name}]({$url}) — **{$price}** | {$areaName} | {$u->rooms} غرف | {$u->area_sqm} م²\n";
                }
                $reply .= "\nعايز تفاصيل أكتر عن أي وحدة منهم؟ أو قولي ميزانيتك وأرشحلك الأنسب. [SHOW_CARDS]";
            }

            return $reply;
        }

        // No units found — ask helpful discovery questions
        if ($locale === 'en') {
            return "Hello! I'm Hossam from Family Home. To find you the perfect property, could you tell me:\n\n• What type? (apartment, villa, chalet...)\n• Which area? (New Cairo, Sheikh Zayed, North Coast...)\n• Your budget range?\n\nI'll find the best options for you right away!";
        }

        return "أهلاً بك! أنا حسام من فاميلي هوم. عشان ألاقيلك أفضل عقار، ممكن تقولي:\n\n• نوع العقار؟ (شقة، فيلا، شاليه...)\n• المنطقة؟ (التجمع، الشيخ زايد، الساحل...)\n• ميزانيتك التقريبية؟\n\nوهجيبلك أحسن الفرص المتاحة فوراً!";
    }

    /**
     * Execute completion request against OpenRouter with intelligent retry.
     */
    private function callOpenRouter(array $messages, string $model, int $timeout = 25): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('HossamAssistant: OPENROUTER_API_KEY is not configured');

            return null;
        }

        $maxAttempts = 2;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                // Use shorter timeout on retry attempt
                $currentTimeout = $attempt === 1 ? $timeout : min($timeout, 15);

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'HTTP-Referer' => config('app.url', 'https://familyhome-co.com'),
                    'X-Title' => config('app.name', 'Family Home'),
                    'Content-Type' => 'application/json',
                ])
                    ->withoutVerifying()
                    ->timeout($currentTimeout)
                    ->post($this->baseUrl . '/chat/completions', [
                        'model' => $model,
                        'messages' => $messages,
                        'temperature' => 0.7,
                        'max_tokens' => 1500,
                    ]);

                if ($response->successful()) {
                    $rawBody = trim($response->body());
                    $data = json_decode($rawBody, true) ?: $response->json();
                    $reply = $data['choices'][0]['message']['content'] ?? null;
                    if (! empty($reply)) {
                        $trimmedReply = trim($reply);
                        if (mb_strlen($trimmedReply) > 25 && ! str_starts_with($trimmedReply, 'User Safety:')) {
                            return $trimmedReply;
                        }
                    }
                }

                // If rate limited (429) or server error (5xx), retry
                $status = $response->status();
                if ($attempt < $maxAttempts && ($status === 429 || $status >= 500)) {
                    Log::info('HossamAssistant: Retrying model after status ' . $status, [
                        'model' => $model,
                        'attempt' => $attempt,
                    ]);
                    usleep(500000); // 0.5s delay before retry

                    continue;
                }

                Log::warning('HossamAssistant: OpenRouter error response', [
                    'status' => $status,
                    'body' => $response->body(),
                    'model' => $model,
                    'attempt' => $attempt,
                ]);

                return null;
            } catch (\Throwable $e) {
                // On timeout/connection error, retry once
                if ($attempt < $maxAttempts && (
                    str_contains($e->getMessage(), 'timed out') ||
                    str_contains($e->getMessage(), 'Connection') ||
                    str_contains($e->getMessage(), 'cURL')
                )) {
                    Log::info('HossamAssistant: Retrying model after exception', [
                        'model' => $model,
                        'error' => $e->getMessage(),
                        'attempt' => $attempt,
                    ]);
                    usleep(300000); // 0.3s delay

                    continue;
                }

                Log::error('HossamAssistant: API call exception', [
                    'error' => $e->getMessage(),
                    'model' => $model,
                    'attempt' => $attempt,
                ]);

                return null;
            }
        }

        return null;
    }

    /**
     * Scan the AI reply for known unit & project names and inject markdown links.
     * e.g. "شقة في التجمع" → "[شقة في التجمع](/ar/units/slug)"
     */
    private function injectUnitLinks(string $reply, array $units, string $locale): string
    {
        if (empty($reply)) {
            return $reply;
        }

        // 1. Build link map from current units, all active units, and all active projects
        $linkMap = [];

        // Matching units first (highest relevance)
        foreach ($units as $u) {
            $slug = $locale === 'ar' ? ($u->slug_ar ?? $u->slug) : ($u->slug_en ?? $u->slug);
            $url = '/' . $locale . '/units/' . $slug;
            if (! empty($u->name) && mb_strlen($u->name) >= 3) {
                $linkMap[$u->name] = $url;
            }
        }

        // All active units
        try {
            $allUnits = Unit::where('is_active', true)->with('project')->get();
            foreach ($allUnits as $u) {
                $slug = $locale === 'ar' ? ($u->slug_ar ?? $u->slug) : ($u->slug_en ?? $u->slug);
                $url = '/' . $locale . '/units/' . $slug;
                if (! empty($u->name) && mb_strlen($u->name) >= 3 && ! isset($linkMap[$u->name])) {
                    $linkMap[$u->name] = $url;
                }
                if ($u->project && ! empty($u->project->name) && mb_strlen($u->project->name) >= 3) {
                    $pSlug = $locale === 'ar' ? ($u->project->slug_ar ?? $u->project->slug) : ($u->project->slug_en ?? $u->project->slug);
                    $pUrl = '/' . $locale . '/projects/' . $pSlug;
                    if (! isset($linkMap[$u->project->name])) {
                        $linkMap[$u->project->name] = $pUrl;
                    }
                }
            }
        } catch (\Throwable $e) {
            // Silently fallback to current units
        }

        // All active projects
        try {
            $allProjects = Project::where('is_active', true)->get();
            foreach ($allProjects as $p) {
                $pSlug = $locale === 'ar' ? ($p->slug_ar ?? $p->slug) : ($p->slug_en ?? $p->slug);
                $pUrl = '/' . $locale . '/projects/' . $pSlug;
                if (! empty($p->name) && mb_strlen($p->name) >= 3 && ! isset($linkMap[$p->name])) {
                    $linkMap[$p->name] = $pUrl;
                }
            }
        } catch (\Throwable $e) {
            // Silently ignore
        }

        if (empty($linkMap)) {
            return $reply;
        }

        // Sort by name length descending to match longer names first
        uksort($linkMap, fn ($a, $b) => mb_strlen($b) - mb_strlen($a));

        foreach ($linkMap as $name => $url) {
            // Skip if this URL is already linked in the text
            if (str_contains($reply, '(' . $url . ')')) {
                continue;
            }

            $nameEscaped = preg_quote($name, '/');

            // 1. Markdown bold: **name**
            $reply = preg_replace_callback(
                '/\*\*' . $nameEscaped . '\*\*/iu',
                fn ($m) => '[' . $name . '](' . $url . ')',
                $reply,
                1
            );

            if (str_contains($reply, '(' . $url . ')')) {
                continue;
            }

            // 2. Bracketed: [name] (without (url))
            $reply = preg_replace_callback(
                '/\[(' . $nameEscaped . ')\](?!\()/iu',
                fn ($m) => '[' . $m[1] . '](' . $url . ')',
                $reply,
                1
            );

            if (str_contains($reply, '(' . $url . ')')) {
                continue;
            }

            // 3. Quotes: «name» or "name" or “name”
            $reply = preg_replace_callback(
                '/[«"“](' . $nameEscaped . ')[»"”]/iu',
                fn ($m) => '[' . $m[1] . '](' . $url . ')',
                $reply,
                1
            );

            if (str_contains($reply, '(' . $url . ')')) {
                continue;
            }

            // 4. Plain name (not preceded by [ or / or alphanumeric)
            $reply = preg_replace_callback(
                '/(?<!\[|\/|\w)(' . $nameEscaped . ')(?!\]|\))/iu',
                fn ($m) => '[' . $m[1] . '](' . $url . ')',
                $reply,
                1
            );
        }

        return $reply;
    }

    /**
     * Format matched unit models into lightweight frontend cards.
     */
    private function formatUnitCards(array $units, string $locale): array
    {
        $cards = [];
        $settingsWhatsapp = Setting::getValue('company_whatsapp', '');
        $settingsPhone = Setting::getValue('phone', '');

        foreach ($units as $u) {
            $slug = $locale === 'ar' ? ($u->slug_ar ?? $u->slug) : ($u->slug_en ?? $u->slug);
            $firstImg = $u->images?->firstWhere('is_primary', true) ?? $u->images?->first();
            $imageUrl = $firstImg ? asset('storage/' . $firstImg->path) : asset('images/fallback.webp');

            // Agent contact or company fallback
            $whatsapp = $u->user?->whatsapp ?? $u->user?->phone ?? $settingsWhatsapp ?: $settingsPhone;
            $cleanWhatsapp = preg_replace('/[^\d]/', '', (string) $whatsapp);
            $whatsappText = $locale === 'en'
                ? 'Hello, I would like to inquire about the property: ' . $u->name
                : 'مرحباً، أستفسر بخصوص العقار: ' . $u->name;
            $whatsappUrl = ! empty($cleanWhatsapp)
                ? 'https://wa.me/' . $cleanWhatsapp . '?text=' . urlencode($whatsappText)
                : null;

            $areaName = $locale === 'en'
                ? ($u->area?->name_en ?? $u->area?->name ?? '')
                : ($u->area?->name_ar ?? $u->area?->name ?? '');

            $cards[] = [
                'id' => $u->id,
                'name' => $u->name,
                'price' => (float) $u->price,
                'price_formatted' => number_format((float) $u->price),
                'currency' => config('app.currency', 'EGP'),
                'area_name' => $areaName,
                'rooms' => (int) $u->rooms,
                'bathrooms' => (int) $u->bathrooms,
                'area_sqm' => (float) $u->area_sqm,
                'transaction' => $u->transaction,
                'payment_method' => $u->payment_method,
                'image_url' => $imageUrl,
                'url' => '/' . $locale . '/units/' . $slug,
                'whatsapp_url' => $whatsappUrl,
            ];
        }

        return $cards;
    }
}


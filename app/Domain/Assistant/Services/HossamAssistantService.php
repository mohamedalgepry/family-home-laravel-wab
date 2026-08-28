<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Listings\Models\Area;
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

    public function __construct()
    {
        $this->apiKey = (string) config('services.openrouter.api_key', env('OPENROUTER_API_KEY', ''));
        $this->model = (string) config('services.openrouter.model', env('OPENROUTER_MODEL', 'z-ai/glm-5.2:free'));
        $this->fallbackModel = (string) config('services.openrouter.fallback_model', env('OPENROUTER_FALLBACK_MODEL', 'meta-llama/llama-3.3-70b-instruct:free'));
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
        $matchingUnits = $this->searchRelevantUnits($message, $locale);

        // 2. Build system instructions & inventory context
        $systemPrompt = $this->buildSystemPrompt($matchingUnits, $locale);

        // 3. Format message history for OpenRouter
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        // Append past history (limited to last 6 turns for efficiency)
        $trimmedHistory = array_slice($history, -6);
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

        // 4. Request completion from OpenRouter with multi-model fallback cascade
        $candidateModels = array_values(array_unique(array_filter([
            'openrouter/free',
            'minimax/minimax-m3:free',
            $this->model,
            $this->fallbackModel,
            'google/gemma-4-31b-it:free',
            'nvidia/nemotron-3.5-lightning:free',
        ])));

        $reply = null;
        foreach ($candidateModels as $candidate) {
            $reply = $this->callOpenRouter($messages, $candidate);
            if (! empty($reply)) {
                break;
            }
        }

        if (empty($reply)) {
            $reply = $locale === 'en'
                ? "Hello! I am Hossam, your real estate and financial advisor at Family Home. I have analyzed our current database. Here are some of our best matching units for you."
                : "أهلاً بك! أنا حسام، مستشارك العقاري والاقتصادي في فاميلي هوم. لقد قمت بالبحث في قاعدة بيانات العقارات المتاحة لدينا واخترت لك هذه الترشيحات المميزة.";
        }

        // 5. Format unit cards for frontend rendering
        $recommendedCards = $this->formatUnitCards($matchingUnits, $locale);

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

            // 2. Property Subtype Extraction (شقة, فيلا, شاليه, دوبلكس, استوديو, مكتب, محل)
            $subtypeKeywords = [
                'شقة' => ['شقة', 'شقه', 'apartment', 'flat'],
                'فيلا' => ['فيلا', 'villa'],
                'شاليه' => ['شاليه', 'chalet'],
                'دوبلكس' => ['دوبلكس', 'duplex'],
                'استوديو' => ['استوديو', 'استديو', 'studio'],
                'مكتب' => ['مكتب', 'office', 'إداري', 'اداري'],
                'محل' => ['محل', 'تجاري', 'shop', 'commercial'],
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

            // If no specific constraints were provided and few results returned, show top deals
            if (! $hasSpecificConstraints && $units->count() < 2) {
                $fallback = Unit::query()
                    ->where('is_active', true)
                    ->with(['area', 'type', 'images', 'user', 'project'])
                    ->orderByDesc('is_deal')
                    ->orderByDesc('priority_points')
                    ->orderByDesc('created_at')
                    ->take(4)
                    ->get();
                $units = $units->merge($fallback)->unique('id')->take(4);
            }

            return $units->all();
        } catch (\Throwable $e) {
            Log::warning('HossamAssistant: DB search error', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Build high-IQ system prompt defining Hossam\'s persona & real estate expertise.
     */
    private function buildSystemPrompt(array $units, string $locale): string
    {
        $currency = config('app.currency', 'EGP');

        $inventoryText = 'لا توجد وحدات مطابقة حالياً.';
        if (! empty($units)) {
            $list = [];
            foreach ($units as $u) {
                $areaName = $u->area?->name ?? 'موقع متميز';
                $priceFormatted = number_format((float) $u->price) . ' ' . $currency;
                $payment = $u->payment_method === 'installment' ? 'تقسيط' : ($u->payment_method === 'both' ? 'كاش أو تقسيط' : 'كاش');
                $downPayment = $u->down_payment ? ' (مقدم: ' . number_format((float) $u->down_payment) . ' ' . $currency . ')' : '';
                $years = $u->installment_years ? ' (تقسيط على ' . $u->installment_years . ' سنوات)' : '';
                $slug = $locale === 'ar' ? ($u->slug_ar ?? $u->slug) : ($u->slug_en ?? $u->slug);
                $url = '/' . $locale . '/units/' . $slug;

                $list[] = '- [' . $u->name . '] | السعر: ' . $priceFormatted . ' | المنطقة: ' . $areaName . ' | الغرف: ' . $u->rooms . ' | المساحة: ' . $u->area_sqm . ' م² | نظام الدفع: ' . $payment . $downPayment . $years . ' | الرابط: ' . $url;
            }
            $inventoryText = implode("\n", $list);
        }

        return "أنت «حسام» — الخبير والمستشار الاقتصادي والاستثماري الأول لمنصة فاميلي هوم (Family Home).

المهمة والدور:
تقديم استشارات عقارية واقتصادية استراتيجية رفيعة المستوى لعملاء المنصة، قائمة على التحليل المالي الدقيق، ودراسة الجدوى، وحسابات القيمة الزمنية للنقود، ومعدلات العائد الاستثماري (ROI & Net Rental Yield)، ومقارنة تكلفة الفرصة البديلة بين خيارات الشراء النقدي والتقسيط.

المعايير الصارمة لأسلوب الرد وشخصيتك:
1. **الأسلوب واللغة:** تحدث بأسلوب استشاري جاد، رصين، وموضوعي تماماً. استخدم لغة عربية فصحى احترافية ومباشرة تعكس فكراً اقتصادياً واستثمارياً عميقاً.
2. **الحد من الإيموجي (قاعدة صارمة):** امتنع عن استخدام الإيموجي والرموز التعبيرية تماماً، أو اجعلها نادرة للغاية. يجب أن يظهر ردك كمذكرة استشارية وتحليل مالي تنفيذي رصين.
3. **العمق الاقتصادي:**
   - عند مناقشة الكاش مقابل التقسيط، حلل أثر التضخم، وتكلفة الفرصة البديلة لاستثمار السيولة، وفارق سعر الخصم النقدي مقابل فترات السداد.
   - احسب الأقساط والمقدمات والعوائد الإيجارية بالأرقام والنسب المئوية الواقعية.
4. **استخدام بيانات المنصة:**
   - استند إلى قائمة العقارات المتاحة أدناه لدعم استشارتك بنماذج حقيقية مطابقة لميزانية ومواصفات العميل.
   - لا تختلق أي بيانات أو وحدات وهمية غير موجودة في القائمة المعطاة.
5. **هيكلة الرد:**
   - قسّم الرد إلى: (1) التقييم والتحليل الاقتصادي، (2) المقارنة الحسابية بالأرقام أو الجداول، (3) التوصية الاستثمارية والخطوات العملية.
   - اجعل الطرح موجزاً، مركزاً، ومبنياً على الحقائق والأرقام دون حشو أو مجاملات إنشائية.

قائمة العقارات المتوفرة حالياً في قاعدة بيانات فاميلي هوم والمرشحة للعميل:
{$inventoryText}";
    }

    /**
     * Execute completion request against OpenRouter.
     */
    private function callOpenRouter(array $messages, string $model): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('HossamAssistant: OPENROUTER_API_KEY is not configured');

            return null;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'HTTP-Referer' => config('app.url', 'https://familyhome-co.com'),
                'X-Title' => config('app.name', 'Family Home'),
                'Content-Type' => 'application/json',
            ])
                ->withoutVerifying()
                ->timeout(12)
                ->post($this->baseUrl . '/chat/completions', [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 900,
                ]);

            if ($response->successful()) {
                $rawBody = trim($response->body());
                $data = json_decode($rawBody, true) ?: $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? null;
                if (! empty($reply)) {
                    return trim($reply);
                }
            }

            Log::warning('HossamAssistant: OpenRouter error response', [
                'status' => $response->status(),
                'body' => $response->body(),
                'model' => $model,
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('HossamAssistant: API call exception', [
                'error' => $e->getMessage(),
                'model' => $model,
            ]);

            return null;
        }
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
            $whatsappUrl = ! empty($cleanWhatsapp)
                ? 'https://wa.me/' . $cleanWhatsapp . '?text=' . urlencode('مرحباً، أستفسر بخصوص العقار: ' . $u->name)
                : null;

            $cards[] = [
                'id' => $u->id,
                'name' => $u->name,
                'price' => (float) $u->price,
                'price_formatted' => number_format((float) $u->price),
                'currency' => config('app.currency', 'EGP'),
                'area_name' => $u->area?->name ?? '',
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


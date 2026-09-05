<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HossamKnowledgeService
{
    private const KNOWLEDGE_FILE = 'assistant_knowledge.json';
    private const KNOWLEDGE_CACHE_KEY = 'hossam_learned_knowledge_v1';
    private const FAQ_FREQUENCY_KEY = 'hossam_faq_frequency_v1';

    public function __construct(
        private readonly SettingsService $settingsService
    ) {}

    /**
     * Look up an instant canned FAQ response or self-learned Q&A.
     * Runs in sub-5ms with zero external API calls.
     */
    public function findCannedOrLearnedResponse(string $message, string $locale = 'ar'): ?array
    {
        $normalized = $this->normalizeText($message);
        if (empty($normalized)) {
            return null;
        }

        $res = null;

        // 1. Check built-in Canned FAQ Knowledge (Hardened, immediate responses)
        $canned = $this->matchCannedFaq($normalized, $locale);
        if ($canned) {
            $this->recordQuestionFrequency($normalized);
            $res = $canned;
        } elseif ($learned = $this->matchLearnedKnowledge($normalized, $locale)) {
            // 2. Check Self-Learned Knowledge Base (from past successful interactions)
            $this->recordQuestionFrequency($normalized);
            $res = $learned;
        }

        if ($res !== null) {
            if (!isset($res['show_calculator'])) {
                $isCalculatorQuery = (bool) preg_match('/(قسط|تقسيط|مقدم|احسب|حاسبة|حاسبه|كم شهري|كام شهري|كم القسط|installment|down payment|calculator|mortgage)/iu', $message);
                $res['show_calculator'] = $isCalculatorQuery;
            }
            if (!isset($res['recommended_units'])) {
                $res['recommended_units'] = [];
            }
            if (!isset($res['quick_replies'])) {
                $res['quick_replies'] = [];
            }
            if (!isset($res['is_hot_lead'])) {
                $res['is_hot_lead'] = false;
            }
            return $res;
        }

        return null;
    }

    /**
     * Self-learning engine: saves a high-quality response into the persistent knowledge base.
     */
    public function learn(string $message, string $reply, array $quickReplies = [], string $locale = 'ar'): void
    {
        try {
            $normalized = $this->normalizeText($message);
            // Only learn substantive questions (length between 10 and 150 chars)
            if (mb_strlen($normalized) < 10 || mb_strlen($normalized) > 150) {
                return;
            }

            // Do not store greeting, fallback, or apology messages
            if (
                str_contains($reply, 'عشان ألاقيلك أفضل عقار') ||
                str_contains($reply, 'To find you the perfect property') ||
                str_contains($reply, 'أهلاً بك! دي أفضل العقارات المتاحة حسب طلبك') ||
                str_contains($reply, 'Here are the best available properties') ||
                str_contains($reply, 'للأسف') ||
                str_contains($reply, 'بعتذر') ||
                str_contains($reply, 'معاك حق')
            ) {
                return;
            }

            $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
            $knowledge = [];
            if (file_exists($storagePath)) {
                $raw = @file_get_contents($storagePath);
                $knowledge = json_decode($raw, true) ?: [];
            }

            $key = md5($normalized . '_' . $locale);
            $knowledge[$key] = [
                'question' => $message,
                'normalized' => $normalized,
                'reply' => $reply,
                'quick_replies' => $quickReplies,
                'locale' => $locale,
                'learned_at' => date('Y-m-d H:i:s'),
                'hits' => ($knowledge[$key]['hits'] ?? 0) + 1,
            ];

            // Cap stored items to prevent unbounded file growth
            if (count($knowledge) > 300) {
                // Keep the most frequently used or recent items
                uasort($knowledge, fn($a, $b) => ($b['hits'] ?? 0) <=> ($a['hits'] ?? 0));
                $knowledge = array_slice($knowledge, 0, 300, true);
            }

            @file_put_contents($storagePath, json_encode($knowledge, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            Cache::put(self::KNOWLEDGE_CACHE_KEY, $knowledge, 86400 * 30);
        } catch (\Throwable $e) {
            Log::warning('HossamKnowledgeService learn error', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Match against predefined high-frequency real estate questions.
     */
    private function matchCannedFaq(string $text, string $locale): ?array
    {
        $phone = $this->settingsService->get('phone', '01000000000');
        $whatsapp = $this->settingsService->get('company_whatsapp', $phone);
        $cleanWhatsapp = preg_replace('/[^\d]/', '', (string) $whatsapp);
        $whatsappUrl = 'https://wa.me/' . $cleanWhatsapp . '?text=' . urlencode($locale === 'en' ? 'Hello Family Home, I would like to inquire about properties' : 'مرحباً فاميلي هوم، أود الاستفسار عن العقارات المتاحة');
        $address = $this->settingsService->get('company_address', 'القاهرة الجديدة، مصر');

        // 1. Greetings / الترحيب
        if (preg_match('/^(سلام|السلام عليكم|سلام عليكم|مرحبا|مرحب|ازيك|اهلا|أهلا|أهلاً|صباح الخير|مساء الخير|هاي|مين انت|انت مين|بتعمل ايه|hello|hi|hey|who are you)/iu', $text)) {
            // B2: Time-based greeting
            $hour = (int) date('G'); // 0-23 in Egypt timezone (UTC+2 typically)
            if ($locale === 'ar') {
                if ($hour >= 6 && $hour < 12) {
                    $timeGreeting = 'صباح الخير! ☀️';
                } elseif ($hour >= 12 && $hour < 18) {
                    $timeGreeting = 'مساء الخير! 🌤️';
                } else {
                    $timeGreeting = 'مساء النور! 🌙';
                }
            } else {
                if ($hour >= 6 && $hour < 12) {
                    $timeGreeting = 'Good morning! ☀️';
                } elseif ($hour >= 12 && $hour < 18) {
                    $timeGreeting = 'Good afternoon! 🌤️';
                } else {
                    $timeGreeting = 'Good evening! 🌙';
                }
            }

            if ($locale === 'en') {
                return [
                    'reply' => "{$timeGreeting} Welcome! I am **Hossam**, your private real estate advisor at **Family Home**. 🤝\n\nI'm here to help you discover the finest properties, projects, and flexible payment plans across Egypt (New Cairo, New Administrative Capital, Sheikh Zayed, and the North Coast).\n\nHow may I assist your property journey today?",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => [
                        'Show me apartments with installments',
                        'Best investment opportunities',
                        'Administrative offices',
                        'Projects in New Cairo',
                    ],
                ];
            }

            return [
                'reply' => "{$timeGreeting} أهلاً ومرحباً بك! أنا «حسام»، المستشار العقاري والاستثماري لشركة **فاميلي هوم (Family Home)**. 🤝\n\nأنا هنا لمساعدتك في العثور على أفضل العقارات، والمشاريع، وأنظمة السداد المناسبة لميزانيتك في أميز مناطق مصر (التجمع الخامس، العاصمة الإدارية، الشيخ زايد، والساحل الشمالي).\n\nتحب نبدأ بإيه النهاردة؟",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => [
                    'ورّيني شقق بنظام التقسيط',
                    'إيه أفضل فرص الاستثمار؟',
                    'مكاتب ومحلات تجارية',
                    'مشاريع التجمع الخامس',
                ],
            ];
        }


        // 1b. Small Talk / كيف الحال والأخبار (الرد الودود بدون استبيانات)
        if (preg_match('/^(اخبارك|اخبارك ايه|عامل ايه|شخبارك|كيف حالك|كيفك|ازي حضرتك|ازيك|كله تمام|طمني عنك|how are you|how is it going)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "Doing great, thank you for asking! 🤝 I'm ready to assist you with any property questions, price comparisons, or investment opportunities.\n\nAre you looking for a home or an investment property today?",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => [
                        'Show me apartments with installments',
                        'Best investment opportunities',
                        'Administrative offices',
                        'Projects in New Cairo',
                    ],
                ];
            }

            return [
                'reply' => "الحمد لله كله تمام وبأفضل حال، تسلم لسؤالك! 🤝\n\nأنا هنا لمساعدتك في أي استفسار عقاري، أو مقارنة بين المشروعات وأنظمة السداد. بتدور على سكن خاص ولا فرصة استثمارية النهاردة؟",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => [
                    'ورّيني شقق بنظام التقسيط',
                    'إيه أفضل فرص الاستثمار؟',
                    'مكاتب ومحلات تجارية',
                    'مشاريع العاصمة الإدارية',
                ],
            ];
        }

        // 2. Company Info & Credentials / عن الشركة
        if (preg_match('/(مين فاميلي هوم|عن الشركه|عن الشركة|شركه فاميلي هوم|شركة فاميلي هوم|مقركم|عنوانكم|فين مكتبكم|مكانكم|موقعكم|ارقامكم|رقم التليفون|خدمه العملاء|خدمة العملاء|about family home|company address|contact number)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "🏢 **Family Home** is a premier real estate consultancy and brokerage firm in Egypt.\n\nWe connect buyers and investors with prime residential, commercial, and administrative developments from Egypt's top developers with zero buyer commission and flexible payment terms.\n\n📍 **Location:** {$address}\n📞 **Phone:** {$phone}\n💬 **WhatsApp:** [Chat with us]({$whatsappUrl})\n\nOur advisory team is ready to schedule a free property consultation or site visit anytime.",
                    'recommended_units' => [],
                    'is_hot_lead' => true,
                    'quick_replies' => [
                        'Chat on WhatsApp',
                        'View top projects',
                        'Ready to move units',
                    ],
                ];
            }

            return [
                'reply' => "🏢 شركة **فاميلي هوم (Family Home)** هي شركة رائدة ومتخصصة في الاستشارات والتسويق العقاري في مصر.\n\nنساعدك في امتلاك أفضل الشقق، الفلل، والمحلات التجارية والمكاتب الإدارية مع كبرى شركات التطوير العقاري وبأفضل أنظمة سداد بدون عمولة شراء.\n\n📍 **المقر والعنوان:** {$address}\n📞 **الهاتف المباشر:** {$phone}\n💬 **واتساب خدمة العملاء:** [اضغط هنا للتحدث واتساب مباشرة]({$whatsappUrl})\n\nفريقنا متاح طوال أيام الأسبوع لتقديم استشارات عقارية ومرافقتك في معاينات ميدانية مجانية.",
                'recommended_units' => [],
                'is_hot_lead' => true,
                'quick_replies' => [
                    'تحدث مع مستشار واتساب',
                    'تصفح أحدث المشاريع',
                    'شقق استلام فوري',
                ],
            ];
        }

        // 3. Installments & Payment Plans / شقق بالتقسيط
        if (preg_match('/(شقق بنظام التقسيط|شقق تقسيط|شقق بالتقسيط|عايز شقه قسط|عايز شقة قسط|نظام التقسيط|انظمه التقسيط|اطول فتره سداد|أطول فترة سداد|اقل مقدم|أقل مقدم|اقساط|installment|installments)/iu', $text)) {
            $units = Unit::where('is_active', true)
                ->whereIn('payment_method', ['installment', 'both'])
                ->with(['area', 'type', 'images', 'user', 'project'])
                ->orderByDesc('is_deal')
                ->orderByDesc('is_pinned')
                ->orderByDesc('priority_points')
                ->take(4)
                ->get();

            $formattedCards = $this->formatUnitCards($units->all(), $locale);

            if ($locale === 'en') {
                return [
                    'reply' => "We offer an extensive portfolio of apartments and units with ultra-flexible installment schemes in prime locations:\n\n• **Down Payment:** Typically starting from 10% to 15%.\n• **Payment Duration:** Spread over 6, 8, and up to 10 years in equal installments without bank interest.\n• **Delivery Dates:** Options range from immediate ready-to-move units to 1–3 years delivery.\n\nHere are some of our top available installment units: [SHOW_CARDS]",
                    'recommended_units' => $formattedCards,
                    'is_hot_lead' => true,
                    'quick_replies' => [
                        'Units under 5 Million',
                        'New Cairo installments',
                        'Immediate delivery',
                    ],
                ];
            }

            return [
                'reply' => "نوفر في **فاميلي هوم** تشكيلة واسعة من أفضل الشقق والوحدات السكنية بأنظمة تقسيط مريحة تناسب كافة الميزانيات:\n\n• **المقدم:** يبدأ من 10% إلى 15% فقط.\n• **فترة السداد:** تمتد من 6 إلى 8 سنوات وحتى 10 سنوات بأقساط متساوية وبدون فوائد بنكية.\n• **موعد الاستلام:** خيارات متنوعة بين الاستلام الفوري، أو خلال 1 إلى 3 سنوات.\n\nإليك باقة من أفضل الشقق المتاحة للتقسيط حالياً: [SHOW_CARDS]",
                'recommended_units' => $formattedCards,
                'is_hot_lead' => true,
                'quick_replies' => [
                    'شقق أقل من 5 مليون',
                    'شقق تقسيط في التجمع',
                    'عايز استلام فوري',
                ],
            ];
        }

        // 4. Best Investment Opportunities / أفضل فرص الاستثمار
        if (preg_match('/(افضل فرص الاستثمار|أفضل فرص الاستثمار|فرص الاستثمار المتاحه|فرص الاستثمار المتاحة|استثمار عقاري|افضل استثمار|أفضل استثمار|استثمر فلوسي|اعلى عائد|أعلى عائد|عائد استثماري|شقق لقطه|شقق لقطة|عروض خاصه|عروض خاصة|best investment|high roi)/iu', $text)) {
            $units = Unit::where('is_active', true)
                ->where('is_deal', true)
                ->with(['area', 'type', 'images', 'user', 'project'])
                ->orderByDesc('priority_points')
                ->take(4)
                ->get();

            if ($units->isEmpty()) {
                $units = Unit::where('is_active', true)
                    ->with(['area', 'type', 'images', 'user', 'project'])
                    ->orderByDesc('priority_points')
                    ->take(4)
                    ->get();
            }

            $formattedCards = $this->formatUnitCards($units->all(), $locale);

            if ($locale === 'en') {
                return [
                    'reply' => "To maximize your Return on Investment (ROI) and hedge against inflation, here are the top real estate strategies right now:\n\n1. **Commercial & Administrative Units:** Yielding 10% to 15% annual rental returns with rapid leasing demand.\n2. **Early-Launch Residential in New Cairo:** Capital appreciation of 25% to 35% annually upon project handover.\n3. **North Coast Luxury Developments:** Exceptional dollar-denominated short-term holiday rental returns.\n\nHere are the top investment deals in our portfolio today: [SHOW_CARDS]",
                    'recommended_units' => $formattedCards,
                    'is_hot_lead' => true,
                    'quick_replies' => [
                        'Commercial & retail units',
                        'Investment deals in New Cairo',
                        'Speak with an investment advisor',
                    ],
                ];
            }

            return [
                'reply' => "لتحقيق أعلى عائد استثماري (ROI) وأفضل تحوّط ضد التضخم في السوق العقاري المصري، نوصي دائماً بالخيارات التالية:\n\n1. **الوحدات التجارية والإدارية:** تحقق عائداً إيجارياً سنوياً بين 10% إلى 15% مع سهولة إعادة التأجير للشركات والماركات.\n2. **شقق التجمع الخامس والمدن الجديدة في مراحل الطرح الأولى:** تمنحك زيادة رأسمالية سنوية (Capital Appreciation) تتراوح بين 25% و35% حتى تاريخ الاستلام.\n3. **عقارات الساحل الشمالي:** تحقق أقوى عوائد إيجارية سياحية بالدولار والجنيه خلال موسم الصيف.\n\nإليك أبرز الفرص الاستثمارية والصفقات الحصرية المتاحة الآن: [SHOW_CARDS]",
                'recommended_units' => $formattedCards,
                'is_hot_lead' => true,
                'quick_replies' => [
                    'محلات ومكاتب تجارية',
                    'شقق لقطة في التجمع',
                    'تحدث مع مستشار استثماري',
                ],
            ];
        }

        // 5. Cash vs Installments / كاش ولا تقسيط
        if (preg_match('/(كاش ولا تقسيط|كاش ولا قسط|اشتري كاش ولا قسط|خصم الكاش|انهي افضل كاش ولا تقسيط|أيهما أفضل كاش ولا تقسيط|cash vs installment)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "A crucial financial question! The right choice depends on your liquidity and investment goals:\n\n• **Buying in Cash:** Unlocks an immediate cash discount ranging between **20% to 35%** off the total property price. Ideal if you have surplus liquidity and seek immediate rental yield or instant handover.\n• **Buying in Installments:** Superior hedge against inflation. You pay fixed nominal installments over 7–10 years while the asset appreciates at rates outpacing inflation.\n\nTell me your target budget or monthly cash flow, and I will calculate the exact financial figures for you!",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => [
                        'Calculate installments for a unit',
                        'Properties with cash discounts',
                        'Connect with sales consultant',
                    ],
                ];
            }

            return [
                'reply' => "سؤال استثماري ممتاز! الإجابة تعتمد على طبيعة سيولتك المالية:\n\n• **الشراء كاش (Cash):** يمنحك خصماً فورياً هائلاً يتراوح بين **20% إلى 35%** من إجمالي سعر العقار. ممتاز إذا كانت لديك سيولة فائضة تبحث عن تجميدها في أصل عقاري جاهز للتشغيل أو الإيجار الفوري.\n• **الشراء بالتقسيط (Installment):** أفضل وسيلة للتحوط ضد التضخم؛ فأنت تدفع أقساطاً ثابتة لسنوات قادمة بقيمة نقدية تقل بمرور الوقت، بينما يرتفع سعر العقار بمعدلات تفوق التضخم.\n\nلو حابب نحسبها بالأرقام الدقيقة على وحدة معينة، قولي ميزانيتك المتاحة كاش أو مقدم شهري!",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => [
                    'احسبلي قسط شقة',
                    'شقق بخصم كاش مميز',
                    'تحدث مع مستشار مالي',
                ],
            ];
        }

        // 6. Growth Areas & Future / أفضل المناطق
        if (preg_match('/(مناطق ليها مستقبل استثماري|مناطق لها مستقبل استثماري|افضل مناطق الاستثمار|أفضل مناطق الاستثمار|مستقبل التجمع|التجمع ولا زايد|العاصمه الاداريه|العاصمة الإدارية|الساحل الشمالي|مناطق الاستثمار|best areas to invest)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "Egypt's real estate growth vector is currently led by four powerhouse regions:\n\n1. **New Cairo (Fifth Settlement & Golden Square):** The most liquid, stable, and demanded market for residential living and rental ease.\n2. **New Administrative Capital:** The future hub for commercial, administrative, and governmental headquarters with massive capital upside.\n3. **Sheikh Zayed & New Zayed:** The premier western extension offering upscale boutique communities and elite schools.\n4. **North Coast & Ras El Hekma:** An international tourism and hospitality destination yielding high seasonal dollar returns.\n\nWhich of these areas would you like to explore?",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => [
                        'New Cairo projects',
                        'Sheikh Zayed projects',
                        'North Coast projects',
                    ],
                ];
            }

            return [
                'reply' => "خريطة النمو العقاري الأقوى في مصر حالياً تتصدرها 4 مناطق رئيسية:\n\n1. **القاهرة الجديدة والتجمع الخامس:** المنطقة الأكثر طلباً واستقراراً مع بنية تحتية متكاملة وسهولة فائقة في إعادة البيع والإيجار.\n2. **العاصمة الإدارية الجديدة:** مركز الاستثمار الإداري والتجاري والشركات الدولية مع اكتمال انتقال الوزارات والهيئات.\n3. **الشيخ زايد وأكتوبر:** التوسع الغربي الفاخر، مناسب جداً للعائلات والباحثين عن الرقي والهدوء.\n4. **الساحل الشمالي ورأس الحكمة:** واجهة الاستثمار العالمي والسياحي بأعلى عائد إيجاري موسمي.\n\nأي منطقة تحب نتصفح مشاريعها المتاحة حالياً؟",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => [
                    'مشاريع التجمع الخامس',
                    'مشاريع الشيخ زايد',
                    'مشاريع الساحل الشمالي',
                ],
            ];
        }

        // 7. Sell or List Property / عرض عقار للبيع
        if (preg_match('/(عايز ابيع شقتي|عايز ابيع عقار|عندي شقه عايز ابيعها|عندي شقة عايز ابيعها|عندي عقار للبيع|عرض عقار|بتسوقوا عقارات|عايز اجر شقتي|عايز أجر شقتي|sell my unit|sell property|list property)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "We would be delighted to market and sell or rent your property at the highest market value! 🚀\n\n**Family Home** has an extensive network of qualified buyers and investors actively seeking properties.\n\nTo list your property with us:\n1. Connect directly with our listing department via WhatsApp: [{$whatsapp}]({$whatsappUrl})\n2. Share the property details (Location, Area in sqm, Photos, Asking Price).\n3. Our team will verify and start marketing your property immediately.",
                    'recommended_units' => [],
                    'is_hot_lead' => true,
                    'quick_replies' => [
                        'Chat on WhatsApp to list property',
                        'Inquire about buying instead',
                    ],
                ];
            }

            return [
                'reply' => "يسعدنا جداً مساعدتك في تسويق وبيع أو تأجير عقارك بأعلى قيمة سوقية وسرعة قياسية! 🚀\n\nنمتلك في **فاميلي هوم** قاعدة عملاء ومستثمرين جاهزين للشراء الفوري. لإدراج عقارك معنا:\n\n1. تواصل مباشرة مع قسم التعاقدات والتسويق عبر واتساب: [اضغط هنا لمراسلتنا على الواتساب]({$whatsappUrl})\n2. اذكر نوع العقار، موقعه، المساحة، والسعر المطلوب.\n3. سيقوم فريقنا بالرد عليك وترتيب التصوير والعرض على منصتنا فوراً.",
                'recommended_units' => [],
                'is_hot_lead' => true,
                'quick_replies' => [
                    'تواصل عبر واتساب لإدراج عقار',
                    'عايز اشتري شقة',
                ],
            ];
        }

        // 8. Currency Rates / أسعار العملات
        if (preg_match('/(سعر الدولار|الدولار بكام|سعر اليورو|اسعار العملات|أسعار العملات|dollar rate|exchange rate)/iu', $text)) {
            $currencyText = $this->getLiveCurrencyRates($locale);
            if (!empty($currencyText)) {
                return [
                    'reply' => $currencyText,
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => [
                        $locale === 'en' ? 'Best investment properties' : 'أفضل فرص الاستثمار',
                        $locale === 'en' ? 'Properties with installments' : 'شقق بالتقسيط',
                    ],
                ];
            }
        }

        // 9. Site Visit / Book Appointment / معاينة ميدانية
        if (preg_match('/(معاينة|معاينه|زيارة موقع|احجز معاينة|احجز معاينه|اتفرج على|عايز اشوف|book.*visit|site.*visit|schedule.*viewing)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "Great decision — seeing a property in person is always the best way to decide! 🏠\n\nTo schedule a **free site visit**:\n1. Contact our team via WhatsApp: [{$whatsapp}]({$whatsappUrl})\n2. Tell them the property name and your available dates.\n3. Our consultant will meet you at the location and guide you through.\n\nSite visits are **100% free** with no obligations.",
                    'recommended_units' => [],
                    'is_hot_lead' => true,
                    'quick_replies' => ['Chat on WhatsApp to book a visit', 'Show me available properties'],
                ];
            }
            return [
                'reply' => "قرار ممتاز — المعاينة الميدانية هي أفضل طريقة لاتخاذ قرار الشراء الصح! 🏠\n\nلحجز **معاينة مجانية**:\n1. تواصل مع فريقنا عبر واتساب: [اضغط هنا للتواصل معنا]({$whatsappUrl})\n2. أخبرهم باسم العقار والمواعيد المناسبة.\n3. مستشارنا سيرافقك في الزيارة ويشرحلك كل التفاصيل.\n\nالمعاينة **مجانية 100%** بدون أي التزامات.",
                'recommended_units' => [],
                'is_hot_lead' => true,
                'quick_replies' => ['تواصل واتساب لحجز معاينة', 'ورّيني أحدث الوحدات المتاحة'],
            ];
        }

        // 10. Registration Fees / مصاريف التسجيل والعقد
        if (preg_match('/(مصاريف التسجيل|تكاليف التسجيل|رسوم التسجيل|رسوم الشهر العقاري|الشهر العقاري|عقد الشراء|registration fees|legal fees|notary)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "**Property Registration & Legal Fees in Egypt (2024-2025):**\n\n📋 **Breakdown:**\n• **Notarization:** ~1.5% to 3% of declared value at Notary Office\n• **Real Estate Registration (Shahr Aqari):** 2.5% of stated value\n• **Stamp Duty:** 0.3% of contract value\n• **Lawyer Fees (optional):** 1% to 2%\n\n💡 Always keep original contracts & receipts. Off-plan units may have deferred registration timelines.",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => ['Connect with legal advisor', 'Ready-to-register properties', 'Cash discount properties'],
                ];
            }
            return [
                'reply' => "**مصاريف التسجيل العقاري في مصر (2024-2025):**\n\n📋 **التفاصيل:**\n• **رسوم التوثيق:** حوالي 1.5% إلى 3% من القيمة المُعلنة\n• **رسوم الشهر العقاري:** 2.5% من القيمة المُسجلة\n• **رسوم الدمغة:** 0.3% من قيمة العقد\n• **أتعاب المحامي (اختياري):** 1% إلى 2%\n\n💡 احتفظ دائماً بالعقود الأصلية والإيصالات. الوحدات على الخريطة قد يكون لها مواعيد تسجيل مؤجلة.",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => ['أحتاج مستشار قانوني', 'وحدات جاهزة للتسجيل', 'شقق بخصم كاش'],
            ];
        }

        // 11. Bank Mortgage / تمويل بنكي
        if (preg_match('/(تمويل بنكي|قرض بنكي|قرض عقاري|رهن عقاري|mortgage|bank loan|bank finance)/iu', $text)) {
            if ($locale === 'en') {
                return [
                    'reply' => "**Bank Mortgage Financing in Egypt:**\n\n🏦 Key facts:\n• **Loan-to-Value:** Up to 80% for ready units\n• **Duration:** 5 to 20 years\n• **Interest Rate:** 10%–16% annually (declining balance)\n• **Eligibility:** Registered units with clear title deed\n\n⚠️ Off-plan units typically don't qualify until full registration.\n\n💡 Most of our developer partners offer **0% interest internal installment plans** — often a better deal than bank loans.",
                    'recommended_units' => [],
                    'is_hot_lead' => false,
                    'quick_replies' => ['Show installment properties', 'Compare loan vs installments', 'Connect with financial advisor'],
                ];
            }
            return [
                'reply' => "**التمويل العقاري البنكي في مصر:**\n\n🏦 أهم المعلومات:\n• **نسبة التمويل:** تصل إلى 80% للوحدات الجاهزة\n• **مدة التمويل:** من 5 إلى 20 سنة\n• **سعر الفائدة:** 10% إلى 16% سنوياً (متناقص)\n• **الوحدات المؤهلة:** وحدات مسجلة بسند واضح\n\n⚠️ الوحدات على الخريطة عادةً لا تؤهل للتمويل إلا بعد اكتمال التسجيل.\n\n💡 معظم شركاء المطورين يقدمون **أقساطاً داخلية بدون فوائد** وهي غالباً أفضل من القرض البنكي.",
                'recommended_units' => [],
                'is_hot_lead' => false,
                'quick_replies' => ['وحدات بالتقسيط بدون فوائد', 'قارن التقسيط مع القرض', 'تحدث مع مستشار مالي'],
            ];
        }

        // 12. Immediate Delivery / استلام فوري
        if (preg_match('/(استلام فوري|استلام حالي|تسليم فوري|تسليم حالي|جاهز للسكن|شقق جاهزة|وحدات جاهزة|ready to move|immediate delivery)/iu', $text)) {
            $units = Unit::where('is_active', true)
                ->where(fn($q) => $q->where('delivery_date', '<=', now()->addMonths(6))->orWhereNull('delivery_date'))
                ->with(['area', 'type', 'images', 'user', 'project'])
                ->orderByDesc('is_pinned')
                ->orderByDesc('priority_points')
                ->take(4)
                ->get();

            $formattedCards = $this->formatUnitCards($units->all(), $locale);

            if ($locale === 'en') {
                return [
                    'reply' => !$units->isEmpty()
                        ? "Great choice — ready-to-move units give you **immediate rental income** without construction delays! Here are available units: [SHOW_CARDS]"
                        : "Ready unit availability changes frequently. Contact our team for the latest: [{$whatsapp}]({$whatsappUrl})",
                    'recommended_units' => $formattedCards,
                    'is_hot_lead' => true,
                    'quick_replies' => ['Book a site visit', 'Calculate installments', 'Contact sales team'],
                ];
            }
            return [
                'reply' => !$units->isEmpty()
                    ? "خيار ممتاز — الوحدات الجاهزة تمنحك **دخلاً إيجارياً فورياً** بدون انتظار! إليك الوحدات الجاهزة المتاحة: [SHOW_CARDS]"
                    : "توافر الوحدات الجاهزة يتغير باستمرار. تواصل مع فريقنا لأحدث ما لدينا: [اضغط هنا للواتساب]({$whatsappUrl})",
                'recommended_units' => $formattedCards,
                'is_hot_lead' => true,
                'quick_replies' => ['احجز معاينة', 'احسب القسط الشهري', 'تحدث مع المبيعات'],
            ];
        }

        return null;
    }

    /**
     * Match against dynamic self-learned and admin-custom Q&A base.
     */
    private function matchLearnedKnowledge(string $normalized, string $locale): ?array
    {
        try {
            $knowledge = $this->loadKnowledge();

            if (empty($knowledge)) {
                return null;
            }

            foreach ($knowledge as $key => $item) {
                // Skip if deactivated by admin
                if (isset($item['is_active']) && $item['is_active'] === false) {
                    continue;
                }

                if (($item['locale'] ?? 'ar') !== $locale) {
                    continue;
                }

                // 1. Keyword-based matching for admin custom Q&A
                if (!empty($item['keywords']) && is_array($item['keywords'])) {
                    foreach ($item['keywords'] as $kw) {
                        $normKw = $this->normalizeText($kw);
                        if (!empty($normKw) && (str_contains($normalized, $normKw) || str_contains($normKw, $normalized))) {
                            $this->incrementHit($key);
                            return [
                                'reply' => $item['reply'],
                                'recommended_units' => [],
                                'is_hot_lead' => !empty($item['is_hot_lead']),
                                'quick_replies' => $item['quick_replies'] ?? [],
                            ];
                        }
                    }
                }

                $storedNormalized = $item['normalized'] ?? '';
                if (empty($storedNormalized)) {
                    continue;
                }

                // 2. Exact match
                if ($normalized === $storedNormalized) {
                    $this->incrementHit($key);
                    return [
                        'reply' => $item['reply'],
                        'recommended_units' => [],
                        'is_hot_lead' => !empty($item['is_hot_lead']),
                        'quick_replies' => $item['quick_replies'] ?? [],
                    ];
                }

                // 3. Semantic overlap (similarity > 82%)
                similar_text($normalized, $storedNormalized, $percent);
                if ($percent >= 82) {
                    $this->incrementHit($key);
                    return [
                        'reply' => $item['reply'],
                        'recommended_units' => [],
                        'is_hot_lead' => !empty($item['is_hot_lead']),
                        'quick_replies' => $item['quick_replies'] ?? [],
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::warning('HossamKnowledgeService matchLearnedKnowledge error', ['error' => $e->getMessage()]);
        }

        return null;
    }

    /**
     * Load knowledge items from cache or storage.
     */
    public function loadKnowledge(): array
    {
        return Cache::remember(self::KNOWLEDGE_CACHE_KEY, 86400, function () {
            $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
            if (file_exists($storagePath)) {
                $raw = @file_get_contents($storagePath);
                return json_decode($raw, true) ?: [];
            }
            return [];
        });
    }

    /**
     * Increment hits count for a knowledge item.
     */
    private function incrementHit(string $key): void
    {
        try {
            $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
            $knowledge = [];
            if (file_exists($storagePath)) {
                $raw = @file_get_contents($storagePath);
                $knowledge = json_decode($raw, true) ?: [];
            }
            if (isset($knowledge[$key])) {
                $knowledge[$key]['hits'] = ($knowledge[$key]['hits'] ?? 0) + 1;
                @file_put_contents($storagePath, json_encode($knowledge, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
                Cache::put(self::KNOWLEDGE_CACHE_KEY, $knowledge, 86400 * 30);
            }
        } catch (\Throwable $e) {
            // Silently ignore
        }
    }

    /**
     * Get all knowledge items formatted for admin dashboard.
     */
    public function getAllItems(): array
    {
        $knowledge = $this->loadKnowledge();
        $items = [];

        foreach ($knowledge as $key => $data) {
            $items[] = [
                'id' => $key,
                'question' => $data['question'] ?? '',
                'reply' => $data['reply'] ?? '',
                'keywords' => $data['keywords'] ?? [],
                'quick_replies' => $data['quick_replies'] ?? [],
                'locale' => $data['locale'] ?? 'ar',
                'is_active' => $data['is_active'] ?? true,
                'is_custom' => $data['is_custom'] ?? false,
                'hits' => (int) ($data['hits'] ?? 0),
                'learned_at' => $data['learned_at'] ?? null,
            ];
        }

        // Sort by hits desc then learned_at desc
        usort($items, function ($a, $b) {
            if ($b['hits'] !== $a['hits']) {
                return $b['hits'] <=> $a['hits'];
            }
            return strcmp($b['learned_at'] ?? '', $a['learned_at'] ?? '');
        });

        return $items;
    }

    /**
     * Save (create or update) a custom or reviewed knowledge item.
     */
    public function saveItem(array $data, ?string $id = null): string
    {
        $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
        $knowledge = [];
        if (file_exists($storagePath)) {
            $raw = @file_get_contents($storagePath);
            $knowledge = json_decode($raw, true) ?: [];
        }

        $question = trim((string) ($data['question'] ?? ''));
        $reply = trim((string) ($data['reply'] ?? ''));
        $locale = $data['locale'] ?? 'ar';
        $normalized = $this->normalizeText($question);

        $key = $id ?: md5($normalized . '_' . $locale . '_' . uniqid());

        // Process keywords
        $keywords = [];
        if (!empty($data['keywords'])) {
            if (is_array($data['keywords'])) {
                $keywords = array_values(array_filter(array_map('trim', $data['keywords'])));
            } else {
                $keywords = array_values(array_filter(array_map('trim', explode(',', (string) $data['keywords']))));
            }
        }

        // Process quick replies
        $quickReplies = [];
        if (!empty($data['quick_replies'])) {
            if (is_array($data['quick_replies'])) {
                $quickReplies = array_values(array_filter(array_map('trim', $data['quick_replies'])));
            } else {
                $quickReplies = array_values(array_filter(array_map('trim', explode(',', (string) $data['quick_replies']))));
            }
        }

        $existing = $knowledge[$key] ?? [];

        $knowledge[$key] = [
            'question' => $question,
            'normalized' => $normalized,
            'reply' => $reply,
            'keywords' => $keywords,
            'quick_replies' => $quickReplies,
            'locale' => $locale,
            'is_active' => isset($data['is_active']) ? (bool) $data['is_active'] : ($existing['is_active'] ?? true),
            'is_custom' => true, // marked as admin verified/custom
            'is_hot_lead' => isset($data['is_hot_lead']) ? (bool) $data['is_hot_lead'] : ($existing['is_hot_lead'] ?? false),
            'learned_at' => $existing['learned_at'] ?? date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'hits' => (int) ($existing['hits'] ?? 0),
        ];

        @file_put_contents($storagePath, json_encode($knowledge, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        Cache::put(self::KNOWLEDGE_CACHE_KEY, $knowledge, 86400 * 30);

        return $key;
    }

    /**
     * Delete a knowledge item.
     */
    public function deleteItem(string $id): bool
    {
        $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
        if (!file_exists($storagePath)) {
            return false;
        }

        $raw = @file_get_contents($storagePath);
        $knowledge = json_decode($raw, true) ?: [];

        if (!isset($knowledge[$id])) {
            return false;
        }

        unset($knowledge[$id]);
        @file_put_contents($storagePath, json_encode($knowledge, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        Cache::put(self::KNOWLEDGE_CACHE_KEY, $knowledge, 86400 * 30);

        return true;
    }

    /**
     * Toggle active/inactive status for a knowledge item.
     */
    public function toggleStatus(string $id): bool
    {
        $storagePath = storage_path('app/' . self::KNOWLEDGE_FILE);
        if (!file_exists($storagePath)) {
            return false;
        }

        $raw = @file_get_contents($storagePath);
        $knowledge = json_decode($raw, true) ?: [];

        if (!isset($knowledge[$id])) {
            return false;
        }

        $current = $knowledge[$id]['is_active'] ?? true;
        $knowledge[$id]['is_active'] = !$current;

        @file_put_contents($storagePath, json_encode($knowledge, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        Cache::put(self::KNOWLEDGE_CACHE_KEY, $knowledge, 86400 * 30);

        return $knowledge[$id]['is_active'];
    }

    /**
     * Get knowledge statistics for dashboard.
     */
    public function getStats(): array
    {
        $knowledge = $this->loadKnowledge();
        $totalItems = count($knowledge);
        $customCount = 0;
        $learnedCount = 0;
        $totalHits = 0;

        foreach ($knowledge as $item) {
            if (!empty($item['is_custom'])) {
                $customCount++;
            } else {
                $learnedCount++;
            }
            $totalHits += (int) ($item['hits'] ?? 0);
        }

        $frequencies = Cache::get(self::FAQ_FREQUENCY_KEY, []);
        arsort($frequencies);
        $topFrequent = array_slice($frequencies, 0, 10, true);

        return [
            'total_items' => $totalItems,
            'custom_count' => $customCount,
            'learned_count' => $learnedCount,
            'total_hits' => $totalHits,
            'top_frequent' => $topFrequent,
        ];
    }

    /**
     * Reset and warm knowledge cache.
     */
    public function clearCache(): void
    {
        Cache::forget(self::KNOWLEDGE_CACHE_KEY);
        $this->loadKnowledge();
    }

    /**
     * Record question frequency for intelligent ranking and analytics.
     */
    public function recordQuestionFrequency(string $normalized): void
    {
        try {
            $frequencies = Cache::get(self::FAQ_FREQUENCY_KEY, []);
            $frequencies[$normalized] = ($frequencies[$normalized] ?? 0) + 1;
            // Keep top 200 tracked questions
            if (count($frequencies) > 200) {
                arsort($frequencies);
                $frequencies = array_slice($frequencies, 0, 200, true);
            }
            Cache::put(self::FAQ_FREQUENCY_KEY, $frequencies, 86400 * 30);
        } catch (\Throwable $e) {
            // Silently ignore
        }
    }

    /**
     * Format unit models into lightweight frontend cards.
     */
    public function formatUnitCards(array $units, string $locale): array
    {
        $cards = [];
        $settingsWhatsapp = $this->settingsService->get('company_whatsapp', '');
        $settingsPhone = $this->settingsService->get('phone', '');

        foreach ($units as $u) {
            $slug = $locale === 'ar' ? ($u->slug_ar ?? $u->slug) : ($u->slug_en ?? $u->slug);
            $firstImg = $u->images?->firstWhere('is_primary', true) ?? $u->images?->first();
            $imageUrl = $firstImg ? asset('storage/' . $firstImg->path) : asset('images/fallback.webp');

            $whatsapp = $u->user?->whatsapp ?? $u->user?->phone ?? $settingsWhatsapp ?: $settingsPhone;
            $cleanWhatsapp = preg_replace('/[^\d]/', '', (string) $whatsapp);
            $whatsappText = $locale === 'en'
                ? 'Hello, I would like to inquire about property: ' . $u->name
                : 'مرحباً، أستفسر بخصوص العقار: ' . $u->name;
            $whatsappUrl = !empty($cleanWhatsapp)
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

    /**
     * Normalize Arabic & English text for robust matching.
     */
    public function normalizeText(string $text): string
    {
        $text = mb_strtolower(trim($text), 'UTF-8');
        // Normalize Arabic digits
        $eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        $western = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $text = str_replace($eastern, $western, $text);

        // Normalize Arabic letters (أ، إ، آ -> ا / ة -> ه / ى -> ي)
        $text = preg_replace('/[أإآ]/u', 'ا', $text);
        $text = preg_replace('/ة/u', 'ه', $text);
        $text = preg_replace('/ى/u', 'ي', $text);

        // Remove diacritics / tashkeel
        $text = preg_replace('/[\x{064B}-\x{065F}\x{0670}]/u', '', $text);

        // Remove punctuation
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);
        return trim(preg_replace('/\s+/u', ' ', $text));
    }

    /**
     * Get live currency exchange rate context.
     */
    private function getLiveCurrencyRates(string $locale): string
    {
        try {
            return Cache::remember('live_currency_rates_' . $locale, 3600 * 4, function () use ($locale) {
                $response = Http::timeout(4)->get('https://api.exchangerate-api.com/v4/latest/USD');
                if ($response->successful()) {
                    $data = $response->json();
                    $egp = $data['rates']['EGP'] ?? null;
                    $eur = $data['rates']['EUR'] ?? null;

                    if ($egp && $eur) {
                        $eurToEgp = $egp / $eur;
                        if ($locale === 'en') {
                            return "💱 **Live Market Currency Rates Today:**\n\n• **USD to EGP:** " . round($egp, 2) . " EGP\n• **EUR to EGP:** " . round($eurToEgp, 2) . " EGP\n\nWould you like to calculate property prices or installment values in USD or EGP?";
                        }
                        return "💱 **أسعار العملات الحية المحدثة اليوم:**\n\n• **الدولار الأمريكي (USD):** " . round($egp, 2) . " جنيه مصري\n• **اليورو الأوروبي (EUR):** " . round($eurToEgp, 2) . " جنيه مصري\n\nتحب نحسب سعر أي وحدة أو إجمالي التقسيط بالدولار أو بالجنيه؟";
                    }
                }
                return '';
            });
        } catch (\Throwable $e) {
            return '';
        }
    }
}


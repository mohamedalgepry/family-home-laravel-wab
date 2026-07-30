<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\PageSeo;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class GenerateSeoKeywordsCommand extends Command
{
    protected $signature = 'seo:generate-keywords {--force : Overwrite existing custom keywords}';
    protected $description = 'Generate rich SEO keywords for pages, units, projects, and articles automatically';

    public function handle(): int
    {
        $this->info('Generating SEO Keywords for Family Home Real Estate...');

        $force = $this->option('force');

        // 1. Generate for Static Pages (page_seo table)
        $pages = [
            'home' => [
                'meta_title_ar' => 'فاميلي هوم للعقارات في مصر | شقق، فلل، صفقات عقارية بالتقسيط بالجنيه المصري',
                'meta_title_en' => 'Family Home Real Estate Egypt | Apartments, Villas & Property Deals in EGP',
                'meta_description_ar' => 'ابحث عن شقتك أو فيلتك المستقبلية بأفضل الأسعار وأنظمة السداد بالتقسيط بالجنيه المصري مع فاميلي هوم العقارية. اكتشف أحدث الكمبوندات والمشاريع السكنية والتجارية في القاهرة الجديدة، التجمع الخامس، الشيخ زايد، والعاصمة الإدارية.',
                'meta_description_en' => 'Find your dream home with Family Home Real Estate Egypt. Explore top apartments, luxury villas, and commercial properties for sale in EGP with flexible installment payment plans across Egypt.',
                'ar' => [
                    'عقارات مصر', 'شقق للبيع في مصر', 'فيلا للبيع بالجنيه المصري', 'عقارات فاميلي هوم', 'فاميلي هوم العقارية',
                    'عقارات للبيع في القاهرة', 'أسعار العقارات بالجنيه', 'استثمار عقاري في مصر', 'شقق للبيع بالتقسيط', 'شقق تمليك مصر',
                    'فلل للبيع القاهرة', 'محلات للبيع بالتقسيط', 'مكاتب إدارية للبيع', 'شقق للبيع في التجمع الخامس', 'شقق للبيع في الشيخ زايد',
                    'عقارات العاصمة الإدارية', 'كمبوندات القاهرة الجديدة', 'أحدث العقارات والمشاريع في مصر', 'أدوار كاملة للبيع',
                    'بنتهاوس للبيع مصر', 'دوبلكس للبيع التجمع', 'شقق للبيع في 6 أكتوبر', 'شقق للبيع في الساحل الشمالي', 'أسعار العقارات اليوم في مصر',
                    'دليل العقارات المصري', 'مكتب عقارات معتمد في مصر', 'وسيط عقاري موثوق مصر', 'شقق فاخرة للبيع القاهرة', 'فلل مودرن للبيع',
                    'عقارات تجارية للبيع مصر', 'أراضي للبيع في مصر', 'أراضي استثمارية', 'شاليهات للبيع الساحل', 'شقق مفروشة للبيع بالقاهرة',
                    'طرق السداد بالتقسيط بالجنيه', 'عقارات بدون مقدم مصر', 'شقق بالتقسيط المريح', 'عقارات الاستثمار في مصر',
                    'عقارات مميزة للبيع مصر', 'أفضل أسعار العقارات بالجنيه', 'حاسبة التمويل العقاري مصر', 'مستشار عقاري مجاني مصر',
                    'شقق للبيع بيت الوطن', 'شقق للبيع النرجس الجديدة', 'شقق للبيع اللوتس التجمع', 'شقق للبيع القرنفل التجمع',
                    'فلل للبيع الثورة الخضراء', 'كمبوندات السلسلة الذهبية', 'شقق للبيع بالتقسيط على 10 سنوات', 'عقارات استلام فوري مصر'
                ],
                'en' => [
                    'family home real estate egypt', 'properties for sale in egypt', 'apartments for sale cairo', 'villas for sale egypt', 'real estate investment egypt',
                    'luxury apartments cairo', 'installment properties egp', 'real estate egypt', 'cairo properties', 'new cairo real estate',
                    'commercial properties for sale egypt', 'administrative offices cairo', 'duplex for sale new cairo',
                    'penthouse for sale sheikh zayed', 'gated community compounds egypt', 'new cairo apartments', 'sheikh zayed villas', 'north coast chalets for sale',
                    'prime location properties egypt', 'family home properties', 'buy apartment egypt online', 'best property deals cairo',
                    'flexible payment plans egp', 'zero downpayment properties egypt', 'property valuation egypt', 'real estate broker cairo',
                    'ready to move apartments cairo', 'long term installment properties cairo', 'beit el watan apartments for sale', 'narges new cairo properties'
                ]
            ],
            'units_index' => [
                'meta_title_ar' => 'دليل العقارات والوحدات السكنية والتجارية للبيع في مصر | فاميلي هوم',
                'meta_title_en' => 'Egypt Real Estate Directory | Buy Apartments & Villas in EGP | Family Home',
                'meta_description_ar' => 'تصفح أكبر دليل للوحدات العقارية السكنية والتجارية والإدارية والطبية في مصر بالجنيه المصري. ابحث عن شقق، فلل، بنتهاوس، ومحلات للبيع بالتقسيط المريح أو الكاش.',
                'meta_description_en' => 'Browse the largest property directory for residential and commercial units in Egypt priced in EGP. Filter apartments, villas, townhouses, and offices with flexible payment terms.',
                'ar' => [
                    'دليل الوحدات العقارية بمصر', 'البحث عن شقة بالقاهرة', 'شقق للبيع المباشر مصر', 'فيلا للبيع بالتقسيط مصر', 'عقارات سكنية مصر',
                    'شقق مفروشة القاهرة', 'استوديو للبيع مصر', 'دوبلكس للبيع مصر', 'تاون هاوس للبيع التجمع', 'توين هاوس للبيع زايد', 'شقق للبيع بالتجمع الخامس',
                    'شقق للبيع بالشيخ زايد', 'شقق للبيع بالعاصمة الإدارية', 'مكاتب للبيع بالتقسيط مصر', 'عيادات للبيع بالقاهرة', 'محلات تجارية للبيع مصر',
                    'وحدات سكنية للبيع مصر', 'وحدات تجارية للبيع مصر', 'وحدات إدارية للبيع مصر', 'وحدات طبية للبيع مصر', 'أسعار الشقق اليوم في مصر',
                    'ارخص شقق للبيع بمصر', 'شقق للبيع من المالك مباشرة مصر', 'وحدات عقارية بالتقسيط بدون فوائد بالجنيه', 'مشاريع سكنية حديثة بمصر',
                    'أسعار متر الشقق في التجمع', 'أسعار الشقق في الشيخ زايد', 'شقق نصف تشطيب للبيع مصر', 'شقق تشطيب كامل سوبر لوكس للبيع',
                    'محلات للبيع العاصمة الإدارية', 'مكاتب للبيع بالتجمع الخامس', 'عيادات طبية للبيع الشيخ زايد', 'شقق أرضي بحديقة للبيع مصر'
                ],
                'en' => [
                    'egypt properties directory', 'search apartments cairo', 'villas directory egypt', 'commercial units for sale cairo', 'office space for sale egp',
                    'medical clinics for sale egypt', 'retail shops for sale cairo', 'studio apartments for sale egypt', 'townhouse for sale new cairo', 'twin house for sale zayed',
                    'residential units egypt', 'properties by owner egypt', 'cheap apartments for sale cairo', 'luxury units for sale egypt', 'no interest payment plans egp',
                    'fully finished apartments for sale cairo', 'core and shell properties egypt', 'ground floor apartments with garden cairo', 'cairo property price per meter'
                ]
            ],
            'projects_index' => [
                'meta_title_ar' => 'دليل الكمبوندات والمشاريع العقارية الحديثة في مصر | فاميلي هوم',
                'meta_title_en' => 'New Real Estate Compounds & Malls in Egypt | Family Home',
                'meta_description_ar' => 'اكتشف أحدث المشروعات والكمبوندات السكنية والتجارية في التجمع الخامس، الشيخ زايد، العاصمة الإدارية، والساحل الشمالي بأفضل العروض وأنظمة السداد بالجنيه المصري.',
                'meta_description_en' => 'Explore top new residential compounds and commercial malls in New Cairo, Sheikh Zayed, New Capital, and North Coast with flexible EGP payment plans.',
                'ar' => [
                    'المشاريع العقارية في مصر', 'دليل كمبوندات مصر', 'أحدث المشروعات السكنية بمصر', 'كمبوندات التجمع الخامس', 'كمبوندات الشيخ زايد',
                    'مشاريع العاصمة الإدارية الجديدة', 'مشاريع الساحل الشمالي', 'مشاريع العين السخنة', 'مشاريع 6 أكتوبر',
                    'مولات تجارية جديدة بالقاهرة', 'أبراج إدارية العاصمة', 'مشاريع الشركات العقارية المصرية', 'مشاريع تسليم فوري بمصر', 'مشاريع تحت الإنشاء مصر',
                    'أفضل كمبوند سكني في مصر', 'مشاريع فاميلي هوم', 'أسعار الكمبوندات اليوم في مصر', 'استثمار في المشاريع العقارية بمصر',
                    'دليل مطوري العقارات بمصر', 'كمبوندات المستقبل سيتي', 'كمبوندات الشروق', 'كمبوندات العبور', 'مشروعات رأس الحكمة الساحل الشمالي'
                ],
                'en' => [
                    'real estate projects egypt', 'compound directory egypt', 'new residential compounds cairo', 'new cairo compounds', 'sheikh zayed compounds',
                    'new capital projects egypt', 'north coast projects', 'ain sokhna projects', 'october compounds egypt', 'commercial malls new capital',
                    'under construction projects egypt', 'ready to move compounds cairo', 'top compound developers egypt', 'family home projects',
                    'mostakbal city compounds', 'ras el hekma north coast projects', 'top egyptian real estate developers'
                ]
            ],
            'deals' => [
                'meta_title_ar' => 'أقوى الصفقات والعروض العقارية الحصرية في مصر | فاميلي هوم',
                'meta_title_en' => 'Hot Real Estate Property Deals in Egypt (EGP) | Family Home',
                'meta_description_ar' => 'احصل على أفضل الصفقات والعروض العقارية الحصرية بمصر بأسعار استثنائية بالجنيه المصري وبدون مقدم أو خصومات فورية للسداد النقدي.',
                'meta_description_en' => 'Unlock hot property deals in Egypt, zero downpayment offers in EGP, and exclusive cash discounts on prime Egyptian real estate developments.',
                'ar' => [
                    'صفقات عقارية بمصر', 'عروض العقارات في مصر', 'تخفيضات الشقق والفلل بالقاهرة', 'عروض التقسيط المريح بالجنيه', 'عروض العقارات بدون مقدم مصر',
                    'صفقات شقق التجمع', 'صفقات الفلل والكمبوندات بمصر', 'فرص استثمارية عقارية بمصر', 'أقل سعر متر في مصر', 'شقق للبيع بسعر اللقطة بالقاهرة',
                    'عقارات للبيع بسعر الكاش مصر', 'خصومات السداد النقدي بالجنيه', 'صفقات فاميلي هوم الحصرية بمصر',
                    'خصومات الرواد العقارية', 'خصومات الحجز المبكر للكمبوندات', 'شقق للبيع بسعر الافتتاح مصر'
                ],
                'en' => [
                    'exclusive property deals egypt', 'discounted apartments cairo', 'hot real estate offers egypt', 'zero downpayment deals egp', 'cash discount properties cairo',
                    'below market price properties egypt', 'best investment deals cairo', 'family home hot deals egypt', 'limited time property offers cairo',
                    'early bird discount properties egypt', 'launch prices real estate cairo'
                ]
            ],
            'articles_index' => [
                'meta_title_ar' => 'مدونة العقارات والاستثمار في مصر | نصائح وأخبار السوق | فاميلي هوم',
                'meta_title_en' => 'Egypt Real Estate Blog & Investment Guides | Family Home',
                'meta_description_ar' => 'تابِع أحدث المقالات والأخبار العقارية وتحليلات السوق المصري، ونصائح شراء العقارات والاستثمار الناجح في مصر بالجنيه المصري.',
                'meta_description_en' => 'Stay updated with Egyptian real estate market trends, property investment advice in EGP, and comprehensive buyer guides.',
                'ar' => [
                    'أخبار العقارات في مصر', 'مقالات استثمار عقاري مصر', 'دليل الشراء العقاري في مصر', 'نصائح شراء شقة بالقاهرة', 'أفضل مناطق الاستثمار العقاري بمصر',
                    'مستقبل العقارات في مصر', 'كيف تختار بيتك الأول بمصر', 'قوانين التمويل العقاري المصري', 'تحليل أسعار العقارات بالجنيه',
                    'مدونة فاميلي هوم مصر', 'أخبار التجمع والعاصمة الإدارية', 'مقارنات الكمبوندات العقارية بمصر',
                    'نصائح التشطيب والديكور بمصر', 'كيف تحسب عائد الاستثمار العقاري', 'دليل الاستثمار في المحلات والمكاتب'
                ],
                'en' => [
                    'egypt real estate news', 'property investment blog cairo', 'buying guide egypt', 'real estate market analysis cairo', 'first time home buyer tips egypt',
                    'cairo real estate trends', 'new capital news egypt', 'family home blog',
                    'roi real estate calculation egypt', 'commercial property investment tips cairo'
                ]
            ],
            'about' => [
                'meta_title_ar' => 'عن شركة فاميلي هوم العقارية في مصر | الرؤية والخبرة',
                'meta_title_en' => 'About Family Home Real Estate Egypt | Our Vision & Expertise',
                'meta_description_ar' => 'تعرف على شركة فاميلي هوم العقارية في مصر، رؤيتنا في تقديم أفضل الحلول والخدمات الاستشارية والتسويقية للعملاء في سوق العقارات المصري.',
                'meta_description_en' => 'Learn more about Family Home Real Estate Egypt, our expertise, values, and commitment to providing top-tier real estate advisory services in Cairo.',
                'ar' => ['عن فاميلي هوم بمصر', 'شركة فاميلي هوم العقارية بمصر', 'رؤية فاميلي هوم مصر', 'خدمات التسويق العقاري بمصر', 'خبراء العقارات بمصر', 'قصة نجاح فاميلي هوم', 'فريق الاستشارات العقارية مصر'],
                'en' => ['about family home egypt', 'family home real estate company egypt', 'real estate advisory cairo', 'our real estate experts egypt', 'family home mission and vision']
            ],
            'contact' => [
                'meta_title_ar' => 'تواصل مع فاميلي هوم العقارية في مصر | خدمة العملاء وحجز المعاينات',
                'meta_title_en' => 'Contact Family Home Real Estate Egypt | Book a Property Viewing',
                'meta_description_ar' => 'تواصل مع مستشارينا العقاريين في فاميلي هوم مصر للاستفسار عن أي وحدة أو مشروع عقاري بالقاهرة والمحافظات أو لحجز معاينة موقعية.',
                'meta_description_en' => 'Get in touch with Family Home real estate consultants in Egypt for inquiries, property viewings, and personalized assistance.',
                'ar' => ['تواصل مع فاميلي هوم مصر', 'رقم هاتف فاميلي هوم', 'فرع الشركة العقارية بالقاهرة', 'خدمة العملاء العقارية مصر', 'حجز معاينة عقارية بالقاهرة', 'عنوان شركة فاميلي هوم العقارية'],
                'en' => ['contact family home egypt', 'family home phone number cairo', 'real estate customer service egypt', 'book property viewing cairo', 'family home office address cairo']
            ],
        ];

        $pageCount = 0;
        foreach ($pages as $key => $kw) {
            $record = PageSeo::firstOrCreate(['page_key' => $key]);

            $existingAr = is_array($record->meta_keywords_ar) ? $record->meta_keywords_ar : [];
            $existingEn = is_array($record->meta_keywords_en) ? $record->meta_keywords_en : [];

            $mergedAr = array_values(array_unique(array_merge($existingAr, $kw['ar'])));
            $mergedEn = array_values(array_unique(array_merge($existingEn, $kw['en'])));

            $updateData = [
                'meta_keywords_ar' => $mergedAr,
                'meta_keywords_en' => $mergedEn,
            ];

            if ($force || empty($record->meta_title_ar)) {
                $updateData['meta_title_ar'] = $kw['meta_title_ar'];
            }
            if ($force || empty($record->meta_title_en)) {
                $updateData['meta_title_en'] = $kw['meta_title_en'];
            }
            if ($force || empty($record->meta_description_ar)) {
                $updateData['meta_description_ar'] = $kw['meta_description_ar'];
            }
            if ($force || empty($record->meta_description_en)) {
                $updateData['meta_description_en'] = $kw['meta_description_en'];
            }

            $record->update($updateData);
            $pageCount++;
        }
        $this->info("Updated {$pageCount} static page SEO records.");

        // 2. Generate for Units
        $unitCount = 0;
        Unit::with(['type', 'area'])->chunk(200, function ($units) use (&$unitCount, $force) {
            foreach ($units as $unit) {
                if (!$force && !empty($unit->keywords_ar) && count($unit->keywords_ar) > 10) {
                    continue;
                }

                $titleAr = $unit->title_ar ?? $unit->title ?? '';
                $titleEn = $unit->title_en ?? $unit->title ?? '';
                $type = $unit->type?->name ?? 'شقة';
                $area = $unit->area?->name ?? 'مصر';

                $autoKwAr = [
                    $titleAr,
                    "{$type} للبيع في {$area}",
                    "أسعار ال{$type} في {$area}",
                    "{$type} بالتقسيط في {$area}",
                    "عقارات {$area}",
                    "شقق وفلل للبيع في {$area}",
                    "وحدات سكنية في {$area}",
                    "أفضل عقارات {$area}",
                    "فاميلي هوم عقارات {$area}",
                    "{$type} تمليك بالتقسيط",
                ];

                $autoKwEn = [
                    $titleEn,
                    "{$type} for sale in {$area}",
                    "property in {$area}",
                    "buy {$type} in {$area}",
                    "installment {$type} {$area}",
                    "real estate {$area}",
                    "family home {$area}",
                ];

                $existingAr = is_array($unit->keywords_ar) ? $unit->keywords_ar : [];
                $existingEn = is_array($unit->keywords_en) ? $unit->keywords_en : [];

                $unit->keywords_ar = array_values(array_unique(array_merge($existingAr, $autoKwAr)));
                $unit->keywords_en = array_values(array_unique(array_merge($existingEn, $autoKwEn)));
                $unit->save();
                $unitCount++;
            }
        });
        $this->info("Generated rich keywords for {$unitCount} Units.");

        // 3. Generate for Projects
        $projectCount = 0;
        Project::with('area')->chunk(200, function ($projects) use (&$projectCount, $force) {
            foreach ($projects as $project) {
                if (!$force && !empty($project->keywords_ar) && count($project->keywords_ar) > 10) {
                    continue;
                }

                $titleAr = $project->name_ar ?? $project->name ?? '';
                $titleEn = $project->name_en ?? $project->name ?? '';
                $area = $project->area?->name ?? 'مصر';

                $autoKwAr = [
                    $titleAr,
                    "مشروع {$titleAr}",
                    "كمبوند {$titleAr}",
                    "أسعار كمبوند {$titleAr}",
                    "شقق للبيع في {$titleAr}",
                    "مشاريع عقارية في {$area}",
                    "كمبوندات {$area}",
                    "استثمار عقاري في {$titleAr}",
                ];

                $autoKwEn = [
                    $titleEn,
                    "compound {$titleEn}",
                    "project {$titleEn}",
                    "apartments for sale in {$titleEn}",
                    "projects in {$area}",
                    "real estate {$titleEn}",
                ];

                $existingAr = is_array($project->keywords_ar) ? $project->keywords_ar : [];
                $existingEn = is_array($project->keywords_en) ? $project->keywords_en : [];

                $project->keywords_ar = array_values(array_unique(array_merge($existingAr, $autoKwAr)));
                $project->keywords_en = array_values(array_unique(array_merge($existingEn, $autoKwEn)));
                $project->save();
                $projectCount++;
            }
        });
        $this->info("Generated rich keywords for {$projectCount} Projects.");

        // 4. Generate for Articles
        $articleCount = 0;
        try {
            Article::chunk(200, function ($articles) use (&$articleCount, $force) {
                foreach ($articles as $article) {
                    if (!$force && !empty($article->keywords_ar) && count($article->keywords_ar) > 5) {
                        continue;
                    }

                    $titleAr = $article->title_ar ?? $article->title ?? '';
                    $titleEn = $article->title_en ?? $article->title ?? '';

                    $autoKwAr = [
                        $titleAr,
                        "أخبار العقارات",
                        "استثمار عقاري",
                        "نصائح عقارية",
                        "فاميلي هوم مقالات",
                    ];

                    $autoKwEn = [
                        $titleEn,
                        "real estate news",
                        "property investment",
                        "family home article",
                    ];

                    if (\Schema::hasColumn('articles', 'keywords_ar')) {
                        $existingAr = is_array($article->keywords_ar) ? $article->keywords_ar : [];
                        $existingEn = is_array($article->keywords_en) ? $article->keywords_en : [];

                        $article->keywords_ar = array_values(array_unique(array_merge($existingAr, $autoKwAr)));
                        $article->keywords_en = array_values(array_unique(array_merge($existingEn, $autoKwEn)));
                        $article->save();
                        $articleCount++;
                    }
                }
            });
            $this->info("Generated rich keywords for {$articleCount} Articles.");
        } catch (\Throwable $e) {}

        // Flush inertia / pageSeo cache if present
        Cache::forget('page_seo');

        $this->info('Successfully completed SEO keywords generation!');
        return Command::SUCCESS;
    }
}

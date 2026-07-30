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
                'title_ar' => 'فاميلي هوم للعقارات | شقق، فلل، صفقات عقارية بالتقسيط في مصر والسعودية',
                'title_en' => 'Family Home Real Estate | Luxury Apartments, Villas & Property Deals in Egypt & KSA',
                'meta_description_ar' => 'ابحث عن شقتك أو فيلتك المستقبلية بأفضل أسعار وأنظمة سداد بالتقسيط مع فاميلي هوم العقارية. اكتشف أحدث الكمبوندات والمشاريع السكنية والتجارية في القاهرة الجديدة والشيخ زايد والعاصمة الإدارية.',
                'meta_description_en' => 'Find your dream home with Family Home Real Estate. Explore top apartments, luxury villas, and commercial properties for sale with flexible installment payment plans across Egypt and Saudi Arabia.',
                'ar' => [
                    'عقارات مصر', 'عقارات السعودية', 'شقق للبيع', 'فيلا للبيع', 'عقارات فاميلي هوم', 'فاميلي هوم العقارية',
                    'عقارات للبيع في القاهرة', 'عقارات الرياض', 'استثمار عقاري', 'شقق للبيع بالتقسيط', 'شقق تمليك',
                    'فلل للبيع', 'محلات للبيع', 'مكاتب إدارية للبيع', 'شقق للبيع في التجمع الخامس', 'شقق للبيع في الشيخ زايد',
                    'عقارات العاصمة الإدارية', 'كمبوندات القاهرة الجديدة', 'أحدث العقارات والمشاريع', 'أدوار كاملة للبيع',
                    'بنتهاوس للبيع', 'دوبلكس للبيع', 'شقق للبيع في جدة', 'شقق للبيع في دبي', 'أسعار العقارات اليوم',
                    'دليل العقارات العربي', 'مكتب عقارات معتمد', 'وسيط عقاري موثوق', 'شقق فاخرة للبيع', 'فلل مودرن للبيع',
                    'عقارات تجارية للبيع', 'أراضي للبيع', 'أراضي استثمارية', 'شاليهات للبيع', 'شقق مفروشة للبيع',
                    'طرق السداد بالتقسيط', 'عقارات بدون مقدم', 'شقق بالتقسيط المريح', 'عقارات الاستثمار الضماني',
                    'عقارات مميزة للبيع', 'أفضل أسعار العقارات', 'حاسبة التمويل العقاري', 'مستشار عقاري مجاني'
                ],
                'en' => [
                    'family home real estate', 'properties for sale', 'apartments for sale', 'villas for sale', 'real estate investment',
                    'luxury apartments', 'installment properties', 'real estate egypt', 'real estate saudi arabia', 'cairo properties',
                    'riyadh real estate', 'commercial properties for sale', 'administrative offices for sale', 'duplex for sale',
                    'penthouse for sale', 'gated community compounds', 'new cairo apartments', 'sheikh zayed villas', 'chalets for sale',
                    'prime location properties', 'family home properties', 'buy apartment online', 'best property deals',
                    'flexible payment plans', 'zero downpayment properties', 'property valuation egypt', 'real estate broker'
                ]
            ],
            'units_index' => [
                'title_ar' => 'دليل العقارات والوحدات السكنية والتجارية للبيع | فاميلي هوم',
                'title_en' => 'Real Estate Units Directory | Buy Apartments, Villas & Offices | Family Home',
                'meta_description_ar' => 'تصفح أكبر دليل للوحدات العقارية السكنية والتجارية والإدارية والطبية. ابحث عن شقق، فلل، بنتهاوس، ومحلات للبيع بالتقسيط المريح أو الكاش.',
                'meta_description_en' => 'Browse the largest property directory for residential and commercial units. Filter apartments, villas, townhouses, and offices for sale with flexible payment terms.',
                'ar' => [
                    'دليل الوحدات العقارية', 'البحث عن شقة', 'شقق للبيع المباشر', 'فيلا للبيع بالتقسيط', 'عقارات سكنية للبيع',
                    'شقق مفروشة', 'استوديو للبيع', 'دوبلكس للبيع', 'تاون هاوس للبيع', 'توين هاوس للبيع', 'شقق للبيع بالتجمع',
                    'شقق للبيع بالشيخ زايد', 'شقق للبيع بالعاصمة الإدارية', 'مكاتب للبيع بالتقسيط', 'عيادات للبيع', 'محلات تجارية للبيع',
                    'وحدات سكنية للبيع', 'وحدات تجارية للبيع', 'وحدات إدارية للبيع', 'وحدات طبية للبيع', 'أسعار الشقق اليوم',
                    'ارخص شقق للبيع', 'شقق للبيع من المالك', 'وحدات عقارية بالتقسيط بدون فوائد', 'مشاريع سكنية حديثة'
                ],
                'en' => [
                    'properties directory', 'search apartments', 'villas directory', 'commercial units for sale', 'office space for sale',
                    'medical clinics for sale', 'retail shops for sale', 'studio apartments for sale', 'townhouse for sale', 'twin house for sale',
                    'residential units egypt', 'properties by owner', 'cheap apartments for sale', 'luxury units for sale', 'no interest payment plans'
                ]
            ],
            'projects_index' => [
                'title_ar' => 'دليل الكمبوندات والمشاريع العقارية الحديثة | فاميلي هوم',
                'title_en' => 'New Real Estate Projects & Compounds Directory | Family Home',
                'meta_description_ar' => 'اكتشف أحدث المشروعات والكمبوندات السكنية والتجارية في التجمع الخامس، الشيخ زايد، العاصمة الإدارية، والساحل الشمالي بأفضل العروض وأنظمة السداد.',
                'meta_description_en' => 'Explore top new residential compounds and commercial malls in New Cairo, Sheikh Zayed, New Capital, and North Coast with verified developers.',
                'ar' => [
                    'المشاريع العقارية', 'دليل الكمبوندات', 'أحدث المشروعات السكنية', 'كمبوندات التجمع الخامس', 'كمبوندات الشيخ زايد',
                    'مشاريع العاصمة الإدارية الجديدة', 'مشاريع الساحل الشمالي', 'مشاريع العين السخنة', 'مشاريع 6 أكتوبر',
                    'مولات تجارية جديدة', 'أبراج إدارية', 'مشاريع الشركات العقارية', 'مشاريع تسليم فوري', 'مشاريع تحت الإنشاء',
                    'أفضل كمبوند سكني', 'مشاريع فاميلي هوم', 'أسعار الكمبوندات اليوم', 'استثمار في المشاريع العقارية'
                ],
                'en' => [
                    'real estate projects', 'compound directory', 'new residential compounds', 'new cairo compounds', 'sheikh zayed compounds',
                    'new capital projects', 'north coast projects', 'ain sokhna projects', 'october compounds', 'commercial malls new capital',
                    'under construction projects', 'ready to move compounds', 'top compound developers', 'family home projects'
                ]
            ],
            'deals' => [
                'title_ar' => 'أقوى الصفقات والعروض العقارية الحصرية | فاميلي هوم',
                'title_en' => 'Exclusive Hot Property Deals & Offers | Family Home',
                'meta_description_ar' => 'احصل على أفضل الصفقات والعروض العقارية الحصرية بأسعار استثنائية وبدون مقدم أو خصومات فورية للسداد النقدي.',
                'meta_description_en' => 'Unlock hot property deals, zero downpayment offers, and exclusive cash discounts on prime real estate developments.',
                'ar' => [
                    'صفقات عقارية حصرياً', 'عروض العقارات', 'تخفيضات الشقق والفلل', 'عروض التقسيط المريح', 'عروض العقارات بدون مقدم',
                    'صفقات شقق التجمع', 'صفقات الفلل والكمبوندات', 'فرص استثمارية عقارية', 'أقل سعر متر في مصر', 'شقق للبيع بسعر اللقطة',
                    'عقارات للبيع بسعر الكاش', 'عروض الكريسماس العقارية', 'خصومات السداد النقدي', 'صفقات فاميلي هوم الحصرية'
                ],
                'en' => [
                    'exclusive property deals', 'discounted apartments', 'hot real estate offers', 'zero downpayment deals', 'cash discount properties',
                    'below market price properties', 'best investment deals', 'family home hot deals', 'limited time property offers'
                ]
            ],
            'articles_index' => [
                'title_ar' => 'مدونة العقارات والاستثمار | نصائح وأخبار العقارات | فاميلي هوم',
                'title_en' => 'Real Estate Blog & Investment Guides | Family Home',
                'meta_description_ar' => 'تابِع أحدث المقالات والأخبار العقارية وتحليلات السوق، ونصائح شراء العقار الأول والاستثمار الناجح في مصر والخليج.',
                'meta_description_en' => 'Stay updated with real estate market trends, property investment advice, and comprehensive buyer guides.',
                'ar' => [
                    'أخبار العقارات', 'مقالات استثمار عقاري', 'دليل الشراء العقاري', 'نصائح شراء شقة', 'أفضل مناطق الاستثمار العقاري',
                    'مستقبل العقارات في مصر والسعودية', 'كيف تختار بيتك الأول', 'قوانين التمويل العقاري', 'تحليل أسعار العقارات',
                    'مدونة فاميلي هوم', 'أخبار التجمع والعاصمة الإدارية', 'مقارنات الكمبوندات العقارية'
                ],
                'en' => [
                    'real estate news', 'property investment blog', 'buying guide egypt', 'real estate market analysis', 'first time home buyer tips',
                    'cairo real estate trends', 'new capital news', 'family home blog'
                ]
            ],
            'about' => [
                'title_ar' => 'عن شركة فاميلي هوم العقارية | الرؤية والخبرة',
                'title_en' => 'About Family Home Real Estate | Our Vision & Expertise',
                'meta_description_ar' => 'تعرف على شركة فاميلي هوم العقارية، رؤيتنا في تقديم أفضل الحلول والخدمات الاستشارية والتسويقية للعملاء في سوق العقارات.',
                'meta_description_en' => 'Learn more about Family Home Real Estate, our expertise, values, and commitment to providing top-tier real estate advisory services.',
                'ar' => ['عن فاميلي هوم', 'شركة فاميلي هوم العقارية', 'رؤية فاميلي هوم', 'خدمات التسويق العقاري', 'خبرائنا العقاريين'],
                'en' => ['about family home', 'family home real estate company', 'real estate advisory', 'our real estate experts']
            ],
            'contact' => [
                'title_ar' => 'تواصل مع فاميلي هوم العقارية | خدمة العملاء وحجز المعاينات',
                'title_en' => 'Contact Family Home Real Estate | Book a Viewing',
                'meta_description_ar' => 'تواصل مع مستشارينا العقاريين في فاميلي هوم للاستفسار عن أي وحدة أو مشروع عقاري أو لحجز معاينة موقعية.',
                'meta_description_en' => 'Get in touch with Family Home real estate consultants for inquiries, property viewings, and personalized assistance.',
                'ar' => ['تواصل مع فاميلي هوم', 'رقم هاتف فاميلي هوم', 'فرع الشركة العقارية', 'خدمة العملاء العقارية', 'حجز معاينة عقارية'],
                'en' => ['contact family home', 'family home phone number', 'real estate customer service', 'book property viewing']
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

            if ($force || empty($record->title_ar)) {
                $updateData['title_ar'] = $kw['title_ar'];
            }
            if ($force || empty($record->title_en)) {
                $updateData['title_en'] = $kw['title_en'];
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

<?php

namespace Database\Seeders;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    // صور الوحدات الموجودة فعلياً في التخزين
    private array $unitImages = [
        'units/2026/07/4c3XaEPl6Lx3FvTMIv9ClC6eUmgaysDNonHaRfoF.png',
        'units/2026/07/7YpbKkq8m3sXC9YnpxZonaGxEfJMozuyxEI4s9p6.png',
        'units/2026/07/AsVDtETbCd0Xb84NnaM7VVy2puINu2Gvxj1Fqgk7.png',
        'units/2026/07/dlkFlyu6rep6VSMMiYRftm29dVI85tCdl52KC389.jpg',
        'units/2026/07/Dt42AP7voai2MPBxQjtxWKzWjEqOa75u7tVgdNH7.png',
        'units/2026/07/eIJ8y2tq36sQ3PHY22m5tziM4cOop5cVDz2dffam.jpg',
        'units/2026/07/j8PTLsHa0cNMCcJw3JZdTTDQj4j7jQz7zJOPoXQ2.png',
        'units/2026/07/JFkZKyBHUzrKjnToHqiY4a8fon6DIcAuMijrvcU3.jpg',
        'units/2026/07/LpEbJxjpWmlg17MihhcynAVrw3LZxm4KscHOt7MW.jpg',
        'units/2026/07/mIdPlHBDShq7ImOUjCRdpmj8coXKDSHno2wzUXHE.png',
        'units/2026/07/NlNyTA1IOh1oj4LNITQgj3Qh88z4YaUYZuld3e4Y.png',
        'units/2026/07/psdXUrOpcGCxnIEttOedXUPhjtJjBQ6VRy89DrUg.png',
        'units/2026/07/RkWhE7KnSzlcYfHHXEJJwdk5cPrZfY4U6DSzbyVb.png',
        'units/2026/07/rW2YQIrMR8UonQz8cdsF5FDZKbeyDPjOqAdMziXE.jpg',
        'units/2026/07/SBxHXmNtGPcYZ3Wj2h1hv9tYMn7ueQednbDWj5wx.png',
        'units/2026/07/UGexE1OGCaLhXtCZklCpto04gZwFpgdsNwmzYbBT.png',
        'units/2026/07/yTmKMCHOVZwd8hYDSHnJMNHvYOKkyfiFJcIzbzjn.jpg',
    ];

    // صور المشاريع الموجودة فعلياً في التخزين
    private array $projectImages = [
        'projects/2026/07/1mUcGouJjdQ5sFyyHLl49aHG3AmlSqYh5liMuxOK.jpg',
        'projects/2026/07/4loAxMR3EkNTNGeVhYDDbUmylVa3XgG4p3aWLmSN.png',
        'projects/2026/07/FiDKmkVIotAVOlrXv6GrXSY1XpzaiFhga9mcy6Uy.jpg',
        'projects/2026/07/geZuAk4VnjLWeEtenT6khSFvISKz7sspdjqjYMGU.png',
        'projects/2026/07/HAtTY08chDTNYRXZ0TjoDKDsH9jS6dBDXIICn4lq.jpg',
        'projects/2026/07/iKkz1XkYsAKddyYqpJ2kPfWNmeQFlZuVJ8VKlCVS.png',
        'projects/2026/07/mjehfFWLBW5IK9UhbT825yz97zyHBachOgvhpDsV.jpg',
        'projects/2026/07/mo3Mp0RWJ5JNjll5Z5VxuWdef1uaLYra3VtpYMJV.jpg',
        'projects/2026/07/nb33iwDTMeAXHKVVmei2m1WaywQgxnplSnKh8JMD.jpg',
        'projects/2026/07/OH01FcZEUMKO6FyYb2ZjjExkmpVFQk7BxT8MyfdC.jpg',
        'projects/2026/07/tF9ZHZCdTDo69c4gm5RS1XD5RfwI0h6F7ATGloYb.png',
        'projects/2026/07/VoupPl4Z8UgZC5IR4UK8EhJUHNakIbQYmsK7danI.png',
        'projects/2026/07/xxxHFBg8qUe0Y4B7OqcGrWmxC5DVSsJSZ3SmCFSL.jpg',
        'projects/2026/07/yy1jUjQK7YxB0oh6O3JCZdxzH9DmtLOelt8lov7G.png',
    ];

    // صور المقارلات والاخبار الموجودة فعلياً في التخزين
    private array $articleImages = [
        'articles/2026/07/i5zT3JMEZvdRB6Wrgk79h3Xo9aWzzATzrKklzkUJ.png',
        'articles/2026/07/mRSgeuBwyTnttwfz9uMZ2RKpmBVyoiiJa6aTH1Kg.png',
    ];

    public function run(): void
    {
        if (app()->environment('production')) {
            if ($this->command) {
                $this->command->error('DemoDataSeeder ممنوع تشغيله في بيئة production.');
            }

            return;
        }

        // ===== 1. المستخدمون =====
        $adminPassword = env('ADMIN_SEED_PASSWORD', Str::random(16));
        $managerPassword = env('MANAGER_SEED_PASSWORD', Str::random(16));
        $agentPassword = env('AGENT_SEED_PASSWORD', Str::random(16));

        $admin = User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'محمد الأدمن',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'is_active' => true,
                'points_balance' => 0,
                'initial_monthly_balance' => 0,
            ]
        );

        $manager = User::updateOrCreate(
            ['email' => 'manager@manager.com'],
            [
                'name' => 'أحمد المدير',
                'password' => Hash::make($managerPassword),
                'role' => 'manager',
                'is_active' => true,
                'points_balance' => 5000,
                'initial_monthly_balance' => 5000,
            ]
        );

        $agent = User::updateOrCreate(
            ['email' => 'agent@agent.com'],
            [
                'name' => 'علي الوكيل',
                'password' => Hash::make($agentPassword),
                'role' => 'agent',
                'is_active' => true,
                'points_balance' => 300,
                'initial_monthly_balance' => 0,
                'manager_id' => $manager->id,
            ]
        );

        if ($this->command) {
            if (empty(env('ADMIN_SEED_PASSWORD'))) {
                $this->command->warn("⚠️ ADMIN_SEED_PASSWORD غير معرف — كلمة سر أدمن التجريبي: {$adminPassword}");
            }
            if (empty(env('MANAGER_SEED_PASSWORD'))) {
                $this->command->warn("⚠️ MANAGER_SEED_PASSWORD غير معرف — كلمة سر مدير التجريبي: {$managerPassword}");
            }
            if (empty(env('AGENT_SEED_PASSWORD'))) {
                $this->command->warn("⚠️ AGENT_SEED_PASSWORD غير معرف — كلمة سر وكيل التجريبي: {$agentPassword}");
            }
        }

        // ===== 2. المناطق =====
        $areas = Area::all()->keyBy('slug');
        if ($areas->isEmpty()) {
            $this->command->warn('لا توجد مناطق. شغّل AreaSeeder أولاً.');

            return;
        }

        // ===== 3. أنواع الوحدات =====
        $unitTypes = UnitType::all()->keyBy('slug');
        if ($unitTypes->isEmpty()) {
            $this->command->warn('لا توجد أنواع وحدات. شغّل UnitTypeSeeder أولاً.');

            return;
        }

        // ===== 4. أنواع التشطيب =====
        $finishing = FinishingType::firstOrCreate(
            ['name_ar' => 'تشطيب كامل'],
            ['name_en' => 'Full Finishing']
        );
        $semiFinishing = FinishingType::firstOrCreate(
            ['name_ar' => 'نصف تشطيب'],
            ['name_en' => 'Semi Finishing']
        );
        $coreShell = FinishingType::firstOrCreate(
            ['name_ar' => 'بدون تشطيب'],
            ['name_en' => 'Core & Shell']
        );

        // ===== 5. المميزات =====
        $features = [];
        $featuresList = [
            ['name_ar' => 'مسبح', 'name_en' => 'Swimming Pool'],
            ['name_ar' => 'جيم', 'name_en' => 'Gym'],
            ['name_ar' => 'حديقة', 'name_en' => 'Garden'],
            ['name_ar' => 'موقف سيارات', 'name_en' => 'Parking'],
            ['name_ar' => 'أمن وحراسة', 'name_en' => 'Security'],
            ['name_ar' => 'مصعد', 'name_en' => 'Elevator'],
            ['name_ar' => 'بلكونة', 'name_en' => 'Balcony'],
            ['name_ar' => 'تكييف مركزي', 'name_en' => 'Central AC'],
        ];
        foreach ($featuresList as $f) {
            $features[] = Feature::firstOrCreate(['name_ar' => $f['name_ar']], $f);
        }

        // ===== 6. المشاريع =====
        $projectsData = [
            [
                'name_ar' => 'مشروع النخيل',
                'name_en' => 'Al Nakheel Project',
                'description_ar' => 'مشروع سكني فاخر في قلب التجمع الخامس بالقاهرة الجديدة. يتميز بتصميم عصري ومرافق متكاملة توفر أعلى مستويات الرفاهية والراحة لسكانه.',
                'description_en' => 'A luxurious residential project in the heart of New Cairo. Features modern design and comprehensive facilities providing the highest levels of luxury and comfort.',
                'meta_description_ar' => 'مشروع النخيل: وحدات سكنية فاخرة في التجمع الخامس بالقاهرة الجديدة. اكتشف حياة من الرفاهية.',
                'meta_description_en' => 'Al Nakheel Project: Luxury residential units in New Cairo. Discover a life of luxury.',
                'location_address_ar' => 'التجمع الخامس، القاهرة الجديدة، القاهرة',
                'location_address_en' => 'New Cairo 5th Settlement, Cairo',
                'area_slug' => 'new-cairo',
                'is_active' => true,
                'payment_method' => 'both',
                'down_payment' => 20,
                'installment_years' => 7,
                'images' => [0, 1, 2],
            ],
            [
                'name_ar' => 'كمبوند الريف',
                'name_en' => 'Al Reef Compound',
                'description_ar' => 'كمبوند متكامل الخدمات في الشيخ زايد يضم مئات الوحدات السكنية المتنوعة بين شقق وفيلات بتصميم معماري راقٍ وبيئة خضراء هادئة.',
                'description_en' => 'A fully serviced compound in Sheikh Zayed featuring hundreds of diverse residential units from apartments to villas with elegant architecture and a peaceful green environment.',
                'meta_description_ar' => 'كمبوند الريف بالشيخ زايد: شقق وفيلات فاخرة بتشطيب كامل وخدمات متكاملة.',
                'meta_description_en' => 'Al Reef Compound Sheikh Zayed: Luxury apartments and villas with full finishing and comprehensive services.',
                'location_address_ar' => 'الشيخ زايد، الجيزة',
                'location_address_en' => 'Sheikh Zayed, Giza',
                'area_slug' => 'sheikh-zayed',
                'is_active' => true,
                'payment_method' => 'installment',
                'down_payment' => 15,
                'installment_years' => 10,
                'images' => [3, 4, 5],
            ],
            [
                'name_ar' => 'أبراج المدينة',
                'name_en' => 'City Towers',
                'description_ar' => 'مشروع الأبراج السكنية الفاخرة في مدينة نصر بإطلالة بانورامية رائعة على القاهرة. يضم وحدات بمساحات متنوعة تناسب مختلف احتياجات الأسر.',
                'description_en' => 'A luxury residential towers project in Nasr City with breathtaking panoramic views of Cairo. Features units of various sizes to suit different family needs.',
                'meta_description_ar' => 'أبراج المدينة بمدينة نصر: شقق سكنية فاخرة بإطلالة بانورامية مميزة.',
                'meta_description_en' => 'City Towers Nasr City: Luxury residential apartments with distinctive panoramic views.',
                'location_address_ar' => 'مدينة نصر، القاهرة',
                'location_address_en' => 'Nasr City, Cairo',
                'area_slug' => 'nasr-city',
                'is_active' => true,
                'payment_method' => 'cash',
                'images' => [6, 7, 8],
            ],
        ];

        $projects = [];
        foreach ($projectsData as $pd) {
            $areaId = $areas->get($pd['area_slug'])?->id;
            $project = Project::firstOrCreate(
                ['slug_en' => Str::slug($pd['name_en'])],
                [
                    'user_id' => $manager->id,
                    'area_id' => $areaId,
                    'name' => $pd['name_ar'],
                    'name_ar' => $pd['name_ar'],
                    'name_en' => $pd['name_en'],
                    'description' => $pd['description_ar'],
                    'description_ar' => $pd['description_ar'],
                    'description_en' => $pd['description_en'],
                    'meta_description_ar' => $pd['meta_description_ar'],
                    'meta_description_en' => $pd['meta_description_en'],
                    'location_address_ar' => $pd['location_address_ar'],
                    'location_address_en' => $pd['location_address_en'],
                    'is_active' => $pd['is_active'],
                    'payment_method' => $pd['payment_method'],
                    'down_payment' => $pd['down_payment'] ?? null,
                    'installment_years' => $pd['installment_years'] ?? null,
                ]
            );

            // إضافة صور المشروع
            if ($project->images()->count() === 0) {
                foreach ($pd['images'] as $idx => $imgIndex) {
                    if (isset($this->projectImages[$imgIndex])) {
                        ProjectImage::create([
                            'project_id' => $project->id,
                            'path' => $this->projectImages[$imgIndex],
                            'alt_text' => $pd['name_ar'],
                            'sort_order' => $idx + 1,
                        ]);
                    }
                }
            }

            // إضافة مميزات المشروع
            if ($project->features()->count() === 0) {
                $project->features()->attach(
                    collect($features)->random(4)->pluck('id')->toArray()
                );
            }

            $projects[] = $project;
        }

        // ===== 7. الوحدات =====
        $firstType = $unitTypes->first();
        $secondType = $unitTypes->skip(1)->first() ?? $firstType;

        $unitsData = [
            // وحدات مشروع النخيل
            [
                'project' => $projects[0],
                'name_ar' => 'شقة فاخرة 3 غرف - مشروع النخيل',
                'name_en' => 'Luxury 3-Bedroom Apartment - Al Nakheel',
                'description_ar' => 'شقة فاخرة بتشطيب كامل بمساحة 180 م² تضم 3 غرف نوم رئيسية مع مطبخ مجهز ومنطقة معيشة واسعة وبلكونة بإطلالة مميزة على الحديقة.',
                'description_en' => 'Luxury fully finished apartment of 180 sqm featuring 3 master bedrooms, equipped kitchen, spacious living area, and a balcony with distinctive garden view.',
                'transaction' => 'sale',
                'price' => 2500000,
                'area_sqm' => 180,
                'rooms' => 3,
                'bathrooms' => 2,
                'floor' => 4,
                'is_deal' => true,
                'is_pinned' => true,
                'area_slug' => 'new-cairo',
                'type' => $firstType,
                'finishing' => $finishing,
                'images' => [0, 1, 2],
                'payment_method' => 'both',
                'down_payment' => 20,
                'installment_years' => 7,
            ],
            [
                'project' => $projects[0],
                'name_ar' => 'شقة 2 غرف للبيع - النخيل',
                'name_en' => '2-Bedroom Apartment For Sale - Al Nakheel',
                'description_ar' => 'شقة مميزة بمساحة 120 م² تضم غرفتي نوم وصالة كبيرة ومطبخ مفتوح وحمامين. موقع استراتيجي بالقرب من المدارس والمولات.',
                'description_en' => 'Distinctive apartment of 120 sqm featuring 2 bedrooms, large living room, open kitchen, and 2 bathrooms. Strategic location near schools and malls.',
                'transaction' => 'sale',
                'price' => 1650000,
                'area_sqm' => 120,
                'rooms' => 2,
                'bathrooms' => 2,
                'floor' => 7,
                'is_deal' => false,
                'is_pinned' => false,
                'area_slug' => 'new-cairo',
                'type' => $firstType,
                'finishing' => $semiFinishing,
                'images' => [3, 4, 5],
                'payment_method' => 'installment',
                'down_payment' => 15,
                'installment_years' => 5,
            ],
            // وحدات مشروع الريف
            [
                'project' => $projects[1],
                'name_ar' => 'فيلا دوبلكس 4 غرف - الريف',
                'name_en' => '4-Bedroom Duplex Villa - Al Reef',
                'description_ar' => 'فيلا دوبلكس فاخرة بمساحة 350 م² تتكون من دورين مع حديقة خاصة وموقف سيارتين. تتميز بتشطيب فاخر وموقع مميز على الكورنيش الداخلي.',
                'description_en' => 'Luxury duplex villa of 350 sqm consisting of two floors with private garden and parking for 2 cars. Features luxury finishing and distinctive location on the internal corniche.',
                'transaction' => 'sale',
                'price' => 6500000,
                'area_sqm' => 350,
                'rooms' => 4,
                'bathrooms' => 4,
                'floor' => 1,
                'is_deal' => true,
                'is_pinned' => true,
                'area_slug' => 'sheikh-zayed',
                'type' => $secondType ?? $firstType,
                'finishing' => $finishing,
                'images' => [6, 7, 8],
                'payment_method' => 'installment',
                'down_payment' => 25,
                'installment_years' => 10,
            ],
            [
                'project' => $projects[1],
                'name_ar' => 'شقة للإيجار - كمبوند الريف',
                'name_en' => 'Apartment For Rent - Al Reef Compound',
                'description_ar' => 'شقة مفروشة بالكامل للإيجار بمساحة 150 م² في كمبوند الريف. تضم 3 غرف نوم وصالة فاخرة وإطلالة جميلة على الحديقة الرئيسية.',
                'description_en' => 'Fully furnished apartment for rent of 150 sqm in Al Reef Compound. Features 3 bedrooms, luxury living room, and beautiful view of the main garden.',
                'transaction' => 'rent',
                'price' => 12000,
                'area_sqm' => 150,
                'rooms' => 3,
                'bathrooms' => 2,
                'floor' => 2,
                'is_deal' => false,
                'is_pinned' => false,
                'area_slug' => 'sheikh-zayed',
                'type' => $firstType,
                'finishing' => $finishing,
                'images' => [9, 10, 11],
                'payment_method' => 'cash',
            ],
            // وحدات أبراج المدينة
            [
                'project' => $projects[2],
                'name_ar' => 'شقة بانورامية 4 غرف - أبراج المدينة',
                'name_en' => 'Panoramic 4-Bedroom Apartment - City Towers',
                'description_ar' => 'شقة بانورامية استثنائية في الدور العاشر بمساحة 220 م² مع إطلالة رائعة على القاهرة. تضم 4 غرف نوم وصالة فاخرة ومطبخ عصري وغرفة خادمة.',
                'description_en' => 'Exceptional panoramic apartment on the 10th floor of 220 sqm with breathtaking views of Cairo. Features 4 bedrooms, luxury living room, modern kitchen, and maid\'s room.',
                'transaction' => 'sale',
                'price' => 4200000,
                'area_sqm' => 220,
                'rooms' => 4,
                'bathrooms' => 3,
                'floor' => 10,
                'is_deal' => false,
                'is_pinned' => true,
                'area_slug' => 'nasr-city',
                'type' => $firstType,
                'finishing' => $finishing,
                'images' => [12, 13, 14],
                'payment_method' => 'cash',
            ],
            [
                'project' => $projects[2],
                'name_ar' => 'ستوديو استثماري - أبراج المدينة',
                'name_en' => 'Investment Studio - City Towers',
                'description_ar' => 'ستوديو مميز للاستثمار بمساحة 60 م² في الدور الثالث بتشطيب فاخر جاهز للسكن. فرصة استثمارية ممتازة في موقع حيوي.',
                'description_en' => 'Distinctive investment studio of 60 sqm on the 3rd floor with luxury finishing ready to move in. Excellent investment opportunity in a vibrant location.',
                'transaction' => 'sale',
                'price' => 850000,
                'area_sqm' => 60,
                'rooms' => 1,
                'bathrooms' => 1,
                'floor' => 3,
                'is_deal' => true,
                'is_pinned' => false,
                'area_slug' => 'nasr-city',
                'type' => $firstType,
                'finishing' => $finishing,
                'images' => [15, 16, 0],
                'payment_method' => 'both',
                'down_payment' => 30,
                'installment_years' => 3,
            ],
        ];

        foreach ($unitsData as $idx => $ud) {
            $areaId = $areas->get($ud['area_slug'])?->id;
            $unit = Unit::firstOrCreate(
                ['slug_en' => Str::slug($ud['name_en'])],
                [
                    'project_id' => $ud['project']->id,
                    'user_id' => ($idx % 2 === 0) ? $manager->id : $agent->id,
                    'area_id' => $areaId,
                    'type_id' => $ud['type']->id,
                    'finishing_type_id' => $ud['finishing']->id,
                    'name' => $ud['name_ar'],
                    'name_ar' => $ud['name_ar'],
                    'name_en' => $ud['name_en'],
                    'description' => $ud['description_ar'],
                    'description_ar' => $ud['description_ar'],
                    'description_en' => $ud['description_en'],
                    'meta_description_ar' => mb_substr($ud['description_ar'], 0, 160),
                    'meta_description_en' => mb_substr($ud['description_en'], 0, 160),
                    'location_address_ar' => $ud['project']->location_address_ar,
                    'location_address_en' => $ud['project']->location_address_en,
                    'transaction' => $ud['transaction'],
                    'price' => $ud['price'],
                    'area_sqm' => $ud['area_sqm'],
                    'rooms' => $ud['rooms'],
                    'bathrooms' => $ud['bathrooms'],
                    'floor' => $ud['floor'],
                    'is_deal' => $ud['is_deal'],
                    'is_pinned' => $ud['is_pinned'],
                    'is_active' => true,
                    'payment_method' => $ud['payment_method'],
                    'down_payment' => $ud['down_payment'] ?? null,
                    'installment_years' => $ud['installment_years'] ?? null,
                    'priority_points' => ($idx % 2 === 0) ? 100 : 50,
                    'views_count' => rand(10, 500),
                ]
            );

            // إضافة صور الوحدة
            if ($unit->images()->count() === 0) {
                foreach ($ud['images'] as $imgIdx => $imgIndex) {
                    if (isset($this->unitImages[$imgIndex])) {
                        UnitImage::create([
                            'unit_id' => $unit->id,
                            'path' => $this->unitImages[$imgIndex],
                            'alt_text' => $ud['name_ar'],
                            'sort_order' => $imgIdx + 1,
                            'is_primary' => $imgIdx === 0,
                        ]);
                    }
                }
            }

            // إضافة مميزات الوحدة
            if ($unit->features()->count() === 0) {
                $unit->features()->attach(
                    collect($features)->random(3)->pluck('id')->toArray()
                );
            }
        }

        // ===== 8. الفئات والمقارلات والاخبار =====
        $cat1 = Category::firstOrCreate(
            ['slug' => 'real-estate-tips'],
            [
                'name_ar' => 'نصائح عقارية',
                'name_en' => 'Real Estate Tips',
                'slug_ar' => 'نصائح-عقارية',
                'slug_en' => 'real-estate-tips',
            ]
        );
        $cat2 = Category::firstOrCreate(
            ['slug' => 'market-news'],
            [
                'name_ar' => 'أخبار السوق',
                'name_en' => 'Market News',
                'slug_ar' => 'أخبار-السوق',
                'slug_en' => 'market-news',
            ]
        );

        $articlesData = [
            [
                'title_ar' => 'أفضل المناطق للاستثمار العقاري في مصر 2026',
                'title_en' => 'Best Areas for Real Estate Investment in Egypt 2026',
                'content_ar' => '<p>يشهد السوق العقاري المصري نمواً ملحوظاً في عام 2026، مع توجه كبير نحو التجمع الخامس والعاصمة الإدارية الجديدة كمناطق استثمار مميزة.</p><p>من أبرز المناطق الواعدة: التجمع الخامس الذي يشهد نمواً مستمراً في الطلب، والعاصمة الإدارية بإمكاناتها الضخمة كعاصمة جديدة، والساحل الشمالي كوجهة سياحية وسكنية متنامية.</p><p>ننصح المستثمرين بدراسة السوق جيداً واختيار العقارات في مناطق ذات بنية تحتية متطورة وإمكانية نمو مستقبلي قوية.</p>',
                'content_en' => '<p>The Egyptian real estate market is witnessing remarkable growth in 2026, with a major trend towards the Fifth Settlement and the New Administrative Capital as distinguished investment areas.</p><p>Among the most promising areas: New Cairo which sees continuous growth in demand, the New Administrative Capital with its massive potential as a new capital, and the North Coast as a growing tourist and residential destination.</p><p>We advise investors to study the market carefully and choose properties in areas with advanced infrastructure and strong future growth potential.</p>',
                'category' => $cat1,
                'is_published' => true,
                'image' => 0,
            ],
            [
                'title_ar' => 'دليل المشتري: كيف تختار شقتك المثالية؟',
                'title_en' => 'Buyer\'s Guide: How to Choose Your Perfect Apartment?',
                'content_ar' => '<p>اختيار الشقة المناسبة قرار مصيري يتطلب دراسة دقيقة وتخطيطاً محكماً. إليك أهم النقاط التي يجب مراعاتها عند البحث عن وحدتك السكنية المثالية.</p><p>أولاً: حدد ميزانيتك بدقة مع مراعاة تكاليف التسجيل والضرائب والصيانة المستقبلية. ثانياً: ابحث في مناطق متعددة ولا تقتصر على منطقة واحدة. ثالثاً: قيّم الموقع بعناية من حيث القرب من الخدمات والمدارس والمواصلات. رابعاً: تحقق من سمعة الشركة المطورة وتاريخها في تسليم المشاريع في المواعيد.</p>',
                'content_en' => '<p>Choosing the right apartment is a life-changing decision that requires careful study and thorough planning. Here are the most important points to consider when searching for your ideal residential unit.</p><p>First: Determine your budget precisely taking into account registration costs, taxes, and future maintenance. Second: Search in multiple areas and don\'t limit yourself to one area. Third: Evaluate the location carefully in terms of proximity to services, schools, and transportation. Fourth: Verify the developer\'s reputation and track record in delivering projects on time.</p>',
                'category' => $cat1,
                'is_published' => true,
                'image' => 1,
            ],
        ];

        foreach ($articlesData as $ad) {
            $article = Article::firstOrCreate(
                ['slug_en' => Str::slug($ad['title_en'])],
                [
                    'category_id' => $ad['category']->id,
                    'title' => $ad['title_ar'],
                    'title_ar' => $ad['title_ar'],
                    'title_en' => $ad['title_en'],
                    'content' => $ad['content_ar'],
                    'content_ar' => $ad['content_ar'],
                    'content_en' => $ad['content_en'],
                    'excerpt_ar' => mb_substr(strip_tags($ad['content_ar']), 0, 200),
                    'excerpt_en' => mb_substr(strip_tags($ad['content_en']), 0, 200),
                    'meta_description' => mb_substr(strip_tags($ad['content_en']), 0, 160),
                    'is_published' => $ad['is_published'],
                    'published_at' => now()->subDays(rand(1, 30)),
                ]
            );

            if ($article->images()->count() === 0 && isset($this->articleImages[$ad['image']])) {
                ArticleImage::create([
                    'article_id' => $article->id,
                    'path' => $this->articleImages[$ad['image']],
                    'alt_text' => $ad['title_ar'],
                    'sort_order' => 1,
                ]);
            }
        }

        $this->command->info('✅ تم إضافة البيانات التجريبية بنجاح!');
        $this->command->table(['نوع البيانات', 'التفاصيل'], [
            ['المستخدمون', 'admin@admin.com / manager@manager.com / agent@agent.com (كلمة المرور تولد عشوائياً أو عبر .env)'],
            ['المشاريع', '3 مشاريع في التجمع الخامس، الشيخ زايد، ومدينة نصر'],
            ['الوحدات', '6 وحدات متنوعة (للبيع والإيجار، صفقات مميزة)'],
            ['المقارلات والاخبار', '2 مقال منشور'],
        ]);
    }
}

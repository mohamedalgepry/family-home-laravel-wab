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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FreshDummySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Delete all users and create one Admin
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $admin = User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@admin.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'is_active' => true,
            'points_balance' => 0,
            'initial_monthly_balance' => 0,
        ]);

        $this->command->info('تم تنظيف قاعدة البيانات من المستخدمين وإنشاء مستخدم أدمن (admin@admin.com / 12345678).');

        // Ensure we have some prerequisites
        $this->call([
            AreaSeeder::class,
            UnitTypeSeeder::class,
        ]);

        $areas = Area::all();
        $unitTypes = UnitType::all();

        if ($areas->isEmpty() || $unitTypes->isEmpty()) {
            $this->command->warn('يرجى التأكد من تشغيل AreaSeeder و UnitTypeSeeder.');

            return;
        }

        // 2. Fetch images from storage
        $files = Storage::disk('public')->allFiles();
        $images = collect($files)->filter(function ($file) {
            return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'webp']);
        })->values();

        if ($images->isEmpty()) {
            $this->command->warn('لم يتم العثور على أي صور في مجلد storage/app/public. سيتم إضافة بيانات بدون صور.');
        } else {
            $this->command->info("تم العثور على {$images->count()} صورة للاستخدام العشوائي.");
        }

        // Finishing types
        $finishing = FinishingType::firstOrCreate(['name_ar' => 'تشطيب كامل'], ['name_en' => 'Full Finishing']);
        $semiFinishing = FinishingType::firstOrCreate(['name_ar' => 'نصف تشطيب'], ['name_en' => 'Semi Finishing']);

        // Features
        $featuresList = [
            ['name_ar' => 'مسبح', 'name_en' => 'Swimming Pool'],
            ['name_ar' => 'جيم', 'name_en' => 'Gym'],
            ['name_ar' => 'حديقة', 'name_en' => 'Garden'],
        ];
        $features = [];
        foreach ($featuresList as $f) {
            $features[] = Feature::firstOrCreate(['name_ar' => $f['name_ar']], $f);
        }

        // 3. Create Dummy Projects
        $projects = [];
        for ($i = 1; $i <= 3; $i++) {
            $project = Project::create([
                'user_id' => $admin->id,
                'area_id' => $areas->random()->id,
                'name' => "مشروع استثماري {$i}",
                'name_ar' => "مشروع استثماري {$i}",
                'name_en' => "Investment Project {$i}",
                'slug_en' => "investment-project-{$i}-".Str::random(5),
                'description' => "وصف تفصيلي للمشروع {$i} بجميع مرافقه وخدماته الرائعة.",
                'description_ar' => "وصف تفصيلي للمشروع {$i} بجميع مرافقه وخدماته الرائعة.",
                'description_en' => "Detailed description of project {$i} with all its wonderful facilities.",
                'location_address_ar' => 'شارع التسعين، التجمع الخامس',
                'location_address_en' => '90th St, Fifth Settlement',
                'is_active' => true,
                'payment_method' => 'installment',
                'down_payment' => 10,
                'installment_years' => 5,
            ]);

            // Add images
            if ($images->isNotEmpty()) {
                $projectImages = $images->random(min(3, $images->count()));
                foreach ($projectImages as $idx => $imgPath) {
                    ProjectImage::create([
                        'project_id' => $project->id,
                        'path' => $imgPath,
                        'alt_text' => $project->name_ar,
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
            $projects[] = $project;
        }

        // 4. Create Dummy Units
        for ($i = 1; $i <= 6; $i++) {
            $project = $projects[array_rand($projects)];
            $unit = Unit::create([
                'project_id' => $project->id,
                'user_id' => $admin->id,
                'area_id' => $project->area_id,
                'type_id' => $unitTypes->random()->id,
                'finishing_type_id' => rand(0, 1) ? $finishing->id : $semiFinishing->id,
                'name' => "وحدة سكنية فاخرة {$i}",
                'name_ar' => "وحدة سكنية فاخرة {$i}",
                'name_en' => "Luxury Unit {$i}",
                'slug_en' => "luxury-unit-{$i}-".Str::random(5),
                'description' => 'وحدة سكنية رائعة بإطلالة مميزة ومساحة واسعة في موقع استراتيجي.',
                'description_ar' => 'وحدة سكنية رائعة بإطلالة مميزة ومساحة واسعة في موقع استراتيجي.',
                'description_en' => 'Wonderful residential unit with a distinctive view and spacious area.',
                'transaction' => rand(0, 1) ? 'sale' : 'rent',
                'price' => rand(500000, 5000000),
                'area_sqm' => rand(80, 300),
                'rooms' => rand(2, 5),
                'bathrooms' => rand(1, 4),
                'is_active' => true,
            ]);

            $unit->features()->attach(collect($features)->random(2)->pluck('id')->toArray());

            if ($images->isNotEmpty()) {
                $unitImages = $images->random(min(3, $images->count()));
                foreach ($unitImages as $idx => $imgPath) {
                    UnitImage::create([
                        'unit_id' => $unit->id,
                        'path' => $imgPath,
                        'alt_text' => $unit->name_ar,
                        'sort_order' => $idx + 1,
                        'is_primary' => $idx === 0,
                    ]);
                }
            }
        }

        // 5. Create Dummy Articles
        $cat = Category::firstOrCreate(
            ['slug' => 'news'],
            ['name_ar' => 'أخبار', 'name_en' => 'News', 'slug_ar' => 'أخبار', 'slug_en' => 'news']
        );

        for ($i = 1; $i <= 3; $i++) {
            $article = Article::create([
                'category_id' => $cat->id,
                'title' => "مقال عقاري تجريبي {$i}",
                'title_ar' => "مقال عقاري تجريبي {$i}",
                'title_en' => "Dummy Real Estate Article {$i}",
                'slug_en' => "dummy-article-{$i}-".Str::random(5),
                'content' => "<p>هذا نص تجريبي للمقال رقم {$i}، يتحدث عن السوق العقاري وأحدث التطورات.</p>",
                'content_ar' => "<p>هذا نص تجريبي للمقال رقم {$i}، يتحدث عن السوق العقاري وأحدث التطورات.</p>",
                'content_en' => "<p>This is dummy text for article {$i}, talking about the real estate market.</p>",
                'is_published' => true,
                'published_at' => now(),
            ]);

            if ($images->isNotEmpty()) {
                ArticleImage::create([
                    'article_id' => $article->id,
                    'path' => $images->random(),
                    'alt_text' => $article->title_ar,
                    'sort_order' => 1,
                ]);
            }
        }

        $this->command->info('تمت إضافة البيانات الوهمية (مشاريع، وحدات، مقالات) بنجاح!');
    }
}

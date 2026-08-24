<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('unit show page includes similar units, related projects, and related articles', function () {
    $area = Area::firstOrCreate(['name_en' => 'Zayed', 'name_ar' => 'زايد', 'slug' => 'zayed-'.uniqid()]);
    $type = UnitType::firstOrCreate(['name_en' => 'Apartment', 'name_ar' => 'شقة', 'slug' => 'apt-'.uniqid()]);
    $admin = createUser('Admin Test '.uniqid(), 'admin');

    $project = Project::create([
        'name' => 'Project Alpha',
        'name_ar' => 'مشروع ألفا',
        'name_en' => 'Project Alpha',
        'slug' => 'project-alpha-'.uniqid(),
        'area_id' => $area->id,
        'user_id' => $admin->id,
        'is_active' => true,
    ]);

    $unit = createTestUnit([
        'name' => 'Unit 101',
        'name_ar' => 'وحدة 101',
        'name_en' => 'Unit 101',
        'slug' => 'unit-101-'.uniqid(),
        'project_id' => $project->id,
        'area_id' => $area->id,
        'type_id' => $type->id,
        'user_id' => $admin->id,
        'price' => 1500000,
        'is_active' => true,
    ]);

    $category = Category::firstOrCreate(['name_ar' => 'دليل العقارات', 'name_en' => 'Real Estate Guide', 'slug' => 'guide-'.uniqid()]);
    $article = Article::create([
        'title' => 'How to buy a property',
        'title_ar' => 'كيف تشتري عقار',
        'title_en' => 'How to buy a property',
        'slug' => 'how-to-buy-'.uniqid(),
        'category_id' => $category->id,
        'content' => 'محتوى المقال',
        'content_ar' => 'محتوى المقال',
        'content_en' => 'Article content',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $response = $this->get("/ar/units/{$unit->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Public/Units/Show')
        ->has('unit')
        ->has('similarUnits')
        ->has('relatedProjects')
        ->has('relatedArticles')
        ->where('unit.id', $unit->id)
        ->where('unit.project.id', $project->id)
    );
});

test('project show page includes project units, similar projects, and related articles', function () {
    $area = Area::firstOrCreate(['name_en' => 'Tagamoa', 'name_ar' => 'التجمع', 'slug' => 'tagamoa-'.uniqid()]);
    $type = UnitType::firstOrCreate(['name_en' => 'Villa', 'name_ar' => 'فيلا', 'slug' => 'villa-'.uniqid()]);
    $admin = createUser('Admin Test 2 '.uniqid(), 'admin');

    $project = Project::create([
        'name' => 'Project Beta',
        'name_ar' => 'مشروع بيتا',
        'name_en' => 'Project Beta',
        'slug' => 'project-beta-'.uniqid(),
        'area_id' => $area->id,
        'user_id' => $admin->id,
        'is_active' => true,
    ]);

    $unitInProject = createTestUnit([
        'name' => 'Villa 5',
        'name_ar' => 'فيلا 5',
        'name_en' => 'Villa 5',
        'slug' => 'villa-5-'.uniqid(),
        'project_id' => $project->id,
        'area_id' => $area->id,
        'type_id' => $type->id,
        'user_id' => $admin->id,
        'price' => 5000000,
        'is_active' => true,
    ]);

    $category = Category::firstOrCreate(['name_ar' => 'أخبار العقارات', 'name_en' => 'News', 'slug' => 'news-'.uniqid()]);
    $article = Article::create([
        'title' => 'Investment tips',
        'title_ar' => 'نصائح استثمارية',
        'title_en' => 'Investment tips',
        'slug' => 'invest-tips-'.uniqid(),
        'category_id' => $category->id,
        'content' => 'محتوى المقال',
        'content_ar' => 'محتوى المقال',
        'content_en' => 'Article content',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $response = $this->get("/ar/projects/{$project->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Public/Projects/Show')
        ->has('project')
        ->has('projectUnits')
        ->has('similarProjects')
        ->has('relatedArticles')
        ->where('project.id', $project->id)
    );
});

<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\SitemapService;

test('sitemap files exist and index contains all sub sitemaps', function () {
    app(SitemapService::class)->regenerate();

    $this->assertFileExists(public_path('sitemap.xml'));
    $this->assertFileExists(public_path('sitemap-units.xml'));
    $this->assertFileExists(public_path('sitemap-projects.xml'));
    $this->assertFileExists(public_path('sitemap-articles.xml'));
    $this->assertFileExists(public_path('sitemap-categories.xml'));
    $this->assertFileExists(public_path('robots.txt'));

    $indexXml = file_get_contents(public_path('sitemap.xml'));
    $this->assertStringContainsString('sitemap-units.xml', $indexXml);
    $this->assertStringContainsString('sitemap-projects.xml', $indexXml);
    $this->assertStringContainsString('sitemap-articles.xml', $indexXml);
});

test('adding a unit dynamically adds it to sitemap and deleting it removes it from sitemap', function () {
    $area = Area::create(['name_ar' => 'منطقة السايت ماب', 'name_en' => 'Sitemap Area', 'slug_ar' => 'sitemap-area-ar', 'slug_en' => 'sitemap-area-en']);
    $unitType = UnitType::create(['name_ar' => 'شقة سايتماب', 'name_en' => 'Sitemap Apartment', 'slug_ar' => 'sitemap-apt-ar', 'slug_en' => 'sitemap-apt-en']);
    $user = createUser('Unit Owner', 'agent', null);

    $unit = Unit::create([
        'name' => 'Sitemap Test Unit',
        'name_ar' => 'وحدة السايت ماب الاختيارية',
        'name_en' => 'Sitemap Test Unit',
        'slug' => 'sitemap-test-unit-slug',
        'slug_ar' => 'sitemap-test-unit-ar',
        'slug_en' => 'sitemap-test-unit-en',
        'area_id' => $area->id,
        'type_id' => $unitType->id,
        'user_id' => $user->id,
        'transaction' => 'sale',
        'price' => 1500000,
        'area_sqm' => 120,
        'rooms' => 3,
        'bathrooms' => 2,
        'is_active' => true,
        'status' => 'approved',
    ]);

    $unitsXml = file_get_contents(public_path('sitemap-units.xml'));
    $this->assertStringContainsString('sitemap-test-unit-ar', $unitsXml);
    $this->assertStringContainsString('sitemap-test-unit-en', $unitsXml);

    // Delete unit
    $unit->delete();

    $updatedUnitsXml = file_get_contents(public_path('sitemap-units.xml'));
    $this->assertStringNotContainsString('sitemap-test-unit-ar', $updatedUnitsXml);
    $this->assertStringNotContainsString('sitemap-test-unit-en', $updatedUnitsXml);
});

test('adding a project dynamically adds it to sitemap and deleting it removes it', function () {
    $area = Area::create(['name_ar' => 'منطقة مشروع السايت ماب', 'name_en' => 'Sitemap Project Area', 'slug_ar' => 'sitemap-proj-area-ar', 'slug_en' => 'sitemap-proj-area-en']);
    $user = createUser('Project Owner', 'agent', null);

    $project = Project::create([
        'name' => 'Sitemap Test Project',
        'name_ar' => 'مشروع السايت ماب الجغرافي',
        'name_en' => 'Sitemap Test Project',
        'slug' => 'sitemap-test-project-slug',
        'slug_ar' => 'sitemap-test-project-ar',
        'slug_en' => 'sitemap-test-project-en',
        'area_id' => $area->id,
        'user_id' => $user->id,
        'is_active' => true,
    ]);

    $projectsXml = file_get_contents(public_path('sitemap-projects.xml'));
    $this->assertStringContainsString('sitemap-test-project-ar', $projectsXml);
    $this->assertStringContainsString('sitemap-test-project-en', $projectsXml);

    // Deactivate project
    $project->update(['is_active' => false]);

    $updatedProjectsXml = file_get_contents(public_path('sitemap-projects.xml'));
    $this->assertStringNotContainsString('sitemap-test-project-ar', $updatedProjectsXml);
    $this->assertStringNotContainsString('sitemap-test-project-en', $updatedProjectsXml);
});

test('publishing an article adds it to sitemap and unpublishing/deleting removes it', function () {
    $category = Category::create([
        'name' => 'Test Category',
        'name_ar' => 'تصنيف المقالات الاختباري',
        'name_en' => 'Test Article Category',
        'slug' => 'test-category-slug',
        'slug_ar' => 'test-article-category-ar',
        'slug_en' => 'test-article-category-en',
    ]);

    $user = createUser('Article Author', 'admin', null);

    $article = Article::create([
        'title' => 'Sitemap Article Title',
        'title_ar' => 'عنوان المقال للسايت ماب',
        'title_en' => 'Sitemap Article Title',
        'slug' => 'sitemap-article-slug',
        'slug_ar' => 'sitemap-article-slug-ar',
        'slug_en' => 'sitemap-article-slug-en',
        'content' => 'Test content for sitemap article',
        'content_ar' => 'محتوى تجريبي لمقال السايت ماب',
        'content_en' => 'Test content for sitemap article',
        'category_id' => $category->id,
        'author_id' => $user->id,
        'is_published' => true,
        'published_at' => now(),
    ]);

    $articlesXml = file_get_contents(public_path('sitemap-articles.xml'));
    $this->assertStringContainsString('sitemap-article-slug-ar', $articlesXml);
    $this->assertStringContainsString('sitemap-article-slug-en', $articlesXml);

    // Delete article
    $article->delete();

    $updatedArticlesXml = file_get_contents(public_path('sitemap-articles.xml'));
    $this->assertStringNotContainsString('sitemap-article-slug-ar', $updatedArticlesXml);
    $this->assertStringNotContainsString('sitemap-article-slug-en', $updatedArticlesXml);
});

<?php

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ArticleService;
use App\Domain\Listings\Services\ProjectService;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Users\Models\User;

beforeEach(function () {
    $this->user = new User(['name' => 'Owner', 'email' => 'owner@test.com', 'password' => 'x']);
    $this->user->role = 'agent';
    $this->user->save();

    $this->type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment']);
    $this->area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $this->otherArea = Area::create(['name_ar' => 'منطقة أخرى', 'name_en' => 'Other Area']);
});

it('filters paginated units by search, area, type and transaction', function () {
    $unitA = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Nile Villa',
        'name_ar' => 'فيلا النيل',
        'name_en' => 'Nile Villa',
        'slug' => 'nile-villa',
    ]);

    $unitB = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->otherArea->id,
        'transaction' => 'rent',
        'price' => 500,
        'name' => 'City Flat',
        'name_ar' => 'شقة المدينة',
        'name_en' => 'City Flat',
        'slug' => 'city-flat',
    ]);

    $service = app(UnitService::class);

    expect($service->getPaginatedUnits(['search' => 'nile'])->pluck('id')->all())->toBe([$unitA->id])
        ->and($service->getPaginatedUnits(['area_id' => $this->area->id])->pluck('id')->all())->toBe([$unitA->id])
        ->and($service->getPaginatedUnits(['transaction' => 'rent'])->pluck('id')->all())->toBe([$unitB->id])
        ->and($service->getPaginatedUnits(['type_id' => $this->type->id])->pluck('id')->all())->toHaveCount(2);
});

it('sorts paginated units by price and falls back to featured order', function () {
    $cheap = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 100,
        'name' => 'Cheap',
        'name_ar' => 'رخيص',
        'name_en' => 'Cheap',
        'slug' => 'cheap',
        'priority_points' => 5,
    ]);

    $expensive = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 9999,
        'name' => 'Expensive',
        'name_ar' => 'غالي',
        'name_en' => 'Expensive',
        'slug' => 'expensive',
        'priority_points' => 1,
    ]);

    $service = app(UnitService::class);

    expect($service->getPaginatedUnits(['sort' => 'price', 'direction' => 'asc'])->pluck('id')->all())
        ->toBe([$cheap->id, $expensive->id])
        ->and($service->getPaginatedUnits(['sort' => 'price', 'direction' => 'desc'])->pluck('id')->all())
        ->toBe([$expensive->id, $cheap->id])
        ->and($service->getPaginatedUnits([])->pluck('id')->all())
        ->toBe([$cheap->id, $expensive->id]);
});

it('caps the per page value at fifty', function () {
    $unit = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 100,
        'name' => 'Unit',
        'name_ar' => 'وحدة',
        'name_en' => 'Unit',
        'slug' => 'unit',
    ]);

    $service = app(UnitService::class);

    expect($service->getPaginatedUnits(['per_page' => 999])->perPage())->toBe(50)
        ->and($service->getPaginatedUnits(['per_page' => 5])->perPage())->toBe(5);
});

it('filters paginated projects and sorts by units count', function () {
    $projectA = new Project([
        'user_id' => $this->user->id,
        'name' => 'Nile Towers',
        'name_ar' => 'أبراج النيل',
        'name_en' => 'Nile Towers',
        'slug' => 'nile-towers',
        'area_id' => $this->area->id,
    ]);
    $projectA->save();

    $projectB = new Project([
        'user_id' => $this->user->id,
        'name' => 'City Mall',
        'name_ar' => 'مول المدينة',
        'name_en' => 'City Mall',
        'slug' => 'city-mall',
        'area_id' => $this->otherArea->id,
    ]);
    $projectB->save();

    $service = app(ProjectService::class);

    expect($service->getPaginatedProjects(['search' => 'towers'])->pluck('id')->all())->toBe([$projectA->id])
        ->and($service->getPaginatedProjects(['area_id' => $this->area->id])->pluck('id')->all())->toBe([$projectA->id])
        ->and($service->getPaginatedProjects(['sort' => 'name', 'direction' => 'asc'])->pluck('id')->all())
        ->toBe([$projectB->id, $projectA->id]);
});

it('filters paginated articles by category and published state', function () {
    $publishedCategory = Category::create(['name_ar' => 'أخبار', 'name_en' => 'News', 'slug' => 'news']);
    $draftCategory = Category::create(['name_ar' => 'نصائح', 'name_en' => 'Tips', 'slug' => 'tips']);

    $published = Article::create([
        'category_id' => $publishedCategory->id,
        'title' => 'Breaking News',
        'title_ar' => 'خبر عاجل',
        'title_en' => 'Breaking News',
        'slug' => 'breaking-news',
        'content' => 'Content',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $draft = Article::create([
        'category_id' => $draftCategory->id,
        'title' => 'Hidden Draft',
        'title_ar' => 'مسودة',
        'title_en' => 'Hidden Draft',
        'slug' => 'hidden-draft',
        'content' => 'Content',
        'is_published' => false,
    ]);

    $service = app(ArticleService::class);

    expect($service->getPaginatedArticles(['search' => 'breaking'])->pluck('id')->all())->toBe([$published->id])
        ->and($service->getPaginatedArticles(['category_id' => $draftCategory->id])->pluck('id')->all())->toBe([$draft->id])
        ->and($service->getPaginatedArticles(['is_published' => 'true'])->pluck('id')->all())->toBe([$published->id])
        ->and($service->getPaginatedArticles(['is_published' => 'false'])->pluck('id')->all())->toBe([$draft->id]);
});

it('ignores disallowed sort fields', function () {
    $units = Unit::query();
    ListingQueryBuilder::applySort($units, ['sort' => 'hacked', 'direction' => 'asc'], ['created_at']);

    expect($units->getQuery()->orders ?? null)->toBeNull();
});

it('does not search when the term is shorter than the minimum length', function () {
    $unit = createTestUnit([
        'user_id' => $this->user->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 100,
        'name' => 'Unit',
        'name_ar' => 'وحدة',
        'name_en' => 'Unit',
        'slug' => 'unit',
    ]);

    $service = app(UnitService::class);

    expect($service->getPaginatedUnits(['search' => 'u'])->pluck('id')->all())->toHaveCount(1)
        ->and($service->getPaginatedUnits(['search' => ''])->pluck('id')->all())->toHaveCount(1);
});

it('creates and updates articles through article service', function () {
    $category = Category::create(['name_ar' => 'عقارات', 'name_en' => 'Real Estate', 'slug' => 'real-estate']);
    $service = app(ArticleService::class);

    $data = CreateArticleData::from([
        'category_id' => $category->id,
        'title_ar' => 'مقال جديد',
        'title_en' => 'New Article',
        'content_ar' => '<p>محتوى المقال</p>',
        'content_en' => '<p>Article content</p>',
        'keywords' => ['عقارات', 'شقق'],
        'meta_description' => 'وصف المقال',
        'is_published' => true,
    ]);

    $article = $service->createArticle($data);

    expect($article)->not->toBeNull()
        ->and($article->title_ar)->toBe('مقال جديد')
        ->and($article->title_en)->toBe('New Article')
        ->and($article->slug)->not->toBeEmpty()
        ->and($article->keywords)->toBe(['عقارات', 'شقق']);

    $updateData = CreateArticleData::from([
        'category_id' => $category->id,
        'title_ar' => 'مقال معدل',
        'title_en' => 'Updated Article',
        'content_ar' => '<p>محتوى معدل</p>',
        'content_en' => '<p>Updated content</p>',
        'keywords' => ['عقارات', 'فيلا'],
        'meta_description' => 'وصف معدل',
        'is_published' => true,
    ]);

    $updatedArticle = $service->updateArticle($article->id, $updateData);

    expect($updatedArticle->title_ar)->toBe('مقال معدل')
        ->and($updatedArticle->keywords)->toBe(['عقارات', 'فيلا']);
});

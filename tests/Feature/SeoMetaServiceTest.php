<?php

use App\Domain\Common\Services\SeoMetaService;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Models\UnitType;

beforeEach(function () {
    app()->setLocale('en');

    $this->service = app(SeoMetaService::class);

    $this->user = createUser('Owner', 'manager', null);
    $this->type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $this->area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
});

function makeUnit(array $overrides = []): Unit
{
    return createTestUnit(array_merge([
        'user_id' => test()->user->id,
        'type_id' => test()->type->id,
        'area_id' => test()->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Unit',
        'name_ar' => 'وحدة',
        'name_en' => 'Unit En',
        'description' => 'Description',
        'description_ar' => 'وصف',
        'description_en' => 'Description En',
        'meta_description_en' => 'Unit meta description',
    ], $overrides));
}

function schemaOf(array|string $metaSchema): array
{
    if (is_array($metaSchema)) {
        return $metaSchema;
    }

    preg_match('/<script type="application\/ld\+json">(.*?)<\/script>/s', $metaSchema, $matches);

    return json_decode($matches[1] ?? '{}', true);
}

it('builds a localized unit meta with canonical, hreflang and schema', function () {
    $unit = makeUnit();

    $primary = UnitImage::create(['unit_id' => $unit->id, 'path' => 'units/primary.jpg', 'is_primary' => true]);
    UnitImage::create(['unit_id' => $unit->id, 'path' => 'units/second.jpg', 'is_primary' => false]);

    $meta = $this->service->forListing($unit, 'units');

    expect($meta['title'])->toBe('Unit En - '.config('app.name'))
        ->and($meta['description'])->toBe('Unit meta description')
        ->and($meta['image'])->toBe($primary->path)
        ->and($meta['canonical'])->toBe(url('/en/units/'.$unit->slug_en))
        ->and($meta['hreflang']['ar'])->toBe(url('/ar/units/'.$unit->slug_ar))
        ->and($meta['hreflang']['en'])->toBe(url('/en/units/'.$unit->slug_en))
        ->and($meta['hreflang']['x-default'])->toBe(url('/ar/units/'.$unit->slug_ar));

    $schema = schemaOf($meta['schema']);

    expect($schema['@type'])->toBe('RealEstateListing')
        ->and($schema['name'])->toBe('Unit En')
        ->and($schema['description'])->toBe('Unit meta description')
        ->and($schema['image'])->toBe(asset('storage/'.$primary->path))
        ->and($schema['@id'])->toEndWith('#listing')
        ->and($schema['url'])->toBe(url('/en/units/'.$unit->slug_en))
        ->and($schema['datePosted'])->not->toBeNull()
        ->and($schema['dateModified'])->not->toBeNull()
        ->and($schema['offers'])->toBe([
            '@type' => 'Offer',
            'price' => '1000.00',
            'priceCurrency' => 'EGP',
            'availability' => 'https://schema.org/InStock',
            'url' => url('/en/units/'.$unit->slug_en),
        ]);
});

it('falls back to the description and first image when meta and primary are missing', function () {
    $unit = makeUnit(['meta_description_en' => null]);

    $first = UnitImage::create(['unit_id' => $unit->id, 'path' => 'units/first.jpg', 'is_primary' => false]);

    $meta = $this->service->forListing($unit, 'units');
    $schema = schemaOf($meta['schema']);

    expect($meta['description'])->toBe('Description En')
        ->and($meta['image'])->toBe($first->path)
        ->and($schema['image'])->toBe(asset('storage/'.$first->path))
        ->and($schema)->toHaveKey('offers');
});

it('builds a project meta without offers in the schema', function () {
    $project = new Project(['user_id' => $this->user->id, 'name' => 'Project', 'name_ar' => 'مشروع', 'name_en' => 'Project En']);
    $project->save();

    ProjectImage::create(['project_id' => $project->id, 'path' => 'projects/main.jpg']);

    $meta = $this->service->forListing($project, 'projects');
    $schema = schemaOf($meta['schema']);

    expect($meta['canonical'])->toBe(url('/en/projects/'.$project->slug_en))
        ->and($meta['image'])->toBe('projects/main.jpg')
        ->and($schema['@type'])->toBe('RealEstateListing')
        ->and($schema['name'])->toBe('Project En')
        ->and($schema['@id'])->toEndWith('#project')
        ->and($schema['url'])->toBe(url('/en/projects/'.$project->slug_en))
        ->and($schema['datePosted'])->not->toBeNull()
        ->and($schema['dateModified'])->not->toBeNull()
        ->and($schema)->not->toHaveKey('offers')
        ->and($meta['schema'])->not->toContain('"offers"');
});

it('builds an article meta with an Article schema', function () {
    $category = Category::create(['name_ar' => 'فئة', 'name_en' => 'Category']);
    $article = new Article([
        'category_id' => $category->id,
        'title' => 'Article',
        'title_ar' => 'مقال',
        'title_en' => 'Article En',
        'content' => 'Content',
        'content_ar' => 'محتوى',
        'content_en' => 'Content En',
        'is_published' => true,
    ]);
    $article->save();

    ArticleImage::create(['article_id' => $article->id, 'path' => 'articles/cover.jpg']);

    $meta = $this->service->forArticle($article);
    $schema = schemaOf($meta['schema']);

    expect($meta['title'])->toBe('Article En - '.config('app.name'))
        ->and($meta['canonical'])->toBe(url('/en/articles/'.$article->slug_en))
        ->and($meta['image'])->toBe('articles/cover.jpg')
        ->and($schema['@type'])->toBe('Article')
        ->and($schema['headline'])->toBe('Article En')
        ->and($schema['image'])->toBe(asset('storage/articles/cover.jpg'))
        ->and($schema['datePublished'])->not->toBeNull()
        ->and($schema['dateModified'])->not->toBeNull()
        ->and($schema['author'])->toBe([
            '@type' => 'Organization',
            'name' => config('app.name'),
            'url' => url('/'),
        ])
        ->and($schema['publisher'])->toBe([
            '@type' => 'Organization',
            'name' => config('app.name'),
            'logo' => [
                '@type' => 'ImageObject',
                'url' => url('/icon.png'),
            ],
            'url' => url('/'),
        ]);
});

it('switches canonical and hreflang when the locale is Arabic', function () {
    app()->setLocale('ar');

    $unit = makeUnit();

    $meta = $this->service->forListing($unit, 'units');

    expect($meta['canonical'])->toBe(url('/ar/units/'.$unit->slug_ar))
        ->and($meta['hreflang']['ar'])->toBe(url('/ar/units/'.$unit->slug_ar))
        ->and($meta['hreflang']['en'])->toBe(url('/en/units/'.$unit->slug_en))
        ->and($meta['title'])->toBe('وحدة - '.config('app.name'));
});

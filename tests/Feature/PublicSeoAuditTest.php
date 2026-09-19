<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;

use function Pest\Laravel\get;

/**
 * SEO regression audit for public pages: every indexable page must ship a
 * unique title, meta description, canonical, hreflang pair, og:locale and
 * JSON-LD — and filtered/paginated listing URLs must be noindex.
 */
beforeEach(function () {
    $this->unit = createTestUnit(['is_active' => true]);

    $this->project = new Project;
    $this->project->forceFill([
        'name' => 'Seo Project',
        'name_ar' => 'مشروع سيو',
        'name_en' => 'Seo Project',
        'slug' => 'seo-audit-project-'.uniqid(),
        'slug_ar' => 'seo-audit-project-ar-'.uniqid(),
        'slug_en' => 'seo-audit-project-en-'.uniqid(),
        'user_id' => $this->unit->user_id,
        'is_active' => true,
    ]);
    $this->project->save();
});

function assertSeoComplete(string $html, string $page): void
{
    expect(substr_count($html, '<link rel="canonical"'))->toBe(1, "{$page}: exactly one canonical expected");
    expect($html)->toContain('hreflang="ar"')
        ->toContain('hreflang="en"')
        ->toContain('hreflang="x-default"')
        ->toContain('og:locale')
        ->toContain('application/ld+json')
        ->toContain('og:image')
        ->toContain('name="description"');

    preg_match('/<meta name="robots" content="([^"]+)"/', $html, $robots);
    expect($robots[1] ?? '')->toContain('index');
    expect($robots[1] ?? '')->not->toContain('noindex');
}

it('ships complete SEO metadata on all core public pages', function () {
    $area = Area::first();

    $pages = array_filter([
        '/ar',
        '/ar/units',
        '/ar/projects',
        '/ar/articles',
        '/ar/units/deals',
        '/ar/about',
        '/ar/contact',
        '/ar/units/'.$this->unit->slug,
        '/ar/projects/'.$this->project->slug,
        $area ? '/ar/areas/'.$area->slug : null,
    ]);

    foreach ($pages as $page) {
        $response = get($page);
        $response->assertOk();
        assertSeoComplete($response->getContent(), $page);
    }
});

it('gives each listing section a unique title instead of the default one', function () {
    $titles = [];

    foreach (['/ar', '/ar/units', '/ar/projects', '/ar/articles'] as $page) {
        $html = get($page)->getContent();
        preg_match('/<title[^>]*>([^<]*)<\/title>/u', $html, $m);
        $titles[$page] = $m[1] ?? '';
    }

    expect(count(array_unique($titles)))->toBe(count($titles), 'Listing pages share duplicate titles: '.json_encode($titles, JSON_UNESCAPED_UNICODE));
});

it('marks filtered and paginated listing pages as noindex in the initial HTML', function () {
    foreach ([
        '/ar/units?page=2',
        '/ar/units?transaction=sale',
        '/ar/units?area_id=1',
        '/ar/units?price_min=1000',
        '/ar/projects?page=3',
    ] as $page) {
        $html = get($page)->getContent();
        preg_match('/<meta name="robots" content="([^"]+)"/', $html, $robots);
        expect($robots[1] ?? '')->toContain('noindex');
    }
});

it('keeps canonical URLs free of query strings on filtered pages', function () {
    $html = get('/ar/units?page=2&transaction=sale')->getContent();
    preg_match('/<link rel="canonical" href="([^"]+)"/', $html, $canonical);

    expect($canonical[1] ?? '')->not->toContain('?')
        ->and($canonical[1] ?? '')->toContain('/ar/units');
});

it('renders BreadcrumbList structured data on detail pages', function () {
    foreach ([
        '/ar/units/'.$this->unit->slug,
        '/ar/projects/'.$this->project->slug,
    ] as $page) {
        expect(get($page)->getContent())->toContain('BreadcrumbList');
    }
});

it('serves a valid sitemap index referencing all section sitemaps', function () {
    $response = get('/sitemap.xml');

    $response->assertOk();
    $xml = $response->getContent();

    foreach (['sitemap-static.xml', 'sitemap-units.xml', 'sitemap-projects.xml', 'sitemap-areas.xml', 'sitemap-articles.xml'] as $section) {
        expect($xml)->toContain($section);
    }
});

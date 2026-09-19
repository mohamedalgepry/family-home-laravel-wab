<?php

use App\Domain\Listings\Models\Article;
use Illuminate\Support\Facades\Cache;

test('sitemap index returns valid xml with sitemapindex schema', function () {
    Cache::forget('sitemap_index_xml');

    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<sitemapindex', $response->getContent());
    $this->assertStringContainsString('sitemap-static.xml', $response->getContent());
    $this->assertStringContainsString('sitemap-units.xml', $response->getContent());
    $this->assertStringContainsString('sitemap-projects.xml', $response->getContent());
    $this->assertStringContainsString('sitemap-articles.xml', $response->getContent());
});

test('sitemap static subfile returns valid urlset xml', function () {
    Cache::forget('sitemap_static_xml');

    $response = $this->get('/sitemap-static.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<urlset', $response->getContent());
    $this->assertStringContainsString('/about', $response->getContent());
    $this->assertStringContainsString('/contact', $response->getContent());
});

test('sitemap units subfile returns valid urlset xml', function () {
    Cache::forget('sitemap_units_xml');

    $response = $this->get('/sitemap-units.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<urlset', $response->getContent());
});

test('sitemap units includes active units and excludes inactive units', function () {
    $activeSlug = 'sitemap-active-'.uniqid();
    $inactiveSlug = 'sitemap-inactive-'.uniqid();

    createTestUnit(['slug_en' => $activeSlug, 'is_active' => true]);
    createTestUnit(['slug_en' => $inactiveSlug, 'is_active' => false]);

    Cache::forget('sitemap_units_xml');

    $response = $this->get('/sitemap-units.xml');

    $response->assertOk();
    $this->assertStringContainsString($activeSlug, $response->getContent());
    $this->assertStringNotContainsString($inactiveSlug, $response->getContent());
});

test('sitemap articles excludes unpublished articles', function () {
    $publishedSlug = 'sitemap-pub-article-'.uniqid();
    $draftSlug = 'sitemap-draft-article-'.uniqid();

    Article::create([
        'title' => 'Published', 'title_ar' => 'منشور', 'title_en' => 'Published',
        'content' => 'x', 'content_ar' => 'س', 'content_en' => 'x',
        'slug' => $publishedSlug, 'slug_ar' => $publishedSlug.'-ar', 'slug_en' => $publishedSlug,
        'is_published' => true,
    ]);
    Article::create([
        'title' => 'Draft', 'title_ar' => 'مسودة', 'title_en' => 'Draft',
        'content' => 'x', 'content_ar' => 'س', 'content_en' => 'x',
        'slug' => $draftSlug, 'slug_ar' => $draftSlug.'-ar', 'slug_en' => $draftSlug,
        'is_published' => false,
    ]);

    Cache::forget('sitemap_articles_xml');

    $response = $this->get('/sitemap-articles.xml');

    $response->assertOk();
    $this->assertStringContainsString($publishedSlug, $response->getContent());
    $this->assertStringNotContainsString($draftSlug, $response->getContent());
});

test('sitemap projects subfile returns valid urlset xml', function () {
    Cache::forget('sitemap_projects_xml');

    $response = $this->get('/sitemap-projects.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<urlset', $response->getContent());
});

test('sitemap articles subfile returns valid urlset xml', function () {
    Cache::forget('sitemap_articles_xml');

    $response = $this->get('/sitemap-articles.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<urlset', $response->getContent());
});

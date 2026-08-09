<?php

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

test('sitemap categories subfile returns valid urlset xml', function () {
    Cache::forget('sitemap_categories_xml');

    $response = $this->get('/sitemap-categories.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml');
    $this->assertStringContainsString('<urlset', $response->getContent());
});

<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\File;
use Tests\TestCase;

class SeoMetadataDuplicationTest extends TestCase
{
    /**
     * Test that all core public routes have zero duplicate SEO meta tags in their dynamic HTML output.
     */
    public function test_dynamic_html_has_no_duplicate_seo_metadata(): void
    {
        $routes = [
            '/ar',
            '/en',
            '/ar/projects',
            '/en/projects',
            '/ar/units',
            '/en/units',
            '/ar/units/deals',
            '/ar/articles',
            '/ar/about',
            '/ar/contact',
        ];

        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertStatus(200);

            $html = $response->getContent();

            // 1. Title count must be exactly 1
            preg_match_all('/<title\b[^>]*>([\s\S]*?)<\/title>/i', $html, $titles);
            $this->assertCount(1, $titles[0], "Route {$route} must have exactly 1 <title> tag.");

            // 2. Meta description count must be exactly 1
            preg_match_all('/<meta\b[^>]+name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $descs);
            $this->assertCount(1, $descs[0], "Route {$route} must have exactly 1 <meta name=\"description\"> tag.");

            // 3. Canonical count must be exactly 1
            preg_match_all('/<link\b[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\'][^>]*>/i', $html, $canons);
            $this->assertCount(1, $canons[0], "Route {$route} must have exactly 1 <link rel=\"canonical\"> tag.");

            // 4. OpenGraph tags must not be duplicated
            preg_match_all('/<meta\b[^>]+property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogTitles);
            $this->assertCount(1, $ogTitles[0], "Route {$route} must have exactly 1 og:title tag.");

            preg_match_all('/<meta\b[^>]+property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogDescs);
            $this->assertCount(1, $ogDescs[0], "Route {$route} must have exactly 1 og:description tag.");

            preg_match_all('/<meta\b[^>]+property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogImages);
            $this->assertLessThanOrEqual(1, count($ogImages[0]), "Route {$route} must have at most 1 og:image tag.");

            // 5. Twitter card tags must not be duplicated
            preg_match_all('/<meta\b[^>]+name=["\']twitter:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $twTitles);
            $this->assertLessThanOrEqual(1, count($twTitles[0]), "Route {$route} must have at most 1 twitter:title tag.");

            preg_match_all('/<meta\b[^>]+name=["\']twitter:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $twDescs);
            $this->assertLessThanOrEqual(1, count($twDescs[0]), "Route {$route} must have at most 1 twitter:description tag.");

            // 6. Hreflang tags must have unique hreflangs (no duplicate ar, en, or x-default)
            preg_match_all('/<link\b[^>]+rel=["\']alternate["\'][^>]*hreflang=["\']([^"\']*)["\'][^>]*href=["\']([^"\']*)["\'][^>]*>/i', $html, $hreflangs);
            $langKeys = $hreflangs[1];
            $this->assertCount(count(array_unique($langKeys)), $langKeys, "Route {$route} must have unique hreflang entries.");
        }
    }

    /**
     * Test that all generated prerendered HTML files have zero duplicate SEO meta tags.
     */
    public function test_prerendered_files_have_no_duplicate_seo_metadata(): void
    {
        $prerenderPath = storage_path('app/prerendered');
        if (! File::isDirectory($prerenderPath)) {
            $this->markTestSkipped('Prerendered directory does not exist yet.');
        }

        $htmlFiles = File::allFiles($prerenderPath);
        $this->assertNotEmpty($htmlFiles, 'Expected prerendered HTML files to exist.');

        foreach ($htmlFiles as $file) {
            if ($file->getExtension() !== 'html') {
                continue;
            }

            $html = File::get($file->getRealPath());
            $relPath = $file->getRelativePathname();

            // 1. Title count must be exactly 1
            preg_match_all('/<title\b[^>]*>([\s\S]*?)<\/title>/i', $html, $titles);
            $this->assertCount(1, $titles[0], "Prerendered file {$relPath} must have exactly 1 <title> tag.");

            // 2. Meta description count must be exactly 1
            preg_match_all('/<meta\b[^>]+name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $descs);
            $this->assertCount(1, $descs[0], "Prerendered file {$relPath} must have exactly 1 <meta name=\"description\"> tag.");

            // 3. Canonical count must be exactly 1
            preg_match_all('/<link\b[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']*)["\'][^>]*>/i', $html, $canons);
            $this->assertCount(1, $canons[0], "Prerendered file {$relPath} must have exactly 1 <link rel=\"canonical\"> tag.");

            // 4. OpenGraph tags must not be duplicated
            preg_match_all('/<meta\b[^>]+property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogTitles);
            $this->assertCount(1, $ogTitles[0], "Prerendered file {$relPath} must have exactly 1 og:title tag.");

            preg_match_all('/<meta\b[^>]+property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogDescs);
            $this->assertCount(1, $ogDescs[0], "Prerendered file {$relPath} must have exactly 1 og:description tag.");

            preg_match_all('/<meta\b[^>]+property=["\']og:image["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $ogImages);
            $this->assertLessThanOrEqual(1, count($ogImages[0]), "Prerendered file {$relPath} must have at most 1 og:image tag.");

            // 5. Twitter card tags must not be duplicated
            preg_match_all('/<meta\b[^>]+name=["\']twitter:title["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $twTitles);
            $this->assertLessThanOrEqual(1, count($twTitles[0]), "Prerendered file {$relPath} must have at most 1 twitter:title tag.");

            preg_match_all('/<meta\b[^>]+name=["\']twitter:description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i', $html, $twDescs);
            $this->assertLessThanOrEqual(1, count($twDescs[0]), "Prerendered file {$relPath} must have at most 1 twitter:description tag.");

            // 6. JSON-LD scripts: at most 1 unified JSON-LD schema per page
            preg_match_all('/<script\b[^>]+type=["\']application\/ld\+json["\'][^>]*>([\s\S]*?)<\/script>/i', $html, $jsonLds);
            $this->assertLessThanOrEqual(1, count($jsonLds[0]), "Prerendered file {$relPath} must have at most 1 unified JSON-LD script tag.");
        }
    }
}

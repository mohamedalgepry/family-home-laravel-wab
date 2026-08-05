<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController
{
    public function __invoke(): Response
    {
        return $this->index();
    }

    public function index(): Response
    {
        $content = Cache::remember('sitemap_index_xml', 3600, function () {
            $baseUrl = rtrim(config('app.url'), '/');

            $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
            $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
            $xml .= '    <sitemap>'."\n";
            $xml .= '        <loc>'.$baseUrl.'/sitemap-static.xml</loc>'."\n";
            $xml .= '    </sitemap>'."\n";
            $xml .= '    <sitemap>'."\n";
            $xml .= '        <loc>'.$baseUrl.'/sitemap-units.xml</loc>'."\n";
            $xml .= '    </sitemap>'."\n";
            $xml .= '    <sitemap>'."\n";
            $xml .= '        <loc>'.$baseUrl.'/sitemap-projects.xml</loc>'."\n";
            $xml .= '    </sitemap>'."\n";
            $xml .= '    <sitemap>'."\n";
            $xml .= '        <loc>'.$baseUrl.'/sitemap-articles.xml</loc>'."\n";
            $xml .= '    </sitemap>'."\n";
            $xml .= '    <sitemap>'."\n";
            $xml .= '        <loc>'.$baseUrl.'/sitemap-categories.xml</loc>'."\n";
            $xml .= '    </sitemap>'."\n";
            $xml .= '</sitemapindex>';

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    public function static(): Response
    {
        $content = Cache::remember('sitemap_static_xml', 3600, function () {
            $xml = $this->startUrlSet();

            $xml .= $this->urlEntry('/', now(), '1.0', 'daily');
            $xml .= $this->urlEntry('/units', now(), '0.8', 'hourly');
            $xml .= $this->urlEntry('/units/deals', now(), '0.6', 'daily');
            $xml .= $this->urlEntry('/projects', now(), '0.8', 'hourly');
            $xml .= $this->urlEntry('/articles', now(), '0.8', 'daily');
            $xml .= $this->urlEntry('/about', now(), '0.5', 'monthly');
            $xml .= $this->urlEntry('/contact', now(), '0.5', 'monthly');

            $xml .= $this->endUrlSet();

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    public function units(): Response
    {
        $content = Cache::remember('sitemap_units_xml', 3600, function () {
            $xml = $this->startUrlSet();

            Unit::active()->chunk(500, function ($units) use (&$xml) {
                foreach ($units as $unit) {
                    $arSlug = $unit->slug_ar ?? $unit->slug;
                    $enSlug = $unit->slug_en ?? $unit->slug;
                    $xml .= $this->urlEntry(
                        ['ar' => "/units/{$arSlug}", 'en' => "/units/{$enSlug}"],
                        $unit->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });

            $xml .= $this->endUrlSet();

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    public function projects(): Response
    {
        $content = Cache::remember('sitemap_projects_xml', 3600, function () {
            $xml = $this->startUrlSet();

            Project::where('is_active', true)->chunk(500, function ($projects) use (&$xml) {
                foreach ($projects as $project) {
                    $arSlug = $project->slug_ar ?? $project->slug;
                    $enSlug = $project->slug_en ?? $project->slug;
                    $xml .= $this->urlEntry(
                        ['ar' => "/projects/{$arSlug}", 'en' => "/projects/{$enSlug}"],
                        $project->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });

            $xml .= $this->endUrlSet();

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    public function articles(): Response
    {
        $content = Cache::remember('sitemap_articles_xml', 3600, function () {
            $xml = $this->startUrlSet();

            Article::where('is_published', true)->chunk(500, function ($articles) use (&$xml) {
                foreach ($articles as $article) {
                    $arSlug = $article->slug_ar ?? $article->slug;
                    $enSlug = $article->slug_en ?? $article->slug;
                    $xml .= $this->urlEntry(
                        ['ar' => "/articles/{$arSlug}", 'en' => "/articles/{$enSlug}"],
                        $article->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });

            $xml .= $this->endUrlSet();

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    public function categories(): Response
    {
        $content = Cache::remember('sitemap_categories_xml', 3600, function () {
            $xml = $this->startUrlSet();

            Category::chunk(500, function ($categories) use (&$xml) {
                foreach ($categories as $category) {
                    $arSlug = $category->slug_ar ?? $category->slug;
                    $enSlug = $category->slug_en ?? $category->slug;
                    $xml .= $this->urlEntry(
                        ['ar' => "/articles?category={$arSlug}", 'en' => "/articles?category={$enSlug}"],
                        $category->updated_at ?? null,
                        '0.4',
                        'weekly'
                    );
                }
            });

            $xml .= $this->endUrlSet();

            return $xml;
        });

        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    private function startUrlSet(): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'."\n";

        return $xml;
    }

    private function endUrlSet(): string
    {
        return '</urlset>';
    }

    private function urlEntry(string|array $path, mixed $lastmod = null, string $priority = '0.5', string $changefreq = 'weekly'): string
    {
        $baseUrl = rtrim(config('app.url'), '/');

        if (is_array($path)) {
            $pathAr = ltrim($path['ar'] ?? '', '/');
            $pathEn = ltrim($path['en'] ?? '', '/');
        } else {
            $pathAr = ltrim($path, '/');
            $pathEn = ltrim($path, '/');
        }

        $urlAr = $baseUrl.'/ar'.($pathAr ? '/'.$pathAr : '');
        $urlEn = $baseUrl.'/en'.($pathEn ? '/'.$pathEn : '');

        $entry = '';

        foreach (['ar' => $urlAr, 'en' => $urlEn] as $lang => $url) {
            $entry .= "  <url>\n";
            $entry .= '    <loc>'.htmlspecialchars($url, ENT_XML1, 'UTF-8')."</loc>\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="ar" href="'.htmlspecialchars($urlAr, ENT_XML1, 'UTF-8')."\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="en" href="'.htmlspecialchars($urlEn, ENT_XML1, 'UTF-8')."\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="x-default" href="'.htmlspecialchars($urlAr, ENT_XML1, 'UTF-8')."\" />\n";

            if ($lastmod) {
                $entry .= '    <lastmod>'.$lastmod->toW3cString()."</lastmod>\n";
            }

            $entry .= "    <changefreq>{$changefreq}</changefreq>\n";
            $entry .= "    <priority>{$priority}</priority>\n";
            $entry .= "  </url>\n";
        }

        return $entry;
    }
}

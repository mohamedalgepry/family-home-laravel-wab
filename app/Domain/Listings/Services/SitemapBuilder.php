<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Support\Carbon;

class SitemapBuilder
{
    public function baseUrl(): string
    {
        return rtrim(config('app.url', 'https://familyhome-co.com'), '/');
    }

    public function buildIndex(): string
    {
        $baseUrl = $this->baseUrl();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";

        foreach (['static', 'units', 'projects', 'articles', 'categories'] as $part) {
            $xml .= "    <sitemap>\n";
            $xml .= '        <loc>'.htmlspecialchars("{$baseUrl}/sitemap-{$part}.xml", ENT_XML1, 'UTF-8')."</loc>\n";
            $xml .= "    </sitemap>\n";
        }

        $xml .= '</sitemapindex>';

        return $xml;
    }

    public function buildStatic(): string
    {
        $xml = $this->startUrlSet();

        $xml .= $this->urlEntry('/', now(), '1.0', 'daily');
        $xml .= $this->urlEntry('/units', now(), '0.8', 'hourly');
        $xml .= $this->urlEntry('/units/deals', now(), '0.6', 'daily');
        $xml .= $this->urlEntry('/projects', now(), '0.8', 'hourly');
        $xml .= $this->urlEntry('/articles', now(), '0.8', 'daily');
        $xml .= $this->urlEntry('/compare', now(), '0.5', 'weekly');
        $xml .= $this->urlEntry('/about', now(), '0.5', 'monthly');
        $xml .= $this->urlEntry('/contact', now(), '0.5', 'monthly');

        return $xml.$this->endUrlSet();
    }

    public function buildUnits(): string
    {
        $xml = $this->startUrlSet();

        Unit::active()->chunk(500, function ($units) use (&$xml) {
            foreach ($units as $unit) {
                $arSlug = $unit->slug_ar ?? $unit->slug;
                $enSlug = $unit->slug_en ?? $unit->slug;

                if (! $arSlug || ! $enSlug) {
                    continue;
                }

                $xml .= $this->urlEntry(
                    ['ar' => "/units/{$arSlug}", 'en' => "/units/{$enSlug}"],
                    $unit->updated_at,
                    '0.6',
                    'weekly'
                );
            }
        });

        return $xml.$this->endUrlSet();
    }

    public function buildProjects(): string
    {
        $xml = $this->startUrlSet();

        Project::where('is_active', true)->chunk(500, function ($projects) use (&$xml) {
            foreach ($projects as $project) {
                $arSlug = $project->slug_ar ?? $project->slug;
                $enSlug = $project->slug_en ?? $project->slug;

                if (! $arSlug || ! $enSlug) {
                    continue;
                }

                $xml .= $this->urlEntry(
                    ['ar' => "/projects/{$arSlug}", 'en' => "/projects/{$enSlug}"],
                    $project->updated_at,
                    '0.6',
                    'weekly'
                );
            }
        });

        return $xml.$this->endUrlSet();
    }

    public function buildArticles(): string
    {
        $xml = $this->startUrlSet();

        Article::where('is_published', true)->chunk(500, function ($articles) use (&$xml) {
            foreach ($articles as $article) {
                $arSlug = $article->slug_ar ?? $article->slug;
                $enSlug = $article->slug_en ?? $article->slug;

                if (! $arSlug || ! $enSlug) {
                    continue;
                }

                $xml .= $this->urlEntry(
                    ['ar' => "/articles/{$arSlug}", 'en' => "/articles/{$enSlug}"],
                    $article->updated_at,
                    '0.6',
                    'weekly'
                );
            }
        });

        return $xml.$this->endUrlSet();
    }

    public function buildCategories(): string
    {
        $xml = $this->startUrlSet();

        Category::whereHas('articles', fn ($query) => $query->where('is_published', true))
            ->chunk(500, function ($categories) use (&$xml) {
                foreach ($categories as $category) {
                    $arSlug = $category->slug_ar ?? $category->slug;
                    $enSlug = $category->slug_en ?? $category->slug;

                    if (! $arSlug || ! $enSlug) {
                        continue;
                    }

                    $xml .= $this->urlEntry(
                        ['ar' => "/articles?category={$arSlug}", 'en' => "/articles?category={$enSlug}"],
                        $category->updated_at,
                        '0.5',
                        'weekly'
                    );
                }
            });

        return $xml.$this->endUrlSet();
    }

    public function buildRobots(): string
    {
        $baseUrl = $this->baseUrl();

        return implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Allow: /ar/',
            'Allow: /en/',
            'Allow: /units/',
            'Allow: /projects/',
            'Allow: /articles/',
            'Allow: /about',
            'Allow: /contact',
            'Allow: /compare',
            '',
            'Disallow: /admin/',
            'Disallow: /login',
            'Disallow: /logout',
            'Disallow: /register',
            'Disallow: /forgot-password',
            'Disallow: /reset-password',
            'Disallow: /verify-otp',
            'Disallow: /storage/temp/',
            '',
            "Sitemap: {$baseUrl}/sitemap.xml",
            '',
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
        $baseUrl = $this->baseUrl();

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

        foreach (['ar' => $urlAr, 'en' => $urlEn] as $url) {
            $entry .= "  <url>\n";
            $entry .= '    <loc>'.htmlspecialchars($url, ENT_XML1, 'UTF-8')."</loc>\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="ar" href="'.htmlspecialchars($urlAr, ENT_XML1, 'UTF-8')."\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="en" href="'.htmlspecialchars($urlEn, ENT_XML1, 'UTF-8')."\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="x-default" href="'.htmlspecialchars($urlAr, ENT_XML1, 'UTF-8')."\" />\n";

            if ($lastmod) {
                $entry .= '    <lastmod>'.$this->formatLastmod($lastmod)."</lastmod>\n";
            }

            $entry .= "    <changefreq>{$changefreq}</changefreq>\n";
            $entry .= "    <priority>{$priority}</priority>\n";
            $entry .= "  </url>\n";
        }

        return $entry;
    }

    private function formatLastmod(mixed $lastmod): string
    {
        if ($lastmod instanceof Carbon) {
            return $lastmod->toW3cString();
        }

        if (is_string($lastmod) && $lastmod !== '') {
            return Carbon::parse($lastmod)->toW3cString();
        }

        return now()->toW3cString();
    }
}

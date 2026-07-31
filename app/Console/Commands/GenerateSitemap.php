<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate public/sitemap.xml with updated listing and project URLs';

    public function handle(): int
    {
        $baseUrl = rtrim(config('app.url', 'https://familyhome-co.com'), '/');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";

        $xml .= $this->urlEntry($baseUrl, '/', now(), '1.0', 'daily');
        $xml .= $this->urlEntry($baseUrl, '/units', now(), '0.8', 'hourly');
        $xml .= $this->urlEntry($baseUrl, '/units/deals', now(), '0.6', 'daily');
        $xml .= $this->urlEntry($baseUrl, '/projects', now(), '0.8', 'hourly');
        $xml .= $this->urlEntry($baseUrl, '/articles', now(), '0.8', 'daily');
        $xml .= $this->urlEntry($baseUrl, '/about', now(), '0.5', 'monthly');
        $xml .= $this->urlEntry($baseUrl, '/contact', now(), '0.5', 'monthly');

        try {
            Unit::active()->chunk(500, function ($units) use ($baseUrl, &$xml) {
                foreach ($units as $unit) {
                    $arSlug = $unit->slug_ar ?? $unit->slug;
                    $enSlug = $unit->slug_en ?? $unit->slug;
                    $xml .= $this->urlEntry(
                        $baseUrl,
                        ['ar' => "/units/{$arSlug}", 'en' => "/units/{$enSlug}"],
                        $unit->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });
        } catch (\Throwable $e) {
            Log::error('GenerateSitemap units section failed', ['error' => $e->getMessage()]);
        }

        try {
            Project::where('is_active', true)->chunk(500, function ($projects) use ($baseUrl, &$xml) {
                foreach ($projects as $project) {
                    $arSlug = $project->slug_ar ?? $project->slug;
                    $enSlug = $project->slug_en ?? $project->slug;
                    $xml .= $this->urlEntry(
                        $baseUrl,
                        ['ar' => "/projects/{$arSlug}", 'en' => "/projects/{$enSlug}"],
                        $project->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });
        } catch (\Throwable $e) {
            Log::error('GenerateSitemap projects section failed', ['error' => $e->getMessage()]);
        }

        try {
            Article::where('is_published', true)->chunk(500, function ($articles) use ($baseUrl, &$xml) {
                foreach ($articles as $article) {
                    $arSlug = $article->slug_ar ?? $article->slug;
                    $enSlug = $article->slug_en ?? $article->slug;
                    $xml .= $this->urlEntry(
                        $baseUrl,
                        ['ar' => "/articles/{$arSlug}", 'en' => "/articles/{$enSlug}"],
                        $article->updated_at,
                        '0.6',
                        'weekly'
                    );
                }
            });
        } catch (\Throwable $e) {
            Log::error('GenerateSitemap articles section failed', ['error' => $e->getMessage()]);
        }

        try {
            Category::whereHas('articles', fn ($query) => $query->where('is_published', true))
                ->chunk(500, function ($categories) use ($baseUrl, &$xml) {
                foreach ($categories as $category) {
                    $arSlug = $category->slug_ar ?? $category->slug;
                    $enSlug = $category->slug_en ?? $category->slug;
                    $xml .= $this->urlEntry(
                        $baseUrl,
                        ['ar' => "/articles?category={$arSlug}", 'en' => "/articles?category={$enSlug}"],
                        $category->updated_at,
                        '0.5',
                        'weekly'
                    );
                }
                });
        } catch (\Throwable $e) {
            Log::error('GenerateSitemap categories section failed', ['error' => $e->getMessage()]);
        }

        $xml .= '</urlset>';

        file_put_contents(public_path('sitemap.xml'), $xml);

        $this->info('public/sitemap.xml generated successfully!');
        return Command::SUCCESS;
    }

    private function urlEntry(string $baseUrl, string|array $path, mixed $lastmod = null, string $priority = '0.5', string $changefreq = 'weekly'): string
    {
        if (is_array($path)) {
            $pathAr = ltrim($path['ar'] ?? '', '/');
            $pathEn = ltrim($path['en'] ?? '', '/');
        } else {
            $pathAr = ltrim($path, '/');
            $pathEn = ltrim($path, '/');
        }

        $urlAr = $baseUrl . '/ar' . ($pathAr ? '/' . $pathAr : '');
        $urlEn = $baseUrl . '/en' . ($pathEn ? '/' . $pathEn : '');

        $entry = '';
        foreach (['ar' => $urlAr, 'en' => $urlEn] as $lang => $url) {
            $entry .= "  <url>\n";
            $entry .= '    <loc>' . htmlspecialchars($url, ENT_XML1, 'UTF-8') . "</loc>\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="ar" href="' . htmlspecialchars($urlAr, ENT_XML1, 'UTF-8') . "\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="en" href="' . htmlspecialchars($urlEn, ENT_XML1, 'UTF-8') . "\" />\n";
            $entry .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . htmlspecialchars($urlAr, ENT_XML1, 'UTF-8') . "\" />\n";

            if ($lastmod) {
                $dateStr = is_object($lastmod) ? $lastmod->toW3cString() : date('c', strtotime($lastmod));
                $entry .= '    <lastmod>' . $dateStr . "</lastmod>\n";
            } else {
                $entry .= '    <lastmod>' . date('c') . "</lastmod>\n";
            }

            $entry .= "    <changefreq>{$changefreq}</changefreq>\n";
            $entry .= "    <priority>{$priority}</priority>\n";
            $entry .= "  </url>\n";
        }
        return $entry;
    }
}

<?php

namespace App\Domain\Listings\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SitemapService
{
    public function __construct(
        private readonly SitemapBuilder $builder,
    ) {}

    /** Invalidate cached responses and rewrite all public sitemap files immediately. */
    public function regenerate(): void
    {
        $this->forgetCache();

        try {
            $this->writePublicFiles();
        } catch (\Throwable $exception) {
            Log::error('Sitemap regeneration failed', [
                'error' => $exception->getMessage(),
            ]);
        }
    }

    public function forgetCache(): void
    {
        foreach ($this->cacheKeys() as $key) {
            Cache::forget($key);
        }
    }

    public function remember(string $key, callable $callback): string
    {
        return Cache::remember($key, 3600, $callback);
    }

    public function writePublicFiles(): void
    {
        $files = [
            'sitemap.xml' => $this->builder->buildIndex(),
            'sitemap-static.xml' => $this->builder->buildStatic(),
            'sitemap-units.xml' => $this->builder->buildUnits(),
            'sitemap-projects.xml' => $this->builder->buildProjects(),
            'sitemap-articles.xml' => $this->builder->buildArticles(),
            'robots.txt' => $this->builder->buildRobots(),
        ];

        foreach ($files as $filename => $contents) {
            file_put_contents(public_path($filename), $contents);
        }
    }

    /** @return list<string> */
    public function cacheKeys(): array
    {
        return [
            'sitemap_index_xml',
            'sitemap_static_xml',
            'sitemap_units_xml',
            'sitemap_projects_xml',
            'sitemap_articles_xml',
        ];
    }
}

<?php

namespace App\Domain\Listings\Services;

use Illuminate\Support\Facades\Cache;

class SitemapService
{
    public function __construct(
        private readonly SitemapBuilder $builder,
    ) {}

    /** Invalidate cached responses and rewrite all public sitemap files immediately. */
    public function regenerate(): void
    {
        $this->forgetCache();
        $this->writePublicFiles();
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
            'sitemap-areas.xml' => $this->builder->buildAreas(),
            'robots.txt' => $this->builder->buildRobots(),
        ];

        foreach ($files as $filename => $contents) {
            $target = public_path($filename);
            $temporary = $target.'.'.bin2hex(random_bytes(8)).'.tmp';

            if (file_put_contents($temporary, $contents, LOCK_EX) === false || ! rename($temporary, $target)) {
                @unlink($temporary);
                throw new \RuntimeException("Unable to write sitemap file: {$filename}");
            }
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
            'sitemap_areas_xml',
        ];
    }
}

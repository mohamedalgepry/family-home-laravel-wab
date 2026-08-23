<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExportPrerenderData extends Command
{
    protected $signature = 'prerender:data';

    protected $description = 'Export all public page route HTML templates and Inertia page objects for static prerendering';

    public function handle(): int
    {
        $baseUrl = $this->resolveBaseUrl();
        $dbAvailable = $this->isDbAvailable();
        $urls = $this->collectUrls($dbAvailable);
        $results = [];
        $kernel = app(Kernel::class);

        foreach ($urls as $item) {
            $url = $item['url'];
            $outputPath = $item['output'];

            try {
                $request = Request::create($baseUrl.$url, 'GET');
                $response = $kernel->handle($request);
                $html = $this->normalizeBaseUrls($response->getContent() ?? '', $baseUrl);
                $kernel->terminate($request, $response);

                if ($html && (
                    preg_match('/<script data-page="app"[^>]*>(.*?)<\/script>/s', $html, $matches) ||
                    preg_match('/data-page="([^"]+)"/', $html, $matches)
                )) {
                    $pageJsonRaw = isset($matches[1]) && str_starts_with(trim($matches[1]), '{')
                        ? $matches[1]
                        : html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
                    $pageObject = json_decode($pageJsonRaw, true);

                    if ($pageObject) {
                        $results[] = [
                            'url' => $url,
                            'output' => $outputPath,
                            'baseUrl' => $baseUrl,
                            'htmlTemplate' => $html,
                            'page' => $this->normalizePageUrls($pageObject, $baseUrl),
                        ];
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("ExportPrerenderData failed for URL {$url}: ".$e->getMessage());
            }
        }

        if (empty($results) && file_exists(storage_path('app/prerender_pages.json'))) {
            $existingRaw = file_get_contents(storage_path('app/prerender_pages.json'));
            $existing = json_decode($existingRaw, true);
            if (is_array($existing) && ! empty($existing)) {
                $updated = [];
                foreach ($existing as $item) {
                    $item['baseUrl'] = $baseUrl;
                    $item['htmlTemplate'] = $this->normalizeBaseUrls($item['htmlTemplate'] ?? '', $baseUrl);
                    $item['page'] = $this->normalizePageUrls($item['page'] ?? [], $baseUrl);
                    $updated[] = $item;
                }
                $results = $updated;
                $this->info('Used and normalized existing exported page templates from storage/app/prerender_pages.json.');
            }
        }

        $filePath = storage_path('app/prerender_pages.json');
        file_put_contents($filePath, json_encode($results, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
        $this->info('Exported '.count($results)." page templates to {$filePath}");

        return Command::SUCCESS;
    }

    private function isDbAvailable(): bool
    {
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();

            return true;
        } catch (\Throwable $e) {
            Log::warning('ExportPrerenderData: Database unavailable — proceeding with core static pages.');
            if ($this->output) {
                $this->warn('Database unavailable — proceeding with core static pages.');
            }

            return false;
        }
    }

    private function collectUrls(bool $dbAvailable = true): array
    {
        $items = [];
        $locales = ['ar', 'en'];

        foreach ($locales as $locale) {
            // Home
            $items[] = ['url' => "/{$locale}", 'output' => "{$locale}/index.html"];

            // Static pages
            $items[] = ['url' => "/{$locale}/units", 'output' => "{$locale}/units/index.html"];
            $items[] = ['url' => "/{$locale}/units/deals", 'output' => "{$locale}/units/deals.html"];
            $items[] = ['url' => "/{$locale}/projects", 'output' => "{$locale}/projects/index.html"];
            $items[] = ['url' => "/{$locale}/articles", 'output' => "{$locale}/articles/index.html"];
            $items[] = ['url' => "/{$locale}/about", 'output' => "{$locale}/about.html"];
            $items[] = ['url' => "/{$locale}/contact", 'output' => "{$locale}/contact.html"];
        }

        if ($dbAvailable) {
            foreach ($locales as $locale) {
                // Units
                try {
                    Unit::active()->chunk(200, function ($units) use (&$items, $locale) {
                        foreach ($units as $unit) {
                            $slug = $locale === 'ar' ? ($unit->slug_ar ?? $unit->slug) : ($unit->slug_en ?? $unit->slug);
                            if ($slug) {
                                $items[] = [
                                    'url' => "/{$locale}/units/{$slug}",
                                    'output' => "{$locale}/units/{$slug}.html",
                                ];
                            }
                        }
                    });
                } catch (\Throwable $e) {
                    Log::error('ExportPrerenderData units failed', ['error' => $e->getMessage()]);
                }

                // Projects
                try {
                    Project::where('is_active', true)->chunk(200, function ($projects) use (&$items, $locale) {
                        foreach ($projects as $project) {
                            $slug = $locale === 'ar' ? ($project->slug_ar ?? $project->slug) : ($project->slug_en ?? $project->slug);
                            if ($slug) {
                                $items[] = [
                                    'url' => "/{$locale}/projects/{$slug}",
                                    'output' => "{$locale}/projects/{$slug}.html",
                                ];
                            }
                        }
                    });
                } catch (\Throwable $e) {
                    Log::error('ExportPrerenderData projects failed', ['error' => $e->getMessage()]);
                }

                // Articles
                try {
                    Article::where('is_published', true)->chunk(200, function ($articles) use (&$items, $locale) {
                        foreach ($articles as $article) {
                            $slug = $locale === 'ar' ? ($article->slug_ar ?? $article->slug) : ($article->slug_en ?? $article->slug);
                            if ($slug) {
                                $items[] = [
                                    'url' => "/{$locale}/articles/{$slug}",
                                    'output' => "{$locale}/articles/{$slug}.html",
                                ];
                            }
                        }
                    });
                } catch (\Throwable $e) {
                    Log::error('ExportPrerenderData articles failed', ['error' => $e->getMessage()]);
                }
            }
        }

        return $items;
    }

    private function resolveBaseUrl(): string
    {
        $configured = env('PRERENDER_BASE_URL');

        if (! empty($configured)) {
            return rtrim((string) $configured, '/');
        }

        $appUrl = (string) config('app.url');
        if (str_contains($appUrl, '127.0.0.1') || str_contains($appUrl, 'localhost')) {
            return 'https://familyhome-co.com';
        }

        return rtrim($appUrl, '/');
    }

    private function normalizeBaseUrls(string $html, string $baseUrl): string
    {
        if ($html === '') {
            return '';
        }

        // 1. Cleanly strip any dev host prefix from static assets, making them root-relative (/build/assets/..., /storage/..., /images/..., /fonts/...)
        $html = preg_replace(
            '#https?://(?:localhost|127\.0\.0\.1)(?::\d+)?(/build/[^\s"\'<>]+|/images/[^\s"\'<>]+|/fonts/[^\s"\'<>]+|/storage/[^\s"\'<>]+|/(?:favicon\.ico|icon\.(?:png|webp)|site\.webmanifest))#i',
            '$1',
            $html
        );

        // 2. Also strip JSON-escaped dev host prefix from static assets (http:\/\/127.0.0.1:8000\/...)
        $html = preg_replace(
            '#https?:\\\\/\\\\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\\\\/build\\\\[^\s"\'<>]+|\\\\/images\\\\[^\s"\'<>]+|\\\\/fonts\\\\[^\s"\'<>]+|\\\\/storage\\\\[^\s"\'<>]+|\\\\/(?:favicon\.ico|icon\.(?:png|webp)|site\.webmanifest))#i',
            '$1',
            $html
        );

        // 3. For canonical, og:url, og:image, twitter, json-ld schemas: replace remaining localhost/127.0.0.1 with baseUrl
        $escapedBaseUrl = str_replace('/', '\/', $baseUrl);
        $html = preg_replace('#https?:\\\\/\\\\/(?:localhost|127\.0\.0\.1)(?::\d+)?#i', $escapedBaseUrl, $html);
        $html = preg_replace('#https?://(?:localhost|127\.0\.0\.1)(?::\d+)?#i', $baseUrl, $html);

        return $html;
    }

    private function normalizePageUrls(array $page, string $baseUrl): array
    {
        $escapedBaseUrl = str_replace('/', '\/', $baseUrl);

        array_walk_recursive($page, function (&$value) use ($baseUrl, $escapedBaseUrl) {
            if (is_string($value)) {
                // Strip dev host prefix from static asset paths
                $value = preg_replace(
                    '#^https?://(?:localhost|127\.0\.0\.1)(?::\d+)?(/build/[^\s"\'<>]+|/images/[^\s"\'<>]+|/fonts/[^\s"\'<>]+|/storage/[^\s"\'<>]+|/(?:favicon\.ico|icon\.(?:png|webp)|site\.webmanifest))#i',
                    '$1',
                    $value
                );

                // Replace remaining dev host with baseUrl
                $value = preg_replace('#https?:\\\\/\\\\/(?:localhost|127\.0\.0\.1)(?::\d+)?#i', $escapedBaseUrl, $value);
                $value = preg_replace('#https?://(?:localhost|127\.0\.0\.1)(?::\d+)?#i', $baseUrl, $value);
            }
        });

        return $page;
    }
}

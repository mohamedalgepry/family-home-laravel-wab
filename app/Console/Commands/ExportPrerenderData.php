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
        $urls = $this->collectUrls();
        $results = [];
        $kernel = app(Kernel::class);

        foreach ($urls as $item) {
            $url = $item['url'];
            $outputPath = $item['output'];

            try {
                $request = Request::create('http://localhost'.$url, 'GET');
                $response = $kernel->handle($request);
                $html = $response->getContent();
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
                            'htmlTemplate' => $html,
                            'page' => $pageObject,
                        ];
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("ExportPrerenderData failed for URL {$url}: ".$e->getMessage());
            }
        }

        $filePath = storage_path('app/prerender_pages.json');
        file_put_contents($filePath, json_encode($results, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE));
        $this->info('Exported '.count($results)." page templates to {$filePath}");

        return Command::SUCCESS;
    }

    private function collectUrls(): array
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

        return $items;
    }
}

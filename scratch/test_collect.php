<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;

$items = [];
$locales = ['ar', 'en'];

foreach ($locales as $locale) {
    $items[] = ['url' => "/{$locale}", 'output' => "{$locale}/index.html"];
    $items[] = ['url' => "/{$locale}/units", 'output' => "{$locale}/units/index.html"];
    $items[] = ['url' => "/{$locale}/units/deals", 'output' => "{$locale}/units/deals.html"];
    $items[] = ['url' => "/{$locale}/projects", 'output' => "{$locale}/projects/index.html"];
    $items[] = ['url' => "/{$locale}/articles", 'output' => "{$locale}/articles/index.html"];
    $items[] = ['url' => "/{$locale}/about", 'output' => "{$locale}/about.html"];
    $items[] = ['url' => "/{$locale}/contact", 'output' => "{$locale}/contact.html"];

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
        echo "Unit error: " . $e->getMessage() . PHP_EOL;
    }

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
        echo "Project error: " . $e->getMessage() . PHP_EOL;
    }

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
        echo "Article error: " . $e->getMessage() . PHP_EOL;
    }
}

echo "Total items to render: " . count($items) . PHP_EOL;

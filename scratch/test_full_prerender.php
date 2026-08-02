<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

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

    Unit::active()->chunk(200, function ($units) use (&$items, $locale) {
        foreach ($units as $unit) {
            $slug = $locale === 'ar' ? ($unit->slug_ar ?? $unit->slug) : ($unit->slug_en ?? $unit->slug);
            if ($slug) {
                $items[] = ['url' => "/{$locale}/units/{$slug}", 'output' => "{$locale}/units/{$slug}.html"];
            }
        }
    });

    Project::where('is_active', true)->chunk(200, function ($projects) use (&$items, $locale) {
        foreach ($projects as $project) {
            $slug = $locale === 'ar' ? ($project->slug_ar ?? $project->slug) : ($project->slug_en ?? $project->slug);
            if ($slug) {
                $items[] = ['url' => "/{$locale}/projects/{$slug}", 'output' => "{$locale}/projects/{$slug}.html"];
            }
        }
    });

    Article::where('is_published', true)->chunk(200, function ($articles) use (&$items, $locale) {
        foreach ($articles as $article) {
            $slug = $locale === 'ar' ? ($article->slug_ar ?? $article->slug) : ($article->slug_en ?? $article->slug);
            if ($slug) {
                $items[] = ['url' => "/{$locale}/articles/{$slug}", 'output' => "{$locale}/articles/{$slug}.html"];
            }
        }
    });
}

$results = [];
$errors = 0;

foreach ($items as $item) {
    $url = $item['url'];
    $req = Illuminate\Http\Request::create('http://localhost' . $url, 'GET');
    $res = $kernel->handle($req);
    $html = $res->getContent();

    if ($html && preg_match('/data-page="([^"]+)"/', $html, $matches)) {
        $pageJsonRaw = html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $pageObject = json_decode($pageJsonRaw, true);

        if ($pageObject) {
            $results[] = [
                'url' => $url,
                'output' => $item['output'],
                'htmlTemplate' => $html,
                'page' => $pageObject,
            ];
        } else {
            $errors++;
            echo "json_decode page failed for {$url}: " . json_last_error_msg() . PHP_EOL;
        }
    } else {
        $errors++;
        echo "Regex failed for {$url}, status: " . $res->getStatusCode() . PHP_EOL;
    }
}

$json = json_encode($results, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
echo "Final results count: " . count($results) . PHP_EOL;
echo "JSON length: " . strlen($json) . PHP_EOL;
echo "JSON last error: " . json_last_error_msg() . PHP_EOL;

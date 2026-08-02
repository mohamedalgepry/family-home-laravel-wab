<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use App\Domain\Listings\Models\Unit;

$urls = ['/ar', '/en', '/ar/units', '/en/units'];
$results = [];

foreach ($urls as $url) {
    $req = Illuminate\Http\Request::create('http://localhost' . $url, 'GET');
    $res = $kernel->handle($req);
    $html = $res->getContent();

    if (preg_match('/data-page="([^"]+)"/', $html, $matches)) {
        $pageJsonRaw = html_entity_decode($matches[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $pageObject = json_decode($pageJsonRaw, true);

        $results[] = [
            'url' => $url,
            'output' => ltrim($url, '/') . '/index.html',
            'htmlTemplate' => $html,
            'page' => $pageObject,
        ];
    }
}

$json = json_encode($results, JSON_UNESCAPED_UNICODE);
echo "JSON length: " . strlen($json) . PHP_EOL;
echo "JSON error: " . json_last_error_msg() . PHP_EOL;
echo "Count: " . count($results) . PHP_EOL;

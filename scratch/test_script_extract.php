<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

if (preg_match('/<script id="app"[^>]*>(.*?)<\/script>/s', $html, $m)) {
    echo "Found <script id=\"app\"> body length: " . strlen($m[1]) . PHP_EOL;
    $pageObject = json_decode($m[1], true);
    echo "JSON decode result: " . ($pageObject ? 'SUCCESS! Component: ' . $pageObject['component'] : ('FAILED: ' . json_last_error_msg())) . PHP_EOL;
} else if (preg_match('/data-page="([^"]+)"/', $html, $m)) {
    echo "Found data-page attribute length: " . strlen($m[1]) . PHP_EOL;
} else {
    echo "Neither script nor data-page attribute matched!" . PHP_EOL;
}

<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

if (preg_match('/data-page=["\'](.*?)["\']\s*>/s', $html, $m)) {
    echo "Matched raw length: " . strlen($m[1]) . PHP_EOL;
    echo "Raw snippet: " . substr($m[1], 0, 100) . PHP_EOL;
    $decoded = html_entity_decode($m[1], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo "Decoded snippet: " . substr($decoded, 0, 100) . PHP_EOL;
    $json = json_decode($decoded, true);
    echo "JSON decode result: " . ($json ? 'SUCCESS' : ('FAILED: ' . json_last_error_msg())) . PHP_EOL;
} else {
    echo "REGEX FAILED TO MATCH DATA-PAGE" . PHP_EOL;
}

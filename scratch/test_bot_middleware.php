<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Bot request
$reqBot = Illuminate\Http\Request::create('http://localhost/ar', 'GET', [], [], [], [
    'HTTP_USER_AGENT' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
]);

$resBot = $kernel->handle($reqBot);

echo "=== Googlebot Request ===" . PHP_EOL;
echo "Status: " . $resBot->getStatusCode() . PHP_EOL;
echo "Header X-Prerendered-By: " . $resBot->headers->get('X-Prerendered-By') . PHP_EOL;
echo "HTML Length: " . strlen($resBot->getContent()) . PHP_EOL;
echo "Has <title>: " . (str_contains($resBot->getContent(), '<title>') ? 'YES' : 'NO') . PHP_EOL;
echo "Has Schema JSON-LD: " . (str_contains($resBot->getContent(), 'schema.org') ? 'YES' : 'NO') . PHP_EOL;

// Normal user request
$reqUser = Illuminate\Http\Request::create('http://localhost/ar', 'GET', [], [], [], [
    'HTTP_USER_AGENT' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
]);

$resUser = $kernel->handle($reqUser);

echo PHP_EOL . "=== Normal User Request ===" . PHP_EOL;
echo "Status: " . $resUser->getStatusCode() . PHP_EOL;
echo "Header X-Prerendered-By: " . ($resUser->headers->get('X-Prerendered-By') ?? 'NONE (SPA mode)') . PHP_EOL;

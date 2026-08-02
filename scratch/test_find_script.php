<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

$pos = strpos($html, '<script id="app"');
if ($pos !== false) {
    echo "Found <script id=\"app\" at position {$pos}:\n";
    echo substr($html, $pos, 200) . "\n";
    
    $endPos = strpos($html, '</script>', $pos);
    if ($endPos !== false) {
        $jsonStart = strpos($html, '>', $pos) + 1;
        $jsonRaw = substr($html, $jsonStart, $endPos - $jsonStart);
        echo "JSON raw length: " . strlen($jsonRaw) . PHP_EOL;
        $decoded = json_decode($jsonRaw, true);
        echo "JSON decode: " . ($decoded ? ("SUCCESS (component: " . $decoded['component'] . ")") : ("FAILED: " . json_last_error_msg())) . PHP_EOL;
    }
} else {
    echo "<script id=\"app\" not found in HTML\n";
}

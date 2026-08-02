<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

$pos = strpos($html, 'id="app"');
if ($pos !== false) {
    echo "Found id=\"app\" at position {$pos}:\n";
    echo substr($html, max(0, $pos - 50), 300) . "\n";
} else {
    echo "id=\"app\" not found in HTML\n";
}

<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

echo "HTML snippet around body/app:\n";
if (preg_match('/<body[^>]*>(.*?)<\/body>/s', $html, $m)) {
    echo $m[1] . "\n";
} else {
    echo "Body not found\n";
}

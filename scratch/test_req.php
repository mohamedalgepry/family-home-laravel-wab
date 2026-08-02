<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);

echo 'Status: ' . $res->getStatusCode() . PHP_EOL;
echo 'Length: ' . strlen($res->getContent()) . PHP_EOL;
echo 'Has data-page: ' . (str_contains($res->getContent(), 'data-page=') ? 'YES' : 'NO') . PHP_EOL;
if ($res->getStatusCode() !== 200) {
    echo "Content snippet:\n" . substr($res->getContent(), 0, 500) . PHP_EOL;
}

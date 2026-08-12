<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$svc = app(\App\Domain\Listings\Services\GoogleMapsUrlResolverService::class);
$res = $svc->resolveAndExtract('https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA');
var_dump($res);

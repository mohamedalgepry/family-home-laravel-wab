<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$url = 'https://maps.app.goo.gl/Rvr6hSi4hp5dT7oA6';
$resolver = app(\App\Domain\Listings\Services\GoogleMapsUrlResolverService::class);

$result = $resolver->resolveAndExtract($url);
var_dump(['result' => $result]);

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$unit = \App\Domain\Listings\Models\Unit::first();
if ($unit) {
    var_dump(\App\Http\Resources\Public\UnitPublicResource::make($unit)->resolve());
}

$area = \App\Domain\Listings\Models\Area::first();
if ($area) {
    var_dump(\App\Http\Resources\Public\AreaPublicResource::make($area)->resolve());
}

<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$unit = \App\Domain\Listings\Models\Unit::first();
$unit->priority_points = 50;
$unit->save();

echo "Unit ID {$unit->id} points set to 50\n";

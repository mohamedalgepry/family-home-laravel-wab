<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$areas = \App\Domain\Listings\Models\Area::all();
echo count($areas) . " areas in DB.\n";
foreach ($areas as $a) {
    echo "{$a->id}: {$a->slug} - {$a->name_en} ({$a->latitude}, {$a->longitude})\n";
}

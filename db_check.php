<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$projectsWithCoords = \App\Domain\Listings\Models\Project::whereNotNull('latitude')->get();
$unitsWithCoords = \App\Domain\Listings\Models\Unit::whereNotNull('latitude')->get();

echo "Projects with coords: " . count($projectsWithCoords) . "\n";
foreach ($projectsWithCoords as $p) {
    echo "P: {$p->id} => {$p->latitude}, {$p->longitude}\n";
    if ($p->latitude == '30.0123') {
        $p->latitude = null;
        $p->longitude = null;
        $p->save();
        echo "Cleaned P: {$p->id}\n";
    }
}

echo "Units with coords: " . count($unitsWithCoords) . "\n";
foreach ($unitsWithCoords as $u) {
    echo "U: {$u->id} => {$u->latitude}, {$u->longitude}\n";
    if ($u->latitude == '30.0123') {
        $u->latitude = null;
        $u->longitude = null;
        $u->save();
        echo "Cleaned U: {$u->id}\n";
    }
}

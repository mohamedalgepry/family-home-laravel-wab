<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$p = App\Domain\Listings\Models\Project::first(); 
$p->latitude=30.0123; 
$p->longitude=31.0456; 
$p->save(); 
$u = App\Domain\Listings\Models\Unit::first(); 
$u->latitude=30.0123; 
$u->longitude=31.0456; 
$u->save();
echo "updated";

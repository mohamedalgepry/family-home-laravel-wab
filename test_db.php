<?php

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Schema;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$columns = Schema::getColumnListing('units');
echo "COLUMNS:\n";
print_r($columns);

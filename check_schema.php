<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = \Illuminate\Support\Facades\Schema::getColumnListing('areas');
echo "AREAS COLUMNS:\n";
print_r($columns);

echo "\nFILLABLE IN MODEL:\n";
$model = new \App\Domain\Listings\Models\Area();
print_r($model->getFillable());

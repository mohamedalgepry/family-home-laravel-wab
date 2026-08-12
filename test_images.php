<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$img = \App\Domain\Listings\Models\ProjectImage::latest()->first();
if ($img) {
    echo "Project Image path: " . $img->path . "\n";
    echo "Project Image thumb_path: " . $img->thumb_path . "\n";
}

$uImg = \App\Domain\Listings\Models\UnitImage::latest()->first();
if ($uImg) {
    echo "Unit Image path: " . $uImg->path . "\n";
    echo "Unit Image thumb_path: " . $uImg->thumb_path . "\n";
}

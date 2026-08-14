<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Listings\Models\Area;
use Illuminate\Support\Facades\Storage;

echo "=== Area Image Paths in DB ===\n\n";

$areas = Area::orderBy('id', 'desc')->take(10)->get(['id', 'name_ar', 'image_path', 'hero_image']);

foreach ($areas as $area) {
    echo "ID: {$area->id} | {$area->name_ar}\n";
    echo "  image_path: " . (is_null($area->image_path) ? 'NULL' : var_export($area->image_path, true)) . "\n";
    echo "  hero_image: " . (is_null($area->hero_image) ? 'NULL' : var_export($area->hero_image, true)) . "\n";
    
    // Check if file exists
    if ($area->image_path) {
        $exists = Storage::disk('public')->exists($area->image_path);
        echo "  image_path file exists: " . ($exists ? 'YES' : 'NO') . "\n";
        echo "  Full file path: " . Storage::disk('public')->path($area->image_path) . "\n";
    }
    echo "\n";
}

echo "\n=== Storage disk root ===\n";
echo "Root: " . Storage::disk('public')->path('') . "\n";
echo "\n=== Files in storage/areas ===\n";
$files = Storage::disk('public')->files('areas');
foreach ($files as $f) {
    echo "  - $f\n";
}

<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Listings\Models\Area;
use Illuminate\Support\Facades\Storage;

echo "=== Fixing Area Image Paths in DB ===\n\n";

// Mapping: DB path (webp) => actual file (jpg)
$fileMap = [
    'areas/nasr-city.webp'                  => 'areas/nasr-city.jpg',
    'areas/sheikh-zayed.webp'               => 'areas/sheikh-zayed.jpg',
    'areas/6th-october.webp'               => 'areas/6th-october.jpg',
    'areas/new-cairo.webp'                  => 'areas/new-cairo.jpg',
    'areas/new-administrative-capital.webp' => 'areas/new-administrative-capital.jpg',
    'areas/alexandria.webp'                => 'areas/alexandria.jpg',
    'areas/ain-sokhna.webp'                => 'areas/ain-sokhna.jpg',
    'areas/maadi.webp'                      => 'areas/maadi.jpg',
    'areas/mohandessin.webp'               => 'areas/mohandessin.jpg',
    'areas/rehab.webp'                      => 'areas/rehab.jpg',
];

// List all actual files in storage
$actualFiles = Storage::disk('public')->files('areas');
echo "Actual files in storage:\n";
foreach ($actualFiles as $f) {
    echo "  - $f\n";
}
echo "\n";

// Fix DB entries
$areas = Area::whereNotNull('image_path')->get();
$fixed = 0;

foreach ($areas as $area) {
    $currentPath = $area->image_path;
    $currentHero = $area->hero_image;
    
    $updates = [];
    
    // Check if current image_path exists
    if ($currentPath && !Storage::disk('public')->exists($currentPath)) {
        // Check if jpg version exists
        $jpgVersion = str_replace('.webp', '.jpg', $currentPath);
        if (Storage::disk('public')->exists($jpgVersion)) {
            echo "Fixing {$area->name_ar}: {$currentPath} → {$jpgVersion}\n";
            $updates['image_path'] = $jpgVersion;
        } else {
            echo "Missing: {$currentPath} (no jpg alternative found)\n";
        }
    }
    
    // Check hero image
    if ($currentHero && !Storage::disk('public')->exists($currentHero)) {
        $jpgHero = str_replace('.webp', '.jpg', $currentHero);
        if (Storage::disk('public')->exists($jpgHero)) {
            echo "Fixing hero {$area->name_ar}: {$currentHero} → {$jpgHero}\n";
            $updates['hero_image'] = $jpgHero;
        } else {
            echo "Missing hero: {$currentHero}\n";
        }
    }
    
    if (!empty($updates)) {
        $area->update($updates);
        $fixed++;
    }
}

echo "\nFixed $fixed areas.\n";

echo "\n=== Current State ===\n";
$areas = Area::orderBy('id', 'desc')->take(10)->get(['id', 'name_ar', 'image_path']);
foreach ($areas as $area) {
    $exists = $area->image_path ? Storage::disk('public')->exists($area->image_path) : false;
    echo "{$area->name_ar}: " . ($area->image_path ?: 'NULL') . " | " . ($exists ? '✓ EXISTS' : '✗ MISSING') . "\n";
}

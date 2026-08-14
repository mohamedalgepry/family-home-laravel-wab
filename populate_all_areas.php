<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Database\Seeders\PopulateAllAreasSeeder;
use App\Domain\Listings\Models\Area;

echo "========================================================\n";
echo "    Populating 100% Text & Metadata for All Areas       \n";
echo "========================================================\n";

$seeder = new PopulateAllAreasSeeder();
$seeder->run();

// Clear areas cache so changes reflect instantly
\Illuminate\Support\Facades\Cache::forget(\App\Domain\Listings\Services\ListingLookupService::CACHE_KEY_AREAS);

echo "\nSeeding Completed Successfully!\n";
echo "Checking total areas in DB:\n";

$areas = Area::with(['features', 'nearbyPlaces', 'faqs'])->get();
echo "Total Active Areas: " . $areas->count() . "\n\n";

foreach ($areas as $a) {
    echo "✔ [ID: {$a->id}] {$a->name_ar} ({$a->name_en}) | Slug: {$a->slug}\n";
    echo "  - Hero Title: {$a->hero_title_ar}\n";
    echo "  - About: " . mb_substr($a->about_ar ?? '', 0, 45) . "...\n";
    echo "  - Features Count: " . $a->features->count() . " | Places: " . $a->nearbyPlaces->count() . " | FAQs: " . $a->faqs->count() . "\n";
    echo "--------------------------------------------------------\n";
}

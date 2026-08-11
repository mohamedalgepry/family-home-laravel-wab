<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

$tables = ['unit_images', 'project_images', 'area_images'];

foreach ($tables as $table) {
    if (!Illuminate\Support\Facades\Schema::hasTable($table)) {
        continue;
    }
    
    $images = DB::table($table)->where('path', 'LIKE', '%.webp')->get();
    
    foreach ($images as $img) {
        $path = $img->path;
        $jpgPath = preg_replace('/\.webp$/', '.jpg', $path);
        
        if (!Storage::disk('public')->exists($path) && Storage::disk('public')->exists($jpgPath)) {
            DB::table($table)->where('id', $img->id)->update(['path' => $jpgPath]);
            echo "Fixed $table ID {$img->id}: $path -> $jpgPath\n";
        }
    }
}

echo "Database images fixed successfully!\n";

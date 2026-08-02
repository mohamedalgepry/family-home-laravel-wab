<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Users\Models\AgentProfile;
use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('public');

echo "=== Unit Images ===" . PHP_EOL;
foreach (UnitImage::all() as $img) {
    $exists = $disk->exists($img->path);
    $dir = dirname($img->path);
    $filenameNoExt = pathinfo(basename($img->path), PATHINFO_FILENAME);
    $webpPath = ($dir !== '.' ? $dir . '/' : '') . $filenameNoExt . '.webp';
    $webpExists = $disk->exists($webpPath);
    echo "ID: {$img->id} | Path: {$img->path} | Original Exists: " . ($exists ? 'YES' : 'NO') . " | WebP Exists: " . ($webpExists ? 'YES' : 'NO') . PHP_EOL;
}

echo PHP_EOL . "=== Project Images ===" . PHP_EOL;
foreach (ProjectImage::all() as $img) {
    $exists = $disk->exists($img->path);
    $dir = dirname($img->path);
    $filenameNoExt = pathinfo(basename($img->path), PATHINFO_FILENAME);
    $webpPath = ($dir !== '.' ? $dir . '/' : '') . $filenameNoExt . '.webp';
    $webpExists = $disk->exists($webpPath);
    echo "ID: {$img->id} | Path: {$img->path} | Original Exists: " . ($exists ? 'YES' : 'NO') . " | WebP Exists: " . ($webpExists ? 'YES' : 'NO') . PHP_EOL;
}

echo PHP_EOL . "=== Article Images ===" . PHP_EOL;
foreach (ArticleImage::all() as $img) {
    $exists = $disk->exists($img->path);
    $dir = dirname($img->path);
    $filenameNoExt = pathinfo(basename($img->path), PATHINFO_FILENAME);
    $webpPath = ($dir !== '.' ? $dir . '/' : '') . $filenameNoExt . '.webp';
    $webpExists = $disk->exists($webpPath);
    echo "ID: {$img->id} | Path: {$img->path} | Original Exists: " . ($exists ? 'YES' : 'NO') . " | WebP Exists: " . ($webpExists ? 'YES' : 'NO') . PHP_EOL;
}

echo PHP_EOL . "=== Agent Avatars ===" . PHP_EOL;
foreach (AgentProfile::all() as $p) {
    if ($p->avatar) {
        $exists = $disk->exists($p->avatar);
        $dir = dirname($p->avatar);
        $filenameNoExt = pathinfo(basename($p->avatar), PATHINFO_FILENAME);
        $webpPath = ($dir !== '.' ? $dir . '/' : '') . $filenameNoExt . '.webp';
        $webpExists = $disk->exists($webpPath);
        echo "User ID: {$p->user_id} | Avatar: {$p->avatar} | Original Exists: " . ($exists ? 'YES' : 'NO') . " | WebP Exists: " . ($webpExists ? 'YES' : 'NO') . PHP_EOL;
    }
}

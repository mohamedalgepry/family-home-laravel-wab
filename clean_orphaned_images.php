<?php

/**
 * Family Home - Standalone Orphaned Images Cleaner Script
 *
 * Usage:
 *   php clean_orphaned_images.php            (Deletes orphaned unit images)
 *   php clean_orphaned_images.php --dry-run  (Preview what would be deleted)
 *   php clean_orphaned_images.php --projects (Include project images too)
 */

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\UnitImage;
use Illuminate\Support\Facades\Storage;

$options = getopt('', ['dry-run', 'projects', 'all']);
$isDryRun = isset($options['dry-run']);
$includeProjects = isset($options['projects']) || isset($options['all']);

echo "\n=======================================================\n";
echo "   Family Home - Orphaned Images Cleaner Script\n";
echo "=======================================================\n";
echo $isDryRun ? "MODE: DRY-RUN (Preview only, no files will be deleted)\n\n" : "MODE: CLEAN (Permanently deleting orphaned files)\n\n";

$disk = Storage::disk('public');

// 1. Clean DB orphaned records where parent model no longer exists
$orphanUnitDbCount = UnitImage::whereDoesntHave('unit')->count();
if ($orphanUnitDbCount > 0) {
    echo "[DB] Found {$orphanUnitDbCount} unit_image records in database without a matching unit.\n";
    if (! $isDryRun) {
        UnitImage::whereDoesntHave('unit')->delete();
        echo "[DB] ✓ Cleaned {$orphanUnitDbCount} orphaned records from unit_images table.\n";
    }
}

if ($includeProjects) {
    $orphanProjectDbCount = ProjectImage::whereDoesntHave('project')->count();
    if ($orphanProjectDbCount > 0) {
        echo "[DB] Found {$orphanProjectDbCount} project_image records in database without a matching project.\n";
        if (! $isDryRun) {
            ProjectImage::whereDoesntHave('project')->delete();
            echo "[DB] ✓ Cleaned {$orphanProjectDbCount} orphaned records from project_images table.\n";
        }
    }
}

// 2. Scan Unit images on disk
echo "\nScanning 'units' storage folder...\n";
$unitResult = cleanFolder(
    disk: $disk,
    folder: 'units',
    validPaths: UnitImage::whereHas('unit')->pluck('path')->all(),
    isDryRun: $isDryRun
);

$totalDeleted = $unitResult['deleted_count'];
$totalBytes = $unitResult['bytes_freed'];

// 3. Scan Project images on disk if requested
if ($includeProjects) {
    echo "\nScanning 'projects' storage folder...\n";
    $projectResult = cleanFolder(
        disk: $disk,
        folder: 'projects',
        validPaths: ProjectImage::whereHas('project')->pluck('path')->all(),
        isDryRun: $isDryRun
    );
    $totalDeleted += $projectResult['deleted_count'];
    $totalBytes += $projectResult['bytes_freed'];
}

// 4. Summary
$mbFreed = round($totalBytes / (1024 * 1024), 2);
$kbFreed = round($totalBytes / 1024, 2);
$sizeStr = $mbFreed >= 1 ? "{$mbFreed} MB" : "{$kbFreed} KB";

echo "\n==================== SUMMARY ====================\n";
if ($isDryRun) {
    echo "Total orphaned files found : {$totalDeleted}\n";
    echo "Total reclaimable space    : {$sizeStr}\n";
    echo "To delete these files, run : php clean_orphaned_images.php\n";
} else {
    echo "✓ Total orphaned files deleted : {$totalDeleted}\n";
    echo "✓ Total disk space reclaimed   : {$sizeStr}\n";
}
echo "=================================================\n\n";

function cleanFolder($disk, string $folder, array $validPaths, bool $isDryRun): array
{
    $allFiles = $disk->allFiles($folder);
    $allowedMap = [];
    $validStems = [];

    foreach ($validPaths as $p) {
        $clean = ltrim(str_replace('\\', '/', $p), '/');
        $allowedMap[$clean] = true;

        $dir = dirname($clean);
        $prefix = ($dir !== '.' && $dir !== '') ? $dir.'/' : '';
        $stem = pathinfo($clean, PATHINFO_FILENAME);
        $validStems[$stem] = true;

        $allowedMap[$prefix.'thumb_'.$stem.'.webp'] = true;
        $allowedMap[$prefix.'medium_'.$stem.'.webp'] = true;
        $allowedMap[$prefix.'large_'.$stem.'.webp'] = true;
        $allowedMap[$prefix.'thumb_'.basename($clean)] = true;
    }

    $orphanedFiles = [];
    $bytesFreed = 0;

    foreach ($allFiles as $file) {
        $normalized = ltrim(str_replace('\\', '/', $file), '/');
        $basename = basename($normalized);

        if ($basename === '.gitignore' || str_starts_with($basename, '.')) {
            continue;
        }

        $cleanStem = pathinfo(preg_replace('/^(thumb|medium|large)_/', '', $basename), PATHINFO_FILENAME);

        if (! isset($allowedMap[$normalized]) && ! isset($validStems[$cleanStem])) {
            $fileSize = $disk->size($file) ?: 0;
            $orphanedFiles[] = $file;
            $bytesFreed += $fileSize;

            if ($isDryRun) {
                echo " [ORPHAN] {$file} (" . round($fileSize / 1024, 1) . " KB)\n";
            } else {
                $disk->delete($file);
                echo " 🗑 Deleted: {$file} (" . round($fileSize / 1024, 1) . " KB)\n";
            }
        }
    }

    // Clean empty subdirectories
    if (! $isDryRun) {
        $directories = $disk->allDirectories($folder);
        usort($directories, fn ($a, $b) => strlen($b) <=> strlen($a));
        foreach ($directories as $dir) {
            if (empty($disk->allFiles($dir)) && empty($disk->directories($dir))) {
                $disk->deleteDirectory($dir);
            }
        }
    }

    return [
        'deleted_count' => count($orphanedFiles),
        'bytes_freed' => $bytesFreed,
    ];
}

<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class BackfillThumbnailsCommand extends Command
{
    protected $signature = 'images:backfill-thumbnails';
    protected $description = 'Generate missing 300px thumbnails for all existing unit, project, and article images';

    public function handle(): int
    {
        $this->info('Checking for missing image thumbnails...');
        $disk = Storage::disk('public');
        $generatedCount = 0;

        // 1. Unit Images
        $unitMissing = [];
        UnitImage::chunk(200, function ($images) use ($disk, &$unitMissing) {
            foreach ($images as $img) {
                if ($this->shouldGenerate($disk, $img->path)) {
                    $unitMissing[] = $img->path;
                }
            }
        });

        if (!empty($unitMissing)) {
            $this->info('Generating ' . count($unitMissing) . ' unit thumbnails...');
            foreach (array_chunk($unitMissing, 10) as $chunk) {
                dispatch_sync(new GenerateThumbnailsJob('UnitImage', 0, $chunk));
                $generatedCount += count($chunk);
            }
        }

        // 2. Project Images
        $projectMissing = [];
        ProjectImage::chunk(200, function ($images) use ($disk, &$projectMissing) {
            foreach ($images as $img) {
                if ($this->shouldGenerate($disk, $img->path)) {
                    $projectMissing[] = $img->path;
                }
            }
        });

        if (!empty($projectMissing)) {
            $this->info('Generating ' . count($projectMissing) . ' project thumbnails...');
            foreach (array_chunk($projectMissing, 10) as $chunk) {
                dispatch_sync(new GenerateThumbnailsJob('ProjectImage', 0, $chunk));
                $generatedCount += count($chunk);
            }
        }

        // 3. Article Images
        $articleMissing = [];
        ArticleImage::chunk(200, function ($images) use ($disk, &$articleMissing) {
            foreach ($images as $img) {
                if ($this->shouldGenerate($disk, $img->path)) {
                    $articleMissing[] = $img->path;
                }
            }
        });

        if (!empty($articleMissing)) {
            $this->info('Generating ' . count($articleMissing) . ' article thumbnails...');
            foreach (array_chunk($articleMissing, 10) as $chunk) {
                dispatch_sync(new GenerateThumbnailsJob('ArticleImage', 0, $chunk));
                $generatedCount += count($chunk);
            }
        }

        $this->info("Completed! Backfilled {$generatedCount} missing thumbnails.");
        return Command::SUCCESS;
    }

    private function shouldGenerate($disk, ?string $path): bool
    {
        if (!$path) {
            return false;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return false;
        }

        if (!$disk->exists($path)) {
            return false;
        }

        $dir = dirname($path);
        $filename = basename($path);
        $filenameNoExt = pathinfo($filename, PATHINFO_FILENAME);
        $thumbPath = ($dir !== '.' ? $dir . '/' : '') . 'thumb_' . $filenameNoExt . '.webp';

        return !$disk->exists($thumbPath);
    }
}

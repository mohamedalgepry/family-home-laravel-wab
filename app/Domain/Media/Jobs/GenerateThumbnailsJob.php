<?php

namespace App\Domain\Media\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class GenerateThumbnailsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $modelType,
        public readonly int $modelId,
        public readonly array $paths,
    ) {}

    public function handle(): void
    {
        Log::info('GenerateThumbnailsJob: processing thumbnails for '.$this->modelType.' #'.$this->modelId, [
            'paths_count' => count($this->paths),
        ]);

        $disk = Storage::disk('public');

        try {
            $manager = ImageManager::gd();
        } catch (\Throwable $e) {
            Log::error('GenerateThumbnailsJob GD initialization failed: '.$e->getMessage());

            return;
        }

        foreach ($this->paths as $relativePath) {
            try {
                if (! $disk->exists($relativePath)) {
                    continue;
                }

                $fullPath = $disk->path($relativePath);
                $image = $manager->read($fullPath);

                // Scale image down for thumbnail (max 300px width)
                $image->scale(width: 300);

                $dir = dirname($relativePath);
                $filename = basename($relativePath);
                $thumbRelativePath = ($dir !== '.' ? $dir.'/' : '').'thumb_'.$filename;
                $thumbFullPath = $disk->path($thumbRelativePath);

                $image->save($thumbFullPath);

                Log::info('GenerateThumbnailsJob: generated thumbnail', [
                    'original' => $relativePath,
                    'thumbnail' => $thumbRelativePath,
                ]);
            } catch (\Throwable $e) {
                Log::warning('GenerateThumbnailsJob: failed to process image '.$relativePath, [
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}

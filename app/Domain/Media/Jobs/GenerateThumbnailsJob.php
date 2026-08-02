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
            $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
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
                $dir = dirname($relativePath);
                $filename = basename($relativePath);
                $filenameNoExt = pathinfo($filename, PATHINFO_FILENAME);
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

                $thumbRelativePath = ($dir !== '.' ? $dir.'/' : '').'thumb_'.$filename;
                $thumbFullPath = $disk->path($thumbRelativePath);

                $raw = @file_get_contents($fullPath);
                if ($raw && function_exists('imagecreatefromstring') && function_exists('imagewebp')) {
                    $srcImg = @imagecreatefromstring($raw);
                    if ($srcImg) {
                        $w = imagesx($srcImg);
                        $h = imagesy($srcImg);
                        $thumbW = min(400, $w);
                        $thumbH = (int) round(($h / $w) * $thumbW);

                        $thumbImg = imagecreatetruecolor($thumbW, $thumbH);
                        imagecopyresampled($thumbImg, $srcImg, 0, 0, 0, 0, $thumbW, $thumbH, $w, $h);

                        // Save thumbnail
                        imagewebp($thumbImg, $thumbFullPath, 80);

                        // Convert original image to webp if it's jpg/png
                        if (in_array($ext, ['jpg', 'jpeg', 'png'])) {
                            $webpRelativePath = ($dir !== '.' ? $dir.'/' : '').$filenameNoExt.'.webp';
                            $webpFullPath = $disk->path($webpRelativePath);
                            imagewebp($srcImg, $webpFullPath, 82);
                        }
                    }
                } else {
                    $image = $manager->read($fullPath);
                    $image->scale(width: 400);
                    $image->save($thumbFullPath);
                }

                \Illuminate\Support\Facades\Cache::forget("thumb_exists:{$thumbRelativePath}");

                Log::info('GenerateThumbnailsJob: generated thumbnail & webp optimization', [
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

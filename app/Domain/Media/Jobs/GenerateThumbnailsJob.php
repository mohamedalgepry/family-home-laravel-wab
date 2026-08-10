<?php

namespace App\Domain\Media\Jobs;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class GenerateThumbnailsJob implements ShouldQueue
{
    use Queueable;

    private const MAX_ORIGINAL_WIDTH_PX = 1600;

    private const THUMB_WIDTH_PX = 400;

    private const THUMB_QUALITY = 80;

    private const ORIGINAL_QUALITY = 82;

    private const RASTERIZABLE_EXTS = ['jpg', 'jpeg', 'png'];

    public function __construct(
        public readonly string $modelType,
        public readonly int $modelId,
        public readonly array $paths,
    ) {}

    public function handle(): void
    {
        Log::info('GenerateThumbnailsJob: processing thumbnails', [
            'model' => "{$this->modelType}#{$this->modelId}",
            'paths_count' => count($this->paths),
        ]);

        $disk = Storage::disk('public');
        $manager = $this->resolveImageManager();

        foreach ($this->paths as $relativePath) {
            $this->processSingleImage($disk, $manager, $relativePath);
        }
    }

    private function processSingleImage(Filesystem $disk, ?ImageManager $manager, string $relativePath): void
    {
        try {
            if (! $disk->exists($relativePath)) {
                return;
            }

            $fullPath = $disk->path($relativePath);
            $thumbRelPath = $this->buildThumbRelativePath($relativePath);
            $thumbFullPath = $disk->path($thumbRelPath);

            $this->generateThumbnail($fullPath, $thumbFullPath, $relativePath, $manager);

            Cache::forget("thumb_exists:{$thumbRelPath}");

            Log::info('GenerateThumbnailsJob: thumbnail generated', [
                'original' => $relativePath,
                'thumbnail' => $thumbRelPath,
            ]);
        } catch (\Throwable $e) {
            Log::warning('GenerateThumbnailsJob: failed to process image', [
                'path' => $relativePath,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function generateThumbnail(
        string $fullPath,
        string $thumbFullPath,
        string $relativePath,
        ?ImageManager $manager,
    ): void {
        if ($this->canUseNativeGd()) {
            $this->generateThumbnailWithNativeGd($fullPath, $thumbFullPath, $relativePath);
        } elseif ($manager) {
            $this->generateThumbnailWithIntervention($manager, $fullPath, $thumbFullPath);
        }
    }

    private function generateThumbnailWithNativeGd(
        string $fullPath,
        string $thumbFullPath,
        string $relativePath,
    ): void {
        $rawBytes = @file_get_contents($fullPath);
        if (! $rawBytes) {
            return;
        }

        $sourceImage = @imagecreatefromstring($rawBytes);
        if (! $sourceImage) {
            return;
        }

        $thumbImage = $this->scaleDownWithGd($sourceImage);
        imagewebp($thumbImage, $thumbFullPath, self::THUMB_QUALITY);
        imagedestroy($thumbImage);

        $this->convertOriginalToWebpIfRasterizable($sourceImage, $fullPath, $relativePath);
        imagedestroy($sourceImage);
    }

    private function scaleDownWithGd(\GdImage $source): \GdImage
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $thumbWidth = min(self::THUMB_WIDTH_PX, $sourceWidth);
        $thumbHeight = (int) round(($sourceHeight / $sourceWidth) * $thumbWidth);

        $thumb = imagecreatetruecolor($thumbWidth, $thumbHeight);
        imagecopyresampled($thumb, $source, 0, 0, 0, 0, $thumbWidth, $thumbHeight, $sourceWidth, $sourceHeight);

        return $thumb;
    }

    private function convertOriginalToWebpIfRasterizable(\GdImage $source, string $fullPath, string $relativePath): void
    {
        $extension = strtolower(pathinfo($relativePath, PATHINFO_EXTENSION));

        if (! in_array($extension, self::RASTERIZABLE_EXTS, true)) {
            return;
        }

        $dir = dirname($fullPath);
        $nameWithoutExt = pathinfo($fullPath, PATHINFO_FILENAME);
        $webpFullPath = $dir.DIRECTORY_SEPARATOR.$nameWithoutExt.'.webp';

        $scaled = $this->scaleDownToMaxWidth($source, self::MAX_ORIGINAL_WIDTH_PX);
        imagewebp($scaled, $webpFullPath, self::ORIGINAL_QUALITY);

        if ($scaled !== $source) {
            imagedestroy($scaled);
        }

        if (file_exists($webpFullPath)) {
            @unlink($fullPath);
        }
    }

    private function scaleDownToMaxWidth(\GdImage $source, int $maxWidth): \GdImage
    {
        $sourceWidth = imagesx($source);
        if ($sourceWidth <= $maxWidth) {
            return $source;
        }

        $sourceHeight = imagesy($source);
        $targetHeight = (int) round(($sourceHeight / $sourceWidth) * $maxWidth);

        $scaled = imagecreatetruecolor($maxWidth, $targetHeight);
        imagecopyresampled($scaled, $source, 0, 0, 0, 0, $maxWidth, $targetHeight, $sourceWidth, $sourceHeight);

        return $scaled;
    }

    private function generateThumbnailWithIntervention(ImageManager $manager, string $fullPath, string $thumbFullPath): void
    {
        $image = $manager->decodePath($fullPath);
        $image->scaleDown(width: self::THUMB_WIDTH_PX);
        $encoded = $image->encode(new WebpEncoder(quality: self::THUMB_QUALITY));

        file_put_contents($thumbFullPath, (string) $encoded);
    }

    private function buildThumbRelativePath(string $relativePath): string
    {
        $dir = dirname($relativePath);
        $nameWithoutExt = pathinfo($relativePath, PATHINFO_FILENAME);
        $prefix = $dir !== '.' ? $dir.'/' : '';

        return $prefix.'thumb_'.$nameWithoutExt.'.webp';
    }

    private function canUseNativeGd(): bool
    {
        return function_exists('imagecreatefromstring') && function_exists('imagewebp');
    }

    private function resolveImageManager(): ?ImageManager
    {
        if (extension_loaded('gd')) {
            return $this->tryBuildManager(new Driver);
        }

        if (extension_loaded('imagick')) {
            return $this->tryBuildManager(new \Intervention\Image\Drivers\Imagick\Driver);
        }

        Log::warning('GenerateThumbnailsJob: No image extension available (GD/Imagick)');

        return null;
    }

    private function tryBuildManager(mixed $driver): ?ImageManager
    {
        try {
            return new ImageManager($driver);
        } catch (\Throwable $e) {
            Log::warning('GenerateThumbnailsJob: Driver initialization failed', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}

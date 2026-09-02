<?php

namespace App\Domain\Media\Jobs;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class GenerateThumbnailsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 90;
    public array $backoff = [10, 30, 60];

    /** Sizes for cards, content pages, and LCP images. */
    private const VARIANTS = [
        'thumb' => ['width' => 480, 'quality' => 78],
        'medium' => ['width' => 960, 'quality' => 80],
        'large' => ['width' => 1440, 'quality' => 82],
    ];

    public function __construct(
        public readonly string $modelType,
        public readonly int $modelId,
        public readonly array $paths,
    ) {}

    public function handle(): void
    {
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

            if ($this->canUseNativeGd()) {
                $this->generateWithNativeGd($fullPath, $relativePath);
            } elseif ($manager) {
                $this->generateWithIntervention($manager, $fullPath, $relativePath);
            } else {
                throw new \RuntimeException('No supported image extension is available.');
            }

            foreach (array_keys(self::VARIANTS) as $variant) {
                Cache::forget("image_variant_exists:{$variant}:{$relativePath}");
            }
        } catch (\Throwable $e) {
            Log::warning('Image variant generation failed', [
                'path' => $relativePath,
                'model' => "{$this->modelType}#{$this->modelId}",
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function generateWithNativeGd(string $fullPath, string $relativePath): void
    {
        $rawBytes = @file_get_contents($fullPath);
        $source = $rawBytes ? @imagecreatefromstring($rawBytes) : false;

        if (! $source) {
            throw new \RuntimeException('The uploaded file could not be decoded as an image.');
        }

        try {
            foreach (self::VARIANTS as $variant => $options) {
                $scaled = $this->scaleDownWithGd($source, $options['width']);
                imagewebp($scaled, $this->absoluteVariantPath($fullPath, $relativePath, $variant), $options['quality']);
                if ($scaled !== $source) {
                    imagedestroy($scaled);
                }
            }
        } finally {
            imagedestroy($source);
        }
    }

    private function generateWithIntervention(ImageManager $manager, string $fullPath, string $relativePath): void
    {
        $source = $manager->decodePath($fullPath);

        foreach (self::VARIANTS as $variant => $options) {
            $image = clone $source;
            $image->scaleDown(width: $options['width']);
            file_put_contents(
                $this->absoluteVariantPath($fullPath, $relativePath, $variant),
                (string) $image->encode(new WebpEncoder(quality: $options['quality']))
            );
        }
    }

    private function scaleDownWithGd(\GdImage $source, int $maxWidth): \GdImage
    {
        $sourceWidth = imagesx($source);
        if ($sourceWidth <= $maxWidth) {
            return $source;
        }

        $sourceHeight = imagesy($source);
        $targetHeight = (int) round(($sourceHeight / $sourceWidth) * $maxWidth);
        $scaled = imagecreatetruecolor($maxWidth, $targetHeight);
        imagealphablending($scaled, false);
        imagesavealpha($scaled, true);
        imagecopyresampled($scaled, $source, 0, 0, 0, 0, $maxWidth, $targetHeight, $sourceWidth, $sourceHeight);

        return $scaled;
    }

    private function absoluteVariantPath(string $fullPath, string $relativePath, string $variant): string
    {
        return dirname($fullPath).DIRECTORY_SEPARATOR.basename($this->variantRelativePath($relativePath, $variant));
    }

    private function variantRelativePath(string $relativePath, string $variant): string
    {
        $dir = dirname($relativePath);
        $filename = pathinfo($relativePath, PATHINFO_FILENAME);
        $prefix = $dir !== '.' ? $dir.'/' : '';

        return $prefix."{$variant}_{$filename}.webp";
    }

    private function canUseNativeGd(): bool
    {
        return function_exists('imagecreatefromstring') && function_exists('imagewebp');
    }

    private function resolveImageManager(): ?ImageManager
    {
        try {
            if (extension_loaded('gd')) {
                return new ImageManager(new Driver);
            }

            if (extension_loaded('imagick')) {
                return new ImageManager(new \Intervention\Image\Drivers\Imagick\Driver);
            }
        } catch (\Throwable $e) {
            Log::warning('Image manager initialization failed', ['error' => $e->getMessage()]);
        }

        return null;
    }
}

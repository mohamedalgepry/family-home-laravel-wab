<?php

namespace App\Domain\Media\Services;

use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class ImageOptimizerService
{
    private const MAX_WIDTH_PX = 1600;

    private ?ImageManager $manager = null;

    private bool $initialized = false;

    public function convertToWebp(string $sourcePath, string $outputPath, int $quality = 80): bool
    {
        try {
            if (! file_exists($sourcePath)) {
                return false;
            }

            $manager = $this->resolveManager();
            if (! $manager) {
                return false;
            }

            $image = $manager->decodePath($sourcePath);
            $image->scaleDown(width: self::MAX_WIDTH_PX);
            $encoded = $image->encode(new WebpEncoder(quality: $quality));

            $this->ensureDirectoryExists(dirname($outputPath));

            file_put_contents($outputPath, (string) $encoded);

            return true;
        } catch (\Throwable $e) {
            Log::warning('Image WebP conversion failed', [
                'error' => $e->getMessage(),
                'file' => $sourcePath,
            ]);

            return false;
        }
    }

    private function resolveManager(): ?ImageManager
    {
        if ($this->initialized) {
            return $this->manager;
        }

        $this->initialized = true;
        $this->manager = $this->buildManager();

        return $this->manager;
    }

    private function buildManager(): ?ImageManager
    {
        if (extension_loaded('gd')) {
            return $this->tryBuildDriver(new Driver);
        }

        if (extension_loaded('imagick')) {
            return $this->tryBuildDriver(new \Intervention\Image\Drivers\Imagick\Driver);
        }

        Log::warning('ImageOptimizerService: No image extension enabled (GD or Imagick)');

        return null;
    }

    private function tryBuildDriver(mixed $driver): ?ImageManager
    {
        try {
            return new ImageManager($driver);
        } catch (\Throwable $e) {
            Log::warning('ImageOptimizerService: Driver initialization failed', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    private function ensureDirectoryExists(string $directory): void
    {
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }
}

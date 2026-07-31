<?php

namespace App\Domain\Media\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageOptimizerService
{
    private ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    public function convertToWebp(string $sourcePath, string $outputPath, int $quality = 80): bool
    {
        try {
            if (!file_exists($sourcePath)) {
                return false;
            }

            $image = $this->manager->read($sourcePath);
            $encoded = $image->toWebp($quality);

            $dir = dirname($outputPath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }

            file_put_contents($outputPath, (string) $encoded);
            return true;
        } catch (\Throwable $e) {
            \Log::warning('Image WebP conversion failed', ['error' => $e->getMessage(), 'file' => $sourcePath]);
            return false;
        }
    }
}

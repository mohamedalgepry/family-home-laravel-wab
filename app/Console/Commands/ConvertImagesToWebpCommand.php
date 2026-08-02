<?php

namespace App\Console\Commands;

use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\ProjectImage;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Users\Models\AgentProfile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ConvertImagesToWebpCommand extends Command
{
    protected $signature = 'images:convert-all-webp';
    protected $description = 'Convert all existing PNG/JPG images (units, projects, articles, avatars) to WebP and update database paths';

    public function handle(): int
    {
        $this->info('Starting conversion of all PNG/JPG images to compressed WebP...');
        $disk = Storage::disk('public');
        $convertedCount = 0;

        // 1. Convert Unit Images
        UnitImage::chunk(100, function ($images) use ($disk, &$convertedCount) {
            foreach ($images as $img) {
                if ($this->convertModelImage($disk, $img, 'path')) {
                    $convertedCount++;
                }
            }
        });

        // 2. Convert Project Images
        ProjectImage::chunk(100, function ($images) use ($disk, &$convertedCount) {
            foreach ($images as $img) {
                if ($this->convertModelImage($disk, $img, 'path')) {
                    $convertedCount++;
                }
            }
        });

        // 3. Convert Article Images
        ArticleImage::chunk(100, function ($images) use ($disk, &$convertedCount) {
            foreach ($images as $img) {
                if ($this->convertModelImage($disk, $img, 'path')) {
                    $convertedCount++;
                }
            }
        });

        // 4. Convert Agent Avatars
        AgentProfile::chunk(100, function ($profiles) use ($disk, &$convertedCount) {
            foreach ($profiles as $profile) {
                if ($profile->avatar && $this->convertModelImage($disk, $profile, 'avatar')) {
                    $convertedCount++;
                }
            }
        });

        // Clear listing caches
        Cache::flush();

        $this->info("Success! Converted {$convertedCount} images to compressed WebP and updated database paths.");
        return Command::SUCCESS;
    }

    private function convertModelImage($disk, $model, string $attribute): bool
    {
        $path = $model->$attribute;
        if (! $path) {
            return false;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return false;
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (! in_array($ext, ['png', 'jpg', 'jpeg'])) {
            return false;
        }

        if (! $disk->exists($path)) {
            return false;
        }

        $fullPath = $disk->path($path);
        $dir = dirname($path);
        $filenameNoExt = pathinfo(basename($path), PATHINFO_FILENAME);

        $webpRelativePath = ($dir !== '.' ? $dir.'/' : '').$filenameNoExt.'.webp';
        $webpFullPath = $disk->path($webpRelativePath);

        $thumbRelativePath = ($dir !== '.' ? $dir.'/' : '').'thumb_'.$filenameNoExt.'.webp';
        $thumbFullPath = $disk->path($thumbRelativePath);

        try {
            $raw = @file_get_contents($fullPath);
            if (! $raw || ! function_exists('imagecreatefromstring') || ! function_exists('imagewebp')) {
                return false;
            }

            $srcImg = @imagecreatefromstring($raw);
            if (! $srcImg) {
                return false;
            }

            $w = imagesx($srcImg);
            $h = imagesy($srcImg);

            // Resize max width to 1400 if image is huge
            if ($w > 1400) {
                $targetW = 1400;
                $targetH = (int) round(($h / $w) * $targetW);
                $resizedImg = imagecreatetruecolor($targetW, $targetH);
                imagecopyresampled($resizedImg, $srcImg, 0, 0, 0, 0, $targetW, $targetH, $w, $h);
                imagewebp($resizedImg, $webpFullPath, 82);
            } else {
                imagewebp($srcImg, $webpFullPath, 82);
            }

            // Generate thumbnail (400px width)
            $thumbW = min(400, $w);
            $thumbH = (int) round(($h / $w) * $thumbW);
            $thumbImg = imagecreatetruecolor($thumbW, $thumbH);
            imagecopyresampled($thumbImg, $srcImg, 0, 0, 0, 0, $thumbW, $thumbH, $w, $h);
            imagewebp($thumbImg, $thumbFullPath, 80);

            // Update database model path
            $model->$attribute = $webpRelativePath;
            $model->save();

            // Delete old png/jpg file if webp exists
            if ($disk->exists($webpRelativePath) && $webpRelativePath !== $path) {
                $disk->delete($path);
            }

            Log::info("ConvertImagesToWebpCommand: converted {$path} -> {$webpRelativePath}");
            return true;
        } catch (\Throwable $e) {
            Log::warning("ConvertImagesToWebpCommand failed for {$path}: ".$e->getMessage());
            return false;
        }
    }
}

<?php

namespace App\Console\Commands;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeSettingImagesCommand extends Command
{
    protected $signature = 'settings:optimize-images';

    protected $description = 'Optimize hero and logo images in DB settings to WebP format and create mobile versions.';

    public function handle(SettingsService $settingsService): int
    {
        $this->info('Starting DB setting images optimization...');
        $disk = Storage::disk('public');

        // 1. Optimize hero_image
        $heroPath = $settingsService->get('hero_image');
        if ($heroPath && $disk->exists($heroPath)) {
            $this->info("Optimizing hero_image: {$heroPath}");
            $raw = $disk->get($heroPath);
            $srcImg = @imagecreatefromstring($raw);
            if ($srcImg) {
                $w = imagesx($srcImg);
                $h = imagesy($srcImg);

                // Desktop WebP (max 1400px)
                $targetW = min($w, 1400);
                $targetH = (int) round(($h / $w) * $targetW);
                $dstDesktop = imagecreatetruecolor($targetW, $targetH);
                imagecopyresampled($dstDesktop, $srcImg, 0, 0, 0, 0, $targetW, $targetH, $w, $h);

                $desktopWebpPath = 'settings/hero_' . uniqid() . '.webp';
                $fullDesktopPath = $disk->path($desktopWebpPath);
                imagewebp($dstDesktop, $fullDesktopPath, 82);
                imagedestroy($dstDesktop);

                // Mobile WebP (max 640px)
                $targetMobileW = min($w, 640);
                $targetMobileH = (int) round(($h / $w) * $targetMobileW);
                $dstMobile = imagecreatetruecolor($targetMobileW, $targetMobileH);
                imagecopyresampled($dstMobile, $srcImg, 0, 0, 0, 0, $targetMobileW, $targetMobileH, $w, $h);

                $mobileWebpPath = 'settings/hero_mobile_' . uniqid() . '.webp';
                $fullMobilePath = $disk->path($mobileWebpPath);
                imagewebp($dstMobile, $fullMobilePath, 80);
                imagedestroy($dstMobile);
                imagedestroy($srcImg);

                $settingsService->set('hero_image', $desktopWebpPath);
                $settingsService->set('hero_image_mobile', $mobileWebpPath);
                $this->info(" -> Created Desktop WebP: {$desktopWebpPath} (" . round(filesize($fullDesktopPath) / 1024, 2) . " KB)");
                $this->info(" -> Created Mobile WebP: {$mobileWebpPath} (" . round(filesize($fullMobilePath) / 1024, 2) . " KB)");

                if ($heroPath !== $desktopWebpPath && $disk->exists($heroPath)) {
                    $disk->delete($heroPath);
                }
            }
        }

        // 2. Optimize site_logo
        $logoPath = $settingsService->get('site_logo');
        if ($logoPath && !str_ends_with(strtolower($logoPath), '.webp') && $disk->exists($logoPath)) {
            $this->info("Optimizing site_logo: {$logoPath}");
            $raw = $disk->get($logoPath);
            $srcImg = @imagecreatefromstring($raw);
            if ($srcImg) {
                $w = imagesx($srcImg);
                $h = imagesy($srcImg);
                $targetW = min($w, 600);
                $targetH = (int) round(($h / $w) * $targetW);
                $dstImg = imagecreatetruecolor($targetW, $targetH);
                imagealphablending($dstImg, false);
                imagesavealpha($dstImg, true);
                imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $targetW, $targetH, $w, $h);

                $logoWebpPath = 'settings/logo_' . uniqid() . '.webp';
                $fullLogoPath = $disk->path($logoWebpPath);
                imagewebp($dstImg, $fullLogoPath, 85);
                imagedestroy($dstImg);
                imagedestroy($srcImg);

                $settingsService->set('site_logo', $logoWebpPath);
                $this->info(" -> Created Logo WebP: {$logoWebpPath}");

                if ($logoPath !== $logoWebpPath && $disk->exists($logoPath)) {
                    $disk->delete($logoPath);
                }
            }
        }

        $settingsService->clearCache();
        $this->info('Settings images optimization complete and cache cleared.');

        return self::SUCCESS;
    }
}

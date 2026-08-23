<?php

namespace App\Services;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Support\Facades\Log;

class PrerenderService
{
    public function __construct(
        private readonly SettingsService $settingsService,
    ) {}

    /**
     * Performs a surgical patch on the pre-rendered static Home HTML files (ar & en)
     * updating ONLY the LCP hero preloads and img tags without destroying the pre-rendered body content.
     */
    public function patchHomeHtml(): void
    {
        try {
            $heroImage = $this->settingsService->get('hero_image');
            $heroMobile = $this->settingsService->get('hero_image_mobile');

            if (! $heroImage) {
                return;
            }

            $cleanDesktop = str_starts_with($heroImage, '/storage') || str_starts_with($heroImage, '/images')
                ? $heroImage
                : '/storage/'.ltrim($heroImage, '/');
            $cleanDesktop = preg_replace('#^https?://(?:localhost|127\.0\.0\.1)(?::\d+)?#i', '', $cleanDesktop);

            $cleanMobile = $heroMobile
                ? (str_starts_with($heroMobile, '/storage') || str_starts_with($heroMobile, '/images') ? $heroMobile : '/storage/'.ltrim($heroMobile, '/'))
                : $cleanDesktop;
            $cleanMobile = preg_replace('#^https?://(?:localhost|127\.0\.0\.1)(?::\d+)?#i', '', $cleanMobile);

            $desktopRelative = $cleanDesktop;
            $mobileRelative = $cleanMobile;
            $desktopUrl = $cleanDesktop;
            $mobileUrl = $cleanMobile;

            $locales = ['ar', 'en'];
            foreach ($locales as $locale) {
                $filePath = storage_path("app/prerendered/{$locale}/index.html");
                if (! file_exists($filePath)) {
                    continue;
                }

                $html = file_get_contents($filePath);
                if (empty($html)) {
                    continue;
                }

                // 1. Surgical patch for max-width: 640px hero mobile link preload (flexible attribute order)
                $html = preg_replace_callback(
                    '/<link\b([^>]*media=["\']\(max-width:\s*640px\)["\'][^>]*)>/i',
                    function ($m) use ($mobileUrl) {
                        $tag = $m[1];

                        return '<link'.preg_replace('/href=["\'][^"\']*["\']/i', 'href="'.$mobileUrl.'"', $tag).'>';
                    },
                    $html
                );

                // 2. Surgical patch for min-width: 641px hero desktop link preload (flexible attribute order)
                $html = preg_replace_callback(
                    '/<link\b([^>]*media=["\']\(min-width:\s*641px\)["\'][^>]*)>/i',
                    function ($m) use ($desktopUrl) {
                        $tag = $m[1];

                        return '<link'.preg_replace('/href=["\'][^"\']*["\']/i', 'href="'.$desktopUrl.'"', $tag).'>';
                    },
                    $html
                );

                // 3. Surgical patch for imageSrcSet link preload
                $html = preg_replace(
                    '/(<link[^>]*imageSrcSet=["\'])[^"\']*(["\'][^>]*>)/i',
                    '${1}'."{$mobileRelative} 640w, {$desktopRelative} 1400w".'${2}',
                    $html
                );

                // 4. Surgical patch for hero img tag inside <body>
                $html = preg_replace(
                    '/(<img[^>]*fetchPriority=["\']high["\'][^>]*src=["\'])[^"\']*(["\'][^>]*srcSet=["\'])[^"\']*(["\'][^>]*>)/i',
                    '${1}'.$desktopRelative.'${2}'."{$mobileRelative} 640w, {$desktopRelative} 1400w".'${3}',
                    $html
                );

                file_put_contents($filePath, $html);
                Log::info("PrerenderService: Surgically patched hero preloads in storage/app/prerendered/{$locale}/index.html");
            }
        } catch (\Throwable $e) {
            Log::error('PrerenderService patchHomeHtml failed: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}

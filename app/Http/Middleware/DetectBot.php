<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DetectBot
{
    private const BOT_SIGNATURES = [
        'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
        'yandexbot', 'sogou', 'exabot', 'facebot', 'facebookexternalhit',
        'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'pinterest',
        'applebot', 'semrushbot', 'ahrefsbot', 'mj12bot',
        'chrome-lighthouse', 'lighthouse', 'pagespeed', 'gtmetrix',
    ];

    private static ?array $manifestAssets = null;

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET')) {
            return $next($request);
        }

        $userAgent = strtolower($request->userAgent() ?? '');

        if (! $this->isBot($userAgent)) {
            return $next($request);
        }

        $path = trim($request->getPathInfo(), '/');
        $filePath = $this->resolvePrerenderPath($path);

        if (! $filePath || ! file_exists($filePath)) {
            Log::warning('Prerender rejected', [
                'path' => $request->path(),
                'reason' => 'missing_prerender',
                'file' => $filePath,
            ]);

            return $next($request);
        }

        $content = file_get_contents($filePath);
        if ($content === false || strlen(trim($content)) < 100) {
            Log::warning('Prerender rejected', [
                'path' => $request->path(),
                'reason' => 'invalid_prerender',
                'file' => $filePath,
            ]);

            return $next($request);
        }

        // Check for localhost or 127.0.0.1 or dev port
        if (str_contains($content, '127.0.0.1') || str_contains($content, 'localhost') || str_contains($content, ':8000')) {
            Log::warning('Prerender rejected', [
                'path' => $request->path(),
                'reason' => 'localhost_asset',
                'file' => $filePath,
            ]);

            return $next($request);
        }

        // Validate assets against active manifest.json
        $manifestValidation = $this->validatePrerenderAssets($content);
        if ($manifestValidation !== true) {
            Log::warning('Prerender rejected', [
                'path' => $request->path(),
                'reason' => $manifestValidation, // 'stale_manifest' or 'missing_asset'
                'file' => $filePath,
            ]);

            return $next($request);
        }

        return response($content, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'X-Prerendered-By' => 'FamilyHome-StaticPrerender',
            'Cache-Control' => 'public, max-age=3600, stale-while-revalidate=86400',
        ]);
    }

    private function validatePrerenderAssets(string $html): string|bool
    {
        $manifest = $this->getManifestAssets();
        if (empty($manifest)) {
            return 'stale_manifest';
        }

        // Extract referenced assets from HTML
        preg_match_all('/\/assets\/([a-zA-Z0-9_\-\.]+\.(?:js|css|woff2))/i', $html, $assetMatches);
        $allAssets = array_unique($assetMatches[1] ?? []);

        foreach ($allAssets as $filename) {
            if (! isset($manifest[$filename])) {
                return 'stale_manifest';
            }
            if (! file_exists(public_path('build/assets/'.$filename))) {
                return 'missing_asset';
            }
        }

        return true;
    }

    private function getManifestAssets(): array
    {
        if (self::$manifestAssets !== null) {
            return self::$manifestAssets;
        }

        $manifestPath = public_path('build/manifest.json');
        if (! file_exists($manifestPath)) {
            return [];
        }

        $raw = file_get_contents($manifestPath);
        $data = json_decode($raw, true);
        if (! is_array($data)) {
            return [];
        }

        $assets = [];
        foreach ($data as $entry) {
            if (isset($entry['file'])) {
                $filename = basename($entry['file']);
                $assets[$filename] = true;
            }
            if (isset($entry['assets']) && is_array($entry['assets'])) {
                foreach ($entry['assets'] as $subAsset) {
                    $filename = basename($subAsset);
                    $assets[$filename] = true;
                }
            }
        }

        self::$manifestAssets = $assets;

        return self::$manifestAssets;
    }

    private function isBot(string $userAgent): bool
    {
        foreach (self::BOT_SIGNATURES as $signature) {
            if (str_contains($userAgent, $signature)) {
                return true;
            }
        }

        return false;
    }

    private function resolvePrerenderPath(string $path): ?string
    {
        $baseDir = storage_path('app/prerendered');

        if (empty($path) || $path === 'ar' || $path === 'en') {
            $locale = empty($path) ? 'ar' : $path;

            return "{$baseDir}/{$locale}/index.html";
        }

        $target = "{$baseDir}/{$path}";

        if (file_exists("{$target}.html")) {
            return "{$target}.html";
        }

        if (file_exists("{$target}/index.html")) {
            return "{$target}/index.html";
        }

        return null;
    }
}

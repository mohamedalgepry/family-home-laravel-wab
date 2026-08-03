<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
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

        if ($filePath && file_exists($filePath)) {
            return response(file_get_contents($filePath), 200, [
                'Content-Type' => 'text/html; charset=UTF-8',
                'X-Prerendered-By' => 'FamilyHome-StaticPrerender',
                'Cache-Control' => 'public, max-age=3600, stale-while-revalidate=86400',
            ]);
        }

        return $next($request);
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

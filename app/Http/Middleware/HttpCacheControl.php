<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HttpCacheControl
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Separate cache entries for full-page HTML vs Inertia JSON (same URL, different Accept/X-Inertia)
        $response->headers->set('Vary', 'X-Inertia, Accept');

        // Never cache Inertia partial navigations — mobile browsers often ignore Vary
        // and would serve cached HTML to X-Inertia requests, causing a blank white screen.
        if ($request->header('X-Inertia')) {
            $response->headers->set('Cache-Control', 'no-cache, private');

            return $response;
        }

        if (! $request->isMethod('GET') || $request->user()) {
            $response->headers->set('Cache-Control', 'no-cache, private');

            return $response;
        }

        $path = trim($request->getPathInfo(), '/');

        // Strip locale prefix if present (e.g. "ar/contact" -> "contact")
        $normalizedPath = preg_replace('/^(ar|en)(\/|$)/', '', $path);
        $normalizedPath = trim($normalizedPath, '/');

        if ($this->shouldBypassCache($path, $normalizedPath)) {
            $response->headers->set('Cache-Control', 'no-cache, private');

            return $response;
        }

        // Disable CDN full-page HTML caching because it conflicts with Inertia.js (Hostinger CDN strips Vary: X-Inertia)
        // $response->headers->set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
        $response->headers->set('Cache-Control', 'no-cache, private');

        return $response;
    }

    private function shouldBypassCache(string $rawPath, string $path): bool
    {
        // 1. Admin, API, or Auth routes
        if (str_starts_with($rawPath, 'admin') || str_starts_with($rawPath, 'api')) {
            return true;
        }

        if (in_array($path, ['login', 'forgot-password', 'reset-password', 'profile'])) {
            return true;
        }

        // 2. Contact page (contains contact form with CSRF token)
        if ($path === 'contact') {
            return true;
        }

        // 3. Single Unit detail page (e.g. "units/villa-in-tagamoa") -> contains unit inquiry form with CSRF token
        // Note: "units" and "units/deals" are listings (safe to cache), but "units/{slug}" has a form.
        if (str_starts_with($path, 'units/')) {
            $subPath = substr($path, 6);
            if ($subPath !== 'deals') {
                return true;
            }
        }

        // 4. Single Project detail page (e.g. "projects/compound-x")
        if (str_starts_with($path, 'projects/')) {
            return true;
        }

        // 5. Single Article detail page (e.g. "articles/real-estate-tips")
        if (str_starts_with($path, 'articles/')) {
            return true;
        }

        return false;
    }
}

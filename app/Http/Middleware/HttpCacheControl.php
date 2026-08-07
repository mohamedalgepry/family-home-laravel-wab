<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HttpCacheControl
{
    /**
     * Cache-control directives applied to every response that must never be cached:
     *
     *  no-store          — forbids disk/memory caching; prevents mobile BFCache from
     *                      persisting Inertia JSON responses and serving them as raw
     *                      text documents when a tab is restored from the background.
     *  no-cache          — forces revalidation with the server even if a copy exists.
     *  must-revalidate   — stale copies must not be served after max-age expires.
     *  max-age=0         — marks the response immediately stale.
     *  private           — disallows shared (CDN/proxy) caches from storing this response.
     */
    private const NO_CACHE = 'no-store, no-cache, must-revalidate, max-age=0, private';

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Separate cache entries for full-page HTML vs Inertia JSON (same URL, different Accept/X-Inertia)
        $response->headers->set('Vary', 'X-Inertia, Accept');

        // Never cache Inertia partial navigations — using no-store prevents mobile browsers (Chrome/Safari)
        // from saving AJAX JSON responses into BFCache/disk cache, which caused raw JSON to be rendered
        // as a text document when returning to an idle tab on mobile phones.
        if ($request->header('X-Inertia')) {
            return $this->noCache($response);
        }

        if (! $request->isMethod('GET') || $request->user()) {
            return $this->noCache($response);
        }

        $path = trim($request->getPathInfo(), '/');

        // Strip locale prefix if present (e.g. "ar/contact" -> "contact")
        $normalizedPath = preg_replace('/^(ar|en)(\/|$)/', '', $path);
        $normalizedPath = trim($normalizedPath, '/');

        if ($this->shouldBypassCache($path, $normalizedPath)) {
            return $this->noCache($response);
        }

        // Enable CDN full-page HTML caching for TTFB improvements
        $response->headers->set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');

        return $response;
    }

    private function noCache(Response $response): Response
    {
        $response->headers->set('Cache-Control', self::NO_CACHE);

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

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

        if ($request->isSecure() || app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        $csp = "default-src 'self'; "
            ."script-src 'self' 'unsafe-inline' https://*.google-analytics.com https://*.googletagmanager.com https://*.googleapis.com https://maps.googleapis.com; "
            ."style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            ."img-src 'self' data: blob: https: https://*.googleapis.com https://maps.gstatic.com; "
            ."font-src 'self' data: https://fonts.gstatic.com; "
            ."connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.googleapis.com https://maps.googleapis.com; "
            ."frame-src https://maps.google.com https://www.google.com https://www.youtube.com; "
            ."form-action 'self'; "
            ."frame-ancestors 'self';";

        if (app()->environment('local')) {
            $csp = "default-src 'self' data: blob: http: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:; style-src 'self' 'unsafe-inline' http: https:; img-src 'self' data: blob: http: https:; font-src 'self' data: http: https:; connect-src 'self' http: https: ws: wss:; form-action 'self';";
        }

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}

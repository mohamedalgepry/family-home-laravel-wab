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

        if ($request->isMethod('GET') && ! $request->user()) {
            $response->headers->set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=60');
        } else {
            $response->headers->set('Cache-Control', 'no-cache, private');
        }

        return $response;
    }
}

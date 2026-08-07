<?php

use App\Http\Middleware\HttpCacheControl;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

it('sets no-cache for inertia partial navigation requests', function () {
    $middleware = new HttpCacheControl;

    $request = Request::create('/ar', 'GET');
    $request->headers->set('X-Inertia', 'true');

    $response = $middleware->handle($request, fn () => new Response('{"component":"Public/Home"}', 200, [
        'Content-Type' => 'application/json',
        'X-Inertia' => 'true',
    ]));

    expect($response->headers->get('Cache-Control'))->toContain('no-store');
    expect($response->headers->get('Vary'))->toBe('X-Inertia, Accept');
});

it('allows public cache for regular html home page requests', function () {
    $middleware = new HttpCacheControl;

    $request = Request::create('/ar', 'GET');

    $response = $middleware->handle($request, fn () => new Response('<html></html>', 200, [
        'Content-Type' => 'text/html',
    ]));

    expect($response->headers->get('Cache-Control'))->toContain('public');
});

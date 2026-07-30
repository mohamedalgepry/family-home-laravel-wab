<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeadersMiddleware;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // لازم تتظبط حسب توثيق Hostinger الفعلي لو فيه proxy معروف قدامهم
        $middleware->trustProxies(at: env('TRUSTED_PROXIES', '127.0.0.1'));
        $middleware->redirectUsersTo('/admin');
        $middleware->web(append: [
            SetLocale::class,
            HandleInertiaRequests::class,
            SecurityHeadersMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('admin/*') || $request->is('*/admin/*')) {
                return redirect()->route('admin.dashboard')->with('error', __('messages.not_authorized'));
            }

            return redirect()->route('home')->with('error', __('messages.not_authorized'));
        });
    })->create();

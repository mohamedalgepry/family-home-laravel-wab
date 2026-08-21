<?php

use App\Http\Middleware\DetectBot;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\HttpCacheControl;
use App\Http\Middleware\SecurityHeadersMiddleware;
use App\Http\Middleware\SetLocale;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'csp-report',
        ]);
        $middleware->web(append: [
            HttpCacheControl::class,
            DetectBot::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            SecurityHeadersMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($e instanceof AuthorizationException) {
                if ($request->is('admin') || $request->is('admin/*') || $request->is('*/admin') || $request->is('*/admin/*')) {
                    return redirect()->route('admin.dashboard')->with('error', __('messages.not_authorized'));
                }

                return redirect()->route('home')->with('error', __('messages.not_authorized'));
            }

            // في بيئة الإنتاج: إذا أرجع طلب Inertia خطأ سيرفر 500 غير متوقع، نعيد التوجيه للرئيسية مع رسالة وتفادي الشاشة البيضاء
            if (! app()->environment('local') && $request->header('X-Inertia')) {
                if ($e instanceof ValidationException || $e instanceof AuthenticationException) {
                    return null;
                }

                Log::error('Inertia Exception Handled: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
                $locale = session('locale', 'ar');

                return redirect("/{$locale}")->with('error', 'حدث خطأ مؤقت، يرجى المحاولة مرة أخرى.');
            }
        });
    })->create();

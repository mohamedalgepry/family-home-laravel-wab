<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($locale = $request->route('locale')) {
            if (in_array($locale, ['ar', 'en'])) {
                App::setLocale($locale);
                session(['locale' => $locale]);
                URL::defaults(['locale' => $locale]);
                $request->route()->forgetParameter('locale');
            }
        } elseif (session()->has('locale')) {
            App::setLocale(session('locale'));
            URL::defaults(['locale' => session('locale')]);
        } else {
            URL::defaults(['locale' => App::getLocale()]);
        }

        return $next($request);
    }
}

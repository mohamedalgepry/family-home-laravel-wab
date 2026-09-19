<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Immediately terminates the session of a deactivated user.
 *
 * Without this check a user deactivated by an admin kept full access
 * until their session expired, because is_active was only verified at
 * login time (AuthService::login).
 */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only kick the user out when is_active is explicitly false.
        // The attribute may be absent on in-memory models (e.g. actingAs()
        // in tests); treating "unknown" as deactivated would be wrong.
        if ($user && ($user->is_active ?? true) == false) {
            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json(['message' => __('Your account has been deactivated.')], 403);
            }

            return redirect()
                ->route('login')
                ->withErrors(['email' => __('Your account has been deactivated.')]);
        }

        return $next($request);
    }
}

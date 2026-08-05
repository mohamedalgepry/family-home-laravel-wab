<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Users\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('Shared/Login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $key = 'login|'.$request->input('email').'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'email' => __('auth.throttle', ['seconds' => $seconds]),
            ]);
        }

        try {
            $user = $this->authService->login(
                $request->only('email', 'password'),
                $request->boolean('remember'),
            );

            RateLimiter::clear($key);

            return redirect()->intended('/admin');
        } catch (ValidationException $e) {
            RateLimiter::hit($key);

            throw $e;
        }
    }

    public function destroy(): RedirectResponse
    {
        $this->authService->logout();

        return redirect()->route('login');
    }

    public function forgotPassword(): Response
    {
        return Inertia::render('Shared/ForgotPassword');
    }

    public function sendResetLink(ForgotPasswordRequest $request): RedirectResponse
    {
        $this->authService->forgotPassword($request->input('email'));

        return back()->with('success', __('auth.check_email'));
    }

    public function showResetForm(\Illuminate\Http\Request $request, string $token): Response
    {
        return Inertia::render('Shared/ResetPassword', [
            'token' => $token,
            'email' => (string) $request->query('email', ''),
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): RedirectResponse
    {
        $this->authService->resetPassword($request->validated());

        return back()->with('status', __('auth.password_reset_success'));
    }
}

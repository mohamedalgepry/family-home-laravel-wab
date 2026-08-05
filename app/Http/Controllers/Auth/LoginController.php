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

            return redirect('/admin');
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
        $key = 'forgot-password|'.$request->input('email').'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'email' => __('auth.throttle', ['seconds' => $seconds]),
            ]);
        }

        RateLimiter::hit($key, 300);

        $email = $request->input('email');
        $this->authService->sendOtp($email, app()->getLocale());

        $request->session()->put('password_reset_email', $email);

        return redirect()->route('password.otp')->with('status', __('auth.otp_sent'));
    }

    public function showVerifyOtpForm(\Illuminate\Http\Request $request): Response|RedirectResponse
    {
        $email = (string) $request->session()->get('password_reset_email', '');

        if ($email === '') {
            return redirect()->route('password.request');
        }

        return Inertia::render('Shared/VerifyOtp', [
            'email' => $email,
        ]);
    }

    public function verifyOtp(\Illuminate\Http\Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $sessionEmail = (string) $request->session()->get('password_reset_email', '');

        if ($sessionEmail === '' || $sessionEmail !== $request->input('email')) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_session_expired'),
            ]);
        }

        $key = 'verify-otp|'.$request->input('email').'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'code' => __('auth.throttle', ['seconds' => $seconds]),
            ]);
        }

        try {
            $resetToken = $this->authService->verifyOtp($request->input('email'), $request->input('code'));
            RateLimiter::clear($key);

            $request->session()->put('password_reset_token', $resetToken);

            return redirect()->route('password.reset', [
                'token' => $resetToken,
            ]);
        } catch (ValidationException $e) {
            RateLimiter::hit($key, 180);
            throw $e;
        }
    }

    public function showResetForm(\Illuminate\Http\Request $request, string $token = ''): Response|RedirectResponse
    {
        $email = (string) $request->session()->get('password_reset_email', '');
        $token = $token ?: (string) $request->session()->get('password_reset_token', '');

        if ($email === '' || $token === '') {
            return redirect()->route('password.request');
        }

        try {
            $secondsRemaining = $this->authService->checkResetTokenValidity($email, $token);
        } catch (ValidationException $e) {
            $request->session()->forget(['password_reset_email', 'password_reset_token']);

            return Inertia::render('Shared/ResetPassword', [
                'token' => $token,
                'email' => $email,
                'secondsRemaining' => 0,
                'error' => __('auth.reset_token_expired'),
            ]);
        }

        return Inertia::render('Shared/ResetPassword', [
            'token' => $token,
            'email' => $email,
            'secondsRemaining' => $secondsRemaining,
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): RedirectResponse
    {
        $sessionEmail = (string) $request->session()->get('password_reset_email', '');

        if ($sessionEmail === '' || $sessionEmail !== $request->input('email')) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_session_expired'),
            ]);
        }

        $this->authService->resetPasswordWithOtp($request->validated());

        $request->session()->forget(['password_reset_email', 'password_reset_token']);

        return redirect()->route('login')->with('status', __('auth.password_reset_success'));
    }
}

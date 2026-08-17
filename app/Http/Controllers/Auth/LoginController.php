<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Users\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $rateLimitKey = 'login|'.$request->input('email').'|'.$request->ip();
        $this->ensureIsNotRateLimited($rateLimitKey, maxAttempts: 5, errorKey: 'email');

        try {
            $user = $this->authService->login(
                $request->only('email', 'password'),
                $request->boolean('remember'),
            );

            RateLimiter::clear($rateLimitKey);

            return redirect('/admin');
        } catch (ValidationException $e) {
            RateLimiter::hit($rateLimitKey);

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
        $email = $request->input('email');
        $rateLimitKey = 'forgot-password|'.$email.'|'.$request->ip();

        $this->ensureIsNotRateLimited($rateLimitKey, maxAttempts: 3, decaySeconds: 300, errorKey: 'email');

        $success = $this->authService->sendOtp($email, app()->getLocale());

        if (! $success) {
            throw ValidationException::withMessages([
                'email' => __('auth.user_not_found'),
            ]);
        }

        RateLimiter::hit($rateLimitKey, 300);
        $request->session()->put('password_reset_email', $email);

        return redirect()->route('password.otp')->with('status', __('auth.otp_sent'));
    }

    public function showVerifyOtpForm(Request $request): Response|RedirectResponse
    {
        $email = (string) $request->session()->get('password_reset_email', '');

        if ($email === '') {
            return redirect()->route('password.request');
        }

        return Inertia::render('Shared/VerifyOtp', [
            'email' => $email,
        ]);
    }

    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $email = $request->input('email');
        $sessionEmail = (string) $request->session()->get('password_reset_email', '');

        if ($sessionEmail === '' || $sessionEmail !== $email) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_session_expired'),
            ]);
        }

        $rateLimitKey = 'verify-otp|'.$email.'|'.$request->ip();
        $this->ensureIsNotRateLimited($rateLimitKey, maxAttempts: 5, errorKey: 'code');

        try {
            $resetToken = $this->authService->verifyOtp($email, $request->input('code'));
            RateLimiter::clear($rateLimitKey);

            $request->session()->put('password_reset_token', $resetToken);

            return redirect()->route('password.reset', [
                'token' => $resetToken,
            ]);
        } catch (ValidationException $e) {
            RateLimiter::hit($rateLimitKey, 180);
            throw $e;
        }
    }

    public function showResetForm(Request $request, string $token = ''): Response|RedirectResponse
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
        $email = $request->input('email');
        $sessionEmail = (string) $request->session()->get('password_reset_email', '');

        if ($sessionEmail === '' || $sessionEmail !== $email) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_session_expired'),
            ]);
        }

        $this->authService->resetPasswordWithOtp($request->validated());
        $request->session()->forget(['password_reset_email', 'password_reset_token']);

        return redirect()->route('login')->with('status', __('auth.password_reset_success'));
    }

    private function ensureIsNotRateLimited(string $key, int $maxAttempts, int $decaySeconds = 60, string $errorKey = 'email'): void
    {
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                $errorKey => __('auth.throttle', ['seconds' => $seconds]),
            ]);
        }
    }
}

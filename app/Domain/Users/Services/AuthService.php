<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(array $credentials, bool $remember = false): User
    {
        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => __('Your account has been deactivated.'),
            ]);
        }

        session()->regenerate();

        return $user;
    }

    public function logout(): void
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();
    }

    public function forgotPassword(string $email): string
    {
        return $this->sendOtp($email, app()->getLocale());
    }

    public function sendOtp(string $email, string $locale = 'ar'): ?string
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            return null;
        }

        $code = (string) random_int(100000, 999999);

        \Illuminate\Support\Facades\DB::table('password_otps')->updateOrInsert(
            ['email' => $email],
            [
                'code_hash' => \Illuminate\Support\Facades\Hash::make($code),
                'otp_expires_at' => now()->addMinutes(5),
                'reset_token_hash' => null,
                'reset_expires_at' => null,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $user->notify(new \App\Domain\Users\Notifications\SendOtpResetNotification($code, $locale));

        return $code;
    }

    public function verifyOtp(string $email, string $code): string
    {
        $record = \Illuminate\Support\Facades\DB::table('password_otps')->where('email', $email)->first();

        if (! $record || ! $record->otp_expires_at || now()->gt($record->otp_expires_at) || ! $record->code_hash || ! \Illuminate\Support\Facades\Hash::check($code, $record->code_hash)) {
            throw ValidationException::withMessages([
                'code' => __('auth.invalid_otp'),
            ]);
        }

        $resetToken = \Illuminate\Support\Str::random(60);

        \Illuminate\Support\Facades\DB::table('password_otps')->where('email', $email)->update([
            'reset_token_hash' => \Illuminate\Support\Facades\Hash::make($resetToken),
            'reset_expires_at' => now()->addMinutes(5),
            'code_hash' => null,
            'updated_at' => now(),
        ]);

        return $resetToken;
    }

    public function checkResetTokenValidity(string $email, string $token): int
    {
        $record = \Illuminate\Support\Facades\DB::table('password_otps')->where('email', $email)->first();

        if (! $record || ! $record->reset_expires_at || now()->gt($record->reset_expires_at) || ! $record->reset_token_hash || ! \Illuminate\Support\Facades\Hash::check($token, $record->reset_token_hash)) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_token_expired'),
            ]);
        }

        return max(0, (int) now()->diffInSeconds(\Illuminate\Support\Carbon::parse($record->reset_expires_at), false));
    }

    public function resetPassword(array $credentials): void
    {
        $this->resetPasswordWithOtp($credentials);
    }

    public function resetPasswordWithOtp(array $credentials): void
    {
        $email = $credentials['email'] ?? '';
        $token = $credentials['token'] ?? '';
        $password = $credentials['password'] ?? '';

        $record = \Illuminate\Support\Facades\DB::table('password_otps')->where('email', $email)->first();

        if (! $record || ! $record->reset_expires_at || now()->gt($record->reset_expires_at) || ! $record->reset_token_hash || ! \Illuminate\Support\Facades\Hash::check($token, $record->reset_token_hash)) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_token_expired'),
            ]);
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => __('passwords.user'),
            ]);
        }

        $user->forceFill(['password' => \Illuminate\Support\Facades\Hash::make($password)])->save();

        \Illuminate\Support\Facades\DB::table('password_otps')->where('email', $email)->delete();
    }
}

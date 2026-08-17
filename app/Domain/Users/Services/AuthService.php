<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SendOtpResetNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private const OTP_EXPIRATION_MINUTES = 5;

    private const RESET_TOKEN_EXPIRATION_MINUTES = 5;

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

    public function forgotPassword(string $email): bool
    {
        return $this->sendOtp($email, app()->getLocale());
    }

    public function sendOtp(string $email, string $locale = 'ar'): bool
    {
        $user = User::where('email', $email)->first();

        if (! $user) {
            return false;
        }

        $code = (string) random_int(100000, 999999);

        DB::table('password_otps')->updateOrInsert(
            ['email' => $email],
            [
                'code_hash' => Hash::make($code),
                'otp_expires_at' => now()->addMinutes(self::OTP_EXPIRATION_MINUTES),
                'reset_token_hash' => null,
                'reset_expires_at' => null,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        $user->notify(new SendOtpResetNotification($code, $locale));

        return true;
    }

    public function verifyOtp(string $email, string $code): string
    {
        $record = DB::table('password_otps')->where('email', $email)->first();

        if (! $this->isOtpRecordValid($record, $code)) {
            throw ValidationException::withMessages([
                'code' => __('auth.invalid_otp'),
            ]);
        }

        $resetToken = Str::random(60);

        DB::table('password_otps')->where('email', $email)->update([
            'reset_token_hash' => Hash::make($resetToken),
            'reset_expires_at' => now()->addMinutes(self::RESET_TOKEN_EXPIRATION_MINUTES),
            'code_hash' => null,
            'updated_at' => now(),
        ]);

        return $resetToken;
    }

    public function checkResetTokenValidity(string $email, string $token): int
    {
        $record = DB::table('password_otps')->where('email', $email)->first();

        if (! $this->isResetTokenRecordValid($record, $token)) {
            throw ValidationException::withMessages([
                'email' => __('auth.reset_token_expired'),
            ]);
        }

        return max(0, (int) now()->diffInSeconds(Carbon::parse($record->reset_expires_at), false));
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

        $record = DB::table('password_otps')->where('email', $email)->first();

        if (! $this->isResetTokenRecordValid($record, $token)) {
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

        $user->forceFill(['password' => Hash::make($password)])->save();

        DB::table('password_otps')->where('email', $email)->delete();
    }

    private function isOtpRecordValid(?object $record, string $code): bool
    {
        if (! $record || ! $record->otp_expires_at || ! $record->code_hash) {
            return false;
        }

        if (now()->gt($record->otp_expires_at)) {
            return false;
        }

        return Hash::check($code, $record->code_hash);
    }

    private function isResetTokenRecordValid(?object $record, string $token): bool
    {
        if (! $record || ! $record->reset_expires_at || ! $record->reset_token_hash) {
            return false;
        }

        if (now()->gt($record->reset_expires_at)) {
            return false;
        }

        return Hash::check($token, $record->reset_token_hash);
    }
}

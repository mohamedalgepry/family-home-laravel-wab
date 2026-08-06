<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SendEmailChangeOtpNotification;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    public function updateProfile(User $user, string $name, ?string $phone, ?string $whatsapp, ?string $facebook): User
    {
        $user->update([
            'name' => $name,
        ]);

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => $phone,
                'whatsapp' => $whatsapp,
                'facebook' => $facebook,
            ]
        );

        return $user->fresh();
    }

    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => __('The current password is incorrect.'),
            ]);
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    public function uploadAvatar(User $user, UploadedFile $avatar): string
    {
        $oldAvatar = $user->profile?->avatar;

        $path = $avatar->store("avatars/{$user->id}", 'public');

        if (! $path) {
            throw new \RuntimeException('Failed to store avatar.');
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            ['avatar' => $path]
        );

        if ($oldAvatar && Storage::disk('public')->exists($oldAvatar)) {
            Storage::disk('public')->delete($oldAvatar);
        }

        return $path;
    }

    public function updateProfileWithAvatar(User $user, array $data, ?UploadedFile $avatar): User
    {
        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $userData = Arr::only($data, ['name', 'password']);
        $profileData = Arr::only($data, ['phone', 'whatsapp', 'facebook', 'linkedin']);

        if ($avatar) {
            $profileData['avatar'] = $this->storeAvatar($user, $avatar);
        }

        $user->update($userData);
        $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);

        return $user->fresh();
    }

    private function storeAvatar(User $user, UploadedFile $avatar): string
    {
        $oldAvatar = $user->profile?->avatar;
        $path = $avatar->store('avatars', 'public');

        if (! $path) {
            throw new \RuntimeException('Failed to store avatar.');
        }

        if ($oldAvatar && Storage::disk('public')->exists($oldAvatar)) {
            Storage::disk('public')->delete($oldAvatar);
        }

        return $path;
    }

    public function sendEmailChangeOtp(User $user, string $newEmail, string $locale = 'ar'): string
    {
        $newEmail = strtolower(trim($newEmail));

        if ($newEmail === strtolower($user->email)) {
            throw ValidationException::withMessages([
                'new_email' => __('auth.same_email_error'),
            ]);
        }

        if (User::where('email', $newEmail)->where('id', '!=', $user->id)->exists()) {
            throw ValidationException::withMessages([
                'new_email' => __('auth.email_already_taken'),
            ]);
        }

        $code = (string) random_int(100000, 999999);

        Cache::put("email_change_otp_{$user->id}", [
            'new_email' => $newEmail,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(5),
        ], now()->addMinutes(5));

        $user->notify(new SendEmailChangeOtpNotification($code, $locale));

        return $code;
    }

    public function verifyAndChangeEmail(User $user, string $newEmail, string $code): void
    {
        $newEmail = strtolower(trim($newEmail));
        $cacheData = Cache::get("email_change_otp_{$user->id}");

        if (! $cacheData || empty($cacheData['code_hash']) || empty($cacheData['new_email'])) {
            throw ValidationException::withMessages([
                'code' => __('auth.invalid_otp'),
            ]);
        }

        if ($cacheData['new_email'] !== $newEmail) {
            throw ValidationException::withMessages([
                'new_email' => __('auth.email_mismatch'),
            ]);
        }

        if (now()->gt($cacheData['expires_at'] ?? now())) {
            throw ValidationException::withMessages([
                'code' => __('auth.invalid_otp'),
            ]);
        }

        if (! Hash::check($code, $cacheData['code_hash'])) {
            throw ValidationException::withMessages([
                'code' => __('auth.invalid_otp'),
            ]);
        }

        if (User::where('email', $newEmail)->where('id', '!=', $user->id)->exists()) {
            throw ValidationException::withMessages([
                'new_email' => __('auth.email_already_taken'),
            ]);
        }

        $user->forceFill(['email' => $newEmail])->save();
        Cache::forget("email_change_otp_{$user->id}");
    }
}

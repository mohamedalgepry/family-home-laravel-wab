<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
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

        $userData    = Arr::only($data, ['name', 'email', 'password']);
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
        $path      = $avatar->store('avatars', 'public');

        if (! $path) {
            throw new \RuntimeException('Failed to store avatar.');
        }

        if ($oldAvatar && Storage::disk('public')->exists($oldAvatar)) {
            Storage::disk('public')->delete($oldAvatar);
        }

        return $path;
    }
}

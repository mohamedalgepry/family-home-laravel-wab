<?php

namespace App\Domain\Users\Actions;

use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SendWelcomeNotification;
use Illuminate\Support\Facades\Hash;

/**
 * Creates an admin-panel user and sends the welcome credentials notification.
 */
class CreateUserAction
{
    public function execute(array $data, User $actor): User
    {
        $plainPassword = $data['password'];

        $user = User::make([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($plainPassword),
            'manager_id' => $data['role'] === 'agent'
                ? (! empty($data['manager_id']) ? $data['manager_id'] : $actor->id)
                : null,
        ]);

        $user->role = $data['role'];
        $user->is_active = true;
        $user->save();

        $user->notify(new SendWelcomeNotification($plainPassword, app()->getLocale()));

        return $user;
    }
}

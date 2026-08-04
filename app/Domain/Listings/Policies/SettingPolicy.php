<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Users\Models\User;

class SettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }
}

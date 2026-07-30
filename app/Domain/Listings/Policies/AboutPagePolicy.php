<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Users\Models\User;

class AboutPagePolicy
{
    public function view(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }
}

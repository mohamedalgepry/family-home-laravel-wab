<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\Area;
use App\Domain\Users\Models\User;

class AreaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Area $area): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Area $area): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Area $area): bool
    {
        return $user->role === 'admin';
    }
}

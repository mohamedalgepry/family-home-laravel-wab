<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;

class UnitTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, UnitType $unitType): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, UnitType $unitType): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, UnitType $unitType): bool
    {
        return $user->role === 'admin';
    }
}

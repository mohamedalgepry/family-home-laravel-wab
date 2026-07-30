<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\FinishingType;
use App\Domain\Users\Models\User;

class FinishingTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, FinishingType $finishingType): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, FinishingType $finishingType): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, FinishingType $finishingType): bool
    {
        return $user->role === 'admin';
    }
}

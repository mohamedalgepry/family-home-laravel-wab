<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\Feature;
use App\Domain\Users\Models\User;

class FeaturePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Feature $feature): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Feature $feature): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Feature $feature): bool
    {
        return $user->role === 'admin';
    }
}

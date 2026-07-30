<?php

namespace App\Domain\Points\Policies;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;

class AllocatePointsPolicy
{
    public function allocate(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isAgent()) {
            return false;
        }

        $unit = Unit::with('user.manager')->find($unit->id);

        if (! $unit || ! $unit->user) {
            return false;
        }

        return $unit->user->manager_id === $user->id
            || $unit->user_id === $user->id;
    }
}

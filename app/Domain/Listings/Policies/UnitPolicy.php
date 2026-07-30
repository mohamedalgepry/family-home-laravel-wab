<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;

class UnitPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $unit->user_id === null
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        if ($user->isAgent()) {
            if ($user->manager_id) {
                return $unit->user_id === $user->id
                    || $unit->user_id === $user->manager_id
                    || User::where('id', $unit->user_id)->where('manager_id', $user->manager_id)->exists();
            }

            return $unit->user_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isManager() || $user->isAgent();
    }

    public function update(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $unit->user_id === null
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        if ($user->isAgent()) {
            return $unit->user_id === $user->id;
        }

        return false;
    }

    public function delete(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        return false;
    }

    public function togglePin(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        return false;
    }

    public function toggleDeal(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        return false;
    }

    public function toggleActive(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $unit->user_id === $user->id
                || $user->agents()->where('id', $unit->user_id)->exists();
        }

        return false;
    }
}

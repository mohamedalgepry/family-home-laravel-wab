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
            return $this->isOwnedByTeam($user, $unit);
        }

        if ($user->isAgent()) {
            return $this->isInAgentsTeam($user, $unit);
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
            return $this->isOwnedByTeam($user, $unit);
        }

        if ($user->isAgent()) {
            return $this->isOwnedBy($user, $unit);
        }

        return false;
    }

    public function delete(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isManager() && $this->isOwnedByTeam($user, $unit);
    }

    public function togglePin(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isManager() && $this->isOwnedByTeam($user, $unit);
    }

    public function toggleDeal(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isManager() && $this->isOwnedByTeam($user, $unit);
    }

    public function toggleActive(User $user, Unit $unit): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->isManager() && $this->isOwnedByTeam($user, $unit);
    }

    private function isOwnedByTeam(User $user, Unit $unit): bool
    {
        return $this->isOwnedBy($user, $unit)
            || $user->agents()->where('id', $unit->user_id)->exists();
    }

    private function isOwnedBy(User $user, Unit $unit): bool
    {
        return $unit->user_id === $user->id;
    }

    private function isInAgentsTeam(User $user, Unit $unit): bool
    {
        if (! $user->manager_id) {
            return $this->isOwnedBy($user, $unit);
        }

        return $this->isOwnedBy($user, $unit)
            || $unit->user_id === $user->manager_id
            || User::where('id', $unit->user_id)->where('manager_id', $user->manager_id)->exists();
    }
}

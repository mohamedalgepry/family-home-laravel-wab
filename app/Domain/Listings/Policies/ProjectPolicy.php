<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $this->isOwnedBy($user, $project);
        }

        if ($user->isAgent()) {
            if ($user->manager_id === null) {
                return true;
            }

            $manager = $user->manager ?? User::find($user->manager_id);
            if (! $manager || $manager->isAdmin()) {
                return true;
            }

            return $project->user_id === $user->manager_id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $this->isOwnedBy($user, $project);
        }

        return false;
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->isAdmin();
    }

    private function isOwnedBy(User $user, Project $project): bool
    {
        return $project->user_id === $user->id;
    }
}

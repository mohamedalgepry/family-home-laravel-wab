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
            return $project->user_id === $user->id || $project->user_id === null;
        }

        if ($user->isAgent()) {
            return $project->user_id === $user->id || $project->user_id === null;
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
            return $project->user_id === $user->id;
        }

        return false;
    }

    public function delete(User $user, Project $project): bool
    {
        return $user->isAdmin();
    }
}

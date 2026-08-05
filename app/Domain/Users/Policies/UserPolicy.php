<?php

namespace App\Domain\Users\Policies;

use App\Domain\Users\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }

    public function view(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->id === $model->id || ($user->isManager() && $model->manager_id === $user->id);
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isManager();
    }

    public function update(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->id === $model->id || ($user->isManager() && $model->manager_id === $user->id);
    }

    public function delete(User $user, User $model): bool
    {
        return ($user->isAdmin() && $user->id !== $model->id) || ($user->isManager() && $model->manager_id === $user->id);
    }

    public function transferProjects(User $user): bool
    {
        return $user->isAdmin();
    }

    public function assignAgents(User $user): bool
    {
        return $user->isAdmin();
    }
}

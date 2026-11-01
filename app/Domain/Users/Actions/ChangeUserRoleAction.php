<?php

namespace App\Domain\Users\Actions;

use App\Domain\Users\Models\User;

/**
 * Applies a role change, resolving the managing manager when the new role is agent.
 */
class ChangeUserRoleAction
{
    /**
     * @return bool False when an agent is submitted without a valid manager.
     */
    public function execute(User $user, string $role, ?int $managerId): bool
    {
        if ($role === 'agent') {
            $manager = User::query()
                ->whereKey($managerId)
                ->where('role', 'manager')
                ->first();

            if (! $manager) {
                return false;
            }

            $user->manager_id = $manager->id;
        } else {
            $user->manager_id = null;
        }

        $user->role = $role;
        $user->save();

        return true;
    }
}

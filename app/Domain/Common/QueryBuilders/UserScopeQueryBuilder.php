<?php

namespace App\Domain\Common\QueryBuilders;

use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserScopeQueryBuilder
{
    /**
     * يطبّق نطاق رؤية القوائم (الوحدات): المشرف يرى الكل،
     * المدير يرى وحدات نفسه ووسطائه، والوسيط يرى وحدات فريقه.
     */
    public static function applyListingsScope(Builder $query, ?User $user, string $ownerColumn = 'user_id'): Builder
    {
        if ($user === null || $user->isAdmin()) {
            return $query;
        }

        if ($user->isManager()) {
            $allowedUserIds = $user->agents()->pluck('id')->push($user->id);

            return $query->whereIn($ownerColumn, $allowedUserIds);
        }

        if ($user->manager_id) {
            $teamUserIds = User::where('manager_id', $user->manager_id)
                ->pluck('id')
                ->push($user->manager_id);

            return $query->whereIn($ownerColumn, $teamUserIds);
        }

        return $query->where($ownerColumn, $user->id);
    }

    /**
     * يطبّق نطاق الملكية (المشاريع): المدير يرى مشاريعه فقط،
     * والوسيط يرى مشاريع مديره فقط.
     */
    public static function applyOwnershipScope(Builder $query, ?User $user, string $ownerColumn = 'user_id'): Builder
    {
        if ($user === null || $user->isAdmin()) {
            return $query;
        }

        $ownerId = $user->isManager() ? $user->id : $user->manager_id;

        return $query->where($ownerColumn, $ownerId);
    }

    /**
     * يطبّق نطاق فريق الوكيل على عمود الوسيط (مثل agent_id):
     * الوكيل يرى سجلاته فقط، والمدير يرى سجلاته وسجلات وسطائه.
     */
    public static function applyTeamScope(Builder $query, ?User $user, string $agentColumn = 'agent_id'): Builder
    {
        if ($user === null || $user->isAdmin()) {
            return $query;
        }

        if ($user->isAgent()) {
            return $query->where($agentColumn, $user->id);
        }

        if ($user->isManager()) {
            $agentIds = $user->agents()->pluck('id');

            return $query->where(function (Builder $q) use ($user, $agentIds, $agentColumn) {
                $q->where($agentColumn, $user->id)
                    ->orWhereIn($agentColumn, $agentIds);
            });
        }

        return $query;
    }
}

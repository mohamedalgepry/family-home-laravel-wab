<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\DTOs\CreateUserData;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function createUser(CreateUserData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::make([
                'name' => $data->name,
                'email' => $data->email,
                'password' => Hash::make($data->password),
                'manager_id' => $data->manager_id ?? null,
            ]);

            $user->role = $data->role;
            $user->is_active = true;
            $user->points_balance = 0;
            $user->initial_monthly_balance = $data->initial_monthly_balance ?? 0;
            $user->save();

            $user->profile()->create([
                'phone' => $data->phone,
                'whatsapp' => $data->whatsapp,
                'facebook' => $data->facebook,
                'avatar' => null,
            ]);

            return $user;
        });
    }

    public function deactivateUser(int $userId): void
    {
        $user = User::findOrFail($userId);
        $user->is_active = false;
        $user->save();
    }

    public function activateUser(int $userId): void
    {
        $user = User::findOrFail($userId);
        $user->is_active = true;
        $user->save();
    }

    public function transferProjects(int $fromUserId, int $toUserId): void
    {
        DB::transaction(function () use ($fromUserId, $toUserId) {
            $fromUser = User::findOrFail($fromUserId);
            User::findOrFail($toUserId);

            $fromUser->projects()->update(['user_id' => $toUserId]);
            $fromUser->units()->update(['user_id' => $toUserId]);
        });
    }

    public function assignAgentToManager(int $managerId, array $agentIds): void
    {
        DB::transaction(function () use ($managerId, $agentIds) {
            User::findOrFail($managerId);

            User::where('role', 'agent')
                ->where('manager_id', $managerId)
                ->whereNotIn('id', $agentIds)
                ->update(['manager_id' => null]);

            if (! empty($agentIds)) {
                User::whereIn('id', $agentIds)
                    ->where('role', 'agent')
                    ->update(['manager_id' => $managerId]);
            }
        });
    }

    public function checkUserRelations(int $userId): array
    {
        $user = User::withCount(['projects', 'units', 'agents'])->findOrFail($userId);

        return [
            'projects_count' => $user->projects_count,
            'units_count' => $user->units_count,
            'agents_count' => $user->agents_count,
            'has_relations' => $user->projects_count > 0 || $user->units_count > 0 || $user->agents_count > 0,
        ];
    }

    public function destroyUser(int $userId, ?int $transferToId = null): void
    {
        DB::transaction(function () use ($userId, $transferToId) {
            $user = User::with(['profile'])->findOrFail($userId);

            if ($transferToId) {
                $this->transferProjects($userId, $transferToId);
                // إذا كان للمستخدم وكلاء (agents) يجب نقلهم أيضًا أو تحريرهم
                if ($user->agents()->count() > 0) {
                    $user->agents()->update(['manager_id' => $transferToId]);
                }
            } else {
                // If not transferring, explicitly clean up unit images, units, project images, projects, and avatar
                $projectImages = \App\Domain\Listings\Models\ProjectImage::whereHas('project', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                })->pluck('path')->toArray();

                $unitImages = \App\Domain\Listings\Models\UnitImage::whereHas('unit', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                })->pluck('path')->toArray();

                $allImages = array_merge($projectImages, $unitImages);
                if ($user->profile?->avatar) {
                    $allImages[] = $user->profile->avatar;
                }

                // Delete child image records first
                \App\Domain\Listings\Models\UnitImage::whereHas('unit', fn ($q) => $q->where('user_id', $userId))->delete();
                \App\Domain\Listings\Models\Unit::where('user_id', $userId)->delete();

                \App\Domain\Listings\Models\ProjectImage::whereHas('project', fn ($q) => $q->where('user_id', $userId))->delete();
                \App\Domain\Listings\Models\Project::where('user_id', $userId)->delete();

                if (! empty($allImages)) {
                    app(\App\Domain\Listings\Services\ListingImageService::class)->deleteImageFiles($allImages);
                }
            }

            $user->delete();
        });
    }
}

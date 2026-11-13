<?php

namespace App\Domain\Users\Services;

use App\Domain\Assistant\Notifications\NewAssistantLeadNotification;
use App\Domain\Users\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Cache;

class NotificationService
{
    public function __construct(private readonly NotificationActionResolver $actionResolver) {}

    public function paginated(User $user): LengthAwarePaginator
    {
        $page = (int) request('page', 1);

        return $this->rememberForUser(
            $user,
            "notifications_page_{$page}",
            60,
            function () use ($user) {
                $paginator = $this->visibleNotifications($user)
                    ->paginate(20)
                    ->withQueryString();

                $paginator->setCollection($this->presentMany($paginator->getCollection(), $user));

                return $paginator;
            }
        );
    }

    public function recent(User $user, int $limit = 5): array
    {
        return $this->rememberForUser(
            $user,
            "recent_notifications_{$limit}",
            30,
            function () use ($user, $limit) {
                $notifications = $this->visibleNotifications($user)
                    ->orderByDesc('created_at')
                    ->orderByDesc('id')
                    ->take($limit)
                    ->get();

                return $this->presentMany($notifications, $user)->values()->all();
            }
        );
    }

    public function unreadCount(User $user): int
    {
        return $this->rememberForUser(
            $user,
            'unread_count',
            30,
            fn () => $this->visibleNotifications($user)->whereNull('read_at')->count()
        );
    }

    public function present(DatabaseNotification $notification, ?User $viewer = null): array
    {
        $viewer ??= $notification->notifiable;

        if (! $viewer instanceof User) {
            $data = $notification->data;
            $data['id'] = $notification->id;
            $data['read_at'] = $notification->read_at?->toIso8601String();
            $data['created_at'] = $notification->created_at?->toIso8601String();
            $data['created_at_human'] = $notification->created_at?->diffForHumans();
            $data['actions'] = [];
            $data['primary_url'] = '/admin/notifications';

            return $data;
        }

        return $this->presentMany(collect([$notification]), $viewer)->first();
    }

    /**
     * @param  \Illuminate\Support\Collection<int, DatabaseNotification>  $notifications
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    public function presentMany($notifications, User $viewer)
    {
        $unitIds = [];
        $projectIds = [];

        foreach ($notifications as $notification) {
            $data = $notification->data;
            if (! empty($data['unit_id'])) {
                $unitIds[] = (int) $data['unit_id'];
            }
            if (! empty($data['project_id'])) {
                $projectIds[] = (int) $data['project_id'];
            }
        }

        $units = $unitIds === []
            ? collect()
            : \App\Domain\Listings\Models\Unit::query()
                ->with([
                    'user:id,name',
                    'images' => fn ($query) => $query
                        ->select(['id', 'unit_id', 'path', 'is_primary', 'sort_order'])
                        ->orderByDesc('is_primary')
                        ->orderBy('sort_order'),
                ])
                ->whereIn('id', array_unique($unitIds))
                ->get()
                ->keyBy('id');

        $projects = $projectIds === []
            ? collect()
            : \App\Domain\Listings\Models\Project::query()
                ->whereIn('id', array_unique($projectIds))
                ->get(['id', 'user_id', 'is_active', 'slug', 'auto_delete_at'])
                ->keyBy('id');

        return $notifications->map(function (DatabaseNotification $notification) use ($viewer, $units, $projects) {
            $data = $notification->data;
            $data['id'] = $notification->id;
            $data['read_at'] = $notification->read_at?->toIso8601String();
            $data['created_at'] = $notification->created_at?->toIso8601String();
            $data['created_at_human'] = $notification->created_at?->diffForHumans();

            $unit = ! empty($data['unit_id']) ? $units->get((int) $data['unit_id']) : null;
            $project = ! empty($data['project_id']) ? $projects->get((int) $data['project_id']) : null;

            if (! empty($data['unit_id'])) {
                $data['unit_exists'] = $unit !== null;
                $data['unit_is_active'] = $unit ? (bool) $unit->is_active : false;
                if ($unit && empty($data['unit_slug'])) {
                    $data['unit_slug'] = $unit->slug;
                }
                if ($unit && empty($data['unit_image'])) {
                    $data['unit_image'] = $unit->images->first()?->thumb_url;
                }
                if ($unit && empty($data['agent_name'])) {
                    $data['agent_name'] = $unit->user?->name;
                }
            }

            if (! empty($data['project_id'])) {
                $data['project_exists'] = $project !== null;
                $data['project_is_active'] = $project ? (bool) $project->is_active : false;
                if ($project && empty($data['project_slug'])) {
                    $data['project_slug'] = $project->slug;
                }
            }

            $isUnitExtended = false;
            if ($unit && $unit->auto_delete_at && ! empty($data['expires_at'])) {
                try {
                    $origExpires = \Carbon\Carbon::parse($data['expires_at']);
                    $isUnitExtended = $unit->auto_delete_at->isAfter($origExpires->addMinutes(5));
                } catch (\Throwable) {}
            }

            $isProjectExtended = false;
            if ($project && $project->auto_delete_at && ! empty($data['expires_at'])) {
                try {
                    $origExpires = \Carbon\Carbon::parse($data['expires_at']);
                    $isProjectExtended = $project->auto_delete_at->isAfter($origExpires->addMinutes(5));
                } catch (\Throwable) {}
            }

            $data['is_extended'] = $isUnitExtended || $isProjectExtended;

            $resolved = $this->actionResolver->resolve([
                'type' => $data['type'] ?? '',
                'unit_id' => $data['unit_id'] ?? null,
                'unit_exists' => $unit !== null,
                'unit_is_active' => $unit ? (bool) $unit->is_active : false,
                'unit_slug' => $data['unit_slug'] ?? null,
                'project_id' => $data['project_id'] ?? null,
                'project_exists' => $project !== null,
                'project_is_active' => $project ? (bool) $project->is_active : false,
                'project_slug' => $data['project_slug'] ?? null,
                'lead_id' => $data['lead_id'] ?? null,
                'message_id' => $data['message_id'] ?? null,
                'action_url' => $data['action_url'] ?? null,
                'can_view_lead' => $viewer->isAdmin(),
                'is_extended' => $data['is_extended'],
                'can_approve_unit' => $unit && $viewer->can('toggleActive', $unit),
                'can_extend_unit' => $unit && $viewer->can('extendExpiry', $unit),
                'can_delete_unit' => $unit && $viewer->can('delete', $unit),
                'can_edit_unit' => $unit && $viewer->can('update', $unit),
                'can_approve_project' => $project && $viewer->isAdmin(),
                'can_extend_project' => $project && $viewer->isAdmin(),
                'can_edit_project' => $project && $viewer->can('update', $project),
            ]);

            $data['actions'] = $resolved['actions'];
            $data['primary_url'] = $resolved['primary_url'];

            return $data;
        })->values();
    }

    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = $this->visibleNotifications($user)->where('id', $notificationId)->first();

        if (! $notification || $notification->read_at) {
            return false;
        }

        $notification->markAsRead();
        $this->clearUserCache($user);

        return true;
    }

    public function markAllAsRead(User $user): void
    {
        $this->visibleNotifications($user)->whereNull('read_at')->update(['read_at' => now()]);
        $this->clearUserCache($user);
    }

    public function dismiss(User $user, string $notificationId): bool
    {
        $notification = $this->visibleNotifications($user)->where('id', $notificationId)->first();

        if (! $notification) {
            return false;
        }

        $notification->markAsRead();
        $this->clearUserCache($user);

        return true;
    }

    public function delete(User $user, string $notificationId): bool
    {
        $deleted = $this->visibleNotifications($user)->where('id', $notificationId)->delete();

        if ($deleted) {
            $this->clearUserCache($user);
        }

        return $deleted;
    }

    public function clearAll(User $user): void
    {
        $this->visibleNotifications($user)->delete();
        $this->clearUserCache($user);
    }

    /**
     * يعلّم إشعارات كيان (وحدة/مشروع) كمقروءة مع إبطال الكاش المرتبط بها.
     */
    public function markEntityNotificationsAsRead(User $user, string $entityColumn, int $entityId, ?string $dataType = null): void
    {
        $query = $user->unreadNotifications()->where("data->{$entityColumn}", $entityId);

        if ($dataType !== null) {
            $query->where('data->type', $dataType);
        }

        $query->update(['read_at' => now()]);

        $this->clearUserCache($user);
    }

    /**
     * يعلّم إشعار الكيان كمقروء عند كل المستلمين، لأن الموافقة أو التمديد يخص الحالة نفسها.
     *
     * @param  list<string>  $dataTypes
     */
    public function markEntityNotificationsAsReadForAll(string $entityColumn, int $entityId, array $dataTypes = []): void
    {
        $matching = DatabaseNotification::query()->where("data->{$entityColumn}", $entityId);

        if ($dataTypes !== []) {
            $matching->whereIn('data->type', $dataTypes);
        }

        $userIds = (clone $matching)->distinct()->pluck('notifiable_id');

        (clone $matching)->whereNull('read_at')->update(['read_at' => now()]);

        foreach ($userIds as $userId) {
            $this->clearCacheForUserId((int) $userId);
        }
    }

    /**
     * حذف إشعارات كيان معين وإبطال كاش جميع المستلمين.
     */
    public function removeEntityNotifications(string $entityColumn, int $entityId, array $types = []): void
    {
        $query = DatabaseNotification::query();
        if (! empty($types)) {
            $query->whereIn('type', $types);
        }
        $query->where("data->{$entityColumn}", $entityId);

        $userIds = (clone $query)->distinct()->pluck('notifiable_id');

        $query->delete();

        foreach ($userIds as $uid) {
            $this->clearCacheForUserId((int) $uid);
        }
    }

    public function clearUserCache(User $user): void
    {
        $this->clearCacheForUserId($user->id);
        Cache::forget("user_{$user->id}_notifications_v2_unread_count");
        Cache::forget("user_{$user->id}_notifications_v2_recent_notifications_5");
        for ($page = 1; $page <= 30; $page++) {
            Cache::forget("user_{$user->id}_notifications_v2_notifications_page_{$page}");
        }
    }

    public function clearCacheForUserId(int $userId): void
    {
        $versionKey = "user_{$userId}_notifications_cache_version";
        Cache::add($versionKey, 1);
        Cache::increment($versionKey);
    }

    private function rememberForUser(User $user, string $key, int $seconds, callable $callback): mixed
    {
        $versionKey = "user_{$user->id}_notifications_cache_version";
        $version = Cache::get($versionKey, 1);
        $cacheKey = "user_{$user->id}_notifications_v2_{$key}";
        $cached = Cache::get($cacheKey);

        if (is_array($cached) && ($cached['version'] ?? null) === $version && array_key_exists('value', $cached)) {
            return $cached['value'];
        }

        $value = $callback();
        Cache::put($cacheKey, ['version' => $version, 'value' => $value], $seconds);

        return $value;
    }

    private function visibleNotifications(User $user)
    {
        $query = $user->notifications();

        if (! $user->isAdmin()) {
            $query->where('type', '!=', NewAssistantLeadNotification::class);
        }

        return $query;
    }
}

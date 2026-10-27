<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Cache;

class NotificationService
{
    public function paginated(User $user): LengthAwarePaginator
    {
        $page = (int) request('page', 1);

        return $this->rememberForUser(
            $user,
            "notifications_page_{$page}",
            60,
            function () use ($user) {
                return $user->notifications()
                    ->paginate(20)
                    ->withQueryString()
                    ->through(fn (DatabaseNotification $notification) => $this->present($notification));
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
                return $user->notifications()
                    ->orderByDesc('created_at')
                    ->orderByDesc('id')
                    ->take($limit)
                    ->get()
                    ->map(fn (DatabaseNotification $n) => $this->present($n))
                    ->toArray();
            }
        );
    }

    public function unreadCount(User $user): int
    {
        return $this->rememberForUser(
            $user,
            'unread_count',
            30,
            fn () => $user->unreadNotifications()->count()
        );
    }

    public function present(DatabaseNotification $notification): array
    {
        $data = $notification->data;
        $data['id'] = $notification->id;
        $data['read_at'] = $notification->read_at?->toIso8601String();
        $data['created_at_human'] = $notification->created_at->diffForHumans();

        // Enrich with unit primary image and agent name when unit_id exists
        if (! empty($data['unit_id'])) {
            $this->enrichWithUnitData($data);
        }

        return $data;
    }

    /**
     * Enrich notification data with unit's primary image and uploader (agent) name.
     */
    private function enrichWithUnitData(array &$data): void
    {
        $unitId = $data['unit_id'];

        // Get primary image thumb URL (cached per unit to avoid repeated queries)
        if (! isset($data['unit_image'])) {
            $data['unit_image'] = Cache::remember(
                "unit_{$unitId}_primary_thumb",
                300,
                function () use ($unitId) {
                    $image = \App\Domain\Listings\Models\UnitImage::where('unit_id', $unitId)
                        ->where('is_primary', true)
                        ->first();

                    if (! $image) {
                        // Fallback to first image
                        $image = \App\Domain\Listings\Models\UnitImage::where('unit_id', $unitId)
                            ->orderBy('sort_order')
                            ->first();
                    }

                    return $image?->thumb_url;
                }
            );
        }

        // Get agent (uploader) name
        if (! isset($data['agent_name'])) {
            $data['agent_name'] = Cache::remember(
                "unit_{$unitId}_agent_name",
                300,
                function () use ($unitId) {
                    $unit = \App\Domain\Listings\Models\Unit::select('user_id')
                        ->where('id', $unitId)
                        ->first();

                    if ($unit?->user_id) {
                        return \App\Domain\Users\Models\User::where('id', $unit->user_id)
                            ->value('name');
                    }

                    return null;
                }
            );
        }
    }

    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (! $notification || $notification->read_at) {
            return false;
        }

        $notification->markAsRead();
        $this->clearUserCache($user);

        return true;
    }

    public function markAllAsRead(User $user): void
    {
        $user->unreadNotifications()->update(['read_at' => now()]);
        $this->clearUserCache($user);
    }

    public function dismiss(User $user, string $notificationId): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (! $notification) {
            return false;
        }

        $notification->markAsRead();
        $this->clearUserCache($user);

        return true;
    }

    public function delete(User $user, string $notificationId): bool
    {
        $deleted = $user->notifications()->where('id', $notificationId)->delete();

        if ($deleted) {
            $this->clearUserCache($user);
        }

        return $deleted;
    }

    public function clearAll(User $user): void
    {
        $user->notifications()->delete();
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
        Cache::forget("user_{$user->id}_unread_count");
        Cache::forget("user_{$user->id}_recent_notifications_5");
        for ($page = 1; $page <= 30; $page++) {
            Cache::forget("user_{$user->id}_notifications_page_{$page}");
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
        $cacheKey = "user_{$user->id}_{$key}";
        $cached = Cache::get($cacheKey);

        if (is_array($cached) && ($cached['version'] ?? null) === $version && array_key_exists('value', $cached)) {
            return $cached['value'];
        }

        $value = $callback();
        Cache::put($cacheKey, ['version' => $version, 'value' => $value], $seconds);

        return $value;
    }
}

<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Cache;

class NotificationService
{
    private const CACHE_KEY_UNREAD_COUNT = 'user_{id}_unread_count';

    private const CACHE_KEY_NOTIFICATIONS_PAGE = 'user_{id}_notifications_page';

    private const CACHE_KEY_RECENT = 'user_{id}_recent_notifications';

    public function paginated(User $user): LengthAwarePaginator
    {
        return Cache::remember(
            str_replace('{id}', $user->id, self::CACHE_KEY_NOTIFICATIONS_PAGE),
            60,
            function () use ($user) {
                return $user->notifications()
                    ->paginate(20)
                    ->through(fn (DatabaseNotification $notification) => $this->present($notification));
            }
        );
    }

    public function recent(User $user, int $limit = 5): array
    {
        return Cache::remember(
            str_replace('{id}', $user->id, self::CACHE_KEY_RECENT),
            30,
            function () use ($user, $limit) {
                return $user->notifications()
                    ->take($limit)
                    ->get()
                    ->map(fn (DatabaseNotification $n) => $this->present($n))
                    ->toArray();
            }
        );
    }

    public function unreadCount(User $user): int
    {
        return Cache::remember(
            str_replace('{id}', $user->id, self::CACHE_KEY_UNREAD_COUNT),
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

        return $data;
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
        $user->unreadNotifications->markAsRead();
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
        $notifications = $user->unreadNotifications()
            ->get()
            ->filter(function (DatabaseNotification $notification) use ($entityColumn, $entityId, $dataType) {
                return ($notification->data[$entityColumn] ?? null) == $entityId
                    && ($dataType === null || ($notification->data['type'] ?? '') === $dataType);
            });

        if ($notifications->isEmpty()) {
            return;
        }

        foreach ($notifications as $notification) {
            $notification->markAsRead();
        }

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

        $notifications = $query->get()->filter(function (DatabaseNotification $notification) use ($entityColumn, $entityId) {
            return ($notification->data[$entityColumn] ?? null) == $entityId;
        });

        $userIds = $notifications->pluck('notifiable_id')->unique();

        foreach ($notifications as $notification) {
            $notification->delete();
        }

        foreach ($userIds as $uid) {
            $this->clearCacheForUserId((int) $uid);
        }
    }

    public function clearUserCache(User $user): void
    {
        $this->clearCacheForUserId($user->id);
    }

    public function clearCacheForUserId(int $userId): void
    {
        Cache::forget("user_{$userId}_unread_count");
        Cache::forget("user_{$userId}_notifications_page");
        Cache::forget("user_{$userId}_recent_notifications");
    }
}

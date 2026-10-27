# Contract: Notifications Endpoints & Service

## 1. Admin Notifications Endpoints

### `GET /admin/notifications`
Renders paginated notifications for the authenticated user.

#### Query Parameters
- `page`: integer, optional (default 1)

#### Cache Rules
- Cache Key: `user_{userId}_notifications_page_{page}`
- TTL: 60 seconds
- Invalidation: Any write operation (`markAsRead`, `markAllAsRead`, `dismiss`, `delete`, `clearAll`) clears all cached notification keys for `userId`.

#### Inertia Props Contract
```typescript
interface AdminNotificationsProps {
  notifications: {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

interface NotificationItem {
  id: string; // UUID
  type: string;
  read_at: string | null;
  created_at_human: string;
  title: string;
  title_en: string;
  message: string;
  unit_id?: number;
  unit_name?: string;
  unit_image?: string | null;
  agent_name?: string | null;
  client_name?: string;
  client_phone?: string;
  content?: string;
}
```

---

### `POST /admin/notifications/{id}/read`
Marks a single notification as read.

#### Authorization
- Scope check: `notifiable_id === auth()->id() && notifiable_type === User::class`
- Throws `403 Forbidden` if user attempts to mark another user's notification.

#### Response
```json
{
  "success": true
}
```

---

### `POST /admin/notifications/read-all`
Marks all unread notifications of the current authenticated user as read.

#### Response
```json
{
  "success": true
}
```

---

### `DELETE /admin/notifications/{id}`
Permanently deletes a single notification for the authenticated user.

#### Authorization
- Scope check: `notifiable_id === auth()->id()`

---

### `DELETE /admin/notifications/clear-all`
Deletes all notifications belonging to the authenticated user.

---

## 2. Notification Service Internal Contracts

```php
namespace App\Domain\Users\Services;

interface NotificationServiceInterface
{
    public function paginated(User $user, int $page = 1, int $perPage = 20): LengthAwarePaginator;
    public function recent(User $user, int $limit = 5): array;
    public function unreadCount(User $user): int;
    public function markAsRead(User $user, string $notificationId): bool;
    public function markAllAsRead(User $user): void;
    public function delete(User $user, string $notificationId): bool;
    public function clearAll(User $user): void;
    
    // DB-optimized entity operations (O(1) memory, zero full-table load)
    public function markEntityNotificationsAsRead(User $user, string $entityColumn, int $entityId, ?string $dataType = null): void;
    public function removeEntityNotifications(string $entityColumn, int $entityId, array $types = []): void;
    
    // Cache clearing
    public function clearUserCache(User $user): void;
    public function clearCacheForUserId(int $userId): void;
}
```

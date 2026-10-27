# Implementation Plan: Full Engineering Audit & Remediation

## Goal Description

Execute a surgical, phased remediation across the entire Family Home Laravel Web platform (`mohamedalgepry/family-home-laravel-wab`), resolving all 26 identified findings from the Phase 0 Engineering Audit. This plan covers asynchronous email queueing, transactional integrity, CSV export correctness and injection defense, notification cache isolation, memory-efficient JSON querying, role authorization, responsive mobile inbox UX, root file hygiene, and comprehensive regression testing.

---

## User Review Required

> [!IMPORTANT]
> - **Asynchronous Notifications**: Adding `ShouldQueue` to `NewMessageNotification` and the 9 listing notification classes requires a running queue worker (`php artisan queue:work` via Supervisor or cron-based daemon) in production. In testing, the `sync` queue driver will process them synchronously.
> - **CSV Export Formatting**: Cell values starting with `=`, `+`, `-`, `@`, `\t`, or `\r` will now be prefixed with a single quote (`'`). This prevents formula execution in Excel/Calc while preserving phone numbers (e.g. `+2010...` will display safely).
> - **Notification Pagination Cache**: Notification caching will now use page-specific keys (`user_{id}_notifications_page_{page}`) so users navigating past page 1 receive accurate pages.
> - **Root Script Migration**: `clean_orphaned_images.php` in the project root will be migrated to an Artisan command (`app:clean-orphaned-images`), and root debug test scripts (`test_ai.php`, `test_db.php`, `test_unit.php`) will be safely removed.

> [!WARNING]
> - **Database Queue `after_commit`**: Setting `'after_commit' => true` in `config/queue.php` ensures queued jobs are dispatched only after enclosing database transactions commit. Any code that previously relied on uncommitted dirty reads in queued jobs will now run cleanly post-commit.

---

## Constitution & Architectural Gates

| Gate | Requirement | Compliance Status |
|------|-------------|-------------------|
| **Zero Disruptive Migrations** | No `migrate:fresh` or destructive column drops. | PASS — All database updates are additive or code/query-level. |
| **Atomic Boundary** | Critical state changes and notification dispatches must be transactional. | PASS — `CreateMessageAction` wrapped in `DB::transaction()`. |
| **Zero Memory Spikes** | Queries on tables with >1000 records must never use unbounded `->get()`. | PASS — `NotificationService` converted to MySQL JSON path queries. |
| **Mobile-First Accessibility** | Admin interfaces must function without horizontal scroll down to 375px. | PASS — Dual-mode card/table layout implemented for messages inbox. |
| **Strict Authorization** | All mutations and sensitive queries must pass Laravel Policy checks. | PASS — Policies applied consistently across controllers. |

---

## Phased Implementation Tasks

### Phase 1: Critical Correctness & Security Fixes (Priority: CRITICAL)

#### 1. [MODIFY] [NewMessageNotification.php](file:///d:/New-family/app/Domain/Users/Notifications/NewMessageNotification.php) (C-001)
- Add `use Illuminate\Contracts\Queue\ShouldQueue;`
- Update class declaration: `class NewMessageNotification extends Notification implements ShouldQueue`
- Add queue properties:
  - `public int $tries = 3;`
  - `public array $backoff = [10, 30, 60];`
  - `public int $timeout = 30;`

#### 2. [MODIFY] [CreateMessageAction.php](file:///d:/New-family/app/Domain/Listings/Actions/CreateMessageAction.php) (C-002)
- Wrap creation and notification dispatch inside `DB::transaction(function () use ($data) { ... })`.
- Ensure message is committed before queued notification is triggered.

#### 3. [MODIFY] [queue.php](file:///d:/New-family/config/queue.php) (C-002, M-009)
- In `connections.database`: set `'after_commit' => true`.

#### 4. [MODIFY] [Admin/MessageController.php](file:///d:/New-family/app/Http/Controllers/Admin/MessageController.php) (C-003, H-006, H-008)
- In `export()`:
  - Replace `$msg->name` with `$msg->client_name`.
  - Replace `$msg->phone` with `$msg->client_phone`.
  - Replace `$msg->email` with `$msg->client_email`.
  - Add CSV formula injection sanitization prefixing dangerous characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with `'`.
- In `unreadCount()`:
  - In the `catch (\Throwable $e)` block: add `Log::error('Failed to fetch unread message count', ['error' => $e->getMessage()]);` before returning `{count: 0}`.

#### 5. [MODIFY] [NotificationService.php](file:///d:/New-family/app/Domain/Users/Services/NotificationService.php) (C-004)
- In `paginated(User $user)`:
  - Resolve current page from request (`request('page', 1)`).
  - Use cache key: `"user_{$user->id}_notifications_page_{$page}"`.
  - Set TTL to 60 seconds.
- In `clearCacheForUserId(int $userId)`:
  - Ensure all page keys or a user cache version token are cleared.

---

### Phase 2: Messages & Notifications System Hardening (Priority: HIGH)

#### 6. [MODIFY] [NotificationService.php](file:///d:/New-family/app/Domain/Users/Services/NotificationService.php) (H-001, H-002, H-003)
- In `removeEntityNotifications(string $entityColumn, int $entityId, array $types = [])`:
  - Replace `$query->get()->filter(...)` with direct SQL JSON query:
    `$query->where("data->{$entityColumn}", $entityId)`.
  - Fetch only affected user IDs: `$userIds = $query->clone()->pluck('notifiable_id')->unique();`
  - Execute database-level deletion: `$query->delete();`
  - Clear user cache for affected user IDs without loading models into memory.
- In `markEntityNotificationsAsRead(User $user, string $entityColumn, int $entityId, ?string $dataType = null)`:
  - Replace `$user->unreadNotifications()->get()->filter(...)` with database update:
    ```php
    $query = $user->unreadNotifications()->where("data->{$entityColumn}", $entityId);
    if ($dataType !== null) {
        $query->where('data->type', $dataType);
    }
    $query->update(['read_at' => now()]);
    $this->clearUserCache($user);
    ```

#### 7. [MODIFY] Listing Notifications (H-004)
Add `implements ShouldQueue` and retry properties (`$tries = 3`, `$backoff = [10, 30, 60]`, `$timeout = 30`) to all 9 notification classes under [app/Domain/Listings/Notifications/](file:///d:/New-family/app/Domain/Listings/Notifications/):
- `UnitCreatedNotification.php`
- `UnitStatusChangedNotification.php`
- `UnitPriceChangedNotification.php`
- `UnitAssignmentNotification.php`
- `UnitFeaturedNotification.php`
- `ProjectCreatedNotification.php`
- `ProjectStatusChangedNotification.php`
- `ArticleCreatedNotification.php`
- `ArticlePublishedNotification.php`

---

### Phase 3: Caching Correctness & Invalidation (Priority: HIGH)

#### 8. [MODIFY] [ListingService.php](file:///d:/New-family/app/Domain/Listings/Services/ListingService.php) (H-005)
- In `clearAllCache()` or version increment logic:
  - Wrap version counter increment in `Cache::lock('listing_cache_version_lock', 5)->get(function () { ... })` to prevent cache stampede / race condition.

#### 9. [MODIFY] [HandleInertiaRequests.php](file:///d:/New-family/app/Http/Middleware/HandleInertiaRequests.php) (M-005, M-008)
- In SEO pages caching: add cache tag or invalidate `seo_pages_cache` in `PageSeoObserver` or controller update actions.
- In `share()` auth user profile resolution: replace separate `$user->profile` query with `$user->loadMissing('profile')` to eliminate N+1 query.

#### 10. [MODIFY] [Unit.php](file:///d:/New-family/app/Domain/Listings/Models/Unit.php) (M-006)
- In `booted()` callback: register `saved` and `deleted` listeners to clear `"unit_{$unit->id}_primary_thumb"` and `"unit_{$unit->id}_agent_name"`.

---

### Phase 4: Frontend UX & Mobile Messages Inbox (Priority: MEDIUM)

#### 11. [MODIFY] [Messages/Index.jsx](file:///d:/New-family/resources/js/Pages/Admin/Messages/Index.jsx) (M-001, M-002, M-003, M-004, M-007)
- **Responsive Dual-Mode Layout (M-001)**:
  - Render card-based list on mobile viewports (`block md:hidden`).
  - Render table on tablet/desktop viewports (`hidden md:table`).
- **Pagination Integration (M-002)**:
  - Import `<Pagination links={messages.links} />` component.
  - Render pagination links below the messages list.
- **Filter Loading Feedback (M-003)**:
  - Add `const [isFiltering, setIsFiltering] = useState(false)` state.
  - Set `isFiltering` during `applyFilters()` with `onBefore` and `onFinish` callbacks.
  - Render loading spinner / disabled state on search button.
- **Accessible Modal (M-004)**:
  - Add `onKeyDown` listener for `Escape` key to close detail modal.
  - Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.
- **Visibility-Aware Polling (M-007)**:
  - In `useEffect` polling interval: check `document.visibilityState === 'visible'` before calling `router.reload()`.

---

### Phase 5: Security Hardening & Root Hygiene (Priority: MEDIUM)

#### 12. [MODIFY] [NotificationController.php](file:///d:/New-family/app/Http/Controllers/Admin/NotificationController.php) (H-007)
- Standardize authorization on `NotificationPolicy` and ensure all endpoints verify ownership of the notification.

#### 13. [MODIFY] [web.php](file:///d:/New-family/routes/web.php) (M-010)
- Add `throttle:60,1` middleware to admin message action routes (`markReplied`, `delete`, `export`).

#### 14. [NEW] [CleanOrphanedImagesCommand.php](file:///d:/New-family/app/Console/Commands/CleanOrphanedImagesCommand.php) (L-002)
- Create Artisan command `app:clean-orphaned-images` migrating logic from root `clean_orphaned_images.php`.
- Remove `clean_orphaned_images.php` from project root.

#### 15. [DELETE / CLEANUP] Root Debug Scripts (L-003, L-004)
- Remove `test_ai.php`, `test_db.php`, `test_unit.php` from project root.
- Ensure `.env.production` is included in `.gitignore`.

---

### Phase 6: Observability & Automated Testing (Priority: MEDIUM)

#### 16. [NEW] Feature & Unit Tests (L-001, L-005, L-006)
- `tests/Feature/Messages/MessageLifecycleTest.php`:
  - Test public message creation → DB transaction → queue dispatch.
  - Test CSV export with formula injection escaping.
  - Test agent authorization and IDOR protection.
- `tests/Feature/Notifications/NotificationServiceTest.php`:
  - Test page-aware cache isolation (`page=1` vs `page=2`).
  - Test `removeEntityNotifications` executes DB-level deletion with O(1) memory.
  - Test cache invalidation upon mark as read/delete.
- `tests/Feature/Admin/MessagesResponsiveUiTest.php`:
  - Verify pagination and mobile components structure.

---

## Verification & Completion Criteria

1. **All 4 Critical findings (C-001 to C-004) resolved and verified.**
2. **All 8 High findings (H-001 to H-008) resolved and verified.**
3. **All 10 Medium findings (M-001 to M-010) resolved and verified.**
4. **All 6 Low findings (L-001 to L-006) resolved and verified.**
5. `php artisan test` runs with 100% passing tests.
6. `npm run build` succeeds cleanly with zero bundle errors.
7. End-to-end verification confirms responsive mobile messages inbox down to 375px.

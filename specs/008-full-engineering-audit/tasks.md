# Tasks: Full Engineering Audit & Remediation

## Feature
**Full Engineering Audit & Remediation** — Comprehensive, surgical remediation across the Family Home Laravel Web application resolving all 26 findings from the Phase 0 audit: asynchronous queueing, transactional integrity, CSV export correctness and injection defense, notification page-aware caching, memory-efficient JSON queries, role-based authorization, responsive mobile messages inbox, root script hygiene, and regression testing.

---

## Dependencies & Phase Execution Flow

```
Phase 1 (Setup) 
       │
       ▼
Phase 2 (Foundational: Queue & Transactions)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
Phase 3 (US1: Inquiries)   Phase 4 (US2: Messages UX)   Phase 5 (US3: CSV Export)
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 │
                                 ▼
                    Phase 6 (US4: Notifications)
                                 │
                                 ▼
                    Phase 7 (US5: Perf & Hygiene)
                                 │
                                 ▼
                    Phase 8 (Verification Suite)
```

- **Phase 1 (Setup)**: Pre-requisite for all phases.
- **Phase 2 (Foundational)**: Prerequisite for User Story 1, 2, and 4.
- **Phase 3 (US1), Phase 4 (US2), Phase 5 (US3)** can be executed in parallel or sequentially once Phase 2 is complete.
- **Phase 6 (US4)** builds upon the foundational queue and cache setup.
- **Phase 7 (US5)** addresses cross-cutting performance, logging, and root file hygiene.
- **Phase 8 (Verification)** requires all prior phases to be completed.

---

## Parallel Execution Opportunities

- **T005 & T007** (US1 notification queueing and test creation) can run in parallel with **T008 & T009** (US2 message controller queries and authorization).
- **T017 & T018** (US3 CSV mapping and injection defense) are self-contained in `MessageController.php`.
- **T023 & T024** (US4 listing notifications queueing and Unit observer) can run in parallel with **T020–T022** (NotificationService JSON refactoring).
- **T026, T027, T028, T029, T030, T031** (US5 cross-cutting performance and cleanup tasks) touch distinct files and can run in parallel.

---

## Phase 1: Setup & Environment Validation

- [X] T001 Verify database connection, queue driver configuration (`database`), and cache driver in `d:\New-family\.env` and `d:\New-family\config\queue.php`
- [X] T002 Verify git branch is clean on `main` and test suite is baseline functional via `php artisan test`

---

## Phase 2: Foundational Infrastructure & Transactions

- [X] T003 Set `'after_commit' => true` on the database queue connection in `d:\New-family\config\queue.php`
- [X] T004 Implement atomic transaction wrapper inside `execute()` in `d:\New-family\app\Domain\Listings\Actions\CreateMessageAction.php`

---

## Phase 3: User Story 1 (P1) — Public Message Submission & Asynchronous Queueing

**Goal:** Visitor inquiries are persisted atomically to MySQL; notification and email delivery are queued asynchronously via database worker without blocking the HTTP request cycle.

**Independent Test Criteria:**
1. Submitting a contact message creates a record in `messages` table with `status = 'pending'`.
2. HTTP response returns in < 200ms without waiting for SMTP communication.
3. Notification record is created in `notifications` table for the target agent or admin.
4. An email job is queued with 3 retries and exponential backoff.
5. If SMTP fails, the message in the database is not rolled back or lost.

**Tasks:**
- [X] T005 [P] [US1] Add `implements ShouldQueue` interface, `$tries = 3`, `$backoff = [10, 30, 60]`, and `$timeout = 30` to `d:\New-family\app\Domain\Users\Notifications\NewMessageNotification.php`
- [X] T006 [US1] Refactor `d:\New-family\app\Domain\Listings\Actions\CreateMessageAction.php` to handle general inquiries (`unit_id = null`) with admin fallback recipient and dispatch queued notification
- [X] T007 [P] [US1] Create automated regression feature test for message persistence and async notification dispatch in `d:\New-family\tests\Feature\Messages\MessageCreationTest.php`

---

## Phase 4: User Story 2 (P1) — Admin Message Management, Filtering & Mobile UX

**Goal:** Administrators and agents manage incoming inquiries across mobile and desktop devices with card-based mobile layout, pagination controls, filter preservation, accessible modal, role scoping, and idle-aware polling.

**Independent Test Criteria:**
1. Mobile viewports (width <= 768px) render a card-based inbox list without horizontal overflow or table clipping.
2. Desktop viewports (width >= 1024px) render the structured table.
3. Pagination links render below the list and allow navigating to page 2+ while preserving active `status` and `agent_id` filters.
4. Clicking "Search" displays a loading state on the button during processing.
5. Message detail modal can be dismissed with the `Escape` key and includes ARIA dialog attributes.
6. 30s background polling pauses when `document.visibilityState === 'hidden'`.
7. Agents can only access and mark messages assigned to them (IDOR prevention).

**Tasks:**
- [X] T008 [P] [US2] Update `d:\New-family\app\Http\Controllers\Admin\MessageController.php` index query to support general contact messages (`unit_id = null`) and preserve query parameters during pagination
- [X] T009 [P] [US2] Implement role-based authorization check using `MessagePolicy` for viewing, replying, and deleting messages in `d:\New-family\app\Http\Controllers\Admin\MessageController.php`
- [X] T010 [US2] Add responsive card-based mobile inbox layout (`block md:hidden`) alongside desktop table layout (`hidden md:table`) in `d:\New-family\resources\js\Pages\Admin\Messages\Index.jsx`
- [X] T011 [US2] Integrate `<Pagination>` component rendering `messages.links` in `d:\New-family\resources\js\Pages\Admin\Messages\Index.jsx`
- [X] T012 [US2] Add search button loading state (`isFiltering`) with Inertia `onBefore` and `onFinish` callbacks in `d:\New-family\resources\js\Pages\Admin\Messages\Index.jsx`
- [X] T013 [US2] Enhance message detail modal with `Escape` key dismiss listener, focus management, and ARIA attributes (`role="dialog"`, `aria-modal="true"`) in `d:\New-family\resources\js\Pages\Admin\Messages\Index.jsx`
- [X] T014 [US2] Update 30s auto-refresh polling in `d:\New-family\resources\js\Pages\Admin\Messages\Index.jsx` to check `document.visibilityState === 'visible'` before reloading
- [X] T015 [P] [US2] Add rate limiting middleware (`throttle:60,1`) to admin message action routes in `d:\New-family\routes\web.php`
- [X] T016 [P] [US2] Create feature test for message filtering, pagination, and policy authorization in `d:\New-family\tests\Feature\Admin\MessageManagementTest.php`

---

## Phase 5: User Story 3 (P1) — Message CSV Export & Formula Injection Defense

**Goal:** Export inquiries to an RFC 4180-compliant CSV file with correct database column mappings (`client_name`, `client_phone`, `client_email`) and full formula injection defense.

**Independent Test Criteria:**
1. Exported CSV contains actual client names, phone numbers, and email addresses (zero null values due to field mismatch).
2. Any cell starting with `=`, `+`, `-`, `@`, `\t`, or `\r` is escaped with a single quote prefix (`'`).
3. UTF-8 BOM (`\xEF\xBB\xBF`) is present at the start of the file for seamless Arabic text rendering in Microsoft Excel.

**Tasks:**
- [X] T017 [US3] Fix column mapping in `d:\New-family\app\Http\Controllers\Admin\MessageController.php` replacing `$msg->name`, `$msg->phone`, `$msg->email` with `$msg->client_name`, `$msg->client_phone`, `$msg->client_email`
- [X] T018 [US3] Implement CSV formula injection sanitizer prefixing cells starting with `=`, `+`, `-`, `@`, `\t`, `\r` with `'` in `d:\New-family\app\Http\Controllers\Admin\MessageController.php`
- [X] T019 [P] [US3] Create feature test verifying CSV export headers, populated fields, and formula injection escaping in `d:\New-family\tests\Feature\Admin\MessageExportTest.php`

---

## Phase 6: User Story 4 (P1) — Notification Caching, Queueing & O(1) Memory Entity Management

**Goal:** Notification page caching is strictly page-isolated (`page=1` vs `page=2`); entity notification cleanup operations execute at the database level with O(1) memory; all 9 listing notifications implement `ShouldQueue`.

**Independent Test Criteria:**
1. Navigating to `/admin/notifications?page=2` returns page 2 notifications from cache/database, never page 1.
2. Calling `removeEntityNotifications()` or `markEntityNotificationsAsRead()` executes SQL queries with `where('data->unit_id', ...)` and does not load thousands of records into PHP memory.
3. Listing notifications (`UnitCreatedNotification`, etc.) implement `ShouldQueue` with retry configuration.
4. Updating or deleting a Unit clears cached thumbnails (`"unit_{$id}_primary_thumb"`) and agent name (`"unit_{$id}_agent_name"`).

**Tasks:**
- [X] T020 [US4] Update notification pagination cache key to `user_{id}_notifications_page_{page}` and update user cache invalidation in `d:\New-family\app\Domain\Users\Services\NotificationService.php`
- [X] T021 [US4] Refactor `removeEntityNotifications()` to use MySQL JSON query `$query->where("data->{$entityColumn}", $entityId)->delete()` and clear cache for affected users in `d:\New-family\app\Domain\Users\Services\NotificationService.php`
- [X] T022 [US4] Refactor `markEntityNotificationsAsRead()` to use database update on JSON path with O(1) memory in `d:\New-family\app\Domain\Users\Services\NotificationService.php`
- [X] T023 [P] [US4] Add `implements ShouldQueue` and queue retry/timeout configuration to all 9 listing notifications in `d:\New-family\app\Domain\Listings\Notifications/`
- [X] T024 [P] [US4] Register model observers on `d:\New-family\app\Domain\Listings\Models\Unit.php` to invalidate `"unit_{$id}_primary_thumb"` and `"unit_{$id}_agent_name"` caches on save and delete
- [X] T025 [P] [US4] Create automated feature test for notification caching, page isolation, and JSON entity cleanup in `d:\New-family\tests\Feature\Notifications\NotificationServiceOptimizationTest.php`

---

## Phase 7: User Story 5 (P2) — Performance, Security Hardening & Root Hygiene

**Goal:** Eliminate cache stampede risks on listing version increments; prevent N+1 queries in middleware; clean up exposed root debug scripts; log exceptions in admin endpoints.

**Independent Test Criteria:**
1. Incrementing listing cache version uses `Cache::lock` to serialize concurrent requests.
2. `HandleInertiaRequests` uses `loadMissing('profile')`, preventing redundant queries.
3. Updating SEO pages invalidates `seo_pages_cache`.
4. `clean_orphaned_images.php` is replaced by `php artisan app:clean-orphaned-images`.
5. Debug test scripts (`test_ai.php`, `test_db.php`, `test_unit.php`) are removed from the project root.
6. `.env.production` is excluded from version control via `.gitignore`.

**Tasks:**
- [X] T026 [P] [US5] Implement atomic lock (`Cache::lock`) around listing cache version counter increment in `d:\New-family\app\Domain\Listings\Services\ListingService.php`
- [X] T027 [P] [US5] Add cache invalidation for `seo_pages_cache` upon `PageSeo` model updates in `d:\New-family\app\Http\Middleware\HandleInertiaRequests.php` and relevant controllers
- [X] T028 [P] [US5] Eliminate N+1 profile query in `d:\New-family\app\Http\Middleware\HandleInertiaRequests.php` using `$user->loadMissing('profile')`
- [X] T029 [P] [US5] Add structured exception logging in `d:\New-family\app\Http\Controllers\Admin\MessageController.php` for `unreadCount()`
- [X] T030 [US5] Create Artisan command `app:clean-orphaned-images` in `d:\New-family\app\Console\Commands\CleanOrphanedImagesCommand.php` and remove root `d:\New-family\clean_orphaned_images.php`
- [X] T031 [P] [US5] Remove temporary debug scripts `test_ai.php`, `test_db.php`, `test_unit.php` from `d:\New-family\` and verify `.gitignore` ignores `.env.production`

---

## Phase 8: Polish & Full Verification Suite

**Goal:** Verify zero regressions across the entire platform, confirm all unit/feature tests pass, and validate production asset builds.

**Tasks:**
- [X] T032 Run complete PHP test suite `php artisan test` and verify 100% pass rate
- [X] T033 Run production asset compilation `npm run build` and verify zero errors
- [X] T034 Run cache warmup and route verification: `php artisan optimize:clear && php artisan config:cache && php artisan route:cache`

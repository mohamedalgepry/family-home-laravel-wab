# Quickstart Validation Guide: Full Engineering Audit & Remediation

## Prerequisites

- **PHP**: 8.2+ with CLI, `pdo_mysql`, `curl`, and `mbstring` extensions
- **Node.js**: 20+ with `npm`
- **Database**: MySQL 8.0+ running with schema migrated
- **Workspace Root**: `d:\New-family`

---

## 1. Setup & Environment Verification

```bash
# Verify PHP and Composer dependencies
php -v
composer --version

# Clear and warm framework caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache

# Verify queue driver configuration
php artisan tinker --execute="echo config('queue.default') . ' | after_commit: ' . (config('queue.connections.database.after_commit') ? 'true' : 'false');"
```

---

## 2. Validation Scenarios

### Scenario 1: Messages Creation & Asynchronous Queueing (C-001, C-002)

**Goal:** Verify message persists atomically and notification runs via queue worker without blocking HTTP response.

```bash
# Run unit & feature tests for message flow
php artisan test --filter=MessageTest

# Verify NewMessageNotification implements ShouldQueue
php artisan tinker --execute="echo is_subclass_of(\App\Domain\Users\Notifications\NewMessageNotification::class, \Illuminate\Contracts\Queue\ShouldQueue::class) ? 'IMPLEMENTED' : 'FAIL';"
# Expected: IMPLEMENTED

# Verify queue worker picks up the job
php artisan queue:work --once --tries=3
```

---

### Scenario 2: CSV Export Field Verification & Injection Defense (C-003, H-006)

**Goal:** Verify exported CSV contains client names/phones/emails instead of nulls, and dangerous formula prefixes are escaped.

```bash
# Seed a message with formula-like content
php artisan tinker --execute="
\$m = \App\Domain\Users\Models\Message::create([
    'client_name' => '=HYPERLINK(\"http://evil.com\")',
    'client_phone' => '+201012345678',
    'client_email' => 'test@example.com',
    'content' => 'Formula test',
    'status' => 'pending'
]);
echo 'Created message ID: ' . \$m->id;
"

# Run CSV export test
php artisan test --filter=MessageExportTest
```
*Expected Result:*
- The exported CSV column for Name starts with `'=HYPERLINK` (escaped with single quote).
- Phone column is `'+201012345678`.
- Client name, phone, and email are populated.

---

### Scenario 3: Notification Pagination Cache Isolation (C-004)

**Goal:** Verify page 1 and page 2 of notifications return distinct data and do not overwrite each other in cache.

```bash
# Test notification caching service
php artisan test --filter=NotificationServiceTest
```
*Manual verification:*
1. Log in as an Admin/Agent with >25 notifications.
2. Navigate to `/admin/notifications?page=1`. Inspect records.
3. Navigate to `/admin/notifications?page=2`. Verify records match page 2 from DB.

---

### Scenario 4: High-Efficiency Entity Notification Deletion (H-001, H-002)

**Goal:** Verify `removeEntityNotifications` and `markEntityNotificationsAsRead` do not load entire table into PHP memory.

```bash
# Run memory profile and functionality test
php artisan test --filter=NotificationEntityMemoryTest
```

---

### Scenario 5: Mobile UX & Messages Pagination (M-001, M-002, M-004)

**Goal:** Verify messages inbox renders responsive cards on mobile, pagination controls function, and modal is keyboard accessible.

```bash
# Build frontend assets
npm run build

# Run Playwright E2E UI verification
npx playwright test e2e/messages-mobile.spec.js
```
*Checkpoints:*
- Viewport width 375px: Card list rendered, no horizontal overflow.
- Viewport width 1280px: Table rendered with desktop columns.
- Pressing `Escape` key closes message detail modal.
- Pagination links navigate across pages while preserving `?status=pending` filter.

---

## 3. Regression Suite Execution

Run complete suite to ensure zero regressions:

```bash
# Backend unit & feature tests
php artisan test

# Frontend production build
npm run build
```

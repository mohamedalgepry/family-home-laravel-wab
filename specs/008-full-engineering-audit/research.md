# Research Findings: Full Engineering Audit & Remediation

## Overview

This document consolidates the technical research, root-cause investigations, architectural choices, and trade-off analyses conducted during Phase 0 of the Full Engineering Audit for the **Family Home Laravel Web** application (`mohamedalgepry/family-home-laravel-wab`).

---

## 1. Core Architecture Decisions

### 1.1 Asynchronous Notification & Mail Queueing

| Dimension | Details |
|-----------|---------|
| **Problem** | `NewMessageNotification` and 9 listing-domain notifications use the `Queueable` trait but omit `implements ShouldQueue`. SMTP transmission occurs synchronously within the user-facing HTTP request cycle. Slow or failing SMTP calls cause request timeouts, 500 errors, and broken contact forms. |
| **Decision** | Explicitly add `implements ShouldQueue` to `NewMessageNotification` and all listing notification classes (`UnitCreatedNotification`, `UnitStatusChangedNotification`, `UnitPriceChangedNotification`, `UnitAssignmentNotification`, `ProjectCreatedNotification`, `ProjectStatusChangedNotification`, `ArticleCreatedNotification`, `ArticlePublishedNotification`). Configure retry policies: `$tries = 3`, `$backoff = [10, 30, 60]`, `$timeout = 30`. |
| **Rationale** | Queueing decouples external network I/O from the HTTP request. Visitor gets instant 200 response upon message submission. If SMTP is temporarily down, the database worker retries automatically without losing notifications. |
| **Alternatives Considered** | 1. *Synchronous mail with try/catch*: Catches SMTP error, but HTTP response still experiences high latency (2-5s per submit). Rejected.<br>2. *Custom queued Job wrapping notification*: Unnecessary boilerplate; Laravel's native Notification system already provides queue integration when implementing `ShouldQueue`. |

---

### 1.2 Atomic Transactionality & Queue `after_commit`

| Dimension | Details |
|-----------|---------|
| **Problem** | In `CreateMessageAction`, `Message::create()` is executed outside of a database transaction. If notification dispatch throws an exception, no rollback occurs. Furthermore, in `config/queue.php`, the database queue connection has `'after_commit' => false`, allowing queue workers to pick up jobs before the originating database transaction commits. |
| **Decision** | 1. Wrap message creation and notification dispatch inside `DB::transaction()`.<br>2. Set `'after_commit' => true` in `config/queue.php` for database and default connections.<br>3. Ensure notification dispatch is either invoked `afterCommit` or the transaction commits before queued jobs are pushed. |
| **Rationale** | Guarantees data consistency: a message record cannot exist without its intended state, and a worker job will never read a non-existent or uncommitted row (preventing `ModelNotFoundException` in worker). |
| **Alternatives Considered** | *Dispatching notifications via Model Observers*: Harder to trace and test; explicit domain action orchestration is cleaner and adheres to the project's Domain-Driven design. |

---

### 1.3 CSV Export Correctness & Injection Immunity

| Dimension | Details |
|-----------|---------|
| **Problem** | In `Admin/MessageController::export()`, code references `$msg->name`, `$msg->phone`, and `$msg->email`, while the Eloquent model and migration define `client_name`, `client_phone`, and `client_email`. The export generates null values. Furthermore, unescaped client input starting with `=`, `+`, `-`, or `@` triggers formula injection in spreadsheet software. |
| **Decision** | 1. Update export mappings to `$msg->client_name`, `$msg->client_phone`, `$msg->client_email`.<br>2. Sanitize every string cell: prefix values starting with `=`, `+`, `-`, `@`, `\t`, `\r` with a single quote (`'`).<br>3. Add streaming response headers (`Content-Type: text/csv; charset=UTF-8`, `Content-Disposition: attachment; filename=messages-export-...`). |
| **Rationale** | Ensures 100% data fidelity between database and export files, while fully mitigating OWASP CSV Injection vulnerabilities without corrupting valid international phone numbers (e.g. `+2010...`). |
| **Alternatives Considered** | *Stripping prefix characters*: Would mutate real phone numbers or legitimate notes. Prefixing with single quote is the spreadsheet-standard text escaping mechanism. |

---

### 1.4 Notification Caching & Page Invalidation Strategy

| Dimension | Details |
|-----------|---------|
| **Problem** | `NotificationService` caches paginated notifications using static key `user_{id}_notifications_page`. Any user navigating to page 2 or beyond receives cached page 1 data. |
| **Decision** | 1. Change cache key to `user_{id}_notifications_page_{page}`.<br>2. Keep TTL short (60s).<br>3. Provide an invalidation helper `invalidateUserNotifications(int $userId)` that wipes `user_{id}_unread_count`, `user_{id}_recent_notifications`, and iterates/clears cached page keys or uses a user notification cache version counter (`user_{id}_notifications_v{version}`). |
| **Rationale** | Using a micro-version counter `user_{id}_notif_version` allows atomic invalidation of all user pages in a single cache increment without needing Redis tags on shared hosting. |
| **Alternatives Considered** | 1. *Cache::tags()*: Not supported on `database` or `file` cache drivers used on shared hosting.<br>2. *No caching for notifications index*: Viable, but retaining micro-versioning keeps load minimal while guaranteeing freshness. |

---

### 1.5 Database Memory Optimization: Notification Entity Management

| Dimension | Details |
|-----------|---------|
| **Problem** | `NotificationService::removeEntityNotifications()` and `markEntityNotificationsAsRead()` run `$query->get()` without limits, loading thousands of notification rows into PHP memory and filtering collections in PHP (`$notification->data['unit_id'] == $id`). This creates high OOM risk. |
| **Decision** | Replace PHP collection filtering with MySQL JSON queries at the database level:<br>`$query->where('data->unit_id', $unitId)->delete();` (or update for marking as read). For polymorphic entities, scope by `data->entity_type` and `data->entity_id`. |
| **Rationale** | Leverages MySQL 8+ native JSON path extraction (`->`), reducing query memory footprint from O(N) to O(1) and executing deletions in milliseconds. |
| **Alternatives Considered** | *Chunking*: `$query->chunk(100)` avoids OOM but still executes multiple round trips. Direct SQL `DELETE` / `UPDATE` with JSON path is 100x faster and atomic. |

---

### 1.6 Unified Role-Based Authorization & IDOR Elimination

| Dimension | Details |
|-----------|---------|
| **Problem** | Inconsistent authorization: some endpoints use `abort_unless()`, others use Policies, and some (such as global notification deletion) had no scope check. Potential IDOR existed where an agent could view/modify messages of another agent by manipulating URL parameters. |
| **Decision** | Enforce policy checks on all admin controllers:<br>1. `MessagePolicy`: `view`, `update`, `delete`, `reply` verified against role hierarchy (`admin` = any, `manager` = team agents, `agent` = assigned to self).<br>2. `NotificationPolicy`: Ensure users can only view, mark as read, or delete notifications where `notifiable_id === auth()->id()`.<br>3. Global removal (`removeEntityNotifications`) must be restricted to system actions or admin role. |
| **Rationale** | Centralizes authorization logic in standard Laravel Policy classes, eliminating controller duplication and preventing IDOR vulnerabilities. |
| **Alternatives Considered** | *Middleware-only checks*: Middleware handles route-level role access, but cannot inspect model-level ownership (e.g. `$message->agent_id`). Policies are the correct Laravel abstraction. |

---

### 1.7 Mobile UX & Responsive Messages Inbox

| Dimension | Details |
|-----------|---------|
| **Problem** | `resources/js/Pages/Admin/Messages/Index.jsx` renders an HTML table with fixed layout, causing horizontal scrolling and overflowing content on mobile screens (< 768px). Additionally, pagination links were omitted from the UI, modal had no Escape handler or focus trap, and filtering lacked loading state feedback. |
| **Decision** | 1. Implement responsive dual layout in `Messages/Index.jsx`: card-based inbox on mobile (`block md:hidden`), compact table on desktop (`hidden md:table`).<br>2. Integrate `<Pagination links={messages.links} />`.<br>3. Add `processing` / `isFiltering` indicator during search submissions with `preserveState: true`.<br>4. Implement accessible modal: `role="dialog"`, `aria-modal="true"`, Escape key dismissal, and backdrop click handler. |
| **Rationale** | Provides a native-like mobile experience for agents managing inquiries on smartphones, while keeping high-density productivity for desktop administrators. |
| **Alternatives Considered** | *Horizontal CSS scrolling table*: Tested on mobile; truncated previews and required extensive horizontal swiping. Card inbox provides vastly superior usability. |

---

### 1.8 Root Security & Hygiene Cleanup

| Dimension | Details |
|-----------|---------|
| **Problem** | Ad-hoc PHP scripts (`clean_orphaned_images.php`, `test_ai.php`, `test_db.php`, `test_unit.php`) exist in the project root. If web server routing misconfiguration occurs, these scripts could be executed directly or expose environment secrets. |
| **Decision** | 1. Convert `clean_orphaned_images.php` into a managed Artisan command `app:clean-orphaned-images`.<br>2. Move test scripts into `scripts/dev/` or remove obsolete debug artifacts.<br>3. Verify `.gitignore` includes `.env.production` and sensitive local artifacts. |
| **Rationale** | Eliminates attack surfaces in public root while preserving maintenance tooling within Laravel's structured console subsystem. |
| **Alternatives Considered** | *Blocking via .htaccess only*: Defense-in-depth dictates moving files out of docroot entirely rather than relying solely on server rewrite rules. |

---

## 2. Risk Assessment & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Queue worker delays notification delivery | Low | Medium | Worker configured with `database` driver, supervisor/cron runner; priority queue for critical user messages. |
| MySQL JSON path syntax incompatibility | Low | High | Workspace runs MySQL 8.0+ which fully supports `->` and `JSON_EXTRACT`. Validated in database schema. |
| Breaking changes in CSV export consumers | Low | Low | Export header labels remain human-friendly (`ID`, `Client Name`, `Phone`, `Email`, `Unit`, `Agent`, `Status`, `Date`); fixed null columns restore intended output. |
| Mobile card inbox layout drift | Low | Medium | Uses shared Tailwind utility classes matching existing design tokens in `resources/css/app.css`. |

---

## 3. Technology Alignment

- **Framework**: Laravel 12.x / PHP 8.2+
- **Frontend**: React 19 / Inertia.js / Tailwind CSS v4
- **Persistence**: MySQL 8.0 with InnoDB
- **Queue/Cache**: Database driver with atomic transaction boundary
- **Domain Architecture**: Clean DDD layout under `app/Domain/`

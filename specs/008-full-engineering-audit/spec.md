# Feature Specification: Full Engineering Audit & Remediation

## Overview

**Feature Name:** Full Engineering Audit & Remediation  
**Short Name:** full-engineering-audit  
**Created:** 2026-10-27  
**Status:** Draft  
**Priority:** Critical

### Problem Statement

The Family Home Laravel Web application — a bilingual (Arabic/English) real estate platform — has accumulated technical debt, potential security vulnerabilities, caching correctness issues, UX gaps (especially on mobile), and data integrity risks across its Messages, Notifications, Caching, Database, and Frontend layers. A systematic, phased audit is required before any remediation begins.

### Target Users

| User Type | Description |
|-----------|-------------|
| Admin | Full platform access — manages all listings, messages, users, settings |
| Manager | Manages own agents and their listings/messages |
| Agent | Manages own listings and assigned messages |
| Public Visitor | Browses units, projects, articles; submits contact inquiries |

### Success Criteria

1. Zero Critical or High findings remaining after remediation
2. All message lifecycle operations (create → assign → notify → read → reply → export → delete) work correctly end-to-end
3. Cache isolation is verified — no user can receive another user's cached data
4. All admin endpoints enforce proper authentication AND authorization (no IDOR)
5. CSV export fields match database fields exactly — no mismatched or missing columns
6. Mobile UX for messages inbox passes usability review (no horizontal scroll, no overflow, no tiny buttons)
7. Email notifications are queued (not synchronous) and message persistence is decoupled from email delivery
8. All existing tests pass; new tests cover identified gaps
9. CI pipeline catches test failures, build failures, and lint errors before merge

---

## Functional Requirements

### FR-1: Messages System Correctness

**FR-1.1:** The message creation flow must atomically persist the message to the database before dispatching any notification or email.

**FR-1.2:** The CSV export must use `client_name`, `client_phone`, `client_email` field names consistently — matching the database columns `client_name`, `client_phone`, `client_email` (not `name`, `phone`, `email`).

**FR-1.3:** Messages with `unit_id = null` (general contact inquiries) must be fully supported in: listing, filtering, export, detail view, and deletion.

**FR-1.4:** Message pagination must preserve active filters (status, agent_id) across page navigation.

**FR-1.5:** The messages admin page must provide distinct mobile and desktop layouts — mobile uses a card/inbox list, desktop may use a table.

### FR-2: Notifications System Correctness

**FR-2.1:** Notification cache keys must include pagination parameters (page number) to prevent stale page results from being served.

**FR-2.2:** When a notification is created, read, or deleted, all related cache keys for the affected user must be invalidated.

**FR-2.3:** The `NewMessageNotification` must implement `ShouldQueue` to prevent email delivery from blocking the HTTP response.

**FR-2.4:** Email delivery failure must not cause the message to be lost — the message must already be committed to the database before the notification is dispatched.

### FR-3: Caching Correctness

**FR-3.1:** Every cache key that serves user-specific data must include the user ID in the key.

**FR-3.2:** Every cache key that serves paginated data must include the current page number in the key.

**FR-3.3:** Cache keys for filtered listing queries must include all active filter parameters (not just a subset).

**FR-3.4:** HTTP cache headers for admin/authenticated routes must include `private, no-store` to prevent shared caches from serving one user's data to another.

**FR-3.5:** Cache invalidation must occur after every write operation (create, update, delete) that affects cached data.

### FR-4: Security

**FR-4.1:** All admin endpoints must verify both authentication (user is logged in) and authorization (user has permission for the specific resource).

**FR-4.2:** No IDOR vulnerability — an agent must not be able to access, modify, or delete a message assigned to another agent by changing the URL ID.

**FR-4.3:** File upload validation must enforce type, size, and content checks before processing.

**FR-4.4:** CSV export must sanitize cell values to prevent CSV injection attacks (cells starting with `=`, `+`, `-`, `@`).

**FR-4.5:** Password reset tokens must be invalidated after use.

**FR-4.6:** Session must be regenerated after login to prevent session fixation.

### FR-5: Database Integrity & Performance

**FR-5.1:** All N+1 query patterns must be identified and resolved with eager loading.

**FR-5.2:** Indexes must exist for all columns used in WHERE, JOIN, and ORDER BY clauses on frequently queried tables (messages, units, projects, notifications).

**FR-5.3:** The `removeEntityNotifications` method must not load all notifications into memory — it must use database-level filtering.

**FR-5.4:** Unbounded queries (queries without pagination or limit) on large tables must be replaced with paginated or cursor-based approaches.

### FR-6: UX Completeness

**FR-6.1:** Every list page must have an empty state with a clear message when no records exist.

**FR-6.2:** Every destructive action (delete, bulk delete) must show a confirmation dialog before execution.

**FR-6.3:** Every form submission must show loading state during processing and prevent duplicate submissions.

**FR-6.4:** Every async operation (filter, page change, mark as replied) must show visual feedback.

**FR-6.5:** The messages detail modal must be accessible via keyboard (focus trap, Escape to close) and have proper ARIA attributes.

### FR-7: Email Architecture

**FR-7.1:** All notifications that send email must implement `ShouldQueue`.

**FR-7.2:** Queued email jobs must have explicit `tries`, `backoff`, and `timeout` values.

**FR-7.3:** Failed email delivery must not affect the persisted message or notification record.

### FR-8: CI/CD

**FR-8.1:** The CI pipeline must fail if any test fails.

**FR-8.2:** The CI pipeline must run the production build step and fail if it fails.

**FR-8.3:** CI must not expose secrets in logs or build artifacts.

---

## User Scenarios & Testing

### Scenario 1: Public User Submits a Contact Message

**Given** a visitor is on a unit detail page  
**When** they fill in name, phone, email, and message content, then submit  
**Then** the message is saved to the database with `status = 'pending'` and the assigned agent receives a database notification AND a queued email notification  
**And** the visitor sees a success flash message  
**And** if the email fails, the message is still persisted

### Scenario 2: Admin Views Messages Inbox on Mobile

**Given** an admin opens the messages page on a mobile device  
**When** the page loads  
**Then** they see a card-based inbox list (not a horizontal-scrolling table)  
**And** each card shows: sender name, preview, date, status, unit name  
**And** tapping a card opens the full message detail

### Scenario 3: Agent Filters Messages by Status

**Given** an agent is on the messages page with 50 messages  
**When** they select "Pending" from the status filter and click search  
**Then** only pending messages assigned to them are shown  
**And** pagination links preserve the "Pending" filter

### Scenario 4: Admin Exports Messages to CSV

**Given** an admin clicks "Export CSV" with a status filter active  
**When** the CSV is downloaded  
**Then** the CSV contains columns: ID, Name, Phone, Email, Unit, Agent, Status, Content, Created At, Replied At  
**And** the `Name` column uses `client_name` (not `name`)  
**And** cell values are sanitized against CSV injection

### Scenario 5: Cache Isolation Between Users

**Given** User A (admin) views the notifications page  
**And** User B (agent) views the notifications page  
**When** both pages are cached  
**Then** User A's cache key contains User A's ID and User B's cache key contains User B's ID  
**And** they never see each other's notifications

### Scenario 6: Notification After Message Creation

**Given** a message is created for a unit owned by Agent X  
**When** the message is saved  
**Then** Agent X receives a database notification with `type = 'new_message'`  
**And** Agent X receives a queued email (not synchronous)  
**And** the notification cache for Agent X is invalidated

---

## Key Entities

| Entity | Description |
|--------|-------------|
| Message | Client inquiry: `client_name`, `client_phone`, `client_email`, `content`, `unit_id?`, `agent_id?`, `status`, `replied_at` |
| User | Admin/Manager/Agent: `name`, `email`, `role`, `manager_id?`, `slug`, `points_balance` |
| Unit | Property listing: multilingual names/slugs, `is_active`, `user_id`, `type_id`, `area_id` |
| Project | Property project: multilingual, `is_active`, `user_id`, `area_id` |
| Notification | Laravel database notification: `notifiable_id`, `type`, `data` (JSON), `read_at` |
| Setting | Key-value site configuration with caching |

---

## Assumptions

1. The production database is MySQL, and migrations are already applied up to the latest state.
2. Queue worker uses the `database` driver on shared hosting (no Redis in production currently).
3. The project uses Laravel + Inertia.js + React with Tailwind CSS v4.
4. The codebase follows a Domain-Driven folder structure under `app/Domain/`.
5. Shared hosting limitations mean scheduled tasks use an hourly cron with atomic cache locks for idempotency.
6. No breaking changes to public API contracts or URL structures are permitted.
7. The application serves Egypt-focused real estate content in Arabic (primary) and English.

---

## Constraints

1. No framework migration or major architecture changes.
2. No new heavy dependencies without strong justification.
3. All fixes must be small, safe, tested, and reversible.
4. No destructive database migrations without a data preservation plan.
5. No `migrate:fresh` on production.
6. Existing passing tests must not be broken.

---

## Dependencies

- Laravel 12.x with Inertia.js and React 19
- Spatie Laravel Data (DTOs)
- Tailwind CSS v4 via Vite plugin
- MySQL 8+ database
- Database-backed queue, cache, and session drivers
- Shared hosting environment with cron-based scheduler

---

## Scope Boundaries

### In Scope

- Full codebase audit (Phase 0)
- Messages system end-to-end correctness
- Notifications system correctness and caching
- Cache key strategy and isolation
- HTTP cache header review
- Security audit (auth, authz, IDOR, XSS, CSRF, upload, CSV injection)
- Database performance (N+1, indexes, unbounded queries)
- UX audit (loading, empty, error states; mobile responsiveness)
- Email architecture (queue, retry, decoupling)
- CI/CD pipeline review
- Test coverage gaps

### Out of Scope

- Visual design redesign (colors, typography, branding)
- New feature development
- Framework upgrade or migration
- Third-party integrations beyond existing ones
- Payment processing (not present in current codebase)
- Mobile native app development

---

## Phased Execution Plan

| Phase | Focus | Priority |
|-------|-------|----------|
| 0 | Full Audit — produce findings report | CRITICAL |
| 1 | Critical correctness & security fixes | CRITICAL |
| 2 | Messages + Notifications system fixes | HIGH |
| 3 | Caching correctness & isolation | HIGH |
| 4 | Database & backend performance | HIGH |
| 5 | Frontend performance | MEDIUM |
| 6 | Mobile UX | MEDIUM |
| 7 | Accessibility | MEDIUM |
| 8 | Test coverage | MEDIUM |
| 9 | CI/CD hardening | LOW |
| 10 | Production verification | LOW |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Cache changes cause temporary data staleness | Implement version-based cache invalidation; test with fresh cache |
| Migration changes break existing data | Use non-destructive, additive migrations only; backup before running |
| Queue changes affect notification delivery | Test with `sync` driver in testing, `database` in staging |
| Mobile UX changes break desktop layout | Use responsive breakpoints; test both viewports |
| Security fixes break existing workflows | Add targeted tests for each security fix before deploying |

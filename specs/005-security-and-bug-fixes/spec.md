# Specification: Security Hardening & Confirmed Bug Fixes

## 1. Feature Description
This feature specification covers the surgical remediation of confirmed security vulnerabilities, business logic inconsistencies, and operational risks across the Family Home application (`family-home-laravel-wab`). It focuses on 10 isolated tasks (T1–T10) organized into 3 prioritized phases (Critical/High Security, Business Logic & Data Integrity, and Defense in Depth / Operational Documentation).

The Domain-Driven Design (DDD) structure, role-based access control, Spatie Data contracts, and existing password reset user flow (email response behavior) must remain intact.

---

## 2. User Scenarios & Testing

### 2.1 OTP Return Value & Flow (T1)
- **Given** a user requests a password reset or OTP verification
- **When** the authentication service processes the request
- **Then** `sendOtp()` and `forgotPassword()` send notifications internally and return a boolean status (`true`/`false`), never exposing the raw plaintext OTP string to callers or HTTP responses.
- **And** the existing password reset user-facing flow functions end-to-end without disruption.

### 2.2 Manager Team Unit Points Allocation (T3)
- **Given** a team Manager tries to adjust priority points for a unit belonging to an agent in their team
- **When** they submit the point adjustment request
- **Then** the request authorization passes (HTTP 200/Success) and policy checks allow the adjustment.
- **Given** a Manager tries to adjust points for a unit outside their team or an Agent attempts any adjustment
- **When** they submit the request
- **Then** the system strictly rejects the request with HTTP 403 (Forbidden).

### 2.3 Monthly Points Reset Audit Trail (T4)
- **Given** an admin triggers a monthly points reset or the scheduled `MonthlyResetJob` runs
- **When** managers' point balances are reset to their initial monthly allowances
- **Then** a corresponding `points_transactions` ledger entry with type `monthly_reset` is recorded for every affected manager, capturing exact amount and `balance_after` within a database transaction.

### 2.4 Scheduled Command Concurrency Protection (T5)
- **Given** the Laravel scheduler executes `points:daily-deduct`
- **When** the command is running
- **Then** overlapping execution is prevented (`withoutOverlapping()`) to eliminate race conditions and deadlocks.

### 2.5 Map Embed URL Validation (T6)
- **Given** an admin or manager creates or updates a unit/project with a `map_embed_url`
- **When** a non-Google URL or malicious host is provided (e.g. `https://evil.com/x`)
- **Then** `Sanitizer::isValidMapEmbed()` rejects or clears the input, preventing malicious URL persistence.
- **When** a valid Google Maps embed URL is provided
- **Then** it is normalized and saved correctly without visual breakage on the frontend.

### 2.6 Unit Model Mass Assignment Hardening (T7)
- **Given** a raw request attempts to pass sensitive fields (`is_active`, `is_pinned`, `is_deal`, `priority_points`, `user_id`) to a general Unit create/update endpoint
- **When** processed through model mass assignment
- **Then** these sensitive fields are excluded from `$fillable` and can only be mutated through explicit dedicated actions (`AllocatePointsAction`, `ToggleActiveAction`, etc.).

### 2.7 Rich Text Sanitization & Reverse Tabnabbing Protection (T8)
- **Given** rich content contains links with `target="_blank"`
- **When** the content is sanitized via `Sanitizer::rich()`
- **Then** `rel="noopener noreferrer"` is automatically enforced on all `target="_blank"` anchors.

### 2.8 CSP Reporting & Production Checklist (T2, T9, T10)
- **Given** the application runs in staging/production
- **When** CSP violations occur
- **Then** violation reports are captured without breaking existing Vite/Inertia scripts (`unsafe-inline` maintained while report URI is integrated).
- **And** comprehensive deployment and `.env` security configurations are documented in `DEPLOYMENT_CHECKLIST.md`.

---

## 3. Functional Requirements

### 3.1 Phase 1 — Critical / High Security
1. **T1 — OTP Plaintext Return Refactor**:
   - In `app/Domain/Users/Services/AuthService.php`, refactor `sendOtp()` and `forgotPassword()` return type signatures from `string` to `bool`.
   - Update callers (`app/Http/Controllers/Auth/LoginController.php::sendResetLink` and any related callers) to handle boolean returns.
   - Maintain the existing password reset email flow and messaging unchanged.
2. **T2 — Production Environment Security Documentation**:
   - Document mandatory production environment parameters in `DEPLOYMENT_CHECKLIST.md` and `README.md` (`APP_DEBUG=false`, `APP_ENV=production`, `SESSION_SECURE_COOKIE=true`, `SESSION_SAME_SITE=lax`, `LOG_LEVEL=error`, HTTPS enforcement).

### 3.2 Phase 2 — Business Logic & Data Integrity
3. **T3 — Unit Points Authorization Reconciliation**:
   - Align `app/Http/Requests/Admin/AdjustPointsRequest.php::authorize()` with `AllocatePointsPolicy::allocate()` allowing Admins and the Unit's owning Team Manager.
   - Eliminate redundant conflicting authorization checks in `app/Http/Controllers/Admin/UnitController.php::adjustPoints()`.
4. **T4 — Ledger Logging for Monthly Reset**:
   - In `app/Domain/Points/Services/PointsService.php::monthlyReset()`, create a `PointsTransaction` entry for each affected manager with `type = 'monthly_reset'`, `amount`, and `balance_after` inside the database transaction.
5. **T5 — Scheduler Overlap Protection**:
   - In `routes/console.php`, append `->withoutOverlapping()` and server protection to `Schedule::command('points:daily-deduct')`.
6. **T6 — Enforce Map Embed URL Domain Validation**:
   - In `app/Domain/Listings/Actions/CreateUnitAction.php`, `UpdateUnitAction.php`, and `HasMapEmbedRule.php`, validate `map_embed_url` using `Sanitizer::isValidMapEmbed()` before persistence, clearing or rejecting invalid/non-Google hosts.

### 3.3 Phase 3 — Defense in Depth & Operations
7. **T7 — Unit Model Fillable Hardening**:
   - Remove sensitive fields (`is_active`, `is_pinned`, `is_deal`, `priority_points`, `user_id`) from `Unit::$fillable` in `app/Domain/Listings/Models/Unit.php`.
   - Ensure all dedicated action classes explicitly update these fields where intended.
8. **T8 — Tabnabbing Protection in Rich Text Sanitizer**:
   - In `app/Domain/Common/Support/Sanitizer.php::rich()`, enforce `rel="noopener noreferrer"` whenever `target="_blank"` is present.
9. **T9 — Content Security Policy Reporting Channel**:
   - In `app/Http/Middleware/SecurityHeadersMiddleware.php`, add `report-uri` / `report-to` directives for monitoring without breaking existing inline scripts.
10. **T10 — Production Deployment Checklist**:
    - Create `DEPLOYMENT_CHECKLIST.md` detailing queue worker configuration, cron setup, storage symlinks, directory permissions, trusted proxies, and backup verification.

---

## 4. Success Criteria

1. **Zero Security Regression**: All 10 tasks executed cleanly with no degradation in existing functionalities (login, listing CRUD, points allocation, map rendering).
2. **100% Test Coverage for Fixed Behaviors**: Each behavioral task (T1, T3, T4, T5, T6, T7, T8) has automated unit or feature tests verifying positive and negative cases.
3. **Clean Code & Architecture**: All changes strictly follow DDD guidelines, existing code conventions, PHP type safety, and pass static analysis/linting.
4. **Preserved Auth Behavior**: The password reset user flow and user enumeration behavior remain identical to current baseline.

---

## 5. Assumptions

- Testing baseline can be captured using Pest/PHPUnit.
- The Hostinger deployment environment will follow the documented `DEPLOYMENT_CHECKLIST.md`.
- No breaking changes are introduced to public API / Inertia props.

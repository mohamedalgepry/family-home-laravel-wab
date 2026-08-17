# Implementation Plan: Security Hardening & Confirmed Bug Fixes

## Goal Description
Implement 10 surgical security, business logic, and operational fixes across the Family Home application without breaking existing functionality, preserving the DDD architecture, and retaining the current password reset user enumeration behavior.

## User Review Required
> [!IMPORTANT]
> - **Unit Model Fillable (T7)**: `user_id` and `is_active` (along with `is_pinned`, `is_deal`, `priority_points`) will be removed from `$fillable`. We will explicitly set these fields in `CreateUnitAction` and `UpdateUnitAction` to prevent mass assignment vulnerabilities.
> - **Monthly Reset Ledger (T4)**: A new `PointsTransaction` will be inserted for each manager during the monthly reset. The amount will be calculated as the difference between the new initial balance and the current balance.
> - **CSP Reporting (T9)**: We will add `report-uri /csp-report` and `report-to` directives to the Content Security Policy header.

## Proposed Changes

---
### Phase 1: Critical / High Security

#### [MODIFY] [AuthService.php](file:///d:/New-family/app/Domain/Users/Services/AuthService.php)
- **T1**: Change the return type of `sendOtp()` and `forgotPassword()` to `bool`.
- Return `true` on successful OTP generation and `false` if the user is not found.

#### [MODIFY] [LoginController.php](file:///d:/New-family/app/Http/Controllers/Auth/LoginController.php)
- **T1**: Update `sendResetLink()` to handle the boolean return from `sendOtp()` instead of a string.
- If `sendOtp()` returns `false`, throw the `ValidationException` (maintaining the existing behavior).

#### [NEW] [DEPLOYMENT_CHECKLIST.md](file:///d:/New-family/DEPLOYMENT_CHECKLIST.md)
- **T2 & T10**: Document mandatory production environment parameters (`APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`, etc.) and operational requirements (Cron setup, Queue Worker, trusted proxies, backups).

---
### Phase 2: Business Logic & Data Integrity

#### [MODIFY] [AdjustPointsRequest.php](file:///d:/New-family/app/Http/Requests/Admin/AdjustPointsRequest.php)
- **T3**: Change the `authorize()` method to use `$this->user()?->can('allocate-points', $this->route('unit'))` to match `AllocatePointsPolicy`.

#### [MODIFY] [PointsService.php](file:///d:/New-family/app/Domain/Points/Services/PointsService.php)
- **T4**: Update `monthlyReset()` to loop over managers (or use a chunked update) to insert `PointsTransaction` records for each affected manager with `type = 'monthly_reset'` and the calculated `amount` and `balance_after`.

#### [MODIFY] [console.php](file:///d:/New-family/routes/console.php)
- **T5**: Add `->withoutOverlapping()->onOneServer()` to the `Schedule::command('points:daily-deduct')` call.

#### [MODIFY] [CreateUnitAction.php](file:///d:/New-family/app/Domain/Listings/Actions/CreateUnitAction.php)
- **T6 & T7**: Enforce `Sanitizer::isValidMapEmbed()` for the `map_embed_url` field.
- **T7**: Explicitly set `$unit->user_id = $user->id` and `$unit->is_active` after removing them from `$fillable`.

#### [MODIFY] [UpdateUnitAction.php](file:///d:/New-family/app/Domain/Listings/Actions/UpdateUnitAction.php)
- **T6 & T7**: Enforce `Sanitizer::isValidMapEmbed()` for the `map_embed_url` field.
- **T7**: Explicitly handle restricted fields like `is_active` if they are authorized to be updated.

#### [MODIFY] [HasMapEmbedRule.php](file:///d:/New-family/app/Http/Requests/Admin/Concerns/HasMapEmbedRule.php)
- **T6**: Add a custom closure rule to validate using `Sanitizer::isValidMapEmbed()`.

---
### Phase 3: Defense in Depth & Operations

#### [MODIFY] [Unit.php](file:///d:/New-family/app/Domain/Listings/Models/Unit.php)
- **T7**: Remove `is_active`, `is_pinned`, `is_deal`, `priority_points`, and `user_id` from the `$fillable` array.

#### [MODIFY] [Sanitizer.php](file:///d:/New-family/app/Domain/Common/Support/Sanitizer.php)
- **T8**: In `sanitizeRichAttributes()`, automatically add or replace `rel="noopener noreferrer"` when processing an `<a>` tag with `target="_blank"`.

#### [MODIFY] [SecurityHeadersMiddleware.php](file:///d:/New-family/app/Http/Middleware/SecurityHeadersMiddleware.php)
- **T9**: Add `report-uri` and `report-to` directives to the `$csp` string.

## Verification Plan

### Automated Tests
- Run Pest/PHPUnit tests for the Points ledger, Authorization policies, Unit creation, and Sanitizer rules.
- Test `Sanitizer::rich()` specifically for `rel="noopener noreferrer"`.
- Test `HasMapEmbedRule` with invalid URLs.

### Manual Verification
- Deploy to local/staging and verify that a manager can successfully allocate points to a unit they own.
- Verify that password reset flow completes successfully without leaking the OTP in the HTTP response.
- Attempt to mass-assign `priority_points` and confirm the update is ignored unless triggered by the dedicated action.

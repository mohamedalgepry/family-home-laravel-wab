# Implementation Tasks: Security Hardening & Confirmed Bug Fixes

## Phase 1: Setup
- [x] T001 Generate baseline test metrics by running `php artisan test`

## Phase 2: Foundational (T7 Model Preparation)
- [x] T002 Update `Unit::$fillable` in `app/Domain/Listings/Models/Unit.php` to remove sensitive fields (`is_active`, `is_pinned`, `is_deal`, `priority_points`, `user_id`)

## Phase 3: OTP Return Value & Flow [US1]
- [x] T003 [US1] Change return type of `sendOtp()` and `forgotPassword()` to `bool` in `app/Domain/Users/Services/AuthService.php`
- [x] T004 [US1] Update `sendResetLink()` to handle boolean return in `app/Http/Controllers/Auth/LoginController.php`
- [x] T005 [US1] Write/Update test for password reset flow OTP generation

## Phase 4: Production Environment Security Documentation [US2]
- [x] T006 [P] [US2] Create and populate `DEPLOYMENT_CHECKLIST.md` with production requirements

## Phase 5: Manager Team Unit Points Allocation [US3]
- [x] T007 [US3] Update `authorize()` to use Policy logic in `app/Http/Requests/Admin/AdjustPointsRequest.php`
- [x] T008 [US3] Add feature test confirming manager can allocate points to their team's units

## Phase 6: Monthly Points Reset Audit Trail [US4]
- [x] T009 [US4] Update `monthlyReset()` to insert `PointsTransaction` records in `app/Domain/Points/Services/PointsService.php`
- [x] T010 [US4] Add feature test confirming `PointsTransaction` insertion on monthly reset

## Phase 7: Scheduled Command Concurrency Protection [US5]
- [x] T011 [US5] Add `->withoutOverlapping()->onOneServer()` to points commands in `routes/console.php`

## Phase 8: Map Embed URL Validation & Unit Actions [US6]
- [x] T012 [US6] Update custom validation logic in `app/Http/Requests/Admin/Concerns/HasMapEmbedRule.php` using Sanitizer
- [x] T013 [US6] Update `app/Domain/Listings/Actions/CreateUnitAction.php` to clear/reject invalid Map URLs and explicitly set restricted fields (like `user_id`, `is_active`)
- [x] T014 [US6] Update `app/Domain/Listings/Actions/UpdateUnitAction.php` to clear/reject invalid Map URLs and explicitly set restricted fields
- [x] T015 [US6] Add unit/feature tests for Map Embed validation and Unit Action mass assignment protection

## Phase 9: Rich Text Sanitization & Reverse Tabnabbing Protection [US7]
- [x] T016 [P] [US7] Update `sanitizeRichAttributes` to enforce `rel="noopener noreferrer"` in `app/Domain/Common/Support/Sanitizer.php`
- [x] T017 [P] [US7] Add unit test for `Sanitizer::rich()` covering `target="_blank"`

## Phase 10: CSP Reporting [US8]
- [x] T018 [P] [US8] Add `report-uri` and `report-to` directives in `app/Http/Middleware/SecurityHeadersMiddleware.php`

## Final Phase: Polish & Cross-Cutting Concerns
- [x] T019 Run static analysis and linter (Laravel Pint)
- [x] T020 Run full regression test suite (`php artisan test`) and verify zero regressions

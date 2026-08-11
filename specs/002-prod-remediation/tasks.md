# Tasks: Family Home Production Remediation & Hardening

## Dependencies & Completion Order
1. Foundational Dependency Fixes (T001-T004) -> MUST complete first to stabilize the system.
2. US1: Google Maps SSRF (T005) -> Can run in parallel with US2.
3. US2: Security Hardening (T006-T009) -> Can run in parallel with US1.
4. US3: SEO & Sitemap (T010-T012) -> Depends on T001-T004 (SitemapService DI).
5. US4: i18n & Performance (T013-T016) -> Can run anytime after foundational stability.
6. Polish: Cleanup & Verification (T017-T018) -> Run last.

## Phase 1: Setup
*(No setup required - existing repository)*

## Phase 2: Foundational (Crash Prevention)
**Goal:** Fix DI crashes so tests and deletion workflows work securely.
- [x] T001 [P] Inject `SitemapService` in constructor in `app/Domain/Listings/Services/ProjectService.php`
- [x] T002 [P] Inject `SitemapService` in constructor in `app/Domain/Listings/Services/UnitService.php`
- [x] T003 [P] Inject `SitemapService` in constructor in `app/Domain/Listings/Services/CategoryService.php`
- [x] T004 [P] Inject `SitemapService` in constructor in `app/Domain/Listings/Services/ArticleService.php`

## Phase 3: User Story 1 (Google Maps Location Setup)
**Goal:** Implement strict SSRF protection and coordinate extraction for Google Maps URLs.
**Independent Test Criteria:** `ExtractCoordinatesFromUrlTest` passes. Admin can paste `maps.app.goo.gl` URL safely.
- [x] T005 [US1] Rewrite `resolveShortUrl` with Laravel `Http` client and strict hostname/IP validation in `app/Http/Requests/Traits/ExtractsCoordinatesFromUrl.php`

## Phase 4: User Story 2 (Security Hardening)
**Goal:** Remove internal data exposure, secure uploads, harden CSP, redesign password reset email.
**Independent Test Criteria:** Public agent API does not leak `role`. CSP does not break Analytics/Maps. Password reset email renders in RTL/LTR.
- [x] T006 [P] [US2] Remove `role` field mapping in `app/Http/Resources/Public/AgentPublicResource.php`
- [x] T007 [P] [US2] Enforce image mime validation (`jpg,jpeg,png,webp`) for uploads via controller-level FormRequests
- [x] T008 [US2] Update production CSP allowlist in `app/Http/Middleware/SecurityHeadersMiddleware.php` to support Google Analytics, Maps, Fonts, YouTube
- [x] T009 [US2] Redesign password reset email: localize `app/Domain/Users/Notifications/ResetPasswordNotification.php`, create `resources/views/emails/reset-password.blade.php` with RTL/LTR, responsive styling

## Phase 5: User Story 3 (SEO & Sitemap Cleanup)
**Goal:** Remove obsolete sitemap, validate robots.txt, remove public meta keywords, verify cache invalidation.
**Independent Test Criteria:** `sitemap-categories.xml` is no longer generated. No `<meta name="keywords">` in public HTML. Cache is invalidated on mutation.
- [x] T010 [P] [US3] Remove `sitemap-categories.xml` generation from `app/Domain/Listings/Services/SitemapService.php` and `SitemapBuilder.php`
- [x] T011 [P] [US3] Remove `keywords` prop output from `resources/js/Components/UI/SeoHead.jsx` and public Show pages
- [x] T012 [US3] Verify cache invalidation on project/unit mutation in `ProjectService.php` and `UnitService.php` — add `ListingService` version bump where missing

## Phase 6: User Story 4 (i18n & Performance)
**Goal:** Full English parity and performant listings.
**Independent Test Criteria:** English routes return translated UI with no Arabic strings. Listing queries execute without N+1.
- [x] T013 [P] [US4] Add missing English translations to `lang/en.json`
- [x] T014 [US4] Apply frontend translation wrappers to hardcoded Arabic strings in `resources/js/Pages`
- [x] T015 [P] [US4] Optimize queries by adding missing `with` eager loads in `app/Http/Controllers/Public/PageController.php`
- [x] T016 [P] [US4] Verify `robots.txt` output from `SitemapBuilder::buildRobots()` allows public pages and references sitemap correctly

## Phase 7: Polish & Cleanup
**Goal:** Remove debug files, run full test suite.
- [x] T017 Delete debug/temp files from repository root (`check_*.php`, `dump*.php`, `test_*.php`, `payload_*.json`, `response.json`, `raw_json.txt`)
- [x] T018 Run `php artisan test` and `npm run build` — verify all tests pass and build succeeds

## Phase 8: Convergence
- [x] T019 Remove `sitemap-categories.xml` entry from `app/Domain/Listings/Services/SitemapService.php::writePublicFiles()` and clean up the dead `buildCategories()` method from `SitemapBuilder.php` per FR-3.4.3 (missing)
- [x] T020 Delete additional debug/temp files found at repository root: `check.php`, `count_areas.php`, `data_page.json`, `db_check.php`, `extract_areas.php`, `fetch.php`, `fetch_html.php`, `fetch_html2.php`, `generate_seeder.php`, `home_html.txt`, `schema_test.php`, `temp_areas.php`, `test.php`, `update_db.php`, `verify_frontend.php` per SC-6 (missing)
- [x] T021 Replace hardcoded inline Arabic/English ternaries in `resources/js/Pages/Public/Comparison.jsx`, `Home.jsx`, `Areas/Show.jsx`, `Articles/Show.jsx`, `Articles/Index.jsx` with `trans()` calls per FR-3.4.1 (partial)
- [x] T022 Verify and fix `SitemapBuilder::urlEntry()` to use actual model `updated_at` timestamps instead of `now()` for `buildStatic()` static page entries — currently static pages use `now()` which changes every regeneration per FR-3.4.3 (partial)


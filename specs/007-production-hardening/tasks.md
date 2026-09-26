# Tasks: Family Home Production Hardening

## Feature
Family Home Production Hardening — Comprehensive surgical remediation across security, SEO, performance, accessibility, UX, database, AI assistant, and code hygiene.

## Dependencies
```
Phase 1 (Setup) → Phase 2 (Security) → Phase 3 (Data Integrity) → Phase 4 (SEO)
Phase 2 (Security) → Phase 5 (Performance)
Phase 2 (Security) → Phase 6 (Accessibility)
Phase 3 (Data Integrity) → Phase 4 (SEO)
Phase 5 (Performance) → Phase 7 (UX & Search)
Phase 6 (Accessibility) → Phase 7 (UX & Search)
Phase 8 (AI & DB) is independent of Phases 4–7
Phase 9 (Bundle & Chat) is independent of Phases 4–8
Phase 10 (Repo Cleanup) is independent of all except Phase 1
Phase 11 (Verification) depends on ALL preceding phases
```

## Parallel Execution Opportunities
- **T004–T009** (Phase 2 security tasks) can all run in parallel — different files, no interdependencies.
- **T010–T011** (Phase 3 double-encoding) can run in parallel with **T016–T020** (Phase 5 performance).
- **T012–T015** (Phase 4 SEO) can run in parallel with **T021–T025** (Phase 6 accessibility).
- **T026–T029** (Phase 7 UX) can run in parallel with **T030–T034** (Phase 8 AI & DB).
- **T035–T037** (Phase 9 bundle) can run in parallel with **T038–T039** (Phase 10 cleanup).

---

## Phase 1: Setup

- [X] T001 Read and verify current `.gitignore` entries in `d:\New-family\.gitignore`
- [X] T002 Read and verify current `config/assistant.php` timeout defaults in `d:\New-family\config\assistant.php`
- [X] T003 Read and verify current `.specify/feature.json` points to `specs/007-production-hardening` in `d:\New-family\.specify\feature.json`

---

## Phase 2: Security Hardening [US1–US4]

- [X] T004 [P] [US1] Remove hardcoded user INSERT statements (admin/manager/agent with identical bcrypt hashes) from `d:\New-family\database\database.sql` (lines 594-606) while keeping the roles INSERT
- [X] T005 [P] [US1] Replace `Hash::make('12345678')` with `Hash::make(env('ADMIN_SEED_PASSWORD', Str::random(16)))` and add password warning output in `d:\New-family\database\seeders\FreshDummySeeder.php`
- [X] T006 [P] [US1] Create `php artisan app:create-admin` command with interactive email validation, hidden password input, strength validation (min 8 chars), duplicate-email prevention, and Spatie role assignment in `d:\New-family\app\Console\Commands\CreateAdminCommand.php`
- [X] T007 [P] [US2] Add `realpath()` containment check in `resolvePrerenderPath()` to verify resolved paths start with `realpath(storage_path('app/prerendered'))`, add URL-decode loop protection, and log traversal attempts in `d:\New-family\app\Http\Middleware\DetectBot.php`
- [X] T008 [P] [US4] Add `object-src 'none'` and `base-uri 'self'` to production CSP string in `d:\New-family\app\Http\Middleware\SecurityHeadersMiddleware.php`
- [X] T009 [P] [US4] Remove `html`, `json`, `xml`, `gz` from CORS wildcard `FilesMatch` in `d:\New-family\.htaccess` (root) — scope CORS to `"\.(js|css|woff2?|ttf|eot|svg|webp|png|jpg|jpeg)$"` only
- [X] T010 [P] [US4] Remove `html`, `json`, `xml`, `gz`, `mjs` from CORS wildcard `FilesMatch` in `d:\New-family\public\.htaccess`; separate JSON cache rule without `immutable`; remove `.html` from immutable cache `FilesMatch`
- [X] T011 [P] [US4] Add `RewriteRule ^(\.env|\.git|\.agents|storage|vendor|app|bootstrap|config|database) - [F,L,NC]` to block HTTP access to sensitive directories in `d:\New-family\.htaccess` (root)
- [X] T012 [P] [US3] Add executable extension rejection (`php`, `phtml`, `phar`, `cgi`, `sh`, `exe`, etc.) and MIME type validation guard before `$image->store()` in `d:\New-family\app\Domain\Listings\Actions\StoreUploadedImagesAction.php`

---

## Phase 3: Data Integrity — Double Encoding [US5]

- [X] T013 [P] [US5] Grep codebase for `htmlspecialchars()`, `htmlentities()`, `e()` calls on data before database storage (in actions, DTOs, importers, seeders) and fix identified sources to store plain UTF-8 text
- [X] T014 [US5] Create `php artisan app:fix-double-encoding {--dry-run}` command targeting `units`, `projects`, `articles`, `areas` text columns — iteratively `html_entity_decode()` until stable, transaction-wrapped per table, with safety checks for `<script`/`<iframe` in `d:\New-family\app\Console\Commands\FixDoubleEncodingCommand.php`

---

## Phase 4: SEO Cleanup [US6–US7]

- [X] T015 [P] [US6] Remove hardcoded `'القاهرة الجديدة، مصر'` GEO defaults from `buildMeta()` in `d:\New-family\app\Services\SeoService.php` — return `null` for `geo_region`, `geo_placename` when no custom meta provided
- [X] T016 [P] [US6] Change `resolveGeo()` for Articles to return all nulls instead of hardcoded Cairo defaults in `d:\New-family\app\Domain\Common\Services\SeoMetaService.php`
- [X] T017 [P] [US6] Verify `cleanMetaDescription()` handles entity-decoded text correctly and GEO tags render only when non-null in `d:\New-family\resources\js\Components\UI\SeoHead.jsx`
- [X] T018 [US7] Verify filter pages correctly apply `noindex, follow` robots — confirm `hasFilterQuery` regex covers all filter params in `d:\New-family\resources\js\Components\UI\SeoHead.jsx`

---

## Phase 5: Performance [US8–US9]

- [X] T019 [P] [US8] Consolidate 12 Cairo `@font-face` blocks into single variable-weight declaration (`font-weight: 400 700`) in `d:\New-family\resources\css\app.css` (lines 6-125)
- [X] T020 [P] [US8] Remove duplicate `prefers-reduced-motion` rule (lines 583-593), remove duplicate `@utility animate-in` (line 679), and consolidate scattered `@layer utilities` blocks in `d:\New-family\resources\css\app.css`
- [X] T021 [P] [US9] Change `decoding="sync"` to `decoding="async"` on hero images in `d:\New-family\resources\js\Pages\Public\Home.jsx`, `d:\New-family\resources\js\Pages\Public\Units\Show.jsx`, and `d:\New-family\resources\js\Pages\Public\Projects\Show.jsx`
- [X] T022 [P] [US9] Change Header logo fallback from `/icon.webp` (92KB) to `/icon-64.webp` (1KB) in `d:\New-family\resources\js\Components\Layout\Header.jsx`
- [X] T023 [P] [US9] Change favicon fallback from `asset('icon.png')` to `asset('favicon.ico')` for generic icon link in `d:\New-family\resources\views\app.blade.php`; change error pages (`404.blade.php`, `419.blade.php`, `500.blade.php`) from `/icon.webp` to `/icon-64.webp`

---

## Phase 6: Accessibility [US13]

- [X] T024 [P] [US13] Add `role="dialog"`, `aria-modal="true"`, `aria-label`, keyboard handlers (Escape→close, ArrowLeft→prev, ArrowRight→next), focus trap, body scroll lock, and focus restoration to lightbox in `d:\New-family\resources\js\Pages\Public\Units\Show.jsx` (lines ~1099-1149)
- [X] T025 [P] [US13] Add same lightbox accessibility (role, aria, keyboard, focus trap, scroll lock) to `d:\New-family\resources\js\Pages\Public\Projects\Show.jsx` (lines ~778-823)
- [X] T026 [P] [US13] Add focus trap inside mobile nav overlay and focus restoration to hamburger button on close in `d:\New-family\resources\js\Components\Layout\Header.jsx`
- [X] T027 [P] [US13] Add Escape key handler to minimize chat, `aria-expanded` and `aria-controls` on FAB button, and focus restoration on close in `d:\New-family\resources\js\Components\UI\HossamChatWidget.jsx`

---

## Phase 7: UX & Search [US10–US12]

- [X] T028 [US12] Reduce card hover effects to `hover:-translate-y-1` / `hover:shadow-lg` and remove excessive `hover:scale-*` transforms in `d:\New-family\resources\js\Components\UI\UnitCard.jsx`, `ProjectCard.jsx`, `ArticleCard.jsx`
- [X] T029 [US12] Change `md:backdrop-blur-xl` to `md:backdrop-blur-md` on header sticky element in `d:\New-family\resources\js\Components\Layout\Header.jsx` (line 69)
- [X] T030 [US11] Reorder desktop SearchBar primary fields to: Sale/Rent → Area → Property Type → Budget → Search; move keyword search to advanced filters in `d:\New-family\resources\js\Components\UI\SearchBar.jsx`
- [X] T031 [US11] Reorder mobile SearchBar to: Area → Property Type → Budget → Search → Advanced Filters expandable in `d:\New-family\resources\js\Components\UI\SearchBar.jsx`
- [X] T032 [US10] Audit `d:\New-family\resources\js\Pages\Public\Units\Show.jsx` for duplicate desktop/mobile content sections; unify into single responsive components using `hidden md:block` / `md:hidden` for layout, not content duplication
- [X] T033 [US10] Enforce property page section order: Breadcrumb → Gallery → Price+CTA → Key Specs → Description → Payment → Features → Project → Location → Agent → Similar Units in `d:\New-family\resources\js\Pages\Public\Units\Show.jsx`
- [X] T034 [US10] Verify mobile fixed bottom action bar in `d:\New-family\resources\js\Pages\Public\Units\Show.jsx` uses `pb-[env(safe-area-inset-bottom)]`, `z-40`, and does not overlap chat FAB or other elements

---

## Phase 8: AI Assistant & Database Optimization [US14–US15]

- [X] T035 [P] [US15] Change `total_budget_seconds` default from `40.0` to `15.0` and `per_request_timeout_seconds` default from `30.0` to `10.0` in `d:\New-family\config\assistant.php`
- [X] T036 [P] [US15] Audit all `Log::warning()` and `Log::info()` calls in `d:\New-family\app\Domain\Assistant\Services\AssistantOrchestratorService.php` to confirm no user messages, phone numbers, or API keys are logged; add sanitization if needed
- [X] T037 [P] [US15] Create `php artisan leads:cleanup {--days=90}` command that deletes `AssistantLead` records older than specified days in `d:\New-family\app\Console\Commands\CleanupAssistantLeadsCommand.php`
- [X] T038 [US15] Schedule `leads:cleanup` to run daily at 04:00 (Africa/Cairo) in `d:\New-family\routes\console.php`
- [X] T039 [P] [US15] Create migration to add database indexes on `phone` and `created_at` columns in `assistant_leads` table in `d:\New-family\database\migrations\xxxx_add_indexes_to_assistant_leads_table.php`
- [X] T040 [P] [US14] Replace `inRandomOrder()` with cached random ID selection (cache 20 IDs for 1 hour) in suggested units query in `d:\New-family\app\Http\Controllers\Public\ArticleController.php`
- [X] T041 [P] [US14] Add `'user'` to eager loading `with()` array on units query in `d:\New-family\app\Http\Controllers\Public\AgentController.php` (line 30)

---

## Phase 9: Bundle & Chat Widget [US8, US18]

- [X] T042 [P] [US8] Run `npm run build` and verify in build output that `vendor-recharts` and `vendor-tiptap` chunks are only loaded by admin page chunks, not public page chunks
- [X] T043 [US18] Split `d:\New-family\resources\js\Components\UI\HossamChatWidget.jsx` (1159 lines) into modular sub-components: `HossamChat/HossamChatWidget.jsx`, `HossamChat/ChatHeader.jsx`, `HossamChat/MessageList.jsx`, `HossamChat/MessageBubble.jsx`, `HossamChat/QuickReplies.jsx`, `HossamChat/ChatComposer.jsx`
- [X] T044 [US18] Extract session persistence and API call logic into `d:\New-family\resources\js\Components\HossamChat\hooks\useChatSession.js` and `d:\New-family\resources\js\Components\HossamChat\hooks\useChatApi.js`
- [X] T045 [US18] Update lazy import path in `d:\New-family\resources\js\Components\Layout\Footer.jsx` from `'../UI/HossamChatWidget'` to `'../HossamChat/HossamChatWidget'`

---

## Phase 10: Repository Cleanup [US17]

- [X] T046 [P] [US17] Delete `.scratch/` directory from version control: `git rm -r .scratch/` in `d:\New-family\.scratch\`
- [X] T047 [P] [US17] Add `.scratch/`, `*.bak`, `*.tmp`, `*.log`, `test-results/`, `playwright-report/` entries to `d:\New-family\.gitignore`

---

## Phase 11: Verification & Testing [US16]

- [X] T048 Run `php artisan test` and verify all tests pass with no regression
- [X] T049 Run `npm run build` and verify zero errors
- [X] T050 Run `php artisan optimize:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache` and verify all succeed
- [X] T051 Run `php artisan app:create-admin` interactively and verify admin creation flow
- [X] T052 Run `php artisan app:fix-double-encoding --dry-run` and verify affected records are identified
- [X] T053 Run `php artisan leads:cleanup --days=0` with test data and verify cleanup
- [X] T054 Verify security headers present on response via `curl -sI` (X-Content-Type-Options, X-Frame-Options, CSP with object-src 'none', base-uri 'self')
- [X] T055 Verify CORS wildcard absent from HTML/JSON responses
- [X] T056 Verify lightbox keyboard navigation (Escape, ArrowLeft, ArrowRight) works in browser
- [X] T057 Verify no `&amp;amp` patterns visible on any public page

---

## Implementation Strategy

### MVP Scope (Phase 2 — Security)
Tasks T004–T012 constitute the minimum viable hardening: credential removal, path traversal fix, CSP enhancement, CORS restriction, upload hardening. These are the highest-impact, lowest-risk changes.

### Incremental Delivery Order
1. **Sprint 1**: Phase 2 (Security) + Phase 10 (Cleanup) — immediate risk reduction
2. **Sprint 2**: Phase 3 (Double Encoding) + Phase 8 (AI & DB) — data integrity + performance
3. **Sprint 3**: Phase 4 (SEO) + Phase 5 (Performance) — search & speed
4. **Sprint 4**: Phase 6 (Accessibility) + Phase 7 (UX) — user experience
5. **Sprint 5**: Phase 9 (Bundle & Chat) — maintainability
6. **Sprint 6**: Phase 11 (Verification) — final validation
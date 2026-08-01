# tasks.md — Family Home: منصة تسويق عقاري
**Feature Directory**: `specs/001-family-home-platform`
**Generated**: 2026-07-17
**Status**: Ready for Implementation

> كل Task قابل للتنفيذ بشكل مستقل من قِبل opencode. اقرأ `plan.md` و`spec.md` قبل البدء.
> **قاعدة docs/libraries**: كل مكتبة تُضاف تستلزم إنشاء `docs/libraries/{name}.md` باللغة العربية في نفس الـ Task.

---

## Dependencies Graph (ترتيب الإنجاز)

```
Phase 1 (Setup)
  └─► Phase 2 (Foundation: DB + Auth)
        ├─► Phase 3 (Points System)      [US3]
        ├─► Phase 4 (Public Site)        [US4]
        │     └─► Phase 5 (Admin Panel)  [US5]
        ├─► Phase 6 (Messaging)          [US6]  [depends: US4]
        └─► Phase 7 (SEO + Performance)  [US7]  [depends: US4, US5]
              └─► Phase 8 (Polish)
```

---

## Phase 1: Setup — إعداد البنية الأساسية

> لا story labels — هذه مهام التهيئة التي تسبق كل شيء.

- [x] T001 Create Laravel 13 project with Vite + React 18 + Inertia.js SSR: run `composer create-project laravel/laravel .` then `composer require inertiajs/inertia-laravel` then `npm install @inertiajs/react react react-dom` — create `docs/libraries/inertia.md`
- [x] T002 Configure Tailwind CSS 3.x with RTL plugin: install `tailwindcss @tailwindcss/forms tailwindcss-rtl postcss autoprefixer`, copy `design-tokens.md` color/spacing/font tokens into `tailwind.config.js` — create `docs/libraries/tailwindcss.md`
- [x] T003 Install and configure Filament v3 as Backend-only: `composer require filament/filament`, configure panel provider to disable Filament default views — create `docs/libraries/filament.md`
- [x] T004 [P] Create Domain directory structure per `plan.md §1.3`: `app/Domain/{Points,Listings,Users,Media}/{Models,Services,Policies,Jobs}` + `app/Http/Controllers` + `app/Filament/Resources`
- [x] T005 [P] Create React page structure: `resources/js/Pages/{Public,Admin,Shared}` + `resources/js/Components/{UI,Layout,Features}` + `resources/js/Hooks` + `resources/js/Utils`
- [x] T006 [P] Create i18n files: `lang/ar/{common,auth,units,projects,admin,messages,points}.php` + `lang/en/{common,auth,units,projects,admin,messages,points}.php` — all keys must exist in both languages
- [x] T007 Configure HandleInertiaRequests middleware with SharedProps interface from `contracts/api.md §1`: auth.user, locale, flash, settings
- [x] T008 Configure database queue driver (no Redis): set `QUEUE_CONNECTION=database` in `.env`, run `php artisan queue:table` — document Cron-based scheduler setup for Hostinger in `docs/libraries/laravel-scheduler.md`
- [x] T009 [P] Configure Google Fonts: Cairo + Inter via `resources/css/app.css` — add font-family tokens to `tailwind.config.js`

---

## Phase 2: Foundation — قاعدة البيانات والصلاحيات

> Prerequisites: Phase 1 complete. These tasks block ALL user story phases.

### 2a. Database Migrations

- [x] T010 Create migration for `users` table per `data-model.md §1`: add all columns including `role` enum(admin,manager,agent), `points_balance` int nullable, `initial_monthly_balance` int nullable, `manager_id` FK, `is_active` boolean — add indexes on `email`(unique), `role`, `manager_id`, `is_active`
- [x] T011 Create migration for `areas` table per `data-model.md §5`: `name_ar`, `name_en`, `slug`(unique) — seed with 10 sample Egyptian areas
- [x] T012 Create migration for `unit_types` table per `data-model.md §4`: `name_ar`, `name_en`, `slug` — seed with: سكني, إداري, طبي, أرض خالية, مبنى كامل
- [x] T013 Create migration for `projects` table per `data-model.md §2`: all columns including `slug`(unique), `views_count`, `meta_description`, `keywords`(JSON), `location_lat/lng/address` — indexes on `slug`, `user_id`, `is_active`, `views_count`
- [x] T014 Create migration for `units` table per `data-model.md §3`: all columns including `video_url`, `video_path`, `priority_points`, `is_pinned`, `is_deal`, `is_active`, `auto_delete_at` — indexes on `slug`(unique), `area_id`, `type_id`, `transaction`, `price`, `priority_points`(desc), `is_active`, `created_at`(desc)
- [x] T015 Create migration for `project_images` table per `data-model.md §10`: `project_id`, `path`, `alt_text`, `sort_order`
- [x] T016 Create migration for `unit_images` table per `data-model.md §11`: `unit_id`, `path`, `alt_text`, `sort_order`
- [x] T017 Create migration for `categories` table per `data-model.md §9`: `name_ar`, `name_en`, `slug`(unique)
- [x] T018 Create migration for `articles` table per `data-model.md §8`: `slug`(unique), `category_id`, `content`(longtext), `alt_text`, `keywords`(JSON), `meta_description`, `is_published`, `views_count`
- [x] T019 Create migration for `article_images` table per `data-model.md §12`: `article_id`, `path`, `alt_text`, `position` enum(inside,header), `size` enum(small,medium,large), `sort_order`
- [x] T020 Create migration for `messages` table per `data-model.md §6`: `unit_id`, `agent_id`, `client_name`, `client_phone`, `client_email`, `content`, `status` enum(pending,replied), `replied_at` — indexes on `unit_id`, `agent_id`, `status`
- [x] T021 Create migration for `points_transactions` table per `data-model.md §7`: `manager_id`, `unit_id`(nullable), `points`, `type` enum(allocate,daily_deduct,monthly_reset,admin_adjust), `balance_after`, `notes`, `performed_by` — indexes on `manager_id`, `type`, `created_at`
- [x] T022 Create migration for `settings` table per `data-model.md §13`: `key`(unique), `value`(text) — seed defaults: `daily_deduction_enabled=true`, `daily_deduction_value=10`, `monthly_reset_day=1`, `monthly_reset_auto=false`, `auto_delete_days=30`, `max_video_size_mb=100`
- [x] T023 Create migration for `about_page` table per `data-model.md §14`: `content_ar`(longtext), `content_en`(longtext), `images`(JSON) — seed with empty record
- [x] T024 Create migration for `page_views` table per `data-model.md §15`: polymorphic `(viewable_type, viewable_id)`, `ip_address`, `user_agent`, `visited_at` — compound indexes per spec
- [x] T025 Create migration for `popular_searches` table per `data-model.md §16`: `keyword`(unique), `search_count`, `last_searched_at` — indexes on `search_count`(desc), `last_searched_at`(desc)

### 2b. Models and Relationships

- [x] T026 [P] Create `app/Domain/Users/Models/User.php` with all relationships per `data-model.md §1`: manager(), agents(), projects(), units(), messages(), pointsTransactions() — add role-checking helper methods: isAdmin(), isManager(), isAgent()
- [x] T027 [P] Create `app/Domain/Listings/Models/Project.php` with relationships: user(), units(), images(), area() — add slug auto-generation via creating/updating observers
- [x] T028 [P] Create `app/Domain/Listings/Models/Unit.php` with relationships: project(), user(), type(), area(), images(), messages(), pointsTransactions() — add slug auto-generation, scopeFeatured(), scopeDeals(), scopeActive()
- [x] T029 [P] Create `app/Domain/Points/Models/PointsTransaction.php` with relationships: manager(), unit(), performer()
- [x] T030 [P] Create remaining models: `Area`, `UnitType`, `Category`, `Article`, `ArticleImage`, `Message`, `ProjectImage`, `UnitImage`, `Setting`, `AboutPage`, `PageView`, `PopularSearch` in respective Domain folders

### 2c. Actions and DTOs

- [x] T030.1 [P] Install `spatie/laravel-data` for DTOs: `composer require spatie/laravel-data` — create `docs/libraries/laravel-data.md`
- [x] T030.2 [P] Create `app/Domain/Listings/DTOs` and `app/Domain/Points/DTOs` for typed input handling.
- [x] T030.3 [P] Create Actions for operations (e.g., `CreateUnitAction`, `AllocatePointsAction`). Ensure Actions are framework-agnostic (no Request objects inside, use DTOs instead).

### 2d. Authentication and Authorization

- [x] T031 Install spatie/laravel-permission: `composer require spatie/laravel-permission` — create `docs/libraries/spatie-permission.md` — configure roles: admin, manager, agent
- [x] T032 Create Auth pages in `resources/js/Pages/Shared/`: `Login.tsx` with RTL/LTR support, `ForgotPassword.tsx`, `ResetPassword.tsx` — all strings via `lang/ar|en/auth.php`
- [x] T033 Create `app/Domain/Users/Services/AuthService.php`: login(), logout(), resetPassword() — no business logic in controllers
- [x] T034 Create User Profile pages in `resources/js/Pages/Shared/Profile.tsx`: edit name, avatar upload, password change, contact info (phone, whatsapp, facebook) — all strings via lang files
- [x] T035 Create `app/Domain/Users/Services/ProfileService.php`: updateProfile(), changePassword(), uploadAvatar() — avatar stored in `storage/avatars/{user_id}/`
- [x] T036 Create Policies in `app/Domain/Users/Policies/`: `UserPolicy.php` — implement all role-based gates per `spec.md §3.1` (AUTH-01 through AUTH-07)
- [x] T037 Create Policies in `app/Domain/Listings/Policies/`: `ProjectPolicy.php` (only Admin+Manager can create), `UnitPolicy.php` (Agent can create, owner can edit)
- [x] T038 Create `AllocatePointsPolicy` per `contracts/api.md §4.2`: Admin → always allowed (admin_adjust, no balance check); Manager → check points <= points_balance AND unit belongs to their agents; Agent → 403
- [x] T039 Create `app/Http/Controllers/Auth/` controllers (thin — call AuthService only): `LoginController.php`, `ProfileController.php` — no business logic here

---

## Phase 3: Points System — نظام النقاط [US3]

> Prerequisites: Phase 2 complete. Points system must be 100% accurate — all operations in DB Transactions.

- [x] T040 [P] [US3] Create `app/Domain/Points/Services/PointsService.php`: allocatePoints(manager, unit, points), deductDailyPoints(), resetMonthly(), adminAdjust() — ALL wrapped in DB::transaction() — no raw SQL outside transactions
- [x] T041 [US3] Create `app/Domain/Points/Jobs/DailyDeductionJob.php`: per `contracts/api.md §5.1` — check settings.daily_deduction_enabled first; process only units WHERE is_pinned=false AND priority_points>0; log total processed
- [x] T042 [US3] Create `app/Domain/Points/Jobs/MonthlyResetJob.php`: per `contracts/api.md §5.2` — single DB Transaction for ALL managers + units; ROLLBACK on any failure; alert Admin on failure via Log::critical()
- [x] T043 [US3] Register Cron Jobs in `app/Console/Kernel.php` (or `routes/console.php` for Laravel 13): `points:daily-deduct` daily at 00:01, `points:monthly-reset` monthly conditional, `units:check-expiry` daily at 02:00 — document Hostinger cron setup instructions in `docs/libraries/laravel-scheduler.md`
- [x] T044 [US3] Create `app/Domain/Points/Jobs/AutoDeleteReviewJob.php`: per `contracts/api.md §5.3` — flag units as pending_review (NOT delete); notify Admin via log + DB notification; never auto-delete
- [x] T045 [P] [US3] Create Points Ledger React Admin Page in `resources/js/Pages/Admin/Points/Ledger.tsx`: list view with filters by manager_id, type, date range

---

## Phase 4: Public Site — الموقع العام [US4]

> Prerequisites: Phase 2 complete. Can run parallel to Phase 3.

### 4a. Shared Components

- [x] T046 Create `resources/js/Components/Layout/Header.tsx`: sticky header, logo, nav links (الرئيسية/مشاريع/وحدات/صفقات/مقالات/عنا/تواصل), language toggle (AR/EN), comparison basket icon with count — RTL/LTR aware — all text via lang files
- [x] T047 Create `resources/js/Components/Layout/Footer.tsx`: quick links, company contact info, social media links (from shared settings) — RTL/LTR aware
- [x] T048 [P] Create `resources/js/Components/UI/UnitCard.tsx`: thumbnail, "مميز" badge (if priority_points>0), price, area, type, rooms/area_sqm, compare icon, favorite icon — Skeleton variant for loading state
- [x] T049 [P] Create `resources/js/Components/UI/ProjectCard.tsx`: thumbnail, name, area, units count, compare icon — Skeleton variant
- [x] T050 [P] Create `resources/js/Components/UI/Pagination.tsx`: prev/next, page numbers — RTL aware
- [x] T051 [P] Create `resources/js/Components/UI/SearchBar.tsx`: area select, price range (from/to), unit type select, transaction type select — matches HomeProps filter shape from `contracts/api.md §2.1`
- [x] T052 [P] Create `resources/js/Components/Features/ComparisonBasket.tsx`: local state (up to 4 items), Toast error when >4 — persisted in localStorage

### 4b. Homepage

- [x] T053 [US4] Create `resources/js/Pages/Public/Home.tsx` with layout: Hero section (background image/video + SearchBar), Popular Searches tags row, Featured Units grid, Latest Units grid — implement Skeleton loaders + empty states — all strings via lang files
- [x] T054 [US4] Create `app/Http/Controllers/Public/HomeController.php`: call `ListingService::getFeaturedUnits()`, `ListingService::getLatestUnits()`, `SearchService::getPopularSearches()` — return Inertia page with HomeProps
- [x] T055 [US4] Create `app/Domain/Listings/Services/ListingService.php`: getFeaturedUnits(limit), getLatestUnits(limit), getUnitsByFilters(filters, page), getProjectsByFilters(filters, page) — sort by priority_points DESC, created_at DESC

### 4c. Units & Projects Pages

- [x] T056 [US4] Create `resources/js/Pages/Public/Units/Index.tsx`: SearchBar, Desktop Sidebar filters + Mobile Bottom-sheet filters, Unit cards grid, Pagination — filter state saved in URL params for SEO — Skeleton + empty state
- [x] T057 [US4] Create `resources/js/Pages/Public/Projects/Index.tsx`: Projects grid, search by name, area filter, Pagination — Skeleton + empty state
- [x] T058 [US4] Create `resources/js/Pages/Public/Units/Deals.tsx`: same as Units/Index but pre-filtered is_deal=true — empty state "لا توجد صفقات حاليًا"

### 4d. Detail Pages

- [x] T059 [US4] Create `resources/js/Pages/Public/Units/Show.tsx`: image gallery (Lightbox), video player (YouTube embed OR local video), Google Maps embed, AgentCard component, quick contact form, similar units section — per `contracts/api.md §2.3`
- [x] T060 [US4] Create `resources/js/Components/Features/AgentCard.tsx`: avatar, name, phone link, WhatsApp link, Facebook link — show only non-null contact channels
- [x] T061 [US4] Create `resources/js/Pages/Public/Projects/Show.tsx`: image gallery, video, map, units list belonging to project, agent card — per `contracts/api.md §2.5`
- [x] T062 [US4] Create `app/Http/Controllers/Public/UnitController.php` + `ProjectController.php`: call services, increment views via PageViewService, return Inertia props
- [x] T063 [US4] Create `app/Domain/Listings/Services/PageViewService.php`: recordView(viewable_type, viewable_id, ip, user_agent) — prevents duplicate counting within 1-hour window per IP; updates counter cache on parent model

### 4e. Articles

- [x] T064 [US4] Create `resources/js/Pages/Public/Articles/Index.tsx`: articles grid cards (thumbnail, title, excerpt), category sidebar/tabs, Pagination — Skeleton + empty state
- [x] T065 [US4] Create `resources/js/Pages/Public/Articles/Show.tsx`: article full content (HTML), image placements per position/size, related articles — comfortable reading typography (max-w-3xl, line-height 1.75)
- [x] T066 [US4] Create `app/Http/Controllers/Public/ArticleController.php`: index with category filter, show with related articles — no business logic in controller

### 4f. Comparison

- [x] T067 [US4] Create `resources/js/Pages/Public/Comparison.tsx`: side-by-side table, highlight best value per row (different color), max 4 items, type guard (unit vs project only, not mixed) — empty state with add-to-compare instructions
- [x] T068 [US4] Create `app/Http/Controllers/Public/ComparisonController.php`: validate items <= 4 AND same type — per `contracts/api.md §2.7`

### 4g. Static Pages

- [x] T069 [US4] Create `resources/js/Pages/Public/About.tsx` + `resources/js/Pages/Public/Contact.tsx` — About content from DB (about_page table); Contact has form with Rate Limiting (5/hour per IP) — per `contracts/api.md §4.3`
- [x] T070 [US4] Create `app/Http/Controllers/Public/MessageController.php`: store() calls MessageService::createMessage() — Rate limit middleware applied
- [x] T071 [US4] Create `app/Domain/Users/Services/MessageService.php`: createMessage(unit_id, client_data) — validate unit exists, create message with status=pending

### 4h. Search Tracking

- [x] T072 [US4] Create `app/Domain/Listings/Services/SearchService.php`: recordSearch(keyword), getPopularSearches(limit=10, days=30) — upsert popular_searches per `data-model.md §16` logic — called on every search request

---

## Phase 5: Admin Panel — لوحة تحكم الإدارة [US5]

> Prerequisites: Phase 2 + Phase 3 (for Points UI). Admin panel uses same React/Inertia — NOT Filament UI.

### 5a. Admin Layout & Dashboard

- [x] T073 Create `resources/js/Components/Layout/AdminSidebar.tsx`: dynamic nav based on role (Admin sees all, Manager sees: مشاريعه/وحداته/نقاط/رسائل) — primary color #CC0000, Family Home logo — all strings via lang files
- [x] T074 [US5] Create `resources/js/Pages/Admin/Dashboard.tsx`: stats cards (projects/units/users/messages), top 10 projects by views table, visits line chart (recharts) — Skeleton loaders — per `contracts/api.md §3.1` — create `docs/libraries/recharts.md`
- [x] T075 [US5] Create `app/Http/Controllers/Admin/DashboardController.php` + `app/Domain/Listings/Services/StatisticsService.php`: getStats(), getTopProjects(10), getVisitsChart(days=30)

### 5b. Units & Projects Management (Multi-step Form)

- [x] T076 [US5] Create `resources/js/Pages/Admin/Units/Index.tsx`: data table with search/filter/sort, bulk actions, per `contracts/api.md §3.2` — add is_pinned toggle, is_deal toggle, delete action
- [x] T077 [US5] Create `resources/js/Pages/Admin/Units/Form.tsx`: multi-step (4 steps): Step 1 (basic data), Step 2 (images + video: URL OR file upload), Step 3 (keywords + meta), Step 4 (Google Maps location picker) — progress indicator, back navigation, unsaved changes warning
- [x] T078 [US5] Create `app/Http/Controllers/Admin/UnitController.php` → calls `UnitService`; Image uploads MUST dispatch an async Queue Job to generate thumbnails using `intervention/image`. The HTTP request must return immediately after saving original files.
- [x] T079 [US5] Create `app/Domain/Listings/Services/UnitService.php`: createUnit(), updateUnit(), deleteUnit(), pinUnit(), markAsDeal(), renewUnit() — renewUnit() resets auto_delete_at per settings, transitions state from auto_delete_pending → active (unlimited renewals)
- [x] T080 [P] [US5] Create `resources/js/Pages/Admin/Projects/Index.tsx` + `Projects/Form.tsx` (same multi-step pattern as Units) — Manager sees only own + Admin projects

### 5c. Points Management

- [x] T081 [US5] Create `resources/js/Pages/Admin/Points/Index.tsx`: managers balances table, ledger data table with date/user filters, allocate-points modal (Manager view), monthly reset button (Admin only) — per `contracts/api.md §3.2`
- [x] T082 [US5] Create `app/Http/Controllers/Admin/PointsController.php`: allocate() → AllocatePointsPolicy → PointsService::allocatePoints(); monthlyReset() → admin only → PointsService::resetMonthly()
- [x] T082.1 [US5] Implement strict DB::transaction() logic inside Points Actions to guarantee data consistency during allocation and deduction.

### 5d. Users Management

- [x] T083 [US5] Create `resources/js/Pages/Admin/Users/Index.tsx`: all roles list, activate/deactivate toggle, transfer projects modal, assign agents to manager — Admin only
- [x] T084 [US5] Create `app/Domain/Users/Services/UserService.php`: createUser(), deactivateUser(), activateUser(), transferProjects(fromUser, toUser), assignAgentToManager()

### 5e. Messages

- [x] T085 [US5] Create `resources/js/Pages/Admin/Messages/Index.tsx`: messages list, filter by status (pending/replied) + agent — mark as replied action — per `contracts/api.md §3.3`
- [x] T086 [US5] Create `app/Http/Controllers/Admin/MessageController.php`: index() with scoped access (Agent sees own, Admin sees all), markAsReplied()

### 5f. Settings

- [x] T087 [US5] Create `resources/js/Pages/Admin/Settings/Index.tsx`: general settings form — points config (deduction enable/disable toggle + value), monthly reset (day + auto toggle), auto_delete_days, max_video_size_mb, site logo upload, company contact, social media links — Admin only
- [x] T088 [US5] Create `app/Domain/Listings/Services/SettingsService.php`: get(key), set(key, value), getAll() — cached with 60-min TTL — invalidate cache on update

### 5g. Articles Management (Admin)

- [x] T089 [P] [US5] Create `resources/js/Pages/Admin/Articles/Index.tsx` + `Articles/Form.tsx`: rich text editor (Tiptap) — title, content, thumbnail, multiple images with position/size/alt controls, keywords, meta description, category, publish toggle — create `docs/libraries/tiptap.md`
- [x] T090 [P] [US5] Create `resources/js/Pages/Admin/Articles/Categories.tsx`: CRUD for categories (name_ar, name_en, slug auto-generated)

### 5h. About Page Editor

- [x] T091 [US5] Create `resources/js/Pages/Admin/About/Edit.tsx`: dual language editor (AR + EN tabs), images upload — Admin only
- [x] T092 [US5] Create `app/Http/Controllers/Admin/AboutController.php` → `AboutService::update()`

---

## Phase 6: Messaging System — نظام المراسلة [US6]

> Prerequisites: Phase 4 (public contact form) + Phase 5 (admin messages view).

- [x] T093 [US6] Verify message scoping: Agent controller method must use `whereHas('unit', fn($q) => $q->where('user_id', auth()->id()))` — write scope on Message model: `scopeForAgent(Builder $query, User $agent)`
- [x] T094 [US6] Create notification: when new message arrives, notify the responsible Agent via Laravel Notification (database channel) — show unread badge in Admin Sidebar

---

## Phase 7: SEO & Performance — [US7]

> Prerequisites: Phase 4 + Phase 5 complete.

### 7a. SEO

- [x] T095 [US7] Configure Inertia SSR: install `@inertiajs/server`, configure `resources/js/ssr.tsx`, configure `vite.config.ts` for SSR build — create `docs/libraries/inertia-ssr.md`
- [x] T096 [US7] Create SEO head component `resources/js/Components/UI/SeoHead.tsx`: dynamic title, meta description, keywords, OG tags — used in every public page
- [x] T097 [US7] Add JSON-LD schema.org/RealEstateListing to `Units/Show.tsx` and `Projects/Show.tsx` — structured data per `spec.md §PUB-10`
- [x] T098 [US7] Create `app/Http/Controllers/Public/SitemapController.php`: generate sitemap.xml dynamically — all active units, projects, articles, categories — auto-refresh on publish
- [x] T099 [US7] Create `public/robots.txt`: allow all crawlers, reference sitemap URL

### 7b. Performance

- [x] T100 [US7] Apply lazy loading to all images: add `loading="lazy"` + `width/height` attributes to prevent CLS — all UnitCard, ProjectCard, ArticleCard components
- [ ] T101 [US7] Add cache to SettingsService (already in T088), ListingService popular queries (cache 5 min), About page (cache 60 min) — use Laravel cache with file driver
- [ ] T102 [US7] Add Rate Limiting middleware to: contact form (5/hr/IP), search endpoint (60/min/IP) — configure in `app/Http/Kernel.php`

### 7c. Security

- [ ] T103 [US7] Add input sanitization: all user text inputs through `strip_tags()` + `htmlspecialchars()` in Services layer — no raw user input reaches DB or view
- [ ] T104 [US7] Install and configure `spatie/laravel-activitylog` for automated Audit Logging of critical models (Units, Points, Users). Run `php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"`.
- [ ] T105 [US7] Create `resources/js/Pages/Admin/ActivityLog/Index.tsx` to display logs for Administrators.

---

## Phase 8: Testing & Backup — الاختبارات والنسخ الاحتياطي

- [ ] T105.1 Install `spatie/laravel-backup` and schedule it in `routes/console.php` to run daily. Ensure it backs up database and storage.
- [ ] T105.2 Install `pestphp/pest-plugin-laravel`. Create Unit Tests for all `Points` and `Listings` Actions.
- [ ] T105.3 Create Feature Tests for critical user workflows: Login, Unit Creation, and Points Allocation.

---

## Phase 9: Polish & Cross-Cutting — التلميع النهائي

- [ ] T106 Verify ALL UI strings go through lang files — run grep for any hardcoded Arabic/English text in `.tsx` files: `grep -rn "\"[أ-ي]" resources/js` — fix any found
- [ ] T107 Verify RTL/LTR: add `dir={locale === 'ar' ? 'rtl' : 'ltr'}` to root layout + verify all Tailwind RTL classes (`rtl:mr-0`, `rtl:ml-4` etc.) applied correctly
- [ ] T108 Add Skeleton loaders to every page that doesn't have one: check all `Pages/Public/**` and `Pages/Admin/**` — verify loading state in each component
- [ ] T109 [P] Verify all image tags have `alt` attribute — run grep: `grep -rn "<img" resources/js | grep -v "alt="` — add missing alt texts
- [ ] T110 [P] Final DB index audit: run `EXPLAIN SELECT` on the 5 most common queries (unit listing with filters, search, popular searches, points ledger) — add missing indexes
- [ ] T111 Update `PROJECT_LOG.md`: mark Phase 0-7 complete, document all technical decisions made during implementation
- [ ] T112 Update `docs/libraries/` — ensure every installed package has a corresponding Arabic documentation file

---

## Implementation Strategy

### MVP Scope (Phase 1 + Phase 2 + Phase 4 minimal)
التسليم الأول: تثبيت المشروع + قاعدة البيانات + تسجيل الدخول + صفحة الوحدات العامة فقط.

### Recommended Execution Order
```
T001-T009  → T010-T025 (can split DB/Auth) → T026-T039
  → T040-T044 (DeepSeek: complex logic)
  → T046-T072 (Mimo: frontend)         [parallel with T040-T044]
  → T073-T092 (Mimo + DeepSeek)
  → T093-T094 → T095-T105 → T106-T112
```

### Parallelization Opportunities
| Parallel Group | Tasks | Note |
|---------------|-------|------|
| DB migrations | T010-T025 | All independent |
| Models | T026-T030 | All independent |
| Frontend components | T046-T052 | All independent |
| Admin sub-sections | T080, T089, T090 | Independent of each other |

---

## Completion Checklist

- [ ] All 112 tasks have: checkbox, TaskID, optional [P] and [Story] labels, clear description with file path
- [ ] Every phase independently testable per `quickstart.md` scenarios
- [ ] No business logic in Controllers (all delegate to Actions using DTOs)
- [ ] All DB write operations that involve points use DB::transaction()
- [ ] All UI strings via lang/ar and lang/en files (zero hardcoded text)
- [ ] All new packages have `docs/libraries/{name}.md` created in same task
- [ ] video_url (external links) and video_path (uploaded files) are separate columns — never both simultaneously
- [ ] Comparison limited to 4 items — enforced both frontend (Toast) and backend (validation)
- [ ] AllocatePointsPolicy: Admin has no balance limit; Manager is balance-checked

---

*Generated: 2026-07-17 — Ready for opencode execution*

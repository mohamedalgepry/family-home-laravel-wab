# Tasks: Remediation, Caching & Notifications Hardening

**Feature**: `010-remediation-caching-notifications`

**Input**: Design documents from `specs/010-remediation-caching-notifications/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, `constitution.md`

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **[P]**: يمكن تشغيلها بالتوازي (ملفات مختلفة، لا توجد تبعيات غير مكتملة)
- **[Story]**: تصنيف المهمة بحسب قصة المستخدم ([US1], [US2], [US3])

---

## Phase 1: Setup & Dependencies Verification

- [ ] T001 Verify project environment and check current npm audit baseline in `package.json`
- [ ] T002 [P] Backup current routes and controllers before remediation in `routes/web.php`

---

## Phase 2: Foundational (Prerequisites for all stories)

- [ ] T003 Execute `npm audit fix` and resolve vulnerable dependencies in `package.json` and `package-lock.json`
- [ ] T004 [P] Build frontend assets to verify zero compilation regressions via `npm run build:client` or `npm run build`

---

## Phase 3: User Story 1 — Remediation of All Discovered Issues (Priority: P1) 🎯 MVP

**Goal**: حل كافة الملاحظات الأمنية والتصميمية والمعمارية المرصودة في تقرير الفحص الشامل.  
**Independent Test**: التحقق من إضافة الـ throttle للـ login، وتوحيد لون زر الواتساب، وتحديث رفع صور المناطق عبر Action.

### Implementation Tasks for US1
- [ ] T005 [P] [US1] Attach `throttle:login` middleware to POST `/login` routes in `routes/web.php`
- [ ] T006 [P] [US1] Inject `<meta name="robots" content="noindex, nofollow" />` in Admin Head components in `resources/js/Pages/Admin/Dashboard.jsx` and `resources/js/Components/Layout/AdminSidebar.jsx`
- [ ] T007 [P] [US1] Update WhatsApp CTA button color classes from `bg-[#25D366]` to `bg-[#16a34a] hover:bg-[#15803d]` in `resources/js/Pages/Public/Agents/Show.jsx`
- [ ] T008 [P] [US1] Normalize validation error text classes in `resources/js/Pages/Public/Contact.jsx`
- [ ] T009 [US1] Refactor `AreaController` to inject `StoreUploadedImagesAction` for `image_path`, `hero_image`, and `gallery` uploads in `app/Http/Controllers/Admin/AreaController.php`

---

## Phase 4: User Story 2 — Deep Caching Audit & Hardening (Priority: P2)

**Goal**: إحكام وتدقيق طبقة التخزين المؤقت وضمان عدم وجود بيانات قديمة (Stale Data) بالاعتماد على Cache Versioning المعتمد (الخيار A).  
**Independent Test**: تعديل عقار أو مشروع في لوحة الإدارة وملاحظة زيادة `listing_cache_version` وانعكاس البيانات فوراً في الصفحة الرئيسية.

### Implementation Tasks for US2
- [ ] T010 [P] [US2] Verify and enforce `Cache::increment(ListingService::CACHE_VERSION_KEY)` on Unit save, update, and delete in `app/Domain/Listings/Models/Unit.php`
- [ ] T011 [P] [US2] Verify and enforce `Cache::increment(ListingService::CACHE_VERSION_KEY)` on Project save, update, and delete in `app/Domain/Listings/Models/Project.php`
- [ ] T012 [P] [US2] Audit `LookupObserver` to ensure immediate invalidation of `areas_lookup`, `unit_types_lookup`, `features_lookup`, `finishing_types_lookup` in `app/Observers/LookupObserver.php`
- [ ] T013 [P] [US2] Audit `Setting` and `PageSeo` models to ensure `settings_all` and `seo_pages_cache` are purged on save in `app/Domain/Listings/Models/Setting.php` and `app/Domain/Listings/Models/PageSeo.php`
- [ ] T014 [US2] Write an automated Pest test in `tests/Feature/DashboardStatisticsCacheTest.php` or a new test verifying cache version increment and immediate reflection on `HomeController`

---

## Phase 5: User Story 3 — Deep Notifications Audit & Hardening (Priority: P3)

**Goal**: إحكام منظومة الإشعارات والتحقق من دقة الأحداث ومزامنة العداد اللحظي دون أخطاء.  
**Independent Test**: إرسال رسالة عميل جديدة وملاحظة ظهور الإشعار في الهيدر، وتجربة "قراءة الكل" للتأكد من تصفير العداد وتفريغ الكاش.

### Implementation Tasks for US3
- [ ] T015 [P] [US3] Verify notification triggers for `NewMessageNotification` in `app/Http/Controllers/Public/MessageController.php`
- [ ] T016 [P] [US3] Verify notification triggers for `NewAssistantLeadNotification` in `app/Domain/Assistant/Services/AssistantOrchestratorService.php` and `app/Http/Controllers/Admin/AssistantLeadController.php`
- [ ] T017 [P] [US3] Verify `NotificationService::invalidateCache` purges `user_{$id}_unread_count` on `markAllAsRead`, `dismiss`, and `clearAll` in `app/Domain/Users/Services/NotificationService.php`
- [ ] T018 [US3] Audit `AdminSidebar.jsx` realtime counter synchronization, Stale-While-Revalidate prefetching, and audio chime error-handling in `resources/js/Components/Layout/AdminSidebar.jsx`
- [ ] T019 [US3] Add or run integration test for notification actions in `tests/Feature/NotificationActionsTest.php`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T020 [P] Re-run `npm audit` to verify zero remaining critical vulnerabilities
- [ ] T021 [P] Verify `routes/web.php` syntax and route list via `php artisan route:list`
- [ ] T022 Re-build production assets with `npm run build:client` or `npm run build`
- [ ] T023 Run end-to-end validation scenarios documented in `quickstart.md`
- [ ] T024 Update Spec-Kit feature status and compile execution completion summary

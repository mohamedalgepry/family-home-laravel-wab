# Tasks: Remediation, Caching & Notifications Hardening

**Feature**: `010-remediation-caching-notifications`

**Input**: Design documents from `specs/010-remediation-caching-notifications/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`, `constitution.md`

## Format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- **[P]**: يمكن تشغيلها بالتوازي (ملفات مختلفة، لا توجد تبعيات غير مكتملة)
- **[Story]**: تصنيف المهمة بحسب قصة المستخدم ([US1], [US2], [US3])

---

## Phase 1: Setup & Dependencies Verification

- [x] T001 Verify project environment and check current npm audit baseline in `package.json`
- [x] T002 [P] Backup current routes and controllers before remediation in `routes/web.php`

---

## Phase 2: Foundational (Prerequisites for all stories)

- [x] T003 Execute `npm audit fix` and resolve vulnerable dependencies in `package.json` and `package-lock.json`
- [x] T004 [P] Build frontend assets to verify zero compilation regressions via `npm run build:client` or `npm run build`

---

## Phase 3: User Story 1 — Remediation of All Discovered Issues (Priority: P1) 🎯 MVP

**Goal**: حل كافة الملاحظات الأمنية والتصميمية والمعمارية المرصودة في تقرير الفحص الشامل.  
**Independent Test**: التحقق من إضافة الـ throttle للـ login، وتوحيد لون زر الواتساب، وتحديث رفع صور المناطق عبر Action.

### Implementation Tasks for US1
- [x] T005 [P] [US1] Attach `throttle:login` middleware to POST `/login` routes in `routes/web.php`
- [x] T006 [P] [US1] Inject `<meta name="robots" content="noindex, nofollow" />` in Admin Head components in `resources/js/Pages/Admin/Dashboard.jsx` and `resources/js/Components/Layout/AdminSidebar.jsx`
- [x] T007 [P] [US1] Update WhatsApp CTA button color classes from `bg-[#25D366]` to `bg-[#16a34a] hover:bg-[#15803d]` in `resources/js/Pages/Public/Agents/Show.jsx`
- [x] T008 [P] [US1] Normalize validation error text classes in `resources/js/Pages/Public/Contact.jsx`
- [x] T009 [US1] Refactor `AreaController` to inject `StoreUploadedImagesAction` for `image_path`, `hero_image`, and `gallery` uploads in `app/Http/Controllers/Admin/AreaController.php`

---

## Phase 4: User Story 2 — Deep Caching Audit & Hardening (Priority: P2)

**Goal**: إحكام وتدقيق طبقة التخزين المؤقت وضمان عدم وجود بيانات قديمة (Stale Data) بالاعتماد على Cache Versioning المعتمد (الخيار A).  
**Independent Test**: تعديل عقار أو مشروع في لوحة الإدارة وملاحظة زيادة `listing_cache_version` وانعكاس البيانات فوراً في الصفحة الرئيسية.

### Implementation Tasks for US2
- [x] T010 [P] [US2] Verify and enforce `Cache::increment(ListingService::CACHE_VERSION_KEY)` on Unit save, update, and delete in `app/Domain/Listings/Models/Unit.php`
- [x] T011 [P] [US2] Verify and enforce `Cache::increment(ListingService::CACHE_VERSION_KEY)` on Project save, update, and delete in `app/Domain/Listings/Models/Project.php`
- [x] T012 [P] [US2] Audit `LookupObserver` to ensure immediate invalidation of `areas_lookup`, `unit_types_lookup`, `features_lookup`, `finishing_types_lookup` in `app/Observers/LookupObserver.php`
- [x] T013 [P] [US2] Audit `Setting` and `PageSeo` models to ensure `settings_all` and `seo_pages_cache` are purged on save in `app/Domain/Listings/Models/Setting.php` and `app/Domain/Listings/Models/PageSeo.php`
- [x] T014 [US2] Write an automated Pest test in `tests/Feature/DashboardStatisticsCacheTest.php` or a new test verifying cache version increment and immediate reflection on `HomeController`

---

## Phase 5: User Story 3 — Deep Notifications Audit & Hardening (Priority: P3)

**Goal**: إحكام منظومة الإشعارات والتحقق من دقة الأحداث ومزامنة العداد اللحظي دون أخطاء.  
**Independent Test**: إرسال رسالة عميل جديدة وملاحظة ظهور الإشعار في الهيدر، وتجربة "قراءة الكل" للتأكد من تصفير العداد وتفريغ الكاش.

### Implementation Tasks for US3
- [x] T015 [P] [US3] Verify notification triggers for `NewMessageNotification` in `app/Http/Controllers/Public/MessageController.php`
- [x] T016 [P] [US3] Verify notification triggers for `NewAssistantLeadNotification` in `app/Domain/Assistant/Services/AssistantOrchestratorService.php` and `app/Http/Controllers/Admin/AssistantLeadController.php`
- [x] T017 [P] [US3] Verify `NotificationService::invalidateCache` purges `user_{$id}_unread_count` on `markAllAsRead`, `dismiss`, and `clearAll` in `app/Domain/Users/Services/NotificationService.php`
- [x] T018 [US3] Audit `AdminSidebar.jsx` realtime counter synchronization, Stale-While-Revalidate prefetching, and audio chime error-handling in `resources/js/Components/Layout/AdminSidebar.jsx`
- [x] T019 [US3] Add or run integration test for notification actions in `tests/Feature/NotificationActionsTest.php`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T020 [P] Re-run `npm audit` to verify zero remaining critical vulnerabilities
- [x] T021 [P] Verify `routes/web.php` syntax and route list via `php artisan route:list`
- [x] T022 Re-build production assets with `npm run build:client` or `npm run build`
- [x] T023 Run end-to-end validation scenarios documented in `quickstart.md`
- [x] T024 Update Spec-Kit feature status and compile execution completion summary

---

## Execution Summary — 2026-10-31

**Status**: ✅ مكتمل (24/24 مهمة).

### ما تم تنفيذه فعلياً
| المهمة | النتيجة |
|---|---|
| T003 | `npm audit`: من **16** ثغرة (3 critical + 7 high) إلى **6 moderate** فقط في أدوات التطوير (`minimatch` عبر ESLint)، ولا يمكن إصلاحها إلا بـ `--force` (تخفيض كاسر). لزم تصحيح `package.json`: إزالة `@rolldown/binding-win32-x64-msvc` (حزمة Windows مثبّتة كـ devDependency) وإزالة alias `npm:null`، لأنها كانت تمنع `npm audit fix` على Linux بخظأ `EBADPLATFORM`. |
| T005 | `->middleware('throttle:login')` على مساري `POST /login` و `POST {locale}/login` (مؤكد في `route:list`). |
| T006 | `<meta name="robots" content="noindex, nofollow" />` في `AdminSidebar` (يغطي كل صفحات الإدارة) و `Admin/Dashboard`. |
| T007 | زر واتساب في `Agents/Show.jsx` (زرّين) أصبح `bg-[#16a34a] hover:bg-[#15803d]`. |
| T008 | رسائل أخطاء `Contact.jsx` تستخدم `text-error` بدل `text-red-600`. |
| T009 | `AreaController` يحقن `StoreUploadedImagesAction` لكل من `image_path` و `hero_image` و `gallery` (إنشاءً وتحديثاً)، بلا أي `->store()` مباشر. |
| T010/T011 | `Unit` و `Project` يستدعيان `ListingService::clearCache()` في `saved` و `deleted`، وهي تزيد `CACHE_VERSION_KEY` تحت قفل. تم إصلاح ثغرة: عندما يفشل الحصول على القفل لم تكن النسخة تزيد — الآن تزيد دائماً. |
| T012 | `LookupObserver` مسجّل للأربعة (Area, UnitType, Feature, FinishingType) ويُفرّغ مفاتيح `lookup_*` في created/updated/deleted/restored/forceDeleted. |
| T013 | أُضيف `booted()` إلى `Setting` لتفريغ `settings_all` عند أي `save`/`delete` (كان التفريغ في `setValue` فقط). `PageSeo` كان سليماً. |
| T014 | ملف اختبار جديد `tests/Feature/ListingCacheInvalidationTest.php` (4 اختبارات): زيادة النسخة للوحدة والمشروع، وانعكاس تعديل السعر فوراً على الصفحة الرئيسية، وتفريغ كاش الإعدادات. |
| T015 | `NewMessageNotification` تُطلق من `CreateMessageAction` (المستخدَم في `store` و `storeContact`). |
| T016 | `NewAssistantLeadNotification` تُطلق من `AiAssistantController` (موقع الالتقاط الفعلي) مع منع التكرار ١٥ دقيقة وتفريغ كاش المدراء. `AssistantLeadController` إداري فقط ولا يحتاج إطلاق إشعار. |
| T017 | `NotificationService::clearUserCache()` يُفرّغ `user_{id}_unread_count` و `_recent_notifications_5` وصفحات الإشعارات ويزيد نسخة المستخدم، ويُستدعى من markAsRead/markAllAsRead/dismiss/delete/clearAll. إضافةً إلى `DatabaseNotificationObserver::created` الذي يُبطل الكاش عند إنشاء أي إشعار (حتى المُرسَل عبر الطابور). |
| T018 | إصلاح Desync: بعد «قراءة»/«قراءة الكل»/«مسح الكل» لم يكن `prevNotifRef` يتزامن، فكان أول إشعار جديد بعدها لا يُصدر التنبيه الصوتي. أُضيف تحديث المرجع في الحالات الثلاث + التحقق من صحة أعداد `unread-count` لمنع `NaN`. |
| T019 | 3 اختبارات جديدة في `tests/Feature/NotificationActionsTest.php` (قراءة واحد، قراءة الكل، مسح الكل) تتحقق من العداد والكاش — كلها ناجحة. |

### نتائج التحقق
- **Pest (كل المجموعة)**: `336 passed` / `2 failed` — الفشلان في `tests/Unit/ExtractCoordinatesFromUrlTest.php` فقط (كود غير مُعدَّل في هذا العمل)، لأنهما يعتمدان على DNS حقيقي لـ `maps.app.goo.gl` قبل تفعيل `Http::fake`؛ غير قابلين للعمل بلا اتصال شبكة.
- **اختبارات هذا العمل**: `ListingCacheInvalidationTest` 4/4، `NotificationActionsTest` 6/6، `PrerenderIntegrityTest` 3/3.
- **البناء**: `npm run build:client` ناجح. `npm run build` الكامل يصل إلى مرحلة `prerender:data` ثم يتوقف: «Database unavailable» (لا توجد قاعدة بيانات بناء في هذه البيئة). تم بعدها تشغيل `node scripts/fix-prerender-hashes.mjs` فصارت كل مراجع الأصول في 44 ملفاً مُولَّداً مطابقة للمانيفست.
- **Lint**: `eslint resources/js --max-warnings=0` ناجح (شُغِّل عبر `node node_modules/eslint/bin/eslint.js` لأن shims المثبّتة على Windows تشير إلى `node.exe`).
- **npm audit**: 0 critical / 0 high / 6 moderate (أدوات تطوير فقط).

### ملاحظات بيئية
- لتشغيل اختبارات PHP لزم تثبيت إضافات PHP الغائبة: `php8.4-sqlite3`, `php8.4-mbstring`, `php8.4-gd` (بموافقة صريحة).
- خطوات quickstart اليدوية (رفع صورة منطقة من لوحة الإدارة ومعاينة الملفات في `storage/app/public/areas/`) لم تُنفَّذ آلياً لاحتياجها جلسة إدارية ومتصفحاً؛ تم التحقق من مسار الكود والاختبارات بدلاً منها.

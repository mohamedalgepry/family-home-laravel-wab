# Implementation Tasks: Full Site Review & Audit

**Feature**: `009-full-site-review-audit`  
**Created**: 2026-10-31  

> `[P]` = يمكن تنفيذه بالتوازي مع tasks أخرى في نفس الـ Phase  
> كل task = فحص منطقة واحدة محددة من الكود

---

## Phase 1: Security & Auth — الأمان والمصادقة

- [X] **1.1** فحص Admin routes middleware
  - افتح `routes/web.php` وتحقق أن كل route داخل `/admin` له `middleware(['auth', 'admin'])` أو ما يعادله
  - تحقق أنه لا يوجد admin route بدون middleware
  - ابحث عن أي endpoint يعيد بيانات admin لمستخدم غير مصادَق
  - **Depends on**: None
  - **Requirement**: FR-01.1
  - **Files**: `routes/web.php`, `app/Http/Middleware/`
  - **Command**: `grep -n "admin" routes/web.php | grep -v "middleware"`

- [X] **1.2 [P]** فحص Rate Limiting
  - تحقق من وجود throttle middleware على: login, OTP verification, contact form, AI assistant chat
  - تحقق من القيم: login ≤ 5/min، OTP ≤ 3/min، contact ≤ 10/hour، AI ≤ 20/min
  - **Depends on**: None
  - **Requirement**: FR-01.2
  - **Files**: `app/Http/Controllers/Auth/LoginController.php`, `routes/web.php`, `app/Http/Controllers/Public/AiAssistantController.php`
  - **Command**: `grep -rn "throttle\|RateLimiter" app/ routes/`

- [X] **1.3 [P]** فحص File Upload Security
  - افحص كل upload endpoints في MediaController وغيره
  - تحقق من: MIME type validation، file size limit، منع PHP/exe files
  - تحقق أن الملفات تُحفَظ خارج `public/` مباشرة أو بدون execute permission
  - **Depends on**: None
  - **Requirement**: FR-01.3
  - **Files**: `app/Http/Controllers/Admin/MediaController.php`, `app/Domain/*/Actions/*`
  - **Command**: `grep -rn "validate\|mimes\|max:" app/ --include="*.php" | grep -i "image\|file\|upload"`

- [X] **1.4 [P]** فحص SQL Injection
  - ابحث عن أي raw DB queries في Controllers وActions
  - تحقق أن كل `DB::select()`, `DB::statement()`, `whereRaw()` تستخدم bindings
  - **Depends on**: None
  - **Requirement**: FR-01.4
  - **Files**: `app/Http/Controllers/**/*.php`, `app/Domain/**/*.php`
  - **Command**: `grep -rn "DB::select\|DB::statement\|whereRaw\|orderByRaw" app/ --include="*.php"`

- [X] **1.5 [P]** فحص XSS في React Pages
  - ابحث عن `dangerouslySetInnerHTML` في كل JSX files
  - تحقق أن AI responses وarticle content لا تُعرض كـ raw HTML بدون sanitization
  - تحقق أن user-generated content (comments، messages) مُعقَّم
  - **Depends on**: None
  - **Requirement**: FR-01.5
  - **Files**: `resources/js/Pages/**/*.jsx`, `resources/js/Components/**/*.jsx`
  - **Command**: `grep -rn "dangerouslySetInnerHTML\|innerHTML" resources/js/ --include="*.jsx"`

- [X] **1.6 [P]** فحص CSRF Protection
  - تحقق أن كل Inertia forms ترسل CSRF token
  - تحقق من الـ API routes أنها إما protected بـ Sanctum أو محمية بـ CSRF
  - **Depends on**: None
  - **Requirement**: FR-01.6
  - **Files**: `routes/web.php`, `app/Http/Middleware/VerifyCsrfToken.php`
  - **Command**: `cat app/Http/Middleware/VerifyCsrfToken.php`

- [X] **1.7 [P]** فحص Secrets & Environment Exposure
  - تحقق أن `.env` يُعطي 404 عبر HTTP
  - ابحث عن API keys مكتوبة hardcoded في الكود
  - تحقق من `.env.example` لا يحتوي قيم حقيقية
  - **Depends on**: None
  - **Requirement**: FR-01.7
  - **Files**: `.env.example`, `config/`, `resources/js/`
  - **Command**: `grep -rn "sk-\|AIza\|secret\|password" resources/js/ --include="*.jsx" --include="*.js"`

---

## Phase 2: Database & Performance — قاعدة البيانات والأداء

- [X] **2.1** فحص Database Indexes في Migrations
  - افحص 67 migration file وحدد الـ columns المستخدمة في WHERE بدون index
  - تحقق من: `slug` (unique)، `status`، `region_id`/`area_id`، `created_at`، `user_id`
  - وثّق كل missing index كـ finding
  - **Depends on**: 1.1
  - **Requirement**: FR-06.4
  - **Files**: `database/migrations/`
  - **Command**: `php artisan db:show --counts && php artisan migrate:status`

- [X] **2.2 [P]** فحص N+1 Queries في Public Controllers
  - افحص: HomeController، UnitController (public)، ProjectController (public)، AreaController، ArticleController
  - ابحث عن: علاقات تُستخدم في JSX بدون `with()` في Controller
  - وثّق كل N+1 بالـ controller واسم الـ relationship
  - **Depends on**: 1.1
  - **Requirement**: FR-02.1
  - **Files**: `app/Http/Controllers/Public/*.php`
  - **Command**: `grep -n "->all()\|paginate\|with(" app/Http/Controllers/Public/*.php`

- [X] **2.3 [P]** فحص N+1 Queries في Admin Controllers
  - افحص: DashboardController، UnitController (admin)، ProjectController (admin)، UserController
  - نفس منهجية 2.2 لكن على admin controllers
  - **Depends on**: 1.1
  - **Requirement**: FR-02.1
  - **Files**: `app/Http/Controllers/Admin/*.php`
  - **Command**: `grep -n "->all()\|paginate\|with(" app/Http/Controllers/Admin/*.php`

- [X] **2.4 [P]** فحص Caching Strategy
  - تحقق أن dashboard statistics تأتي من cache
  - تحقق أن regions/categories/settings مُخزَّنة في cache
  - وثّق أي بيانات ثابتة تُجلب بدون cache
  - **Depends on**: 1.1
  - **Requirement**: FR-02.3
  - **Files**: `app/Http/Controllers/Admin/DashboardController.php`, `app/Domain/*/Services/*.php`
  - **Command**: `grep -rn "Cache::remember\|cache(" app/ --include="*.php"`

- [X] **2.5 [P]** فحص Inertia Props Size
  - افحص كل Controller يعيد Inertia::render
  - تحقق أنه يستخدم API Resources لا raw models
  - تحقق أنه يُرسل `select(['id','title',...])` لا `select('*')`
  - **Depends on**: 1.1
  - **Requirement**: FR-02.2
  - **Files**: `app/Http/Controllers/**/*.php`
  - **Command**: `grep -rn "Inertia::render" app/ --include="*.php" -A 5`

- [X] **2.6 [P]** فحص Frontend Bundle Size
  - نفّذ `npm run build` وافحص حجم الـ assets
  - ابحث عن heavy imports (lodash, moment, full icon libraries)
  - تحقق من code splitting على Admin pages
  - **Depends on**: None
  - **Requirement**: FR-02.5
  - **Files**: `vite.config.js`, `package.json`, `resources/js/`
  - **Command**: `npm run build 2>&1 | grep -E "dist|\.js|\.css|kB|MB"`

- [X] **2.7 [P]** فحص Image Optimization
  - افحص `<img>` tags في كل JSX files للتحقق من: `loading="lazy"`, `width`, `height`, `decoding="async"`
  - تحقق أن hero images تستخدم `loading="eager"`
  - تحقق أن `OptimizedImage` component مستخدم في كل مكان
  - **Depends on**: None
  - **Requirement**: FR-02.4
  - **Files**: `resources/js/Pages/Public/**/*.jsx`, `resources/js/Components/UI/OptimizedImage.jsx`
  - **Command**: `grep -rn "<img " resources/js/ --include="*.jsx" | grep -v "loading="`

---

## Phase 3: SEO Audit — تهيئة محركات البحث

- [X] **3.1** فحص Head/Meta Tags على كل صفحة عامة
  - افحص الـ 11 صفحة عامة: Home, Units/Index, Units/Show, Projects/Index, Projects/Show, Areas/Show, Articles/Index, Articles/Show, About, Contact, Agents/Show
  - لكل صفحة: هل يوجد `<Head>` أو `SeoHead` مع title + description ديناميكيان؟
  - وثّق الصفحات الناقصة
  - **Depends on**: 2.6
  - **Requirement**: FR-03.1
  - **Files**: `resources/js/Pages/Public/**/*.jsx`
  - **Command**: `grep -rL "Head\|SeoHead" resources/js/Pages/Public/ --include="*.jsx"`

- [X] **3.2 [P]** فحص Open Graph Tags
  - لكل صفحة عامة، تحقق من: `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`
  - تحقق أن `og:locale` = `ar_EG` للصفحات العربية
  - تحقق أن `og:image` URL مطلق وليس نسبي
  - **Depends on**: 3.1
  - **Requirement**: FR-03.2
  - **Files**: `resources/js/Pages/Public/**/*.jsx`, `resources/js/Components/UI/SeoHead.jsx`
  - **Command**: `grep -rn "og:image\|og:title\|og:locale" resources/js/ --include="*.jsx"`

- [X] **3.3 [P]** فحص JSON-LD Structured Data
  - تحقق من وجود JSON-LD في: Units/Show (RealEstateListing)، Projects/Show (RealEstateListing)، Articles/Show (Article)، Areas/Show (LocalBusiness)، Home (WebSite)
  - تحقق من صحة الـ schema (type، required fields)
  - وثّق الصفحات الناقصة
  - **Depends on**: 3.1
  - **Requirement**: FR-03.3
  - **Files**: `resources/js/Pages/Public/**/*.jsx`
  - **Command**: `grep -rn "application/ld+json\|@type.*RealEstate\|@type.*Article" resources/js/ --include="*.jsx"`

- [X] **3.4 [P]** فحص Sitemap Endpoints
  - اختبر كل: `/sitemap.xml`, `/sitemap-units.xml`, `/sitemap-projects.xml`, `/sitemap-areas.xml`, `/sitemap-articles.xml`, `/sitemap-static.xml`
  - تحقق أن كل URL يحتوي `<lastmod>`, `<changefreq>`, `<priority>`
  - تحقق أن draft/inactive items مُستبعدة
  - **Depends on**: None
  - **Requirement**: FR-03.4
  - **Files**: `app/Http/Controllers/Public/SitemapController.php`
  - **Command**: `php artisan route:list | grep sitemap`

- [X] **3.5 [P]** فحص robots.txt وCanonical Tags
  - تحقق أن `robots.txt` يحجب `/admin/` و `/dashboard/`
  - تحقق من canonical tags على paginated pages
  - تحقق من admin pages لها `noindex` meta tag
  - **Depends on**: 3.1
  - **Requirement**: FR-03.5, FR-03.6, FR-03.7
  - **Files**: `public/robots.txt`, `resources/js/Pages/Admin/**/*.jsx`
  - **Command**: `cat public/robots.txt && grep -rn "noindex\|canonical" resources/js/Pages/Admin/ --include="*.jsx"`

---

## Phase 4: Design Audit — مراجعة التصميم

- [X] **4.1** فحص Brand Colors Compliance
  - ابحث عن Tailwind color classes (text-red-*, bg-red-*, text-green-*) في JSX files
  - وثّق كل استخدام لألوان Tailwind بدلاً من brand tokens
  - تحقق أن WhatsApp buttons تستخدم `#16a34a` فقط
  - **Depends on**: 3.5
  - **Requirement**: FR-04.1
  - **Files**: `resources/js/Pages/**/*.jsx`, `resources/js/Components/**/*.jsx`
  - **Command**: `grep -rn "text-red-\|bg-red-\|text-green-\|bg-green-\|text-blue-\|bg-blue-" resources/js/ --include="*.jsx" | wc -l`

- [X] **4.2 [P]** فحص RTL Layout
  - ابحث عن `ml-`, `pl-`, `left-`, `text-left`, `border-l-` في RTL context
  - تحقق من flex direction في components يجب أن تعكس للـ RTL
  - تحقق من icon positioning (arrows، chevrons)
  - **Depends on**: 3.5
  - **Requirement**: FR-04.3
  - **Files**: `resources/js/Pages/Public/**/*.jsx`, `resources/js/Components/Layout/**/*.jsx`
  - **Command**: `grep -rn "ml-[0-9]\|pl-[0-9]\| left-[0-9]" resources/js/ --include="*.jsx" | wc -l`

- [X] **4.3 [P]** فحص Component Consistency
  - تحقق أن `UI/Button.jsx` مستخدم وليس buttons مخصصة في كل مكان
  - تحقق أن `UI/InputField.jsx` مستخدم في كل forms
  - وثّق كل button/input لا يستخدم الـ shared component
  - **Depends on**: None
  - **Requirement**: FR-04.4
  - **Files**: `resources/js/Pages/**/*.jsx`
  - **Command**: `grep -rn "<button\|<input " resources/js/Pages/ --include="*.jsx" | grep -v "//"`

- [X] **4.4 [P]** فحص Cairo Font Usage
  - تحقق أن Cairo font مُحمَّل صح في `resources/js/app.jsx` أو الـ layout
  - تحقق من `tailwind.config.js` أن `fontFamily.sans` = Cairo
  - ابحث عن `font-mono` أو `font-serif` في الـ UI
  - **Depends on**: None
  - **Requirement**: FR-04.2
  - **Files**: `resources/js/app.jsx`, `tailwind.config.js`, `resources/css/`
  - **Command**: `grep -rn "Cairo\|font-family" resources/css/ resources/js/app.jsx tailwind.config.js`

- [X] **4.5 [P]** فحص Empty/Loading/Error States
  - لكل صفحة listing (Units, Projects, Areas, Articles)، تحقق من: empty state عند عدم وجود نتائج، loading skeleton أثناء الجلب، error state عند فشل الطلب
  - **Depends on**: None
  - **Requirement**: FR-04.6
  - **Files**: `resources/js/Pages/Public/**/*.jsx`, `resources/js/Pages/Admin/**/*.jsx`
  - **Command**: `grep -rn "empty\|loading\|skeleton\|error" resources/js/Pages/ --include="*.jsx" -l`

- [X] **4.6 [P]** فحص Mobile Responsiveness
  - افحص كل صفحة عامة للتأكد من responsive grid classes (sm:, md:, lg:)
  - ابحث عن fixed widths قد تسبب horizontal scroll
  - تحقق من touch target sizes (min 44px)
  - **Depends on**: None
  - **Requirement**: FR-04.5
  - **Files**: `resources/js/Pages/Public/**/*.jsx`
  - **Command**: `grep -rn "w-\[.*px\]\|min-w-" resources/js/Pages/ --include="*.jsx"`

---

## Phase 5: Admin Panel Review — مراجعة لوحة الإدارة

- [X] **5.1** فحص Admin Dashboard
  - افحص `Admin/Dashboard.jsx`: هل كل Stats cards موجودة؟ Links تعمل؟
  - افحص `DashboardController.php`: هل statistics من cache؟ N+1؟
  - **Depends on**: 4.1
  - **Requirement**: FR-05.1
  - **Files**: `resources/js/Pages/Admin/Dashboard.jsx`, `app/Http/Controllers/Admin/DashboardController.php`

- [X] **5.2 [P]** فحص Units Admin Section
  - افحص `Admin/Units/Index.jsx`: Search، Filter، Pagination
  - افحص `Admin/Units/Form.jsx`: كل الحقول، Image upload، validation
  - تحقق من actions: approve، pin، deal، extend-expiry، adjust-points، force-delete
  - **Depends on**: 4.1
  - **Requirement**: FR-05.5
  - **Files**: `resources/js/Pages/Admin/Units/`, `app/Http/Controllers/Admin/UnitController.php`

- [X] **5.3 [P]** فحص Projects Admin Section
  - افحص autofill endpoint يعمل
  - افحص approval + extension workflow
  - افحص image management
  - **Depends on**: 4.1
  - **Requirement**: FR-05.1
  - **Files**: `resources/js/Pages/Admin/Projects/`, `app/Http/Controllers/Admin/ProjectController.php`

- [X] **5.4 [P]** فحص Users Admin Section
  - تحقق من: role change، toggle active، check-relations قبل حذف، change-password، transfer-projects، assign-agents
  - تحقق أن passwords لا تظهر في أي response
  - **Depends on**: 4.1
  - **Requirement**: FR-05.6
  - **Files**: `resources/js/Pages/Admin/Users/`, `app/Http/Controllers/Admin/UserController.php`

- [X] **5.5 [P]** فحص Notifications System
  - تحقق من: unread count badge في الهيدر يتحدث، mark as read، read-all، dismiss، clear-all
  - تحقق من `/admin/notifications/recent` endpoint يعمل
  - تحقق من empty state
  - **Depends on**: 4.1
  - **Requirement**: FR-05.2
  - **Files**: `resources/js/Pages/Admin/Notifications/Index.jsx`, `resources/js/Components/Layout/AdminSidebar.jsx`, `app/Http/Controllers/Admin/NotificationController.php`

- [X] **5.6 [P]** فحص Messages & Assistant Leads
  - تحقق من: mark as replied، export CSV، WhatsApp quick reply link، filter by status/date
  - تحقق من Assistant Leads: export، mark contacted
  - **Depends on**: 4.1
  - **Requirement**: FR-05.3
  - **Files**: `resources/js/Pages/Admin/Messages/Index.jsx`, `resources/js/Pages/Admin/AssistantLeads/Index.jsx`

- [X] **5.7 [P]** فحص SEO Pages & Settings Admin
  - تحقق من SEO Pages: edit meta + character count warning
  - تحقق من Settings: save وreflect على الموقع
  - **Depends on**: 4.1
  - **Requirement**: FR-05.1
  - **Files**: `resources/js/Pages/Admin/SeoPages/Index.jsx`, `resources/js/Pages/Admin/Settings/Index.jsx`

- [X] **5.8 [P]** فحص Points System
  - تحقق من: allocate، daily-deduct، monthly-reset، ledger view
  - تحقق أن unit-level adjust-points يُسجَّل في ledger
  - **Depends on**: 4.1
  - **Requirement**: FR-05.4
  - **Files**: `resources/js/Pages/Admin/Points/`, `app/Http/Controllers/Admin/PointsController.php`

- [X] **5.9 [P]** فحص AI Assistant Knowledge
  - تحقق من: CRUD على knowledge entries، toggle، clear-cache
  - تحقق من Auth: لا يصل مستخدم عادي
  - **Depends on**: 4.1
  - **Requirement**: FR-05.1
  - **Files**: `resources/js/Pages/Admin/Assistant/Knowledge.jsx`, `app/Http/Controllers/Admin/AiKnowledgeController.php`

- [X] **5.10 [P]** فحص Reference Data Sections
  - فحص Categories، Features، FinishingTypes، UnitTypes، Areas، Articles
  - لكل منها: inline CRUD، validation (لا تكرار)، cascade delete behavior
  - **Depends on**: 4.1
  - **Requirement**: FR-05.1
  - **Files**: `resources/js/Pages/Admin/{Categories,Features,FinishingTypes,UnitTypes}/`

---

## Phase 6: Code Quality — جودة وتنظيم الكود

- [X] **6.1** فحص Debug Statements في Production
  - ابحث عن `dd()`, `dump()`, `var_dump()`, `print_r()` في PHP
  - ابحث عن `console.log`, `console.error`, `console.warn`, `debugger` في JS
  - وثّق كل occurrence بالملف والسطر
  - **Depends on**: 5.10
  - **Requirement**: FR-06.1
  - **Files**: `app/`, `resources/js/`
  - **Command**: `grep -rn "dd(\|dump(\|var_dump(" app/ --include="*.php" && grep -rn "console\." resources/js/ --include="*.jsx" | grep -v "//.*console"`

- [X] **6.2 [P]** فحص TODO/FIXME Comments
  - ابحث عن TODO, FIXME, HACK, XXX, TEMP comments
  - صنّف: blocking (يؤثر على functionality) vs non-blocking
  - **Depends on**: 5.10
  - **Requirement**: FR-06.1
  - **Files**: `app/`, `resources/js/`
  - **Command**: `grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP" app/ resources/js/ --include="*.php" --include="*.jsx"`

- [X] **6.3 [P]** فحص Controller Size & SRP
  - احسب عدد الأسطر لكل controller
  - وثّق Controllers > 200 سطر كـ candidates لـ refactoring
  - تحقق أن business logic في Actions وليس Controllers
  - **Depends on**: None
  - **Requirement**: FR-06.2
  - **Files**: `app/Http/Controllers/**/*.php`
  - **Command**: `wc -l app/Http/Controllers/**/*.php app/Http/Controllers/Admin/*.php | sort -rn | head -20`

- [X] **6.4 [P]** فحص Test Coverage
  - راجع existing test files في `tests/Feature/`
  - حدد: critical paths بدون tests، tests قديمة لا تغطي الـ current behavior
  - **Depends on**: None
  - **Requirement**: FR-06.3
  - **Files**: `tests/Feature/`
  - **Command**: `./vendor/bin/pest --list 2>/dev/null | wc -l && ls tests/Feature/ | wc -l`

- [X] **6.5 [P]** فحص Orphaned Code
  - ابحث عن Models بدون routes تشير إليها
  - ابحث عن Controllers بدون routes
  - ابحث عن JSX components لا تُستخدم في أي page
  - **Depends on**: None
  - **Requirement**: FR-06.5
  - **Files**: `app/Http/Controllers/`, `resources/js/Components/`
  - **Command**: `php artisan route:list --json 2>/dev/null | python3 -c "import sys,json;d=json.load(sys.stdin);[print(r['action']) for r in d]" | sort -u`

- [X] **6.6 [P]** فحص Hardcoded Arabic Strings
  - ابحث عن Arabic text مكتوب مباشرة في JSX بدلاً من استخدام ملفات الترجمة
  - ابحث عن Arabic text في PHP controllers
  - **Depends on**: None
  - **Requirement**: FR-06.1 (implied)
  - **Files**: `resources/js/Pages/**/*.jsx`, `app/Http/Controllers/**/*.php`
  - **Command**: `grep -rn "[\\u0600-\\u06FF]" resources/js/Pages/ --include="*.jsx" | grep -v "//\|lang\|translation" | wc -l`

---

## Phase 7: Compile Final Report — التقرير النهائي

- [X] **7.1** تجميع نتائج كل الـ phases
  - اجمع كل الـ findings من Phases 1-6
  - صنّف حسب الـ severity: Critical → High → Medium → Low
  - احسب الإجماليات لكل category
  - **Depends on**: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
  - **Requirement**: All FRs

- [X] **7.2** كتابة التقرير الشامل
  - أنشئ `FULL_AUDIT_REPORT.md` في `.specify/specs/009-full-site-review-audit/`
  - ملخص تنفيذي + جدول إجمالي
  - Critical findings مع: الملف، السطر، الوصف، الحل
  - High/Medium/Low findings
  - قائمة ما يعمل بشكل صحيح ✅
  - خطة عمل مقترحة مرتّبة بالأولوية
  - **Depends on**: 7.1
  - **Requirement**: All FRs

---

## Notes

- `[P]` يعني يمكن تنفيذه بالتوازي مع tasks أخرى في نفس الـ Phase
- كل task تنتج findings section في التقرير النهائي
- الـ Phase ترتيب مقترح — يمكن تغييره حسب الحاجة
- الفحص read-only فقط — لا تعديل كود خلال المراجعة
- الـ commands المذكورة مساعدة — قد تحتاج تعديل حسب بيئة التشغيل


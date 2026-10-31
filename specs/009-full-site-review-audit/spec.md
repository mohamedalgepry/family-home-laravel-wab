# Feature Specification: Full Site Review & Audit

**Feature Branch**: `009-full-site-review-audit`

**Created**: 2026-10-31

**Status**: Draft

---

## Problem Statement

منصة Family Home العقارية تحتاج إلى مراجعة شاملة لضمان:
- خلو الكود من المشاكل الأمنية والأخطاء البرمجية
- أداء سريع يحقق معايير Core Web Vitals
- تهيئة كاملة لمحركات البحث (SEO)
- تصميم متسق مع هوية العلامة التجارية
- لوحة إدارة تعمل بكفاءة في كل أقسامها
- كود نظيف وقابل للصيانة

المشروع نما بشكل تدريجي وبات من الضروري إجراء فحص منهجي شامل لكل جزء من أجزائه قبل أي توسّع مستقبلي.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — فحص الأمان والصلاحيات (Priority: P1)

مشرف النظام يريد التأكد من أن جميع نقاط الدخول محمية ولا يمكن للمستخدمين غير المصرح لهم الوصول إلى بيانات حساسة أو تنفيذ إجراءات إدارية.

**Why this priority**: الأمان هو الأساس — أي ثغرة تؤثر على المستخدمين والبيانات مباشرة.

**Independent Test**: يمكن اختباره بمحاولة الوصول لـ `/admin/*` بدون مصادقة ومحاولة رفع ملفات PHP.

**Acceptance Scenarios**:

1. **Given** مستخدم غير مسجّل، **When** يحاول الوصول لـ `/admin/units`، **Then** يُعاد توجيهه لصفحة تسجيل الدخول
2. **Given** مستخدم عادي مسجّل، **When** يحاول الوصول لـ `/admin/users`، **Then** يحصل على 403 Forbidden
3. **Given** مهاجم، **When** يحاول رفع ملف `.php` عبر نموذج الصور، **Then** يُرفض الملف برسالة خطأ
4. **Given** مهاجم، **When** يرسل SQL injection في حقل البحث، **Then** القاعدة لا تتأثر والطلب يُعالَج بأمان
5. **Given** نموذج تسجيل دخول، **When** يحاول مهاجم 10 محاولات متتالية، **Then** يُحظر مؤقتاً (rate limiting)

---

### User Story 2 — أداء الصفحات وسرعة التحميل (Priority: P2)

المستخدم العادي يتصفح العقارات على اتصال متوسط السرعة ويريد صفحات تتحمل بسرعة ودون تأخير مزعج.

**Why this priority**: الأداء يؤثر مباشرة على معدل التحويل وترتيب الموقع في محركات البحث.

**Independent Test**: قياس Lighthouse score على صفحة `/units` ومقارنته بمعايير Core Web Vitals.

**Acceptance Scenarios**:

1. **Given** صفحة قائمة العقارات، **When** يفتحها المستخدم، **Then** تظهر نتائج أولية خلال أقل من 2.5 ثانية (LCP)
2. **Given** 20 بطاقة عقار في الصفحة، **When** تُجلب من قاعدة البيانات، **Then** لا تتجاوز queries عدد 10 (لا N+1)
3. **Given** صفحة تفاصيل عقار، **When** تُحمَّل، **Then** لا يحدث تحرك في التصميم (CLS < 0.1)
4. **Given** مستخدم يُصفّح قائمة طويلة، **When** يتمرر للأسفل، **Then** الصور تُحمَّل تدريجياً (lazy loading)
5. **Given** صفحة الإدارة/Dashboard، **When** تُفتح، **Then** الإحصائيات تأتي من cache لا من queries مباشرة

---

### User Story 3 — ظهور الموقع في محركات البحث (Priority: P3)

صاحب الموقع يريد أن تظهر صفحات العقارات والمشاريع في نتائج بحث Google بشكل صحيح مع معاينة جميلة عند المشاركة على WhatsApp.

**Why this priority**: SEO يولّد حركة مرور مجانية مستدامة.

**Independent Test**: فحص صفحة عقار عبر Google Rich Results Test وأداة Open Graph debugger.

**Acceptance Scenarios**:

1. **Given** صفحة تفاصيل عقار، **When** تُفحص بـ Google Rich Results، **Then** تُظهر RealEstateListing structured data صحيح
2. **Given** رابط عقار، **When** يُشارَك على WhatsApp، **Then** تظهر معاينة بصورة وعنوان ووصف
3. **Given** `/sitemap.xml`، **When** يُفحص بـ Screaming Frog، **Then** يحتوي كل العقارات والمشاريع والمناطق النشطة
4. **Given** صفحة `/admin/dashboard`، **When** تُزحف بـ Googlebot، **Then** لا تُفهرَس (noindex موجود)
5. **Given** صفحة مقال، **When** تُفحص، **Then** Article JSON-LD موجود مع datePublished وauthor

---

### User Story 4 — اتساق التصميم وسهولة الاستخدام (Priority: P4)

المستخدم العربي يتفاعل مع واجهة RTL ويريد تجربة بصرية متسقة على كل صفحات الموقع.

**Why this priority**: التصميم المتسق يبني الثقة ويحسن قابلية الاستخدام.

**Independent Test**: فحص بصري لكل صفحة عامة مقارنةً بـ DESIGN.md.

**Acceptance Scenarios**:

1. **Given** أي صفحة عامة، **When** تُعرض، **Then** تستخدم خط Cairo فقط ولا خطوط نظام أخرى
2. **Given** أزرار CTA الأساسية، **When** تُفحص، **Then** كلها تستخدم `#CC0000` لا ألوان Tailwind افتراضية
3. **Given** الموقع على موبايل، **When** يُعرض، **Then** لا يوجد horizontal scroll ولا تداخل في العناصر
4. **Given** صفحة بالعربية، **When** تُعرض، **Then** النص يتجه RTL والأيقونات في أماكنها الصحيحة
5. **Given** نموذج إدخال، **When** يُستخدم، **Then** يستخدم `InputField` component الموحّد

---

### User Story 5 — لوحة الإدارة تعمل بكفاءة (Priority: P5)

مدير النظام يستخدم لوحة الإدارة يومياً لإدارة العقارات والمستخدمين والإشعارات ويريد أن تعمل كل الوظائف بدون أخطاء.

**Why this priority**: Admin panel هو العصب الذي يُشغِّل المنصة — توقفه يوقف العمل.

**Independent Test**: فحص كل section في `/admin` وتنفيذ CRUD كامل.

**Acceptance Scenarios**:

1. **Given** قسم Units، **When** يُنشئ مدير وحدة جديدة، **Then** تظهر في القائمة فوراً مع كل بياناتها
2. **Given** قسم Notifications، **When** يضغط مدير "قراءة الكل"، **Then** يتصفر عداد الإشعارات
3. **Given** قسم Messages، **When** يضغط مدير "تصدير CSV"، **Then** ينزل ملف يحتوي كل الرسائل
4. **Given** قسم Users، **When** يحذف مدير مستخدماً له مشاريع، **Then** يظهر تحذير بالعلاقات قبل الحذف
5. **Given** قسم Points، **When** ينفذ مدير "خصم يومي"، **Then** تُسجَّل العملية في Ledger

---

## Functional Requirements

### FR-01: الأمان (Security)
- FR-01.1: كل Admin route محمي بـ middleware auth + admin
- FR-01.2: Rate limiting على: login (5/min)، OTP (3/min)، contact (10/hour)، AI chat (20/min)
- FR-01.3: File uploads: تحقق من النوع (image only) والحجم (max 10MB) ومنع PHP files
- FR-01.4: لا raw SQL queries بدون parameterized bindings
- FR-01.5: كل HTML من المستخدم مُعقَّم قبل العرض (XSS prevention)
- FR-01.6: CSRF token على كل POST/PUT/DELETE forms
- FR-01.7: `.env` لا يمكن الوصول إليه عبر HTTP

### FR-02: الأداء (Performance)
- FR-02.1: لا N+1 queries — كل علاقة تُعرض يجب eager loading
- FR-02.2: Pagination إلزامي على كل listing endpoints
- FR-02.3: Cache للبيانات الثابتة: regions, categories, settings, dashboard stats
- FR-02.4: Images: lazy loading + explicit width/height + WebP format
- FR-02.5: Frontend bundle: code splitting على Admin pages
- FR-02.6: Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

### FR-03: تهيئة محركات البحث (SEO)
- FR-03.1: كل صفحة عامة لها `<title>` + `<meta description>` ديناميكيان
- FR-03.2: Open Graph tags على كل صفحة عامة
- FR-03.3: JSON-LD structured data: RealEstateListing (units/projects)، Article (articles)، BreadcrumbList (all)
- FR-03.4: Sitemap يشمل: units، projects، areas، articles، static pages — فقط النشطة
- FR-03.5: `/robots.txt` يحجب `/admin/` من الـ crawling
- FR-03.6: Admin pages لها `noindex, nofollow`
- FR-03.7: Canonical tags على الصفحات المُرقَّمة

### FR-04: التصميم (Design Consistency)
- FR-04.1: كل الألوان من DESIGN.md (لا hardcoded Tailwind color classes)
- FR-04.2: Cairo font على كل النصوص الظاهرة للمستخدم
- FR-04.3: RTL layout صحيح: اتجاه النص، مواضع الأيقونات، padding/margin
- FR-04.4: Button component موحّد مستخدم في كل مكان
- FR-04.5: Mobile responsive: لا horizontal scroll، grid يتكيف صح
- FR-04.6: Empty states، loading states، error states موجودة في كل section

### FR-05: لوحة الإدارة (Admin Panel)
- FR-05.1: كل 10 sections في Admin تعمل CRUD بدون أخطاء
- FR-05.2: Notifications: unread count، mark read، dismiss، clear all
- FR-05.3: Messages: mark replied، export CSV، WhatsApp quick reply
- FR-05.4: Points: allocate، daily deduct، monthly reset، ledger
- FR-05.5: Units: approve، pin، deal، extend-expiry، image management
- FR-05.6: Users: role change، toggle active، check relations قبل الحذف

### FR-06: جودة الكود (Code Quality)
- FR-06.1: لا `dd()` / `dump()` / `console.log` في production code
- FR-06.2: Controllers < 200 سطر — move logic to Actions/Services
- FR-06.3: كل critical path له Pest test
- FR-06.4: Migrations لها indexes على columns تُستخدم في WHERE
- FR-06.5: لا orphaned models أو controllers بدون routes

---

## Non-Functional Requirements

- **Auditability**: كل مشكلة تُوثَّق بملف ورقم سطر ومقترح حل
- **Prioritization**: المشاكل مصنّفة: Critical 🔴 → High 🟠 → Medium 🟡 → Low 🟢
- **Non-destructive**: المراجعة قراءة فقط — لا تعديل في كود
- **Reproducibility**: كل مشكلة قابلة للتحقق بخطوات واضحة
- **Completeness**: تغطية كل ملفات المشروع بدون استثناء

---

## Success Criteria

- SC-01: صفر ثغرات أمنية Critical (SQL injection، XSS، exposed admin routes)
- SC-02: Lighthouse Performance Score ≥ 85 على صفحة `/units`
- SC-03: كل صفحة عامة تجتاز Google Rich Results Test
- SC-04: لا N+1 queries في أي Controller (قياس بـ Debugbar)
- SC-05: `composer audit` و `npm audit` بصفر Critical vulnerabilities
- SC-06: التقرير النهائي يوثّق 100% من المشاكل بملف ورقم سطر

---

## Out of Scope

- تنفيذ الإصلاحات (المراجعة فقط — الإصلاح في feature منفصلة)
- فحص البنية التحتية (servers، hosting، DNS)
- اختبار الحمولة (load testing) — يُغطّى بـ k6 في feature منفصلة
- مراجعة محتوى العقارات (بيانات، صور)

---

## Assumptions

1. قاعدة البيانات متاحة محلياً للتحقق من indexes والعلاقات
2. المشروع يمكن بناؤه محلياً (`npm run build`) للتحقق من bundle size
3. `php artisan route:list` وباقي artisan commands تعمل بدون أخطاء
4. `.specify/memory/constitution.md` هو المرجع للمعايير التقنية


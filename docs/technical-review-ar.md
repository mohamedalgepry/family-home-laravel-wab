# التقرير الفني الشامل لموقع Family Home

| | |
|---|---|
| **المنصة** | Laravel 13 + Inertia.js (React) + Vite + قاعدة بيانات SQLite/MySQL |
| **النطاق** | مراجعة تقنية شاملة (SEO، إمكانية الوصول، الإشعارات، الصلاحيات، جودة الكود) |
| **تاريخ الإعداد** | 31 يوليو 2026 |
| **الأسلوب** | مراجعة ساكنة (Static Review) لشفرة المصدر، مع أدلة من ملفات المشروع |
| **الموقع المرجعي** | https://familyhome-co.com (حسب `public/robots.txt`) |

---

## ملخص تنفيذي (صفحة واحدة)

الموقع مبني على قاعدة تقنية سليمة: Laravel 13، سياسات تحكم بالوصول (Policies) شاملة، تحديث أثمان/وحدات عبر خدمات منظمة في Domain Layer، تخزين مؤقت ذكي مع نظام إصدارات للكاش، رؤوس أمان، وحدات تحكم معدل الطلبات، ونصوص معقّمة ضد XSS.

غير أن المراجعة كشفت **مشكلة حرجة واحدة** (يجب حلها في أقرب وقت)، **وأربع مشكلات عالية الأولوية**، إضافة إلى سلسلة من التحسينات المتوسطة والمنخفضة:

### 🔴 حرجة (0–2 أسبوع)
1. **ازدواجية وسوم الميتا و canonical**: تُصدر القالب `resources/views/app.blade.php` وسوم الميتا عبر `x-seo.meta` **و** `@inertiaHead` في نفس الوقت، مما يعني وسوم `<title>` و `canonical` و `hreflang` و JSON-LD **مكررة** في الصفحة — يربك محركات البحث ويضعف الترتيب.

### 🟠 عالية (1–3 أشهر)
2. **`window.location.href` كـ canonical وJSON-LD**: canonical غير مستقر (يشمل الفلاتر والصفحات)، ويعتمد على متغير غير معرّف أثناء SSR (`window`) — خطر تعطل أو اختلاف النسخ.
3. **لا توجد قناة بريد إلكتروني للإشعارات**: كل الإشعارات `database` فقط؛ الرسائل الجديدة من العملاء لن تصل للوكيل إن لم يسجّل الدخول.
4. **ضعف إمكانية الوصول في `Select.jsx`**: قائمة منسدلة مخصصة بلا ARIA roles ولا تنقّل لوحة مفاتيح، وتهديد بفشل فحص WCAG.
5. **ملف sitemap مزدوج المصدر**: أمر `sitemap:generate` يكتب ملفاً ثابتاً في `public/` بينما يوجد مسار ديناميكي `/sitemap.xml` — الصراع قد يقدّم نسخة قديمة، والأمر يحتوي دوميناً مبرمجاً بشكل ثابت.

### 🟡 باقي الملاحظات
- **استمارة الاستفسار على الوحدات**: الربط الضمني `{unit:slug}` على عمود `slug` فقط (بدل `ByAnySlug`) هشّ مع البيانات القديمة أو عند اختلاف الـ slugs — يُنصح بتحصينه (انظر القسم 6، B1).
- تفاصيل كاملة مع الأدلة وخطوات الإصلاح في الأقسام التالية، وملخص أولويات الإصلاح في القسم 7.

---

## 1) SEO والفهرسة

### 1.1 الوضع الحالي (ما هو موجود فعلاً)

| العنصر | الحالة | الدليل |
|---|---|---|
| `robots.txt` | ✅ موجود ومضبوط جيداً (يسمح للمسارات العامة، يمنع `/admin/` و`/login` وغيرها، يشير إلى sitemap) | `public/robots.txt` |
| Sitemap ديناميكي | ✅ مسار `/sitemap.xml` يُولّد XML مع hreflang لكلا اللغتين، كاش 3600 ثانية | `routes/web.php:14` + `app/Http/Controllers/Public/SitemapController.php` |
| Sitemap ثابت | ⚠️ أمر `sitemap:generate` يكتب ملفاً ثابتاً بـ `file_put_contents(public_path('sitemap.xml'))` — مصدران متعارضان | `app/Console/Commands/GenerateSitemap.php` |
| Canonical | ⚠️ في الواجهة يُستخدم `window.location.href` (يتضمن الاستعلامات)، وفي السيرفر يُبنى من slug — نسختان مختلفتان | `resources/js/Pages/Public/Units/Show.jsx:95` وغيرها |
| Hreflang | ✅ يعمل عبر SeoService (أر/إن/x-default) وSeoHead | `app/Services/SeoService.php` |
| وسوم ميتا | ⚠️ تُصدَر مرتين (Blade + React Head) | `resources/views/app.blade.php` + `resources/js/Components/UI/SeoHead.jsx` |
| Open Graph / Twitter | ✅ موجودة (title, description, image, type) | `SeoHead.jsx` + `resources/views/components/seo/meta.blade.php` |
| JSON-LD (Structured Data) | ✅ RealEstateListing, Article, WebSite, RealEstateAgent, Breadcrumb | `app/Services/SeoService.php` |
| Page-SEO من لوحة التحكم | ✅ جدول `page_seo` + تحكم `PageSeoController` + كاش | `app/Http/Controllers/Admin/PageSeoController.php` |
| SEO محدد للصفحات الرئيسية | ✅ Home/About/Contact/Units/Projects/Articles تستخدم `SeoHead` | ملفات `resources/js/Pages/Public/*` |

### 1.2 المشكلات المكتشفة

#### 🔴 P1 — وسوم الميتا والـ canonical مكررة (Blade + React)
`resources/views/app.blade.php` يحتوي:
```blade
<x-seo.meta :meta="$currentMeta" />
@vite(...)
@inertiaHead
```
أي أن `<title>` و`meta description` و`canonical` و`hreflang` و`og:*` تُصدَر مرة من `x-seo.meta` (مبنية من `SeoService`) ومرة أخرى من `SeoHead.jsx` عبر `@inertiaHead` (مبنية من `seo_pages` في الـ props). **النتيجة: وسوم مكررة ومتناقضة أحياناً** (مثلاً canonical من السيرفر مقابل `window.location.href` من المتصفح).
- **الأثر:** إشارات متضاربة لمحركات البحث، قد تختار Google نسخة خاطئة، وتراجع في الترتيب.
- **الإصلاح:** توحيد مصدر واحد: إما إيقاف `x-seo.meta` وجعل `SeoHead` هو المصدر الوحيد (مع التأكد من صحة البيانات من الـ props)، أو إبقاء Blade والاستغناء عن `SeoHead` — ثم إعادة اختبار الصفحات عبر `view-source`.

#### 🔴 P2 — Canonical غير مستقر ويعتمد على `window.location.href`
في `Units/Show.jsx:95` و`Projects/Show.jsx:73` و`Home.jsx:32` و`Contact.jsx:46` وغيرها:
```jsx
canonical={window.location.href}
```
- عند صفحات الفلترة أو الترقيم (`?page=2&search=...`) يصبح canonical ملوثاً بالاستعلامات → نسخ مكررة (Duplicate Content).
- أثناء SSR (مفعل افتراضياً في `config/inertia.php` عبر `INERTIA_SSR_ENABLED`) يكون `window` غير معرّف → إما تعطل أو canonical ناقص.
- **الإصلاح:** بناء canonical من بيانات النموذج في السيرفر (موجود فعلاً في `SeoService::forUnit` وغيره) وتمريره كـ prop، أو داخل `SeoHead` يُستبعد الـ query string دائماً.

#### 🟠 P3 — مصدرا Sitemap متعارضان + دومين ثابت
- `SitemapController` (ديناميكي، كاش 3600s) و`GenerateSitemap` (ملف ثابت). في السيرفرات العادية، الملف الثابت `public/sitemap.xml` يسبق المسار الديناميكي → نسخة قديمة محتملة بعد الحذف/التعديل إذا توقف الـ queue.
- في `GenerateSitemap.php:20`:
```php
if (!str_contains($baseUrl, 'familyhome-co.com')) {
    $baseUrl = 'https://familyhome-co.com';
}
```
دومين مبرمج ثابتاً — لو تغيّر النطاق ستكون كل روابط sitemap خاطئة.
- **الإصلاح:** اعتماد مصدر واحد (يُنصح بالمسار الديناميكي مع كاش)، وإلغاء الكتلة الثابتة أو جعلها تقرأ `APP_URL` فقط، والتحقق من وجود نسخة واحدة عبر `curl https://familyhome-co.com/sitemap.xml`.

#### 🟠 P4 — Hreflang من العميل قد ينتج روابط خاطئة للـ slugs ثنائية اللغة
`SeoHead.jsx` يبني `urlAr`/`urlEn` من **المسار الحالي نفسه**:
```jsx
const urlAr = baseUrl + (pathWithoutLocale === '/' ? '/ar' : `/ar${...}`);
```
على صفحة وحدة معروضة بـ `slug_ar` (مثال `/ar/units/فيلا-القاهرة`)، ستُصدَر `hreflang="en"` برابط `/en/units/فيلا-القاهرة` **بنفس الـ slug العربي** بدلاً من `slug_en` الصحيح. السيرفر (`SeoService::forUnit`) يحسبها صحيحاً، لكن الواجهة تُصدر فوقها نسخة خاطئة.
- **الإصلاح:** تمرير مصفوفة hreflang محسوبة في السيرفر إلى `SeoHead`، وتجاهل الحساب المحلي للـ hreflang الخاص بالتفاصيل.

#### 🟡 P5 — ملاحظات SEO متفرقة
- كلمات مفتاحية (`meta keywords`) في `SeoHead.jsx` — مهملة من Google (لا ضرر لكن لا فائدة).
- لا يوجد `og:url` في `SeoHead.jsx` (موجود في نسخة Blade فقط) — ناقص في النسخة التي ستُعتمد.
- الروابط `/` (الجذر) تُعاد توجيهها 302 إلى `/ar` أو `/en` عبر `PageController::rootRedirect` — يُفضَّل 301 + التأكد من عدم فهرسة `/` نفسه.
- `robots.txt` لا يمنع `/compare/search` و`/agents/` — يُنصح بإضافتها.
- `welcome.blade.php` ملف Laravel الافتراضي ما زال موجوداً في `resources/views/` — يُحذف (احتمال فهرسة صفحة ترحيب افتراضية).
- `sitemap` ديناميكي يستخدم `Unit::active()` للوحدات فقط — لا يتضمن `lastmod` للتصنيفات عند غياب `updated_at` (حالة `?? null`).
- ترقيم صفحات القوائم ليس في sitemap (طبيعي؛ لا بأس).
- الصور بدون `srcset`/أبعاد متعددة في `OptimizedImage` — لاحقاً لتحسين LCP.

### 1.3 توصيات SEO (مختصرة)
1. إزالة الازدواجية في وسوم الميتا (أولوية قصوى).
2. canonical من السيرفر فقط + إسقاط query string.
3. توحيد sitemap على مصدر واحد وإزالة الدومين الثابت.
4. hreflang صحيح من السيرفر للصفحات ثنائية اللغة.
5. فحص عبر Google Search Console: إرسال sitemap، فحص تغطية الفهرسة، ومراقبة "Duplicate without user-selected canonical".

---

## 2) إمكانية الوصول (Accessibility) والنصوص البديلة (Alt Text)

### 2.1 الوضع الجيد (نقاط القوة)
- ✅ `InputField.jsx` يقترن `label htmlFor` مع `id` ويعرض الأخطاء — نموذج نموذجي.
- ✅ `app.blade.php` يحتوي رابط "تخطَّ إلى المحتوى" (Skip Link) مع `sr-only focus:not-sr-only`.
- ✅ الـ Header يستخدم `aria-label` للتنقل، و`aria-expanded`/`aria-controls` لقائمة الموبايل.
- ✅ روابط التواصل الاجتماعي في الـ Footer تحمل `aria-label`.
- ✅ `OptimizedImage.jsx` ونسخة Blade يدعمان `alt` و`loading="lazy"` و`decoding="async"`.
- ✅ أزرار السلايدر/اللايت بوكس في `Units/Show.jsx` تحمل `aria-label`.
- ✅ `html lang` و`dir` مضبوطان حسب اللغة في `app.blade.php`.

### 2.2 المشكلات المكتشفة

#### 🔴 A1 — مكوّن `Select.jsx` (قائمة منسدلة مخصصة) غير متاح بالكامل
`resources/js/Components/UI/Select.jsx`:
- الـ `<select>` الأصلي مخفي: `opacity-0 pointer-events-none -z-10 tabIndex={-1}`.
- زر المشغّل لا يحمل `aria-haspopup` ولا `aria-expanded` ولا `aria-controls`.
- القائمة المخصصة لا تستخدم `role="listbox"`/`role="option"`/`aria-selected`.
- لا يوجد تنقّل بلوحة المفاتيح (أسهم، Escape، Tab للخيارات)، ولا إدارة تركيز (Focus Trap/Return Focus).
- حقل البحث الداخلي بلا `aria-label`.
- **الأثر:** مستخدمو قارئات الشاشة ولوحة المفاتيح لا يستطيعون تحديد الخيارات بشكل موثوق — فشل معايير WCAG 2.1 (4.1.2 Name/Role/Value و2.1.1 Keyboard).
- **الإصلاح:** إمّا استخدام الـ `<select>` الأصلي مع تنسيق CSS، أو تنفيذ النمط الكامل: `aria-expanded`، `role="listbox"`، `role="option"`، `aria-selected`، أسهم لوحة المفاتيح، Escape، ودعم `useId` لربط الحقول.

#### 🟠 A2 — الإشعارات/الـ Toasts تُنشأ في DOM بدون `role="status"`/`aria-live`
في `AdminSidebar.jsx` (دالة `handleNewNotif`/`handleNewMsg`):
```js
el.className = 'fixed top-4 end-4 z-50 ...'
document.body.appendChild(el)
```
بدون `aria-live="polite"` أو `role="status"` → قارئ الشاشة لن يعلن عن الإشعار الجديد.
- **الإصلاح:** إضافة `el.setAttribute('role', 'status')` و `aria-live="polite"`، أو استخدام مكوّن Toast بتقنية React Portal مع `aria-live`.

#### 🟠 A3 — اللايت بوكس (معرض الصور) بلا دور حوار ولا إدارة تركيز
`Units/Show.jsx` (اللايت بوكس): لا `role="dialog"` ولا `aria-modal`، لا إغلاق بزر Escape، لا Focus Trap، الصورة الرئيسية فيها `alt=""` (بديل فارغ).
- **الإصلاح:** `role="dialog" aria-modal="true"` + إغلاق بـ Escape + نقل التركيز إلى الحوار وإرجاعه عند الإغلاق.

#### 🟡 A4 — استمارة الاستفسار: تسميات بلا ارتباط برمجي
في `Units/Show.jsx`: `<label className="block text-xs...">` بدون `htmlFor`، والحقول بلا `id`. رغم أن النص يظهر مرئياً، لا يوجد ارتباط برمجي بين label والحقل (تأثير على قارئات الشاشة وبعض أدوات الأتمتة).
- **الإصلاح:** إضافة `htmlFor`/`id` لكل حقل.

#### 🟡 A5 — قائمة الموبايل في لوحة التحكم بلا Focus Trap
`AdminSidebar.jsx` (الدرج الجانبي): لا إغلاق بـ Escape، لا `aria-hidden` عند الإغلاق، زر الإغلاق `&times;` بلا `aria-label`.
- **الإصلاح:** زر الإغلاق بـ `aria-label` + إغلاق بـ Escape + منع التمرير الخلفي للخلفية.

#### 🟡 A6 — تباين الألوان في الشارات
- شارات `bg-amber-500 text-white` (شريط الإشعارات/الـ toast) و`bg-blue-500 text-white` (الرسائل): تباين أقل من AA (≈2.2:1 و≈3.7:1).
- **الإصلاح:** استخدام نصوص داكنة على الخلفيات الفاتحة (مثل `text-amber-900`) أو خلفيات أغمق.

#### 🟡 A7 — النصوص البديلة للصور
- `OptimizedImage.jsx`: `alt=''` افتراضي — جيد للصور الزخرفية، لكن تأكد أن كل صورة محتوى (صور الوحدات/المشاريع) تُمرَّر نصاً وصفياً حقيقياً.
- نسخة Blade `optimized-image.blade.php` تضع **نصاً بديلاً عاماً** `config('app.name').' - موقع عقارات عائلية'` افتراضياً عند غياب `alt` — نص متكرر عديم الفائدة لجميع الصور (يجب أن يكون `alt=""` للزخرفية أو نصاً وصفياً خاصاً بكل صورة).
- حقل `alt_text` موجود في `UnitFormRequest` لكنه optional — يُنصح بجعله إلزامياً أو توليده تلقائياً من اسم الوحدة.

### 2.3 توصيات إمكانية الوصول
1. إصلاح `Select.jsx` (أولوية قصوى ضمن WCAG).
2. `aria-live` للـ toasts و`role="dialog"` لللايت بوكس.
3. ربط جميع labels بالحقول (`htmlFor`/`id`).
4. فحص آلي بـ Lighthouse/axe على كل القوالب، وفحص يدوي لوحة مفاتيح على النماذج.

---

## 3) الإشعارات وتفاعل المستخدم

### 3.1 البنية الحالية
- **القناة الوحيدة:** قاعدة البيانات (`via()` ترجع `['database']`) في كل الإشعارات: `UnitPendingApprovalNotification`، `NewProjectCreatedNotification`، `NewMessageNotification`، `UnitApprovedNotification`، `UnitExpiryNotification`، `ProjectExpiryWarningNotification`.
- **الواجهة:** جرس إشعارات في `AdminSidebar.jsx` يستعلم `/admin/notifications/recent` عند الفتح، و**استطلاع دوري كل 30 ثانية** لعدد غير المقروء (`/admin/notifications/unread-count` + `/admin/messages/unread-count`).
- **التحكم:** قراءة الكل، قراءة واحدة، حذف، مسح الكل، كتم الصوت (localStorage).
- **صوت تنبيه:** `AudioContext` يعمل عند استلام إشعار جديد.

### 3.2 نقاط القوة
- ✅ فصل منطق الإشعارات في `NotificationService` مع كاش للعدادات.
- ✅ `NotificationController` يحذف رؤوس `X-Inertia` للاستعلامات JSON (يمنع اعتراض Inertia للاستجابة).
- ✅ تنظيف الإشعارات القديمة عبر `notifications:cleanup` في `routes/console.php`.
- ✅ إشعارات الموافقة/الانتهاء تُرسل للمدير/الأدمن الصحيح (عبر `UnitService::notifyPendingApproval`).

### 3.3 المشكلات المكتشفة

#### 🔴 N1 — لا توجد قناة بريد إلكتروني (أو دفع) لأي إشعار
كل `via()` ترجع `['database']` فقط. `config/mail.php` الافتراضي `log`. النتيجة:
- رسالة عميل جديدة لن تصل للوكيل إلا بتسجيل دخول (لا بريد إلكتروني).
- إشعارات انتهاء الوحدات/المشاريع داخلية فقط — لا إنذار بريدي للمدير.
- **الأثر:** فقدان فرص تجارية؛ الاعتماد الكامل على الاستطلاع الداخلي.
- **الإصلاح:** إضافة `mail` إلى `via()` للإشعارات الحرجة (`NewMessageNotification`, `UnitExpiryNotification`, `ProjectExpiryWarningNotification`) مع ضبط `MAIL_MAILER` (Mailtrap/SMTP) و`MAIL_FROM_ADDRESS`، وضبط `notifications` لتشمل قنوات متعددة.

#### 🟠 N2 — كاش قائمة الإشعارات قد يعرض بيانات قديمة
- `NotificationService::paginated()` كاش 60 ثانية؛ عند إنشاء إشعار جديد (مثل `UnitService::notifyPendingApproval`) تُمسح `user_{id}_unread_count` فقط، **لا تُمسح** مفاتيح صفحة الإشعارات/الحديثة → قد لا تظهر الرسالة الجديدة في القائمة حتى انتهاء الكاش.
- كما أن TTL غير متناسق: 30 ثانية في `NotificationService` مقابل 60 ثانية في `HandleInertiaRequests`.
- **الإصلاح:** استدعاء `clearUserCache()` عند إنشاء إشعار (أو إبطال مفاتيح الصفحة في نفس النقاط)، وتوحيد TTL.

#### 🟠 N3 — الاستطلاع الدوري كل 30 ثانية + الـ AudioContext
- استطلاع مؤشّري JSON كل 30 ثانية لكل جلسة أدمن = طلبات زائدة (يمكن تخفيضه أو استبداله بـ SSE/Pusher).
- الـ `AudioContext` يعمل **بدون إيماءة مستخدم** وقد تمنعه المتصفحات، كما أنه مفاجئ للمستخدم؛ يُفضَّل تفعيل الصوت عند أول تفاعل فقط.
- لا يوجد تدفق "اشتراك/إلغاء اشتراك" صريح للإشعارات (فقط كتم الصوت).

#### 🟡 N4 — `markEntityNotificationsAsRead` يحمّل كل غير المقروء في الذاكرة
يستدعي `$user->unreadNotifications()->get()` ثم فلترة في PHP — مع نمو الإشعارات يزداد الحمل؛ يُفضَّل فلترة SQL (مثلاً `->whereJsonContains('data->unit_id', ...)`).

### 3.4 توصيات الإشعارات
1. تفعيل البريد الإلكتروني للإشعارات الحرجة (N1) — أثر تجاري مباشر.
2. إبطال كاش الصفحات عند الإنشاء + توحيد TTL (N2).
3. تقييم SSE أو تقليل وتيرة الاستطلاع، وإعادة تصميم تفعيل الصوت (N3).

---

## 4) الصلاحيات والتحكم بالوصول

### 4.1 البنية الحالية
- **الأدوار:** عمود `role` في `users` (admin/manager/agent) + Middleware `EnsureUserHasRole` (`role:admin,manager,agent` على `/admin`).
- **السياسات (Policies):** 12 سياسة مسجلة في `AppServiceProvider` (Unit, Project, Article, Category, User, Message, Points, Settings, Area, UnitType, Feature, FinishingType) — تغطية ممتازة.
- **تقييد البيانات:** `UserScopeQueryBuilder` يقصّر رؤية الوحدات على أدمن/فريق المدير/الوكيل.
- **الفصل الوظيفي:** `UserController` يستخدم `$this->authorize(...)` في كل دالة، والنماذج (FormRequests) تتحقق من `can('create'/'update')`.

### 4.2 نقاط القوة
- ✅ Policies دقيقة (مثال: `UnitPolicy` تمنع الوكيل من تعديل وحدات غيره، والمدير يرى فريق وكلائه فقط).
- ✅ كلمة المرور محفوظة بـ `Hash::make` مع `'password' => 'hashed'` cast.
- ✅ `is_active` يُفحص عند تسجيل الدخول (`AuthService::login`).
- ✅ معدل طلبات على تسجيل الدخول (5 محاولات لكل بريد/IP) وعلى نماذج الاتصال والبحث (`RateLimiter::for` في `AppServiceProvider`).
- ✅ جلسات بقاعدة البيانات + `http_only` + `same_site=lax` + CSRF عبر Inertia.
- ✅ `.htaccess` يمنع الوصول لـ `.env` و`.git` و`.agents`.
- ✅ مسار `/storage/{path}` يحمي من Path Traversal (فحص `..` و`realpath`).

### 4.3 المشكلات المكتشفة

#### 🔴 PC1 (أمن) — `config/permission.php` موجود لكن الحزمة غير مثبتة
ملف `config/permission.php` (إعدادات spatie/laravel-permission) موجود، **لكن** `composer.json` لا يتضمن `spatie/laravel-permission`. الملف يتيم ومضلل — أي مطور قد يظن أن النظام يستخدم spatie. (الأدوار الفعلية تُدار يدوياً عبر عمود `role`.)
- **الإصلاح:** حذف الملف، أو توثيق أن نظام الأدوار مخصص (Role column) — وإلا فالوضع الحالي "يبدو" كإعداد جاهز لكنه غير مفعّل.

#### 🟠 PC2 — التحقق من البريد الإلكتروني غير مفعّل
- عمود `email_verified_at` موجود، لكن لا يوجد `MustVerifyEmail` ولا middleware `verified` في المسارات، ولا مسار تسجيل (`/register` غير موجود في `routes/web.php`).
- بما أن إنشاء المستخدمين يتم من الأدمن فقط، الخطر منخفض — لكن بدون تفعيل، رسائل البريد (عند إضافتها لاحقاً) ستُرسل لعناوين غير موثّقة.
- **الإصلاح:** عند إضافة قناة البريد، فعّل `MustVerifyEmail` على حسابات الوكلاء/المدراء أو على الأقل تحقق من صحة البريد عند الإنشاء.

#### 🟠 PC3 — `TRUSTED_PROXIES` الافتراضي `127.0.0.1` فقط
`bootstrap/app.php:21`:
```php
$middleware->trustProxies(at: env('TRUSTED_PROXIES', '127.0.0.1'));
```
إذا كان الموقع خلف Cloudflare/CDN (كما يوحي `DEPLOYMENT.md`)، يجب ضبط `TRUSTED_PROXIES` في `.env` وإلا سيكون `request()->ip()` هو IP الخادم الوسيط → معدل الطلبات وDedup المشاهدات يعملان بشكل خاطئ (كل الزوار نفس IP).
- **الإصلاح:** ضبط `TRUSTED_PROXIES=*` أو قائمة IP لـ Cloudflare في الإنتاج.

#### 🟡 PC4 — ملاحظات صلاحيات صغيرة
- `NotificationController::approveProject`/`extendProject` تستخدم `abort_unless(isAdmin)` مباشرة (مقبولة لكن الأفضل Policy).
- `MediaController::upload` يستخدم `abort_unless` بدل Policy — متسق لكن غير موحّد.
- `UnitPolicy::viewAny` يرجع `true` لكل مستخدم مصادق — مقبول لأن البيانات تُقصّر في الـ Query، لكن تأكد أن القوائم تفعّل `UserScopeQueryBuilder` دائماً.
- لا يوجد Middleware `verified`؛ وبعض مسارات `/admin` داخل مجموعة `role:admin,manager,agent` تعتمد على الـ Policies — متين بشكل عام.

### 4.4 توصيات الصلاحيات
1. حذف `config/permission.php` المتيم أو توثيق نظام الأدوار المخصص (PC1).
2. ضبط `TRUSTED_PROXIES` في الإنتاج (PC3) — أثر مباشر على الأمان ومعدل الطلبات.
3. تفعيل `MustVerifyEmail` عند إضافة البريد الإلكتروني (PC2).

---

## 5) جودة الكود والمشكلات

### 5.1 نقاط القوة
- ✅ بنية Domain-Driven واضحة (`app/Domain/Listings/Actions`, `Services`, `DTOs`, `Policies`).
- ✅ تكوين صريح عبر Constructor DI (`readonly` properties).
- ✅ تعقيم XSS عبر `Sanitizer::text`/`rich` (DOM Whitelist) في `PageController::about` و`CreateMessageAction` و`CreateUnitAction`.
- ✅ كاش ذكي بإصدارات (`ListingService::CACHE_VERSION_KEY`).
- ✅ اختبارات Pest واسعة (`tests/Feature`: PolicyTest, ListingServiceTest, SeoMetaServiceTest, HttpCacheControlTest ...).
- ✅ `SecurityHeadersMiddleware`: X-Frame-Options, nosniff, Referrer-Policy, CSP, HSTS في الإنتاج.
- ✅ `HttpCacheControl` مع `Vary: X-Inertia` واستبعاد صفحات النماذج من الكاش العام.

### 5.2 المشكلات المكتشفة (مرتبة بالأولوية)

#### 🔴 C1 — `dispatch_sync` على كل مشاهدة وحدة (أداء)
`app/Domain/Listings/Services/PageViewService.php`:
```php
dispatch_sync(new RecordPageViewJob(...));
```
`dispatch_sync` ينفّذ الوظيفة **فوراً داخل نفس الطلب** — أي كتابة DB إضافية في كل مشاهدة فريدة (رغم Dedup 120 ثانية بالـ IP). في أوقات الذروة يزيد زمن الاستجابة.
- **الإصلاح:** استخدام `dispatch(...)->afterCommit()` مع اتصال Queue (موجود `QUEUE_CONNECTION=database`) أو العدّاد الذري في الكاش ثم الدمج.

#### 🟠 C2 — أخطاء صامتة (Empty Catch) تبتلع الأعطال
- `GenerateSitemap::handle()`: `catch (\Throwable $e) {}` حول كل قسم — فشل قاعدة البيانات ينتج sitemap ناقصاً **بلا أي سجل**.
- `SitemapService::regenerate()`: `catch (\Throwable) {}`.
- `SeoService::getPageSeoFromDb()`: `catch (\Throwable $e) {}` بلا تسجيل.
- `NotificationController::recent()/unreadCount()`: ترجع `[]`/`0` عند أي خطأ.
- **الأثر:** عطل صامت يصعب تتبعه في الإنتاج.
- **الإصلاح:** تسجيل `Log::error` داخل كل catch صامت، وإظهار 500 عند فشل sitemap بدل إرجاع ملف ناقص.

#### 🟠 C3 — ازدواجية خدمات SEO
`app/Services/SeoService.php` و`app/Domain/Common/Services/SeoMetaService.php` — خدمتان متوازيتان لنفس الغاية بمخرجات مختلفة قليلاً (الأولى schema كـ array، الثانية كـ string `<script>`). خطر انحراف النتائج بينهما.
- **الإصلاح:** دمج الاثنتين في خدمة واحدة (يُفضَّل `SeoService`) وتحديث المرجعيات في المتحكمات والبليد.

#### 🟠 C4 — `env()` خارج ملفات config
- `bootstrap/app.php:21` يستخدم `env('TRUSTED_PROXIES')` مباشرة (Laravel يحذّر من `env()` خارج config لأنه يفشل بعد `config:cache`).
- `DatabaseSeeder`/`DemoDataSeeder` تستخدم `env('ADMIN_SEED_PASSWORD')` — مقبولة للـ seeding لكنها تصلب الإعدادات.
- **الإصلاح:** نقل قيم `env()` إلى ملفات config ثم `config('app.trusted_proxies')`.

#### 🟡 C5 — ملفات زائدة/متخلفة
- `public/js/filament/` — أصول Filament (echo.js, tables, select.js وغيرها، ملفات ضخمة) مرفوعة في `public/` رغم عدم استخدام Filament في composer.json؟ (تحقق: `filament` غير موجود في composer.json). **ملفات زائدة في الإنتاج** يجب حذفها (حجم كبير + سطح هجوم محتمل).
- `resources/views/welcome.blade.php` — صفحة Laravel الافتراضية غير مستخدمة.
- مفاتيح ترجمة غير مستخدمة (`sidebar_activity_log` رغم حذف جدول activity_log).

#### 🟡 C6 — ملاحظات كود متفرقة
- `HandleInertiaRequests` يمرر `settings` كاملة (بما فيها روابط التواصل) لجميع الزوار — متعمد (في الفوتر) لكن تأكد من عدم وجود إعدادات حساسة في `getAll()`.
- `SeoHead.jsx` يضع `google-site-verification` مكرراً مع `app.blade.php` — حذف من أحدهما.
- `LoginController::store` يرمي رسالة `'Your account has been deactivated.'` بالإنكليزية داخل كود عربي — يُنقل للترجمة.
- `MediaController::upload` يستخدم `$file->extension()` (من اسم العميل) — يفضل `guessExtension()` بناءً على MIME.

#### 🟡 C7 — `dangerouslySetInnerHTML` لـ JSON-LD في `Units/Show.jsx`
تُستخدم لتضمين `JSON.stringify(jsonLd)` داخل وسم `<script>` — المحتوى (اسم الوحدة/الوصف) يُعقّم عبر `Sanitizer::text` على الخادم في مسار الإنشاء، لذا الخطر الحالي منخفض. لكن يُنصح (دفاعاً متعمقاً) باستبدالها بطريقة رسم آمنة أو تمرير الـ JSON كـ prop بدل ضخ HTML خام، خاصةً لأي حقل قد يُدار مستقبلاً دون تعقيم.

### 5.3 قائمة الإصلاحات المرتبة (تأثير/جهد)

| # | المشكلة | الأولوية | التأثير | الجهد |
|---|---|---|---|---|
| C1 | `dispatch_sync` للمشاهدات | 🔴 حرجة | أداء الصفحات التفصيلية | منخفض |
| P1* | ازدواجية وسوم الميتا/canonical | 🔴 حرجة | SEO | منخفض–متوسط |
| C2 | Empty catches صامتة | 🟠 عالية | استقرار/تتبّع | منخفض |
| C3 | ازدواجية خدمات SEO | 🟠 عالية | صيانة | متوسط |
| C4 | `env()` خارج config | 🟠 عالية | إعدادات | منخفض |
| C5 | ملفات Filament الزائدة | 🟡 متوسطة | أمان/حجم | منخفض |
| C6 | توطين رسائل/تحسين MIME | 🟡 متوسطة | جودة | منخفض |
| C7 | `dangerouslySetInnerHTML` لـ JSON-LD | 🟡 متوسطة | دفاع متعمق (XSS) | منخفض |

\* P1 من القسم 1 (SEO) مكرر هنا لتأكيد أولويته القصوى.

---

## 6) مشكلات أخرى ملحوظة

### 🟡 B1 — استمارة الاستفسار على الوحدات: اعتماد على الربط بعمود `slug` فقط (هشاشة/اتساق)
التحليل:
- صفحات العرض تستخدم `Unit::byAnySlug()` (تبحث في `slug` + `slug_ar` + `slug_en`) — `app/Domain/Common/Concerns/ByAnySlug.php`.
- مسار الإرسال `POST /units/{unit:slug}/contact` (في `routes/web.php:126` و`128`) يستخدم **الربط الضمني على عمود `slug`** فقط.
- في `Units/Show.jsx` (`handleSubmit`):
```js
const submitUrl = window.location.pathname.startsWith('/en')
    ? `/en/units/${unit.slug}/contact`
    : `/units/${unit.slug}/contact`
```
النموذج يُرسل `unit.slug` (العمود الأساسي `slug` الذي يُولَّد تلقائياً عند الإنشاء)، وبما أن الربط `{unit:slug}` يطابق نفس العمود، **فالإرسال يعمل في الحالة الطبيعية** حتى لو عُرضت الصفحة برابط عربي `slug_ar` (لأن الطلب يذهب للمسار غير المترجم أو `/en` حسب البادئة).
- **لكن** الاعتماد على العمود `slug` فقط هشّ في الحالات التالية: بيانات قديمة يكون فيها `slug` خالياً أو مكرراً، أو أي تعديل مستقبلي لآلية الربط؛ كما أن إرسال الاستمارة إلى مسار **غير مقيّد باللغة** (غير `/ar/...`) سلوك غير متسق مع باقي التطبيق.
- **الإصلاح (تحصين):** حلّ النموذج عبر `byAnySlug` في `MessageController::store` بدل الاعتماد على الربط الضمني، واستخدام المسار المحلي الكامل (مع بادئة اللغة) في `handleSubmit`، وإضافة معالجة آمنة عند غياب `unit.slug`.

### 🟠 B2 — تباين قنوات الأداء
- الصور تُرفع بالأصل (قد تكون كبيرة) وتُولّد لها `thumb_` فقط — لم يُعثر على استدعاء لـ `ImageOptimizerService::convertToWebp` في مسار الرفع الحالي (يُوصى بالتحقق من جميع المستدعين ثم تفعيله). يُنصح بتحويل WebP + `srcset` لتحسين LCP.
- `OptimizedImage` يدعم `loading=lazy` لكن بدون `width/height` إلزامي في كل الاستخدامات → خطر CLS.

### 🟡 B3 — روابط/عناصر متنوعة
- مسار `/storage/{path}` يعرّف في `routes/web.php` بدل الاعتماد على الـ symlink — يعمل لكنه يمرر كل ملفات التخزين عبر PHP؛ يُفضَّل الاستضافة عبر Nginx/Apache مباشرة للأداء، مع الإبقاء على حماية الـ traversal.
- `favicon` و`icon.png` موجودان — جيد.
- لا يوجد `sitemap` منفصل للصور/الفيديو — لاحقاً.

### 🟡 B4 — اعتبارات خصوصية
- `PageViewService` يخزّن `ip` و`user_agent` في جدول المشاهدات — يجب مراجعة سياسة الخصوصية و(إن لزم) إخفاء/تعمية الـ IP (GDPR).

---

## 7) الملخص والتوصيات القابلة للتنفيذ

### 7.1 إصلاحات عاجلة (0–2 أسبوع)

| # | الإجراء | القسم |
|---|---|---|
| 1 | إزالة ازدواجية وسوم الميتا/`canonical` (توحيد Blade أو SeoHead كمصدر وحيد) | 1 (P1) |
| 2 | جعل canonical من السيرفر + إسقاط query string | 1 (P2) |
| 3 | تسجيل الأخطاء بدل الـ empty catches في sitemap/SitemapService | 5 (C2) |
| 4 | تحويل `dispatch_sync` للمشاهدات إلى Queue | 5 (C1) |
| 5 | حذف `public/js/filament/` والملفات الزائدة | 5 (C5) |

### 7.2 تحسينات متوسطة (1–3 أشهر)

| # | الإجراء | القسم |
|---|---|---|
| 1 | تفعيل قناة البريد الإلكتروني للإشعارات الحرجة + ضبط MAIL | 3 (N1) |
| 2 | إعادة بناء `Select.jsx` متاح بالكامل (ARIA + لوحة مفاتيح) | 2 (A1) |
| 3 | `aria-live` للـ toasts + `role="dialog"` للايت بوكس + Focus Traps | 2 (A2/A3/A5) |
| 4 | إصلاح إبطال كاش قائمة الإشعارات عند الإنشاء + توحيد TTL | 3 (N2) |
| 5 | توحيد sitemap على مصدر واحد + إزالة الدومين الثابت + hreflang من السيرفر | 1 (P3/P4) |
| 6 | ضبط `TRUSTED_PROXIES` في الإنتاج + حذف `config/permission.php` المتيم | 4 (PC3/PC1) |
| 7 | دمج خدمات SEO المزدوجة + نقل `env()` إلى config | 5 (C3/C4) |
| 8 | تحصين استمارة الاستفسار على الوحدات (حلّ النموذج عبر `byAnySlug` + مسار محلي كامل) | 6 (B1) |

### 7.3 تعزيزات طويلة المدى (3–6+ أشهر)

| # | الإجراء | القسم |
|---|---|---|
| 1 | تفعيل `MustVerifyEmail` + مسار تسجيل/إدارة حسابات للوكلاء | 4 (P2) |
| 2 | نظام دفع إشعارات (Web Push) أو SSE بدل الاستطلاع | 3 (N3) |
| 3 | تحويل صور WebP تلقائي + `srcset`/`sizes` لتحسين Core Web Vitals | 6 (B2) |
| 4 | مراجعة خصوصية تخزين IP/User-Agent في المشاهدات | 6 (B4) |
| 5 | فحص أمني آلي (Laravel Security Audit) + تحديث دوري للمكتبات + تغطية أوسع لاختبارات الـ SSR | 5 |

---

## ملحق: الأدلة والمراجع الرئيسية

| الملف | الدور في التقرير |
|---|---|
| `routes/web.php` | مسارات sitemap، admin، استمارات الاستفسار، throttle |
| `app/Http/Controllers/Public/SitemapController.php` + `app/Console/Commands/GenerateSitemap.php` | ازدواجية sitemap + الدومين الثابت |
| `resources/views/app.blade.php` + `resources/js/Components/UI/SeoHead.jsx` | ازدواجية وسوم الميتا |
| `app/Services/SeoService.php` + `app/Domain/Common/Services/SeoMetaService.php` | ازدواجية خدمات SEO |
| `app/Domain/Common/Concerns/ByAnySlug.php` + `app/Domain/Listings/Models/Unit.php` | مشكلة ربط الاستمارة بالـ slugs |
| `resources/js/Components/UI/Select.jsx` | إمكانية الوصول للنماذج |
| `app/Domain/Users/Services/NotificationService.php` + `app/Http/Controllers/Admin/NotificationController.php` | نظام الإشعارات |
| `app/Domain/Listings/Notifications/*` + `app/Domain/Users/Notifications/NewMessageNotification.php` | قنوات الإشعارات (database فقط) |
| `app/Domain/Listings/Policies/*` + `app/Domain/Users/Policies/*` + `bootstrap/app.php` | الصلاحيات |
| `app/Domain/Listings/Services/PageViewService.php` | `dispatch_sync` |
| `public/robots.txt` | قواعد الزحف |
| `config/mail.php` | ضبط البريد (log افتراضياً) |

> ملاحظة المنهجية: هذا تقرير مراجعة ساكنة مبني على قراءة شفرة المصدر (وليس فحوصات تشغيلية مباشرة على خادم الإنتاج). يُنصح بتنفيذ الإصلاحات العاجلة ثم إعادة الفحص عبر Google Search Console وLighthouse/axe واختبار نهاية-إلى-نهاية للنماذج.

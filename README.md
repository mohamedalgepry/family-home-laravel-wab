# منصة فاميلي هوم العقارية — Family Home Platform

نظام إدارة وتسويق عقاري متكامل مبني باستخدام إطار العمل **Laravel 13**، يتبع المعمارية الموجهة بالمجالات (**Domain-Driven Design — DDD**)، ومدمج مع واجهة **React 19** عبر **Inertia.js v3** مع دعم مسبق للتخزير الاستاتيكي المسبق (SSR / Static Prerendering). تم تصميم المنصة لتوفير أداء عالٍ جداً وخفيف على البيئات المحدودة (Shared Hosting — Hostinger) مع تقديم تجربة مستخدم كاملة الدعم ثنائي الاتجاه (RTL/LTR).

> ✅ **حالة الفحص والاختبارات المعتمدة:** 117 Passed / 117 Tests (350 Assertions — Pest v4) | مفحوص أمنياً وخالٍ من جميع الثغرات المرصودة | مؤشر أداء PageSpeed وصل إلى 81+ على الهواتف.

---

## جدول المحتويات

1. [المواصفات التقنية والمعمارية](#المواصفات-التقنية-والمعمارية)
2. [المميزات الأساسية للنظام](#المميزات-الأساسية-للنظام)
3. [تحسينات الأداء واستراتيجيات التخزين المؤقت](#تحسينات-الأداء-واستراتيجيات-التخزين-المؤقت)
4. [الحماية ومعالجة الأخطاء والتنقل (Anti-White-Screen)](#الحماية-ومعالجة-الأخطاء-والتنقل-anti-white-screen)
5. [البنية الهيكلية للمشروع](#البنية-الهيكلية-للنظام)
6. [نظام الأدوار والصلاحيات](#نظام-الأدوار-والصلاحيات)
7. [نظام الإشعارات والتنبيهات الصوتية](#نظام-الإشعارات-والتنبيهات-الصوتية)
8. [الأمان والحماية والملفات المستثناة](#الأمان-والحماية-والملفات-المستثناة)
9. [متطلبات البيئة والتثبيت المحلي](#متطلبات-البيئة-والتثبيت-المحلي)
10. [إعدادات الإنتاج والرفع على الاستضافة](#إعدادات-الإنتاج-والرفع-على-الاستضافة)
11. [نظام الاختبارات وضبط الجودة](#نظام-الاختبارات-وضبط-الجودة)
12. [وثائق الأدلة التشغيلية](#وثائق-الأدلة-التشغيلية)
13. [الترخيص](#الترخيص)

---

## المواصفات التقنية والمعمارية

| الطبقة | التقنية |
|---|---|
| **Backend** | Laravel 13 (PHP 8.3+) |
| **معمارية النظام** | Domain-Driven Design (DDD) + Action Classes |
| **Frontend** | React 19 + Inertia.js v3 (SPA + Prerender Static HTML) |
| **التصميم** | Tailwind CSS v4 + Design Tokens + RTL/LTR |
| **قواعد البيانات** | MySQL 8.0+ مع Indexes عادية و FULLTEXT indexes للبحث السريع |
| **Cache** | `file` / `database` cache driver (محسّن ومجمّع للاستضافة المشتركة) |
| **Queue** | `database` queue driver |
| **الخط** | Cairo (محلي بصيغة `.woff2` من `/fonts/cairo/` مع Preload عالي الأولوية لصفر طلبات خارجية) |
| **SEO** | Google Tag Manager (gtag.js G-43HZ7C3CK2) + Google Search Console + Schema.org (JSON-LD) |
| **الاختبارات** | Pest v4 (117 اختباراً تغطي كافة مجالات النظام) |

---

## المميزات الأساسية للنظام

### 1. إدارة الكيانات العقارية (Projects & Units)
- نموذج متعدد الخطوات (Multi-Step Form) للمشاريع والوحدات: بيانات أساسية، وسائط، SEO، موقع على الخريطة.
- دعم مرن لخيارات الدفع (كاش / تقسيط / كلاهما) مع الدفعة الأولى وعدد سنوات التقسيط.
- نوع التشطيب، الخدمات، الميزات المتعددة، والبحث بـ Fulltext indexes على قاعدة البيانات.
- توليد Slugs ثنائي اللغة تلقائياً وتوافق كامل مع محركات البحث.

### 2. رقم واتساب المُعلِن التلقائي
- يعرض كل كرت عقار (`UnitCard.jsx`) رقم واتساب صاحب الإعلان مباشرةً.
- إذا لم يكن للمُعلِن رقم مُسجَّل، يستخدم النظام رقم واتساب الشركة من الإعدادات تلقائياً.

### 3. نظام النقاط والتثبيت (Priority Points)
- تخصيص نقاط أولوية للوحدات لرفع ترتيبها في البحث والصفحة الرئيسية.
- خصم يومي تلقائي للطلبات غير المثبتة عبر Cron Job مجدول.
- إعادة تعيين شهري لرصيد المديرين مع السجل التجاري لكل عملية خصم/إضافة.
- حماية كاملة للمعاملات بـ `DB::transaction`.

### 4. لوحة التحكم الإدارية (Custom React/Inertia Admin Panel)
- لوحة تحكم مخصصة بالكامل بلا اعتماد على حزم ثقيلة خارجية.
- القائمة الجانبية (AdminSidebar) تُخفي العناصر غير المصرح بها حسب دور المستخدم تلقائياً.
- إدارة المستخدمين، الرسائل، المقالات، الأخبار، الإعدادات، المناطق، أنواع الوحدات، أنواع التشطيب والميزات.

### 5. تأثيرات اللمس والاستجابة على الهواتف
- دعم معالج لمس عالمي (`touchstart`) لتلوين النصوص والأزرار لحظياً فور اللمس على الموبايل.
- إزالة التأخيرات الزمنية على متصفحات الهواتف وتجربة لمس سلسة وسريعة.

---

## تحسينات الأداء واستراتيجيات التخزين المؤقت

### 1. تجميع استعلامات الصفحة الرئيسية (Single Cache Query)
تم دمج وتجميع استعلامات الصفحة الرئيسية السبعة (`featuredUnits`, `latestUnits`, `popularSearches`, `areas`, `unitTypes`, `features`, `finishingTypes`) داخل كاش موحّد واحد بـ `Cache::remember` ذكي مرطبط بـ `ListingService::CACHE_VERSION_KEY`. 
- ينخفض عدد رحلات قاعدة البيانات من 7 استعلامات إلى **1 استعلام فقط** (أو صفر استعلامات عند وجود الكاش).
- عند إضافة أو تعديل أي وحدة أو مشروع، يتم إبطال الكاش وتحديثه تلقائياً بدون تعارض.

### 2. تحميل الخطوط والصور المحلية
- إزالة الاعتماد على طلبات Google Fonts الخارجية وإتاحة خط **Cairo** محلياً عبر ملفات woff2 (`cairo-1.woff2` العربي بحجم 30KB فقط).
- إضافة Preload عالي الأولوية (`fetchpriority="high"`) لملفات الخطوط في رأس الصفحة.
- استخدام عنصر `<picture>` مع `media="(max-width: 640px)"` لصورة الهيرو لضمان تحميل صورة الموبايل الخفيفة (**23KB**) بدلاً من الصورة الثقيلة على الهواتف.
- ضغط الشعار والـ Favicon إلى WebP بحجم **3.7KB** فقط بدلاً من PNG الضخم.

---

## الحماية ومعالجة الأخطاء والتنقل (Anti-White-Screen)

### 1. خطة أمان التنقل (Hard Navigation Fallback)
تم تحديث معالج الأحداث في `resources/js/app.jsx`:
- عند استقبال أي رد غير متوافق مع Inertia من السيرفر (مثل تحويلات 301/302 أو انتهاء الجلسة)، يقوم النظام بعمل Hard Navigation تلقائي لرابط الهدف لمنع حدوث أي شاشة بيضاء نهائياً.

### 2. حماية React ErrorBoundary
تم تغليف التطبيق بمكون `ErrorBoundary` عالمي لالتقاط أي استثناءات غير متوقعة في واجهة المستخدم، وإعادة التحميل التلقائي فوراً دون انهيار الواجهة.

### 3. صفحات أخطاء مخصصة (Custom Error Views)
تم إنشاء صفحات أخطاء مخصصة بتصميم المنصة في:
- `resources/views/errors/500.blade.php`
- `resources/views/errors/404.blade.php`

عند وقوع أي استثناء في بيئة الإنتاج، يتم التوجيه لصفحات الأخطاء المصممة بدلاً من إظهار أي شاشات خالية.

---

## البنية الهيكلية للنظام

```
app/
├── Console/
│   └── Commands/          # GenerateSitemap, GenerateSeoKeywords, OptimizeProd
├── Domain/
│   ├── Common/            # ListingQueryBuilder, Sanitizer, SeoMetaService
│   ├── Listings/          # المشاريع، الوحدات، المناطق، الإعدادات
│   │   ├── Models/        # Unit, Project, Area, UnitType, Feature, PageSeo
│   │   ├── Policies/      # UnitPolicy, ProjectPolicy
│   │   └── Services/      # ListingService, ListingLookupService, SearchService
│   ├── Points/            # نقاط الأولوية والخصم اليومي
│   ├── Users/             # المستخدمون، الأدوار، الرسائل
│   └── Media/             # معالجة وتوليد مصغرات الصور
├── Http/
│   ├── Controllers/
│   │   ├── Admin/         # متحكمات لوحة التحكم
│   │   └── Public/        # HomeController, UnitController, ProjectController...
│   ├── Middleware/        # DetectBot, SetLocale, HandleInertiaRequests, SecurityHeaders...
resources/
├── css/
│   └── app.css            # Tailwind v4, Cairo Font-face, Touch Active styles
├── js/
│   ├── app.jsx            # Inertia Bootstrap, ErrorBoundary, Touch Handlers
│   ├── Pages/
│   │   ├── Admin/         # Dashboard, Units, Projects, Users…
│   │   └── Public/        # Home, Show, Contact…
│   └── Components/
│       ├── Layout/        # Header, Footer, AdminSidebar
│       └── UI/            # UnitCard, ProjectCard, SearchBar, SeoHead...
└── views/
    ├── app.blade.php      # Main HTML Shell & Font/LCP Preloads
    └── errors/            # Custom 500 & 404 Error pages
```

---

## نظام الأدوار والصلاحيات

| الدور | ما يستطيع رؤيته والوصول إليه |
|---|---|
| **admin** | كل شيء — المستخدمون، الإعدادات، SEO، السجلات الإدارية |
| **manager** | الوحدات، المشاريع، النقاط، المقالات، المناطق، الميزات، التشطيب |
| **agent** | وحداته الخاصة فقط — Dashboard، Inbox، الإشعارات |

---

## أمان الحماية والـ Security Audit المطبقة

- **حماية ثغرات IDOR:** التحقق الصارم من ملكية الموارد كـ `UnitImage` مقابل الـ `Unit` قبل الحذف أو التعيين كرئيسية.
- **Headers الأمان:** تطبيق SecurityHeadersMiddleware (`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`).
- **حماية التوافق مع SSR:** تحسين كافة استدعاءات الـ DOM/Window للعمل بأمان في SSR وPrerender.
- **حماية Rate Limiting:** تحديد معدل المحاولات لتسجيل الدخول وفورم التواصل والبحث الفوري.

---

## متطلبات البيئة والتثبيت المحلي

### المتطلبات الأساسية
- PHP >= 8.3
- Composer >= 2.5
- Node.js >= 20.0 & NPM >= 10.0
- MySQL Server >= 8.0

### خطوات الإعداد

```bash
# تثبيت المكتبات
composer install
npm install

# تجهيز بيئة العمل
cp .env.example .env
php artisan key:generate

# قاعدة البيانات والتخزين
php artisan migrate --seed
php artisan storage:link

# تشغيل الخادم المحلي والبناء
npm run dev
php artisan serve
```

---

## إعدادات الإنتاج والرفع على الاستضافة (Hostinger)

### أوامر النشر وكل تحديث جديد

```bash
# 1. بناء الأصول محلياً
npm run build

# 2. الرفع وسحب التحديثات على السيرفر
git pull origin main

# 3. تفعيل تحسينات الإنتاج والكاش
php artisan migrate --force
php artisan app:optimize-prod
composer dump-autoload -o --no-dev
```

---

## نظام الاختبارات وضبط الجودة

```bash
# تشغيل كافة الاختبارات الـ 117
php artisan test

# تشغيل اختبار مخصص
php artisan test --filter=UnitCreationTest
```

---

## الترخيص

جميع الحقوق محفوظة لمنصة **فاميلي هوم العقارية** © 2026.

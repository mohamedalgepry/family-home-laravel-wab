# منصة فاميلي هوم العقارية — Family Home Platform

نظام إدارة وتسويق عقاري متكامل مبني باستخدام إطار العمل Laravel 13، يتبع المعمارية الموجهة بالمجالات (Domain-Driven Design — DDD)، ومدمج مع واجهة React 19 عبر Inertia.js v3. تم تصميم المنصة لتوفير أداء عالٍ على البيئات المحدودة (Shared Hosting) مع تقديم تجربة مستخدم كاملة الدعم ثنائي الاتجاه (RTL/LTR).

---

## جدول المحتويات

1. [المواصفات التقنية والمعمارية](#المواصفات-التقنية-والمعمارية)
2. [المميزات الأساسية للنظام](#المميزات-الأساسية-للنظام)
3. [البنية الهيكلية للمشروع](#البنية-الهيكلية-للمشروع)
4. [نظام الأدوار والصلاحيات](#نظام-الأدوار-والصلاحيات)
5. [الأمان والملفات المستثناة من Git](#الأمان-والملفات-المستثناة-من-git)
6. [متطلبات البيئة والتثبيت المحلي](#متطلبات-البيئة-والتثبيت-المحلي)
7. [إعدادات الإنتاج والرفع على الاستضافة](#إعدادات-الإنتاج-والرفع-على-الاستضافة)
8. [نظام الاختبارات وضبط الجودة](#نظام-الاختبارات-وضبط-الجودة)
9. [وثائق الأدلة التشغيلية](#وثائق-الأدلة-التشغيلية)
10. [الترخيص](#الترخيص)

---

## المواصفات التقنية والمعمارية

| الطبقة | التقنية |
|---|---|
| **Backend** | Laravel 13 (PHP 8.3+) |
| **معمارية النظام** | Domain-Driven Design (DDD) + Action Classes |
| **Frontend** | React 19 + Inertia.js v3 (SPA — لا يحتاج Node.js في الإنتاج) |
| **التصميم** | Tailwind CSS v4 + Design Tokens + RTL/LTR |
| **قواعد البيانات** | MySQL 8.0+ مع Indexes و Foreign Keys |
| **Cache** | `file` cache driver (مناسب للاستضافة المشتركة) |
| **Queue** | `database` queue driver |
| **الخط** | Cairo — مُحمَّل من Google Fonts في `app.blade.php` |
| **SEO** | Google Tag Manager (gtag.js G-43HZ7C3CK2) + Google Search Console |
| **الاختبارات** | Pest v4 |

---

## المميزات الأساسية للنظام

### 1. إدارة الكيانات العقارية (Projects & Units)
- نموذج متعدد الخطوات (Multi-Step Form) للمشاريع والوحدات: بيانات أساسية، وسائط، SEO، موقع.
- دعم مرن لخيارات الدفع (كاش / تقسيط / كلاهما) مع الدفعة الأولى وعدد سنوات التقسيط.
- نوع التشطيب، الخدمات، الميزات المتعددة.
- توليد Slugs تلقائياً وتوافق SEO.
- **حماية التقديم المزدوج**: تعطيل زر الحفظ أثناء المعالجة لمنع الحفظ المكرر.

### 2. رقم واتساب المُعلِن في كروت العقارات
- يعرض كل كرت عقار رقم واتساب صاحب الإعلان مباشرةً.
- إذا لم يكن للمُعلِن رقم مُسجَّل، يستخدم النظام رقم واتساب الشركة من الإعدادات تلقائياً.
- المنطق موجود في `UnitCard.jsx` ويعتمد على `settings.whatsapp_number`.

### 3. نظام النقاط والتثبيت (Priority Points)
- تخصيص نقاط أولوية للوحدات لرفع ترتيبها في البحث.
- خصم يومي تلقائي للطلبات غير المثبتة عبر Cron Job.
- إعادة تعيين شهري لرصيد المديرين.
- حماية كاملة بـ `DB::transaction`.
- **Admin / Manager فقط** يملكان صلاحية تعديل النقاط (محمية بـ Policy).

### 4. لوحة التحكم الإدارية (Custom React/Inertia Admin Panel)
- لوحة تحكم مخصصة بالكامل بلا اعتماد على حزم جاهزة.
- القائمة الجانبية (Sidebar) تُخفي العناصر غير المصرح بها حسب دور المستخدم تلقائياً.
- إدارة المستخدمين، الرسائل، المقالات، الأخبار، الإعدادات، المناطق، أنواع الوحدات، أنواع التشطيب.

### 5. إدارة الإعدادات والبروفايل
- فصل بيانات التواصل عن شبكات التواصل الاجتماعي.
- دعم روابط `wa.me` وحسابات LinkedIn وFacebook وInstagram وTwitter.
- تغيير كلمة السر وإدارة الحساب بأمان كامل.

### 6. معالجة الصور (Asynchronous)
- رفع الصور مع استجابة فورية للعميل.
- توليد Thumbnails متعددة الأحجام في الخلفية عبر `GenerateThumbnailsJob`.
- حد أقصى 10MB للصورة و40MB للمجموعة.
- رسائل خطأ ثنائية اللغة (عربي/إنجليزي).

### 7. SEO وتحسين محركات البحث
- توليد تلقائي للكلمات المفتاحية (`GenerateSeoKeywordsCommand`).
- خريطة الموقع (`GenerateSitemap`).
- Google Tag Manager (gtag.js) مدمج في `app.blade.php`.
- Google Search Console verification meta tag.
- Canonical + hreflang لدعم تعدد اللغات.

### 8. الأداء
- ضغط Gzip وتخزين مؤقت للمتصفح في `.htaccess`.
- Lazy Loading للصور.
- Cache للاستعلامات المتكررة في `ListingService`.

---

## البنية الهيكلية للمشروع

`	ext
app/
├── Domain/
│   ├── Listings/          # المشاريع، الوحدات، المناطق، الإعدادات
│   │   ├── Actions/
│   │   ├── DTOs/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/      # ListingService, StatisticsService, SettingsService
│   ├── Points/            # نقاط الأولوية والخصم اليومي
│   │   ├── Jobs/
│   │   ├── Models/
│   │   └── Services/
│   ├── Users/             # المستخدمون، الأدوار، الرسائل
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   └── Media/             # توليد مصغرات الصور
│       └── Jobs/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/         # متحكمات لوحة التحكم
│   │   └── Public/        # متحكمات الواجهة العامة
│   ├── Middleware/
│   │   └── EnsureUserHasRole.php
│   └── Requests/
resources/
└── js/
    ├── Pages/
    │   ├── Admin/         # Dashboard, Units, Projects, Users…
    │   └── Public/        # Home, Show, Contact…
    └── Components/
        ├── Layout/
        │   ├── AdminSidebar.jsx   # قائمة جانبية مع فلترة حسب الدور
        │   └── Header.jsx
        └── UI/
            └── UnitCard.jsx       # كرت العقار + رقم واتساب المُعلِن
`

---

## نظام الأدوار والصلاحيات

### الأدوار

| الدور | ما يستطيع رؤيته والوصول إليه |
|---|---|
| **admin** | كل شيء — المستخدمون، الإعدادات، SEO، سجل النشاط |
| **manager** | الوحدات، المشاريع، النقاط، المقالات، المناطق، الميزات، التشطيب |
| **agent** | وحداته الخاصة فقط — Dashboard، Inbox، الإشعارات |

### حماية المسارات
- `EnsureUserHasRole` middleware على جميع مسارات `/admin/*`.
- محاولة الوصول المباشر لمسار محظور → إعادة توجيه إلى `/admin` مع رسالة خطأ واضحة.
- Policies تمنع الوكلاء من تعديل نقاط الأولوية أو حذف موارد لا تخصهم.

---

## الأمان والملفات المستثناة من Git

الملفات التالية **لا تُرفع** على GitHub (مُضافة في `.gitignore`):

| الملف/المجلد | السبب |
|---|---|
| `.env` | بيانات حساسة — كلمات مرور DB ومفاتيح التشفير |
| `node_modules/` | ضخم جداً — يُثبَّت محلياً بـ `npm install` |
| `vendor/` | يُثبَّت محلياً بـ `composer install` |
| `storage/app/*` | ملفات المستخدمين المرفوعة |
| `storage/logs/*` | سجلات الخادم |
| `storage/framework/cache/*` | ذاكرة تخزين مؤقت |
| `storage/framework/sessions/*` | جلسات المستخدمين |
| `*.sqlite` | قواعد بيانات محلية |
| `.agents/` | ملفات المساعد الذكي |
| `.gemini/` | ملفات المساعد الذكي |
| `/.idea`, `/.vscode` | إعدادات المحرر |

> **تحذير**: لا ترفع `.env` أبداً. يحتوي على مفاتيح تشفير وكلمات مرور قاعدة البيانات.

### طريقة الرفع على GitHub

`ash
# 1. بناء الأصول أولاً
npm run build

# 2. مراجعة ما سيُرفع
git status

# 3. الإضافة والرفع يدوياً
git add .
git commit -m "وصف واضح للتغييرات"
git push origin main
`

---

## متطلبات البيئة والتثبيت المحلي

### المتطلبات الأساسية
- PHP >= 8.3
- Composer >= 2.5
- Node.js >= 20.0 & NPM >= 10.0
- MySQL Server >= 8.0

### خطوات الإعداد

`ash
# تثبيت المكتبات
composer install
npm install

# تجهيز بيئة العمل
cp .env.example .env
php artisan key:generate

# قاعدة البيانات والتخزين
php artisan migrate --seed
php artisan storage:link

# تشغيل الخادم المحلي
npm run dev
php artisan serve
`

> **ملاحظة**: `php artisan db:seed --class=DemoDataSeeder` مخصص للبيئة المحلية فقط — لا تُشغّله في الإنتاج.

---

## إعدادات الإنتاج والرفع على الاستضافة

### رفع على Hostinger

1. ارفع ملفات المشروع إلى مجلد الموقع (مثلاً `public_html/family-home`).
2. في **hPanel** → **Advanced** → **Website** → **Document Root**.
3. غيّر المسار إلى `public_html/family-home/public`.
4. احفظ.

> إذا لم يدعم مزود الاستضافة تغيير Document Root، استخدم ملف `index.php` الموجود في جذر المشروع كبديل.

### بناء الأصول قبل الرفع

`ash
npm run build
`

مجلد `public/build` مُتتبَّع في Git لضمان عمل الواجهة مباشرةً دون أوامر بناء على السيرفر.

### متغيرات البيئة الإنتاجية

`env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://familyhome-co.com
LOG_LEVEL=warning
CACHE_STORE=file
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
INERTIA_SSR_ENABLED=false
`

### أوامر ما بعد الرفع

`ash
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
`

### المهمة المجدولة (Cron Job)

`cron
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
`

---

## نظام الاختبارات وضبط الجودة

`ash
# تشغيل كافة الاختبارات
.\vendor\bin\pest

# تشغيل اختبار مخصص
.\vendor\bin\pest --filter="UnitCreationTest"
`

---

## وثائق الأدلة التشغيلية

- [دليل النشر الإنتاجي](DEPLOYMENT.md)
- [فهرس الأدلة التشغيلية](docs/README.md)
- [دليل إضافة وإدارة الوحدات العقارية](docs/guides/adding-unit.md)
- [دليل إضافة وإدارة المشاريع](docs/guides/adding-project.md)
- [دليل إدارة المستخدمين والعقود والرسائل](docs/guides/users-and-contracts.md)
- [دليل إدارة نظام النقاط والخصومات](docs/guides/points-system.md)

---

## الترخيص

جميع الحقوق محفوظة لمنصة **فاميلي هوم العقارية** © 2026.

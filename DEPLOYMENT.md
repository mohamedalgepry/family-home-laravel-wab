# دليل النشر الإنتاجي — Production Deployment Guide

## قبل الرفع (Before Upload)

1. شغّل `composer install --no-dev --optimize-autoloader` و `npm ci && npm run build` محلياً.
2. ارفع المشروع خارج Web Root. اضبط Document Root ليشير إلى مجلد `public/` فقط.
3. **لا ترفع أبداً**: `.env`، سجلات محلية، بيانات اختبار، أو `node_modules`.

### ملفات يجب استثناؤها دائماً

| الملف/المجلد | السبب |
|---|---|
| `.env` | يحتوي على كلمات مرور DB ومفاتيح تشفير |
| `node_modules/` | ضخم جداً (مئات الميجابايت) |
| `vendor/` | يُثبَّت بـ Composer على السيرفر أو محلياً |
| `storage/app/*` | ملفات المستخدمين |
| `storage/logs/*` | سجلات الأخطاء |
| `storage/framework/cache/*` | كاش مؤقت |
| `storage/framework/sessions/*` | جلسات المستخدمين |
| `*.sqlite` | قواعد بيانات محلية |

---

## متغيرات البيئة الإنتاجية المطلوبة

`````env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://familyhome-co.com
PRERENDER_BASE_URL=https://familyhome-co.com
LOG_LEVEL=warning
CACHE_STORE=file
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
INERTIA_SSR_ENABLED=false
```

اضبط `TRUSTED_PROXIES` على عناوين Proxy الخاصة بمزود الاستضافة فقط — لا تستخدم `*`.

---

## أوامر أول نشر وكل إصدار جديد

> **هام**: لا تُشغِّل `php artisan db:seed --class=DemoDataSeeder` في بيئة الإنتاج أبداً.
> البيانات التجريبية ستفشل بالتصميم لمنع ثغرات الأمان.
> النشر الإنتاجي يحتاج فقط تشغيل `migrate`.

```bash
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan sitemap:generate
```

---

## تخزين الصور على Hostinger — تحذير مهم

استضافة Hostinger الحالية (السيرفر: `lt-bnk-web861`) **معطّل فيها دالتا `symlink()` و `exec()` لأسباب أمنية** من قِبل المزود:

1. **لا تستخدم أمر `php artisan storage:link` على هذا السيرفر إطلاقاً**:
   - لن يعمل وسيرمي خطأ `Call to undefined function exec()` أو يفشل في إنشاء الروابط الرمزية.
2. **الحل الدائم والمطبّق في المشروع**:
   - تم ضبط قرص التخزين `public` في `config/filesystems.php` ليكتب الملفات مباشرة داخل `public/storage` بدلاً من `storage/app/public`:
     ```php
     'public' => [
         'driver' => 'local',
         'root' => public_path('storage'),
         'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
         'visibility' => 'public',
         'throw' => false,
         'report' => false,
     ],
     ```
   - هذا يضمن رفع الصور وحفظها مباشرة في مجلد الويب العام دون أي حاجة للروابط الرمزية (symlinks).
3. **في حال الانتقال لاستضافة جديدة مستقبلاً**:
   - الخطوة الأولى هي فحص ما إذا كانت دوال `symlink()` و `exec()` متاحة:
     ```bash
     php -r "var_dump(function_exists('symlink'), function_exists('exec'));"
     ```
   - **إذا كانت متاحة**: يمكنك العودة لاستخدام `storage:link` وتعديل `'root'` في `config/filesystems.php` إلى `storage_path('app/public')`.
   - **إذا كانت معطلة أيضاً**: اترك الإعداد الحالي (`public_path('storage')`) كما هو دون أي تغيير.

بعد رفع أصول الواجهة الجديدة، امسح Cache الـ CDN/Hostinger وأعد تحميل المتصفح بالقوة.
**الخطأ الشائع**: bundle قديم يُرسل طلب Inertia navigation إلى JSON endpoint وتظهر رسالة:
`All Inertia requests must receive a valid Inertia response`

---

## المهام المجدولة والطوابير

### Cron Job (مرة كل دقيقة)

```cron
* * * * * cd /absolute/path/to/application && php artisan schedule:run >> /dev/null 2>&1
```

### Queue Worker

على الاستضافة المشتركة (Hostinger) لا يوجد Process Manager دائم، لذلك يُشغَّل الـ worker عبر
**Cron Job إضافي كل دقيقة** ينفّذ أي مهام معلّقة ثم يتوقف:

```cron
* * * * * cd /absolute/path/to/application && php artisan queue:work --stop-when-empty --tries=3 --timeout=60 >> /dev/null 2>&1
```

هذا أمر ضروري: **المصغرات WebP للصور لا تُولَّد إلا عبر الـ queue**، فبدونه تبقى الصور المرفوعة
غير محسّنة وتؤثر على PageSpeed و LCP.

إذا كانت خطة الاستضافة تدعم عملية دائمة، يمكن تشغيل الـ worker الدائم بدلاً من cron:

```bash
php artisan queue:work --tries=3 --timeout=60
```

راقب الأخطاء:

```bash
php artisan queue:failed
```

### إعادة توليد مصغرات الصور الموجودة

لمعالجة الصور القديمة المرفوعة قبل تفعيل الـ queue (مثل صور PNG كبيرة بلا مصغرات):

```bash
php artisan images:regenerate
```

### Sitemap وSEO

ملف `https://familyhome-co.com/sitemap.xml` يُعاد توليده تلقائياً بعد أي إنشاء أو تعديل أو حذف أو نشر/تفعيل للمشاريع والوحدات والمقالات والتصنيفات، ويوجد تشغيل احتياطي كل ساعة عبر الـ Cron أعلاه. بعد أول رفع شغّل:

```bash
php artisan sitemap:generate
```

---

## نظام الـ Prerender (مهم جداً للأداء و PageSpeed)

`npm run build` يشغّل الآن تلقائياً ثلاث خطوات:
`vite build` ← `vite build --ssr` ← `node scripts/prerender.js`،
وينتج ملفات HTML جاهزة في `storage/app/prerendered/` تُخدم للبوتات
(Googlebot, Bingbot, and Lighthouse/PageSpeed ...).

> **مهم:** السكربت يستدعي `php artisan view:clear` قبل `vite build` —
> تايلويند يمسح `storage/framework/views/` (القوالب المترجمة)، وهي تحوي
> كلاسات صفحات أخطاء Laravel ولوحات Filament غير المستخدمة في الموقع العام،
> فتتسرب إلى CSS المنتج وترفع حجمه ~15KB. لا تحذف هذه الخطوة من السكربت.

قواعد مهمة:

1. **قاعدة البيانات يجب أن تكون متاحة أثناء البناء** — الـ build يجمع بيانات الصفحات من Laravel
   (`php artisan prerender:data`). إن فشلت قاعدة البيانات أثناء النشر، لا يفشل النشر تلقائياً؛
   تشغّل يدوياً بعد إصلاح المشكلة:
   ```bash
   PRERENDER_ALLOW_FAILURES=1 node scripts/prerender.js
   ```
2. **`PRERENDER_BASE_URL`** يضمن أن كل روابط المضيف المحلي (`127.0.0.1`/`localhost`) في
   الملفات المولّدة تُستبدل بالنطاق الرسمي — في `<head>` (canonical و hreflang و og:image)
   **وفي كائن صفحة Inertia داخل data-page** (`appUrl` وروابط الصور). التطبيع يحدث في
   `ExportPrerenderData` على مستوى كائن الصفحة + شبكة أمان ثانية في `scripts/prerender.js`
   تغطي الصيغتين الخام والمهرّبة (`http:\/\/...`) مع حذف المنفذ.
   عند التوليد على جهاز محلي ثم رفع الملفات يدوياً: تأكد من ضبط
   `PRERENDER_BASE_URL=https://familyhome-co.com` قبل التشغيل.
3. **استبدال ذرّي**: الملفات تُولَّد في مجلد مؤقت ثم تُستبدل دفعة واحدة
   (`prerendered.new` ← `prerendered`) — لن تخدم الموقع ملفات ناقصة أو قديمة أبداً.
4. **فحوصات تلقائية بعد التوليد**: التحقق من وجود كل هاش CSS/JS في `public/build`
   (يكشف فوراً أي ملفات قديمة بهاشات مفقودة)، وفحص سلامة ترميز UTF-8
   (يمنع تكرار مشكلة النص العربي المشوّه)، والتأكد من عدم وجود
   `<script data-page>` مكرر في الصفحة النهائية.

### خادم الـ SSR المخصص (هام)

`resources/js/ssr.jsx` لا يستخدم خادم `createServer` الجاهز من حزمة
`@inertiajs/react/server` — لأن `@inertiajs/core` يقرأ جسم طلب HTTP كسلسلة
بفك ترميز كل chunk على حدة (`data += chunk`)، فيتشوّه أي حرف عربي متعدد البايتات
ينقسم على حدود TCP chunk (يظهر `�` في الصفحات المولّدة).
المشروع يشغّل خادمه الخاص بقراءة الجسم عبر `Buffer.concat` قبل `JSON.parse`.
**لا تعدّل `ssr.jsx` ليستخدم خادم الحزمة الجاهز**، وإلا ستعود مشكلة النص العربي المشوّه
في ملفات الـ prerender.

---

## فحوصات ما بعد النشر

1. سجّل الدخول وافتح لوحة الإشعارات — تأكد من أن نقطتَي unread-count ترجعان JSON.
2. تأكد من أن `https://familyhome-co.com/storage/...` يخدم الصور المرفوعة.
3. تحقق من `storage/logs/laravel.log` وشغّل `php artisan queue:failed`.
4. تأكد من: `APP_DEBUG=false`، كوكيز HTTPS-only، وجذر الويب هو `public/`.
5. تحقق من تحميل Google Tag Manager في المتصفح (F12 → Network → `gtag.js`).

---

## نظام الأدوار — مرجع سريع

| الدور | الوصول |
|---|---|
| `admin` | وصول كامل بلا قيود |
| `manager` | وحدات، مشاريع، نقاط، مقالات، مناطق، ميزات، تشطيب |
| `agent` | وحداته الخاصة فقط، الرسائل، الإشعارات |

عند محاولة الوصول غير المصرح به لمسار `/admin/*`:
→ إعادة التوجيه إلى `/admin` مع رسالة خطأ واضحة.

---

## واتساب المُعلِن

كل كرت عقار يعرض رقم واتساب خاص برافع الإعلان.
إذا لم يكن للمُعلِن رقم مُسجَّل، يُستخدم `settings.whatsapp_number` تلقائياً.
المنطق في: `resources/js/Components/UI/UnitCard.jsx`

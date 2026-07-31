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

اضبط `TRUSTED_PROXIES` على عناوين Proxy الخاصة بمزود الاستضافة فقط — لا تستخدم `*`.

---

## أوامر أول نشر وكل إصدار جديد

> **هام**: لا تُشغِّل `php artisan db:seed --class=DemoDataSeeder` في بيئة الإنتاج أبداً.
> البيانات التجريبية ستفشل بالتصميم لمنع ثغرات الأمان.
> النشر الإنتاجي يحتاج فقط تشغيل `migrate`.

`ash
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan sitemap:generate
`

بعد رفع أصول الواجهة الجديدة، امسح Cache الـ CDN/Hostinger وأعد تحميل المتصفح بالقوة.
**الخطأ الشائع**: bundle قديم يُرسل طلب Inertia navigation إلى JSON endpoint وتظهر رسالة:
`All Inertia requests must receive a valid Inertia response`

---

## المهام المجدولة والطوابير

### Cron Job (مرة كل دقيقة)

`cron
* * * * * cd /absolute/path/to/application && php artisan schedule:run >> /dev/null 2>&1
`

### Queue Worker

إذا كانت خطة الاستضافة تدعم عملية دائمة:

`ash
php artisan queue:work --tries=3 --timeout=60
`

وإلا اضبط Scheduled Worker مناسب وراقب الأخطاء:

`ash
php artisan queue:failed
`

### Sitemap وSEO

ملف `https://familyhome-co.com/sitemap.xml` يُعاد توليده تلقائياً بعد أي إنشاء أو تعديل أو حذف أو نشر/تفعيل للمشاريع والوحدات والمقالات والتصنيفات، ويوجد تشغيل احتياطي كل ساعة عبر الـ Cron أعلاه. بعد أول رفع شغّل:

`bash
php artisan sitemap:generate
`

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

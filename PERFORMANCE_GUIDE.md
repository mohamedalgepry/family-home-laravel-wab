# دليل تحسين الأداء وربط Cloudflare CDN (Performance & CDN Guide)

هذا الدليل يوضح خطوات ربط شبكة **Cloudflare CDN** مجانًا مع موقع **Family Home** على استضافة Hostinger، لرفع سعة التحمل إلى **أكثر من 10,000 زائر متزامن** بدون زيادة تكاليف الاستضافة.

---

## 1️⃣ تفعيل وتوجيه Cloudflare CDN

1. قم بإنشاء حساب مجاني على [Cloudflare.com](https://www.cloudflare.com).
2. أضف النطاق الخاص بالموقع `familyhome-co.com`.
3. قم بتغيير أسماء السيرفرات (Nameservers) في لوحة تحكم Domain لدى Hostinger إلى أسماء سيرفرات Cloudflare الموضحة لك (مثل: `aria.ns.cloudflare.com`).

---

## 2️⃣ ضبط قواعد الكاش (Cache Rules / Page Rules)

في لوحة Cloudflare، اذهب إلى قسم **Caching** -> **Cache Rules** وأضف القاعدة التالية:

- **اسم القاعدة:** `Cache Public Pages`
- **الشرط (If matching):**
  - `URI Path` equals `/` OR `URI Path` equals `/ar` OR `URI Path` equals `/en` OR `URI Path` in `(/ar/units, /en/units, /ar/projects, /en/projects, /ar/about, /en/about)`
  - AND `URI Path` does NOT start with `/admin`
  - AND `URI Path` does NOT contain `/contact`
- **التوجيه (Then Cache):**
  - **Cache Eligibility:** `Eligible for cache`
  - **Edge TTL:** `30 minutes`
  - **Browser TTL:** `5 minutes`

> ⚠️ **تحذير هائل وحاسم:** لا تفعّل قاعدة "Cache Everything" على `/contact` أو `/units/{slug}` أو `/projects/{slug}` — هذه الصفحات تحتوي على نماذج تفاعلية مرتبطة بـ CSRF token خاص بكل زائر. تفعيل الكاش الكامل عليها سيؤدي إلى فشل إرسال النماذج (خطأ 419 Page Expired) لأي زائر يحصل على نسخة مخزّنة. استثنِ هذه المسارات صراحةً في قواعد الكاش على Cloudflare (Page Rules أو Cache Rules -> Bypass Cache).

---

## 3️⃣ تفعيل الحماية والضغط التلقائي (Auto Minify & SSL)

1. **SSL/TLS Encryption:** اختر الوضع **Full (Strict)**.
2. **Speed -> Optimization:**
   - تفعيل **Auto Minify** (HTML, CSS, JS).
   - تفعيل **Brotli Compression**.
   - تفعيل **HTTP/2 & HTTP/3**.
3. **Security -> Settings:**
   - ضبط **Security Level** على `Medium`.
   - تفعيل **Bot Fight Mode** لمنع البوتات الهجومية من استهلاك ميزات PHP السيرفر.

---

## 4️⃣ ملخص الأوامر المفيدة على السيرفر (Server Maintenance Commands)

عند تحديث كود الموقع على السيرفر، ينصح بتشغيل الأوامر التالية لإعادة ترتيب الفهارس والكاش:

```bash
# 1. مسح وتنظيف كافة أنواع الكاش
php artisan optimize:clear

# 2. بناء كاش الإعدادات والـ Routes المسرّع
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

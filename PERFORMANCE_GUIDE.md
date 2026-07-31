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
  - `URI Path` starts with `/ar` OR `URI Path` equals `/`
  - AND `URI Path` does NOT start with `/admin`
- **التوجيه (Then Cache):**
  - **Cache Eligibility:** `Eligible for cache`
  - **Edge TTL:** `30 minutes`
  - **Browser TTL:** `5 minutes`

> ⚠️ **ملاحظة أمنية هامّة:** يجب دائماً استثناء مسارات لوحة التحكم `/admin/*` من الكاش التلقائي حتى لا يتم تخزين بيانات الإدارة.

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

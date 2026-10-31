# Technical Research & Decisions: Remediation, Caching & Notifications

**Feature**: `010-remediation-caching-notifications`

---

## 1. Cache Versioning Architecture (استراتيجية إبطال الكاش)

### Decision
اعتماد نمط **Atomic Cache Versioning** عبر مفتاح `listing_cache_version` داخل `ListingService::CACHE_VERSION_KEY`.

### Rationale
- التخزين المؤقت في Laravel عندما يكون على محرك `database` أو `file` لا يدعم Cache Tags (`Cache::tags()`).
- استخدام الـ Versioning يسمح بإنشاء مفاتيح مركبة مثل:
  `home_page_data_u1_p1_v{version}`
  `listing_latest_12_v{version}`
  `units_filters_{hash}_v{version}`
- بمجرد زيادة قيمة `version` برقم واحد عند تعديل أي وحدة أو مشروع، تبطل فوراً كافة مفاتيح الكاش المركبة دون الحاجة لمسح الـ Cache كاملاً أو تعليق الخادم.

### Implementation Pattern
```php
// In Unit & Project Observers or Actions:
Cache::increment(ListingService::CACHE_VERSION_KEY);
Cache::forget('settings_all');
```

---

## 2. Notification Synchronization & Resilience (بنية الإشعارات ومزامنتها)

### Decision
- الحفاظ على نمط **Stale-While-Revalidate** المستخدم في `AdminSidebar.jsx` لجلب الإشعارات الحديثة فور فتح اللوحة مع prefetch في الخلفية.
- إضافة استدعاء مباشر لتفريغ كاش عداد إشعارات المستخدم `Cache::forget("user_{$id}_unread_count")` عند تنفيذ:
  - `markAsRead`
  - `markAllAsRead`
  - `dismiss`
  - `clearAll`
- ضمان حصر الإشعارات بحسب الصلاحيات والـ Teams لضمان عدم تسريب بيانات الإشعارات بين الوكلاء.

---

## 3. Image Upload Centralization in AreaController (توحيد رفع الصور)

### Decision
حقن `StoreUploadedImagesAction` داخل `AreaController` بدلاً من استدعاء `$request->file(...)->store(...)` المباشر.

### Rationale
- يوفر فحصاً مسبقاً للامتدادات الممنوعة (`php`, `svg`, `exe`, `sh`).
- يوفر مسارات منظمة ومؤرخة بالعام والشهر.
- يشغّل `ImageOptimizerService` آلياً لتوليد النسخ المحسنة وبصيغة WebP.

---

## 4. Login Rate Limiting at HTTP Pipeline (تأمين تسجيل الدخول)

### Decision
إلحاق `->middleware('throttle:login')` بمسار `Route::post('/login', [LoginController::class, 'store'])` في `routes/web.php`.

### Rationale
- يمنع هجمات القوة الغاشمة (Brute Force) عند مدخل الـ HTTP Kernel قبل إنشاء كائنات المتحكم وتحميل الجلسة وقاعدة البيانات.
- يعتمد على `RateLimiter::for('login')` المعرّف بالفعل في `AppServiceProvider` (5 محاولات لكل دقيقة بناءً على البريد و الـ IP).


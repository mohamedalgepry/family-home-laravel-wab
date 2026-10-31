# Implementation Plan: Remediation, Caching & Notifications Hardening

**Branch**: `010-remediation-caching-notifications` | **Date**: 2026-10-31 | **Spec**: [`specs/010-remediation-caching-notifications/spec.md`](./spec.md)

**Input**: Feature specification from `specs/010-remediation-caching-notifications/spec.md`

---

## Summary

تنفيذ خطة المعالجة الشاملة للملاحظات المرصودة في التقرير الفني (`FULL_AUDIT_REPORT.md`)، مع تدقيق وإحكام معمّق لطبقة التخزين المؤقت (Caching) ومنظومة الإشعارات (Notifications). تعتمد الخطة على ترقية الحزم المصابة (`npm audit fix`)، إضافة طبقة حماية للـ login، توحيد رفع صور المناطق، تصحيح ألوان الهوية لزر الواتساب، وتطبيق آلية Cache Versioning موحدة تضمن التحديث الفوري للبيانات دون بيانات قديمة (Stale Data)، مع ضبط إبطال كاش الإشعارات عند التفاعل.

---

## Technical Context

**Language/Version**: PHP 8.2+ / Node.js 20+  
**Primary Dependencies**: Laravel 11, Inertia.js (React), Tailwind CSS v4, Vite  
**Storage**: MySQL 8.0 / Database & Redis Cache  
**Testing**: Pest PHP / Playwright E2E  
**Target Platform**: Linux Server (Hostinger Production / Local Dev)  
**Project Type**: Full-Stack Real Estate Web Application  
**Performance Goals**: P95 < 500ms للصفحات العامة، LCP < 2.5s، كاش متجدد فورياً  
**Constraints**: عدم كسر أي مسارات أو واجهات، احترام كامل لـ `DESIGN.md` ودستور المشروع (`constitution.md`)  
**Scale/Scope**: 46 صفحة فرونت-إند، 34 متحكم، 10 أقسام إدارية  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **لا توجد استعلامات Raw SQL غير محمية**: جميع العمليات تستخدم Eloquent ومربوطة بالمعاملات.
- [x] **لا توجد عبارات تصحيح في الإنتاج (`dd()`, `dump()`, `console.log`)**: مؤكد بنسبة 100%.
- [x] **الالتزام الكامل بدليل الهوية `DESIGN.md`**: تصحيح زر الواتساب لـ `#16a34a`.
- [x] **حماية مسارات الإدارة**: تطبيق `auth`, `role`, و `throttle:login`.
- [x] **الحفاظ على خط Cairo ودعم الـ RTL**: مؤكد بنسبة 100%.

---

## Phases & Execution Strategy

### Phase 1: Security & Dependencies Remediation (الأمان والتبعيات)
- **Task 1.1**: تشغيل `npm audit fix` وتحديث حزم Vite و Zod وإعادة بناء الأصول للتأكد من سلامة البناء.
- **Task 1.2**: إضافة `->middleware('throttle:login')` لمسارات `Route::post('/login')` في `routes/web.php`.
- **Task 1.3**: إضافة `<meta name="robots" content="noindex, nofollow" />` لمكون `<Head>` في صفحات الإدارة الرئيسية.

### Phase 2: Design & UI Consistency Fixes (التصميم والهوية)
- **Task 2.1**: تعديل كلاس زر الواتساب في `resources/js/Pages/Public/Agents/Show.jsx` من `bg-[#25D366]` إلى `bg-[#16a34a] hover:bg-[#15803d]`.
- **Task 2.2**: توحيد ألوان نصوص رسائل أخطاء النماذج في `resources/js/Pages/Public/Contact.jsx`.

### Phase 3: Area Upload & Architecture Refactoring (توحيد رفع الصور)
- **Task 3.1**: حقن `StoreUploadedImagesAction` داخل `AreaController` ومعالجة `image_path` و `hero_image` و `gallery` عبره لضمان الأمان وتوليد WebP.

### Phase 4: Caching Layer Audit & Hardening (إحكام الكاشنج)
- **Task 4.1**: تدقيق وضمان عمل `Cache::increment(ListingService::CACHE_VERSION_KEY)` عند كل عملية حفظ أو تعديل أو حذف في الموديلين `Unit` و `Project`.
- **Task 4.2**: التحقق من تفريغ كاش `settings_all` و `areas_lookup` في الـ Observers المعنية.
- **Task 4.3**: كتابة اختبار تحقق آلي في Pest للتأكد من تحديث كاش الصفحة الرئيسية فور تعديل عقار.

### Phase 5: Notifications System Audit & Hardening (إحكام الإشعارات)
- **Task 5.1**: مراجعة دورة حياة إشعارات الرسائل والـ Leads والتأكد من إطلاق أحداث `NewMessageNotification` و `NewAssistantLeadNotification`.
- **Task 5.2**: التأكد من تفريغ كاش `user_{id}_unread_count` عند قراءة الإشعارات أو مسحها.
- **Task 5.3**: فحص تزامن العداد اللحظي في `AdminSidebar.jsx` ومنع استهلاك المعالج مع استمرار عمل التنبيه الصوتي بسلاسة.

---

## Generated Artifacts
- **Research Document**: [`research.md`](./research.md)
- **Data Model & Invalidation Map**: [`data-model.md`](./data-model.md)
- **Quickstart & Validation Guide**: [`quickstart.md`](./quickstart.md)

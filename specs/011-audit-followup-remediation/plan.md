# Remediation Plan: البنود المتبقية من تقرير الفحص 009

**المرجع**: [`../009-full-site-review-audit/FULL_AUDIT_REPORT.md`](../009-full-site-review-audit/FULL_AUDIT_REPORT.md)
**التاريخ**: 2026-10-31
**السبب**: المواصفة 010 غطّت 8 بنود من 11، وثلاثة بنود سقطت بين المواصفتين.

---

## نطاق الخطة (3 بنود فقط)

| # | البند في 009 | الحالة قبل | المعيار |
|---|---|---|---|
| 1 | `PointsService` يستخدم `DB::raw` مع إقحام نصي | مفتوح | استعلام مربوط بالمعاملات (bindings) |
| 2 | حد صور المناطق 20MB مقابل 5MB في بقية النظام | مفتوح | توحيد على معيار النظام |
| 3 | متحكمات إدارية تتجاوز 200 سطر (SRP) | مفتوح | كل متحكم ≤ 200 سطر |

---

## خط الأساس المقيس (قبل التنفيذ)

| المتحكم | الأسطر |
|---|---:|
| `Admin/AreaController.php` | 318 |
| `Admin/UnitController.php` | 268 |
| `Admin/NotificationController.php` | 265 |
| `Admin/UserController.php` | 211 |
| `Admin/ProjectController.php` | 210 |

---

## 1) `PointsService` — إزالة الإقحام النصي

**الوضع الحالي** (`app/Domain/Points/Services/PointsService.php:179`):

```php
Unit::whereIn('id', $validUnitIds)->update([
    'priority_points' => DB::raw("GREATEST(0, priority_points - {$value})"),
]);
```

**التحليل**: `$value` مأخوذ من `(int)` في السطر 103، أي لا توجد ثغرة حقن قابلة للاستغلال، لكن الأسلوب يخالف قاعدة الدستور «لا raw queries بدون binding محمي» ويجعل الكود هشاً أمام أي تغيير مستقبلي في مصدر القيمة.

**الحل المعتمد**: استعلام واحد مربوط بالمعاملات، مع الحفاظ على دلالة `GREATEST(0, …)` كما هي:

```php
$placeholders = implode(',', array_fill(0, count($validUnitIds), '?'));
DB::update(
    "UPDATE units SET priority_points = GREATEST(0, priority_points - ?) WHERE id IN ({$placeholders})",
    [$value, ...array_map('intval', $validUnitIds)],
);
```

**معيار القبول**: لا يوجد أي إقحام لمتغيّر داخل نص SQL في الملف؛ `DeductDailyPointsTest` و`MonthlyPointsResetTest` يمرّان دون تغيير.

---

## 2) حد صور المناطق — توحيد على 5MB

**الواقع المقيس** (7 قواعد في النظام تستخدم `max:5120` للصور):

| الملف | القيمة الحالية |
|---|---|
| `StoreAreaRequest` (image_path, hero_image, gallery.*) | `max:20480` |
| `UpdateAreaRequest` (نفس الحقول) | `max:20480` |
| `UnitFormRequest` / `ProjectFormRequest` / `StoreArticleRequest` / `UpdateArticleRequest` / `UpdateAboutPageRequest` | `max:5120` |

**الحل**: تحويل القواعد الست في ملفَي المنطقة إلى `max:5120` مع الإبقاء على `dimensions:max_width=6000,max_height=6000`.

**معيار القبول**: ملف 6MB يُرفض بخطأ تحقق، وملف 4MB يُقبل.

---

## 3) فصل المسؤوليات (SRP) — تفكيك المتحكمات

**المبدأ**: نقل منطق الأعمال إلى Actions/Services داخل `app/Domain/…`، والمتحكم يبقى للتفويض والتحقق والاستجابة فقط (دستور المشروع: «لا Model في Controllers»، «Actions Pattern»).

| المتحكم | الاستخراج المخطّط | الملف الجديد | التوفير التقديري |
|---|---|---|---:|
| `UserController` | منطق تغيير الدور + التحقق من المدير | `app/Domain/Users/Actions/ChangeUserRoleAction.php` | ~20 |
| `ProjectController` | بناء بيانات النموذج + الإحصاءات | `app/Domain/Listings/Actions/ProjectFormDataAction.php` | ~25 |
| `UnitController` | بناء بيانات النموذج + إحصاءات القائمة | `app/Domain/Listings/Actions/UnitFormDataAction.php` + `UnitService::getAdminStats()` | ~45 |
| `AreaController` | رفع/استبدال صور المنطقة، مزامنة العلاقات، حذف الصور | `ManageAreaImagesAction`, `SyncAreaRelationsAction`, `DeleteListingImageAction` | ~140 |
| `NotificationController` | تمديد وحدة، اعتماد وحدة معلّقة، تمديد مشروع | `ExtendUnitListingAction`, `ApprovePendingUnitAction` | ~65 |

**معايير القبول**:
- كل متحكم ≤ 200 سطر بعد التعديل.
- لا تغيير في أي مسار أو استجابة أو صلاحية (Zero Behavior Change).
- المجموعة كاملة تبقى بنفس عدد النجاح (336) مع تحسّن أو ثبات.

---

## المخاطر والاحتياطات

| الخطر | الاحتياط |
|---|---|
| كسر سلوك تدفق الاعتماد/التمديد (مغطّى باختبارات `NotificationActionsTest`) | نقل المنطق حرفياً دون «تحسين» سلوكي، ثم تشغيل نفس الاتصالات |
| تغيير شكل بيانات النموذج (Inertia props) | إبقاء أسماء ومفاتيح المصفوفات كما هي حرفياً |
| انزلاق حذف الصور القديمة | الحفاظ على ترتيب: رفع الجديد ← ثم حذف القديم |
| تجاوز حد الصور الجديد لملفات مشروعة | 5MB هو معيار بقية النظام، والنسخ تُضغط إلى WebP بعد الرفع |

## التحقق النهائي
```bash
php vendor/bin/pest                  # 336 + الجديد
node node_modules/eslint/bin/eslint.js resources/js --max-warnings=0
wc -l app/Http/Controllers/Admin/{Area,Unit,Notification,User,Project}Controller.php
```

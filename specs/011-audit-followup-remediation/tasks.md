# Tasks: البنود المتبقية من تقرير الفحص 009

**الخطة**: [`plan.md`](./plan.md)

---

## Phase 1: نقاط القياس والإصلاحات الصغيرة

- [x] T001 [P] تسجيل خط الأساس لعدد أسطر المتحكمات الخمسة قبل التفكيك
- [x] T002 إزالة الإقحام النصي في `PointsService` واستخدام `DB::update` مربوط بالمعاملات في `app/Domain/Points/Services/PointsService.php`
- [x] T003 توحيد حد صور المناطق على `max:5120` في `app/Http/Requests/Admin/StoreAreaRequest.php` و `UpdateAreaRequest.php`
- [x] T004 [P] إضافة اختبار تحقق لحد حجم صورة المنطقة في `tests/Feature/`

## Phase 2: فصل المسؤوليات (SRP)

- [x] T005 استخراج `ChangeUserRoleAction` من `app/Http/Controllers/Admin/UserController.php`
- [x] T006 استخراج `ProjectFormDataAction` من `app/Http/Controllers/Admin/ProjectController.php`
- [x] T007 استخراج `UnitFormDataAction` + `UnitService::getAdminStats()` من `app/Http/Controllers/Admin/UnitController.php`
- [x] T008 استخراج `ManageAreaImagesAction` + `SyncAreaRelationsAction` + `DeleteListingImageAction` من `app/Http/Controllers/Admin/AreaController.php`
- [x] T009 استخراج `ExtendUnitListingAction` + `ApprovePendingUnitAction` من `app/Http/Controllers/Admin/NotificationController.php`

## Phase 3: التحقق والإغلاق

- [x] T010 التأكد أن كل متحكم ≤ 200 سطر
- [x] T011 تشغيل المجموعة الكاملة `php vendor/bin/pest` و ESLint
- [x] T012 تحديث حالة البنود الثلاثة في تقرير 009 وتوثيق النتائج

---

## Execution Summary — 2026-10-31

**Status**: ✅ مكتمل (12/12).

### 1) `PointsService` — استعلام مربوط بالمعاملات
`DB::raw("GREATEST(0, priority_points - {$value})")` استُبدل بـ:

```php
$placeholders = implode(',', array_fill(0, count($unitIds), '?'));
DB::update(
    "UPDATE units SET priority_points = GREATEST(0, priority_points - ?), updated_at = ? WHERE id IN ({$placeholders})",
    [$value, $now, ...$unitIds],
);
```

لا قيمة تُقحم في نص SQL؛ والدلالة (`GREATEST` + لمس `updated_at`) محفوظة. تحقق: `DeductDailyPointsTest` + `MonthlyPointsResetTest` = **17/17** بما فيها «priority points never become negative».

### 2) حد صور المناطق — 5MB
القواعد الست في `StoreAreaRequest` و`UpdateAreaRequest` تحوّلت من `max:20480` إلى `max:5120`، مطابقةً لسبع قواعد أخرى في النظام. أُضيف اختبار `rejects an area image larger than the system 5MB limit` (ملف 6MB يُرفض).

### 3) فصل المسؤوليات — النتائج المقيسة

| المتحكم | قبل | بعد | الحالة |
|---|---:|---:|:---:|
| `AreaController` | 318 | **146** | ✅ |
| `UnitController` | 268 | **200** | ✅ |
| `NotificationController` | 265 | **177** | ✅ |
| `UserController` | 211 | **183** | ✅ |
| `ProjectController` | 210 | **181** | ✅ |

**أُضيف (Actions/Services)**: `ChangeUserRoleAction`, `CreateUserAction`, `ProjectFormDataAction`, `UnitFormDataAction`, `UnitService::getAdminIndexData()`, `ProjectService::getAdminStats()`, `ManageAreaImagesAction`, `SyncAreaRelationsAction`, `DeleteListingImageAction`, `ApprovePendingUnitAction`, `ExtendUnitListingAction`, `ApprovePendingProjectAction`, `ExtendProjectListingAction`.

**اختبار جديد**: `tests/Feature/ManageAreaImagesActionTest.php` (4 اختبارات) يغطي الرفع، الاستبدال مع حذف القديم، المسح الصريح، وحذف كل الصور.

### التحقق
- `php vendor/bin/pest`: **341 passed** / 2 failed (الفشلان القديمان في `ExtractCoordinatesFromUrlTest` لاعتمادهما DNS حقيقياً — كود غير ممسوس).
- `eslint resources/js --max-warnings=0`: ناجح بصفر تحذيرات.
- جميع المتحكمات الخمسة ≤ 200 سطر.

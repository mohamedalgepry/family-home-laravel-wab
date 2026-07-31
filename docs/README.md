# فهرس الأدلة التشغيلية — Family Home Platform

## الأدلة المتاحة

| الدليل | الوصف |
|---|---|
| [دليل الوحدات العقارية](guides/adding-unit.md) | كيفية إضافة وإدارة الوحدات |
| [دليل المشاريع](guides/adding-project.md) | كيفية إضافة وإدارة المشاريع |
| [دليل المستخدمين والرسائل](guides/users-and-contracts.md) | إدارة المستخدمين والعقود |
| [دليل نظام النقاط](guides/points-system.md) | شرح نظام النقاط والخصومات |

## مرجع سريع

- **Backend**: `app/Domain/` — المنطق الأساسي
- **Frontend**: `resources/js/Pages/` و `resources/js/Components/`
- **إعدادات Vite**: `vite.config.js`
- **إعدادات Tailwind**: `resources/css/app.css`
- **مسارات API**: `routes/api.php`
- **مسارات Web**: `routes/web.php`
- **متغيرات البيئة**: `.env` (لا يُرفع على Git)

## هيكل قاعدة البيانات (الجداول الأساسية)

| الجدول | الوصف |
|---|---|
| `users` | المستخدمون والأدوار (admin/manager/agent) |
| `agent_profiles` | بيانات التواصل والبروفايل الشخصي |
| `units` | الوحدات العقارية |
| `projects` | المشاريع العقارية |
| `areas` | المناطق الجغرافية |
| `unit_types` | أنواع الوحدات |
| `features` | الميزات والخدمات |
| `finishing_types` | أنواع التشطيب |
| `images` | صور الوحدات والمشاريع |
| `point_transactions` | سجل معاملات النقاط |
| `messages` | رسائل العملاء |
| `notifications` | الإشعارات |
| `jobs` / `failed_jobs` | طابور المهام |
| `sessions` | جلسات المستخدمين |
| `cache` | ذاكرة التخزين المؤقت |

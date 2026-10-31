# دستور المشروع — Family Home فاميلي هوم

## القيم الأساسية

1. **الوضوح قبل التعقيد**: كل قرار يجب أن يكون مفهوماً لمطوّر جديد يقرأ الكود لأول مرة. البساطة تفضل الذكاء الزائد.

2. **تجربة المستخدم أولاً**: كل قرار تقني يجب أن يحسّن تجربة المستخدم أو على الأقل لا يضرها. المستخدم العربي هو الأولوية.

3. **الأمان بالتصميم**: الأمان ليس إضافة لاحقة — هو متطلب أساسي في كل feature وكل endpoint.

4. **الاتساق أمانة**: كل مطوّر يكتب كوداً يجب أن يتبع نفس الأنماط الموجودة في المشروع. الكود الجديد لا يختلف عن القديم في الأسلوب.

5. **القابلية للاختبار**: كل feature قابلة للاختبار يدوياً وآلياً. لا business logic بدون test.

---

## المبادئ التقنية

### البنية المعمارية (Architecture)

- **Stack ثابت**: Laravel 11 + Inertia.js + React + Tailwind CSS — لا تغيير بدون قرار جماعي موثّق
- **Domain-Driven**: الكود منظّم في `app/Domain/{DomainName}/` (Models, Actions, Services)
- **Actions Pattern**: كل عملية business = Action class منفصل، مسؤولية واحدة فقط
- **Inertia Props فقط**: التواصل بين Backend وFrontend عبر Inertia props — لا REST API منفصلة لصفحات Inertia
- **لا Model في Controllers**: Controllers تستدعي Actions، Actions تستدعي Models

### جودة الكود

- **لا `dd()` أو `dump()` في production code** — NEVER
- **لا `console.log` في production frontend** — NEVER  
- **لا raw queries** بدون binding محمي من SQL injection
- **Eager Loading إلزامي**: كل علاقة تُستخدم في عرض = `with()` في Controller
- **Pagination إلزامي**: لا `all()` على جداول تتجاوز 100 record
- **Arabic-first**: Labels، validation messages، وuser-facing content بالعربية

### الأداء

- **P95 response time < 500ms** للصفحات العامة
- **LCP < 2.5s** على اتصال 4G
- **CLS < 0.1** — لا تحرك layout بعد التحميل
- **Database queries < 10** لكل request (مراقَب بـ Debugbar في dev)
- **Cache إلزامي** للبيانات التي تتغير أقل من مرة يومياً (regions, categories, settings)

### الأمان

- **CSRF على كل form** — لا استثناءات
- **Rate limiting على**: login (5/min), OTP (3/min), contact (10/hour), AI chat (20/min)
- **File uploads**: نوع الملف + الحجم + scan — لا PHP files
- **Admin routes**: auth + admin middleware على كل route — لا استثناءات
- **Secrets في `.env` فقط** — أي API key في الكود = critical violation

### التصميم البصري

- **المصدر الوحيد للحقيقة**: `DESIGN.md` — لا قيم ألوان hardcoded خارجه
- **Cairo font دائماً**: لا system fonts على واجهات المستخدم
- **RTL-first**: كل component يكتب بافتراض RTL، ثم يُتكيَّف لـ LTR
- **Brand colors**:
  - Primary: `#CC0000` (Red)
  - WhatsApp: `#16a34a`
  - Featured: `#d97706`
- **Radius system**: sm=4px, md=8px, lg=12px, xl=16px, 2xl=24px, full=9999px

---

## إطار القرارات

عند اختيار بين نهجين تقنيين، الترتيب:

1. **هل يخدم المستخدم العربي أفضل؟** (UX)
2. **هل هو أكثر أماناً؟** (Security)
3. **هل يتوافق مع الـ stack الموجود؟** (Consistency)
4. **هل أداؤه أفضل؟** (Performance)
5. **هل أسهل في الصيانة؟** (Maintainability)

---

## معايير الجودة (Quality Gates)

قبل أي feature تعتبر مكتملة، يجب:

- [ ] **Tests موجودة**: Feature test + Unit test للـ Actions
- [ ] **لا N+1**: مراجعة queries مع Debugbar
- [ ] **RTL يعمل**: اختبار على mobile بـ dir="rtl"
- [ ] **Error states موجودة**: validation errors + empty states + loading states
- [ ] **SEO مكتمل**: `<Head>` component مع meta tags على كل صفحة عامة
- [ ] **لا hardcoded strings**: كل النصوص في ملفات الترجمة

---

## نطاق المشروع

**المشروع**: Family Home (فاميلي هوم) — منصة تسويق عقاري عربية  
**المستخدمون الأساسيون**: باحثون عن عقارات (عامة) + مطوّرون/وكلاء عقاريون (agents) + مشرفون (admin)  
**السوق المستهدف**: السوق العربي (مصر أساساً)  
**اللغات**: عربية (أساسية) + إنجليزية (مدعومة)


# خطة التسليم إلى GLM 5.3 — مراجعة تقنية مقيدة للمساعد الذكي

## النطاق والضمان

هذه خطة تنفيذ فقط مبنية على مراجعة قراءة فقط. لا تُنشئ أو تحذف أو تعطل أي ميزة قائمة. الهدف هو إعادة حصر المساعد في عرض بيانات عقارية عامة وآمنة من جدولي `projects` و`units` فقط، مع إبقاء واجهة المحادثة، بطاقات الوحدات، البحث العام، الصفحات، الإدارة، وSEO كما هي وظيفياً.

**قاعدة عدم التراجع:** كل تغيير يجب أن يمر باختبارات الانحدار الحالية والجديدة، وأي سلوك قائم خارج مسار المساعد لا يُعدّل. لا حذف للطرق أو الصفحات أو الجداول أو الميزات.

## ملخص البنية الحالية

- Laravel 13 + Inertia/React، مع طبقة Domain للـ Listings وAssistant وUsers وPoints.
- نقطة المساعد العامة: `POST /{locale}/assistant/chat` في `routes/web.php`، وتصل إلى `AiAssistantController` ثم `HossamAssistantService`.
- الخدمة الحالية تجمع بيانات من وحدات ومشاريع وعلاقاتها، وتستخدم `SettingsService` و`HossamKnowledgeService` والمقالات وسياق الصفحة، ثم ترسل prompt إلى Gemini/OpenRouter. كما تكتب `assistant_leads` و`storage/app/assistant_knowledge.json` وتستخدم الكاش.
- توجد سياسات تفويض لـ Projects/Units، وCSRF مستثنى حالياً لمسار المساعد، ورؤوس أمنية وCSP، وفهارس بحث جيدة مبدئياً، واختبارات للسياسات/البحث/SEO/sitemap/cache، لكن لا توجد تغطية أمنية مخصصة لمسار المساعد.

## المشاكل المكتشفة حسب الأولوية

### P0 — يجب إغلاقها قبل أي نشر للمساعد

1. **انتهاك صريح لنطاق القراءة فقط.** `AiAssistantController` يكتب ويحدّث `assistant_leads`، و`HossamKnowledgeService` يكتب ملف معرفة ويزيد العدادات؛ وهذا يخالف منع الكتابة ومنع الوصول خارج `projects` و`units`.
2. **انتهاك قائمة الجداول المسموحة وتسريب بيانات.** `HossamAssistantService` و`HossamKnowledgeService` يقرآن `settings` و`articles` و`areas`، ويحمّلان علاقات `user` و`type` و`images` و`project`، ويشتقان أرقام هاتف المستخدمين/واتساب. لا يجوز أن يحصل المساعد على هذه البيانات أو يرسلها للمزوّد الخارجي.
3. **لا توجد حدود قدرة حقيقية عند قاعدة البيانات.** الخدمة العامة تملك وصول التطبيق المعتاد؛ حتى لو التزم الكود، خطأ مستقبلي أو prompt/tool جديد قد يصل إلى جداول محظورة. لا يوجد مستخدم DB قراءة فقط، ولا repository محصور، ولا منع بنيوي لـ SQL الحر.
4. **الـ CSRF معطّل لمسار المحادثة** في `bootstrap/app.php`. ذلك يسمح باستدعاءات cross-site إذا امتلك المتصفح الجلسة/الكوكيز ويزيد خطر إساءة الاستخدام وحرق الحصة الخارجية.
5. **حدود Prompt Injection غير كافية.** التعليمات النصية وحدها ليست حدود أمان. تُمرر رسائل history و`context_url` و`context_title` من العميل إلى النموذج، وتُضمّن بيانات مخزنة/وصف مقالات في prompt. لا يوجد فصل موثوق للبيانات غير الموثوقة ولا رفض مضبوط أو schema للتحكم في مخرجات النموذج.
6. **استمرار البيانات الحساسة غير مبرر.** يتم استخراج رقم هاتف من كامل المحادثة وتخزين history وسياق URL؛ وهو أوسع من الحد الأدنى ويخلق مخاطر خصوصية وتسريب واستبقاء.

### P1 — مطلوبة في نفس إصدار التحصين

7. **خطر XSS/روابط غير موثوقة في إجابة النموذج.** الرد يدعم Markdown وروابط مولّدة/محقونة قبل عرضه. يجب أن يكون العرض نصياً افتراضياً، أو عبر renderer مع allowlist صارمة للبروتوكولات والعناصر؛ لا HTML خام، ولا `javascript:` أو `data:` أو روابط خارجية غير معتمدة.
8. **IDOR وسياق صفحة قابل للتلاعب.** `context_url` من العميل ويُستخدم لاستخراج slug ثم تحميل سجل، من دون تثبيت المضيف أو canonical route أو `is_active` دائماً. لا يجوز للسياق أن يوسّع النتائج أو يكشف سجلًا غير منشور.
9. **عرض بيانات أكثر من اللازم إلى LLM.** الحقول والعلاقات تُجمّع في نص inventory/project؛ يجب نقل أقل DTO علني ممكن فقط، وتحديد سقف للنتائج والحجم. لا `user_id`، ولا هواتف، ولا email، ولا metadata داخلية، ولا أوصاف/حقول قد تتضمن أوامر.
10. **تعدد مسارات النموذج والخدمات الخارجية يصعّب الضبط.** Gemini وOpenRouter واستخراج AI منفصل للعملات/المقالات يزيدان نطاق الإرسال والفشل والتكلفة. مطلوب مسار واحد محدود، timeouts، circuit breaker، وميزانية طلبات/توكنات.
11. **معدل الطلبات غير موحّد ولا مقاوم جيداً للإساءة.** يوجد `throttle:20,1` وحد داخلي 100/10 دقائق؛ يلزم limiter واحد باسم مستقل يجمع IP موثوقاً + session/visitor key، استجابات 429 صحيحة، ومقاييس بلا محتوى أو PII.
12. **صلاحيات الإدارة تحتاج اختباراً كاملاً على مستوى الطرق.** السياسات موجودة، لكن ليس كل route ظاهر أنه يمر صراحةً عبر `$this->authorize(...)`/middleware policy في كل عملية. يجب اختبار كل أدوار admin/manager/agent/غير مصادق، مع إبقاء قواعد العمل الحالية دون تغيير.

### P2 — أداء وSEO وجودة تشغيلية

13. **استعلامات واسعة وغير لازمة للمساعد.** تحميل العلاقات ثم بناء خريطة كل الوحدات/المشاريع النشطة للربط قد يصبح مكلفاً مع نمو البيانات؛ الفهارس الحالية جيدة لجزء من المرشحات لكن ينبغي التحقق بـ `EXPLAIN` على الاستعلامات الفعلية وفرض `select` محدد و`limit`.
14. **استدعاءات خارجية متزامنة في طلب المستخدم.** المحاولات المتعددة للنماذج وسعر الصرف قد تطيل زمن الاستجابة؛ أزل كل سياق غير مسموح، cache للـ DTO/النتيجة غير الحساسة بمفتاح من المرشحات المهيكلة، وقياس p95 ومعدل الفشل.
15. **CSP قوية جزئياً لكن تحتوي `unsafe-inline` للـ script/style.** يلزم ترحيلها تدريجياً إلى nonces أو hashes بعد تحقق الواجهة، وتضييق `img-src` و`connect-src` إلى المصادر الفعلية؛ لا تغيرها دفعة واحدة كي لا تتعطل الواجهة.
16. **SEO موجود ومغطى جزئياً، لكن يلزم تحقق إنتاجي.** هناك canonical/hreflang/schema/sitemap/prerender واختبارات لها. يلزم تدقيق زحف فعلي: status، canonical واحد، توافق `hreflang`، JSON-LD صالح، robots/sitemaps، وعدم فهرسة صفحات النتائج ذات المعلمات المكررة عند الحاجة.

## التصميم النهائي للمساعد المقيد

### مبدأ الثقة

النموذج اللغوي **لا يملك DB، ولا SQL، ولا filesystem، ولا HTTP tools، ولا config/env، ولا وصولاً إلى Laravel container**. يستقبل فقط رسالة المستخدم وسجلًا مختصراً منظفاً وDTOs علنية أعادها backend من أدوات ثابتة. يختار من مخرجات الأدوات أو يكتب جواباً نصياً؛ backend هو صاحب القرار في الاستعلام، البطاقات، والروابط.

### الأدوات الوحيدة المسموحة

1. `find_project(project_slug: string)`
   - استعلام Eloquent/Query Builder ثابت من `projects` فقط: `is_active = true` وslug مطابق مسموح.
   - يعيد فقط: `id` داخلي لا يُرسل للنموذج إن لم يلزم، الاسم العلني، slug، وصف علني مقصوص ومنظف، طريقة الدفع/المقدم/سنوات التقسيط إن كانت عامة، وعنوان علني إن كان جزءاً من `projects`.
   - حد واحد. لا علاقات، لا `user_id`، لا `area_id`، لا media، لا counts من جداول أخرى.

2. `list_units_for_project(project_slug: string, filters: SafeUnitFilters)`
   - تبدأ بحل المشروع النشط عبر slug ثم استعلام ثابت من `units` فقط بـ `project_id` الناتج و`is_active = true`.
   - `SafeUnitFilters` typed/validated: `transaction` (`sale|rent`)، `min_price` و`max_price` بأرقام ضمن نطاق منطقي، `rooms` و`bathrooms` أعداد صحيحة محدودة، `min_area_sqm` و`max_area_sqm`، `payment_method` من enum ثابت، `sort` من allowlist (`price_asc|price_desc|newest`).
   - `limit` ثابت 1–6 وpagination ممنوعة في المحادثة. لا أسماء أعمدة/اتجاه sort/joins من إدخال المستخدم، ولا raw SQL أو `whereRaw/orderByRaw/selectRaw`.
   - يعيد DTO علنياً فقط: اسم، slug، السعر، المساحة، الغرف، الحمامات، المعاملة، بيانات دفع عامة، ووصف قصير منظف إن لزم. لا علاقات، صور، مالك، رسائل، points، أو حقول تشغيلية.

3. `get_unit_in_project(project_slug: string, unit_slug: string)`
   - الاستعلام الثابت نفسه مع شرطين معاً (`project_id` المحلول + slug)، و`is_active = true`؛ لا lookup لوحدة بالـ slug وحده. يعيد DTO العلني نفسه.

لا توجد أداة عامة باسم `query`, `search`, `sql`, `file`, `http`, `settings`, `knowledge`, أو `lead`. لا كتابة، لا delete، لا queue، لا cache يحمل PII. إن طلب المستخدم بيانات خارج النطاق أو تعليمات/سرّاً أو SQL، يرفض المساعد بجملة ثابتة ويعيده لعرض المشاريع/الوحدات العامة.

### تطبيق الحدود في طبقات مستقلة

- أنشئ `AssistantCatalogRepository` بواجهة صغيرة، inject اتصال DB مخصصًا `assistant_readonly` بحساب DB `SELECT` فقط على `projects` و`units`؛ امنح صلاحيات صريحة فقط، بلا `GRANT` على أي جدول آخر، وبلا DDL/DML.
- اجعل `AssistantCatalogService` يستدعي repository فقط، ويُرجع DTO immutable/allowlisted. امنع استيراد Models أو Services أو Facades غير `Project`/`Unit` وconnection المقيد داخل مساحة Assistant.
- استبدل `HossamAssistantService` الحالي بمُنسّق محدود أو افصل مساراً جديداً ثم بدّل route بعد اكتمال الاختبارات. أزل من مسار المحادثة: `AssistantLead`، `HossamKnowledgeService`، `SettingsService`، `Article`، `Area`، currency API، علاقات users/images/types، وقراءة `env()`/config credentials في أي prompt.
- استخدم function/tool calling schema صارماً أو parser JSON مضبوطاً مع Zod/PHP validation؛ فشل parse أو محاولة أداة غير معروفة = لا استعلام، رد آمن عام.
- لا تثق في `context_url` أو `context_title`: إما حذفه من contract أو قبوله فقط كslug مُتحقق من allowlist routes وبلا أثر خارج الأدوات الثلاث. لا تستخدم host أو URL من العميل داخل prompt.
- لا تحفظ history على الخادم ولا أرقام هاتف. history يقتصر على آخر 6 رسائل، طولها محدود، تنظف من control characters، ويُرسل transient فقط ضمن حدود توكن صارمة. لا logging للنص أو الرد؛ سجّل request id، زمن، نتيجة، وعدد أدوات فقط.
- احتفظ بمفتاح مزود LLM في server secret فقط؛ لا تقرأ `.env` ولا تعرض config داخل مخرجات أو logs. اضبط allowlist لنطاق endpoint للمزود، timeout قصير، retry واحد آمن، circuit breaker، وfallback محلي لا يضيف بيانات.
- أعد تفعيل CSRF لمسار web أو انقله إلى API stateless مع same-origin/CORS صارم وtoken مناسب؛ لا الاستثناء الحالي. استخدم rate limiter واحداً (مثلاً 10/دقيقة و100/يوم لكل visitor مع تقييم واقعي) وحماية abuse عند الـ edge.
- اجعل رد API schema ثابتاً: `reply` نص plain، `recommended_units` مصفوفة DTOs من backend فقط، و`quick_replies` نصوص قصيرة؛ لا يقبل frontend HTML أو URL أو card data من النموذج.

## خطة الأمن والأداء وSEO

### الأمن والخصوصية

1. وثّق data-flow ومصفوفة الصلاحيات، ثم أنشئ حساب/connection القراءة فقط قبل تغيير route.
2. نفّذ repository + DTO + validator + allowlisted tools، وبعدها افصل المسار الحالي عن الجداول/الملفات المحظورة.
3. شدّد CSRF/CORS/rate limit، وحسّن CSP تدريجياً باستخدام report-only أولاً ثم nonces/hashes.
4. نفّذ renderer Markdown آمن: بدون HTML، وبروتوكولات `https` وrelative internal route فقط، وDOMPurify/URL validator كدفاع إضافي؛ escape لكل النصوص في البطاقات.
5. قلّل الاستبقاء: لا PII ولا history دائم ولا body في logs. أضف سياسة retention ومحو بيانات تشغيلية غير حساسة إن وجدت خارج المساعد بعد موافقة منفصلة.

### الأداء والموثوقية

1. query واحد أو اثنان كحد أقصى لكل turn، `select` أعمدة DTO فقط، `limit <= 6`، ومنع eager loading/joins في المساعد.
2. نفّذ `EXPLAIN` على `(is_active, project_id, price)` والمرشحات المستخدمة فعلياً؛ أضف فهرساً فقط إذا أظهر القياس حاجة، وبعد migration آمنة ومراجعة أثر الكتابة.
3. cache لنتيجة catalog العلنية بمفتاح normalized filters/locale وبـ TTL قصير مع invalidation عند تعديل مشروع/وحدة؛ لا cache لمحتوى رسالة أو هاتف.
4. سجّل metrics بلا PII: p50/p95، timeout، رفض أدوات، نتيجة صفرية، ومعدل 429. حدّد SLO: p95 backend دون LLM أقل من 300ms وp95 الإجمالي وفق قياس المزود.

### SEO

1. لا تجعل المحادثة أو ردودها قابلة للفهرسة أو تدخل في canonical/schema؛ تبقى واجهة تفاعلية فقط.
2. حافظ على `SeoService` وsitemap/prerender الحالية، ثم تحقق آلياً من canonical واحد، `hreflang` ثنائي متبادل، JSON-LD صالح، `robots.txt`، وXML sitemap وstatus 200.
3. راقب حجم HTML/LCP/CLS وطلبات JS، واستخدم Lighthouse أو PageSpeed على الصفحات العامة فقط. لا تعطّل prerender أو البيانات المنظمة.

## اختبارات القبول والأمان المطلوبة

### قبول وظيفي

- مشروع نشط معروف: يعرض بياناته العلنية الصحيحة فقط.
- وحدات مشروع محدد: كل نتيجة تملك `project_id` الخاص بالمشروع المطلوب و`is_active=true` وتلتزم price/rooms/payment/sort المسموح.
- مشروع/وحدة غير موجودة أو غير نشطة: لا تفاصيل ولا تأكيد لوجودها.
- طلب خارج المشروع، أو معرف وحدة لمشروع آخر: لا نتيجة (اختبار IDOR).
- لا تغيير في صفحات الوحدات/المشاريع العامة، البطاقات، البحث العادي، الإدارة، SEO أو أدوار المستخدمين؛ شغّل regression suite الحالية.

### تفويض/قاعدة بيانات

- اختبار integration بحساب `assistant_readonly`: `SELECT` من `projects`/`units` مسموح فقط؛ `INSERT/UPDATE/DELETE` مرفوض؛ `SELECT` من `users/messages/settings/points/assistant_leads/articles/areas` مرفوض.
- اختبار static/architecture يمنع `DB::`, `raw`, `selectRaw`, `whereRaw`, `orderByRaw`, filesystem/HTTP/config/env وModels المحظورة داخل مسار assistant catalog.
- اختبار SQL injection عبر slug/filters/sort مثل `' OR 1=1 --` واسم عمود/اتجاه sort: validation 422 أو نتيجة آمنة، ولا تتغير query shape.

### Prompt Injection وخصوصية

- حالات: "ignore previous instructions"، طلب system prompt/API key/.env، SQL، roleplay كمسؤول، أو تعليمات مزروعة في اسم/وصف وحدة. النتيجة: رفض ثابت، لا استدعاء أداة محظورة، ولا سر/مسار/تفاصيل داخلية.
- history و`context_url`/`context_title` الخبيثة: لا توسّع صلاحيات أو نتائج ولا تظهر في logs.
- فحص payload outbound للمزود (mock HTTP): لا phone/email/user_id/settings/messages/points/secret، ولا حقول خارج DTO.
- فشل المزود/JSON غير صالح/طلب tool غير مسموح: 200/4xx متفق عليه مع fallback محلي آمن، من دون stack trace أو body داخلي.

### XSS/CSRF/abuse

- ردود تحتوي `<script>`, event handlers, `javascript:`, `data:`, SVG/iframe، وروابط Markdown ملتوية: لا تنفيذ، ولا DOM HTML خطير، ولا redirect خارجي غير مسموح.
- POST من أصل مختلف بلا token: مرفوض؛ طلب same-origin صالح يعمل. تحقق من CORS وcookies `Secure/HttpOnly/SameSite` في الإنتاج.
- تجاوز limiter: 429 و`Retry-After`، ولا اتصال LLM عند الحظر.

### الأداء وSEO

- قياس عدد الاستعلامات (<=2/turn) وعدم eager-load علاقات، وEXPLAIN يستخدم الفهرس المستهدف عند وجود بيانات كافية.
- حمل متزامن/اختبار k6: ثبات limiter وعدم تجاوز timeout أو تدهور p95 المحدد.
- اختبارات SEO الحالية + تحقق crawler/Lighthouse: لا metadata مكرر، sitemap/canonical/hreflang/schema صالح، والمساعد غير مفهرس.

## ترتيب التنفيذ الواضح لتسليمه إلى GLM 5.3

1. **تثبيت خط أساس (قراءة فقط):** احفظ `git status` الحالي، شغّل الاختبارات/lint في بيئة منفصلة، وسجّل النتائج. لا تدمج أو تنظف التغييرات القائمة.
2. **عقد أمن مكتوب:** أضف ADR قصيراً ومصفوفة صلاحيات assistant، DTO schema، ورفضات ثابتة؛ وافق على قائمة الأعمدة العلنية من `projects` و`units` قبل الكود.
3. **الحد البنيوي:** جهز مستخدم DB وconnection `assistant_readonly`، grants محددة، وrepository مغلق. اختبر grants أولاً.
4. **بناء المسار المقيد:** DTOs، filter validator، الأدوات الثلاث، service orchestrator وfallback محلي؛ بلا استيراد من المجالات المحظورة.
5. **قطع الوصول القديم:** حوّل controller/route للمسار المقيد، أزل الكتابة والتعلم/التقاط lead وقراءة settings/articles/areas/relationships من مسار chat فقط. لا تحذف شاشات أو ميزات الإدارة؛ فقط افصلها عن المساعد.
6. **تحصين النقل والعرض:** CSRF/CORS/limiter، sanitization/renderer، logs وmetrics بلا PII، timeout/circuit breaker.
7. **الأداء:** عدّ الاستعلامات، EXPLAIN، cache DTO آمن، ثم migration للفهرس فقط إذا بررته القياسات.
8. **SEO والتحقق:** regression لـ sitemap/metadata/prerender ثم Lighthouse/crawler؛ لا تغيّر ميزات SEO ما لم يكشف الاختبار خللاً.
9. **بوابة تسليم:** شغّل PHP tests وPest، ESLint، Playwright، اختبارات assistant الأمنية، اختبار DB grants، وload smoke. راجع diff للتأكد من عدم وجود حذف/تعطيل لميزة قائمة أو تعديل غير مقصود في الأصول المبنية.
10. **نشر مرحلي:** feature flag داخلي للمسار الجديد، مراقبة الأخطاء/429/p95/رفض الأدوات، ثم تفعيل كامل بعد تحقق acceptance. خطة rollback تقتصر على route implementation ولا تعيد الوصول المحظور.

## تعريف الإنجاز

يُقبل التسليم فقط إذا أثبتت الاختبارات أن المساعد يقرأ `projects` و`units` النشطين فقط عبر أدوات ثابتة، لا يكتب شيئاً، لا يصل أو يرسل بيانات `users/messages/settings/points` أو أي جدول/ملف/سر آخر، ويرفض injection/IDOR/XSS/SQL injection، مع بقاء كل ميزات المشروع القائمة تعمل دون حذف أو تعطيل.

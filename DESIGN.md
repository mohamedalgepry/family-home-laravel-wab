---
name: Family Home — فاميلي هوم
description: منصة تسويق عقاري عربية تحوّل التصفح إلى اتصال مباشر
colors:
  primary: "#CC0000"
  primary-deep: "#B00000"
  primary-light: "#FF6B6B"
  primary-ghost: "#FFF5F5"
  primary-badge: "#FFE3E3"
  neutral-ink: "#1A1A1A"
  neutral-body: "#3D3D3D"
  neutral-muted: "#6B6B6B"
  neutral-border: "#E4E4E4"
  neutral-surface: "#F5F5F5"
  neutral-white: "#FFFFFF"
  whatsapp: "#16a34a"
  whatsapp-hover: "#15803d"
  amber-featured: "#d97706"
typography:
  display:
    fontFamily: "'Cairo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Cairo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "'Cairo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "'Cairo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "'Cairo', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.025em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-muted}"
    rounded: "{rounded.xl}"
    padding: "12px 20px"
  card-unit:
    backgroundColor: "{colors.neutral-white}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  input-field:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.xl}"
    height: "44px"
---

# Design System: Family Home — فاميلي هوم

## Overview

**Creative North Star: "المنزل الأول"**

فاميلي هوم تصمم من منظور العميل الذي يبحث عن منزله الأول — لحظة حياتية مفعمة بالأمل والترقب. التصميم يُرحّب قبل أن يقنع، ويُشعر المتصفح بالاطمئنان والانتماء قبل أن يضغط على أي زر. هذا ليس متجراً لعرض السلع؛ هو دليل موثوق يقود نحو قرار مصيري.

الواجهة تعتمد **خلفية بيضاء ناصعة** تتيح لصور العقارات أن تسرد القصة بنفسها. الأحمر — بدرجته الداكنة المضبوطة (`#CC0000`) — هو صوت الشركة الوحيد المرفوع: يظهر في الأزرار الرئيسية، سعر الوحدة، والروابط النشطة، لكنه يبقى نادراً كي يحتفظ بثقله. كل عنصر آخر هادئ ومتراجع، يُبرز المحتوى لا نفسه.

الكثافة **متوسطة-خفيفة**: مسافات سخية بين العناصر، بطاقات ذات ظلال ناعمة، وانتقالات سلسة توحي بالاحترافية دون أن تُثقل تجربة الهاتف أو الاستضافة المشتركة.

**Key Characteristics:**
- أبيض سائد، أحمر مُستدعى لا مبثوث
- صور العقارات هي البطل البصري الأول
- واتساب أخضر — CTA لا يُعدل ولا يُهادن
- Cairo يعمل عربياً ولاتينياً: خط واحد، لغتان، لا مساومة
- انتقالات RTL شفافة — العربي سلوك لا ترجمة

## Colors

الباليت محسوب بدقة: أبيض هيكلي، رمادي للمحتوى، أحمر واحد للمواضع الحاسمة.

### Primary
- **Crimson Authority — الأحمر السلطوي** (`#CC0000`): لون الشركة الرئيسي. يُستخدم حصراً في الأزرار الرئيسية، السعر، النص النشط في القائمة، والبادجات القصيرة. رؤيته نادرة على أي شاشة مقصودة.
- **Deep Crimson — الأحمر العميق** (`#B00000`): حالة Hover لكل ما هو Primary. أداء وليس زينة.
- **Coral Accent — الكورال الفاتح** (`#FF6B6B`): للأيقونات الثانوية وأطراف التدرجات. لا يُستخدم على نص.
- **Crimson Ghost — الأحمر الشفاف** (`#FFF5F5`): خلفية الـ badge، حالات Hover الخفيفة للبطاقات، وأي سطح يحتاج لمَسّة لونية دون ثقل.

**The One Red Rule.** الأحمر يظهر في أقل من ٣ عناصر مرئية في أي وقت واحد. كثرته تُفقده معناه.

### Neutral
- **Ink Black — أسود الحبر** (`#1A1A1A`): نصوص الواجهة الداكنة — العناوين والقيم الحرجة.
- **Charcoal Body — الفحمي** (`#3D3D3D`): جسم النص، تفاصيل البطاقات.
- **Slate Muted — الرمادي الكاتم** (`#6B6B6B`): نصوص ثانوية، metadata، placeholders.
- **Silver Border — فضي الحدود** (`#E4E4E4`): فواصل، حدود البطاقات، قسمات الجدول.
- **Pearl Surface — سطح اللؤلؤ** (`#F5F5F5`): خلفية المدخلات والـ chips والتعبئة الخفيفة.
- **White Canvas — القماشة البيضاء** (`#FFFFFF`): الخلفية الكونية للموقع وبطاقات الوحدات.
- **WhatsApp Green** (`#16a34a`): CTA واتساب فقط. لا يُقترب منه من ألوان أخرى.
- **Amber Featured** (`#d97706`): badge الوحدات المميزة فقط — ذهب دافئ يعني الأولوية.

## Typography

**Display/Body/Label Font:** Cairo (woff2 محلي، يغطي العربية والإنجليزية)

**Character:** Cairo يجمع بين وضوح الخط اللاتيني وطلاقة العربي في ملف واحد محلي. الأوزان المستخدمة: 400 (عادي)، 500 (متوسط)، 600 (شبه عريض)، 700 (عريض). الحرف بطبيعته قصير الطول العمودي (x-height) مما يجعله أكثر قراءة على الشاشات الصغيرة عند الأوزان الكبيرة.

### Hierarchy
- **Display** (700، clamp(2rem, 5vw, 3rem)، 1.2): عنوان الصفحة الرئيسي والـ Hero. يُستخدم مرة واحدة فقط per page.
- **Headline** (700، clamp(1.5rem, 3vw, 1.875rem)، 1.3): عناوين الأقسام الرئيسية والصفحة المفردة للوحدة.
- **Title** (600، 1.25rem، 1.4): عنوان البطاقة، عناوين النماذج، headers الجدول.
- **Body** (400، 1rem، 1.7): المحتوى الطويل، الوصف، مقالات. حد القراءة المريحة 65-70 حرفاً.
- **Label** (600، 0.75rem، 1.5، letter-spacing: 0.025em): التسميات، الـ badges، ملصقات الأزرار، headers الأعمدة.

**The One Font Rule.** Cairo وحده في كامل الواجهة — عربي ولاتيني، RTL وLTR. لا تسمح بأي خط آخر حتى لأغراض الزينة.

## Layout

الموقع يعمل على حاوية بعرض أقصى `1280px` (`max-w-[1280px]`) بهوامش أفقية `px-4` على الجوال و`px-6` على الحواسب. لا استخدام لـ breakpoints غير الضرورية — الشبكة تعمل أولاً للجوال وتتوسع.

**Grid:** شبكة `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` لبطاقات الوحدات — الكثافة تزيد مع الشاشة دون أن تُفقد الصورة جماليتها. الـ gap ثابت عند `gap-6` (24px).

**Sections rhythm:** الفواصل بين الأقسام `py-12` إلى `py-16` (48-64px) على الجوال، `py-20` (80px) على الحاسوب. التنفس السخي يخدم بضاعة الصور.

**الـ Header:** ثابت (sticky) بارتفاع 64px، خلفية `bg-white/90` مع `backdrop-blur-md`. يتحول لقائمة منسدلة على الجوال عند md.

**Responsive behavior:** الأولوية للجوال — الصور تُكتشف بـ `aspect-[4/3]` ثابت على كل الأجهزة لمنع القفز. الـ UnitCard يُكدَّس رأسياً على الجوال.

## Elevation & Depth

النظام يعتمد على **ظلال ناعمة للرفع الهيكلي** لا الديكوري. لا توجد ظلال ملوّنة أو درامية — العمق محسوب ومنضبط.

### Shadow Vocabulary
- **Card Rest** (`0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`): ظل البطاقات في حالة الراحة. خفي بالكاد.
- **Card Hover** (`shadow-2xl` — `0 25px 50px rgba(0,0,0,0.25)`): يظهر عند hover مع `-translate-y-1.5` لتوليد إحساس الرفع الفعلي. هذا الانتقال هو أوضح لغة تفاعل في النظام.
- **Dropdown** (`0 4px 6px rgba(0,0,0,0.07)`): القوائم المنسدلة.
- **Modal** (`0 10px 25px rgba(0,0,0,0.12)`): النوافذ المنبثقة.
- **Sticky Header** (`0 4px 6px rgba(0,0,0,0.05)`): الـ header عند الثبات.

**The Flat-By-Default Rule.** الأسطح في حالة الراحة شبه مسطحة. الظل الثقيل يظهر فقط كاستجابة للحركة أو الرفع، لا كطبقة ثابتة.

## Shapes

النظام يُفضّل **الزوايا المدورة بثقة** — لا زوايا حادة ولا دوائر كاملة في المكونات الكبيرة. الخطاب المرئي هو: ودي ومحترف معاً.

- **Card corners** (24px / `rounded-2xl`): البطاقة الرئيسية — دورة واسعة تُبدو المحتوى محمياً ومُؤطَّراً.
- **Button corners** (12px / `rounded-xl`): الأزرار — ودية دون أن تكون دائرية.
- **Input corners** (12px / `--control-radius`): مدخلات النماذج — يتطابق مع الأزرار للاتساق البصري.
- **Badge corners** (`9999px` / `rounded-full`): الـ chips والـ badges — فقاعة كاملة تُميّز عن المكونات الكبيرة.
- **Menu corners** (16px / `rounded-xl`): القوائم المنسدلة.
- **MenuItems corners** (8px / `rounded-md`): عناصر القائمة داخلياً.

**The Hierarchy of Roundness.** كلما كان المكوّن أكبر وأثقل، كلما كان تدويره أوسع. البطاقات (2xl) > الأزرار (xl) > العناصر الداخلية (md).

## Components

### Buttons
الأزرار حازمة وذات طاقة محسوسة — تتقلص 0.97 عند الضغط (`active:scale-[0.97]`) وتنتقل بـ `cubic-bezier(0.4, 0, 0.2, 1)`.

- **Shape:** مُدوَّرة بـ 12px (`rounded-xl`)، ارتفاع `44px` كحد أدنى (touch target).
- **Primary:** خلفية `#CC0000`، نص أبيض، padding `12px 20px`. على hover: `#B00000` مع `hover:shadow-md`. على focus: حلقة `focus:ring-2 focus:ring-primary-900`.
- **Secondary:** خلفية `#F5F5F5`، نص `#1A1A1A`. على hover: `#E4E4E4`.
- **Ghost:** خلفية شفافة، نص `#6B6B6B`. على hover: خلفية `#F5F5F5`.
- **WhatsApp CTA:** خلفية `#ecfdf5`، نص `#16a34a`. على hover: خلفية `#16a34a`، نص أبيض. هذا الزر لا يتغير في أي ظرف — هو ثابت النظام الأول.

### Cards / Containers — UnitCard
البطاقة هي المكوّن الأهم في النظام. الصورة تأخذ نسبة `4:3` وتسحب وتكبر `scale-108` على hover.

- **Corner Style:** 24px (`rounded-2xl`).
- **Background:** أبيض (`#FFFFFF`) بحد خفي `border-secondary-100/70`.
- **Shadow Strategy:** خفيف في الراحة (`shadow-card`)، ثقيل على hover (`shadow-2xl`) مع `hover:-translate-y-1.5`.
- **Internal Padding:** `p-5` (20px).
- **Image overlay:** تدرج من أسفل (`from-secondary-950/60`) يُبرز التسميات.
- **Featured Badge:** `amber-500→amber-600` gradient مع نجمة SVG — لا يُعدَّل.
- **Price styling:** `text-2xl font-black text-primary-900` — السعر هو القيمة المنطوقة بصوت عالٍ.
- **Action footer:** واتساب (أخضر) + مقارنة (رمادي محايد)، مفصولان ببادج اللون.

### Inputs / Fields
- **Style:** خلفية `#F5F5F5`، بدون حد في الراحة (`border: 2px solid transparent`)، مُدوَّرة 12px.
- **Hover:** خلفية `#E4E4E4`.
- **Focus:** خلفية بيضاء، حد `2px solid #CC0000`، halo `0 0 0 4px #FFE3E3`.
- **Error:** حد `#EF4444`، خلفية `rgba(239,68,68,0.05)`.
- **Height:** `44px` ثابتة (textarea يختلف).

### Navigation — Header
- **Style:** خلفية `white/90` + `backdrop-blur-md`، ارتفاع `64px`، ثابت (sticky) أعلى الصفحة.
- **Nav links:** `text-sm`، حد سفلي `2px` شفاف في الراحة، `#CC0000` عند النشاط أو الـ hover.
- **Active state:** نص `#CC0000`، حد سفلي `#CC0000`، `font-semibold`.
- **Mobile:** قائمة منسدلة تحت الـ header بخلفية بيضاء، عناصر `rounded-lg`.
- **Logo:** صورة 32x32 + نص `text-xl font-bold text-primary-900`.

### Chips / Badges
- **Style:** `rounded-full`، خلفية متغيرة حسب النوع، font-size `11px` (badge).
- **Featured:** gradient `amber-500→amber-600`، أبيض، مع أيقونة نجمة.
- **Transaction type (sale/rent):** `bg-secondary-900/80 backdrop-blur-md`، أبيض.
- **Area overlay:** `bg-black/40 backdrop-blur-sm`، أبيض، `text-xs`.
- **Price currency:** `bg-primary-50 text-primary-800`، مع `ms-2`.

## Do's and Don'ts

### Do:
- **Do** استخدم `#CC0000` حصرياً في الأزرار الرئيسية، السعر، والروابط النشطة — لا تُفرِّقه على عناصر ثانوية.
- **Do** حافظ على `aspect-[4/3]` لكل صور الوحدات لمنع القفز البصري عند التحميل.
- **Do** حافظ على اللون الأخضر للواتساب (`#16a34a`) في حالته الصارمة — هذا CTA لا يتنافس لونياً.
- **Do** استخدم `rounded-2xl` للبطاقات و`rounded-xl` للأزرار والمدخلات فقط — الاتساق في التدوير هو منطق النظام.
- **Do** أضف `hover:-translate-y-1.5 hover:shadow-2xl` على كل بطاقة قابلة للنقر — الرفع الحركي هو لغة التفاعل.
- **Do** استخدم `font-black` (900) للسعر فقط — هو الرقم الذي يُتَّخذ عليه القرار.
- **Do** احرص على أن أي CTA على الهاتف يبلغ `44px` ارتفاعاً — touch target لا تفاوض عليه.

### Don't:
- **Don't** تُبعثر الأحمر على أكثر من ثلاثة عناصر مرئية في نفس الوقت — كثرته تُفقده سلطته.
- **Don't** تستخدم خطاً غير Cairo في أي جزء من الواجهة العامة.
- **Don't** تُعدّل تدرج الـ Featured Badge أو لون واتساب — كلاهما ثابت النظام الأول.
- **Don't** تستخدم ظلالاً ملوّنة — الظلال رمادية محايدة فقط.
- **Don't** تُعرض البطاقات بدون صورة مع سطح فارغ — استخدم `/images/fallback.webp` دائماً.
- **Don't** تبدأ نصاً عربياً من اليسار أو عكسه — RTL/LTR محدد دائماً عبر خاصية `dir`.
- **Don't** تُقلَّل padding الـ section إلى أقل من `py-12` على الجوال — التنفس في العرض العقاري ليس ترفاً.

---

## Recent Updates & Enhancements Documentation (أحدث التحديثات والتحسينات)

### 1. Agent Contact Fallback Logic (`Utils/contact.js`)
- **Helper Function**: `getAgentContacts(agent, settings)`
- **Behavior**: Checks if the agent/user has configured their own WhatsApp (`agent.whatsapp` / `agent.profile.whatsapp`) or Phone (`agent.phone` / `agent.profile.phone`).
- **Fallback**: If unpopulated, seamlessly falls back to site settings (`settings.company_whatsapp` and `settings.phone`).
- **Integrations**: Standardized across `Units/Show.jsx`, `Projects/Show.jsx`, `UnitCard.jsx`, `ProjectCard.jsx`, `AgentCard.jsx`, and `Agents/Show.jsx`.

### 2. Universal Image & Thumbnail Normalization (`Utils/image.js`)
- **Helper Function**: `getStorageUrl(path, fallback = PLACEHOLDER)`
- **Behavior**: Eliminates duplicate `/storage/storage/` paths and relative URL 403 Forbidden issues.
- **Fallback**: Returns `/images/fallback.webp` whenever image data is missing or empty.

### 3. Mobile UI & Action Bar Enhancements
- **Fixed Mobile Bottom Action Bar**: Sticky `sm:hidden` bar in `Units/Show.jsx` and `Projects/Show.jsx` featuring direct Call and WhatsApp CTAs.
- **Photo Counter Badge**: Overlay `X / N` counter badge on main property and project galleries.
- **Hero & SearchBar Layout**: Removed duplicate SearchBar instances and fixed filter dropdown clipping by elevating z-index (`z-50`) with high-contrast white card background.

### 4. Localization Engine & Dictionary Synchronization (`Utils/trans.js`, `locales/ar.js`, `locales/en.js`)
- **Coverage**: Achieved 100% full key parity between Arabic (563 keys) and English (563 keys).
- **Synchronous Import**: Updated `trans.js` to statically import `ar.js` and `en.js` to eliminate dynamic import delay glitches and prevent raw key fallback text.


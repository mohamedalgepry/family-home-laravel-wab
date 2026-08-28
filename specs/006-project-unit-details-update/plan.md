# Implementation Plan: Project & Unit Details Pages Update

**Feature**: Project & Unit Details Pages Update (specs/006-project-unit-details-update)
**Status**: Ready for Implementation
**Target Branch**: Current branch (direct execution)

## Technical Context
The project uses Laravel 13 + Inertia.js 3.6 + React 19 + Tailwind CSS v4. Pages are React components receiving data via Inertia props from `ProjectPublicResource` and `UnitPublicResource`.

## HARD BACKEND FREEZE
Do **NOT** modify:
- `routes/`
- `app/Http/`
- `app/Domain/`
- `app/Models/`
- `database/`
- `migrations/`
- Requests, Controllers, Services, Resources
- Authentication, Authorization
- SEO backend logic, sitemap logic
- Search/query backend logic

*If a frontend requirement appears to require backend changes: STOP and report it instead of modifying the backend.*

## Bugs Found During Audit

### 🔴 Critical Bugs (User-Facing Breakage)

| # | Bug | File | Lines | Impact |
|---|-----|------|-------|--------|
| C1 | **Dual mobile bottom bars overlap** — two `fixed bottom-0` bars collide on <640px viewports | Project Show.jsx | L715-736, L788-808 | Buttons untappable on all mobile phones |
| C2 | **Dual mobile bottom bars overlap** — same collision on Unit page | Unit Show.jsx | L968-985, L1042-1061 | Buttons untappable on all mobile phones |
| C3 | **Fake features displayed** — 6-7 hardcoded fake amenities shown when project/unit has no features | Both Show.jsx | Proj L461-468/L584-591, Unit L542/L780 | Visitors see deceptive data |
| C4 | **Feature icons ignored** — admin-configured `icon_name` replaced by hardcoded checkmark SVG | Both Show.jsx | All features sections | Admin icon assignments have no effect |
| C5 | **Mobile contact form broken** — missing `id="contact-form"`, email field, validation errors, success banner | Unit Show.jsx | L849-893, L977-984 | "Contact Agent" button dead on mobile, no form feedback |
| C6 | **Hardcoded delivery year "2026"** — not bound to `project.delivery_date` | Project Show.jsx | L503 | Shows wrong delivery date |
| C7 | **Map fallback to Cairo** — shows downtown Cairo coordinates when lat/lng are null | Both Show.jsx | Proj L516/L619, Unit L715/L838 | Misleading location for non-Cairo properties |

### 🟡 Data Display Gaps (Admin Data Not Shown)

| # | Missing Data | File | Impact |
|---|-------------|------|--------|
| D1 | **Payment terms missing on mobile** | Both Show.jsx | Mobile users never see financing options |
| D2 | **`floor` number not displayed** (only in JSON-LD) | Unit Show.jsx | Buyers can't see floor info |
| D3 | **`finishingType` not displayed** on Unit page | Unit Show.jsx | Critical property attribute hidden |
| D4 | **`is_deal` badge not shown** | Unit Show.jsx | Deal/hot-offer status invisible |
| D5 | **`video_path` (uploaded MP4) ignored** | Both Show.jsx | Admin-uploaded videos never play |
| D6 | **Finishing type hardcoded fallback** on Project page | Project Show.jsx | Shows "سوبر لوكس" instead of actual data |
| D7 | **Area card missing on mobile** when unit has no project | Unit Show.jsx | Area navigation broken on mobile |
| D8 | **Project status hardcoded "متاح للبيع"** | Project Show.jsx | Always says "Available for Sale" regardless |

### 🟢 Minor Issues

| # | Issue | File | Lines |
|---|-------|------|-------|
| M1 | Unused `AgentCard` import | Project Show.jsx | L9 |
| M2 | `#units-list` nav tab always visible (dead link when 0 units) | Project Show.jsx | L397 |
| M3 | `#features` nav tab always visible when features section hidden | Both Show.jsx | Proj L396, Unit L475 |
| M4 | `#video` anchor on Unit photo jumps to `#video` (desktop ID) but mobile video has `id="video-mob"` | Unit Show.jsx | L218-227 |
| M5 | Active tab styling hardcoded on Overview (no scroll-spy) | Both Show.jsx | — |

## Execution Protocol

For EACH file modification:
1. Inspect the existing JSX and all imported components
2. Define the changes before editing
3. Modify frontend files only
4. Run `npm run build` after completing changes
5. Verify RTL and LTR
6. Verify mobile, tablet, and desktop layouts

## Execution Order

### Phase 1: Project Details (Show.jsx) — Critical Fixes
**File**: `resources/js/Pages/Public/Projects/Show.jsx`

1. **Remove unused import** (M1): Delete `AgentCard` import at line 9
2. **Fix duplicate mobile bottom bars** (C1): Remove the first bar (L715-736 using `company_whatsapp` directly) and keep only the second bar (L788-808 using `agentContacts`) — consolidate into a single `md:hidden` bar
3. **Fix fake features** (C3): Replace fake feature fallback with conditional rendering — hide `#features` section when `!project.features?.length`
4. **Render dynamic feature icons** (C4): Use `IconByName` component to render `feature.icon_name` instead of hardcoded checkmark SVG
5. **Fix map fallback** (C7): Add coordinate validation — hide map section when lat/lng are null/zero instead of defaulting to Cairo
6. **Fix delivery date** (C6): Replace hardcoded "2026" with `project.delivery_date`
7. **Fix finishing type fallback** (D6): Replace hardcoded "سوبر لوكس" with actual `project.finishingType?.name` and hide when null
8. **Fix project status hardcode** (D8): Remove hardcoded "متاح للبيع" or conditionally show based on actual data
9. **Add payment terms to mobile** (D1): Port payment terms block from desktop (L413-431) into mobile overview section
10. **Add area to mobile info card** (D2): Include area name in mobile info card section
11. **Fix nav tab conditional rendering** (M2, M3): Wrap `#units-list` in `{projectUnitsList.length > 0 && ...}` and `#features` in `{project.features?.length > 0 && ...}`
12. **Add video_path support** (D5): When `embedUrl` is null but `project.video_path` exists, render HTML5 `<video>` element

### Phase 2: Unit Details (Show.jsx) — Critical Fixes
**File**: `resources/js/Pages/Public/Units/Show.jsx`

1. **Fix duplicate mobile bottom bars** (C2): Consolidate two overlapping fixed bars into one unified mobile action bar
2. **Fix fake features** (C3): Same fix as Project — conditional rendering when no features
3. **Render dynamic feature icons** (C4): Same fix as Project — use `IconByName`
4. **Fix mobile contact form** (C5):
   - Add `id="contact-form"` to mobile contact section
   - Add `client_email` input field
   - Add validation error displays for all fields (`errors.client_name`, `errors.client_phone`, `errors.client_email`, `errors.content`)
   - Add success banner matching desktop
5. **Fix map fallback** (C7): Same coordinate validation as Project
6. **Add `floor` to quick specs** (D2): Add floor number row to the specifications grid
7. **Add `finishingType` display** (D3): Add finishing type badge/tag to specs or details section
8. **Add `is_deal` badge** (D4): Show "صفقة مميزة / Hot Deal" badge on the main photo overlay when `unit.is_deal`
9. **Add payment terms to mobile** (D1): Port payment terms to mobile overview section
10. **Add area card to mobile** (D7): Show area exploration card on mobile when `unit.project` is null
11. **Fix nav tab rendering** (M3): Wrap `#features` tab in `{unit.features?.length > 0 && ...}`
12. **Fix video anchor on mobile** (M4): Change `#video` anchor to scroll to correct section based on viewport
13. **Add video_path support** (D5): Same HTML5 video support as Project
14. **Add phone/email validation errors to desktop form**: Display `errors.client_phone` and `errors.client_email`

### Phase 3: Build & Verification
1. Run `npm run build` — ensure zero errors
2. Test RTL (Arabic) and LTR (English) for both pages
3. Test mobile (390px), tablet (768px), desktop (1440px)
4. Test with full-data records and partial-data records
5. Test contact form validation and submission
6. Verify no console errors

## Constitution Check
- **Zero Backend Changes**: Mandated and Enforced — only `resources/js/Pages/Public/Projects/Show.jsx` and `resources/js/Pages/Public/Units/Show.jsx` will be modified
- **Design System Preserved**: All changes use existing DESIGN.md tokens (colors, typography, spacing, radii)
- **SEO/Metadata Preserved**: JSON-LD, OpenGraph, meta tags, and breadcrumbs remain intact
- **No New Dependencies**: All fixes use existing components and utilities (`IconByName`, `getStorageUrl`, `getYouTubeEmbedUrl`, `getAgentContacts`)

### Phase 4: Post-Implementation Audit Fixes (FR-6)
**Files**: esources/js/Pages/Public/Projects/Show.jsx, esources/js/Pages/Public/Units/Show.jsx, esources/js/Pages/Public/Home.jsx, and potentially a new VideoPlayer component.

1. **Design System (FR-6.1)**:
   - Change 	ext-[#CC0000] on feature icons (IconByName) to 	ext-[#FF6B6B] (Coral Accent) or 	ext-[#6B6B6B] in both Show pages.
   - Wait, is_deal badge was removed in FR-6.4 clarification, so skip badge styling.

2. **Code Smells (FR-6.2)**:
   - Extract hasValidCoords logic to a utility function and import it in both pages.
   - Extract the Video Player logic into esources/js/Components/UI/VideoPlayer.jsx.
   - Extract the Payment Terms block into esources/js/Components/UI/PaymentTerms.jsx.

3. **Missing Requirements (FR-6.3)**:
   - In Units/Show.jsx, on contact form success (onSuccess callback from Inertia useForm), call eset() and set a timer to clear the success state after 7 seconds.
   - Add inline validation error displays ({errors.client_name && ...}) for client_name and content fields in the desktop form (mobile was done, desktop missed).
   - Add Unit Type (unit.type?.name) to the specifications grid in Units/Show.jsx.
   - Add onClick smooth-scroll (document.querySelector('#contact-form').scrollIntoView({ behavior: 'smooth' })) to the "Contact Agent" button instead of just href="#contact-form".

4. **Scope Creep Removal (FR-6.4)**:
   - Remove ideo_path logic (HTML5 video tags) from both files. Only keep YouTube embedUrl.
   - Revert the nav tab logic (embedUrl || project.video_path) back to just embedUrl.
   - Remove delivery_date and is_active from Projects/Show.jsx.
   - Remove is_deal badge from Units/Show.jsx.

5. **Animation & Motion (FR-6.5)**:
   - In Units/Show.jsx, change 	ransition-all on form inputs to 	ransition-colors.
   - Change 	ransition-all on the "Watch Video" button and "Explore Properties in this Area" link to 	ransition active:scale-[0.97] duration-150 ease-out.

6. **Home Page Search Bar (FR-6.6)**:
   - In esources/js/Pages/Public/Home.jsx, change initialAreas to reas, initialUnitTypes to unitTypes, initialFeatures to eatures, and initialFinishingTypes to inishingTypes where passed to <SearchBar>.


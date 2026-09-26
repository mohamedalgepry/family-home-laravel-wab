# Specification: Family Home Production Hardening

## 1. Feature Description

A comprehensive, surgical remediation of the Family Home real-estate platform (`family-home-laravel-wab`) to bring it to production-grade quality across **security, SEO, performance, accessibility, UX, database optimization, AI assistant reliability, and code hygiene** — while preserving every existing feature, the current technology stack (Laravel + Inertia.js + React + Vite + MySQL + Tailwind CSS), and all business logic not explicitly targeted for repair.

The work spans 21 coordinated phases. No framework substitutions, no feature removals, and no speculative refactoring are permitted. Every change must be verified against the specific acceptance criteria listed below.

---

## 2. User Scenarios & Testing

### 2.1 Security — Default Credentials Removal
- **Given** a developer clones the repository
- **When** they inspect database seeds, SQL dumps, and factory files
- **Then** no hard-coded admin/manager/agent passwords or email-password pairs (e.g. `admin@admin.com`) are present in version control.
- **And** a secure CLI command (`php artisan app:create-admin`) allows creating an admin interactively with email, hidden password input, password-strength validation, and duplicate-email prevention.

### 2.2 Security — Prerender Path Traversal Prevention
- **Given** a malicious request contains path traversal sequences (`../`, `..\\`, `%2e%2e/`, `%252e%252e/`, absolute paths)
- **When** the prerender service resolves a cache file path
- **Then** the resolved path is validated via `realpath()` to be within `storage/app/prerendered` and the request is rejected (HTTP 403) or safely ignored if it escapes that boundary.

### 2.3 Security — File Upload Protection
- **Given** a user uploads a file through any upload endpoint (media, unit images, project images, editor)
- **When** the file has a dangerous extension (`.php`, `.phtml`, `.phar`, `.cgi`, `.sh`, `.exe`, etc.) or mismatched MIME type
- **Then** the upload is rejected, the stored filename is randomized, and MIME + extension + size + image validity are all verified before persistence.

### 2.4 Security — Headers & CORS
- **Given** a browser requests any page or resource
- **When** the server responds
- **Then** responses include `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and CSP includes `object-src 'none'; base-uri 'self'` without breaking Google Analytics, YouTube, Google Maps, WhatsApp, Inertia, or Vite.
- **And** CORS `Access-Control-Allow-Origin: *` is removed from all resources that do not require cross-origin access; any CORS-enabled endpoint is scoped to specific origins only.

### 2.5 Data Integrity — HTML Entity Double Encoding Fix
- **Given** property listings, project data, or SEO metadata contain multi-level encoded entities (e.g. `&amp;amp;amp;amp;`)
- **When** the data is displayed on the website
- **Then** the text renders correctly as plain characters (e.g. `&`), with no visual encoding artifacts.
- **And** a safe data migration/command normalizes existing double-encoded records in the database without corrupting intentional HTML content.

### 2.6 SEO — Canonical, Hreflang, and Metadata
- **Given** a visitor or search engine crawler accesses any public page
- **When** the HTML head is rendered
- **Then** exactly one canonical URL (absolute, HTTPS, no extraneous query parameters), correct `hreflang` tags (`ar`, `en`, `x-default`) pointing to actual counterpart pages, dynamic GEO metadata matching the property/project location (or omitted if unavailable), context-appropriate OG images, and clean plain-text meta descriptions are present — with zero duplicate `<title>`, `<meta>`, `<link rel="canonical">`, or `<h1>` tags.

### 2.7 SEO — Filter Pages
- **Given** a visitor navigates to a listing page with filter query parameters (price, size, area, sort, rooms, etc.)
- **When** the page is rendered
- **Then** `noindex, follow` robots directives are applied and canonical/pagination tags do not conflict.

### 2.8 Performance — CSS & JavaScript Optimization
- **Given** a public visitor loads a page
- **When** the browser downloads CSS and JavaScript bundles
- **Then** the CSS payload is reduced by removing unused, duplicate, and obsolete rules without visual changes; the public JS bundle excludes admin-only dependencies (TipTap, Recharts, admin components); and heavy pages use lazy loading where appropriate.

### 2.9 Performance — Image Optimization
- **Given** a page contains hero images or gallery images
- **When** the images load
- **Then** hero/above-the-fold images use `fetchpriority="high"` and `decoding="async"`; all below-fold images use `loading="lazy"` and `decoding="async"`; responsive `srcSet`/`sizes` attributes prevent oversized downloads.

### 2.10 UX — Property Detail Page Consolidation
- **Given** a visitor views a property detail page on desktop or mobile
- **When** the page renders
- **Then** each content section (overview, payment, project info, location, features, etc.) appears exactly once in the DOM — not duplicated for separate desktop/mobile layouts — following the specified section order: Gallery → Title → Price → Payment → Primary CTA → Key Specs → Description → Features → Payment Details → Project → Location → Agent → WhatsApp/Call → Similar Units.
- **And** mobile users see a fixed bottom action bar with Call and WhatsApp buttons that does not obscure content, other buttons, cookie banners, or chat widgets, and respects `env(safe-area-inset-bottom)`.

### 2.11 UX — Search Interface
- **Given** a visitor uses the property search interface
- **When** the search form is displayed
- **Then** on desktop, the primary controls are: Sale/Rent toggle, Area, Property Type, Budget, and Search button — with advanced filters hidden under an expandable section. On mobile, the flow is: Area → Property Type → Budget → Search → Advanced Filters.

### 2.12 UX — Visual Polish
- **Given** a visitor browses the site
- **When** they interact with cards, buttons, and hover effects
- **Then** card hover effects are subtle (max `hover:-translate-y-1`, `hover:shadow-lg`), the header blur is `backdrop-blur-md`, and card heights, spacing, and button styles are consistent — conveying a premium real estate identity rather than a SaaS dashboard aesthetic.

### 2.13 Accessibility — Keyboard & Screen Reader Support
- **Given** a user navigates using keyboard only or a screen reader
- **When** they interact with the lightbox, mobile menu, dialogs, forms, and search
- **Then** the lightbox has `role="dialog"`, `aria-modal="true"`, supports Escape/Arrow keys, and manages focus correctly; the mobile menu closes on Escape, traps focus, uses `aria-expanded`/`aria-controls`, and restores focus on close; and all images have `alt` text.
- **And** users who prefer reduced motion (`prefers-reduced-motion: reduce`) see all animations and transitions effectively disabled.

### 2.14 Database — Query Optimization
- **Given** the application queries the database
- **When** listings, projects, or related data are fetched
- **Then** N+1 queries are eliminated via eager loading, `select(...)` is used to avoid `SELECT *`, and appropriate indexes exist on commonly filtered/sorted columns (`is_active`, `is_deal`, `is_pinned`, `priority_points`, `user_id`, `project_id`, `area_id`, `unit_type_id`, `created_at`) without duplicating existing ones.

### 2.15 AI Assistant — Timeout & Privacy
- **Given** a visitor interacts with the AI property assistant
- **When** the AI service processes a request
- **Then** the total request budget does not exceed 15 seconds, per-provider timeout is 10 seconds max, and a local fallback is returned on timeout — never an unhandled exception. User messages, phone numbers, chat history, and API keys are not written to application logs.
- **And** an automated cleanup command (`php artisan leads:cleanup`) deletes assistant lead data (phone, chat_history, context) older than 90 days.

### 2.16 Deployment Safety
- **Given** the application is deployed
- **When** the web server handles requests
- **Then** `.env`, `.git`, `storage`, `vendor`, `app`, `bootstrap`, `config`, and `database` directories are not accessible via HTTP; HTML/Inertia responses do not use immutable cache headers; static assets (JS/CSS/images/fonts) use long-lived caching.

### 2.17 Repository Hygiene
- **Given** a developer inspects the repository
- **When** they review the working tree
- **Then** `.scratch/`, `*.bak`, debug screenshots, temporary HTML/output files, and generated audit artifacts are removed from version control and listed in `.gitignore`.

### 2.18 HossamChat Widget Maintainability
- **Given** a developer needs to modify the chat widget
- **When** they open the chat module
- **Then** the code is organized into clear sub-modules: `HossamChatWidget.jsx`, `ChatHeader.jsx`, `MessageList.jsx`, `MessageBubble.jsx`, `QuickReplies.jsx`, `ChatComposer.jsx`, and a `hooks/` directory — without any change to API behavior, AI logic, or response format.

---

## 3. Functional Requirements

### 3.1 Phase 1 — Security Hardening

1. **Default Credential Removal**: Remove all hard-coded users, password hashes, and default email/password pairs from `database/database.sql`, `database/seeders/`, and `database/factories/`. Seeders needed for testing must generate passwords at runtime or source them from environment variables.

2. **Secure Admin Creation Command**: Implement `php artisan app:create-admin` that prompts for email (validated), hidden password input (strength-verified), creates the user, and prevents duplicate admin creation by email.

3. **Prerender Path Traversal Protection**: Harden `DetectBot.php` and `PrerenderService.php` so that any file path derived from request data is resolved via `realpath()` and confirmed to reside within `storage/app/prerendered`. Reject with HTTP 403 all traversal attempts including `../`, `..\`, URL-encoded, double-encoded, and absolute path variants.

4. **Security Headers Middleware Enhancement**: Add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` headers. Extend CSP with `object-src 'none'; base-uri 'self'`. Preserve compatibility with Google Analytics, YouTube, Google Maps, WhatsApp, Inertia, and Vite.

5. **CORS Restriction**: Remove `Access-Control-Allow-Origin: *` from `.htaccess` and `public/.htaccess` for HTML, CSS, JS, images, and JSON. Scope any remaining CORS-enabled endpoints to specific required origins. Never use wildcard CORS with authentication or cookies.

6. **File Upload Hardening**: For all upload endpoints (MediaController, StoreUploadedImagesAction, Unit/Project/Editor uploads), enforce MIME type validation (not just extension), image validity checks, size limits, randomized filenames, and rejection of executable extensions (`.php`, `.php3`, `.php4`, `.php5`, `.phtml`, `.phar`, `.cgi`, `.pl`, `.sh`, `.exe`).

### 3.2 Phase 2 — HTML Entity Double Encoding

7. **Source Fix**: Identify and fix the encoding pipeline — in seeders, importers, services, DTOs, SEO services, React components, or Blade templates — where `htmlspecialchars()`, `htmlentities()`, `e()`, or manual escaping is applied before storage, causing multi-level encoding. Ensure all textual data stored in the database is plain UTF-8.

8. **Data Cleanup Migration**: Create a safe migration or Artisan command that iteratively decodes multi-level encoded entities in confirmed affected text fields until normalization, without corrupting intentional HTML or safe content.

### 3.3 Phase 3 — Duplicate Content & Property Page Consolidation

9. **Eliminate DOM Duplication**: Restructure `resources/js/Pages/Public/Units/Show.jsx` and its sub-components so that each information section appears once in the DOM, using CSS responsive utilities instead of separate desktop/mobile component trees containing the same SEO-visible text.

10. **Property Page Section Order**: Enforce the canonical section order: Breadcrumb → Gallery → Price + Primary CTA → Key Specifications → Description → Payment Information → Features → Project Information → Location → Contact/Agent → Similar Units.

### 3.4 Phase 4 — SEO Cleanup

11. **Canonical Tags**: Each public page must have exactly one canonical `<link>` tag with an absolute HTTPS URL, no unnecessary query parameters, and correct path for the current page.

12. **Hreflang Implementation**: Every Arabic page includes `hreflang` tags for `ar`, `en`, and `x-default`, pointing to the actual counterpart page URL (e.g., `/ar/units/example` ↔ `/en/units/example`). Likewise for English pages.

13. **Filter Page SEO**: Pages with filter query parameters use `noindex, follow` robots directives; canonical and pagination tags do not conflict with each other.

14. **Dynamic GEO Metadata**: Replace static "القاهرة الجديدة" GEO metadata with location data derived from the actual property/project area. Omit GEO metadata if no specific location is available.

15. **Context-Appropriate OG Images**: Homepage uses `/images/og-familyhome.png`; project pages use the project image; unit pages use the primary unit image; article pages use the article image.

16. **Clean Meta Descriptions**: Ensure `description`, `title`, `og:description`, and `twitter:description` contain plain text free of HTML entity encoding artifacts.

### 3.5 Phase 5 — Performance

17. **CSS Optimization**: Remove unused, duplicate, and obsolete CSS rules from `resources/css/app.css` and related files. Verify no removed class is referenced in `.jsx`, `.js`, or `.blade.php` files before deletion. No visual changes permitted.

18. **Animation Reduction**: Reduce card hover effects to `hover:-translate-y-1` / `hover:shadow-lg`. Reduce header blur to `backdrop-blur-md`. Add `@media (prefers-reduced-motion: reduce)` global rule to effectively disable animations.

19. **Image Loading Optimization**: Apply `fetchpriority="high"` and `decoding="async"` to hero/above-fold images. Apply `loading="lazy"` and `decoding="async"` to all below-fold images. Ensure responsive `srcSet`/`sizes` attributes prevent oversized image downloads.

20. **Favicon/Logo Sizing**: If `icon.webp`/`icon.png` are oversized for their usage context, generate appropriately sized variants (32×32, 64×64, 180×180, 512×512) and reference the correct size in each usage context.

### 3.6 Phase 6 — JavaScript Bundle Optimization

21. **Code Splitting**: Ensure admin dependencies (TipTap, Recharts, admin components) are not included in the public-facing JavaScript bundle. Apply lazy loading to heavy pages. Do not apply lazy loading to small components unnecessarily.

22. **HossamChat Widget Decomposition**: Split `HossamChatWidget.jsx` into modular sub-components (`ChatHeader`, `MessageList`, `MessageBubble`, `QuickReplies`, `ChatComposer`) and a `hooks/` directory. Preserve all API behavior, AI logic, and response format.

### 3.7 Phase 7 — AI Assistant Performance & Privacy

23. **Timeout Reduction**: Reduce the normal request budget to 15 seconds maximum and per-provider timeout to 10 seconds maximum in `AssistantOrchestratorService` / `AiAssistantController`. Return a local fallback response on timeout instead of an exception.

24. **Logging Sanitization**: Remove logging of user messages, phone numbers, chat history, and API keys from AI assistant request/response logs.

25. **Lead Data Retention**: Implement `php artisan leads:cleanup` scheduled command that deletes `AssistantLead` records (phone, chat_history, context) older than 90 days.

### 3.8 Phase 8 — Database Optimization

26. **Query Optimization**: Eliminate N+1 queries by adding appropriate `with()` eager loading. Replace `SELECT *` with explicit `select(...)` where relevant. Use `withCount()` for relationship counts.

27. **Index Verification**: Verify indexes exist on `is_active`, `is_deal`, `is_pinned`, `priority_points`, `user_id`, `project_id`, `area_id`, `unit_type_id`, `created_at` columns. Add missing indexes only; do not duplicate existing ones.

28. **Search Optimization**: Preserve existing FULLTEXT indexes. Replace any `CAST(... AS CHAR) LIKE '%...%'` patterns with FULLTEXT or normalized searchable column queries where feasible. No external search engine introduction.

### 3.9 Phase 9 — Repository Cleanup

29. **Remove Artifacts**: Delete `.scratch/`, `*.bak`, debug screenshots, temporary HTML/output files, and generated audit artifacts from version control.

30. **Update .gitignore**: Add `.scratch/`, `*.bak`, `*.tmp`, `*.log`, `test-results/`, `playwright-report/` to `.gitignore`.

### 3.10 Phase 10 — Deployment Safety

31. **HTTP Access Prevention**: Ensure `.htaccess` rules block HTTP access to `.env`, `.git`, `storage`, `vendor`, `app`, `bootstrap`, `config`, and `database` directories.

### 3.11 Phase 11 — .htaccess Hardening

32. **Cache Policy Correction**: Preserve HTTPS redirect, Authorization header passthrough, X-XSRF token handling, and front controller rewrite. Fix CORS wildcard. Apply long cache headers to JS/CSS/images/fonts only; do not use `immutable` on dynamic HTML/Inertia responses.

### 3.12 Phase 12 — Accessibility

33. **Lightbox Accessibility**: Add `role="dialog"`, `aria-modal="true"`, keyboard support (Escape, ArrowLeft, ArrowRight), and focus management (trap focus, restore on close).

34. **Mobile Menu Accessibility**: Implement Escape-to-close, focus trapping, `aria-expanded`, `aria-controls`, and focus restoration on close.

35. **Reduced Motion Support**: Add global `@media (prefers-reduced-motion: reduce)` rule to disable animations and transitions for users who prefer it.

### 3.13 Phase 13 — Search UX Reorganization

36. **Desktop Search Layout**: Reorder to: Sale/Rent toggle → Area → Property Type → Budget → Search button. Hide advanced filters behind an expandable panel.

37. **Mobile Search Layout**: Reorder to: Search prompt → Area → Property Type → Budget → Search → Advanced Filters expandable.

### 3.14 Phase 14 — Property Detail UX

38. **Mobile Bottom Action Bar**: Implement a fixed bottom bar with Call and WhatsApp buttons on mobile that does not obscure content, other buttons, cookie banners, or chat widgets, and respects `env(safe-area-inset-bottom)`.

### 3.15 Phase 15 — UI Visual Refinement

39. **Visual Consistency**: Reduce excessive shadows, border-radius, and hover movement. Enforce consistent spacing, card heights, and button styles. Preserve brand colors, logo, fonts, and general visual identity. Target a premium real estate aesthetic.

### 3.16 Phases 16–21 — Verification & Testing

40. **Backend Tests**: Run `php artisan test` and ensure no regression from pre-change baseline.
41. **Build Verification**: Run `npm run build` successfully with zero errors.
42. **Laravel Cache**: Run `php artisan optimize:clear`, `config:cache`, `route:cache`, `view:cache` successfully.
43. **Security Tests**: Verify authentication, authorization (Admin/Manager/Agent), file upload rejection of dangerous files, CSRF protection, XSS prevention, path traversal blocking, prerender hardening, AI endpoint safety, and rate limiting.
44. **SEO Tests**: Verify all public pages (`/ar`, `/en`, `/ar/projects`, `/en/projects`, `/ar/units`, `/en/units`, `/ar/units/{slug}`, `/en/units/{slug}`, project pages) contain exactly one `title`, `description`, `canonical`, `hreflang ar`, `hreflang en`, `x-default`, `og:title`, `og:description`, `og:image`, `og:url`, and `JSON-LD`.
45. **HTML Validation**: Confirm no double-encoded entities, no duplicate `<title>`, `<meta>`, `<canonical>`, `<h1>`, no broken links, no empty `href`, and no missing `alt` attributes in final rendered output.
46. **Performance Targets**: Aim for LCP < 2.5s, CLS < 0.1, INP < 200ms on representative pages across desktop, mobile, slow 4G, and CPU throttling conditions.

---

## 4. Success Criteria

1. **Zero Default Credentials in Repository**: No hard-coded admin emails, passwords, or password hashes exist in any version-controlled file. The `app:create-admin` command is the sole path to initial admin creation.

2. **Path Traversal Blocked**: All traversal payloads (`../`, `..\`, URL-encoded, double-encoded, absolute path) return HTTP 403 or are safely discarded by the prerender service.

3. **File Uploads Reject Executables**: Upload of any file with a dangerous extension or mismatched MIME is rejected across every upload endpoint.

4. **Security Headers Complete**: All specified security headers are present on every response, and CORS wildcard is removed from all non-essential resources.

5. **Zero Double-Encoded Entities**: No user-visible text on any public page displays encoding artifacts like `&amp;amp;`. Database text fields contain clean UTF-8.

6. **SEO Metadata Correct**: Every public page has exactly one canonical, correct hreflang, appropriate OG image, dynamic GEO metadata (or none), and clean plain-text descriptions. Filter pages are `noindex, follow`.

7. **No Duplicate DOM Content**: Every information section on every public page appears exactly once in the DOM, regardless of viewport.

8. **Public Bundle Excludes Admin Code**: Admin-only dependencies (TipTap, Recharts, admin components) are not loaded on public pages.

9. **AI Requests Complete Within 15 Seconds**: No AI assistant request exceeds 15 seconds total; fallback responses are returned instead of exceptions.

10. **Lead Data Automatically Pruned**: Records older than 90 days are automatically cleaned by the scheduled `leads:cleanup` command.

11. **All Tests Pass**: `php artisan test` and `npm run build` succeed with no regressions. Laravel cache commands complete without errors.

12. **Keyboard & Accessibility Compliant**: Lightbox, mobile menu, and dialogs support keyboard navigation, focus management, and ARIA attributes. Reduced-motion media query is active.

13. **Mobile CTA Accessible**: Fixed bottom bar with Call/WhatsApp on mobile does not overlap content or other interactive elements.

14. **Performance Targets Met**: CSS and JS bundle sizes are measurably reduced. LCP < 2.5s, CLS < 0.1, INP < 200ms are achieved under typical conditions.

15. **Repository Clean**: No `.scratch/`, `*.bak`, debug artifacts, dead code, unused imports, `console.log`, `dd()`, `dump()`, `var_dump()`, or debug screenshots remain in the codebase.

---

## 5. Assumptions

- The application is deployed on shared hosting (Hostinger) where the document root can be configured to point to `public/`.
- The existing tech stack (Laravel + Inertia.js + React + Vite + MySQL + Tailwind CSS) is immutable for this scope.
- No external search engines (Meilisearch, Typesense, Elasticsearch) will be introduced.
- No new frontend frameworks (Next.js, Vue, Livewire) or admin panels (Filament) will be added.
- All existing features (AI assistant, WhatsApp integration, Compare, SEO, prerender) must remain fully functional.
- Password hashes for test seeding will be generated at runtime or sourced from environment variables, never committed to version control.
- The `prefers-reduced-motion` media query applies universally to all animations and transitions across the application.
- Database GEO metadata relies on existing area/location data already associated with properties and projects.
- The 90-day lead data retention period applies to `phone`, `chat_history`, and `context` fields; business-critical lead records are preserved.

---

## 6. Dependencies

- Existing `resources/css/app.css` must be audited against all `.jsx`, `.js`, and `.blade.php` files before any CSS deletion.
- Image size variants for favicon/logo depend on the original high-resolution source image being available in the repository.
- `hreflang` implementation requires that Arabic and English page counterparts exist for each route.
- The AI assistant timeout changes depend on `AssistantOrchestratorService`, `AiAssistantController`, and `RestrictedAssistantCatalogService` being the correct service boundaries.

---

## 7. Out of Scope

- Migration to a different framework, CMS, or admin panel.
- Introduction of external search engines.
- Redesign of brand identity (colors, logo, fonts).
- Addition of new features not described in this specification.
- Refactoring beyond the specific fixes and optimizations listed here.
- Performance optimization through feature removal.

# Implementation Plan: Family Home Production Hardening

## Goal Description

Comprehensive surgical remediation of the Family Home real-estate platform across security, SEO, performance, accessibility, UX, database optimization, AI assistant reliability, and code hygiene — preserving all existing features and the current stack (Laravel + Inertia.js + React + Vite + MySQL + Tailwind CSS).

## User Review Required

> [!IMPORTANT]
> - **Default credentials in `database.sql`**: The 3 hardcoded user INSERT statements (admin/manager/agent with identical bcrypt hashes) will be removed entirely. The `DatabaseSeeder` already uses env-sourced passwords with random fallback — it is the correct path for seeding.
> - **`FreshDummySeeder` plaintext password**: The `Hash::make('12345678')` will be replaced with env-sourced or runtime-generated password.
> - **AI timeout reduction**: Defaults change from 40s→15s total budget and 30s→10s per-request. This may cause more frequent fallback responses on slow LLM providers. The existing multi-tier fallback cascade (Gemini → OpenRouter → local rule-based) ensures graceful degradation.
> - **CSS changes**: ~155 lines of HossamChat-specific CSS will remain in `app.css` but be consolidated. Font-face declarations will be simplified. No visual changes.
> - **Property detail page restructure**: Desktop/mobile duplicate content sections will be unified into single responsive components. The section order will be enforced as specified.

> [!WARNING]
> - **CORS removal from HTML/JSON**: If any third-party integration relies on cross-origin fetching of HTML or JSON files from this domain, it will break. The change scopes CORS to fonts, images, CSS, and JS only.
> - **`decoding="sync"` → `decoding="async"` on hero images**: Currently used on Units/Show, Projects/Show, and Home heroes. The spec requires `async`, which may introduce a brief flash before hero paint on slow connections.

## Proposed Changes

---
### Phase 1: Security Hardening (6 tasks)

#### [MODIFY] [database.sql](file:///d:/New-family/database/database.sql)
- Remove lines 594-601: The 3 `INSERT INTO users` statements with hardcoded bcrypt hashes for `admin@admin.com`, `manager@manager.com`, `agent@agent.com`.
- Remove lines 603-606: The `INSERT INTO model_has_roles` for these users.
- Keep the `INSERT INTO roles` statement (roles are structural, not credentials).

#### [MODIFY] [FreshDummySeeder.php](file:///d:/New-family/database/seeders/FreshDummySeeder.php)
- Replace `Hash::make('12345678')` with `Hash::make(env('ADMIN_SEED_PASSWORD', Str::random(16)))`.
- Replace the `$this->command->info(...)` line to warn about the generated password like `DatabaseSeeder` does.

#### [NEW] [CreateAdminCommand.php](file:///d:/New-family/app/Console/Commands/CreateAdminCommand.php)
- Command signature: `app:create-admin`.
- Prompts for email (validated as valid email format).
- Prompts for password (hidden input via `$this->secret()`).
- Validates password strength (min 8 chars, mix of letters/numbers).
- Creates user with `role = 'admin'`, assigns admin Spatie role.
- Prevents duplicate email (`User::where('email', $email)->exists()`).

#### [MODIFY] [DetectBot.php](file:///d:/New-family/app/Http/Middleware/DetectBot.php)
- In `resolvePrerenderPath()`, after computing `$target`:
  1. Resolve the final file path candidate (`.html` or `/index.html`).
  2. Apply `realpath()` on the resolved path.
  3. Verify the result starts with `realpath($baseDir)`.
  4. Return `null` (safe rejection) if containment check fails.
- Add URL-decode loop protection: `rawurldecode()` the path, then re-check for `..` sequences.
- Log traversal attempts as `Log::warning('Prerender path traversal blocked', [...])`.

#### [MODIFY] [SecurityHeadersMiddleware.php](file:///d:/New-family/app/Http/Middleware/SecurityHeadersMiddleware.php)
- Add `object-src 'none'` and `base-uri 'self'` to the production CSP string.
- Headers `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` already present — no changes needed.

#### [MODIFY] [.htaccess](file:///d:/New-family/.htaccess) (root)
- Change the `FilesMatch` for CORS from:
  `"\.(js|css|xml|gz|html|woff2?|ttf|eot|svg|webp|png|jpg|jpeg|json)$"`
  to: `"\.(js|css|woff2?|ttf|eot|svg|webp|png|jpg|jpeg)$"`
  (Remove `html`, `json`, `xml`, `gz` from wildcard CORS).
- Add `RewriteRule ^(\.env|\.git|\.agents|storage|vendor|app|bootstrap|config|database) - [F,L,NC]` to block HTTP access to sensitive directories.

#### [MODIFY] [public/.htaccess](file:///d:/New-family/public/.htaccess)
- Same CORS FilesMatch fix: remove `html`, `json`, `xml`, `gz`, `mjs` from wildcard CORS.
- Remove `immutable` from the Cache-Control `FilesMatch` for `.html` and `.json`:
  Keep `immutable` only for: `"\.(ico|jpe?g|png|gif|webp|swf|woff2?|ttf|eot|svg|js|mjs|css)$"`.
  Add separate rule for JSON without immutable: `"\.(json)$"` → `max-age=3600, public`.
- Remove `.html` from Cache-Control `FilesMatch` entirely (dynamic Inertia HTML should not be cached immutably).

#### [MODIFY] [StoreUploadedImagesAction.php](file:///d:/New-family/app/Domain/Listings/Actions/StoreUploadedImagesAction.php)
- Add explicit executable extension rejection before `$image->store()`:
  ```
  $dangerousExtensions = ['php','php3','php4','php5','phtml','phar','cgi','pl','sh','exe'];
  $ext = strtolower($image->getClientOriginalExtension());
  if (in_array($ext, $dangerousExtensions)) { continue; }
  ```
- Add MIME type validation: `$image->getMimeType()` must start with `image/`.
- Note: `MediaController`, upload requests, and other endpoints already validate `mimes:jpg,jpeg,png,webp` and use random filenames. This is defense-in-depth.

---
### Phase 2: HTML Entity Double Encoding (2 tasks)

#### [NEW] [FixDoubleEncodingCommand.php](file:///d:/New-family/app/Console/Commands/FixDoubleEncodingCommand.php)
- Command signature: `app:fix-double-encoding {--dry-run}`.
- Targets tables/columns: `units(name_ar, name_en, description_ar, description_en, meta_description)`, `projects(name, name_ar, name_en, description, description_ar, description_en)`, `articles(title, title_ar, title_en, content_ar, content_en, meta_description)`, `areas(name_ar, name_en, description_ar, description_en)`.
- For each field: iteratively apply `html_entity_decode($value, ENT_QUOTES, 'UTF-8')` until the output equals the input (stable normalization).
- Safety: Skip if value contains `<script`, `<iframe`, or other suspicious HTML. Only decode `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#039;` patterns.
- Dry-run mode shows what would change without writing.
- Transaction-wrapped per table.

#### Research: Trace encoding source
- Grep for `htmlspecialchars()`, `htmlentities()`, `e()` calls on data **before** database storage (in actions, DTOs, importers).
- Fix identified sources to store plain UTF-8 text. React auto-escapes on render; Laravel Blade `{{ }}` auto-escapes on render. No manual pre-encoding is needed.

---
### Phase 3: Duplicate Content & Property Detail (2 tasks)

#### [MODIFY] [Units/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Units/Show.jsx)
- Audit all child components for duplicate desktop/mobile content sections.
- Unify into single responsive components using Tailwind's `hidden md:block` / `md:hidden` for layout differences, not content duplication.
- Enforce section order: Breadcrumb → Gallery → Price + Primary CTA → Key Specs → Description → Payment Info → Features → Project Info → Location → Contact/Agent → Similar Units.
- Add mobile fixed bottom action bar with Call + WhatsApp buttons:
  - `fixed bottom-0 left-0 right-0` with `pb-[env(safe-area-inset-bottom)]`.
  - Must not overlap: content, other buttons, cookie banners, chat widget FAB.
  - Use `z-40` (below header z-50, below chat FAB).

#### [MODIFY] [Projects/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Projects/Show.jsx)
- Same deduplication audit and responsive unification as Units/Show.
- Fixed mobile bottom bar already exists — verify it respects `safe-area-inset-bottom` and doesn't overlap chat.

---
### Phase 4: SEO Cleanup (3 tasks)

#### [MODIFY] [SeoService.php](file:///d:/New-family/app/Services/SeoService.php)
- In `forPage()`: Remove hardcoded `'geo_placename' => 'القاهرة الجديدة، مصر'` default from `buildMeta()`.
- Instead: Only set GEO metadata when `$customMeta` provides it. For generic landing pages (home, about, contact), omit GEO metadata unless the page has a specific location.
- In `buildMeta()`: Change default `geo_region` and `geo_placename` to `null` instead of hardcoded Cairo values.

#### [MODIFY] [SeoMetaService.php](file:///d:/New-family/app/Domain/Common/Services/SeoMetaService.php)
- In `resolveGeo()` for Articles: Return all nulls instead of hardcoded Cairo defaults. Articles don't have locations.
- Verify unit/project GEO resolution is already dynamic (it is — uses `$model->area`, `$model->latitude`, `$model->longitude`).
- In `description()`: Ensure no double-encoding by checking output doesn't contain `&amp;amp`.

#### [MODIFY] [SeoHead.jsx](file:///d:/New-family/resources/js/Components/UI/SeoHead.jsx)
- Verify `cleanMetaDescription()` handles entity-decoded text correctly.
- Ensure `finalOgImage` resolution: homepage → `/images/og-familyhome.png`, unit → primary image, project → project image, article → article image. Current logic already handles this — verify edge cases.
- GEO metadata: Only render `geo.region`, `geo.placename`, `geo.position`, `ICBM` meta tags when values are non-null (already conditional — verify).

---
### Phase 5: Performance (4 tasks)

#### [MODIFY] [app.css](file:///d:/New-family/resources/css/app.css)
- **Font-face consolidation**: Replace 12 separate Cairo `@font-face` blocks (lines 6-125) with a single variable-weight declaration: `font-weight: 400 700`.
- **Remove duplicate reduced-motion**: Delete lines 583-593 (concierge-specific reduced motion) — the universal rule at lines 684-694 already covers all elements.
- **Remove duplicate animation utility**: Remove `@utility animate-in` (line 679) — it duplicates `@utility animate-fade-in` (line 619) with negligible difference.
- **Consolidate `@layer utilities`**: Merge 8 scattered `@layer utilities` blocks into fewer groupings.
- Verify no removed class is used in `.jsx`, `.js`, or `.blade.php` before deletion.

#### [MODIFY] [Header.jsx](file:///d:/New-family/resources/js/Components/Layout/Header.jsx)
- Change `md:backdrop-blur-xl` to `md:backdrop-blur-md` (line 69). Keep `backdrop-blur-md` on mobile as-is.

#### [MODIFY] Hero image components across pages
- **[Home.jsx](file:///d:/New-family/resources/js/Pages/Public/Home.jsx)**: Change `decoding="sync"` to `decoding="async"` on hero slide images.
- **[Units/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Units/Show.jsx)**: Change `decoding="sync"` to `decoding="async"` on main gallery hero.
- **[Projects/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Projects/Show.jsx)**: Change `decoding="sync"` to `decoding="async"` on project hero.

#### [MODIFY] Favicon/logo references
- **[Header.jsx](file:///d:/New-family/resources/js/Components/Layout/Header.jsx)**: Change fallback `fallbackSrc="/icon.webp"` to `fallbackSrc="/icon-64.webp"` (1KB vs 92KB for 32px display).
- **[app.blade.php](file:///d:/New-family/resources/views/app.blade.php)**: Change `asset('icon.png')` favicon fallback to `asset('favicon.ico')` for the generic icon link. Keep apple-touch-icon pointing to larger image.
- **Error pages** (`404.blade.php`, `419.blade.php`, `500.blade.php`): Change `/icon.webp` to `/icon-64.webp`.

---
### Phase 6: Animation & UX Polish (3 tasks)

#### [MODIFY] Card components (UnitCard, ProjectCard, ArticleCard)
- Grep for `hover:scale-[1.02]`, `hover:-translate-y-1.5`, `hover:shadow-2xl` across all card components.
- Replace with: `hover:-translate-y-1`, `hover:shadow-lg`.
- Remove excessive `hover:scale-*` transforms from cards.

#### [MODIFY] [app.css](file:///d:/New-family/resources/css/app.css) — Reduced Motion
- Verify the global `@media (prefers-reduced-motion: reduce)` rule at lines 684-694 exists and is comprehensive.
- It already covers `*, ::before, ::after` with `animation-duration: 0.01ms`, `transition-duration: 0.01ms`, `scroll-behavior: auto`. This is correct.

#### [MODIFY] [SearchBar.jsx](file:///d:/New-family/resources/js/Components/UI/SearchBar.jsx)
- **Desktop**: Reorder the primary fields to: Sale/Rent toggle → Area → Property Type → Budget → Search. Currently shows: Keyword → Transaction → Area → Type → Search. Move keyword search into advanced filters.
- **Mobile**: Reorder to: Area → Property Type → Budget → Search → Advanced Filters expandable.
- Hide advanced filters (finishing type, features, size range, payment method) behind expandable panel (already has `showAdvanced` state toggle).

---
### Phase 7: JavaScript Bundle & Chat Widget (2 tasks)

#### Verify admin/public bundle separation
- Confirm that `import.meta.glob('./Pages/**/*.jsx', { lazy: true })` ensures admin pages (and their TipTap/Recharts imports) are tree-shaken from public page chunks.
- Verify via `npm run build` output that `vendor-recharts` and `vendor-tiptap` chunks are only loaded by admin page chunks.

#### [NEW] [HossamChat/](file:///d:/New-family/resources/js/Components/HossamChat/) directory
Split `HossamChatWidget.jsx` (1159 lines, 63KB) into:
- `HossamChat/HossamChatWidget.jsx` — Main orchestrator, state management, API calls.
- `HossamChat/ChatHeader.jsx` — Letterhead header, pin reference, close button.
- `HossamChat/MessageList.jsx` — Message scroll area, auto-scroll logic.
- `HossamChat/MessageBubble.jsx` — Individual message rendering, markdown parser, feedback buttons.
- `HossamChat/QuickReplies.jsx` — Quick reply pill buttons.
- `HossamChat/ChatComposer.jsx` — Multi-line textarea, send button, auto-resize.
- `HossamChat/hooks/useChatSession.js` — Session persistence, localStorage management.
- `HossamChat/hooks/useChatApi.js` — API call logic, abort controller, streaming simulation.

Preserve all API behavior, AI logic, response format. Update import in `Footer.jsx`.

---
### Phase 8: AI Assistant Performance & Privacy (3 tasks)

#### [MODIFY] [config/assistant.php](file:///d:/New-family/config/assistant.php)
- Change `'total_budget_seconds' => env('ASSISTANT_TOTAL_BUDGET_SECONDS', 40.0)` to default `15.0`.
- Change `'per_request_timeout_seconds' => env('ASSISTANT_PER_REQUEST_TIMEOUT_SECONDS', 30.0)` to default `10.0`.

#### [MODIFY] [AssistantOrchestratorService.php](file:///d:/New-family/app/Domain/Assistant/Services/AssistantOrchestratorService.php)
- Audit all `Log::warning()` and `Log::info()` calls to ensure no user message content, phone numbers, or API keys are logged.
- Current logging appears clean (logs error messages, status codes, elapsed time — not user content). Verify and add sanitization guard if any edge case found.

#### [NEW] [CleanupAssistantLeadsCommand.php](file:///d:/New-family/app/Console/Commands/CleanupAssistantLeadsCommand.php)
- Command signature: `leads:cleanup {--days=90}`.
- Deletes `AssistantLead` records where `created_at < now() - $days`.
- Outputs count of deleted records.
- Schedule in `routes/console.php`: daily at 04:00 (Africa/Cairo).

#### [NEW] Migration: add indexes to assistant_leads
- Add index on `(phone)` for upsert lookups.
- Add index on `(created_at)` for retention cleanup queries.

---
### Phase 9: Database Optimization (2 tasks)

#### [MODIFY] [ArticleController.php](file:///d:/New-family/app/Http/Controllers/Public/ArticleController.php)
- Replace `inRandomOrder()` with a deterministic approach: cache 20 random unit IDs for 1 hour, then `whereIn('id', $cachedIds)->limit(3)`.

#### [MODIFY] [AgentController.php](file:///d:/New-family/app/Http/Controllers/Public/AgentController.php)
- Add `'user'` to the `with()` eager loading array on the units query (line 30).

---
### Phase 10: Repository Cleanup (2 tasks)

#### [DELETE] [.scratch/](file:///d:/New-family/.scratch/)
- Remove entire `.scratch/` directory from version control.

#### [MODIFY] [.gitignore](file:///d:/New-family/.gitignore)
- Add entries: `.scratch/`, `*.bak`, `*.tmp`, `*.log`, `test-results/`, `playwright-report/`.

---
### Phase 11: .htaccess & Deployment (covered in Phase 1)
- Root `.htaccess`: Already adding sensitive directory blocking in Phase 1.
- `public/.htaccess`: Already fixing cache policy and CORS in Phase 1.

---
### Phase 12: Accessibility (3 tasks)

#### [MODIFY] Lightbox in [Units/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Units/Show.jsx) and [Projects/Show.jsx](file:///d:/New-family/resources/js/Pages/Public/Projects/Show.jsx)
- Add `role="dialog"`, `aria-modal="true"`, `aria-label` to lightbox container.
- Add keyboard handlers: `Escape` → close, `ArrowLeft` → prev, `ArrowRight` → next.
- Add focus trap: On open, move focus to close button. On close, restore focus to the thumbnail that triggered it.
- Lock body scroll when open (`document.body.style.overflow = 'hidden'`).

#### [MODIFY] [Header.jsx](file:///d:/New-family/resources/js/Components/Layout/Header.jsx)
- Mobile menu already has `aria-expanded`, `aria-controls`, and Escape-to-close.
- Add focus trap inside mobile nav overlay when open.
- On close: restore focus to the hamburger button.

#### [MODIFY] [HossamChatWidget.jsx](file:///d:/New-family/resources/js/Components/UI/HossamChatWidget.jsx) (or new `HossamChat/HossamChatWidget.jsx`)
- Add `Escape` key handler to minimize/close chat window.
- Add `aria-expanded` and `aria-controls` to the FAB button.
- On close: restore focus to FAB.

---
### Phase 13-15: Search UX, Property Detail UX, UI Visual Polish
- Covered within Phase 3 (property detail), Phase 6 (search, animations, visual polish).

---
### Phase 16-21: Verification & Testing

#### Backend Tests
```bash
php artisan test
```

#### Frontend Build
```bash
npm run build
```

#### Laravel Cache
```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Security Tests (manual verification)
- Path traversal: `curl -A "Googlebot" "https://domain/../../etc/passwd"`
- Upload: Attempt to upload `shell.php`, `image.php.jpg`, `image.phtml`
- CORS: Verify `Access-Control-Allow-Origin: *` is absent from HTML responses
- Directory access: Verify `/.env`, `/.git`, `/storage`, `/vendor` return 403

#### SEO Tests (manual verification)
- Check `/ar`, `/en`, `/ar/units/{slug}`, `/en/units/{slug}`, `/ar/projects/{slug}`, `/en/projects/{slug}` for:
  - Exactly 1 `<title>`, 1 `<meta name="description">`, 1 `<link rel="canonical">`
  - Correct `hreflang` (ar, en, x-default)
  - No `&amp;amp` in any meta content
  - Appropriate `og:image` per page type

## Verification Plan

### Automated Tests
- `php artisan test` — must pass with no regression
- `npm run build` — must complete with zero errors
- `php artisan optimize:clear && php artisan config:cache && php artisan route:cache && php artisan view:cache` — must succeed

### Manual Verification
- Run `php artisan app:create-admin` and verify interactive admin creation flow
- Run `php artisan app:fix-double-encoding --dry-run` and verify affected records
- Run `php artisan leads:cleanup --days=0` (with test data) and verify cleanup
- Deploy to staging and verify:
  - No `&amp;amp` visible on any public page
  - No duplicate content sections in property detail DOM
  - Mobile bottom action bar visible and non-overlapping
  - Lightbox keyboard navigation (Escape, arrows) functional
  - Mobile menu focus trap functional
  - Security headers present (check via browser DevTools → Network → Response Headers)
  - CORS wildcard absent from HTML responses

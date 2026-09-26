# Research Findings: Production Hardening

## Decision Log

### Security

| Topic | Decision | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| Default credentials in `database.sql` | Remove all INSERT statements for users with hardcoded hashes | Hardcoded bcrypt hashes for `admin@admin.com`, `manager@manager.com`, `agent@agent.com` are identical — password is easily crackable | Keep but use env-sourced passwords (rejected: SQL dumps can't reference env vars) |
| `FreshDummySeeder` plaintext password | Convert to env-sourced or random password | Contains `Hash::make('12345678')` — trivially guessable | Remove seeder entirely (rejected: needed for dev testing) |
| `DatabaseSeeder` already uses env fallback | Keep as-is with minor hardening | Already sources `ADMIN_SEED_PASSWORD` from env with random fallback | N/A — good pattern already |
| Path traversal in `DetectBot.php` | Add `realpath()` containment check | `$request->getPathInfo()` flows directly to `storage_path()` concatenation with no traversal filtering | `str_replace('../', '')` (rejected: bypassable with encoding) |
| Security headers | Add `object-src 'none'; base-uri 'self'` to CSP | Already has good headers — only CSP gaps for object/base | Nonce-based CSP (rejected: incompatible with Inertia/Vite inline scripts) |
| CORS wildcard | Remove `*` from `.html` and `.json` in FilesMatch | Fonts/images may legitimately need CORS; HTML/JSON do not | Remove CORS entirely (rejected: fonts need it for cross-origin loading) |
| File uploads | Already well-hardened | MIME validation, extension whitelist, random filenames, size limits all present | Add explicit executable extension blocklist as defense-in-depth |
| `CreateAdmin` command | Create new `app:create-admin` | No CLI admin creation path exists | Web-based setup wizard (rejected: spec requires CLI) |

### SEO

| Topic | Decision | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| GEO metadata | `SeoMetaService::resolveGeo()` already dynamic for units/projects | Resolves from area/coordinates. Only `SeoService::forPage()` has static fallback for landing pages | Remove GEO from landing pages entirely (acceptable alternative) |
| OG images | `SeoHead.jsx` already handles homepage→banner, unit→primary image | Logic already falls back to `/images/og-familyhome.png` for homepage. Unit/project/article images resolved by `SeoMetaService` | N/A — mostly correct already |
| Hreflang | Already implemented in both Blade and React | `SeoHead.jsx` and `meta.blade.php` both render ar/en/x-default | N/A — working correctly |
| Filter page robots | Already handled in `SeoHead.jsx` | `hasFilterQuery` detection sets `noindex, follow` | N/A — working correctly |
| Double encoding source | Need to trace through importers/seeders/services | Not yet identified where encoding happens before DB storage | Run codebase grep for `htmlspecialchars`, `htmlentities`, `e()` calls on data before storage |

### Performance

| Topic | Decision | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| Pages already lazy-loaded | No change needed for page-level splitting | `import.meta.glob('./Pages/**/*.jsx', { lazy: true })` already in place | N/A |
| Admin/public bundle split | Vite `manualChunks` already separates recharts/tiptap into named chunks | These only load when admin pages import them. Since pages are lazy, admin deps won't load on public pages | Route-based entry points (rejected: Inertia uses single entry) |
| CSS font-face duplication | Consolidate Cairo to single variable-weight declaration | 12 `@font-face` blocks for 3 font files across 4 weights is redundant for a variable font | N/A |
| HossamChat CSS in global | Move to component-level or lazy-loaded CSS module | 155 lines of chat-specific CSS blocks critical path for all visitors | CSS-in-JS (rejected: project uses Tailwind) |
| Icon.png/webp oversized | Use `icon-64.webp` (1KB) for Header logo; generate proper favicon sizes | 92KB WebP / 81KB PNG loaded for 32px display | N/A — icon-64.webp already exists |
| `decoding="sync"` on heroes | Change to `decoding="async"` | Spec requires async; sync provides negligible benefit with `fetchpriority="high"` | Keep sync (rejected: spec explicit) |

### AI Assistant

| Topic | Decision | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| Timeout 40s → 15s total | Reduce `ASSISTANT_TOTAL_BUDGET_SECONDS` default to 15 | Current 40s is excessive for user-facing chat | 20s (rejected: spec says 15) |
| Per-request 30s → 10s | Reduce `ASSISTANT_PER_REQUEST_TIMEOUT_SECONDS` default to 10 | Current 30s blocks the HTTP request too long | 15s (rejected: spec says 10) |
| Logging sanitization | Already partially done | Controller doesn't log user messages. Orchestrator logs error messages only (not content). Need to verify no PII leaks in warning logs | N/A |
| Leads cleanup | Create `leads:cleanup` command | No retention mechanism exists for `assistant_leads` | Soft-delete (rejected: spec says delete after 90 days) |

### Database

| Topic | Decision | Rationale | Alternatives Considered |
|-------|----------|-----------|------------------------|
| Missing indexes | Add index on `assistant_leads(phone, created_at)` | Full table scan on every chat lead upsert | Composite index (phone, status, created_at) |
| All spec-required indexes | Already exist | `is_active`, `is_deal`, `is_pinned`, `priority_points`, `user_id`, `project_id`, `area_id`, `type_id`, `created_at` all indexed | N/A |
| `CAST(keywords AS CHAR) LIKE` | Keep for now, add searchable column later | FULLTEXT exists on name/description. Keywords are JSON — CAST is the pragmatic MySQL approach without schema change | Add `keywords_text` denormalized column (deferred: scope concern) |
| `ORDER BY RAND()` in ArticleController | Replace with cached random selection | Full table scan on every article page | Deterministic hash-based selection |

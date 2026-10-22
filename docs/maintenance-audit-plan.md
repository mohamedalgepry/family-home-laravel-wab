# Family Home — Audit and Maintenance Plan

> Status: initial static repository review. No runtime build or tests have been executed by this review. Do not interpret existing README badges/counts as freshly verified results.

## Repository snapshot

- Repository: `mohamedalgepry/family-home-laravel-wab`
- Baseline branch: `main`
- Audit branch: `maintenance/initial-audit-and-quality-gates`
- Stack declared in manifests: Laravel 13 / PHP ^8.3, React 19, Inertia.js v3, Vite 8, Tailwind CSS v4, MySQL, Pest 4, Playwright.
- Existing quality tools: ESLint; Pest unit/feature tests; Playwright E2E suite; client and SSR builds; prerender scripts.
- Existing reference docs: `README.md`, `DESIGN.md`, `DEPLOYMENT.md`, `PERFORMANCE_GUIDE.md`, `docs/technical-review-ar.md`, `docs/guides/*`.

## Working agreement for future changes

1. Never commit direct changes to `main`. Create a descriptive topic branch from the latest `main` for each logical fix.
2. Before editing, read the affected implementation, related tests, routes/policies/middleware where applicable, and relevant design/operational documentation.
3. Add or update regression tests with bug fixes. Prefer focused tests first, then the relevant full test suite.
4. Run applicable PHP tests, frontend lint, client build, SSR build, prerender validation, and Playwright tests. Record exact commands and outcomes; never report a check as passing unless it actually ran and passed.
5. Document each change in this file and in any relevant subsystem guide. Keep this log chronological and include changed files, behavior/risk, commands, test outcomes, and unresolved follow-up.
6. Do not add dependencies unless the existing stack cannot reasonably provide the needed capability. Explain the rationale and update lockfiles.
7. Do not merge a PR or deploy to production without explicit instruction.
8. Avoid destructive migrations, public-data changes, or production operations during a code fix unless specifically required and reviewed.

## Static review findings (to verify with execution)

### CI / supply-chain / isolation

- `.github/workflows/playwright.yml` requests repository `contents: write` and includes a workflow step that commits generated `public/build` assets directly to `main`. This increases CI write authority and permits automation to mutate the protected baseline. Prefer least privilege (`contents: read`) and build artifacts uploaded as artifacts; keep generated assets tracked only if a deliberate deployment policy requires it.
- The same workflow's Playwright step explicitly sets `E2E_BASE_URL=https://familyhome-co.com`, so pull-request browser tests exercise production rather than the code from the pull request. Such tests are not isolated regression verification and may be nondeterministic. Introduce an isolated application/test target before calling E2E tests a PR acceptance gate.
- `npm ci --force` bypasses some dependency resolution protections. Review the reason and remove `--force` only after confirming the lockfile installs cleanly.
- Current workflow calls `npm run build`, which performs client build, SSR build, hash fix and prerender. Prerender is database-dependent and should use deterministic test configuration/seed data.

### Existing application review items

The existing static report `docs/technical-review-ar.md` flags issues that should be independently reproduced before changing code:
- Possible duplicate SEO/head metadata from Blade and Inertia head sources; canonical URL generation; alternate-language slugs.
- Static and dynamic sitemap source overlap and possible hardcoded hostname.
- Accessibility gaps in custom Select, toast announcements, image lightbox focus/keyboard behavior, and inquiry form labels.
- Unit inquiry route/model binding and multilingual slug handling.
- Empty catch blocks, synchronous work in request paths, image sizing/optimization, and privacy treatment of IP/user-agent data.

These are leads, not verified runtime defects. Prioritize based on reproduction, impact and regression tests.

### Security headers

`app/Http/Middleware/SecurityHeadersMiddleware.php` defines a CSP, HSTS and other response headers. Review exact syntax, route coverage, production proxy/TLS behavior, and real browser violations before making changes. Third-party analytics, maps and video integrations mean policy tightening must be validated rather than guessed.

## Proposed repair workflow

1. **Baseline health**: inspect current branch/CI runs and lockfiles; reproduce current lint, PHP tests, client build, SSR build and E2E behavior.
2. **Security and permissions**: audit authentication/authorization, policies and IDOR, file uploads and storage, request validation, CSP/reporting endpoint, dependency advisories and public debug/error behavior. Add regression tests per finding.
3. **UI and accessibility**: use `DESIGN.md` as the visual source of truth; validate RTL/LTR, mobile/tablet/desktop, keyboard behavior, semantic HTML and color contrast.
4. **Bug fixes**: isolate each defect in a small PR with focused reproduction and regression coverage.
5. **Acceptance**: check formatting/lint, PHP test suites, database migrations in a clean test DB, client and SSR build, prerender integrity and Playwright against an isolated target; document any blocked or skipped checks.
6. **Review**: inspect diff for scope creep, secrets, generated artifacts, accessibility and security regressions; open PR targeting `main` only after checks are green.

## Test inventory and commands

- PHP regression/full suite: `php artisan test`
- Frontend static lint: `npm run lint`
- Client build: `npm run build:client`
- SSR build: `npm run build:ssr`
- Full asset + SSR + prerender pipeline: `npm run build` (requires configured Laravel environment and usable database/data)
- Browser E2E: `npx playwright test` (currently defaults to production URL; do not use as isolated PR verification until configured for a dedicated target)
- Dependency inventory/advisories: `composer audit`, `npm audit` (interpret results against lockfiles, runtime reachability and advisory details)

## Change log

### 2026-10-22 — Initial audit baseline
- Created branch `maintenance/initial-audit-and-quality-gates` from `main`.
- Added this audit/workflow plan.
- Read manifests, Vite and Playwright configurations, CI workflows, design documentation, operations documentation, existing technical review, an existing smoke suite, Pest setup, and security header middleware.
- Checks run: static file review only.
- Checks not run: PHP tests, npm install, lint, client build, SSR build, prerender, browser E2E, dynamic security scan. This connector review does not provide a project runtime to execute those commands.
- Open items: independently reproduce the technical report's findings; decide whether tracked build output is an intentional deployment requirement; move PR E2E tests away from production; document the exact skill/toolchain choices per future task.

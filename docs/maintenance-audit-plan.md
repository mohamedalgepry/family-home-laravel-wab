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
3. For website/application code changes, validate the **whole repository**, not just the modified file: run the complete PHP test suite, frontend lint, client + SSR builds, prerender integrity, and browser E2E against an isolated preview/staging instance built from the proposed branch. Run any focused regression/security tests as well.
4. All build/test commands must run against the **feature branch containing the proposed changes**. Do not use `main` as the test workspace and do not modify `main` to make tests pass. Testing the unchanged baseline alone does not validate the proposed fix.
5. A change may skip application tests only when it is demonstrably documentation-only or otherwise cannot affect executable behavior. Record why checks were skipped. If any uncertainty remains, run the relevant checks.
6. Before merge, inspect the complete diff, review the implementation and test coverage, confirm all required checks passed, and verify the site behavior on the isolated preview. Record exact commands and truthful outcomes; never claim a check passed unless it actually ran and passed. Any failure or blocked test must be fixed or explicitly resolved before merge.
7. Only after validation and review pass, merge the feature branch into `main` through the pull request. Do not force-push, delete, or replace `main` with a branch reset. The ordinary merge should make the accepted branch changes part of `main` while preserving history.
8. Do not deploy to production without explicit instruction. Do not add dependencies unless the existing stack cannot reasonably provide the needed capability; explain the rationale and update lockfiles.
9. Avoid destructive migrations, public-data changes, or production operations during a code fix unless specifically required and reviewed.

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

1. **Baseline health**: inspect current branch/CI runs and lockfiles. Baseline results are for comparison only.
2. **Create a fix branch** from the latest `main`; never develop directly on `main`.
3. **Security and permissions**: audit authentication/authorization, policies and IDOR, file uploads and storage, request validation, CSP/reporting endpoint, dependency advisories and public debug/error behavior. Add regression tests per finding.
4. **UI and accessibility**: use `DESIGN.md` as the visual source of truth; validate RTL/LTR, mobile/tablet/desktop, keyboard behavior, semantic HTML and color contrast.
5. **Whole-repository acceptance on the fix branch**: run the full PHP suite, lint, clean-database migration checks where safe, client build, SSR build, full prerender/integrity checks, security checks, and Playwright against an isolated deployment of that branch. The precise check set depends on the change, but website code changes must not be validated only by tests for the edited file.
6. **Review**: inspect the full diff for scope creep, secrets, generated artifacts, accessibility and security regressions. Record all results. Resolve failures and rerun affected/full checks.
7. **Merge**: merge the validated branch through the PR into `main` only after required checks and review pass. Keep `main` unchanged until then; do not replace it with force pushes or history resets.

## Test inventory and commands

- PHP regression/full suite: `php artisan test`
- Frontend static lint: `npm run lint`
- Client build: `npm run build:client`
- SSR build: `npm run build:ssr`
- Full asset + SSR + prerender pipeline: `npm run build` (requires configured Laravel environment and usable database/data)
- Browser E2E: `npx playwright test` (currently defaults to production URL; do not use this as PR acceptance until configured for a dedicated preview/staging target built from the fix branch)
- Dependency inventory/advisories: `composer audit`, `npm audit` (interpret results against lockfiles, runtime reachability and advisory details)

## Change log

### 2026-10-22 — Initial audit baseline
- Created branch `maintenance/initial-audit-and-quality-gates` from `main`.
- Added this audit/workflow plan.
- Read manifests, Vite and Playwright configurations, CI workflows, design documentation, operations documentation, existing technical review, an existing smoke suite, Pest setup, and security header middleware.
- Checks run: static file review only.
- Checks not run: PHP tests, npm install, lint, client build, SSR build, prerender, browser E2E, dynamic security scan. This connector review does not provide a project runtime to execute those commands.
- Open items: independently reproduce the technical report's findings; decide whether tracked build output is an intentional deployment requirement; move PR E2E tests away from production; document the exact skill/toolchain choices per future task.


### 2026-10-22 — Clarified test and merge gate
- Whole-repository build and test checks run on the branch containing the proposed fix, not on `main`; this ensures the exact candidate is validated without putting unverified code on the primary branch.
- Website/application code changes require the whole relevant suite and isolated-browser validation before merge. A demonstrably docs-only change may skip app tests with the reason recorded.
- Merge into `main` only after checks and review pass; use a normal PR merge and preserve Git history rather than force-replacing `main`.

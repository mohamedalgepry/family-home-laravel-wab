# Codebase Analysis & Evidence-Based Findings

## 1. Google Maps Processing & SSRF Vulnerability
**Location:** `app/Http/Requests/Traits/ExtractsCoordinatesFromUrl.php`
**Findings:**
- The `resolveShortUrl` method executes `curl_exec` on arbitrary user-provided URLs.
- `CURLOPT_FOLLOWLOCATION` is `true`.
- `CURLOPT_SSL_VERIFYPEER` is `false`.
- **Conflict:** There is zero validation of the target host, domain, or IP space. This presents a critical Server-Side Request Forgery (SSRF) vulnerability. An attacker can supply `http://169.254.169.254/latest/meta-data/` or `http://127.0.0.1:8000` and the server will fetch it.
- **Dependency:** Must build a strict URL validator that rejects non-Google domains and private IP spaces *before* fixing coordinate extraction.

## 2. SitemapService Injection Crash
**Location:** `app/Domain/Listings/Services/ProjectService.php`, `UnitService.php`, `CategoryService.php`, `ArticleService.php`
**Findings:**
- In `ProjectService`, line 105 calls `$this->sitemapService->regenerate()`.
- However, the constructor for `ProjectService` only injects `CreateProjectAction`, `UpdateProjectAction`, `DeleteProjectAction`, and `ListingImageService`.
- **Conflict:** Triggering project deletion (which calls this line) will crash with an `Undefined property` exception.
- **Dependency:** Inject `SitemapService` into these services, or better yet, move sitemap generation to asynchronous events/observers to prevent blocking HTTP requests and tight coupling.

## 3. Public Agent Data Exposure
**Location:** `app/Http/Resources/Public/AgentPublicResource.php`
**Findings:**
- `AgentPublicResource::toArray()` explicitly exposes the `role` field.
- **Conflict:** The prompt mandates avoiding exposing internal authorization data. The `role` string could leak internal privilege structures to public users.
- **Dependency:** Remove `role` from `AgentPublicResource`, ensuring the frontend UI (e.g. `AgentCard`) does not crash if it expects it.

## 4. English Translation Parity (i18n)
**Location:** `resources/js/Pages/*`
**Findings:**
- Preliminary analysis indicates static strings are sometimes mixed. A comprehensive audit matrix must be generated during planning.
- **Conflict:** Hardcoded Arabic in JS/Blade templates breaks the English localized view.
- **Dependency:** Extract all strings to `lang/en.json` and `lang/ar.json`, and wrap them in `__()` or `t()` functions.

## 5. Security Headers (CSP) & Upload Security
**Findings:**
- Need to configure `config/secure-headers.php` or middleware to restrict `script-src` and `frame-src`.
- Need to review `ListingImageService` for MIME validation.

---

**Next Steps (Spec Kit Workflow):**
The specification (`specs/002-prod-remediation/spec.md`) has been generated and validated.
Please proceed with `/speckit-plan` to generate the technical implementation plan, taking these findings into account.

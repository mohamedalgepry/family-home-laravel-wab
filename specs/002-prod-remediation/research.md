# Research & Decisions: Production Remediation

## 1. Google Maps Processing & SSRF
**Unknown/Issue:** `ExtractsCoordinatesFromUrl::resolveShortUrl` executes an unvalidated `curl` request, posing a severe SSRF risk.
**Decision:** We will replace `curl_exec` with Laravel's `Http` client. We will parse the URL, check if the host ends in `.google.com`, `maps.app.goo.gl`, or `goo.gl`. We will disable following redirects natively, manually fetch headers to find the `Location` header, validate the redirect target, and repeat up to 3 times (to prevent infinite loops) to find the final URL. If any URL resolves to a private IP space or non-allowlisted domain, it will abort.
**Rationale:** This strict allowlist-based recursive resolver prevents SSRF to local metadata services or internal networks.

## 2. SitemapService Injection
**Unknown/Issue:** `$this->sitemapService` is used in `ProjectService.php`, `UnitService.php`, `CategoryService.php`, and `ArticleService.php` without being injected in the constructors.
**Decision:** We will update the constructors of all these services to explicitly type-hint and inject `SitemapService $sitemapService`.
**Rationale:** Standard Laravel constructor injection will resolve the `Undefined property` crash.

## 3. Public Agent Data Exposure
**Unknown/Issue:** `role` is exposed in `AgentPublicResource.php`.
**Decision:** We will remove `'role' => $this->role` from `AgentPublicResource::toArray`. We will verify if React components depend on `role` and refactor them to use a generic `'is_admin'` boolean if necessary, otherwise safely drop it.
**Rationale:** Follows the public data minimization requirement from the spec.

## 4. English Translation Parity
**Unknown/Issue:** Missing English localization.
**Decision:** We will extract missing strings from React (`resources/js`) and translate them. We will add the missing keys to `lang/en.json` and ensure `__()` (or `usePage().props.translations`) is consistently used on the frontend.
**Rationale:** Full i18n parity is a core requirement.

## 5. Image Upload Security
**Unknown/Issue:** Need strict validation on uploads.
**Decision:** Ensure all file uploads in controllers use `mimes:jpg,jpeg,png,webp` and `max:5120`. Disable SVG uploads entirely for user-submitted content unless explicitly required and sanitized.
**Rationale:** Prevents XSS via SVG or RCE via disguised PHP scripts.

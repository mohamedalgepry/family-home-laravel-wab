# Implementation Plan: Family Home Production Remediation & Hardening

## Goal Description

Resolve architectural inconsistencies, fix critical SSRF vulnerabilities in Google Maps URL resolution, implement English i18n parity, secure file uploads, and repair N+1/performance issues across the Family Home application.

## User Review Required
> [!IMPORTANT]
> - **Google Maps Redirects**: We are shifting to Laravel's HTTP client for resolving `maps.app.goo.gl`. This will strictly block IP addresses like `127.0.0.1` and metadata domains to prevent SSRF.
> - **Agent Data**: We will remove `role` from the public JSON payload. If the frontend relies on this, it may cause minor breakage that we will need to fix in the React layer.
> - **i18n Translation**: We will generate missing translation keys for the frontend and back them in `lang/en.json`.

## Proposed Changes

---
### Google Maps SSRF & Parsing Fix
Refactoring URL resolution to use the secure HTTP client and fixing coordinate extraction logic.

#### [MODIFY] [ExtractsCoordinatesFromUrl.php](file:///d:/New-family/app/Http/Requests/Traits/ExtractsCoordinatesFromUrl.php)
- Replace `curl_init` with `Http::withOptions(['allow_redirects' => false])`.
- Add strict validation of URL hostnames before resolving (only allow `.google.com` or `goo.gl`).
- Implement loop for following headers securely while checking IP targets to prevent SSRF.

---
### Architectural Dependency Injection
Fix the missing `SitemapService` dependency in various listing services to stop crash on deletion.

#### [MODIFY] [ProjectService.php](file:///d:/New-family/app/Domain/Listings/Services/ProjectService.php)
- Inject `SitemapService $sitemapService` in the constructor.
#### [MODIFY] [UnitService.php](file:///d:/New-family/app/Domain/Listings/Services/UnitService.php)
- Inject `SitemapService $sitemapService` in the constructor.
#### [MODIFY] [CategoryService.php](file:///d:/New-family/app/Domain/Listings/Services/CategoryService.php)
- Inject `SitemapService $sitemapService` in the constructor.
#### [MODIFY] [ArticleService.php](file:///d:/New-family/app/Domain/Listings/Services/ArticleService.php)
- Inject `SitemapService $sitemapService` in the constructor.

---
### Public Agent Data Minimization
Remove internal authorization properties from being serialized.

#### [MODIFY] [AgentPublicResource.php](file:///d:/New-family/app/Http/Resources/Public/AgentPublicResource.php)
- Remove `'role' => $this->role` from the returned array.

---
### Image Upload Hardening
Enforce strict validation for uploads.

#### [MODIFY] [ListingImageService.php](file:///d:/New-family/app/Domain/Listings/Services/ListingImageService.php)
- Add or enforce file validation in the controller layer passing into the image service, rejecting non-standard mimes. (Note: Controller layer `mimes:` rules will be updated depending on which endpoints are used).

---
### i18n & Translation Parity
Provide localized values for all static text.

#### [MODIFY] [en.json](file:///d:/New-family/lang/en.json)
- Add missing translations discovered during audit.
#### [MODIFY] React Components (Various)
- Wrap raw Arabic text with `__()` or the localization equivalent for standard English/Arabic rendering.

---
### CSP Hardening
Update the production Content Security Policy to allowlist Google services used by the application.

#### [MODIFY] [SecurityHeadersMiddleware.php](file:///d:/New-family/app/Http/Middleware/SecurityHeadersMiddleware.php)
- Add `*.google-analytics.com`, `*.googletagmanager.com` to `script-src` and `connect-src`.
- Add `*.googleapis.com`, `maps.googleapis.com`, `maps.gstatic.com` to `script-src`, `img-src`, and `frame-src`.
- Add `fonts.googleapis.com`, `fonts.gstatic.com` to `style-src` and `font-src`.
- Add `www.youtube.com` to `frame-src` if YouTube embeds are used.

---
### Password Reset Email Design
Redesign the password reset notification with a professional, responsive, RTL/LTR-aware HTML email template.

#### [MODIFY] [ResetPasswordNotification.php](file:///d:/New-family/app/Domain/Users/Notifications/ResetPasswordNotification.php)
- Replace hardcoded Arabic strings with localized `__()` calls.
- Switch from `MailMessage` to a custom Blade email template for proper styling.

#### [NEW] reset-password Blade email template
- Create `resources/views/emails/reset-password.blade.php` with Family Home logo, RTL/LTR support, responsive styling, and Gmail/Outlook compatibility.

---
### Sitemap & Robots Cleanup
Remove obsolete empty `sitemap-categories.xml` and validate `robots.txt` generation.

#### [MODIFY] [SitemapService.php](file:///d:/New-family/app/Domain/Listings/Services/SitemapService.php)
- Remove `sitemap-categories.xml` from `writePublicFiles` and `cacheKeys`.

#### [MODIFY] [SitemapBuilder.php](file:///d:/New-family/app/Domain/Listings/Services/SitemapBuilder.php)
- Remove `buildCategories()` method (returns empty string, no content).
- Verify `buildIndex()` does not reference `sitemap-categories.xml`.
- Verify `buildRobots()` output allows public pages and references sitemap correctly.

---
### Cache Invalidation Audit
Ensure listing/SEO caches are invalidated on mutation.

#### [MODIFY] [ProjectService.php](file:///d:/New-family/app/Domain/Listings/Services/ProjectService.php)
- After create/update/delete, call `ListingService` cache version bump and `SitemapService::forgetCache()`.

#### [MODIFY] [UnitService.php](file:///d:/New-family/app/Domain/Listings/Services/UnitService.php)
- Same pattern: cache version bump + sitemap cache invalidation on mutation.

---
### Meta Keywords Removal from Public Output
Remove `<meta name="keywords">` from public HTML output.

#### [MODIFY] [SeoHead.jsx](file:///d:/New-family/resources/js/Components/UI/SeoHead.jsx)
- Ensure no `keywords` meta tag is rendered in the public `<Head>`.
- Remove `keywords` prop acceptance from public Show pages that pass it.

---
### Debug File Cleanup
Remove temporary debug/test scripts from the repository root.

#### [DELETE] Root debug files
- Remove `check_*.php`, `dump.php`, `dump_html.php`, `test_*.php`, `payload_*.json`, `response.json`, `raw_json.txt` from repository root.

---
### N+1 & Performance Fixes
Ensure eager loading is effectively utilized.

#### [MODIFY] [PageController.php](file:///d:/New-family/app/Http/Controllers/Public/PageController.php)
- Apply `with(['area', 'project'])` to all standard listings queries.

## Verification Plan

### Automated Tests
- Run `php artisan test --filter ExtractCoordinatesFromUrlTest`
- Run `php artisan test --filter ProjectServiceTest` (assert no 500 error on delete)

### Manual Verification
- Go to Admin -> Projects, insert `https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA` and verify coordinates resolve to the correct latitude and longitude without SSRF errors.
- Ensure the English version of the site has no Arabic leakage and renders correctly across mobile/desktop viewports.
- Check browser console for CSP violation errors.

# Specification: Family Home Production Remediation & Hardening

## 1. Feature Description
The objective is to perform a complete code-level audit, create a remediation plan, implement the required fixes, and verify everything with automated and browser-level tests across the Family Home Laravel + Inertia.js + React real-estate platform. This involves resolving architectural inconsistencies, addressing Google Maps location parsing, strengthening security (SSRF, CSP, Uploads), optimizing SEO and i18n, and fixing performance/N+1 issues.

## 2. User Scenarios & Testing

### 2.1 Google Maps Location Setup
- **Given** an admin is editing a Project or Unit
- **When** they paste a normal Google Maps location URL or short URL (`maps.app.goo.gl`)
- **Then** the system automatically resolves redirects, extracts exact latitude and longitude, displays them as read-only values, and uses them to render the map on the frontend.
- **And** page-view requests never resolve Google Maps URLs on the fly.

### 2.2 Public UI with English/Arabic
- **Given** a public user visits the site
- **When** they browse Projects, Units, or Articles in English or Arabic
- **Then** the entire UI, including error messages, navigation, pagination, SEO tags, and URLs, must be correctly translated with no language leakage (e.g. Arabic words in English pages). RTL/LTR layouts must behave correctly across device sizes (320px to 1920px).

### 2.3 SSRF and Security Hardening
- **Given** a malicious user tries to exploit Google Maps parsing or image upload
- **When** they provide an internal network IP (127.0.0.1, AWS metadata, etc.) or an executable masked as an image
- **Then** the server blocks the request, prevents SSRF, rejects non-images, and logs the security violation without crashing the application.

## 3. Functional Requirements

### 3.1 Google Maps Location System
1. The admin UI must accept a standard Google Maps URL instead of an Embed URL.
2. The backend must securely parse both long and short (e.g., maps.app.goo.gl) Google Maps URLs via server-side HTTP request resolution, following redirects safely.
3. The resolver must strictly prevent SSRF (reject private IPs, localhost, non-Google domains, etc.).
4. Latitude and longitude must be accurately extracted and stored as the single source of truth in the database.
5. The public frontend must render maps and JSON-LD geo coordinates exclusively using the stored latitude/longitude.

### 3.2 Audit & Architectural Remediation
1. **Agent Data**: Maintain existing Agent data contracts. Do not unnecessarily modify the system. Only sanitize public payloads if internal data (like role) is currently exposed needlessly.
2. **Data Flow & Consistency**: Trace and fix data flow from Database -> Model -> Service -> Controller -> Resource -> Inertia -> React -> DOM to ensure absolute shape matching and prevent undefined/null errors.
3. **Projects/Units Stability**: All public pages must resiliently handle missing optional data without crashing.

### 3.3 Security & Hardening
1. **CSP**: Implement a strict Content Security Policy allowlist that supports all required services (Analytics, Maps, etc.) without disabling CSP.
2. **Uploads**: Strictly validate image MIME types, extensions, size, and sanitize SVG contents to prevent XSS/RCE.
3. **Authentication/Password Reset**: Enhance password reset email design (responsive, RTL/LTR compatible) without altering the existing "email not found" behavioral security to prevent email enumeration.

### 3.4 SEO, Translation & i18n
1. **English Translation Parity**: Achieve 100% parity between Arabic and English UI strings (validation, auth, navigation, errors, empty states, etc.) using Laravel/React localization properly.
2. **SEO Architecture**: Remove duplicate schema tags. Maintain strict canonical URL strategies (accounting for pagination/filters) and accurate hreflang tags for all valid routes.
3. **Sitemap/Robots**: Ensure sitemap index is valid, public, and indexable, and robots.txt prevents unauthorized access without over-blocking.

### 3.5 Performance
1. **N+1 Queries**: Eliminate unnecessary eager/lazy loading or duplicate queries in public listing pages.
2. **Caching**: Ensure reliable invalidation of listing, SEO, and lookup caches upon data mutation.
3. **Assets**: Optimize font preloading and image delivery (srcset, WebP, lazy loading) particularly for hero images.

## 4. Success Criteria

1. **Bug Resolution**: No confirmed P0 bugs remain, and critical runtime errors (undefined properties, null dereferencing) are eliminated.
2. **Google Maps E2E**: The exact URL `https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA` successfully resolves to precise coordinates and stores latitude/longitude correctly without SSRF exposure.
3. **UI/UX Resilience**: The UI remains fully responsive from 320px to 1920px without horizontal overflow, clipped text, or broken layouts.
4. **Translation Consistency**: 100% of public-facing static UI strings are localized correctly in English with no hardcoded Arabic leakage.
5. **SEO/Performance Integrity**: Automated tests verify SEO tags, sitemap validity, zero N+1 queries, and proper cache invalidation.
6. **Codebase Hygiene**: Debug scripts, production dumps, and hardcoded credentials are completely removed from the repository.

## 5. Assumptions

- Existing authentication flow (session-based) and database schema largely remain intact unless security/performance necessitates changes.
- The external Google Maps URL structure and redirect behavior remain consistent with Google's current standards.
- External analytics/scripts mentioned for CSP are correctly provided by the client.

## 6. Required Spec Kit Phase Outputs
1. **Analyze Phase**: Identify conflicts between current architecture and required fixes.
2. **Plan Phase**: Specify architecture, affected files, DB changes, service boundaries, testing, and migration strategy.
3. **Tasks Phase**: Generate dependency-ordered implementation tasks.
4. **Implement/Converge Phase**: Iterate until all acceptance criteria are met, validated via PHP, build, and browser tests.

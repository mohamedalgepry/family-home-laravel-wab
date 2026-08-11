# Quickstart Validation Guide

## Validating Google Maps Extractor
To validate the Google Maps SSRF and coordinate extraction fix:
1. Start the local server if not already running.
2. Ensure you have the `php artisan test` configured.
3. Run the specific unit test for coordinate extraction:
   `php artisan test --filter ExtractCoordinatesFromUrlTest`
4. The test must pass and correctly parse `https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA` to its specific coordinates.

## Validating SitemapService Dependency Injection
1. Run `php artisan test --filter ProjectServiceTest` (or similar tests).
2. Manually trigger a Project or Unit deletion. The application should successfully delete the entity without a 500 error.

## Validating Translation Parity
1. Build frontend assets: `npm run build`
2. Navigate to a public page in English (`/en/projects`).
3. Verify that the UI layout is LTR, and there are no Arabic fallback strings in pagination, filters, or error messages.

## Validating CSP and Headers
1. Open the browser DevTools (Network / Console).
2. Load any public page.
3. Verify that no critical scripts (Google Analytics, Maps, Inertia) are blocked by the Content-Security-Policy.

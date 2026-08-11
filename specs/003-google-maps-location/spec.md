# Google Maps Location URL — Complete Processing & Coordinate Extraction

**Feature Directory**: `specs/003-google-maps-location`
**Status**: Ready for Planning
**Created**: 2026-08-11

---

## Overview

Family Home is a Laravel + Inertia.js + React real-estate platform (Arabic/English). Currently, Admins are asked to enter Google Maps embed URLs or iframe HTML into forms for Projects, Units, and Areas. This is confusing, error-prone, and produces broken maps when admins paste regular Google Maps links instead.

The goal is to completely replace this workflow so that:

- Admins paste any **normal Google Maps location link** (including short links like `maps.app.goo.gl/...`).
- The system automatically resolves, parses, and extracts the latitude and longitude at save time.
- The extracted coordinates are stored and used everywhere (map display, JSON-LD, SEO).
- No HTTP calls to Google happen on public page views — only at create/update time.

---

## Actors

| Actor | Description |
|-------|-------------|
| Admin | Super admin managing all listings |
| Manager | Manager who can create/edit projects and units |
| Agent | Sales agent who can create/edit units |
| Visitor | Public user viewing property pages (no map interaction) |

---

## User Scenarios & Testing

### Scenario 1 — Admin enters a standard Google Maps URL for a Project

**Given** an Admin is creating or editing a Project
**When** they paste `https://www.google.com/maps/place/...` into the "Google Maps Location URL" field and save
**Then** the system processes the URL, extracts latitude and longitude, saves them to the database, and the project map displays the correct location

### Scenario 2 — Admin enters a short URL

**Given** an Admin is creating or editing a Unit
**When** they paste `https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA` and save
**Then** the system resolves the redirect chain, identifies the final Google Maps URL, extracts the correct place coordinates, and saves them

### Scenario 3 — Admin enters an invalid URL

**Given** an Admin is saving a Project
**When** they enter a non-Google URL (e.g., `https://example.com`)
**Then** the system rejects the form with a clear error: "Unable to extract location coordinates from this link. Please provide a valid Google Maps location URL."

### Scenario 4 — Coordinates resolve to 0,0

**Given** an Admin enters a URL that resolves to coordinates (0.0, 0.0)
**Then** the system rejects it as invalid and shows an appropriate error

### Scenario 5 — Field left blank

**Given** an Admin saves a Project/Unit without entering a Maps URL
**Then** the location fields are saved as null, no map is shown on the public page, and no error is shown

### Scenario 6 — Public visitor views a Project with valid coordinates

**Given** a Project has valid latitude/longitude stored
**When** a visitor views the project page
**Then** the map displays the correct location and an "Open in Google Maps" link is available; no HTTP request to Google occurs server-side during page load

### Scenario 7 — Public visitor views a Project without coordinates

**Given** a Project has no latitude/longitude
**When** a visitor views the project page
**Then** no map section is rendered; no broken iframe appears

### Scenario 8 — Area with existing latitude/longitude

**Given** an Area already has latitude/longitude columns in the database
**When** the Area show page is viewed
**Then** the map uses those stored coordinates; same URL-processing system is used if admin enters a Maps URL for the area

---

## Functional Requirements

### FR-1: URL Input Field

**FR-1.1** — The map input field in Project Create/Edit and Unit Create/Edit forms must be labeled "Google Maps Location URL" (EN) / "رابط Google Maps" (AR).

**FR-1.2** — The field description must read: "Paste a normal Google Maps location link. The system will automatically extract the latitude and longitude."

**FR-1.3** — The field must accept any of the following URL formats without Admin having to reformat:
- `https://www.google.com/maps/place/...`
- `https://www.google.com/maps/search/?api=1&query=LAT,LNG`
- `https://www.google.com/maps?q=LAT,LNG`
- `https://maps.google.com/...`
- `https://maps.app.goo.gl/...` (short URL)
- `https://goo.gl/maps/...` (legacy short URL)

**FR-1.4** — The field must NOT require iframe HTML, embed code, or `maps/embed?...` URLs.

**FR-1.5** — After a successful save, the edit form must display extracted Latitude and Longitude values in read-only fields so the Admin can confirm the correct location was detected.

### FR-2: URL Processing Pipeline

**FR-2.1** — URL processing must occur only on create or update operations, never on page views.

**FR-2.2** — The processing pipeline must execute in this order:
1. Validate the URL is a valid HTTPS URL pointing to an allowed Google Maps domain.
2. If the URL is a short URL (e.g., `maps.app.goo.gl`, `goo.gl/maps`), resolve all redirects until a final Google Maps URL is reached.
3. Parse the final URL and extract place coordinates.
4. Validate the extracted coordinates.
5. Save to database.

**FR-2.3** — Short URL resolution must follow at most 5 redirects.

**FR-2.4** — Every URL in the redirect chain must resolve to an allowed Google Maps domain.

**FR-2.5** — Connection timeout: 5 seconds. Total timeout: 10 seconds when resolving short URLs.

### FR-3: Coordinate Extraction

**FR-3.1** — The parser must support the following coordinate patterns (in priority order):
1. `!3d{lat}!4d{lng}` — exact place pin (highest priority)
2. `q={lat},{lng}` or `query={lat},{lng}` — search query coordinates
3. `center={lat},{lng}` — map center
4. `@{lat},{lng}` — viewport center
5. `!2d{lng}!3d{lat}` — embed pb parameter format

**FR-3.2** — When a URL contains both a place pin (`!3d!4d`) and a viewport center (`@lat,lng`), the place pin coordinates must be preferred.

**FR-3.3** — If no recognizable coordinate pattern exists in the final URL, the submission must be rejected with a clear validation error.

**FR-3.4** — The system must not save coordinates (0.0, 0.0).

### FR-4: Coordinate Validation

**FR-4.1** — Latitude must satisfy: `-90 <= latitude <= 90`.

**FR-4.2** — Longitude must satisfy: `-180 <= longitude <= 180`.

**FR-4.3** — Both latitude and longitude must be non-null, finite numeric values.

**FR-4.4** — Coordinates (0.0, 0.0) must be rejected (null island).

**FR-4.5** — Extracted coordinates must be stored with at least 7 decimal places of precision.

### FR-5: Security — SSRF Protection

**FR-5.1** — Every URL (initial and each redirect) must be validated against an allowlist of Google Maps domains before any HTTP request:
- `google.com` and all `*.google.com` subdomains
- `goo.gl` and `*.goo.gl`
- `g.page` and `*.g.page`

**FR-5.2** — DNS resolution must be performed for every host before connecting. If any resolved IP falls within a private, reserved, or loopback range, the request must be rejected.

**FR-5.3** — The following addresses/ranges must always be blocked:
- Loopback: `127.0.0.0/8`, `::1`
- Private: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
- Link-local / metadata: `169.254.0.0/16`
- Null: `0.0.0.0`

**FR-5.4** — Only HTTPS protocol is permitted. HTTP, file://, ftp:// must be rejected.

**FR-5.5** — Response body size for redirect resolution is capped at 1 MB.

**FR-5.6** — The URL resolution component must be an isolated, dedicated service — not a generic HTTP proxy.

### FR-6: Admin UI — Read-Only Coordinate Display

**FR-6.1** — After saving with a valid Maps URL, the edit form must display extracted latitude and longitude in read-only fields.

**FR-6.2** — The read-only coordinate fields must not be directly editable via the Maps URL workflow.

**FR-6.3** — If the Maps URL field is cleared, latitude and longitude must also be cleared on save.

### FR-7: Database

**FR-7.1** — `latitude` and `longitude` are the authoritative location fields for Projects, Units, and Areas.

**FR-7.2** — The `map_embed_url` column on Projects and Units is preserved for backward compatibility; it is not the source of truth for new records.

**FR-7.3** — The original Google Maps URL provided by the Admin must be stored for audit purposes (in `map_embed_url` for Projects/Units, `map_url` for Areas).

**FR-7.4** — Existing records with valid coordinates must not be modified.

**FR-7.5** — A migration strategy must exist for records with `map_embed_url` but no coordinates.

### FR-8: Public Map Display

**FR-8.1** — Project Show and Unit Show pages must render the map using stored `latitude`/`longitude`.

**FR-8.2** — The embedded map must be generated from coordinates — no stored embed URL is required.

**FR-8.3** — An "Open in Google Maps" link must be displayed pointing to `https://www.google.com/maps/search/?api=1&query={lat},{lng}`.

**FR-8.4** — When no coordinates are stored, the map section must be hidden — no broken iframe.

**FR-8.5** — Area Show pages must follow the same map rendering logic.

**FR-8.6** — No server-side HTTP request to Google may occur during a public page view.

### FR-9: JSON-LD Structured Data

**FR-9.1** — When a Project or Unit has valid coordinates, JSON-LD must include:
```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "29.9611066",
  "longitude": "30.9295985"
}
```

**FR-9.2** — The `geo` block must be omitted when no valid coordinates are stored.

**FR-9.3** — Coordinates (0.0, 0.0) must never appear in JSON-LD output.

### FR-10: Cache Invalidation

**FR-10.1** — Saving a new Maps URL or changing coordinates must invalidate any cached version of the affected Project, Unit, or Area page.

**FR-10.2** — SEO and sitemap caches must be invalidated when location data changes.

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | URL resolution must complete within 10 seconds |
| Performance | Public page map display requires zero network calls to Google |
| Security | Every redirect hop validated for domain allowlist and public IP |
| Security | Maps resolver is isolated — no generic HTTP proxy |
| Reliability | If short URL resolution fails, form returns clear error; no partial save |
| Compatibility | Existing records with coordinates are untouched |
| Maintainability | Coordinate extraction lives in a dedicated, testable service class |

---

## Data Model

### Projects (no new columns needed)

| Column | Purpose |
|--------|---------|
| `latitude` | Place latitude — source of truth |
| `longitude` | Place longitude — source of truth |
| `map_embed_url` | Stores original Maps URL for audit; legacy embed URLs preserved |

### Units (no new columns needed)

| Column | Purpose |
|--------|---------|
| `latitude` | Place latitude — source of truth |
| `longitude` | Place longitude — source of truth |
| `map_embed_url` | Stores original Maps URL for audit; legacy embed URLs preserved |

### Areas (no new columns needed)

| Column | Purpose |
|--------|---------|
| `latitude` | Place latitude — source of truth |
| `longitude` | Place longitude — source of truth |
| `map_url` | Stores original Maps URL for audit |

---

## Success Criteria

| # | Criterion | How Verified |
|---|-----------|-------------|
| SC-1 | Short URL `maps.app.goo.gl/wKkt1cHgW5VZBjTKA` resolves to correct coordinates | Real network test during development |
| SC-2 | All 5 URL patterns extract correct lat/lng | Automated unit tests |
| SC-3 | Invalid/non-Google URLs produce validation error, no partial save | Automated feature tests |
| SC-4 | Zero outbound Google calls during public page views | Server log inspection |
| SC-5 | Requests to localhost, 127.0.0.1, private IPs are blocked | Automated security tests |
| SC-6 | Project and Unit show pages render maps at correct locations | Browser verification |
| SC-7 | JSON-LD contains real coordinates or no geo block | Automated tests + browser source inspection |
| SC-8 | Existing records with coordinates unchanged after deployment | Database diff check |
| SC-9 | All 23 automated test cases pass | `php artisan test` |
| SC-10 | Build completes without errors | `npm run build` |
| SC-11 | Admin never needs embed code — field label and description are unambiguous | Manual UX review |

---

## Test Cases (23 total)

### Valid URL patterns
1. Standard place URL: `https://www.google.com/maps/place/...` with `!3d!4d`
2. Standard place URL with `@lat,lng` only
3. Search query: `?q=30.0123,31.0456`
4. Search query: `?query=30.0123,31.0456`
5. Center parameter: `?center=30.0123,31.0456`
6. Viewport: `@30.0123,31.0456`
7. Embed pb format: `!2d31.0456!3d30.0123`

### Short URLs
8. `maps.app.goo.gl/wKkt1cHgW5VZBjTKA` — resolves and extracts coordinates
9. `goo.gl/maps/...` — resolves and extracts coordinates

### Invalid inputs
10. Empty string — no error (field is optional)
11. Non-Google URL (`https://example.com`) — validation error
12. Malformed URL (`not-a-url`) — validation error
13. Latitude > 90 extracted — validation error
14. Latitude < -90 extracted — validation error
15. Longitude > 180 extracted — validation error
16. Longitude < -180 extracted — validation error
17. Coordinates 0,0 — validation error (null island)

### Security (SSRF)
18. URL with host `localhost` — blocked
19. URL with host `127.0.0.1` — blocked
20. URL with host in `10.0.0.0/8` — blocked after DNS check
21. URL with host `169.254.169.254` (cloud metadata) — blocked
22. Redirect chain leading to non-Google domain — blocked at redirect hop
23. HTTP (non-HTTPS) URL — blocked

---

## Assumptions

- `latitude` and `longitude` columns already exist on all three tables.
- The existing `ExtractsCoordinatesFromUrl` trait is refactored (not replaced from scratch) into a proper service class.
- The existing SSRF protection approach (allowlist + DNS check) is correct and is carried forward.
- No Google Maps API key is available; coordinate extraction is URL-parsing only.
- The `maps.app.goo.gl/wKkt1cHgW5VZBjTKA` link must be tested with a real outbound network call during development verification.
- Areas do not currently have an admin map URL input field; one will be added.

---

## Out of Scope

- Geocoding by address text
- Google Maps JavaScript API / interactive map on frontend
- Batch re-processing of all existing records (existing artisan command handles this)

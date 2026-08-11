# Data Model Updates: Production Remediation

## 1. Project & Unit Models
**Entities:** `Project`, `Unit`
**Fields:**
- `latitude` (decimal, 10,8)
- `longitude` (decimal, 10,8)
- `map_embed_url` (string, legacy/optional)

**Validation Rules:**
- `latitude` and `longitude` must be verified and accurate.
- Both models should expose these coordinates directly or via an accessor for the frontend.
- When saving coordinates from `ExtractsCoordinatesFromUrl`, these exact fields are updated.

## 2. Agent Public Model
**Entity:** `Agent` (Public Payload)
**Fields Removed:**
- `role`
**Reason:** Security and Public Data Minimization.

## 3. SEO & Structured Data
**Entity:** `SeoMeta` (JSON-LD outputs)
- Only emit `GeoCoordinates` if `latitude` and `longitude` are present. Do not emit fake/default `(0,0)` coordinates.

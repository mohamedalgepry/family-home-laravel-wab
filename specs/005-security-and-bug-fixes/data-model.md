# Data Model: Security Hardening & Confirmed Bug Fixes

## 1. Entities & Schema Changes

### 1.1 `points_transactions`
No schema changes required. We will actively insert records of type `monthly_reset` into this table during the execution of the `points:monthly-reset` scheduled command to maintain ledger integrity.

- `type`: 'monthly_reset'
- `amount`: Integer (Difference between initial balance and previous balance)
- `balance_after`: Integer (The `initial_monthly_balance` configured in settings)
- `manager_id`: The ID of the manager whose points are reset.

### 1.2 `units` / `projects`
No schema changes required. We are altering the application layer's interaction with the schema:
- **Removed from `$fillable`**: `user_id`, `is_active`, `is_pinned`, `is_deal`, `priority_points`
- **Impact**: These fields can no longer be mass-assigned via `Unit::create($array)` or `$unit->update($array)`. They must be explicitly set or modified via targeted action classes (e.g., `ToggleActiveAction`).

## 2. Validation & Application Rules

### 2.1 Google Maps URL Rules (`map_embed_url`)
- Stricter validation applied at both the HTTP layer (`HasMapEmbedRule`) and Action layer (`CreateUnitAction`, `UpdateUnitAction`).
- Allowed Hostnames: `google.com`, `maps.google.com`, `google.com.sa`, `maps.google.com.sa` (enforced via `Sanitizer::isValidMapEmbed()`).

### 2.2 Content Security Policy (CSP)
- `report-uri` and `report-to` directives added to the `SecurityHeadersMiddleware`.
- `unsafe-inline` is retained to ensure Inertia/Vite compatibility.

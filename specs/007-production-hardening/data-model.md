# Data Model Changes: Production Hardening

## Entities Affected

### 1. AssistantLead (Retention Policy)

**Table**: `assistant_leads`

**Current Fields**: `id`, `name`, `phone`, `context`, `status`, `chat_history`, `lead_score`, `lead_status`, `created_at`, `updated_at`

**Changes**:
- Add database index on `(phone, created_at)` for efficient upsert lookups and retention cleanup queries.
- Add database index on `(created_at)` for retention cleanup ordering.

**Retention Rule**: Records where `created_at < now() - 90 days` will have `phone`, `chat_history`, and `context` fields nullified or the entire record deleted by the `leads:cleanup` scheduled command.

---

### 2. Units (Double-Encoding Cleanup)

**Table**: `units`

**Affected Fields**: `name_ar`, `name_en`, `description_ar`, `description_en`, `meta_description`

**Change**: Artisan command to iteratively decode multi-level HTML entities (`&amp;amp;amp;` → `&`) on confirmed affected text fields until stable.

---

### 3. Projects (Double-Encoding Cleanup)

**Table**: `projects`

**Affected Fields**: `name`, `name_ar`, `name_en`, `description`, `description_ar`, `description_en`, `meta_description`

**Change**: Same double-encoding cleanup as Units.

---

### 4. Articles (Double-Encoding Cleanup)

**Table**: `articles`

**Affected Fields**: `title`, `title_ar`, `title_en`, `content`, `content_ar`, `content_en`, `meta_description`

**Change**: Same double-encoding cleanup as Units.

---

### 5. Areas (Double-Encoding Cleanup)

**Table**: `areas`

**Affected Fields**: `name_ar`, `name_en`, `description_ar`, `description_en`

**Change**: Same double-encoding cleanup as Units.

---

## New Database Migrations

| Migration | Purpose |
|-----------|---------|
| `add_indexes_to_assistant_leads_table` | Add indexes on `phone` and `created_at` for lead lookup and retention cleanup |

## No Schema Changes

The following tables require **no structural changes** — only data cleanup or query optimization:
- `users` (credential removal is in SQL dump/seeders, not schema)
- `units`, `projects`, `articles`, `areas` (data cleanup only, no column changes)
- All index-required columns already have appropriate indexes per migration audit

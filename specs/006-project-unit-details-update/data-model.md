# Frontend Data Model & UI State

Since this is a frontend-only update, the data model documents the React Props structure provided by Inertia, which **must remain unchanged**.

## Inertia Props (Read-Only) — Project Details Page

### `project` (ProjectPublicResource)
| Field | Type | Rendered? | Fix Needed |
|-------|------|-----------|------------|
| `id` | int | ✅ Schema | — |
| `name` / `name_ar` / `name_en` | string | ✅ Title, breadcrumbs | — |
| `slug` / `slug_ar` / `slug_en` | string | ✅ URLs | — |
| `description` / `description_ar` / `description_en` | string | ✅ Overview | — |
| `alt_text` | string | ✅ Gallery images | — |
| `video_url` | string | ✅ YouTube embed | — |
| `video_path` | string | ❌ Not rendered | Add HTML5 video support |
| `payment_method` | string | ⚠️ Desktop only | Add to mobile |
| `down_payment` | numeric | ⚠️ Desktop only | Add to mobile |
| `installment_years` | int | ⚠️ Desktop only | Add to mobile |
| `delivery_date` | string | ❌ Hardcoded "2026" | Bind to actual field |
| `latitude` / `longitude` | float | ⚠️ Fallback to Cairo | Hide when missing |
| `location_address` | string | ✅ Subtitle | — |
| `map_embed_url` | string | ❌ Not used | Consider using |
| `meta_description` | string | ✅ SEO | — |
| `area` | relation | ⚠️ Missing on mobile info | Add to mobile |
| `features[]` | relation | ❌ Fake fallback + no icons | Fix: hide when empty, use icons |
| `finishingType` | relation | ⚠️ Hardcoded fallback | Bind to actual data |
| `images[]` | relation | ✅ Gallery | — |
| `user` | relation | ✅ Agent card | — |
| `units` | relation | ✅ Unit cards | — |

### `projectUnits` (UnitPublicResource collection)
- ✅ Correctly displayed in grid with UnitCard components

### `similarProjects` (ProjectPublicResource collection)
- ✅ Correctly displayed with ProjectCard components

### `relatedArticles` (ArticlePublicResource collection)
- ✅ Correctly displayed with ArticleCard components

---

## Inertia Props (Read-Only) — Unit Details Page

### `unit` (UnitPublicResource)
| Field | Type | Rendered? | Fix Needed |
|-------|------|-----------|------------|
| `id` | int | ✅ Schema | — |
| `name` / `name_ar` / `name_en` | string | ✅ Title, breadcrumbs | — |
| `slug` / `slug_ar` / `slug_en` | string | ✅ URLs | — |
| `description` / `description_ar` / `description_en` | string | ✅ Overview | — |
| `price` | numeric | ✅ Summary + mobile bar | — |
| `transaction` | string | ✅ Sale/Rent badge | — |
| `area_sqm` | numeric | ✅ Quick specs | — |
| `rooms` | int | ✅ Quick specs | — |
| `bathrooms` | int | ✅ Quick specs | — |
| `floor` | int | ❌ Only in JSON-LD | Add to quick specs grid |
| `alt_text` | string | ✅ Gallery | — |
| `video_url` | string | ✅ YouTube embed | — |
| `video_path` | string | ❌ Not rendered | Add HTML5 video support |
| `payment_method` | string | ⚠️ Desktop only | Add to mobile |
| `down_payment` | numeric | ⚠️ Desktop only | Add to mobile |
| `installment_years` | int | ⚠️ Desktop only | Add to mobile |
| `is_deal` | bool | ❌ Not rendered | Add deal badge |
| `latitude` / `longitude` | float | ⚠️ Fallback to Cairo | Hide when missing |
| `location_address` | string | ✅ Under title | — |
| `map_embed_url` | string | ❌ Not used | Consider using |
| `meta_description` | string | ✅ SEO | — |
| `type` | relation | ⚠️ Small pill only | Adequate |
| `area` | relation | ⚠️ Missing on mobile fallback | Add area card to mobile |
| `finishingType` | relation | ❌ Not rendered | Add finishing type display |
| `features[]` | relation | ❌ Fake fallback + no icons | Fix: hide when empty, use icons |
| `images[]` | relation | ✅ Gallery | — |
| `project` | relation | ✅ Project card | — |
| `user` | relation | ✅ Agent card | — |

### `similarUnits` (UnitPublicResource collection)
- ✅ Correctly displayed with UnitCard components

### `relatedProjects` (ProjectPublicResource collection)
- ✅ Correctly displayed with ProjectCard components

### `relatedArticles` (ArticlePublicResource collection)
- ✅ Correctly displayed with ArticleCard components

---

## Component UI State (Local — No Changes Needed)
- `lightboxIndex` (number|null): Controls fullscreen image viewer
- `activeImageIndex` (number|null): Tracks selected gallery image
- `sentSuccess` (bool): 7-second contact form success banner
- `processing` (bool): Form submission loading state (via Inertia useForm)

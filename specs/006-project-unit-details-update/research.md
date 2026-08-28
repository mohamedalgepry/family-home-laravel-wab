# Research & Decisions

## Context
Deep code audit of Project Details (Show.jsx, 814 lines) and Unit Details (Show.jsx, 1068 lines) pages to identify all bugs, missing data displays, and non-functional buttons before implementing the update.

## Decision 1: Fake Features Fallback
- **Decision**: Remove all hardcoded fake feature data (swimming pool, gym, elevator, etc.) and instead hide the features section entirely when `features` array is empty.
- **Rationale**: Fake data misleads visitors and violates data integrity. The admin manages features through a many-to-many relation; showing fabricated amenities for projects/units that haven't been configured is deceptive.
- **Alternatives**: Show a "No features listed" placeholder (rejected — adds visual noise with no value).

## Decision 2: Feature Icons
- **Decision**: Render dynamic feature icons using the `icon_name` field from the API resource via the existing `IconByName` component, instead of hardcoded checkmark SVGs.
- **Rationale**: The admin assigns specific icons to features (pool, gym, CCTV, etc.) which are already available through `feature.icon_name` in the API response. The `IconByName` component already exists in the codebase for this purpose.
- **Alternatives**: Keep checkmarks (rejected — ignores admin's icon configuration).

## Decision 3: Duplicate Mobile Bottom Bars
- **Decision**: Consolidate two overlapping fixed bottom bars into a single unified mobile action bar showing WhatsApp + Phone + Price.
- **Rationale**: Both Project and Unit Show pages have TWO fixed bottom bars (`md:hidden` and `sm:hidden`) that collide on viewports <640px, creating visual corruption and untappable buttons.
- **Alternatives**: Use `z-index` stacking to separate them (rejected — still wastes vertical space on small screens).

## Decision 4: Map Fallback Coordinates
- **Decision**: Only render the Google Maps embed when valid coordinates exist (non-null, non-zero lat/lng). Hide the map section entirely when coordinates are missing.
- **Rationale**: Currently falls back to downtown Cairo coordinates (30.0444, 31.2357) which is misleading for properties not in Cairo.
- **Alternatives**: Geocode from address text (rejected — would require new backend API).

## Decision 5: Hardcoded Delivery Date
- **Decision**: Replace hardcoded "2026" with dynamic `project.delivery_date` field from the API resource.
- **Rationale**: The delivery date was hardcoded during development and never bound to the actual data. The `delivery_date` field is available in `ProjectPublicResource`.
- **Alternatives**: Remove delivery date entirely (rejected — it's valuable information for buyers).

## Decision 6: Mobile/Desktop Parity
- **Decision**: Ensure all data sections present on desktop are also present on mobile, including: payment terms, finishing type, floor number, deal badge, area card fallback, and complete contact form with validation.
- **Rationale**: Mobile users represent a significant portion of real estate browsing traffic and deserve feature parity.
- **Alternatives**: Keep minimal mobile layout (rejected — critical data is hidden from majority of users).

## Decision 7: Video Path Support
- **Decision**: Support `video_path` (uploaded MP4 files) in addition to YouTube embed URLs using HTML5 `<video>` element when `video_url` is not a YouTube/Vimeo link.
- **Rationale**: Admin can upload local videos via the admin panel, but these are completely ignored by the frontend which only handles YouTube embeds.
- **Alternatives**: Only support YouTube (rejected — ignores admin-uploaded video content).

## Decision 8: Contact Form Mobile Parity
- **Decision**: Add `id="contact-form"` to mobile contact section, include email field, validation error displays for all fields, and success confirmation banner matching desktop behavior.
- **Rationale**: Mobile contact form currently lacks: anchor ID (breaking "Contact Agent" button), email input, all validation error messages, and success feedback. This makes the form effectively broken on mobile.
- **Alternatives**: Hide contact form on mobile and only show WhatsApp/Phone (rejected — removes a valid lead capture channel).

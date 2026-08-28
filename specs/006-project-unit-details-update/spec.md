# Project & Unit Details Pages Update — Family Home

**Feature Directory**: specs/006-project-unit-details-update
**Status**: Ready for Planning
**Created**: 2026-08-28

---

## Overview

The Family Home real estate portal's Project Details and Unit Details pages require a focused update to ensure all interactive elements (buttons, links, forms) function correctly, unnecessary or non-functional buttons are removed, and all data entered by administrators through the admin panel is properly displayed to visitors. This update strictly targets the two detail pages without altering any backend logic, database structure, or routing.

**CRITICAL CONSTRAINT**: This is a frontend-only UI improvement. There must be **ZERO** changes to Controllers, Models, Database Migrations, Routes, Services, or API Resources. The existing Design System (DESIGN.md) must be preserved — no color, typography, or component-style changes.

---

## Clarifications

### Session 2026-08-28
- Q: Regarding the scope creep items in FR-6.4 (local video fallback, delivery date, is_active status, and is_deal badge): Should we formalize these additions by keeping them and fixing their styling, or remove them entirely to stick to the original spec? → A: Remove them entirely to strictly match the original spec

---

## Actors

| Actor | Description |
|-------|-------------|
| Visitor | Public user browsing project or unit details to evaluate properties |
| Admin | System administrator who enters project/unit data through the admin panel |

---

## User Scenarios & Flow

### Scenario 1 — Visitor Views Project Details and All Buttons Work
**Given** a visitor navigates to a project details page (`/{locale}/projects/{slug}`)
**When** they interact with any visible button or link on the page
**Then** every button performs its intended action: share works, gallery navigation cycles images, lightbox opens and navigates, WhatsApp opens the correct conversation, phone call dials the correct number, anchor links scroll to the correct section, "View All Photos" opens the full gallery, map opens Google Maps, and all card links navigate to the correct destinations.

### Scenario 2 — Visitor Views Unit Details and All Buttons Work
**Given** a visitor navigates to a unit details page (`/{locale}/units/{slug}`)
**When** they interact with any visible button or link on the page
**Then** every button performs its intended action: share works, gallery works, contact form submits successfully with validation feedback, WhatsApp/phone links work, anchor tabs scroll correctly, "View Project" navigates to the parent project, "Explore Area" navigates to the area page, map opens correctly, lightbox opens and navigates, and the contact form resets after successful submission with a visible success message.

### Scenario 3 — All Admin Data Appears on Project Details
**Given** an admin has entered comprehensive data for a project (name, description, images, video URL, location coordinates, location address, payment method, down payment, installment years, finishing type, features/amenities, agent assignment, SEO metadata)
**When** a visitor opens that project's details page
**Then** every piece of admin-entered data has a visible, clearly labeled section on the page, including: project name, description, full image gallery, embedded video tour (when video URL exists), payment information card (payment method + down payment + installment years), finishing type badge, features/amenities grid with icons, agent profile with contact details, Google Maps embed with coordinates, breadcrumb with area link, and all associated units list.

### Scenario 4 — All Admin Data Appears on Unit Details
**Given** an admin has entered comprehensive data for a unit (name, price, transaction type, description, area in sqm, rooms, bathrooms, floor, images, video URL, location coordinates, location address, payment method, down payment, installment years, unit type, finishing type, features/amenities, project association, agent assignment, SEO metadata, alt text)
**When** a visitor opens that unit's details page
**Then** every piece of admin-entered data has a visible, clearly labeled section on the page, including: unit name, formatted price with currency, sale/rent badge, full description, specifications card (area sqm, rooms, bathrooms, floor), image gallery with lightbox, embedded video tour (when video URL exists), payment information (method + down payment + installment years), unit type label, finishing type badge, features/amenities grid with icons, parent project link with details, area link, agent profile with contact actions, Google Maps embed, contact inquiry form, and similar units / related projects / related articles sections.

### Scenario 5 — Non-Functional Buttons Are Removed
**Given** the current Project Details and Unit Details pages contain buttons or interactive elements that do not perform any action or lead to unimplemented functionality
**When** the update is applied
**Then** any button that has no working action, points to a dead route, or provides no user value is removed cleanly without leaving visual gaps or layout issues.

### Scenario 6 — Graceful Handling of Missing Data
**Given** an admin has only partially filled a project or unit record (e.g., no video URL, no coordinates, no features)
**When** a visitor opens the details page
**Then** sections corresponding to missing data are hidden entirely (not shown as empty or broken), and the page layout adapts gracefully without visual gaps or layout shifts.

---

## Functional Requirements

### FR-1: Button Audit and Repair — Project Details Page

**FR-1.1** — The share button (top overlay and summary card) must trigger the Web Share API on supported devices or copy the page URL to clipboard with user feedback (toast or alert) on unsupported devices.

**FR-1.2** — The "View All Photos" button must open the fullscreen lightbox modal showing all project images, starting from the currently selected image.

**FR-1.3** — Gallery navigation arrows (previous/next) must cycle through images correctly, wrapping at boundaries.

**FR-1.4** — Gallery thumbnail strip must switch the active hero image on click; the "+N" overflow tile must open the lightbox at the correct index.

**FR-1.5** — The "Contact Agent" / "تواصل مع الوكيل" button must open a WhatsApp conversation with the assigned agent's number, falling back to the company's default WhatsApp number when no agent is assigned.

**FR-1.6** — The agent profile card must link to the agent's public portfolio page (`/{locale}/agents/{slug || id}`).

**FR-1.7** — Agent quick-action icons (WhatsApp and phone) must open the correct `wa.me` and `tel:` links respectively.

**FR-1.8** — Desktop anchor navigation items (#overview, #video, #features, #units-list, #location) must smooth-scroll to the correct page section. Navigation items for hidden sections (e.g., #video when no video_url exists) must not appear.

**FR-1.9** — The "Open in Google Maps" link must open a new tab with the correct coordinates. This link must not appear when latitude/longitude are missing or zero.

**FR-1.10** — Unit cards in the project's units section must navigate to the correct unit details page.

**FR-1.11** — Similar project cards and related article cards must navigate to their respective details pages.

**FR-1.12** — The mobile sticky WhatsApp button and bottom floating bar (WhatsApp + Phone) must use the correct agent contact numbers with company fallback.

**FR-1.13** — Lightbox modal must support close (✕ button and backdrop click), and previous/next navigation with correct event propagation handling.

### FR-2: Button Audit and Repair — Unit Details Page

**FR-2.1** — All share buttons must function identically to FR-1.1.

**FR-2.2** — The "View All Photos" button must open the fullscreen lightbox with all unit images.

**FR-2.3** — The "Watch Video" / "فيديو الوحدة" button must smooth-scroll to the #video section. This button must not appear when no video_url exists.

**FR-2.4** — Gallery navigation and thumbnails must function identically to FR-1.3 and FR-1.4.

**FR-2.5** — The "Contact Agent" button must smooth-scroll to the #contact-form section.

**FR-2.6** — The contact form must submit via `POST /{locale}/units/{slug}/contact` with proper validation (required: client_name, client_phone, content; optional: client_email). On success, the form must reset and display a 7-second success banner. On failure, validation errors must appear inline next to each field.

**FR-2.7** — Agent profile link, WhatsApp buttons, and phone buttons must function identically to FR-1.6, FR-1.7.

**FR-2.8** — Desktop anchor navigation tabs (#overview, #video, #features, #location, #contact-form) must smooth-scroll correctly. Tabs for hidden sections must not appear.

**FR-2.9** — The "View Project & All Units" button must navigate to the parent project's details page. This button must not appear when the unit has no associated project.

**FR-2.10** — The "Explore Properties in this Area" button must navigate to the area page. This button must not appear when the unit has no associated area.

**FR-2.11** — The Google Maps link and embed must function identically to FR-1.9.

**FR-2.12** — Similar units, related projects, and related articles cards must navigate to their respective pages.

**FR-2.13** — Lightbox modal must function identically to FR-1.13.

**FR-2.14** — Mobile fixed bottom bar (WhatsApp + Phone) must use correct contact numbers with company fallback.

### FR-3: Remove Non-Functional Buttons

**FR-3.1** — Identify and remove any button or interactive element on either page that currently does not perform any action when clicked.

**FR-3.2** — Identify and remove any button that links to a route or feature that does not exist in the application.

**FR-3.3** — Ensure removal does not create visual gaps — remaining elements must reflow naturally with the existing design grid/spacing.

### FR-4: Complete Admin Data Display — Project Details

**FR-4.1** — Project name (localized) must be displayed as the page title and in breadcrumbs.

**FR-4.2** — Project description (localized) must be displayed in an "About Project" / "عن المشروع" section with proper text formatting.

**FR-4.3** — All uploaded images must be accessible through the gallery and lightbox with proper alt text from `alt_text` field.

**FR-4.4** — Video tour must display as an embedded YouTube iframe when `video_url` is provided, with proper aspect ratio.

**FR-4.5** — Payment information must display as a structured card: payment method (cash/installment/both), down payment amount (formatted), and installment years — each with a clear label and icon.

**FR-4.6** — Finishing type must display as a labeled badge/tag from the finishing type relation.

**FR-4.7** — Features/amenities must display in a grid format with name and SVG icon for each feature from the features relation.

**FR-4.8** — Location must display with: address text (localized), embedded Google Maps iframe with coordinates, and "Open in Google Maps" external link.

**FR-4.9** — Agent/manager profile must display with: name, avatar, WhatsApp button, phone button, and link to agent portfolio.

**FR-4.10** — Associated active units must display in a scrollable/grid list using UnitCard components.

**FR-4.11** — Area information must appear in breadcrumbs and as contextual navigation.

### FR-5: Complete Admin Data Display — Unit Details

**FR-5.1** — Unit name (localized), formatted price with EGP currency, and transaction badge (sale/rent) must be prominently displayed.

**FR-5.2** — Specifications card must show: area in m² (area_sqm), bedrooms (rooms), bathrooms, and floor — each with icon and label.

**FR-5.3** — Full description (localized) must be displayed in the overview section.

**FR-5.4** — All uploaded images must be accessible through gallery and lightbox with alt text.

**FR-5.5** — Video tour must display as embedded YouTube iframe when `video_url` is provided.

**FR-5.6** — Payment information must display identically to FR-4.5.

**FR-5.7** — Unit type must display as a labeled tag from the type relation.

**FR-5.8** — Finishing type must display identically to FR-4.6.

**FR-5.9** — Features/amenities grid must display identically to FR-4.7.

**FR-5.10** — Parent project information must display with: project name, area, installment terms, and link to project details page.

**FR-5.11** — Location must display identically to FR-4.8.

**FR-5.12** — Agent profile and contact actions must display identically to FR-4.9.

**FR-5.13** — Contact inquiry form must display with: client name, phone, email, message fields, submit button, validation errors, and success feedback.

**FR-5.14** — Similar units, related projects, and related articles sections must display with proper card components.

---

## Non-Functional Requirements & Constraints

| Category | Requirement |
|----------|-------------|
| Architecture | Zero changes to Controllers, Models, Services, Migrations, or Routes |
| Data | Inertia props and API Resources must remain unchanged |
| Design System | Existing DESIGN.md tokens (colors, typography, spacing, shadows, radii) must be preserved |
| SEO | All existing Schema.org JSON-LD, OpenGraph, meta tags, and breadcrumbs must remain intact |
| Responsive | Both pages must remain functional on Mobile (320-430px), Tablet (768-1024px), and Desktop (1280-1920px) |
| RTL/LTR | Both Arabic (RTL) and English (LTR) layouts must remain correct |
| Performance | No new dependencies; preserve existing lazy loading and image optimization |
| Accessibility | Touch targets ≥44px, keyboard navigation preserved, aria labels on interactive elements |
| Code Quality | Clean, well-organized JSX with consistent formatting and helpful comments |

---

## Success Criteria

| # | Criterion | How Verified |
|---|-----------|-------------|
| SC-1 | Every visible button on Project Details performs its intended action without errors | Manual click-through testing of all 16 button types |
| SC-2 | Every visible button on Unit Details performs its intended action without errors | Manual click-through testing of all 16 button types |
| SC-3 | Contact form on Unit Details submits successfully and provides feedback | Form submission test with valid and invalid data |
| SC-4 | All admin-entered project data has a visible, labeled section on the details page | Cross-reference admin form fields with displayed data |
| SC-5 | All admin-entered unit data has a visible, labeled section on the details page | Cross-reference admin form fields with displayed data |
| SC-6 | No non-functional or dead-link buttons remain on either page | Complete button inventory audit |
| SC-7 | Sections with missing data are hidden without layout gaps | Test with partially filled records |
| SC-8 | No backend files (Controllers, Models, Migrations, Routes) are modified | Code diff review |
| SC-9 | Pages render correctly in both RTL (Arabic) and LTR (English) on mobile and desktop | Browser testing in both locales and viewports |
| SC-10 | Existing SEO markup (JSON-LD, meta tags, breadcrumbs) remains fully functional | Lighthouse SEO audit comparison |

---

## Dependencies & Assumptions

- The existing backend (Laravel 13 + Inertia.js 3.6 + React 19 + Tailwind CSS v4) remains unchanged.
- All data fields referenced in this spec are already available through existing Inertia props and API Resources (`ProjectPublicResource`, `UnitPublicResource`).
- The Design System defined in DESIGN.md (crimson primary, Cairo font, rounded corners, elevation patterns) is the source of truth for all visual decisions.
- Agent contact fallback logic (`getAgentContacts`) already handles company-level defaults when no agent is assigned.
- The `useTrans` localization hook provides all necessary translation keys for both Arabic and English.

---

## Out of Scope

- Adding new features not currently in the system (wishlists, reviews, booking, chat).
- Backend modifications or new API endpoints.
- Changes to the admin panel interface.
- Modifications to the Design System colors, typography, or component styles.
- Changes to any page other than Project Details (`Show.jsx`) and Unit Details (`Show.jsx`).
- Database schema changes.
- Adding new npm dependencies.

### FR-6: Post-Implementation Audit Fixes (Phase 2)

**FR-6.1 (Design System Violations)** — Fix the primary red color (`#CC0000`) applied to feature icons (`IconByName`); change it to the allowed secondary icon color `text-[#FF6B6B]` (Coral Accent) or `text-[#6B6B6B]` (Slate Muted) per `DESIGN.md`. Fix the "Hot Deal" badge to use the required `amber-500→amber-600` gradient with an SVG star instead of a solid color and emoji.

**FR-6.2 (Code Smells & Duplication)** — Extract the duplicated video player rendering logic (iframe vs video tag) into a shared `VideoPlayer` component. Extract the duplicated geographic coordinate validation logic into `hasValidCoords(lat, lng)` in a utility file. Extract the duplicated Payment Terms display block into a shared component.

**FR-6.3 (Missing Requirements)** — On the Unit Details page: the contact form must reset its fields upon successful submission, and the success banner must auto-hide after 7 seconds (FR-2.6). Add inline validation error displays for the `client_name` and `content` fields (FR-2.6). Add the missing Unit Type tag to the specifications grid (FR-5.7). Add smooth-scroll `onClick` behavior to the "Contact Agent" button (FR-2.5).

**FR-6.4 (Scope Creep Revisions)** — Remove the local video fallback (`video_path`) logic and navigation tabs since it wasn't requested. Remove `delivery_date` and `is_active` from the project info card as they violate the exact admin fields scope. Remove the `is_deal` badge. Ensure we strictly match the original spec.

**FR-6.5 (Animation & Motion Violations)** — Replace non-performant `transition-all` classes with `transition-colors` on form inputs. On the "Watch Video" button and "Explore Properties in this Area" link, remove `transition-all` and add proper physical press feedback using `transition active:scale-[0.97] duration-150 ease-out` per the animation standards.

**FR-6.6 (Home Page Search Bar Fix)** — In `resources/js/Pages/Public/Home.jsx`, the `SearchBar` component is being passed props prefixed with `initial` (e.g., `initialAreas`, `initialUnitTypes`), but the component expects them without the prefix (e.g., `areas`, `unitTypes`). Fix the prop names in `Home.jsx` so that the dropdowns in the search bar populate correctly with data from the database.

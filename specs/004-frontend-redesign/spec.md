# Frontend Redesign Specification — Family Home

**Feature Directory**: specs/004-frontend-redesign
**Status**: Ready for Planning
**Created**: 2026-08-12

---

## Overview

The Family Home Real Estate Portal requires a complete frontend redesign of its public-facing interfaces. The design will be modeled after a reference provided via Google Stitch (Project ID: 2866902450180004713, Screen ID: b0e3d19605b342a9b630ad8927199fe3) to achieve a modern, premium look.

**CRITICAL CONSTRAINT**: This is a visual and UX redesign only. There must be **ZERO** changes to the underlying Business Logic, Database, Routes, Search Logic, SEO Logic, Authentication, or Authorization. No new features will be added unless they already exist in the system.

---

## Actors

| Actor | Description |
|-------|-------------|
| Visitor | Public user browsing the portal to find properties or areas |
| Agent | Real estate agent whose public profile is viewed by visitors |

---

## User Scenarios & Flow

### Scenario 1 — Browsing the Homepage
**Given** a visitor lands on the Homepage
**When** they view the page on Mobile or Desktop
**Then** they see a premium Hero section, an accessible Search Bar (with a Bottom Sheet for filters on Mobile), and cleanly organized sections (Areas, Projects, Units, Deals) matching the new Design System.

### Scenario 2 — Searching for Properties
**Given** a visitor is looking for a property
**When** they interact with the search filters
**Then** the search logic behaves exactly as before, but the UI provides a streamlined experience (Sidebar on Desktop, Bottom Sheet on Mobile) without altering query parameters.

### Scenario 3 — Viewing a Property
**Given** a visitor clicks on a Project or Unit
**When** the details page loads
**Then** they see a reorganized, visually impressive layout (Gallery, Details, Agent info, Map) that strictly uses existing backend data and props without requiring new API endpoints.

---

## Functional Requirements

### FR-1: Design System Implementation
**FR-1.1** — Establish a unified Design System (Colors, Typography, Spacing, Shadows, Radius) inspired by the Stitch reference.
**FR-1.2** — Ensure comprehensive support for both Arabic (RTL) and English (LTR) typography.
**FR-1.3** — Standardize core UI components (Buttons, Inputs, Cards, Badges, Modals, Bottom Sheets).

### FR-2: Header & Navigation
**FR-2.1** — Redesign Desktop Header to be premium and sticky, preserving existing links.
**FR-2.2** — Redesign Mobile Header with a modern Drawer/Sheet menu.

### FR-3: Homepage Redesign
**FR-3.1** — Implement a responsive Hero section with a prominent Search Card.
**FR-3.2** — Implement horizontal carousels for Areas on Mobile.
**FR-3.3** — Redesign Cards for Projects, Units, and Deals (الصفقات).

### FR-4: Search and Filters
**FR-4.1** — Redesign the Desktop search interface with structured horizontal/sidebar filters.
**FR-4.2** — Redesign the Mobile search interface to use a compact view with a Bottom Sheet for advanced filters.
**FR-4.3** — Preserve all existing filter criteria and search parameters exactly as they are.

### FR-5: Listing and Detail Pages
**FR-5.1** — Redesign Search Results, Projects Listing, and Units Listing pages.
**FR-5.2** — Redesign Project Details and Unit Details to optimize visual hierarchy and gallery presentation.
**FR-5.3** — Redesign Areas listing and Area Details with an image/card-driven approach.

### FR-6: Supplementary Pages
**FR-6.1** — Redesign Agents, Deals, Comparison, Articles, About, and Contact pages.
**FR-6.2** — Preserve all existing form validation and submission logic on the Contact page.
**FR-6.3** — Do not expose sensitive agent data (e.g., internal emails, passwords).

### FR-7: States and Feedback
**FR-7.1** — Implement matching designs for Error states (404, 500), Empty states, Loading states, and Skeletons.

---

## Non-Functional Requirements & Constraints

| Category | Requirement |
|----------|-------------|
| Architecture | Zero backend, database, or routing changes |
| Data | Inertia props must remain unchanged |
| SEO | Canonical, Hreflang, JSON-LD, Breadcrumbs, and Metadata must remain intact |
| Responsive | Layouts must be explicitly designed for Mobile (320-430px), Tablet (768-1024px), and Desktop (1280-1920px) |
| Performance | Reuse existing dependencies; preserve lazy loading; avoid layout shifts |
| Accessibility | Support keyboard navigation, aria labels, adequate contrast, and touch targets (>=44px) |

---

## Success Criteria

| # | Criterion | How Verified |
|---|-----------|-------------|
| SC-1 | Visual UI matches the Stitch reference's premium aesthetic | Design Review |
| SC-2 | No changes to backend controllers or database schema | Code Review / PR Diff |
| SC-3 | Search functionality works exactly as before with new UI | Automated/Manual Testing |
| SC-4 | Pages render correctly in both RTL (Arabic) and LTR (English) | Browser Verification |
| SC-5 | Lighthouse SEO score remains equal or higher than before | Lighthouse Audit |
| SC-6 | All pages function correctly across designated responsive breakpoints | Device/Emulator Testing |

---

## Dependencies & Assumptions

- The existing backend (Laravel) and frontend framework (Inertia + React + Tailwind) will be used.
- The Stitch design acts as a visual guide, not a strict functional blueprint.
- Any features in Stitch that do not exist in the current Family Home portal will be ignored.

---

## Out of Scope

- Any backend modifications or API creation.
- Addition of new features (e.g., Wishlists, Chat, Booking, Reviews).
- Modifying existing authentication or authorization flows.

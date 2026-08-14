# Implementation Tasks: Frontend Redesign

**Feature**: Frontend Redesign
**Phase**: Task Generation
**Target Branch**: N/A

## Mandatory Corrections & Constraints
- HARD BACKEND FREEZE: The following must NEVER be modified: outes/, pp/Http/, pp/Domain/, pp/Models/, database/, migrations/, Requests, Controllers, Services, Resources, Authentication, Authorization, SEO backend logic, Sitemap logic, Google Maps coordinate extraction, Search/query backend logic. If a frontend requirement requires backend modification, STOP and report.
- STRICT PAGE-BY-PAGE: Every phase must contain inspection, impact analysis, implementation, build, responsive verification, regression verification, and checkpoint report.
- NO NEW FUNCTIONALITY: No Favorites, Wishlist, new filters, new routes, APIs, DB fields, business logic, auth functionality, or booking/chat/review systems. Stitch is a VISUAL/UX reference ONLY.
- PRESERVE EXACTLY: Inertia props, routes, query parameters, search/filter behavior, forms, validation, pagination, comparison, agent behavior, Google Maps behavior, SEO, authentication behavior.

---

## Phase 0: Repository & Frontend Audit
- [x] T001 Inspect existing tokens, global CSS, and Tailwind v4 configuration to identify existing reusable styles and prevent global regressions.
- [x] T002 Generate Checkpoint Report

## Phase 1: Stitch Visual Analysis
- [x] T003 Inspect the approved Stitch design to extract colors, typography, spacing, radius, shadows, card style, search layout, filter layout, mobile behavior, and desktop behavior (DO NOT import Stitch business logic).
- [x] T004 Generate Checkpoint Report

## Phase 2: Design Tokens
- [x] T005 Define CSS variables and Tailwind v4 configuration safely in resources/css/app.css
- [x] T006 Generate Checkpoint Report

## Phase 3: Shared UI Components
- [x] T007 Shared Components Impact Analysis: Search repository for all consumers of Button, InputField, Select, Cards, Header, Footer, SearchBar. Document where used, affected pages, and preserved props.
- [x] T008 Upgrade core UI components based on impact analysis in `resources/js/Components/`
- [x] T009 Generate Checkpoint Report

## Phase 4: Header
- [x] T010 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Components/Layout/Header.jsx`
- [ ] T011 Generate Checkpoint Report

## Phase 5: Footer
- [x] T012 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Components/Layout/Footer.jsx`
- [x] T013 Generate Checkpoint Report

## Phase 6: Homepage
- [x] T014 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Home.jsx`
- [ ] T015 Generate Checkpoint Report

## Phase 7: Search / Filters
- [x] T016 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Components/UI/SearchBar.jsx` (Desktop/Mobile BottomSheet)
- [x] T017 Generate Checkpoint Report

## Phase 8: Units Listing
- [x] T018 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Units/Index.jsx`
- [x] T019 Generate Checkpoint Report

## Phase 9: Projects Listing
- [x] T020 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Projects/Index.jsx`
- [x] T021 Generate Checkpoint Report

## Phase 10: Project Details
- [x] T022 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Projects/Show.jsx`
- [x] T023 Generate Checkpoint Report

## Phase 11: Unit Details
- [x] T024 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Units/Show.jsx`
- [x] T025 Generate Checkpoint Report

## Phase 12: Areas
- [x] T026 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Areas/Show.jsx`
- [x] T027 Generate Checkpoint Report

## Phase 13: Deals
- [x] T028 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Units/Deals.jsx`
- [x] T029 Generate Checkpoint Report

## Phase 14: Comparison
- [x] T030 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Comparison.jsx`
- [x] T031 Generate Checkpoint Report

## Phase 15: Agents
- [x] T032 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Agents/Show.jsx`
- [x] T033 Generate Checkpoint Report

## Phase 16: Articles
- [x] T034 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Articles/Index.jsx` and `Show.jsx`
- [x] T035 Generate Checkpoint Report

## Phase 17: About
- [x] T036 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/About.jsx`
- [x] T037 Generate Checkpoint Report

## Phase 18: Contact
- [x] T038 Inspect, impact analysis, implement, build, verify, and redesign `resources/js/Pages/Public/Contact.jsx`
- [x] T039 Generate Checkpoint Report

## Phase 19: 404 / Empty / Loading
- [x] T040 Inspect, impact analysis, implement, build, verify, and redesign error, loading, and empty states
- [x] T041 Generate Checkpoint Report

## Phase 20: Responsive Audit
- [x] T042 Explicit responsive testing for 320px, 360px, 375px, 390px, 414px, 430px, 768px, 1024px, 1280px, 1440px, 1920px (Verify no overflow, clipped content, broken cards, layout regressions)

## Phase 21: Accessibility Audit
- [x] T043 Verify keyboard navigation, focus states, aria labels, semantic HTML, contrast, touch targets >= 44px, screen reader compatibility
- [x] T044 Fix identified a11y issues

## Phase 22: Performance Audit
- [x] T045 Verify CLS (no layout shifts), image loading (lazy where appropriate, eager for hero), Lighthouse score impact
- [x] T046 Optimize heavy DOM if any

## Phase 23: Final Regression Audit
- [x] T047 Execute a full build and test core flows (Search -> Results -> Unit Show -> Form Submission)

## Phase 24: Final Git Scope & Stitch Visual Audit
- [x] T048 Run git diff --name-only. Confirm EVERY modified file belongs to the allowed frontend scope (STOP if ANY backend file modified)
- [x] T049 Verify the completed frontend against the Stitch reference for visual consistency without overriding Family Home functionality
- [x] T050 Generate Final Completion Report

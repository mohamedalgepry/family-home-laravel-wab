# Implementation Plan: Frontend Redesign

**Feature**: Frontend Redesign (specs/004-frontend-redesign)
**Status**: Ready for Implementation
**Target Branch**: N/A (Directly executed on current branch)

## Technical Context
The project uses Laravel + Inertia.js + React. The frontend CSS uses Tailwind v4.

## HARD BACKEND FREEZE
Do **NOT** modify:
- outes/
- pp/Http/
- pp/Domain/
- pp/Models/
- database/
- migrations/
- Requests, Controllers, Services, Resources
- Authentication, Authorization
- SEO backend logic, sitemap logic
- Google Maps coordinate extraction
- Search/query backend logic
*If a frontend requirement appears to require backend changes: STOP and report it instead of modifying the backend.*

## Component & Functionality Constraints
1. **Reuse existing components** whenever possible. Do not create duplicates if an existing component can be extended safely.
2. **Do not introduce new functionality**. No Favorites, Wishlist, new filters, new routes, new APIs, new business logic, or new database fields. Stitch is ONLY a visual and UX reference.
3. **Preserve all existing functionality exactly**. The redesign must change visual hierarchy, spacing, typography, colors, cards, layout, responsive behavior, mobile filters, and navigation presentation. It MUST NOT change what the application does, where data comes from, how data is submitted, search logic, authentication, or SEO.

## Page-by-Page Execution Protocol
For EACH page in the execution order:
1. Inspect the existing JSX and all imported/shared components.
2. Inspect the existing Inertia props used by the page.
3. Inspect the current responsive behavior.
4. Inspect the Stitch reference where applicable.
5. Define the visual changes before editing.
6. Modify frontend files only.
7. Preserve every existing prop, route, query parameter, action, form behavior, and business rule.
8. Run 
pm run build after completing the page.
9. Check for console/import/runtime issues.
10. Verify RTL and LTR.
11. Verify mobile, tablet, and desktop layouts.
12. Output the Checkpoint Report. Only then proceed to the next page.

### Checkpoint Report Format
PAGE: [Name]
Status: PASS/FAIL
Files changed: [List]
Frontend-only confirmation: [Yes]
Build: [Pass/Fail]
RTL: [Pass/Fail]
LTR: [Pass/Fail]
Mobile: [Pass/Fail]
Tablet: [Pass/Fail]
Desktop: [Pass/Fail]
Runtime issues: [None/List]
Regression issues: [None/List]
*(Do not continue if a regression is detected)*

## Execution Order
- Phase 0: Design Tokens
- Phase 1: Shared UI Components
- Phase 2: Header
- Phase 3: Footer
- Phase 4: Homepage
- Phase 5: Search/Filters
- Phase 6: Units Listing
- Phase 7: Projects Listing
- Phase 8: Project Details
- Phase 9: Unit Details
- Phase 10: Areas
- Phase 11: Deals
- Phase 12: Comparison
- Phase 13: Agents
- Phase 14: Articles
- Phase 15: About
- Phase 16: Contact
- Phase 17: 404 / Empty / Loading
- Phase 18: Final Responsive Audit
- Phase 19: Final Regression Audit

## Constitution Check
- **Zero Backend Changes**: Mandated and Enforced.
- **Security**: Preserved existing auth/authorization flows.
- **SEO/Metadata**: Preserved structured data and meta tags.

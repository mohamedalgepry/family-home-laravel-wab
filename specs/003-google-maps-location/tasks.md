# Implementation Tasks: Google Maps Location URL

**Feature**: Google Maps Location URL Processing
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Implementation Strategy
- Build the core SSRF-safe URL resolver service first.
- Integrate the backend form requests to use the service.
- Update the Admin UI to clearly request standard links and display extracted coordinates.
- Update the Public UI to render maps directly from coordinates instead of using legacy embed HTML.

## Phase 1: Setup (Core Service)

- [x] T001 Implement `GoogleMapsUrlResolverService` in `app/Domain/Listings/Services/GoogleMapsUrlResolverService.php` with regex parsing and SSRF guards
- [x] T002 [P] Create test `tests/Unit/GoogleMapsUrlResolverServiceTest.php`

## Phase 2: Foundational (Backend Integration) [US1, FR-6, FR-7]
- [x] **T003**: Refactor `App\Http\Requests\Traits\ExtractsCoordinatesFromUrl`
  - Remove all legacy regex logic.
  - Inject or instantiate `GoogleMapsUrlResolverService`.
  - Fail validation if URL is invalid or parsing fails.
- [x] **T004**: Update `App\Http\Requests\Admin\Concerns\HasMapEmbedRule`
  - Change `mapEmbedUrlRule` to remove `Sanitizer::isValidMapEmbed()` and only require `url`.
- [x] **T005**: Update `App\Console\Commands\ExtractCoordinatesCommand`
  - Refactor to use `GoogleMapsUrlResolverService` to support one-off migrations of any legacy links.

## Phase 3: Admin UI Updates [US1]
- [x] **T006**: Update `resources/js/Pages/Admin/Units/Form.jsx`
  - Change `map_embed_url` field label to "Google Maps Location URL" (رابط خريطة جوجل للموقع).
  - Update placeholder/helper text to instruct users to paste a regular Google Maps URL.
  - Remove legacy iframe preview box in the form.
  - Make `latitude` and `longitude` fields read-only visual confirmations.
- [x] **T007**: Update `resources/js/Pages/Admin/Projects/Form.jsx`
  - Apply the exact same changes as T006 to the project admin form.
- [x] **T008**: Update `resources/js/Pages/Admin/Areas/Form.jsx` (if applicable)
  - Ensure any location map inputs in areas match the new standard.

## Phase 4: Public View Updates [US2]
- [x] **T009**: Update `resources/js/Pages/Public/Units/Show.jsx`
  - Remove legacy iframe elements that render raw `map_embed_url` strings.
  - Replace with `GoogleMap` component or equivalent, passing extracted `latitude` and `longitude`.
- [x] **T010**: Update `resources/js/Pages/Public/Projects/Show.jsx`
  - Apply the exact same visual changes as T009.
- [x] **T011**: Update `resources/js/Pages/Public/Areas/Show.jsx`
  - Ensure public area maps also utilize structured coordinates instead of raw embed strings.

## Phase 5: Cache Invalidation (Added via `/speckit-converge`)
- [x] **T014**: Ensure `ProjectService`, `UnitService`, and `AreaService` trigger cache invalidation upon location coordinate updates. (This satisfies FR-10).

## Phase 6: Validation and Edge Cases [US3, FR-8]
- [x] **T012**: Run automated tests for URL parsing component to cover:
  - Direct Map Pin Links (e.g., `!3d...`)
  - Embed Links (e.g., `?pb=...`)
  - Query Links (e.g., `?q=lat,lng`)
  - Fallback viewports (e.g., `/@lat,lng,15z`)
- [x] **T013**: Ensure SSRF prevention works correctly for redirect resolutions, rejecting non-Google domains and private IPs.

# Family Home Smart Search Specification

## Goal
Improve textual search so natural Arabic/English queries can discover the relevant project, unit, area, or property type instead of relying on exact-name matching.

## Examples
- `شقق للبيع في زايد` → Sheikh Zayed projects and matching apartments
- `شقق زايد` → projects/units in Sheikh Zayed
- `Cavali` / `كافالي` → Cavali Residence
- `مشروع في العاصمة الإدارية` → projects in New Capital
- `محلات للبيع` → commercial units for sale
- `شقة 150 متر في التجمع` → apartments around 150m² in New Cairo

## Search pipeline
1. Normalize Arabic and English input.
2. Remove harmless punctuation and repeated whitespace.
3. Detect useful intent terms: property type, transaction type, area/city, project name, size hints.
4. Search projects and units using weighted fields.
5. Rank exact project/name matches above area matches, then property type, keywords, descriptions, and partial matches.
6. Return grouped suggestions: Projects, Units, Areas, and Suggestions.
7. Keep results fast with bounded result counts and indexed searchable columns.

## Arabic normalization
The search layer should normalize common Arabic variants such as alef forms (`أ`, `إ`, `آ` → `ا`), normalize `ى`/`ي`, remove tatweel, and collapse whitespace. It should not destroy meaningful Arabic text.

## UX
The search box should provide a modern autocomplete panel while typing, with keyboard navigation, clear result grouping, thumbnails where available, project/unit metadata, and a full-results fallback. Empty states should explain what can be searched.

## Safety and quality
- Never expose unpublished/private records.
- Preserve the existing authorization/visibility rules.
- Do not replace the existing search until the new implementation passes tests and build verification.
- Add automated coverage for Arabic normalization, project-name matching, area queries, property-type queries, and mixed Arabic/English input.

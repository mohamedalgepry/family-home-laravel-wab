# Validation Quickstart

Follow these steps to validate the Project & Unit Details pages update locally.

## Prerequisites
- Node.js & NPM
- PHP & Composer
- Running MySQL database with seeded data

## Setup
1. Run backend server:
   ```bash
   php artisan serve
   ```
2. Run frontend dev server for HMR:
   ```bash
   npm run dev
   ```

## Validation Scenarios

### Scenario 1: Project Details — Full Data
1. Open `http://127.0.0.1:8000/ar/projects/{slug}` (use a project with full data: images, video, features, payment terms, coordinates)
2. Verify:
   - ✅ All buttons clickable and functional (share, gallery, WhatsApp, phone, lightbox, nav tabs)
   - ✅ Payment terms card visible (payment method, down payment, installment years)
   - ✅ Features grid shows actual admin-configured features with proper icons (not fake data)
   - ✅ Finishing type badge displayed
   - ✅ Video tour embedded (YouTube iframe)
   - ✅ Google Maps shows correct location (not Cairo center)
   - ✅ Units list visible with clickable UnitCards
   - ✅ Agent card with working WhatsApp/phone links
   - ✅ Delivery date shows actual date (not hardcoded "2026")

### Scenario 2: Project Details — Partial Data
1. Open a project with minimal data (no video, no features, no coordinates)
2. Verify:
   - ✅ Video section hidden, #video nav tab hidden
   - ✅ Features section hidden, #features nav tab hidden
   - ✅ Map section hidden when no coordinates
   - ✅ No fake amenities displayed
   - ✅ No layout gaps or visual breaks

### Scenario 3: Unit Details — Full Data
1. Open `http://127.0.0.1:8000/ar/units/{slug}` (use a unit with full data)
2. Verify:
   - ✅ All buttons clickable and functional
   - ✅ Floor number in quick specs grid
   - ✅ Finishing type displayed
   - ✅ Deal badge visible (if `is_deal = true`)
   - ✅ Features grid with actual icons
   - ✅ Payment terms visible
   - ✅ Contact form submits, shows success banner, resets
   - ✅ Single mobile bottom bar (no overlap)

### Scenario 4: Unit Details — Mobile
1. Open unit page in Chrome DevTools → Device Toolbar (iPhone 12 Pro, 390px)
2. Verify:
   - ✅ Single bottom action bar (WhatsApp + Phone), no overlap
   - ✅ Payment terms visible in mobile overview
   - ✅ Contact form has email field, validation errors, success banner
   - ✅ "Contact Agent" button scrolls to contact form on mobile
   - ✅ Area card shown when unit has no project

### Scenario 5: RTL / LTR Test
1. Switch language to English (LTR) — verify layout direction reverses
2. Switch back to Arabic (RTL) — verify all text, icons, and arrows are correct
3. Check both Project and Unit detail pages in both languages

### Scenario 6: Contact Form Validation
1. Submit empty form → verify inline error messages appear for required fields
2. Submit with invalid email → verify email validation error
3. Submit with valid data → verify success banner appears for 7 seconds
4. Verify form resets after successful submission

## Build Verification
```bash
npm run build
```
- Ensure zero build errors
- Ensure no console errors in browser

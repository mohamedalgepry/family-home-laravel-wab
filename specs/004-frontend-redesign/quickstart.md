# Validation Quickstart

Follow these steps to validate the UI redesign locally.

## Prerequisites
- Node.js & NPM
- PHP & Composer

## Setup
1. Run backend server:
   php artisan serve
2. Run frontend dev server for HMR (Hot Module Replacement):
   
pm run dev

## Validation Scenarios
1. **Desktop View (1440px)**
   - Open http://127.0.0.1:8000
   - Verify the sticky Header and premium Hero section.
   - Verify horizontal search filters.
2. **Mobile View (390px)**
   - Open Chrome DevTools -> Device Toolbar (iPhone 12 Pro or similar).
   - Verify the Drawer navigation works.
   - Click the "Filters" button and verify the BottomSheet opens smoothly from the bottom.
3. **RTL / LTR Test**
   - Switch language to English (LTR) and verify layout direction reverses correctly.
   - Switch back to Arabic (RTL) and verify fonts and alignments.

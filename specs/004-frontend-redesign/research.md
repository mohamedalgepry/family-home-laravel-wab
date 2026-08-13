# Research & Decisions

## Context
The project needs a premium frontend redesign matching a Google Stitch prototype without altering any business logic.

## Decision 1: Tailwind CSS Configuration
- **Decision**: Use Tailwind v4 @theme directives directly in esources/css/app.css.
- **Rationale**: The project is already on Tailwind v4 (@tailwindcss/vite 4.0.0). Using 	ailwind.config.js is deprecated in v4.
- **Alternatives**: Downgrading to Tailwind v3 (rejected, would break existing setup).

## Decision 2: Mobile Filters
- **Decision**: Implement a native-feeling BottomSheet component for advanced filters on mobile.
- **Rationale**: Mobile search layouts become cluttered with stacked filters. A Bottom Sheet matches the Stitch reference and provides a modern App-like UX.
- **Alternatives**: Accordion filters (rejected, poor UX for real-estate heavy filters).

## Decision 3: Responsive Strategy
- **Decision**: Mobile-first design starting at 320px up to 430px using standard Tailwind fluid utilities, with strict breakpoints for Tablet (md: 768px) and Desktop (xl: 1280px).
- **Rationale**: Adheres to the user's specific responsive constraints without over-complicating CSS with custom media queries.

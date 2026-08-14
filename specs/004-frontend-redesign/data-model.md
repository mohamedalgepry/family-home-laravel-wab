# Frontend Data Model & UI State

Since this is a frontend-only redesign, the data model defines the React Props structure provided by Inertia, which **must remain unchanged**.

## Inertia Props (Read-Only)
- projects: Pagination object containing project arrays.
- units: Pagination object containing unit arrays.
- reas: Array of available areas for filtering.
- ilters: Object containing current search query parameters (e.g. price_min, price_max, 	ype).
- locale: Current active language (r or en).

## Component UI State (Local)
- BottomSheet state: isOpen (boolean) to toggle mobile filters.
- Drawer state: isMenuOpen (boolean) for mobile navigation.
- Carousel state: ctiveIndex (number) for mobile area carousels.

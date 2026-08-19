# Phase 2 — Structural refactor

Status: in progress

## Safety contract
- No visual redesign.
- No behavior change.
- Keep Home, Search transition, Map and guest navigation contracts intact.
- Work from the validated Phase 1 head.
- Keep `backup/pre-refactor-phase0-2026-08-19` as emergency rollback.

## Actual feature boundaries
- `src/features/home/` — Home-specific runtime helpers and accessibility behavior.
- `src/features/search-transition/` — Search transition, destination/date/guest flow.
- `src/features/map-engine/` — map rendering engine and viewport behavior.
- `src/features/map-carousel/` — Map page offer/carousel integration.
- `src/features/resilience/` — runtime resilience layer.

## Completed extractions
- Home scroll behavior moved from the source root into `src/features/home/homeScrollLink.js`.
- Home category identity behavior moved from the source root into `src/features/home/categoryIdentity.js`.
- Home accessibility behavior moved out of `src/app/App.jsx` into `src/features/home/HomeAccessibility.jsx`.
- Duplicate placeholder directories were removed instead of creating parallel Search/Map architectures.

Runtime extraction remains incremental and must be validated after every move. Shared code will only be introduced when a component or utility is demonstrably reused.
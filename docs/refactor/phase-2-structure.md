# Phase 2 — Structural refactor

Status: completed and validated

## Safety contract
- No visual redesign.
- No intentional behavior change.
- Keep Home, Search transition, Map and guest navigation contracts intact.
- Preserve `backup/pre-refactor-phase0-2026-08-19` as emergency rollback.
- Validate each extraction before continuing.

## Final architecture after Phase 2
- `src/app/` — application orchestration, layouts, router, providers and global error boundary.
- `src/app/layouts/` — `GuestLayout` and `HostLayout`.
- `src/app/router/` — router runtime and route definitions.
- `src/features/home/` — Home page plus Home-specific accessibility, category identity and scroll behavior.
- `src/features/search/` — Search transition host, calendar, guest selector, search state/data and Search CSS.
- `src/features/map/` — Map page composition.
- `src/features/map-engine/` — Map rendering engine and viewport behavior.
- `src/features/resilience/` — runtime resilience layer.

## Completed migrations
- Home scroll behavior moved from the source root into `src/features/home/homeScrollLink.js`.
- Home category identity behavior moved from the source root into `src/features/home/categoryIdentity.js`.
- Home accessibility behavior moved out of `src/app/App.jsx` into `src/features/home/HomeAccessibility.jsx`.
- Home page implementation moved from `src/pages/Home/` into `src/features/home/HomePage.jsx`.
- Map page implementation moved from the legacy `src/features/map-carousel/` path into `src/features/map/MapPage.jsx`.
- Search implementation moved from `src/features/search-transition/` into `src/features/search/`.
- Route definitions moved from `src/pages/routes.jsx` into `src/app/router/routes.jsx`.
- Guest and Host layouts moved from `src/pages/layouts/` into `src/app/layouts/`.
- The legacy `src/pages/`, `src/features/search-transition/` and `src/features/map-carousel/` runtime paths are gone.
- Placeholder files made obsolete by these migrations were removed.

## Validation history
Each structural migration was gated through the repository CI before the next move. The Phase 2 closing commit must again pass Search Transition Validation, its build/E2E coverage, and CodeQL Security before Phase 3 begins.

## Result
The application now has explicit application and feature boundaries with no duplicate Home/Search/Map runtime architecture. `App.jsx` is limited to application orchestration, routing belongs under `src/app/router`, layouts belong under `src/app/layouts`, and Home/Search/Map runtime code lives under their feature boundaries. Further decomposition of feature internals belongs to later focused phases and must preserve the same regression contract.

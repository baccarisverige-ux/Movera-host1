# Phase 7 — Architecture guardrails

Status: completed — pending final phase-by-phase regression campaign

## Goal
Prevent the structural regressions fixed in Phase 2 from silently returning.

## Changes
- Added `scripts/check-architecture.mjs`.
- Added `npm run quality:architecture`.
- `quality:fast` and `quality:full` now check for retired runtime paths before continuing.
- Guarded legacy paths: `src/pages/`, `src/features/search-transition/`, `src/features/map-carousel/`.

## Safety
This is repository tooling only. It does not run in the browser and does not alter production behavior.
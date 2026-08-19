# Phase 5 — Package / quality command hygiene

Status: completed — pending final phase-by-phase regression campaign

## Goal
Make the repository's quality commands explicit without changing runtime dependencies or application behavior.

## Changes
- Renamed the package metadata from the generic starter name to `movera-host`.
- Added `test:all` to run unit, E2E and accessibility tests.
- Added `quality:full` to run lint, unit tests, build, E2E and accessibility tests in a deterministic order.
- Existing commands remain available and unchanged.

## Safety
No dependency versions, source imports, runtime modules or build configuration were changed.
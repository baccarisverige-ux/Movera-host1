# Phase 2 — Structural refactor

Status: in progress

## Safety contract
- No visual redesign.
- No behavior change.
- Keep Home, Search transition, Map and guest navigation contracts intact.
- Work from the validated Phase 1 head.
- Keep `backup/pre-refactor-phase0-2026-08-19` as emergency rollback.

## Target architecture
- `src/features/home/` — Home-specific UI and behavior.
- `src/features/search/` — Search transition, destination/date/guest flow.
- `src/features/map/` — Map-specific UI and behavior.
- `src/shared/` — reusable UI/utilities only when proven shared.

This commit establishes boundaries only; it deliberately does not move runtime code yet. Runtime extraction must be incremental and validated after each move.
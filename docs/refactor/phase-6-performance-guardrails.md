# Phase 6 — Performance guardrails

Status: completed — pending final phase-by-phase regression campaign

## Goal
Add a measurable bundle-size guard without changing runtime behavior.

## Changes
- Added `scripts/check-bundle-budget.mjs`.
- Added `npm run quality:bundle`.
- `quality:full` now runs the bundle budget after `vite build`.
- Current thresholds are intentionally generous guardrails: 1.5 MB total JavaScript and 1.0 MB total CSS in `dist/`.

## Safety
The script runs only when explicitly invoked by quality commands. It does not participate in application startup, routing, rendering, styling or production runtime.
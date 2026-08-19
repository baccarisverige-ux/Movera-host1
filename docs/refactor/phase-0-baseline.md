# Movera Host — Refactor Phase 0 Safety Baseline

Date: 2026-08-19
Working branch: `b225-ui-home`
Frozen application commit: `8a8674647daafa7fd572c1ebd00e375e86dd6927`
Immutable rollback branch: `backup/pre-refactor-phase0-2026-08-19`

## Purpose

This document is the safety contract for the upcoming code-quality refactor. The approved UI and validated runtime behavior at the frozen commit must not be changed by refactor work unless a later product request explicitly asks for a visual or behavioral change.

## Green validation baseline

The frozen commit completed successfully on all current critical gates:

- Movera Quality Gate — run `32224638990` — success
- B225 Home Validation — run `32224638981` — success
- B225 Home Step 1 Validation — run `32224639727` — success
- Search Transition Validation — run `32224639056` — success
- CodeQL Security — run `32224639010` — success

The Movera Quality Gate includes lint, unit tests, production build, mobile E2E, Axe accessibility checks, visual capture, and Lighthouse budgets.

## Visual reference baseline

`tests/visual/capture.spec.js` captures the three critical reference states:

1. `home-reference.png`
2. `search-reference.png`
3. `map-reference.png`

Reference Playwright artifact from run `32224638990`:
- artifact id: `9355121187`
- artifact name: `playwright-report`
- SHA-256 digest: `13d4917984fcc1df6cd3b5caf11d7b7321ac3a7354d748e8d09eb90d79867a90`

Reference Lighthouse artifact from the same run:
- artifact id: `9355120093`
- artifact name: `lighthouse-report`
- SHA-256 digest: `5b64a04982c50acdd900604cb458f816c3a532f3235149e687a5b980cb2064cf`

The visual capture test is the reproducible source of truth. Future refactor phases must regenerate and compare these states before acceptance.

## Permanent test inventory

- `tests/unit/searchState.test.js`
- `tests/e2e/core.spec.js`
- `tests/accessibility/core-a11y.spec.js`
- `tests/visual/capture.spec.js`

## Workflow inventory

There are 23 workflow files in `.github/workflows/` at the frozen commit.

Current primary quality/deployment workflows:
- `quality.yml`
- `codeql.yml`
- `search-transition-validation.yml`
- `b225-home-validation.yml`
- `b225-home-step1-validation.yml`
- `deploy-b225-preview.yml`
- `deploy-pages-direct.yml`

Legacy phase validation workflows still present:
- `phase-0-2-validation.yml`
- `phase-3-validation.yml` through `phase-17-validation.yml`

Phase 1 will consolidate these safely; none are removed during Phase 0.

## Refactor acceptance contract

Every refactor phase must satisfy all of the following before moving on:

- No intentional visual change to approved Home/Search/Map states
- Lint passes
- Unit tests pass
- Production build passes
- E2E passes
- Axe serious/critical violations remain zero
- Lighthouse budgets pass
- CodeQL passes
- B225 Home validations pass
- Search Transition validation passes
- Runtime console/page errors remain zero on tested paths

If a phase fails these conditions, revert or correct it before continuing.

## Known safety risk recorded before Phase 1

`b225-ui-home` is currently not protected by GitHub branch protection / required status checks. The quality checks are green, but GitHub does not currently enforce them as required checks at branch level. This is recorded for the workflow/governance cleanup phase; no protection setting is changed in Phase 0.

# Phase 1 — CI consolidation

Date: 2026-08-19

## Scope

CI-only cleanup. No application UI, routes, runtime source, assets, or design tokens are intentionally changed.

## Active branch

`b225-ui-home`

## Safety baseline

Rollback branch: `backup/pre-refactor-phase0-2026-08-19`
Baseline commit: `8a8674647daafa7fd572c1ebd00e375e86dd6927`

## Consolidation rules

- `quality.yml` is the canonical cross-cutting quality gate: lint, unit, build, E2E, accessibility, visual capture and Lighthouse.
- Pull-request validation now targets the active `b225-ui-home` branch instead of the retired phase-17 branch.
- Documentation-only pushes are ignored by the canonical quality gate.
- Concurrency cancellation prevents stale quality runs from wasting CI time.
- Feature-specific Home/Search smoke gates remain separate until their detailed assertions are migrated without reducing coverage.
- Historical `phase-*` workflows are retained for audit/manual replay during this phase; they do not run on ordinary `b225-ui-home` pushes.

## Acceptance

Phase 1 is complete only after the active CI workflows for the resulting commit finish successfully. No application-source change is part of this phase.

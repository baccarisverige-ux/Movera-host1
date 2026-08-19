# Phase 8 — Final hardening / regression handoff

Status: completed — ready for phase-by-phase test campaign

## Goal
Freeze the refactor work into reversible, auditable phases before running the requested regression campaign one phase at a time.

## Final architecture
- `src/app/` — application orchestration, router and layouts.
- `src/features/home/` — Home runtime and Home-specific helpers.
- `src/features/search/` — Search transition, calendar, guests and search state/data.
- `src/features/map/` — Map page integration.
- `src/features/map-engine/` — Map rendering/viewport engine.
- `src/features/resilience/` — runtime resilience layer.
- `src/styles/` — global and B225-compatible styling with conservative token adoption.

## Refactor phases
- Phase 0: baseline and rollback point.
- Phase 1: CI / validation foundation.
- Phase 2: structural feature/router/layout migration.
- Phase 3: conservative design-token cleanup.
- Phase 4: removal of empty architectural placeholders.
- Phase 5: package and quality command hygiene.
- Phase 6: bundle-size performance guardrails.
- Phase 7: architecture regression guardrails.
- Phase 8: final hardening and test handoff.

## Safety decisions preserved
- No speculative values were assigned to undefined legacy CSS custom properties.
- B225-specific dimensions, gradients, shadows, colors and motion were not normalized merely for stylistic consistency.
- Runtime Home/Search/Map behavior was not redesigned during the refactor phases.
- Empty placeholder layers were removed instead of pretending unfinished architecture exists.
- Performance and architecture checks were implemented as tooling, not browser runtime code.

## Requested regression campaign
Test the phases in order and stop immediately at the first failure:
1. Phase 3 aggregate CSS/token result.
2. Phase 4 repository hygiene head.
3. Phase 5 package/quality commands.
4. Phase 6 bundle budget guard.
5. Phase 7 architecture guard.
6. Phase 8 final head with the complete existing Search Transition Validation + CodeQL gates.

For each phase/head verify at minimum:
- lint
- unit tests
- Vite production build
- Search transition E2E desktop
- Search transition E2E mobile/iPhone profile
- accessibility suite where configured
- CodeQL
- architecture guard when available
- bundle budget when available

## Completion rule
The refactor is not considered production-validated until every phase above passes its own regression check. A failing phase must be fixed at that phase before later heads are accepted.
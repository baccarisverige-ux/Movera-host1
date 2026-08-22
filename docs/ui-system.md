# Movera UI System

This document defines how the existing token architecture is used to produce a consistent premium interface across Guest, Account and Host features.

## Principles

1. Prefer hierarchy, spacing and typography over decoration.
2. Use one primary action per view. Secondary actions must be visually quieter.
3. Avoid stacking multiple framed cards when grouping can be expressed with spacing and dividers.
4. Interactive controls must keep at least a 44px touch target.
5. Bottom actions must respect `env(safe-area-inset-bottom)` and must never be clipped by fixed viewport assumptions.
6. Use token values from `src/styles/tokens/`; do not create feature-specific shadow/radius/color systems.
7. Motion communicates state and continuity. It must not delay interaction.
8. Respect `prefers-reduced-motion` and Motion's `reducedMotion="user"` configuration.

## Shared primitives

Use `src/shared/ui/` for reusable interface primitives:

- `Button` / `IconButton`: app-wide actions.
- `Surface` / `Card`: grouped content. Prefer `Surface` for new screens.
- `SectionHeader`: title hierarchy.
- `Stepper`: short multi-step flows such as Search and Booking.
- `Counter`: guest counts and quantity controls.
- `SearchField`: search inputs with consistent focus behavior.
- `StickyActionBar`: safe-area-aware bottom CTA area.
- `InlineMeta`: compact secondary information.
- Modal / BottomSheet / Drawer: overlays.

Feature code may compose these primitives but must not copy them into local variants unless the interaction is truly feature-specific.

## Motion

`src/shared/motion/index.jsx` is the single public motion boundary. New feature code should consume `MotionSurface`, `MotionPressable`, `moveraMotion` and `moveraVariants` rather than inventing independent spring curves.

Recommended use:

- press feedback: `MotionPressable`;
- step/view entry: `MotionSurface` with `lift` or `fade`;
- shared element or complex layout animation: use Motion directly only when the shared primitives are insufficient, while importing timing constants from the shared motion module.

Avoid motion on large map/tile surfaces unless it is GPU-safe and measured.

## Responsive contract

Layouts must work at 320, 350, 375, 390, 430, 768 and 1024px. Prefer `dvh/svh`, `clamp()`, intrinsic sizing, grid/flex and sticky action regions. Fixed heights are allowed only when the content cannot be clipped.

## Search V2 adoption order

1. Replace local step navigation with shared `Stepper`.
2. Replace guest controls with shared `Counter`.
3. Replace search input with `SearchField`.
4. Move the CTA to `StickyActionBar`.
5. Add Motion only after layout is stable.
6. Freeze visual references at target mobile sizes and validate E2E/Axe/Lighthouse.

This is an additive system. It does not replace the project's feature-first architecture.

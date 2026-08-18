# Phase 3 — Design System et UI foundation

## Tokens
Centralized CSS variables now cover brand/surface/text/border colors, radius, spacing, shadows, blur, typography, z-index, motion durations/easing and breakpoint references.

## Global styles
The Vite starter stylesheet has been replaced by `tokens.css`, `reset.css`, `globals.css`, `animations.css` and `utilities.css`. The unused starter `App.css` was removed.

## Shared UI
`src/shared/ui` provides Button, IconButton, Card, Badge, Avatar, Modal, BottomSheet, Drawer, Toast, Loader, Skeleton, EmptyState, ErrorState, SearchInput and PriceBadge. Components are presentation-only and expose explicit props rather than business logic.

## Visual contract
The baseline Movera Host screen keeps the same content and green brand direction. Inline presentation values were moved to design tokens/classes so later UI changes can be made without touching business logic.

## Gate
Phase 3 is PASS only after lint, build, runtime preview and browser visual smoke are all successful on the refactor branch.

# Phase 3 — Design tokens / CSS cleanup

Status: completed — pending final phase-by-phase regression campaign

## Safety contract
- No visual redesign.
- No behavior change.
- Only replace a literal with a token when the computed value is exactly equivalent.
- Do not activate previously undefined CSS custom properties until their historical intended values are verified.

## Existing token system
`src/styles/tokens.css` defines the base palette, spacing, radii, shadows, typography, z-index, motion and breakpoints.

## Completed safe migrations
- `globals.css`: pill radii use `--radius-pill`.
- `account.css`: exact spacing/radius/surface literals use existing tokens.
- `booking.css`: exact spacing/radius/surface literals use existing tokens; semantically incorrect radius/spacing substitution was explicitly avoided.
- `carousel.css`: exact pill/spacing/surface literals use existing tokens while gradients, blur, dimensions and timings remain untouched.
- `category-luxury-3d.css`: only the two exact pill radii were tokenized.
- `collection-card-size.css`: the exact 14px card radius uses `--radius-md`.
- `home-b225-block2.css`: only exact existing spacing and radius tokens were introduced; card dimensions, shadows, colors and the specific 24px radius remain literal.
- `accessibility.css`: the exact brand color `#2d6a4f` uses `--color-brand-700`.
- `home-b225-partner.css` and `guest-bottom-nav.css` were inspected and intentionally left unchanged because their literals are component-specific rather than safe global-token matches.

## Deferred by design
The following referenced variables remain intentionally undefined until their historical intended values can be proven without changing rendering:
- `--color-surface-1`
- `--color-surface-2`
- `--color-border-subtle`
- `--color-border-default`
- `--radius-xl`
- `--blur-md`

No speculative token values were introduced.

## Result
Phase 3 reduces literal duplication while preserving component-specific B225 styling. The runtime changes completed during this phase were individually green before the user requested that the remaining phases be executed first and tested afterward. The final regression campaign will re-test this phase as a whole.
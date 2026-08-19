# Phase 3 — Design tokens / CSS cleanup

Status: in progress

## Safety contract
- No visual redesign.
- No behavior change.
- Only replace a literal with a token when the computed value is exactly equivalent.
- Do not activate previously undefined CSS custom properties until their historical intended values are verified.
- Validate each runtime CSS edit with the existing Search Transition build/E2E gate and CodeQL.

## Existing token system
`src/styles/tokens.css` already defines the base palette, spacing, radii, shadows, typography, z-index, motion and breakpoints.

## Audit findings
The runtime styles already consume tokens heavily, but some referenced variables are not present in the current token contract. Examples observed in `globals.css` include:
- `--color-surface-1`
- `--color-surface-2`
- `--color-border-subtle`
- `--color-border-default`
- `--radius-xl`
- `--blur-md`

These are intentionally NOT added yet because assigning new values to previously undefined variables can change computed rendering. Their intended historical values must be verified first.

## First safe migration
- Replaced literal `999px` pill radii in `src/styles/globals.css` with the already-defined `--radius-pill: 999px` token.
- This is value-equivalent and should produce no visual change.

## Next safe sequence
1. Validate this exact-equivalence migration.
2. Inventory exact repeated literals in smaller CSS files.
3. Replace only exact matches with existing tokens.
4. Separately investigate undefined token references before deciding whether they are legacy/dead styles or missing definitions.
5. Keep large B225 CSS files isolated until the low-risk token layer is proven stable.
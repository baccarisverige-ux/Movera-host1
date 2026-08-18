# Phase 2 — Skeleton d’architecture

## Structure créée

- `src/app/`
  - `App.jsx`
  - `router/`
  - `providers/`
  - `config/`
  - `error-boundary/`
- `src/pages/`
- `src/features/`
- `src/entities/`
- `src/shared/`
- `src/services/`
- `src/state/`
- `src/styles/`
- `src/assets/` (déjà présent)
- `src/mocks/`
- `src/tests/`

## App entry
`src/main.jsx` reste minimal et importe maintenant `src/app/App.jsx`.

## Import strategy
Pour cette phase, stratégie conservatrice : imports relatifs courts. Aucun alias n’est introduit tant qu’un besoin réel n’est pas démontré. Les imports traversant plusieurs couches seront interdits par convention et contrôlés progressivement.

## Migration safety
Le rendu actuel de `App` est conservé fonctionnellement. Aucun redesign n’est inclus dans cette phase. L’ancien `src/App.jsx` a été retiré après redirection de l’entrée vers `src/app/App.jsx`.

## Validation requise
Avant de considérer le gate Phase 2 PASS : `npm run lint`, `npm run build`, runtime smoke et comparaison avant/après doivent être prouvés.

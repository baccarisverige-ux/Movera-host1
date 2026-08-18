# Phase 0 — Baseline

## Repository baseline
- Repository: `baccarisverige-ux/Movera-host1`
- Source of truth: GitHub
- Default branch: `main`
- Baseline commit: `6485c087c6453d42c4f8ef1ee1fdf2286ccbbc76`
- Stack: React + Vite

## Inventory classification

### KEEP
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `src/main.jsx`
- `src/App.jsx` (migrate in Phase 2)
- `src/index.css` (migrate progressively)
- `src/App.css` (review before removal)
- `src/assets/hero.png`
- `public/favicon.svg`
- `public/icons.svg`

### MIGRATE
- `src/App.jsx` -> `src/app/App.jsx`
- global styles -> `src/styles/`
- page modules -> `src/pages/`

### DELETE-LATER
- `src/assets/react.svg`
- `src/assets/vite.svg`
- starter Vite/React styling once replacements are validated
- empty `src/Pages/Contact.jsx` after confirmation it has no required behavior

## Git write verification
CRUD write verification was executed only on `audit/baseline-validation` and the temporary verification file was removed. `main` was not changed by the CRUD test.

## Runtime validation
A dedicated baseline GitHub Actions workflow exists on `audit/baseline-validation` to execute `npm ci`, `npm run lint`, `npm run build`, and an HTTP preview smoke test. Runtime/build gate remains dependent on an observed successful run.

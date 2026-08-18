# Phase 4 — App Shell, Router et Providers

## Router
Routes guest: `/`, `/map`, `/listing/:id`, `/booking/:id`, `/favorites`, `/messages`, `/messages/:id`, `/profile`, `/login`, `/register`.

Routes host: `/host`, `/host/listings`, `/host/listings/new`, `/host/listings/:id/edit`, `/host/reservations`, `/host/calendar`, `/host/earnings`, `/host/settings`.

Le routeur est centralisé dans `src/app/router/index.jsx`. Il gère les paramètres dynamiques, `history.pushState`, retour navigateur et 404 contrôlé.

## Layouts
`GuestLayout` définit header, navigation principale, safe areas iOS et zone scrollable.
`HostLayout` définit header hôte, navigation dédiée, zone scrollable et adaptation mobile.

## Providers
`AppProviders` prépare les contextes auth, app state et error handling. Aucun backend/query cache n’est introduit prématurément.

## Error boundary
`GlobalErrorBoundary` intercepte les erreurs de rendu et affiche un fallback contrôlé au lieu d’un écran blanc.

## Gate
Le workflow Phase 4 doit prouver : toutes les routes ouvrent, navigation cohérente, 404 contrôlé, error boundary testé, lint PASS et build PASS.

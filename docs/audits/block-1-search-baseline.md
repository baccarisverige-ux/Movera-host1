# Bloc 1 — Search — Baseline AVANT nettoyage

Branche live: `b225-ui-home`

## Procédure
1. E2E/UAT baseline
2. Diagnostic
3. Inventaire
4. Classement KEEP / MERGE / DELETE
5. Aucun nettoyage avant validation de cette baseline

## Live confirmé
- `src/app/App.jsx` monte exactement un `SearchTransitionHost`.
- Aucun `SearchExperience` n'est monté sur cette branche live.
- Le parcours live est `Destination → Dates → Voyageurs → Map`.

## Inventaire Search
### KEEP
- `src/features/search/SearchTransitionHost.jsx` — orchestrateur Search live
- `src/features/search/SearchCalendar.jsx` — calendrier utilisé par SearchTransitionHost
- `src/features/search/GuestSelector.jsx` — voyageurs utilisé par SearchTransitionHost
- `src/features/search/searchData.js` — données destinations
- `src/features/search/searchState.js` — état et construction du chemin Map

### MERGE — candidats de consolidation, pas de suppression immédiate
- `src/features/search/searchTransition.css`
- `src/features/search/searchTransition-stability.css`
- `src/features/search/searchTransition-premium.css`

Objectif futur: une seule source CSS Search, avec suppression progressive des overrides historiques après preuve E2E/UAT.

### DELETE — aucun fichier Search autorisé à supprimer avant preuve
Aucun fichier Search n'est classé DELETE à ce stade. Toute suppression doit être précédée d'une preuve d'absence d'import/référence puis suivie d'un E2E/UAT complet.

## Dette identifiée
- Plusieurs couches CSS Search se superposent.
- `searchTransition-stability.css` contient de nombreux `!important` et peut écraser le comportement du CSS principal.
- Les anciens overrides de hauteur ont déjà provoqué une popup surdimensionnée sur iPhone.
- Les workflows de déploiement seront traités dans le Bloc 2, pas supprimés dans ce bloc.

## Gates AVANT nettoyage
Le workflow `Live E2E UAT Cleanup Audit` doit valider:
- lint
- architecture guard
- unit tests
- production build
- audit legacy
- Search mobile E2E/UAT sur 390×844
- ouverture et fermeture
- verrouillage/déverrouillage scroll
- Destination → Dates → Voyageurs → Map

## Règle de passage
Bloc 1 ne passe en nettoyage que si la baseline est connue. Après chaque petit lot de nettoyage: build + E2E/UAT + comparaison avec cette baseline. En cas d'échec, rester dans Bloc 1 et corriger avant de continuer.

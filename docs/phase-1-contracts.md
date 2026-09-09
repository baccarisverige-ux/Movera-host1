# Phase 1 — Cartographie et contrats

## 1. Domain ownership

### Guest
Home, Search, Categories, Map, Listings, Favorites, Booking, Messages, Profile, Auth.

### Host
Dashboard, Listings, Listing Editor, Reservations, Calendar, Earnings, Settings.

### Platform
Router, Providers, Config, State ownership, Services, Error handling, Analytics.

### Quality
Lint, Build, Unit, Integration, E2E, Visual, Performance, Accessibility.

### Release
GitHub, CI, StackBlitz preview, staging, Vercel production, rollback.

Rule: every feature has one primary owner. Cross-domain calls must pass through explicit contracts/services rather than direct imports between unrelated feature internals.

## 2. Dependency map

Official guest critical chain:
`Search -> Results -> Map -> Selection -> Carousel -> Detail -> Booking`

Supporting chains:
- `Home -> Listing -> Favorite -> Favorites -> Listing`
- `Map -> Marker A/B -> Carousel -> Detail -> Back -> preserved viewport/selection`
- `Auth -> session -> protected area -> logout`
- `Host Dashboard -> Listings -> Create/Edit -> Save -> Reservations`
- `Host Reservations -> Calendar -> Earnings`

Forbidden dependencies:
- map engine must not depend on booking internals;
- carousel presentation must not own map viewport state;
- pages must not become data stores;
- shared UI must not import feature business logic;
- entities must not import pages;
- no duplicate navigation path for the same user journey.

## 3. Routing contract

Public routes:
- `/`
- `/map`
- `/listing/:id`
- `/booking/:id`
- `/favorites`
- `/messages`
- `/messages/:id`
- `/profile`
- `/login`
- `/register`

Host routes:
- `/host`
- `/host/listings`
- `/host/listings/new`
- `/host/listings/:id/edit`
- `/host/reservations`
- `/host/calendar`
- `/host/earnings`
- `/host/settings`

Navigation rules:
- listing identity uses URL parameter `:id`;
- map viewport/filters may be encoded in query state when persistence/deep-linking is required;
- back from listing detail reached from map must restore map viewport and selected listing;
- legacy parallel routes are prohibited once the official route is validated.

## 4. Data contracts

### Listing
Required: `id`, `title`, `location`, `coordinates`, `nightlyRate`, `currency`, `images`, `status`.
Optional: `rating`, `reviewCount`, `amenities`, `hostId`, `category`, `badges`, `description`.
Defaults: arrays are `[]`; nullable presentation metadata is `null`.

### User
Required: `id`, `name`.
Optional: `avatar`, `email`, `phone`, `role`, `preferences`.

### Booking
Required: `id`, `listingId`, `guestId`, `checkIn`, `checkOut`, `guestCount`, `status`, `pricing`.

### Message
Required: `id`, `conversationId`, `senderId`, `body`, `createdAt`.
Optional: `attachments`, `readAt`.

### HostReservation
Required: `id`, `listingId`, `guestId`, `checkIn`, `checkOut`, `status`, `total`.

### Availability
Required: `listingId`, `date`, `status`.
Optional: `priceOverride`, `minimumStay`.

Mocks must use these shapes and remain compatible with future API adapters.

## 5. State contract

### URL state
Route, listing ID, message ID, shareable filters, optional map viewport/query state.

### Global application state
Authentication/session, cross-page favorites, globally selected locale/currency/preferences.

### Local feature/component state
Modal open state, carousel dragging state, image index, transient form UI state.

### Persistent client state
Explicitly approved preferences and non-sensitive local cache only.

### Server cache
Remote listings, availability, bookings, messages, host data once backend/query layer is introduced.

Rule: one information item has one authoritative source of truth. Derived values are computed, not duplicated into competing stores.

## Critical-path acceptance
The critical paths above are the canonical journeys for later integration and E2E testing. Any alternate hidden/legacy route that bypasses these contracts must be removed only after the replacement is proven.

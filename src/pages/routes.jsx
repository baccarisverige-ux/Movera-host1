import { CarouselLab } from '../features/carousel/CarouselShell.jsx'
import { MapContainer } from '../features/map-engine/MapContainer.jsx'
import { HomePage } from './Home/HomePage.jsx'

function PageFrame({ eyebrow, title, description, testId }) {
  return (
    <section className="route-page" data-testid={testId}>
      <p className="route-page__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function MapPage() {
  return (
    <section className="route-page route-page--map" data-testid="page-map">
      <p className="route-page__eyebrow">Guest</p>
      <h1>Explorer la carte</h1>
      <MapContainer />
    </section>
  )
}
function ListingPage({ params }) {
  return <PageFrame eyebrow="Guest" title={`Annonce ${params.id}`} description="Shell du détail annonce." testId="page-listing" />
}
function BookingPage({ params }) {
  return <PageFrame eyebrow="Guest" title={`Réservation ${params.id}`} description="Shell du parcours réservation." testId="page-booking" />
}
function FavoritesPage() {
  return <PageFrame eyebrow="Guest" title="Favoris" description="Shell des favoris." testId="page-favorites" />
}
function MessagesPage({ params }) {
  const title = params.id ? `Conversation ${params.id}` : 'Messages'
  return <PageFrame eyebrow="Guest" title={title} description="Shell de la messagerie." testId="page-messages" />
}
function ProfilePage() {
  return <PageFrame eyebrow="Guest" title="Profil" description="Shell du profil." testId="page-profile" />
}
function LoginPage() {
  return <PageFrame eyebrow="Auth" title="Connexion" description="Shell de connexion." testId="page-login" />
}
function RegisterPage() {
  return <PageFrame eyebrow="Auth" title="Créer un compte" description="Shell d’inscription." testId="page-register" />
}
function HostDashboardPage() {
  return <PageFrame eyebrow="Host" title="Tableau de bord" description="Shell du dashboard hôte." testId="page-host" />
}
function HostListingsPage() {
  return <PageFrame eyebrow="Host" title="Mes annonces" description="Shell de gestion des annonces." testId="page-host-listings" />
}
function HostListingCreatePage() {
  return <PageFrame eyebrow="Host" title="Nouvelle annonce" description="Shell de création d’annonce." testId="page-host-listing-new" />
}
function HostListingEditPage({ params }) {
  return <PageFrame eyebrow="Host" title={`Modifier ${params.id}`} description="Shell d’édition d’annonce." testId="page-host-listing-edit" />
}
function HostReservationsPage() {
  return <PageFrame eyebrow="Host" title="Réservations" description="Shell des réservations hôte." testId="page-host-reservations" />
}
function HostCalendarPage() {
  return <PageFrame eyebrow="Host" title="Calendrier" description="Shell du calendrier hôte." testId="page-host-calendar" />
}
function HostEarningsPage() {
  return <PageFrame eyebrow="Host" title="Revenus" description="Shell des revenus hôte." testId="page-host-earnings" />
}
function HostSettingsPage() {
  return <PageFrame eyebrow="Host" title="Paramètres" description="Shell des paramètres hôte." testId="page-host-settings" />
}

export function NotFoundPage({ onNavigate }) {
  return (
    <main className="not-found" data-testid="page-404">
      <p className="route-page__eyebrow">404</p>
      <h1>Page introuvable</h1>
      <p>Cette route n’existe pas dans Movera Host.</p>
      <button className="route-link-button" type="button" onClick={() => onNavigate('/')}>Retour à l’accueil</button>
    </main>
  )
}

export const routeDefinitions = [
  { path: '/', area: 'guest', component: HomePage },
  { path: '/map', area: 'guest', component: MapPage },
  { path: '/carousel-lab', area: 'guest', component: CarouselLab },
  { path: '/listing/:id', area: 'guest', component: ListingPage },
  { path: '/booking/:id', area: 'guest', component: BookingPage },
  { path: '/favorites', area: 'guest', component: FavoritesPage },
  { path: '/messages', area: 'guest', component: MessagesPage },
  { path: '/messages/:id', area: 'guest', component: MessagesPage },
  { path: '/profile', area: 'guest', component: ProfilePage },
  { path: '/login', area: 'guest', component: LoginPage },
  { path: '/register', area: 'guest', component: RegisterPage },
  { path: '/host', area: 'host', component: HostDashboardPage },
  { path: '/host/listings', area: 'host', component: HostListingsPage },
  { path: '/host/listings/new', area: 'host', component: HostListingCreatePage },
  { path: '/host/listings/:id/edit', area: 'host', component: HostListingEditPage },
  { path: '/host/reservations', area: 'host', component: HostReservationsPage },
  { path: '/host/calendar', area: 'host', component: HostCalendarPage },
  { path: '/host/earnings', area: 'host', component: HostEarningsPage },
  { path: '/host/settings', area: 'host', component: HostSettingsPage },
]

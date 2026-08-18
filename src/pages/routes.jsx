import { BookingPage } from '../features/booking/BookingPage.jsx'
import { CarouselLab } from '../features/carousel/CarouselShell.jsx'
import { GestureLab } from '../features/carousel/GestureLab.jsx'
import { ListingDetailPage } from '../features/listing-detail/ListingDetailPage.jsx'
import { MapCarouselPage } from '../features/map-carousel/MapCarouselPage.jsx'
import { HomePage } from './Home/HomePage.jsx'

function PageFrame({ eyebrow, title, description, testId }) {
  return <section className="route-page" data-testid={testId}><p className="route-page__eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></section>
}

const FavoritesPage = () => <PageFrame eyebrow="Guest" title="Favoris" description="Shell des favoris." testId="page-favorites" />
const MessagesPage = ({ params }) => <PageFrame eyebrow="Guest" title={params.id ? `Conversation ${params.id}` : 'Messages'} description="Shell de la messagerie." testId="page-messages" />
const ProfilePage = () => <PageFrame eyebrow="Guest" title="Profil" description="Shell du profil." testId="page-profile" />
const LoginPage = () => <PageFrame eyebrow="Auth" title="Connexion" description="Shell de connexion." testId="page-login" />
const RegisterPage = () => <PageFrame eyebrow="Auth" title="Créer un compte" description="Shell d’inscription." testId="page-register" />
const HostDashboardPage = () => <PageFrame eyebrow="Host" title="Tableau de bord" description="Shell du dashboard hôte." testId="page-host" />
const HostListingsPage = () => <PageFrame eyebrow="Host" title="Mes annonces" description="Shell de gestion des annonces." testId="page-host-listings" />
const HostListingCreatePage = () => <PageFrame eyebrow="Host" title="Nouvelle annonce" description="Shell de création d’annonce." testId="page-host-listing-new" />
const HostListingEditPage = ({ params }) => <PageFrame eyebrow="Host" title={`Modifier ${params.id}`} description="Shell d’édition d’annonce." testId="page-host-listing-edit" />
const HostReservationsPage = () => <PageFrame eyebrow="Host" title="Réservations" description="Shell des réservations hôte." testId="page-host-reservations" />
const HostCalendarPage = () => <PageFrame eyebrow="Host" title="Calendrier" description="Shell du calendrier hôte." testId="page-host-calendar" />
const HostEarningsPage = () => <PageFrame eyebrow="Host" title="Revenus" description="Shell des revenus hôte." testId="page-host-earnings" />
const HostSettingsPage = () => <PageFrame eyebrow="Host" title="Paramètres" description="Shell des paramètres hôte." testId="page-host-settings" />

export function NotFoundPage({ onNavigate }) {
  return <main className="not-found" data-testid="page-404"><p className="route-page__eyebrow">404</p><h1>Page introuvable</h1><p>Cette route n’existe pas dans Movera Host.</p><button className="route-link-button" type="button" onClick={() => onNavigate('/')}>Retour à l’accueil</button></main>
}

export const routeDefinitions = [
  { path: '/', area: 'guest', component: HomePage },
  { path: '/map', area: 'guest', component: MapCarouselPage },
  { path: '/carousel-lab', area: 'guest', component: CarouselLab },
  { path: '/gesture-lab', area: 'guest', component: GestureLab },
  { path: '/listing/:id', area: 'guest', component: ListingDetailPage },
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

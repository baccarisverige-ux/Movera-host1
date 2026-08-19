import { lazy } from 'react'
import { HomePage } from '../features/home/HomePage.jsx'

const lazyNamed = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })))

const BookingPage = lazyNamed(() => import('../features/booking/BookingPage.jsx'), 'BookingPage')
const CarouselLab = lazyNamed(() => import('../features/carousel/CarouselShell.jsx'), 'CarouselLab')
const GestureLab = lazyNamed(() => import('../features/carousel/GestureLab.jsx'), 'GestureLab')
const ListingDetailPage = lazyNamed(() => import('../features/listing-detail/ListingDetailPage.jsx'), 'ListingDetailPage')
const MapPage = lazyNamed(() => import('../features/map/MapPage.jsx'), 'MapPage')
const FavoritesPage = lazyNamed(() => import('../features/account/AccountPages.jsx'), 'FavoritesPage')
const ForgotPasswordPage = lazyNamed(() => import('../features/account/AccountPages.jsx'), 'ForgotPasswordPage')
const LoginPage = lazyNamed(() => import('../features/account/AccountPages.jsx'), 'LoginPage')
const ProfilePage = lazyNamed(() => import('../features/account/AccountPages.jsx'), 'ProfilePage')
const RegisterPage = lazyNamed(() => import('../features/account/AccountPages.jsx'), 'RegisterPage')
const MessagesPage = lazyNamed(() => import('../features/messages/MessagesPage.jsx'), 'MessagesPage')
const HostDashboardPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostDashboardPage')
const HostListingsPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostListingsPage')
const HostListingCreatePage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostListingCreatePage')
const HostListingEditPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostListingEditPage')
const HostReservationsPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostReservationsPage')
const HostCalendarPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostCalendarPage')
const HostEarningsPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostEarningsPage')
const HostSettingsPage = lazyNamed(() => import('../features/host/HostPages.jsx'), 'HostSettingsPage')
const ResilienceLab = lazyNamed(() => import('../features/resilience/ResilienceLab.jsx'), 'ResilienceLab')

export function NotFoundPage({onNavigate}){return <main className="not-found" data-testid="page-404"><p className="route-page__eyebrow">404</p><h1>Page introuvable</h1><p>Cette route n’existe pas dans Movera Host.</p><button className="route-link-button" onClick={()=>onNavigate('/')}>Retour à l’accueil</button></main>}
export const routeDefinitions=[
{path:'/',area:'guest',component:HomePage},{path:'/map',area:'guest',component:MapPage},{path:'/carousel-lab',area:'guest',component:CarouselLab},{path:'/gesture-lab',area:'guest',component:GestureLab},{path:'/resilience-lab',area:'guest',component:ResilienceLab},{path:'/listing/:id',area:'guest',component:ListingDetailPage},{path:'/booking/:id',area:'guest',component:BookingPage},{path:'/favorites',area:'guest',component:FavoritesPage},{path:'/messages',area:'guest',component:MessagesPage,protected:true},{path:'/messages/:id',area:'guest',component:MessagesPage,protected:true},{path:'/profile',area:'guest',component:ProfilePage,protected:true},{path:'/login',area:'guest',component:LoginPage},{path:'/register',area:'guest',component:RegisterPage},{path:'/forgot-password',area:'guest',component:ForgotPasswordPage},
{path:'/host',area:'host',component:HostDashboardPage},{path:'/host/listings',area:'host',component:HostListingsPage},{path:'/host/listings/new',area:'host',component:HostListingCreatePage},{path:'/host/listings/:id/edit',area:'host',component:HostListingEditPage},{path:'/host/reservations',area:'host',component:HostReservationsPage},{path:'/host/calendar',area:'host',component:HostCalendarPage},{path:'/host/earnings',area:'host',component:HostEarningsPage},{path:'/host/settings',area:'host',component:HostSettingsPage}]

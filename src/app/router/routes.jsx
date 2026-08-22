import { lazy } from 'react'
import { HomePage } from '../../features/home/HomePage.jsx'
import { BeachPage } from '../../features/beach/BeachPage.jsx'
import { GuestHousePage } from '../../features/guesthouse/GuestHousePage.jsx'

const lazyNamed = (loader, name) => lazy(() => loader().then(module => ({ default: module[name] })))
const CarouselLab = lazyNamed(() => import('../../features/carousel/CarouselShell.jsx'), 'CarouselLab')
const GestureLab = lazyNamed(() => import('../../features/carousel/GestureLab.jsx'), 'GestureLab')
const MapPage = lazyNamed(() => import('../../features/map/MapPage.jsx'), 'MapPage')
const ResilienceLab = lazyNamed(() => import('../../features/resilience/ResilienceLab.jsx'), 'ResilienceLab')

export function NotFoundPage({ onNavigate }) { return <main className="not-found" data-testid="page-404"><p className="route-page__eyebrow">404</p><h1>Page introuvable</h1><p>Cette route n’existe pas dans Movera Host.</p><button className="route-link-button" onClick={() => onNavigate('/')}>Retour à l’accueil</button></main> }
export const routeDefinitions = [
  { path: '/', area: 'guest', component: HomePage },
  { path: '/plage', area: 'guest', component: BeachPage },
  { path: '/maison-d-hote', area: 'guest', component: GuestHousePage },
  { path: '/map', area: 'guest', component: MapPage },
  { path: '/carousel-lab', area: 'guest', component: CarouselLab },
  { path: '/gesture-lab', area: 'guest', component: GestureLab },
  { path: '/resilience-lab', area: 'guest', component: ResilienceLab },
]

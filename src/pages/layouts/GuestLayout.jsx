import { AppShell } from '../../shared/ui/index.jsx'

const guestNav = [
  ['Accueil', '/'],
  ['Carte', '/map'],
  ['Favoris', '/favorites'],
  ['Messages', '/messages'],
  ['Profil', '/profile'],
]

export function GuestLayout({ children, currentPath, onNavigate }) {
  return <AppShell mode="guest" brand="Movera Host" switchLabel="Mode hôte" switchHref="/host" navigation={guestNav} navLabel="Navigation principale" currentPath={currentPath} onNavigate={onNavigate}>{children}</AppShell>
}

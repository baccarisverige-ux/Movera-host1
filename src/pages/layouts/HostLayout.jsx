import { AppShell } from '../../shared/ui/index.jsx'

const hostNav = [
  ['Dashboard', '/host'],
  ['Annonces', '/host/listings'],
  ['Réservations', '/host/reservations'],
  ['Calendrier', '/host/calendar'],
  ['Revenus', '/host/earnings'],
  ['Paramètres', '/host/settings'],
]

export function HostLayout({ children, currentPath, onNavigate }) {
  return <AppShell mode="host" brand="Movera Host · Hôte" switchLabel="Mode voyageur" switchHref="/" navigation={hostNav} navLabel="Navigation hôte" currentPath={currentPath} onNavigate={onNavigate}>{children}</AppShell>
}

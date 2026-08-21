import { HostShell } from '../components/HostShell.jsx'
import { HOST_RESERVATIONS } from '../model/hostData.js'
import { useHostListings } from '../model/useHostListings.js'

export function HostDashboardPage({ onNavigate }) {
  const [items] = useHostListings(); const active = items.filter(item => item.status === 'active').length
  return <HostShell title="Tableau de bord" testId="page-host"><div className="host-kpis"><article data-testid="host-kpi-listings"><strong>{active}</strong><span>Annonces actives</span></article><article><strong>{HOST_RESERVATIONS.filter(r => r.status === 'confirmed').length}</strong><span>Réservations confirmées</span></article><article><strong>1 420 TND</strong><span>Revenus période</span></article></div><section className="host-panel" data-testid="host-upcoming"><h2>Prochaines réservations</h2>{HOST_RESERVATIONS.slice(0, 2).map(r => <p key={r.id}>{r.guest} · {r.date} · {r.status}</p>)}</section><section className="host-panel" data-testid="host-alerts"><h2>Alertes</h2><p>1 demande de réservation à traiter.</p></section><button onClick={() => onNavigate('/host/listings')}>Gérer mes annonces</button></HostShell>
}

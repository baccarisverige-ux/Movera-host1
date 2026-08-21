import { HostShell } from '../components/HostShell.jsx'
import { HOST_RESERVATIONS } from '../model/hostData.js'
export function HostReservationsPage() { return <HostShell title="Réservations" testId="page-host-reservations"><div className="host-status-grid">{['pending', 'confirmed', 'completed', 'cancelled'].map(status => <section className="host-panel" key={status} data-testid={`reservation-${status}`}><h2>{status}</h2>{HOST_RESERVATIONS.filter(r => r.status === status).map(r => <p key={r.id}>{r.guest} · {r.listing} · {r.date}</p>)}</section>)}</div></HostShell> }

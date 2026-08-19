import { ListingForm } from '../components/ListingForm.jsx'
import { HostShell } from '../components/HostShell.jsx'
import { useHostListings } from '../model/useHostListings.js'
export function HostListingEditPage({ params, onNavigate }) { const [items, setItems] = useHostListings(); const item = items.find(entry => entry.id === params.id); if (!item) return <HostShell title="Annonce introuvable" testId="host-listing-missing"><button onClick={() => onNavigate('/host/listings')}>Retour</button></HostShell>; return <ListingForm initial={item} title={`Modifier ${item.title}`} testId="page-host-listing-edit" onSave={data => { setItems(items.map(entry => entry.id === item.id ? { ...entry, ...data } : entry)); onNavigate('/host/listings') }} /> }

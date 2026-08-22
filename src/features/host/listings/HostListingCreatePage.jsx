import { ListingForm } from '../components/ListingForm.jsx'
import { useHostListings } from '../model/useHostListings.js'
export function HostListingCreatePage({ onNavigate }) { const [items, setItems] = useHostListings(); return <ListingForm title="Nouvelle annonce" testId="page-host-listing-new" onSave={data => { const id = `listing-${Date.now()}`; setItems([...items, { id, ...data, status: 'active' }]); onNavigate('/host/listings') }} /> }

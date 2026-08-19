import { useState } from 'react'
import { HostShell } from '../components/HostShell.jsx'
export function HostSettingsPage() { const [instant, setInstant] = useState(false); return <HostShell title="Paramètres" testId="page-host-settings"><section className="host-panel"><h2>Préférences hôte</h2><label><input type="checkbox" checked={instant} onChange={e => setInstant(e.target.checked)} /> Réservation instantanée</label></section></HostShell> }

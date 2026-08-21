import { useState } from 'react'
import { HostShell } from './HostShell.jsx'

export function ListingForm({ initial, onSave, title, testId }) {
  const [name, setName] = useState(initial?.title || '')
  const [price, setPrice] = useState(initial?.price || '')
  const [error, setError] = useState('')
  const submit = event => { event.preventDefault(); if (name.trim().length < 3 || Number(price) <= 0) { setError('Titre et prix valides requis.'); return } onSave({ title: name.trim(), price: Number(price) }) }
  return <HostShell title={title} testId={testId}><form className="host-form" onSubmit={submit}><label>Titre<input aria-label="Titre" value={name} onChange={e => setName(e.target.value)} /></label><label>Prix par nuit<input aria-label="Prix par nuit" type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>{error && <p role="alert">{error}</p>}<button type="submit">Enregistrer</button></form></HostShell>
}

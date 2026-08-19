import { useMemo, useState } from 'react'
import { getListingDetail } from '../listing-detail/listingDetailData.js'
import { calculateBookingTotal, nightsBetween, validateBooking } from './bookingEngine.js'
import '../../styles/booking.css'

function dateInputFromToday(days) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function BookingPage({ params, onNavigate }) {
  const listing = getListingDetail(params.id)
  const fromMap = new URLSearchParams(window.location.search).get('from') === 'map'
  const detailReturnPath = fromMap ? `/listing/${params.id}?from=map` : `/listing/${params.id}`
  const mapReturnPath = fromMap ? '/map?restore=1' : '/map'
  const [checkIn, setCheckIn] = useState(() => dateInputFromToday(1))
  const [checkOut, setCheckOut] = useState(() => dateInputFromToday(3))
  const [guests, setGuests] = useState(2)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [scenario, setScenario] = useState('success')

  const nights = nightsBetween(checkIn, checkOut)
  const pricing = useMemo(() => calculateBookingTotal({ nightlyRate: listing?.nightlyRate || 0, nights, fees: listing?.fees || 0, discounts: nights >= 7 ? 25 : 0 }), [listing, nights])

  if (!listing) {
    return <section className="booking-page" data-testid="booking-missing"><h1>Annonce indisponible</h1><button type="button" onClick={() => onNavigate(mapReturnPath)}>Retour à la carte</button></section>
  }

  const submit = async () => {
    if (status === 'submitting') return
    setError('')
    const validation = validateBooking({ checkIn, checkOut, guests })
    if (!validation.ok) { setError(validation.message); setStatus('error'); return }
    if (scenario === 'unavailable') { setError('Ces dates ne sont plus disponibles.'); setStatus('error'); return }
    if (scenario === 'session') { setError('Votre session a expiré. Reconnectez-vous.'); setStatus('error'); return }
    setStatus('submitting')
    await new Promise((resolve) => setTimeout(resolve, 120))
    if (scenario === 'network') { setError('Erreur réseau. Réessayez.'); setStatus('error'); return }
    setConfirmation({ id: `MH-${params.id}-${Date.now()}`, total: pricing.total })
    setStatus('confirmed')
  }

  return (
    <section className="booking-page" data-testid="page-booking" data-booking-status={status}>
      <header><p className="route-page__eyebrow">Guest · Booking</p><h1>Réserver {listing.title}</h1><p>{listing.location}</p></header>
      <div className="booking-grid">
        <section className="booking-card" data-testid="booking-dates"><h2>Dates</h2><label>Arrivée<input aria-label="Arrivée" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label><label>Départ<input aria-label="Départ" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label></section>
        <section className="booking-card" data-testid="booking-guests"><h2>Voyageurs</h2><label>Nombre<input aria-label="Voyageurs" type="number" min="1" max="6" value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></label></section>
        <section className="booking-card" data-testid="booking-summary"><h2>Résumé</h2><p>{listing.nightlyRate} {listing.currency} × {nights} nuit(s)</p><p>Frais : {pricing.fees} {listing.currency}</p><p>Réduction : {pricing.discounts} {listing.currency}</p><strong>Total : {pricing.total} {listing.currency}</strong></section>
        {import.meta.env.DEV ? <section className="booking-card booking-card--test" aria-label="Scénario de validation"><label>Scénario<select aria-label="Scénario" value={scenario} onChange={(e) => setScenario(e.target.value)}><option value="success">Succès</option><option value="unavailable">Indisponible</option><option value="network">Réseau</option><option value="session">Session expirée</option></select></label></section> : null}
      </div>
      {error ? <p className="booking-error" role="alert" data-testid="booking-error">{error}</p> : null}
      {confirmation ? <div className="booking-confirmation" data-testid="booking-confirmation"><strong>Réservation confirmée</strong><span>{confirmation.id}</span><span>{confirmation.total} {listing.currency}</span></div> : null}
      <div className="booking-actions"><button type="button" onClick={() => onNavigate(detailReturnPath)}>Retour au détail</button><button type="button" data-testid="booking-submit" disabled={status === 'submitting' || status === 'confirmed'} onClick={submit}>{status === 'submitting' ? 'Confirmation…' : status === 'confirmed' ? 'Confirmée' : 'Confirmer la réservation'}</button></div>
    </section>
  )
}

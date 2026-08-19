import { useMemo, useState } from 'react'
import { getListingDetail } from '../listing-detail/listingDetailData.js'
import { BookingInputs, BookingScenario, BookingSummary } from './components/BookingSections.jsx'
import { calculateBookingTotal, nightsBetween, validateBooking } from './bookingEngine.js'
import { dateInputFromToday } from './model/dateUtils.js'
import '../../styles/booking.css'

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
  if (!listing) return <section className="booking-page" data-testid="booking-missing"><h1>Annonce indisponible</h1><button type="button" onClick={()=>onNavigate(mapReturnPath)}>Retour à la carte</button></section>
  const submit = async () => {
    if (status === 'submitting') return
    setError('')
    const validation = validateBooking({ checkIn, checkOut, guests })
    if (!validation.ok) { setError(validation.message); setStatus('error'); return }
    if (scenario === 'unavailable') { setError('Ces dates ne sont plus disponibles.'); setStatus('error'); return }
    if (scenario === 'session') { setError('Votre session a expiré. Reconnectez-vous.'); setStatus('error'); return }
    setStatus('submitting')
    await new Promise(resolve=>setTimeout(resolve,120))
    if (scenario === 'network') { setError('Erreur réseau. Réessayez.'); setStatus('error'); return }
    setConfirmation({ id:`MH-${params.id}-${Date.now()}`, total:pricing.total }); setStatus('confirmed')
  }
  return <section className="booking-page" data-testid="page-booking" data-booking-status={status}><header><p className="route-page__eyebrow">Guest · Booking</p><h1>Réserver {listing.title}</h1><p>{listing.location}</p></header><div className="booking-grid"><BookingInputs checkIn={checkIn} checkOut={checkOut} guests={guests} onCheckIn={setCheckIn} onCheckOut={setCheckOut} onGuests={setGuests}/><BookingSummary listing={listing} nights={nights} pricing={pricing}/><BookingScenario scenario={scenario} onChange={setScenario}/></div>{error?<p className="booking-error" role="alert" data-testid="booking-error">{error}</p>:null}{confirmation?<div className="booking-confirmation" data-testid="booking-confirmation"><strong>Réservation confirmée</strong><span>{confirmation.id}</span><span>{confirmation.total} {listing.currency}</span></div>:null}<div className="booking-actions"><button type="button" onClick={()=>onNavigate(detailReturnPath)}>Retour au détail</button><button type="button" data-testid="booking-submit" disabled={status==='submitting'||status==='confirmed'} onClick={submit}>{status==='submitting'?'Confirmation…':status==='confirmed'?'Confirmée':'Confirmer la réservation'}</button></div></section>
}

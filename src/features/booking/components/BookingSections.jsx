export function BookingInputs({ checkIn, checkOut, guests, onCheckIn, onCheckOut, onGuests }) {
  return <><section className="booking-card" data-testid="booking-dates"><h2>Dates</h2><label>Arrivée<input aria-label="Arrivée" type="date" value={checkIn} onChange={(e)=>onCheckIn(e.target.value)}/></label><label>Départ<input aria-label="Départ" type="date" value={checkOut} onChange={(e)=>onCheckOut(e.target.value)}/></label></section><section className="booking-card" data-testid="booking-guests"><h2>Voyageurs</h2><label>Nombre<input aria-label="Voyageurs" type="number" min="1" max="6" value={guests} onChange={(e)=>onGuests(Number(e.target.value))}/></label></section></>
}

export function BookingSummary({ listing, nights, pricing }) {
  return <section className="booking-card" data-testid="booking-summary"><h2>Résumé</h2><p>{listing.nightlyRate} {listing.currency} × {nights} nuit(s)</p><p>Frais : {pricing.fees} {listing.currency}</p><p>Réduction : {pricing.discounts} {listing.currency}</p><strong>Total : {pricing.total} {listing.currency}</strong></section>
}

export function BookingScenario({ scenario, onChange }) {
  if (!import.meta.env.DEV) return null
  return <section className="booking-card booking-card--test" aria-label="Scénario de validation"><label>Scénario<select aria-label="Scénario" value={scenario} onChange={(e)=>onChange(e.target.value)}><option value="success">Succès</option><option value="unavailable">Indisponible</option><option value="network">Réseau</option><option value="session">Session expirée</option></select></label></section>
}

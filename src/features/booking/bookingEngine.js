const MS_DAY = 86400000

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const start = new Date(`${checkIn}T00:00:00Z`)
  const end = new Date(`${checkOut}T00:00:00Z`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  return Math.max(0, Math.round((end - start) / MS_DAY))
}

export function calculateBookingTotal({ nightlyRate, nights, fees = 0, discounts = 0 }) {
  const safeNights = Math.max(0, Number(nights) || 0)
  const subtotal = (Number(nightlyRate) || 0) * safeNights
  const total = Math.max(0, subtotal + (Number(fees) || 0) - (Number(discounts) || 0))
  return {
    nightlyRate: Number(nightlyRate) || 0,
    nights: safeNights,
    subtotal: Math.round(subtotal * 100) / 100,
    fees: Math.round((Number(fees) || 0) * 100) / 100,
    discounts: Math.round((Number(discounts) || 0) * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function validateBooking({ checkIn, checkOut, guests, maxGuests = 6 }) {
  const nights = nightsBetween(checkIn, checkOut)
  if (!checkIn || !checkOut) return { ok: false, code: 'dates-required', message: 'Sélectionnez les dates.' }
  if (nights <= 0) return { ok: false, code: 'invalid-dates', message: 'La date de départ doit être après l’arrivée.' }
  const guestCount = Number(guests) || 0
  if (guestCount < 1) return { ok: false, code: 'guests-required', message: 'Ajoutez au moins un voyageur.' }
  if (guestCount > maxGuests) return { ok: false, code: 'too-many-guests', message: `Maximum ${maxGuests} voyageurs.` }
  return { ok: true, code: 'valid', message: '', nights }
}

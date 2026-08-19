export const SEARCH_STEPS = Object.freeze(['destination', 'dates', 'guests'])

export function createSearchState() {
  return {
    destination: null,
    checkin: '',
    checkout: '',
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  }
}

export function isDateRangeValid(checkin, checkout) {
  if (!checkin || !checkout) return false
  const start = new Date(`${checkin}T12:00:00`).getTime()
  const end = new Date(`${checkout}T12:00:00`).getTime()
  return Number.isFinite(start) && Number.isFinite(end) && end > start
}

export function totalTravellers(state) {
  return Math.max(1, Number(state.adults) || 1) + Math.max(0, Number(state.children) || 0)
}

export function buildMapSearchPath(state) {
  const params = new URLSearchParams()
  if (state.destination?.id) params.set('destination', state.destination.id)
  if (state.checkin) params.set('checkin', state.checkin)
  if (state.checkout) params.set('checkout', state.checkout)
  params.set('guests', String(totalTravellers(state)))
  params.set('adults', String(Math.max(1, Number(state.adults) || 1)))
  params.set('children', String(Math.max(0, Number(state.children) || 0)))
  params.set('infants', String(Math.max(0, Number(state.infants) || 0)))
  params.set('pets', String(Math.max(0, Number(state.pets) || 0)))
  params.set('search', '1')
  return `/map?${params.toString()}`
}

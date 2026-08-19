export const SEARCH_STEPS = Object.freeze(['destination', 'dates', 'guests'])

export function createSearchState() {
  return {
    destination: null,
    checkin: '',
    checkout: '',
    adults: 1,
  }
}

export function isDateRangeValid(checkin, checkout) {
  if (!checkin || !checkout) return false
  return new Date(`${checkout}T12:00:00`).getTime() >= new Date(`${checkin}T12:00:00`).getTime()
}

export function buildMapSearchPath(state) {
  const params = new URLSearchParams()
  if (state.destination?.id) params.set('destination', state.destination.id)
  if (state.checkin) params.set('checkin', state.checkin)
  if (state.checkout) params.set('checkout', state.checkout)
  params.set('guests', String(state.adults || 1))
  params.set('search', '1')
  return `/map?${params.toString()}`
}

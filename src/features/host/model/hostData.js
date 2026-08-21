export const DEFAULT_HOST_LISTINGS = Object.freeze([
  { id: 'marsa-sea', title: 'La Marsa · Vue mer', price: 180, status: 'active' },
  { id: 'carthage-suite', title: 'Carthage · Suite', price: 240, status: 'active' },
])

export const HOST_RESERVATIONS = Object.freeze([
  { id: 'R-101', guest: 'Amine', listing: 'La Marsa · Vue mer', status: 'confirmed', date: '20–22 août' },
  { id: 'R-102', guest: 'Sarah', listing: 'Carthage · Suite', status: 'pending', date: '25–28 août' },
  { id: 'R-103', guest: 'Nadia', listing: 'La Marsa · Vue mer', status: 'completed', date: '10–12 août' },
  { id: 'R-104', guest: 'Yassine', listing: 'Carthage · Suite', status: 'cancelled', date: '5–7 août' },
])

import { LISTING_DETAILS } from '../../entities/listing/listingCatalog.js'

export const MAP_PROPERTY_FILTERS = Object.freeze([
  { id: 'apartment', label: 'Appartement' },
  { id: 'villa', label: 'Villa' },
  { id: 'hotel', label: 'Hôtel' },
  { id: 'guesthouse', label: 'Maison d’hôte' },
  { id: 'beach', label: 'Plage' },
])

export const MAP_AMENITY_FILTERS = Object.freeze([
  { id: 'wifi', label: 'Wi‑Fi' },
  { id: 'pool', label: 'Piscine' },
  { id: 'parking', label: 'Parking' },
  { id: 'ac', label: 'Clim' },
  { id: 'pet', label: 'Animaux' },
])

const MAP_PROPERTY_TAGS = Object.freeze({
  'villa-perle': ['villa', 'beach'],
  'maison-bleue': ['hotel', 'guesthouse'],
  'res-carthage': ['apartment'],
  'villa-emeraude': ['villa', 'beach'],
  'loft-cote': ['apartment', 'beach'],
  'villa-jasmin': ['villa'],
  'dar-sidi': ['guesthouse'],
  'riad-marsa': ['guesthouse', 'beach'],
})

const PET_FRIENDLY_LISTING_IDS = new Set(['villa-jasmin', 'riad-marsa'])

const AMENITY_MATCHERS = Object.freeze({
  wifi: (amenities) => amenities.includes('Wi‑Fi'),
  pool: (amenities) => amenities.includes('Piscine'),
  parking: (amenities) => amenities.includes('Parking'),
  ac: (amenities) => amenities.includes('Climatisation'),
  pet: (_amenities, listingId) => PET_FRIENDLY_LISTING_IDS.has(listingId),
})

export function listingMatchesMapFilters(listing, propertyFilter, amenityFilters) {
  if (propertyFilter) {
    const tags = MAP_PROPERTY_TAGS[listing.id] || []
    if (!tags.includes(propertyFilter)) return false
  }

  if (!amenityFilters?.size) return true
  const amenities = LISTING_DETAILS[listing.id]?.amenities || []
  for (const amenityId of amenityFilters) {
    const matches = AMENITY_MATCHERS[amenityId]
    if (!matches || !matches(amenities, listing.id)) return false
  }
  return true
}

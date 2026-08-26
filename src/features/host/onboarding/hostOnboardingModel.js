export const HOST_ONBOARDING_SCREENS = Object.freeze([
  { id: 'intro-place', phase: 1 },
  { id: 'property-type', phase: 1 },
  { id: 'guest-access', phase: 1 },
  { id: 'address', phase: 1 },
  { id: 'pin', phase: 1 },
  { id: 'basics', phase: 1 },
  { id: 'intro-presentation', phase: 2 },
  { id: 'amenities', phase: 2 },
  { id: 'photos', phase: 2 },
  { id: 'title', phase: 2 },
  { id: 'highlights', phase: 2 },
  { id: 'description', phase: 2 },
  { id: 'safety', phase: 2 },
  { id: 'intro-publish', phase: 3 },
  { id: 'booking', phase: 3 },
  { id: 'price', phase: 3 },
  { id: 'promotions', phase: 3 },
  { id: 'review', phase: 3 },
])

export const HOST_PHASES = Object.freeze([
  { id: 1, label: 'Votre logement' },
  { id: 2, label: 'Présentation' },
  { id: 3, label: 'Publication' },
])

export const HOST_PROPERTY_TYPES = Object.freeze([
  'Appartement',
  'Villa',
  'Maison',
  "Maison d’hôte",
  'Hôtel',
  'Studio',
  'Loft',
  'Riad',
  'Chalet',
  'Ferme',
  'Bateau',
  'Tiny home',
])

export const HOST_GUEST_ACCESS = Object.freeze([
  { id: 'entire', label: 'Logement entier', description: 'Les voyageurs disposent de tout le logement.' },
  { id: 'private', label: 'Chambre privée', description: 'Les voyageurs ont leur propre chambre et partagent certains espaces.' },
  { id: 'shared', label: 'Chambre partagée', description: 'Les voyageurs dorment dans un espace partagé.' },
])

export const HOST_AMENITIES = Object.freeze([
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'tv', label: 'TV' },
  { id: 'kitchen', label: 'Cuisine' },
  { id: 'washer', label: 'Lave-linge' },
  { id: 'parking', label: 'Parking' },
  { id: 'pool', label: 'Piscine' },
  { id: 'ac', label: 'Climatisation' },
  { id: 'gym', label: 'Salle de sport' },
  { id: 'hot-tub', label: 'Jacuzzi' },
  { id: 'fireplace', label: 'Cheminée' },
  { id: 'outdoor', label: 'Mobilier extérieur' },
  { id: 'workspace', label: 'Espace de travail' },
])

export const HOST_HIGHLIGHTS = Object.freeze([
  { id: 'peaceful', label: 'Calme' },
  { id: 'unique', label: 'Unique' },
  { id: 'family', label: 'Familial' },
  { id: 'stylish', label: 'Élégant' },
  { id: 'central', label: 'Central' },
  { id: 'spacious', label: 'Spacieux' },
])

export const HOST_PROMOTIONS = Object.freeze([
  { id: 'new-listing', label: 'Promotion nouveau logement', value: 20, detail: 'Pour lancer les premières réservations.' },
  { id: 'last-minute', label: 'Dernière minute', value: 7, detail: 'Pour les réservations proches de l’arrivée.' },
  { id: 'weekly', label: 'Réduction semaine', value: 10, detail: 'Pour les séjours de 7 nuits ou plus.' },
  { id: 'monthly', label: 'Réduction mensuelle', value: 25, detail: 'Pour les séjours de 28 nuits ou plus.' },
])

export const DEFAULT_HOST_DRAFT = Object.freeze({
  propertyType: 'Appartement',
  guestAccess: 'entire',
  address: '',
  city: 'La Marsa',
  pinConfirmed: false,
  guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: ['wifi'],
  title: '',
  highlights: [],
  description: '',
  safety: {
    exteriorCamera: false,
    noiseMonitor: false,
    weapons: false,
    smokeAlarm: false,
    carbonMonoxideAlarm: false,
  },
  bookingMode: 'request-first',
  basePrice: '180',
  promotions: ['new-listing'],
  confirmedAuthority: false,
  acceptedRules: false,
})

export function screenPhase(index) {
  return HOST_ONBOARDING_SCREENS[index]?.phase || 1
}

export function screenId(index) {
  return HOST_ONBOARDING_SCREENS[index]?.id || HOST_ONBOARDING_SCREENS[0].id
}

export function phaseProgress(index) {
  const phase = screenPhase(index)
  const phaseScreens = HOST_ONBOARDING_SCREENS.filter((screen) => screen.phase === phase)
  const currentId = screenId(index)
  const position = Math.max(0, phaseScreens.findIndex((screen) => screen.id === currentId))
  return phaseScreens.length <= 1 ? 1 : position / (phaseScreens.length - 1)
}

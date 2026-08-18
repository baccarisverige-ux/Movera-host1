export const homeCategories = [
  { id: 'all', label: 'Tout', icon: '◉' },
  { id: 'beach', label: 'Plage', icon: '◒' },
  { id: 'guesthouse', label: "Maison d’hôte", icon: '⌂' },
  { id: 'experience', label: 'Expériences', icon: '✦' },
  { id: 'prestige', label: 'Prestige', icon: '◇' },
  { id: 'family', label: 'Famille', icon: '♡' },
  { id: 'partner', label: 'Partenaire', icon: '○' },
]

export const homeDestinations = [
  { id: 'marsa', label: 'La Marsa', subtitle: 'Mer & restaurants', lat: 36.878, lng: 10.325, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=82' },
  { id: 'sidi-bou-said', label: 'Sidi Bou Saïd', subtitle: 'Village & vues', lat: 36.87, lng: 10.341, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=82' },
  { id: 'gammarth', label: 'Gammarth', subtitle: 'Plage & prestige', lat: 36.909721, lng: 10.286667, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=700&q=82' },
  { id: 'carthage', label: 'Carthage', subtitle: 'Histoire & calme', lat: 36.854, lng: 10.325, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=82' },
  { id: 'hammamet', label: 'Hammamet', subtitle: 'Plage & médina', lat: 36.4, lng: 10.615, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82' },
  { id: 'tunis', label: 'Tunis', subtitle: 'Ville & culture', lat: 36.8065, lng: 10.1815, image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=82' },
]

export const homeServices = [
  { id: 'car', label: 'Voiture', symbol: '⌁' },
  { id: 'transfer', label: 'Transfert', symbol: '✈' },
  { id: 'driver', label: 'Chauffeur', symbol: '◈' },
  { id: 'cleaning', label: 'Ménage', symbol: '✧' },
]

export const homeFeatured = [
  { id: 'dar-carthage', title: 'Dar Carthage', location: 'Carthage', price: 340, currency: 'TND', category: 'prestige', badge: 'Prestige', rating: '4.96', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=84' },
  { id: 'marsa-sea', title: 'Marsa Sea View', location: 'La Marsa', price: 280, currency: 'TND', category: 'beach', badge: 'Coup de cœur', rating: '4.92', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=84' },
  { id: 'sidi-bou', title: 'Maison Sidi Bou', location: 'Sidi Bou Saïd', price: 310, currency: 'TND', category: 'guesthouse', badge: "Maison d’hôte", rating: '4.91', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=84' },
]

export const homeFavorites = [
  { id: 'gammarth-villa', title: 'Villa Gammarth', location: 'Gammarth', price: 420, currency: 'TND', category: 'family', rating: '4.95', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=84' },
  { id: 'marsa-loft', title: 'Loft La Marsa', location: 'La Marsa', price: 230, currency: 'TND', category: 'beach', rating: '4.88', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=84' },
]

export const homeCollections = [
  { id: 'beach', title: 'Vues Panoramiques & Littoral', items: [homeFeatured[1], homeFavorites[1]] },
  { id: 'popular', title: 'Adresses Remarquables', items: [homeFeatured[0], homeFeatured[2]] },
  { id: 'prestige', title: 'Villas & Propriétés de Prestige', items: [homeFavorites[0], homeFeatured[0]] },
]

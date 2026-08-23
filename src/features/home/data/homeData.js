import { listingCatalog } from '../../../entities/listing/listingCatalog.js'

export const homeCategories = [
  { id: 'all', label: 'Tout', icon: '◉' },
  { id: 'guesthouse', label: "Maison d’hôte", icon: '⌂' },
  { id: 'beach', label: 'Plage', icon: '◒' },
  { id: 'hotel', label: 'Hôtel', icon: '▦' },
  { id: 'family', label: 'Appartement', icon: '♡' },
  { id: 'prestige', label: 'Villa', icon: '◇' },
  { id: 'experience', label: 'Expérience', icon: '✦' },
  { id: 'partner', label: 'Partenaire', icon: '○' },
]

export const homeDestinations = [
  { id: 'la-marsa', label: 'La Marsa', subtitle: 'Bord de mer élégant', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'sidi-bou-said', label: 'Sidi Bou Saïd', subtitle: 'Charme bleu et blanc', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'gammarth', label: 'Gammarth', subtitle: 'Plages & villas', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'carthage', label: 'Carthage', subtitle: 'Histoire & calme', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'hammamet', label: 'Hammamet', subtitle: 'Mer & médina', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'tunis', label: 'Tunis', subtitle: 'Culture & vie urbaine', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'sousse', label: 'Sousse', subtitle: 'Plages & médina', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'djerba', label: 'Djerba', subtitle: 'Île & douceur de vivre', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'nabeul', label: 'Nabeul', subtitle: 'Côte & artisanat', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=90&fm=webp' },
  { id: 'bizerte', label: 'Bizerte', subtitle: 'Port & paysages marins', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=700&q=90&fm=webp' },
]

export const homeServices = [
  { id: 'car', label: 'Voiture', symbol: '🚘' },
  { id: 'transfer', label: 'Transfert', symbol: '✈' },
  { id: 'driver', label: 'Chauffeur', symbol: '♙' },
  { id: 'cleaning', label: 'Ménage', symbol: '✦' },
]

export const homeFeatured = listingCatalog

const byCategory = (category) => homeFeatured.filter((item) => item.category.split(' ').includes(category))

export const homeCollections = [
  { id: 'guesthouse', title: "Maison d’hôte", items: byCategory('guesthouse') },
  { id: 'beach', title: 'Plage', items: byCategory('beach') },
  { id: 'family', title: 'Appartement', items: byCategory('family') },
  { id: 'prestige', title: 'Villa', items: byCategory('prestige') },
  { id: 'experience', title: 'Expérience', items: byCategory('experience') },
]

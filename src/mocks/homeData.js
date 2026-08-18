export const homeCategories = [
  { id: 'all', label: 'Tout', icon: '◉' },
  { id: 'prestige', label: 'Prestige', icon: '◇' },
  { id: 'beach', label: 'Plage', icon: '◒' },
  { id: 'guesthouse', label: "Maison d’hôte", icon: '⌂' },
  { id: 'experience', label: 'Expérience', icon: '✦' },
  { id: 'family', label: 'Famille', icon: '♡' },
  { id: 'partner', label: 'Partenaire', icon: '○' },
]

export const homeDestinations = [
  { id: 'sidi-bou-said', label: 'Sidi Bou Saïd', subtitle: 'Village & vues', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=82' },
  { id: 'hammamet', label: 'Hammamet', subtitle: 'Plage & médina', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82' },
  { id: 'sousse', label: 'Sousse', subtitle: 'Mer & médina', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=700&q=82' },
  { id: 'gammarth', label: 'Gammarth', subtitle: 'Plage & prestige', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=700&q=82' },
]

export const homeServices = [
  { id: 'car', label: 'Location voiture', symbol: '⌁' },
  { id: 'transfer', label: 'Transfert', symbol: '✈' },
  { id: 'driver', label: 'Chauffeur privé', symbol: '◈' },
  { id: 'cleaning', label: 'Ménage', symbol: '✧' },
]

export const homeFeatured = [
  { id:'villa-perle', title:'Villa Saphir — Front de mer', location:'Gammarth', price:580, currency:'TND', category:'beach prestige', image:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Collection', rating:'4.98' },
  { id:'maison-bleue', title:'Suite Panorama Sidi Bou Saïd', location:'Sidi Bou Saïd', price:480, currency:'TND', category:'prestige guesthouse', image:'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Signature', rating:'4.95' },
  { id:'res-carthage', title:'Dar Carthage Résidence', location:'Carthage', price:340, currency:'TND', category:'family guesthouse', image:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Nouveau', rating:'4.88' },
  { id:'villa-emeraude', title:'Villa Émeraude — Domaine privé', location:'Gammarth', price:1200, currency:'TND', category:'prestige beach', image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Prestige', rating:'4.99' },
  { id:'loft-cote', title:'Loft Côte Bleue Design', location:'La Marsa', price:420, currency:'TND', category:'beach', image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Design', rating:'4.82' },
  { id:'villa-jasmin', title:'Villa Jasmin — Jardin secret', location:'Carthage', price:680, currency:'TND', category:'prestige', image:'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Signature', rating:'4.96' },
  { id:'dar-sidi', title:"Dar Sidi — Maison d’hôtes d’exception", location:'Sidi Bou Saïd', price:380, currency:'TND', category:'guesthouse', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=90&fm=webp', badge:"Maison d’hôtes", rating:'4.93' },
  { id:'riad-marsa', title:'Riad La Marsa — Patio Andalou', location:'La Marsa', price:410, currency:'TND', category:'guesthouse beach', image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=90&fm=webp', badge:"Maison d’hôtes", rating:'4.89' },
]

const byCategory = (category) => homeFeatured.filter((item) => item.category.split(' ').includes(category))

export const homeCollections = [
  { id: 'beach', title: 'Vues Panoramiques & Littoral', items: byCategory('beach') },
  { id: 'popular', title: 'Adresses Remarquables', items: [homeFeatured[2], homeFeatured[4], homeFeatured[0]] },
  { id: 'guesthouse', title: 'Hôtes Privilégiés', items: byCategory('guesthouse') },
  { id: 'prestige', title: 'Villas & Propriétés de Prestige', items: byCategory('prestige') },
  { id: 'family', title: "Résidences Familiales d'Exception", items: [homeFeatured[2]] },
]

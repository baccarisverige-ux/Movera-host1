/**
 * Canonical public offer catalogue.
 *
 * Home collections, category filters, map cards and future search results
 * should import this file instead of maintaining their own offer copies.
 */
export const listingCatalog = Object.freeze([
  { id:'villa-perle', title:'Villa Saphir — Front de mer', location:'Gammarth', price:580, currency:'TND', category:'beach prestige', image:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Collection', rating:'4.98' },
  { id:'maison-bleue', title:'Suite Panorama Sidi Bou Saïd', location:'Sidi Bou Saïd', price:480, currency:'TND', category:'prestige guesthouse', image:'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Signature', rating:'4.95' },
  { id:'res-carthage', title:'Dar Carthage Résidence', location:'Carthage', price:340, currency:'TND', category:'family guesthouse experience', image:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Nouveau', rating:'4.88' },
  { id:'villa-emeraude', title:'Villa Émeraude — Domaine privé', location:'Gammarth', price:1200, currency:'TND', category:'prestige beach', image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf1590?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Prestige', rating:'4.99' },
  { id:'loft-cote', title:'Loft Côte Bleue Design', location:'La Marsa', price:420, currency:'TND', category:'beach', image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Design', rating:'4.82' },
  { id:'villa-jasmin', title:'Villa Jasmin — Jardin secret', location:'Carthage', price:680, currency:'TND', category:'prestige', image:'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Signature', rating:'4.96' },
  { id:'dar-sidi', title:'Dar Sidi — Maison d’hôtes d’exception', location:'Sidi Bou Saïd', price:380, currency:'TND', category:'guesthouse', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Maison d’hôtes', rating:'4.93' },
  { id:'riad-marsa', title:'Riad La Marsa — Patio Andalou', location:'La Marsa', price:410, currency:'TND', category:'guesthouse beach', image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=90&fm=webp', badge:'Maison d’hôtes', rating:'4.89' },
])

export function getListingSummary(id) {
  return listingCatalog.find((listing) => listing.id === id) || null
}

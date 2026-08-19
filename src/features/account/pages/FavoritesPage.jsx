import { useEffect, useState } from 'react'
import { getListingDetail } from '../../listing-detail/listingDetailData.js'
import { favoritesStore } from '../favoritesStore.js'
import '../accountStyles.js'

export function FavoritesPage({ onNavigate }) {
  const [ids, setIds] = useState(() => favoritesStore.getAll())
  useEffect(() => favoritesStore.subscribe(() => setIds(favoritesStore.getAll())), [])
  return <section className="account-page" data-testid="page-favorites"><h1>Favoris</h1>{ids.length === 0 ? <p data-testid="favorites-empty">Aucun favori.</p> : <div>{ids.map(id => { const listing = getListingDetail(id); return <article className="favorite-card" data-testid={`favorite-${id}`} key={id}><div><strong>{listing?.title || id}</strong><p>{listing?.location || ''}</p></div><button onClick={() => favoritesStore.toggle(id)}>Retirer</button><button onClick={() => onNavigate(`/listing/${id}`)}>Voir</button></article> })}</div>}</section>
}

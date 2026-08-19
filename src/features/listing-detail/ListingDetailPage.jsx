import { useEffect, useMemo, useState } from 'react'
import { getListingDetail } from '../../entities/listing/listingRepository.js'
import { favoritesStore } from '../account/favoritesStore.js'
import { Gallery } from './components/Gallery.jsx'
import { ListingHeader, ListingPricing, ListingSections } from './components/ListingSections.jsx'
import { getPricingSummary } from './pricingService.js'
import '../../styles/listing-detail.css'

export function ListingDetailPage({ params, onNavigate }) {
  const listing = useMemo(() => getListingDetail(params.id), [params.id])
  const pricing = useMemo(() => getPricingSummary(listing), [listing])
  const [favorite,setFavorite]=useState(()=>favoritesStore.has(params.id))
  const fromMap = new URLSearchParams(window.location.search).get('from') === 'map'
  const mapReturnPath = fromMap ? '/map?restore=1' : '/map'
  const bookingPath = fromMap ? `/booking/${params.id}?from=map` : `/booking/${params.id}`
  useEffect(()=>favoritesStore.subscribe(()=>setFavorite(favoritesStore.has(params.id))),[params.id])
  if (!listing) return <section className="listing-detail listing-detail--missing" data-testid="page-listing-missing"><h1>Annonce introuvable</h1><button type="button" onClick={()=>onNavigate(mapReturnPath)}>Retour à la carte</button></section>
  return <article className="listing-detail" data-testid="page-listing" data-listing-id={listing.id}><Gallery listing={listing}/><ListingHeader listing={listing} favorite={favorite} onToggleFavorite={()=>favoritesStore.toggle(listing.id)}/><ListingSections listing={listing}/><ListingPricing pricing={pricing} onBook={()=>onNavigate(bookingPath)}/><button type="button" className="route-link-button" data-testid="detail-back-map" onClick={()=>onNavigate(mapReturnPath)}>Retour à la carte</button></article>
}

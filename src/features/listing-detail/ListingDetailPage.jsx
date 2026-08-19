import { useEffect, useMemo, useState } from 'react'
import { favoritesStore } from '../account/favoritesStore.js'
import { getListingDetail } from './listingDetailData.js'
import { getPricingSummary } from './pricingService.js'
import '../../styles/listing-detail.css'

function Gallery({ listing }) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const image = listing.images[index]
  const forceError = new URLSearchParams(window.location.search).get('mediaError') === '1'
  const src = forceError
    ? '/__missing-listing-image__.jpg'
    : `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#e8e6e1"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="48" fill="#4d4a45">${image.alt}</text></svg>`)}`
  return <section className="listing-gallery" data-testid="listing-gallery" data-image-index={index}>{failed?<div className="listing-gallery__fallback" data-testid="listing-image-fallback">Image indisponible</div>:<img src={src} alt={image.alt} loading="lazy" onError={()=>setFailed(true)} data-testid="listing-image"/>}<div className="listing-gallery__controls"><button type="button" aria-label="Photo précédente" onClick={()=>{setFailed(false);setIndex(c=>Math.max(0,c-1))}}>‹</button><span>{index+1} / {listing.images.length}</span><button type="button" aria-label="Photo suivante" onClick={()=>{setFailed(false);setIndex(c=>Math.min(listing.images.length-1,c+1))}}>›</button></div></section>
}

export function ListingDetailPage({ params, onNavigate }) {
  const listing = useMemo(() => getListingDetail(params.id), [params.id])
  const pricing = useMemo(() => getPricingSummary(listing), [listing])
  const [favorite,setFavorite]=useState(()=>favoritesStore.has(params.id))
  const fromMap = new URLSearchParams(window.location.search).get('from') === 'map'
  const mapReturnPath = fromMap ? '/map?restore=1' : '/map'
  const bookingPath = fromMap ? `/booking/${params.id}?from=map` : `/booking/${params.id}`
  useEffect(()=>favoritesStore.subscribe(()=>setFavorite(favoritesStore.has(params.id))),[params.id])
  if (!listing) return <section className="listing-detail listing-detail--missing" data-testid="page-listing-missing"><h1>Annonce introuvable</h1><button type="button" onClick={()=>onNavigate(mapReturnPath)}>Retour à la carte</button></section>
  return <article className="listing-detail" data-testid="page-listing" data-listing-id={listing.id}><Gallery listing={listing}/><header className="listing-detail__header" data-testid="listing-header"><p className="route-page__eyebrow">Guest · Detail</p><h1>{listing.title}</h1><p>{listing.subtitle}</p><span>★ {listing.rating} · {listing.reviews} avis</span><button type="button" data-testid="favorite-toggle" aria-pressed={favorite} onClick={()=>favoritesStore.toggle(listing.id)}>{favorite?'Retirer des favoris':'Ajouter aux favoris'}</button></header><section className="listing-detail__section" data-testid="listing-location"><h2>Localisation</h2><p>{listing.location}</p></section><section className="listing-detail__section" data-testid="listing-amenities"><h2>Équipements</h2><ul>{listing.amenities.map(item=><li key={item}>{item}</li>)}</ul></section><section className="listing-detail__section listing-host" data-testid="listing-host-card"><div className="listing-host__avatar" aria-hidden="true">{listing.host.name.slice(0,1)}</div><div><h2>{listing.host.name}</h2><p>{listing.host.since} · {listing.host.response}</p></div></section><section className="listing-detail__section" data-testid="listing-availability"><h2>Disponibilité</h2><p>{listing.availability}</p></section><section className="listing-pricing" data-testid="listing-pricing-summary"><div><strong>{pricing.nightlyLabel}</strong><span>{pricing.feesLabel}</span></div><button type="button" data-testid="booking-cta" onClick={()=>onNavigate(bookingPath)}>{pricing.bookingLabel}</button></section><button type="button" className="route-link-button" data-testid="detail-back-map" onClick={()=>onNavigate(mapReturnPath)}>Retour à la carte</button></article>
}

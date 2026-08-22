import { useState } from 'react'

export function Gallery({ listing }) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const image = listing.images[index]
  const forceError = new URLSearchParams(window.location.search).get('mediaError') === '1'
  const src = forceError ? '/__missing-listing-image__.jpg' : `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#e8e6e1"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="48" fill="#4d4a45">${image.alt}</text></svg>`)}`
  return <section className="listing-gallery" data-testid="listing-gallery" data-image-index={index}>{failed?<div className="listing-gallery__fallback" data-testid="listing-image-fallback">Image indisponible</div>:<img src={src} alt={image.alt} loading="lazy" onError={()=>setFailed(true)} data-testid="listing-image"/>}<div className="listing-gallery__controls"><button type="button" aria-label="Photo précédente" onClick={()=>{setFailed(false);setIndex(c=>Math.max(0,c-1))}}>‹</button><span>{index+1} / {listing.images.length}</span><button type="button" aria-label="Photo suivante" onClick={()=>{setFailed(false);setIndex(c=>Math.min(listing.images.length-1,c+1))}}>›</button></div></section>
}

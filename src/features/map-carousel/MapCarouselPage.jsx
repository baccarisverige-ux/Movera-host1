import { useCallback, useMemo, useState } from 'react'
import { CarouselShell } from '../carousel/CarouselShell.jsx'
import { CAROUSEL_LISTINGS } from '../carousel/carouselData.js'
import { DEFAULT_MARKERS, INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'

const STORAGE_KEY = 'movera-map-back-state-v1'

function readBackState() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function persistMapBackState(state) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function MapCarouselPage({ onNavigate }) {
  const restored = useMemo(() => readBackState(), [])
  const [selectedListingId, setSelectedListingId] = useState(restored?.selectedListingId || null)
  const [viewport, setViewport] = useState(restored?.viewport || INITIAL_VIEWPORT)
  const initialOpen = restored?.carouselOpen === true

  const selectListing = useCallback((id) => setSelectedListingId(id), [])
  const openDetail = useCallback((id, phase) => {
    persistMapBackState({
      viewport,
      selectedListingId: id,
      carouselOpen: phase !== 'closed' && phase !== 'closing',
    })
    onNavigate(`/listing/${id}`)
  }, [onNavigate, viewport])

  return (
    <section className="route-page route-page--map" data-testid="page-map" data-official-flow="marker-carousel-detail">
      <p className="route-page__eyebrow">Guest</p>
      <h1>Explorer la carte</h1>
      <MapContainer
        markers={DEFAULT_MARKERS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={selectListing}
        initialViewport={restored?.viewport || INITIAL_VIEWPORT}
        onViewportChange={setViewport}
      />
      <CarouselShell
        listings={CAROUSEL_LISTINGS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={selectListing}
        initialOpen={initialOpen}
        onDetail={openDetail}
      />
    </section>
  )
}

export function ListingDetailPage({ params, onNavigate }) {
  const listing = CAROUSEL_LISTINGS.find((item) => item.id === params.id)
  return (
    <section className="route-page" data-testid="page-listing" data-listing-id={params.id}>
      <p className="route-page__eyebrow">Guest · Detail</p>
      <h1>{listing?.title || `Annonce ${params.id}`}</h1>
      <p>{listing?.price || 'Détail annonce'}</p>
      <button type="button" className="route-link-button" data-testid="detail-back-map" onClick={() => onNavigate('/map')}>
        Retour à la carte
      </button>
    </section>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import '../../styles/map-b225.css'
import { CarouselShell } from '../carousel/CarouselShell.jsx'
import { CAROUSEL_LISTINGS } from '../carousel/carouselData.js'
import { DEFAULT_MARKERS, INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'

const STORAGE_KEY = 'movera-map-back-state-v1'
const DESTINATION_VIEWPORTS = Object.freeze({
  'la-marsa': { lat: 36.8782, lng: 10.3247, zoom: 13 },
  'sidi-bou-said': { lat: 36.8687, lng: 10.3417, zoom: 13 },
  gammarth: { lat: 36.9179, lng: 10.2934, zoom: 13 },
  carthage: { lat: 36.8528, lng: 10.3233, zoom: 13 },
  hammamet: { lat: 36.4000, lng: 10.6167, zoom: 12 },
  tunis: { lat: 36.8065, lng: 10.1815, zoom: 12 },
  sousse: { lat: 35.8256, lng: 10.6369, zoom: 12 },
  djerba: { lat: 33.8076, lng: 10.8451, zoom: 11 },
  nabeul: { lat: 36.4561, lng: 10.7376, zoom: 12 },
  bizerte: { lat: 37.2746, lng: 9.8739, zoom: 12 },
})

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

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
  const searchParams = new URLSearchParams(window.location.search)
  const requestedDestination = searchParams.get('destination')
  const shouldRestore = searchParams.get('restore') === '1'
  const destinationViewport = requestedDestination ? DESTINATION_VIEWPORTS[requestedDestination] || null : null
  const restored = useMemo(() => (!destinationViewport && shouldRestore) ? readBackState() : null, [destinationViewport, shouldRestore])
  const initialViewport = destinationViewport || restored?.viewport || INITIAL_VIEWPORT
  const [selectedListingId, setSelectedListingId] = useState(restored?.selectedListingId || null)
  const [viewport, setViewport] = useState(initialViewport)
  const initialOpen = restored?.carouselOpen === true

  useEffect(() => {
    if (shouldRestore && !destinationViewport) return
    try { window.sessionStorage.removeItem(STORAGE_KEY) } catch { /* storage unavailable */ }
  }, [destinationViewport, shouldRestore])

  const selectListing = useCallback((id) => setSelectedListingId(id), [])
  const openDetail = useCallback((id, phase) => {
    persistMapBackState({
      viewport,
      selectedListingId: id,
      carouselOpen: phase !== 'closed' && phase !== 'closing',
    })
    onNavigate(`/listing/${id}?from=map`)
  }, [onNavigate, viewport])

  return (
    <section className="b225-map-page" data-testid="page-map" data-official-flow="marker-carousel-detail" data-destination={requestedDestination || ''}>
      <div className="b225-map-top">
        <button type="button" className="b225-map-search" onClick={() => onNavigate('/')} aria-label="Modifier la recherche">
          <SearchIcon />
          <span className="b225-map-search__copy"><strong>Explorer la carte</strong><span>Grand Tunis · Dates · Voyageurs</span></span>
          <span className="b225-map-filter-button" aria-hidden="true">≡</span>
        </button>
      </div>

      <MapContainer
        markers={DEFAULT_MARKERS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={selectListing}
        initialViewport={initialViewport}
        onViewportChange={setViewport}
      />

      {!selectedListingId ? <div className="b225-map-badge">Déplacez la carte pour explorer</div> : null}

      <CarouselShell
        listings={CAROUSEL_LISTINGS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={selectListing}
        initialOpen={initialOpen && Boolean(selectedListingId)}
        onDetail={openDetail}
      />
    </section>
  )
}

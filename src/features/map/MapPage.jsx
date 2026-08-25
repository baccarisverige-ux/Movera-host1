import { useEffect, useState } from 'react'
import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { getListingMapPosition } from '../../entities/listing/listingMapPositions.js'
import '../../styles/map-b225.css'
import '../../styles/map-return-offers.css'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { announceMapReady } from '../search/mapHandoff.js'
import { DESTINATION_VIEWPORTS } from './constants/map.constants.js'

const LISTING_MARKERS = Object.freeze(
  listingCatalog
    .map((listing) => {
      const position = getListingMapPosition(listing.id)
      return position ? Object.freeze({ id: listing.id, label: listing.title, ...position }) : null
    })
    .filter(Boolean),
)

const COLLECTION_ROUTE_BY_CATEGORY = Object.freeze({
  beach: '/plage',
  guesthouse: '/maison-d-hote',
  hotel: '/hotel',
  family: '/appartement',
  prestige: '/villa',
})

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
}

function boundedNumber(searchParams, key, min, max) {
  const value = Number(searchParams.get(key))
  return Number.isFinite(value) && value >= min && value <= max ? value : null
}

function viewportFromSearch(searchParams) {
  const lat = boundedNumber(searchParams, 'lat', -90, 90)
  const lng = boundedNumber(searchParams, 'lng', -180, 180)
  const zoom = boundedNumber(searchParams, 'zoom', 1, 20)
  return lat === null || lng === null || zoom === null ? null : { lat, lng, zoom }
}

function collectionFallbackPath(listingId) {
  const listing = listingCatalog.find((item) => item.id === listingId)
  if (!listing) return '/'
  const categories = listing.category.split(' ')
  const category = categories.find((item) => COLLECTION_ROUTE_BY_CATEGORY[item])
  return category ? COLLECTION_ROUTE_BY_CATEGORY[category] : '/'
}

export function MapPage({ onNavigate }) {
  const searchParams = new URLSearchParams(window.location.search)
  const requestedDestination = searchParams.get('destination')
  const requestedListing = searchParams.get('listing')
  const selectedMarker = requestedListing ? LISTING_MARKERS.find((marker) => marker.id === requestedListing) || null : null
  const [selectedListingId, setSelectedListingId] = useState(selectedMarker?.id || null)
  const handoffViewport = viewportFromSearch(searchParams)
  const destinationViewport = requestedDestination ? DESTINATION_VIEWPORTS[requestedDestination] || null : null
  const listingViewport = selectedMarker ? { lat: selectedMarker.lat, lng: selectedMarker.lng, zoom: 13.5 } : null
  const initialViewport = handoffViewport || listingViewport || destinationViewport || INITIAL_VIEWPORT

  useEffect(() => {
    setSelectedListingId(selectedMarker?.id || null)
  }, [selectedMarker?.id])

  const returnToOffers = () => {
    if (!requestedListing) return
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    onNavigate(collectionFallbackPath(requestedListing))
  }

  // Handoff readiness is layout-based only; tile-network timing never blocks route release.
  useEffect(() => {
    let frame = 0
    let paintFrame = 0
    let finalFrame = 0
    const startedAt = performance.now()
    const maxWaitMs = 260

    const announceAfterPaint = () => {
      paintFrame = window.requestAnimationFrame(() => {
        finalFrame = window.requestAnimationFrame(() => announceMapReady())
      })
    }

    const checkSurface = () => {
      const surface = document.querySelector('.b225-map-page [data-testid="map-surface"]')
      if (!surface) {
        if (performance.now() - startedAt >= maxWaitMs) announceAfterPaint()
        else frame = window.requestAnimationFrame(checkSurface)
        return
      }

      const rect = surface.getBoundingClientRect()
      const measuredWidth = Number(surface.dataset.width)
      const measuredHeight = Number(surface.dataset.height)
      const sizeStable = Number.isFinite(measuredWidth)
        && Number.isFinite(measuredHeight)
        && Math.abs(measuredWidth - Math.round(rect.width)) <= 1
        && Math.abs(measuredHeight - Math.round(rect.height)) <= 1

      if (sizeStable || performance.now() - startedAt >= maxWaitMs) {
        announceAfterPaint()
        return
      }

      frame = window.requestAnimationFrame(checkSurface)
    }

    frame = window.requestAnimationFrame(checkSurface)
    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(paintFrame)
      window.cancelAnimationFrame(finalFrame)
    }
  }, [])

  return (
    <section
      className="b225-map-page"
      data-testid="page-map"
      data-destination={requestedDestination || ''}
      data-listing={selectedMarker?.id || ''}
      data-handoff-viewport={handoffViewport ? 'true' : 'false'}
    >
      <div className="b225-map-top">
        {requestedListing ? (
          <div className="b225-map-return-row">
            <button type="button" className="b225-map-return" onClick={returnToOffers} aria-label="Retour aux offres">
              <span className="b225-map-return__icon"><BackIcon /></span>
              <span>Retour aux offres</span>
            </button>
          </div>
        ) : null}
        <button type="button" className="b225-map-search" onClick={() => onNavigate('/')} aria-label="Modifier la recherche">
          <SearchIcon />
          <span className="b225-map-search__copy"><strong>Explorer la carte</strong><span>{selectedMarker ? selectedMarker.label : 'Grand Tunis · Dates · Voyageurs'}</span></span>
          <span className="b225-map-filter-button" aria-hidden="true">≡</span>
        </button>
      </div>

      <MapContainer
        markers={LISTING_MARKERS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={setSelectedListingId}
        initialViewport={initialViewport}
      />
    </section>
  )
}

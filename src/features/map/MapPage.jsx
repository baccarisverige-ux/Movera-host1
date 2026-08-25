import { useCallback, useEffect, useMemo, useState } from 'react'
import { listingCatalog } from '../../entities/listing/listingCatalog.js'
import { getListingMapPosition } from '../../entities/listing/listingMapPositions.js'
import '../../styles/map-b225.css'
import '../../styles/map-return-offers.css'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { announceMapReady } from '../search/mapHandoff.js'
import { DESTINATION_VIEWPORTS } from './constants/map.constants.js'
import { MapOfferSheet } from './MapOfferSheet.jsx'

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

const DESTINATION_LISTING_LOCATIONS = Object.freeze({
  'la-marsa': ['La Marsa'],
  'sidi-bou-said': ['Sidi Bou Saïd'],
  gammarth: ['Gammarth'],
  carthage: ['Carthage'],
  tunis: ['La Marsa', 'Sidi Bou Saïd', 'Gammarth', 'Carthage'],
})

const DESTINATION_LABELS = Object.freeze({
  'la-marsa': 'La Marsa',
  'sidi-bou-said': 'Sidi Bou Saïd',
  gammarth: 'Gammarth',
  carthage: 'Carthage',
  hammamet: 'Hammamet',
  tunis: 'Tunis',
  sousse: 'Sousse',
  djerba: 'Djerba',
  tozeur: 'Tozeur',
  tabarka: 'Tabarka',
  nabeul: 'Nabeul',
  bizerte: 'Bizerte',
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

function listingsForMapContext(requestedDestination, requestedListing) {
  if (requestedDestination) {
    const locations = DESTINATION_LISTING_LOCATIONS[requestedDestination]
    if (!locations) return []
    return listingCatalog.filter((listing) => locations.includes(listing.location))
  }

  if (requestedListing) {
    const selected = listingCatalog.find((listing) => listing.id === requestedListing)
    if (!selected) return []
    return listingCatalog.filter((listing) => listing.location === selected.location)
  }

  return listingCatalog
}

export function MapPage({ onNavigate }) {
  const searchParams = new URLSearchParams(window.location.search)
  const requestedDestination = searchParams.get('destination')
  const requestedListing = searchParams.get('listing')
  const selectedMarker = requestedListing ? LISTING_MARKERS.find((marker) => marker.id === requestedListing) || null : null
  const [selectedListingId, setSelectedListingId] = useState(selectedMarker?.id || null)
  const [viewportCommand, setViewportCommand] = useState(null)
  const handoffViewport = viewportFromSearch(searchParams)
  const destinationViewport = requestedDestination ? DESTINATION_VIEWPORTS[requestedDestination] || null : null
  const listingViewport = selectedMarker ? { lat: selectedMarker.lat, lng: selectedMarker.lng, zoom: 13.5 } : null
  const initialViewport = handoffViewport || listingViewport || destinationViewport || INITIAL_VIEWPORT

  const cityListings = useMemo(
    () => listingsForMapContext(requestedDestination, requestedListing),
    [requestedDestination, requestedListing],
  )

  const visibleMarkers = useMemo(() => {
    const ids = new Set(cityListings.map((listing) => listing.id))
    return LISTING_MARKERS.filter((marker) => ids.has(marker.id))
  }, [cityListings])

  const cityLabel = requestedDestination
    ? DESTINATION_LABELS[requestedDestination] || 'Cette destination'
    : requestedListing
      ? listingCatalog.find((listing) => listing.id === requestedListing)?.location || 'Cette ville'
      : 'Grand Tunis'

  useEffect(() => {
    setSelectedListingId(selectedMarker?.id || null)
    setViewportCommand(null)
  }, [selectedMarker?.id, requestedDestination])

  const returnToOffers = () => {
    if (!requestedListing) return
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    onNavigate(collectionFallbackPath(requestedListing))
  }

  const handleSheetProgress = useCallback((progress) => {
    const base = handoffViewport || listingViewport || destinationViewport || INITIAL_VIEWPORT
    const activeId = selectedListingId || cityListings[0]?.id
    const activeMarker = activeId ? visibleMarkers.find((marker) => marker.id === activeId) : null
    const blend = activeMarker ? Math.max(0, Math.min(1, (progress - 0.08) / 0.92)) : 0
    const focusStrength = blend * 0.72
    const lat = activeMarker ? base.lat + (activeMarker.lat - base.lat) * focusStrength : base.lat
    const lng = activeMarker ? base.lng + (activeMarker.lng - base.lng) * focusStrength : base.lng
    const zoom = Math.min(17, base.zoom + progress * 1.45)

    if (progress > 0.14 && !selectedListingId && cityListings[0]) setSelectedListingId(cityListings[0].id)
    setViewportCommand({ lat, lng, zoom, revision: performance.now() })
  }, [handoffViewport, listingViewport, destinationViewport, selectedListingId, cityListings, visibleMarkers])

  const handleSheetSelectedListingChange = useCallback((listingId) => {
    setSelectedListingId(listingId)
    const marker = visibleMarkers.find((item) => item.id === listingId)
    const base = handoffViewport || listingViewport || destinationViewport || INITIAL_VIEWPORT
    if (!marker) return
    setViewportCommand({
      lat: marker.lat,
      lng: marker.lng,
      zoom: Math.min(17, Math.max(13.6, base.zoom + 1.65)),
      revision: performance.now(),
    })
  }, [visibleMarkers, handoffViewport, listingViewport, destinationViewport])

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
      data-city-offer-count={cityListings.length}
    >
      <div className="b225-map-top">
        <button type="button" className="b225-map-search" onClick={() => onNavigate('/')} aria-label="Modifier la recherche">
          <SearchIcon />
          <span className="b225-map-search__copy"><strong>Explorer la carte</strong><span>{cityLabel} · Dates · Voyageurs</span></span>
          <span className="b225-map-filter-button" aria-hidden="true">≡</span>
        </button>
      </div>

      {requestedListing ? (
        <button type="button" className="b225-map-return b225-map-return--floating" onClick={returnToOffers} aria-label="Retour aux offres">
          <span className="b225-map-return__icon"><BackIcon /></span>
          <span>Retour aux offres</span>
        </button>
      ) : null}

      <MapContainer
        markers={visibleMarkers}
        selectedListingId={selectedListingId}
        onSelectedListingChange={setSelectedListingId}
        initialViewport={initialViewport}
        viewportCommand={viewportCommand}
      />

      <MapOfferSheet
        listings={cityListings}
        cityLabel={cityLabel}
        selectedListingId={selectedListingId}
        onSelectedListingChange={handleSheetSelectedListingChange}
        onProgressChange={handleSheetProgress}
      />
    </section>
  )
}

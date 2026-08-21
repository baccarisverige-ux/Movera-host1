import { useEffect } from 'react'
import '../../styles/map-b225.css'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { announceMapReady } from '../search/mapHandoff.js'
import { DESTINATION_VIEWPORTS } from './constants/map.constants.js'

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
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

export function MapPage({ onNavigate }) {
  const searchParams = new URLSearchParams(window.location.search)
  const requestedDestination = searchParams.get('destination')
  const handoffViewport = viewportFromSearch(searchParams)
  const destinationViewport = requestedDestination ? DESTINATION_VIEWPORTS[requestedDestination] || null : null
  const initialViewport = handoffViewport || destinationViewport || INITIAL_VIEWPORT

  useEffect(() => {
    let frame = 0
    let readyFrame = 0
    const startedAt = performance.now()
    const deadlineMs = 2200

    const announceAfterPaint = () => {
      readyFrame = window.requestAnimationFrame(() => {
        readyFrame = window.requestAnimationFrame(() => announceMapReady())
      })
    }

    const checkReady = () => {
      const surface = document.querySelector('.b225-map-page [data-testid="map-surface"]')
      if (!surface) {
        frame = window.requestAnimationFrame(checkReady)
        return
      }

      const rect = surface.getBoundingClientRect()
      const measuredWidth = Number(surface.dataset.width)
      const measuredHeight = Number(surface.dataset.height)
      const sizeStable = Number.isFinite(measuredWidth)
        && Number.isFinite(measuredHeight)
        && Math.abs(measuredWidth - Math.round(rect.width)) <= 1
        && Math.abs(measuredHeight - Math.round(rect.height)) <= 1

      const tileImages = [...surface.querySelectorAll('.map-tile img')]
      const loadedTiles = tileImages.filter((image) => {
        const style = window.getComputedStyle(image)
        return image.complete && image.naturalWidth > 0 && style.visibility !== 'hidden'
      }).length
      const enoughTiles = loadedTiles >= Math.min(4, tileImages.length)

      if ((sizeStable && tileImages.length > 0 && enoughTiles) || performance.now() - startedAt >= deadlineMs) {
        announceAfterPaint()
        return
      }

      frame = window.requestAnimationFrame(checkReady)
    }

    frame = window.requestAnimationFrame(checkReady)
    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(readyFrame)
    }
  }, [])

  return (
    <section className="b225-map-page" data-testid="page-map" data-destination={requestedDestination || ''} data-handoff-viewport={handoffViewport ? 'true' : 'false'}>
      <div className="b225-map-top">
        <button type="button" className="b225-map-search" onClick={() => onNavigate('/')} aria-label="Modifier la recherche">
          <SearchIcon />
          <span className="b225-map-search__copy"><strong>Explorer la carte</strong><span>Grand Tunis · Dates · Voyageurs</span></span>
          <span className="b225-map-filter-button" aria-hidden="true">≡</span>
        </button>
      </div>

      <MapContainer initialViewport={initialViewport} />
    </section>
  )
}

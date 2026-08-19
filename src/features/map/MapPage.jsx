import '../../styles/map-b225.css'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { DESTINATION_VIEWPORTS } from './constants/map.constants.js'

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

export function MapPage({ onNavigate }) {
  const searchParams = new URLSearchParams(window.location.search)
  const requestedDestination = searchParams.get('destination')
  const destinationViewport = requestedDestination ? DESTINATION_VIEWPORTS[requestedDestination] || null : null
  const initialViewport = destinationViewport || INITIAL_VIEWPORT

  return (
    <section className="b225-map-page" data-testid="page-map" data-destination={requestedDestination || ''}>
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

import { useCallback, useMemo, useState } from 'react'
import { homeCategories } from '../../mocks/homeData.js'
import '../../styles/map-b225.css'
import { CarouselShell } from '../carousel/CarouselShell.jsx'
import { CAROUSEL_LISTINGS } from '../carousel/carouselData.js'
import { DEFAULT_MARKERS, INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'

const STORAGE_KEY = 'movera-map-back-state-v1'

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
  const restored = useMemo(() => readBackState(), [])
  const [selectedListingId, setSelectedListingId] = useState(restored?.selectedListingId || null)
  const [viewport, setViewport] = useState(restored?.viewport || INITIAL_VIEWPORT)
  const [category, setCategory] = useState('all')
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
    <section className="b225-map-page" data-testid="page-map" data-official-flow="marker-carousel-detail">
      <div className="b225-map-top">
        <button type="button" className="b225-map-search" onClick={() => onNavigate('/')} aria-label="Modifier la recherche">
          <SearchIcon />
          <span className="b225-map-search__copy"><strong>Explorer la carte</strong><span>Grand Tunis · Dates · Voyageurs</span></span>
          <span className="b225-map-filter-button" aria-hidden="true">≡</span>
        </button>
        <div className="b225-map-categories" aria-label="Filtres de carte">
          {homeCategories.map((item) => (
            <button key={item.id} type="button" data-active={category === item.id ? 'true' : 'false'} onClick={() => setCategory(item.id)}>{item.label}</button>
          ))}
        </div>
      </div>

      <MapContainer
        markers={DEFAULT_MARKERS}
        selectedListingId={selectedListingId}
        onSelectedListingChange={selectListing}
        initialViewport={restored?.viewport || INITIAL_VIEWPORT}
        onViewportChange={setViewport}
      />

      {!selectedListingId ? <div className="b225-map-badge">Déplacez la carte pour explorer</div> : null}

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

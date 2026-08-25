import { MAP_AMENITY_FILTERS, MAP_PROPERTY_FILTERS } from './mapListingFilters.js'
import './map-search-filters.css'

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10.5 8.5-7 8.5 7"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></svg>
}

function TuneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>
}

function AmenityIcon({ id }) {
  if (id === 'wifi') return <span aria-hidden="true">⌁</span>
  if (id === 'pool') return <span aria-hidden="true">≈</span>
  if (id === 'parking') return <span aria-hidden="true">P</span>
  if (id === 'ac') return <span aria-hidden="true">❄</span>
  return <span aria-hidden="true">♡</span>
}

export function MapSearchFilters({
  cityLabel,
  propertyFilter,
  amenityFilters,
  resultCount,
  onHome,
  onPropertyFilterChange,
  onAmenityFilterToggle,
  onResetFilters,
}) {
  const activeFilterCount = (propertyFilter ? 1 : 0) + amenityFilters.size

  return (
    <div className="map-search-filter-stack" data-testid="map-search-filter-stack">
      <div className="b225-map-search map-search-filter-stack__search">
        <button type="button" className="b225-map-search__main" onClick={onHome} aria-label="Modifier la recherche">
          <span className="map-search-filter-stack__search-icon"><SearchIcon /></span>
          <span className="b225-map-search__copy">
            <strong>{cityLabel}</strong>
            <span>{resultCount} offre{resultCount === 1 ? '' : 's'} · Dates · Voyageurs</span>
          </span>
        </button>
        {activeFilterCount ? (
          <button type="button" className="map-search-filter-stack__reset" onClick={onResetFilters} aria-label="Réinitialiser les filtres">
            <TuneIcon />
            <span>{activeFilterCount}</span>
          </button>
        ) : null}
        <button type="button" className="b225-map-home-button" onClick={onHome} aria-label="Retour à l’accueil">
          <HomeIcon />
        </button>
      </div>

      <div className="map-filter-row map-filter-row--property" aria-label="Type de logement">
        <span className="map-filter-row__label">Séjour</span>
        <div className="map-filter-rail map-filter-rail--property" data-testid="map-property-filters">
          {MAP_PROPERTY_FILTERS.map((filter) => {
            const active = propertyFilter === filter.id
            return (
              <button
                key={filter.id}
                type="button"
                className="map-filter-chip map-filter-chip--property"
                data-filter-id={filter.id}
                data-active={active ? 'true' : 'false'}
                aria-pressed={active}
                onClick={() => onPropertyFilterChange(active ? null : filter.id)}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="map-filter-row map-filter-row--amenity" aria-label="Équipements">
        <span className="map-filter-row__label map-filter-row__label--amenity">Confort</span>
        <div className="map-filter-rail map-filter-rail--amenities" data-testid="map-amenity-filters">
          {MAP_AMENITY_FILTERS.map((filter) => {
            const active = amenityFilters.has(filter.id)
            return (
              <button
                key={filter.id}
                type="button"
                className="map-filter-chip map-filter-chip--amenity"
                data-filter-id={filter.id}
                data-active={active ? 'true' : 'false'}
                aria-pressed={active}
                onClick={() => onAmenityFilterToggle(filter.id)}
              >
                <AmenityIcon id={filter.id} />
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

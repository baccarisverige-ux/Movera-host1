import { MAP_AMENITY_FILTERS, MAP_PROPERTY_FILTERS } from './mapListingFilters.js'
import './map-search-filters.css'

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
}

function TuneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>
}

export function MapSearchFilters({
  cityLabel,
  propertyFilter,
  amenityFilters,
  onHome,
  onPropertyFilterChange,
  onAmenityFilterToggle,
  onResetFilters,
}) {
  const activeFilterCount = (propertyFilter ? 1 : 0) + amenityFilters.size

  return (
    <div className="map-search-filter-stack" data-testid="map-search-filter-stack">
      <div className="map-search-filter-stack__toolbar">
        <button
          type="button"
          className="map-search-filter-stack__side-button map-search-filter-stack__back"
          onClick={onHome}
          aria-label="Retour à l’accueil"
        >
          <BackIcon />
        </button>

        <button
          type="button"
          className="map-search-filter-stack__search-pill"
          onClick={onHome}
          aria-label="Modifier la recherche"
        >
          <strong>Logements à {cityLabel}</strong>
          <span>Dates · Voyageurs</span>
        </button>

        <button
          type="button"
          className="map-search-filter-stack__side-button map-search-filter-stack__filter-button"
          onClick={onResetFilters}
          aria-label={activeFilterCount ? 'Réinitialiser les filtres' : 'Filtres'}
        >
          <TuneIcon />
          {activeFilterCount ? <span className="map-search-filter-stack__filter-count">{activeFilterCount}</span> : null}
        </button>
      </div>

      <div className="map-filter-rail map-filter-rail--quick" data-testid="map-quick-filters" aria-label="Filtres rapides">
        <div className="map-filter-group" data-testid="map-property-filters">
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

        <div className="map-filter-group map-filter-group--amenities" data-testid="map-amenity-filters">
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
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

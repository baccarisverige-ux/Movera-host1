import {
  ArrowLeftIcon,
  ParkingIcon,
  PawPrintIcon,
  SlidersHorizontalIcon,
  SnowflakeIcon,
  WavesIcon,
  WifiIcon,
} from '../../shared/icons/AppIcons.jsx'
import { MAP_AMENITY_FILTERS } from './mapListingFilters.js'
import './map-search-filters.css'

const AMENITY_ICON_BY_ID = Object.freeze({
  wifi: WifiIcon,
  pool: WavesIcon,
  parking: ParkingIcon,
  ac: SnowflakeIcon,
  pet: PawPrintIcon,
})

export function MapSearchFilters({
  cityLabel,
  amenityFilters,
  onHome,
  onAmenityFilterToggle,
  onResetFilters,
}) {
  const activeFilterCount = amenityFilters.size

  return (
    <div className="map-search-filter-stack" data-testid="map-search-filter-stack">
      <div className="map-search-filter-stack__toolbar">
        <button
          type="button"
          className="map-search-filter-stack__side-button map-search-filter-stack__back"
          onClick={onHome}
          aria-label="Retour à l’accueil"
        >
          <ArrowLeftIcon />
        </button>

        <button
          type="button"
          className="map-search-filter-stack__search-pill"
          onClick={onHome}
          aria-label="Modifier la recherche"
        >
          <strong>Logements à {cityLabel}</strong>
        </button>

        <button
          type="button"
          className="map-search-filter-stack__side-button map-search-filter-stack__filter-button"
          onClick={activeFilterCount ? onResetFilters : undefined}
          aria-label={activeFilterCount ? 'Réinitialiser les filtres' : 'Filtres'}
        >
          <SlidersHorizontalIcon />
          {activeFilterCount ? <span className="map-search-filter-stack__filter-count">{activeFilterCount}</span> : null}
        </button>
      </div>

      <div className="map-filter-rail map-filter-rail--amenities" data-testid="map-amenity-filters" aria-label="Équipements">
        {MAP_AMENITY_FILTERS.map((filter) => {
          const active = amenityFilters.has(filter.id)
          const AmenityIcon = AMENITY_ICON_BY_ID[filter.id]
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
              {AmenityIcon ? <AmenityIcon className="map-filter-chip__icon" /> : null}
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

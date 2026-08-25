import { MotionList, MotionListItem } from '../../shared/motion/MotionList.jsx'
import { MapOfferSheetMotionSurface } from './motion/MapOfferSheetMotionSurface.jsx'
import { MAP_OFFER_ITEM_MOTION } from './motion/mapOfferSheetMotion.config.js'
import { useMapOfferScrollEdgeGuard } from './motion/useMapOfferScrollEdgeGuard.js'
import './map-offer-sheet.css'

function ChevronIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 14 5-5 5 5" /></svg>
}

function StarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z" /></svg>
}

function MapOfferSheetContent({
  listings,
  cityLabel,
  selectedListingId,
  onSelectedListingChange,
  progress,
  startDrag,
  toggleExpanded,
}) {
  const listRef = useMapOfferScrollEdgeGuard()

  const selectListing = (listingId) => {
    onSelectedListingChange?.(listingId)
  }

  return (
    <>
      <div
        className="map-offer-sheet__drag-zone"
        data-testid="map-offer-sheet-handle"
        onPointerDown={startDrag}
      >
        <button type="button" className="map-offer-sheet__handle-button" onClick={toggleExpanded} aria-label={progress > 0.72 ? 'Réduire la liste des offres' : 'Afficher la liste des offres'}>
          <span className="map-offer-sheet__grabber" />
          <span className="map-offer-sheet__heading">
            <strong>{listings.length ? `${listings.length} offre${listings.length > 1 ? 's' : ''}` : 'Aucune offre'}</strong>
            <span>{cityLabel}</span>
          </span>
          <span className="map-offer-sheet__chevron" data-open={progress > 0.72 ? 'true' : 'false'}><ChevronIcon /></span>
        </button>
      </div>

      {listings.length ? (
        <MotionList
          nodeRef={listRef}
          className="map-offer-sheet__list"
          data-scroll-enabled={progress > 0.86 ? 'true' : 'false'}
          data-motion-list="map-offers"
          data-map-scroll="independent"
          data-overscroll-guard="edge"
        >
          {listings.map((listing, index) => {
            const selected = listing.id === selectedListingId || (!selectedListingId && index === 0 && progress > 0.12)
            return (
              <MotionListItem
                as="button"
                type="button"
                key={listing.id}
                index={index}
                active={selected}
                config={MAP_OFFER_ITEM_MOTION}
                className="map-offer-sheet__card"
                data-listing-id={listing.id}
                data-active={selected ? 'true' : 'false'}
                onClick={() => selectListing(listing.id)}
              >
                <span className="map-offer-sheet__media">
                  <img src={listing.image} alt="" loading={index < 2 ? 'eager' : 'lazy'} />
                  {listing.badge ? <span className="map-offer-sheet__badge">{listing.badge}</span> : null}
                  <span className="map-offer-sheet__position" aria-hidden="true">{index + 1}/{listings.length}</span>
                </span>
                <span className="map-offer-sheet__card-copy">
                  <span className="map-offer-sheet__card-head">
                    <span>
                      <strong>{listing.title}</strong>
                      <small>{listing.location}, Tunisie</small>
                    </span>
                    <span className="map-offer-sheet__rating"><StarIcon />{listing.rating}</span>
                  </span>
                  <span className="map-offer-sheet__price"><b>{listing.price} {listing.currency}</b> <span>/ nuit</span></span>
                </span>
              </MotionListItem>
            )
          })}
        </MotionList>
      ) : (
        <div className="map-offer-sheet__empty">
          <strong>Aucune offre Movera dans cette ville</strong>
          <span>La carte reste disponible pour explorer la zone.</span>
        </div>
      )}
    </>
  )
}

export function MapOfferSheet({
  listings,
  cityLabel,
  selectedListingId,
  onSelectedListingChange,
  onProgressChange,
}) {
  return (
    <MapOfferSheetMotionSurface
      className="map-offer-sheet"
      ariaLabel={`Offres ${cityLabel}`}
      onProgressChange={onProgressChange}
    >
      {({ progress, startDrag, toggleExpanded }) => (
        <MapOfferSheetContent
          listings={listings}
          cityLabel={cityLabel}
          selectedListingId={selectedListingId}
          onSelectedListingChange={onSelectedListingChange}
          progress={progress}
          startDrag={startDrag}
          toggleExpanded={toggleExpanded}
        />
      )}
    </MapOfferSheetMotionSurface>
  )
}

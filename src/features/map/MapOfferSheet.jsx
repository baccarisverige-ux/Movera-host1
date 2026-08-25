import { useEffect, useMemo, useRef, useState } from 'react'
import './map-offer-sheet.css'

const COLLAPSED_TRANSLATE_PERCENT = 91
const DRAG_DISTANCE_PX = 520
const DRAG_CLICK_SUPPRESS_PX = 8
const SNAP_POINTS = [0, 0.5, 1]

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function nearestSnap(value) {
  return SNAP_POINTS.reduce((best, point) => Math.abs(point - value) < Math.abs(best - value) ? point : best, SNAP_POINTS[0])
}

function ChevronIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 14 5-5 5 5" /></svg>
}

function StarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3Z" /></svg>
}

export function MapOfferSheet({
  listings,
  cityLabel,
  selectedListingId,
  onSelectedListingChange,
  onProgressChange,
}) {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)
  const listRef = useRef(null)
  const scrollFrameRef = useRef(0)
  const lastActiveRef = useRef(selectedListingId || null)
  const progressChangeRef = useRef(onProgressChange)
  const selectedChangeRef = useRef(onSelectedListingChange)

  const selectedIndex = useMemo(() => listings.findIndex((listing) => listing.id === selectedListingId), [listings, selectedListingId])

  useEffect(() => { progressChangeRef.current = onProgressChange }, [onProgressChange])
  useEffect(() => { selectedChangeRef.current = onSelectedListingChange }, [onSelectedListingChange])
  useEffect(() => { lastActiveRef.current = selectedListingId || null }, [selectedListingId])
  useEffect(() => () => cancelAnimationFrame(scrollFrameRef.current), [])

  useEffect(() => {
    if (selectedIndex < 0 || progress < 0.86 || !listRef.current) return
    const card = listRef.current.querySelector(`[data-listing-id="${selectedListingId}"]`)
    card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex, selectedListingId, progress])

  const commitProgress = (nextValue) => {
    const next = clamp(nextValue)
    progressRef.current = next
    setProgress(next)
    progressChangeRef.current?.(next)
  }

  const startDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return
    suppressClickRef.current = false
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startProgress: progressRef.current,
      maxDistance: 0,
    }
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* synthetic pointer */ }
  }

  const moveDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    const deltaUp = drag.startY - event.clientY
    drag.maxDistance = Math.max(drag.maxDistance, Math.abs(deltaUp))
    if (drag.maxDistance >= DRAG_CLICK_SUPPRESS_PX) suppressClickRef.current = true
    commitProgress(drag.startProgress + deltaUp / DRAG_DISTANCE_PX)
  }

  const endDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (drag.maxDistance >= DRAG_CLICK_SUPPRESS_PX) suppressClickRef.current = true
    dragRef.current = null
    try { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) } catch { /* synthetic pointer */ }
    commitProgress(nearestSnap(progressRef.current))
  }

  const toggleExpanded = (event) => {
    if (suppressClickRef.current) {
      event.preventDefault()
      suppressClickRef.current = false
      return
    }
    commitProgress(progressRef.current > 0.72 ? 0 : 1)
  }

  const selectListing = (listingId) => {
    lastActiveRef.current = listingId
    selectedChangeRef.current?.(listingId)
  }

  const handleListScroll = () => {
    if (progressRef.current < 0.86 || !listRef.current) return
    cancelAnimationFrame(scrollFrameRef.current)
    scrollFrameRef.current = requestAnimationFrame(() => {
      const cards = [...listRef.current.querySelectorAll('[data-listing-id]')]
      if (!cards.length) return
      const listTop = listRef.current.getBoundingClientRect().top
      let nearest = cards[0]
      let nearestDistance = Infinity
      for (const card of cards) {
        const distance = Math.abs(card.getBoundingClientRect().top - listTop)
        if (distance < nearestDistance) {
          nearest = card
          nearestDistance = distance
        }
      }
      const nextId = nearest.dataset.listingId
      if (nextId && nextId !== lastActiveRef.current) selectListing(nextId)
    })
  }

  const translate = (1 - progress) * COLLAPSED_TRANSLATE_PERCENT
  const roundedProgress = Math.round(progress * 100) / 100

  return (
    <section
      className="map-offer-sheet"
      data-testid="map-offer-sheet"
      data-progress={roundedProgress}
      data-expanded={progress > 0.86 ? 'true' : 'false'}
      style={{ transform: `translateY(${translate}%)` }}
      aria-label={`Offres ${cityLabel}`}
    >
      <div
        className="map-offer-sheet__drag-zone"
        data-testid="map-offer-sheet-handle"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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
        <div
          ref={listRef}
          className="map-offer-sheet__list"
          data-scroll-enabled={progress > 0.86 ? 'true' : 'false'}
          onScroll={handleListScroll}
        >
          {listings.map((listing, index) => {
            const selected = listing.id === selectedListingId || (!selectedListingId && index === 0 && progress > 0.12)
            return (
              <button
                type="button"
                key={listing.id}
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
              </button>
            )
          })}
        </div>
      ) : (
        <div className="map-offer-sheet__empty">
          <strong>Aucune offre Movera dans cette ville</strong>
          <span>La carte reste disponible pour explorer la zone.</span>
        </div>
      )}
    </section>
  )
}

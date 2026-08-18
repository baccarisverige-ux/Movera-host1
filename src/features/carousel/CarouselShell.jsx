import { useEffect, useMemo, useRef, useState } from 'react'
import { CAROUSEL_LISTINGS } from './carouselData.js'
import { ImagePager } from './ImagePager.jsx'
import '../../styles/carousel.css'

const clampIndex = (value, length) => Math.max(0, Math.min(length - 1, value))

export function Controls({ open, onOpen, onClose, onPrevious, onNext }) {
  if (!open) return <button className="carousel-launch" data-testid="carousel-open" type="button" onClick={onOpen}>Voir les offres</button>
  return (
    <div className="carousel-controls" data-testid="carousel-controls">
      <button type="button" aria-label="Offre précédente" onClick={onPrevious}>‹</button>
      <button type="button" aria-label="Fermer le carousel" onClick={onClose}>×</button>
      <button type="button" aria-label="Offre suivante" onClick={onNext}>›</button>
    </div>
  )
}

export function GestureController({ children, onListingSwipe, onPhotoSwipe, onGestureState }) {
  const startRef = useRef(null)
  const pointerIdRef = useRef(null)

  const finish = (event, cancelled = false) => {
    if (pointerIdRef.current !== event.pointerId) return
    const start = startRef.current
    pointerIdRef.current = null
    startRef.current = null
    if (!start || cancelled) {
      onGestureState('open')
      return
    }
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    const ax = Math.abs(dx)
    const ay = Math.abs(dy)
    if (Math.max(ax, ay) < 38) {
      onGestureState('snapping')
      requestAnimationFrame(() => onGestureState('open'))
      return
    }
    onGestureState('snapping')
    if (ax >= ay) onListingSwipe(dx < 0 ? 1 : -1)
    else onPhotoSwipe(dy < 0 ? 1 : -1)
    requestAnimationFrame(() => onGestureState('open'))
  }

  return (
    <div
      className="carousel-gesture"
      data-testid="carousel-gesture"
      onPointerDown={(event) => {
        if (event.target.closest('button,a,input')) return
        pointerIdRef.current = event.pointerId
        startRef.current = { x: event.clientX, y: event.clientY }
        onGestureState('dragging')
        try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* synthetic pointer */ }
      }}
      onPointerUp={(event) => finish(event)}
      onPointerCancel={(event) => finish(event, true)}
    >
      {children}
    </div>
  )
}

export function ListingSlide({ listing, imageIndex }) {
  const image = listing.images[imageIndex]
  return (
    <article className="carousel-slide" data-testid={`carousel-listing-${listing.id}`}>
      <div className={`carousel-slide__visual tone-${image.tone}`} data-testid="carousel-photo">
        <span>{image.label}</span>
      </div>
      <ImagePager count={listing.images.length} index={imageIndex} />
      <div className="carousel-slide__copy">
        <h2>{listing.title}</h2>
        <p>{listing.price}</p>
      </div>
    </article>
  )
}

export function CarouselTrack({ listing, imageIndex, listingIndex }) {
  return (
    <div className="carousel-track" data-testid="carousel-track" data-listing-index={listingIndex} data-image-index={imageIndex}>
      <ListingSlide listing={listing} imageIndex={imageIndex} />
    </div>
  )
}

export function CarouselShell({ listings = CAROUSEL_LISTINGS }) {
  const [phase, setPhase] = useState('closed')
  const [listingIndex, setListingIndex] = useState(0)
  const [imageIndexes, setImageIndexes] = useState(() => listings.map(() => 0))
  const open = phase !== 'closed' && phase !== 'closing'
  const listing = listings[listingIndex]
  const imageIndex = imageIndexes[listingIndex] || 0

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return undefined
    const timer = window.setTimeout(() => setPhase(phase === 'opening' ? 'open' : 'closed'), 90)
    return () => window.clearTimeout(timer)
  }, [phase])

  const moveListing = (delta) => setListingIndex((current) => clampIndex(current + delta, listings.length))
  const movePhoto = (delta) => setImageIndexes((current) => {
    const next = [...current]
    next[listingIndex] = clampIndex((next[listingIndex] || 0) + delta, listing.images.length)
    return next
  })

  const stateLabel = useMemo(() => `${phase}:${listingIndex}:${imageIndex}`, [phase, listingIndex, imageIndex])

  return (
    <section className={`carousel-shell is-${phase}`} data-testid="carousel-shell" data-carousel-state={phase} data-state-label={stateLabel}>
      <Controls
        open={open}
        onOpen={() => setPhase('opening')}
        onClose={() => setPhase('closing')}
        onPrevious={() => moveListing(-1)}
        onNext={() => moveListing(1)}
      />
      {open ? (
        <GestureController onListingSwipe={moveListing} onPhotoSwipe={movePhoto} onGestureState={setPhase}>
          <CarouselTrack listing={listing} imageIndex={imageIndex} listingIndex={listingIndex} />
        </GestureController>
      ) : null}
    </section>
  )
}

export function CarouselLab() {
  return (
    <section className="carousel-lab" data-testid="page-carousel-lab">
      <p className="route-page__eyebrow">Phase 8 · Isolation</p>
      <h1>Carousel indépendant</h1>
      <p className="carousel-lab__intro">Validation du carousel sans moteur de carte.</p>
      <CarouselShell />
      <div className="carousel-scroll-probe" data-testid="carousel-scroll-probe">Zone de scroll indépendante</div>
    </section>
  )
}

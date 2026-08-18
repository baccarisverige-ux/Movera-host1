import { useEffect, useMemo, useRef, useState } from 'react'
import { CAROUSEL_LISTINGS } from './carouselData.js'
import { ImagePager } from './ImagePager.jsx'
import { GESTURE, resolveGesture, SWIPE_THRESHOLD } from './gestureArbitration.js'
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

export function GestureController({ children, onListingSwipe, onPhotoSwipe, onGestureState, onGestureLock }) {
  const pointersRef = useRef(new Map())
  const startRef = useRef(null)
  const lockRef = useRef(GESTURE.NONE)

  const cleanup = (event, cancelled = false) => {
    pointersRef.current.delete(event.pointerId)
    if (pointersRef.current.size > 0) return
    const start = startRef.current
    const lock = lockRef.current
    startRef.current = null
    lockRef.current = GESTURE.NONE
    onGestureLock(GESTURE.NONE)
    if (!start || cancelled) {
      onGestureState('open')
      return
    }
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    onGestureState('snapping')
    if (lock === GESTURE.LISTING && Math.abs(dx) >= SWIPE_THRESHOLD) onListingSwipe(dx < 0 ? 1 : -1)
    if (lock === GESTURE.PHOTO && Math.abs(dy) >= SWIPE_THRESHOLD) onPhotoSwipe(dy < 0 ? 1 : -1)
    requestAnimationFrame(() => onGestureState('open'))
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    } catch { /* capture may already be released */ }
  }

  return (
    <div
      className="carousel-gesture"
      data-testid="carousel-gesture"
      data-gesture-lock={lockRef.current}
      onPointerDown={(event) => {
        if (event.target.closest('button,a,input')) return
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
        if (!startRef.current) startRef.current = { x: event.clientX, y: event.clientY }
        if (pointersRef.current.size >= 2) {
          lockRef.current = GESTURE.PINCH
          onGestureLock(GESTURE.PINCH)
        }
        onGestureState('dragging')
        try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* synthetic pointer */ }
      }}
      onPointerMove={(event) => {
        if (!pointersRef.current.has(event.pointerId) || !startRef.current) return
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
        if (lockRef.current === GESTURE.NONE) {
          const dx = event.clientX - startRef.current.x
          const dy = event.clientY - startRef.current.y
          const next = resolveGesture({ pointerCount: pointersRef.current.size, insideCarousel: true, dx, dy })
          if (next !== GESTURE.NONE) {
            lockRef.current = next
            onGestureLock(next)
          }
        }
        if (lockRef.current !== GESTURE.NONE) event.preventDefault()
      }}
      onPointerUp={(event) => cleanup(event)}
      onPointerCancel={(event) => cleanup(event, true)}
      onLostPointerCapture={(event) => cleanup(event, true)}
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

export function CarouselShell({ listings = CAROUSEL_LISTINGS, onGestureLock = () => {} }) {
  const [phase, setPhase] = useState('closed')
  const [listingIndex, setListingIndex] = useState(0)
  const [imageIndexes, setImageIndexes] = useState(() => listings.map(() => 0))
  const [gestureLock, setGestureLock] = useState(GESTURE.NONE)
  const open = phase !== 'closed' && phase !== 'closing'
  const listing = listings[listingIndex]
  const imageIndex = imageIndexes[listingIndex] || 0

  useEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return undefined
    const timer = window.setTimeout(() => setPhase(phase === 'opening' ? 'open' : 'closed'), 90)
    return () => window.clearTimeout(timer)
  }, [phase])

  const updateGestureLock = (next) => {
    setGestureLock(next)
    onGestureLock(next)
  }

  const moveListing = (delta) => setListingIndex((current) => clampIndex(current + delta, listings.length))
  const movePhoto = (delta) => setImageIndexes((current) => {
    const next = [...current]
    next[listingIndex] = clampIndex((next[listingIndex] || 0) + delta, listing.images.length)
    return next
  })

  const stateLabel = useMemo(() => `${phase}:${listingIndex}:${imageIndex}:${gestureLock}`, [phase, listingIndex, imageIndex, gestureLock])

  return (
    <section className={`carousel-shell is-${phase}`} data-testid="carousel-shell" data-carousel-state={phase} data-gesture-lock={gestureLock} data-state-label={stateLabel}>
      <Controls
        open={open}
        onOpen={() => setPhase('opening')}
        onClose={() => setPhase('closing')}
        onPrevious={() => moveListing(-1)}
        onNext={() => moveListing(1)}
      />
      {open ? (
        <GestureController onListingSwipe={moveListing} onPhotoSwipe={movePhoto} onGestureState={setPhase} onGestureLock={updateGestureLock}>
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

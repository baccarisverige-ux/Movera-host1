import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { SEARCH_DESTINATIONS } from './searchData.js'
import { buildMapSearchPath, createSearchState, isDateRangeValid } from './searchState.js'
import './searchTransition.css'

const OPEN_MS = 860
const COMPLETE_MS = 560

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="14" rx="3"/><path d="M8 3v5M16 3v5M4 10h16"/></svg>
}

function formatDate(value) {
  if (!value) return 'À choisir'
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
}

export function SearchTransitionHost({ onNavigate }) {
  const [active, setActive] = useState(false)
  const [open, setOpen] = useState(false)
  const [complete, setComplete] = useState(false)
  const [step, setStep] = useState('destination')
  const [state, setState] = useState(createSearchState)
  const [origin, setOrigin] = useState({ top: 72, left: 14, width: 362, height: 52 })
  const [destinationQuery, setDestinationQuery] = useState('')
  const closeTimerRef = useRef(0)
  const completeTimerRef = useRef(0)
  const stepTimerRef = useRef(0)

  const selectedViewport = state.destination?.viewport || INITIAL_VIEWPORT
  const datesValid = isDateRangeValid(state.checkin, state.checkout)
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const filteredDestinations = useMemo(() => {
    const query = destinationQuery.trim().toLocaleLowerCase('fr')
    if (!query) return SEARCH_DESTINATIONS
    return SEARCH_DESTINATIONS.filter((destination) => `${destination.label} ${destination.subtitle}`.toLocaleLowerCase('fr').includes(query))
  }, [destinationQuery])

  const clearTimers = () => {
    window.clearTimeout(closeTimerRef.current)
    window.clearTimeout(completeTimerRef.current)
    window.clearTimeout(stepTimerRef.current)
  }

  const closeTransition = () => {
    if (!active || complete) return
    clearTimers()
    setOpen(false)
    closeTimerRef.current = window.setTimeout(() => {
      setActive(false)
      setDestinationQuery('')
    }, OPEN_MS)
  }

  useEffect(() => {
    const onSearchClick = (event) => {
      if (active) return
      const trigger = event.target.closest('.b225-search')
      if (!trigger || !document.querySelector('[data-testid="page-home"]')) return
      event.preventDefault()
      event.stopPropagation()
      clearTimers()
      const rect = trigger.getBoundingClientRect()
      setOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      setState(createSearchState())
      setDestinationQuery('')
      setStep('destination')
      setComplete(false)
      setActive(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
    }
    document.addEventListener('click', onSearchClick, true)
    return () => document.removeEventListener('click', onSearchClick, true)
  }, [active])

  useEffect(() => {
    if (!active) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [active])

  useEffect(() => {
    if (!active) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeTransition()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, complete])

  useEffect(() => () => clearTimers(), [])

  const chooseDestination = (destination) => {
    clearTimers()
    setState((current) => ({ ...current, destination }))
    stepTimerRef.current = window.setTimeout(() => setStep('dates'), 220)
  }

  const submitSearch = () => {
    if (!state.destination || !datesValid || state.adults < 1) return
    clearTimers()
    setComplete(true)
    setOpen(false)
    const path = buildMapSearchPath(state)
    completeTimerRef.current = window.setTimeout(() => {
      onNavigate(path)
      setActive(false)
      setComplete(false)
      setDestinationQuery('')
    }, COMPLETE_MS)
  }

  if (!active) return null

  const rootStyle = {
    '--st-origin-top': `${origin.top}px`,
    '--st-origin-left': `${origin.left}px`,
    '--st-origin-width': `${origin.width}px`,
    '--st-origin-height': `${origin.height}px`,
  }

  const rootClass = ['movera-st', open ? 'movera-st--open' : '', complete ? 'movera-st--complete' : ''].filter(Boolean).join(' ')
  const stepIndex = step === 'destination' ? 1 : step === 'dates' ? 2 : 3

  return createPortal(
    <div className={rootClass} style={rootStyle} data-testid="search-transition" data-step={step}>
      <div className="movera-st__map-stage" aria-hidden="true">
        <MapContainer key={state.destination?.id || 'search-default'} initialViewport={selectedViewport} />
      </div>
      <div className="movera-st__map-veil" aria-hidden="true" />

      <section className="movera-st__panel" role="dialog" aria-modal="true" aria-label="Recherche Movera">
        <div className="movera-st__shine" aria-hidden="true" />
        <div className="movera-st__content">
          <div className="movera-st__topline">
            <span className="movera-st__brandmark" aria-hidden="true"><span /></span>
            <div className="movera-st__brandcopy"><strong>Movera</strong><span>Votre séjour, simplement</span></div>
            <span className="movera-st__progress">{stepIndex}/3</span>
            <button type="button" className="movera-st__close" onClick={closeTransition} aria-label="Fermer">×</button>
          </div>

          <div className="movera-st__steps" aria-label="Étapes de recherche">
            <button type="button" className="movera-st__step" data-active={step === 'destination'} data-complete={Boolean(state.destination)} onClick={() => setStep('destination')}><span>1</span>Destination</button>
            <button type="button" className="movera-st__step" data-active={step === 'dates'} data-complete={datesValid} disabled={!state.destination} onClick={() => state.destination && setStep('dates')}><span>2</span>Dates</button>
            <button type="button" className="movera-st__step" data-active={step === 'guests'} disabled={!datesValid} onClick={() => datesValid && setStep('guests')}><span>3</span>Voyageurs</button>
          </div>

          <div className="movera-st__body">
            {step === 'destination' ? (
              <div className="movera-st__screen" data-testid="search-step-destination">
                <div className="movera-st__screen-head"><div><h2 className="movera-st__title">Où allez-vous ?</h2><p className="movera-st__sub">Trouvez votre prochaine adresse Movera.</p></div><PinIcon /></div>
                <label className="movera-st__destination-search">
                  <SearchIcon />
                  <input value={destinationQuery} onChange={(event) => setDestinationQuery(event.target.value)} placeholder="Rechercher une destination" autoComplete="off" />
                </label>
                <div className="movera-st__destinations">
                  {filteredDestinations.map((destination) => (
                    <button key={destination.id} type="button" className="movera-st__destination" data-destination={destination.id} onClick={() => chooseDestination(destination)}>
                      <span className="movera-st__destination-pin"><PinIcon /></span>
                      <span className="movera-st__destination-copy"><strong>{destination.label}</strong><small>{destination.subtitle}</small></span>
                      <span className="movera-st__chevron" aria-hidden="true">›</span>
                    </button>
                  ))}
                  {filteredDestinations.length === 0 ? <div className="movera-st__empty">Aucune destination trouvée</div> : null}
                </div>
              </div>
            ) : null}

            {step === 'dates' ? (
              <div className="movera-st__screen" data-testid="search-step-dates">
                <div className="movera-st__screen-head"><div><h2 className="movera-st__title">Vos dates</h2><p className="movera-st__sub">{state.destination?.label} · arrivée puis départ.</p></div><CalendarIcon /></div>
                <div className="movera-st__date-grid">
                  <label className="movera-st__field"><span className="movera-st__field-label">Arrivée</span><strong>{formatDate(state.checkin)}</strong><input aria-label="Date d'arrivée" type="date" min={minDate} value={state.checkin} onChange={(event) => setState((current) => ({ ...current, checkin: event.target.value, checkout: current.checkout && current.checkout <= event.target.value ? '' : current.checkout }))} /></label>
                  <label className="movera-st__field"><span className="movera-st__field-label">Départ</span><strong>{formatDate(state.checkout)}</strong><input aria-label="Date de départ" type="date" min={state.checkin || minDate} value={state.checkout} onChange={(event) => setState((current) => ({ ...current, checkout: event.target.value }))} /></label>
                </div>
                <div className="movera-st__tripline"><span>{state.destination?.label}</span><i /><strong>{formatDate(state.checkin)} → {formatDate(state.checkout)}</strong></div>
                <button type="button" className="movera-st__action" disabled={!datesValid} onClick={() => setStep('guests')}>Continuer vers les voyageurs <span>›</span></button>
              </div>
            ) : null}

            {step === 'guests' ? (
              <div className="movera-st__screen" data-testid="search-step-guests">
                <div className="movera-st__screen-head"><div><h2 className="movera-st__title">Voyageurs</h2><p className="movera-st__sub">Dernière étape avant la carte.</p></div><span className="movera-st__people" aria-hidden="true">••</span></div>
                <div className="movera-st__guest-card">
                  <div className="movera-st__guest-copy"><strong>Adultes</strong><span>13 ans et plus</span></div>
                  <div className="movera-st__counter">
                    <button type="button" aria-label="Retirer un adulte" disabled={state.adults <= 1} onClick={() => setState((current) => ({ ...current, adults: Math.max(1, current.adults - 1) }))}>−</button>
                    <strong data-testid="search-adult-count">{state.adults}</strong>
                    <button type="button" aria-label="Ajouter un adulte" disabled={state.adults >= 16} onClick={() => setState((current) => ({ ...current, adults: Math.min(16, current.adults + 1) }))}>+</button>
                  </div>
                </div>
                <div className="movera-st__tripline"><span>{state.destination?.label}</span><i /><strong>{formatDate(state.checkin)} → {formatDate(state.checkout)}</strong><i /><span>{state.adults} adulte{state.adults > 1 ? 's' : ''}</span></div>
                <button type="button" className="movera-st__action movera-st__action--search" onClick={submitSearch}><SearchIcon /><span>Rechercher sur la carte</span></button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}

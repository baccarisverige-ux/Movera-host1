import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { INITIAL_VIEWPORT, MapContainer } from '../map-engine/MapContainer.jsx'
import { SEARCH_DESTINATIONS } from './searchData.js'
import { buildMapSearchPath, createSearchState, isDateRangeValid } from './searchState.js'
import './searchTransition.css'

const OPEN_MS = 720
const COMPLETE_MS = 520

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" style={{width:15,height:15,fill:'none',stroke:'currentColor',strokeWidth:2,verticalAlign:'middle',marginRight:6}}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
}

function formatDate(value) {
  if (!value) return '—'
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

  const selectedViewport = state.destination?.viewport || INITIAL_VIEWPORT
  const datesValid = isDateRangeValid(state.checkin, state.checkout)
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    const onSearchClick = (event) => {
      if (active) return
      const trigger = event.target.closest('.b225-search')
      if (!trigger || !document.querySelector('[data-testid="page-home"]')) return
      event.preventDefault()
      event.stopPropagation()
      const rect = trigger.getBoundingClientRect()
      setOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      setState(createSearchState())
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
  })

  const closeTransition = () => {
    if (!active || complete) return
    setOpen(false)
    window.setTimeout(() => setActive(false), OPEN_MS)
  }

  const chooseDestination = (destination) => {
    setState((current) => ({ ...current, destination }))
    window.setTimeout(() => setStep('dates'), 180)
  }

  const submitSearch = () => {
    if (!state.destination || !datesValid || state.adults < 1) return
    setComplete(true)
    setOpen(false)
    const path = buildMapSearchPath(state)
    window.setTimeout(() => {
      onNavigate(path)
      setActive(false)
      setComplete(false)
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

  return createPortal(
    <div className={rootClass} style={rootStyle} data-testid="search-transition" data-step={step}>
      <div className="movera-st__map-stage" aria-hidden="true">
        <MapContainer key={state.destination?.id || 'search-default'} initialViewport={selectedViewport} />
      </div>
      <div className="movera-st__ghost" aria-hidden="true" />
      <section className="movera-st__panel" role="dialog" aria-modal="true" aria-label="Recherche Movera">
        <div className="movera-st__content">
          <div className="movera-st__topline">
            <span className="movera-st__eyebrow">Recherche Movera</span>
            <button type="button" className="movera-st__close" onClick={closeTransition} aria-label="Fermer">×</button>
          </div>

          <div className="movera-st__steps" aria-label="Étapes de recherche">
            <button type="button" className="movera-st__step" data-active={step === 'destination'} onClick={() => setStep('destination')}>Destination</button>
            <button type="button" className="movera-st__step" data-active={step === 'dates'} disabled={!state.destination} onClick={() => state.destination && setStep('dates')}>Dates</button>
            <button type="button" className="movera-st__step" data-active={step === 'guests'} disabled={!datesValid} onClick={() => datesValid && setStep('guests')}>Voyageurs</button>
          </div>

          <div className="movera-st__body">
            {step === 'destination' ? (
              <div className="movera-st__screen" data-testid="search-step-destination">
                <h2 className="movera-st__title">Où allez-vous ?</h2>
                <p className="movera-st__sub">Choisissez votre destination Movera.</p>
                <div className="movera-st__destinations">
                  {SEARCH_DESTINATIONS.map((destination) => (
                    <button key={destination.id} type="button" className="movera-st__destination" data-destination={destination.id} onClick={() => chooseDestination(destination)}>
                      <strong>{destination.label}</strong>
                      <span>{destination.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 'dates' ? (
              <div className="movera-st__screen" data-testid="search-step-dates">
                <h2 className="movera-st__title">Vos dates</h2>
                <p className="movera-st__sub">{state.destination?.label} · choisissez arrivée et départ.</p>
                <div className="movera-st__date-grid">
                  <label className="movera-st__field"><span>Arrivée</span><input type="date" min={minDate} value={state.checkin} onChange={(event) => setState((current) => ({ ...current, checkin: event.target.value, checkout: current.checkout && current.checkout < event.target.value ? '' : current.checkout }))} /></label>
                  <label className="movera-st__field"><span>Départ</span><input type="date" min={state.checkin || minDate} value={state.checkout} onChange={(event) => setState((current) => ({ ...current, checkout: event.target.value }))} /></label>
                </div>
                <p className="movera-st__summary"><strong>{state.destination?.label}</strong><span>{formatDate(state.checkin)} → {formatDate(state.checkout)}</span></p>
                <button type="button" className="movera-st__action" disabled={!datesValid} onClick={() => setStep('guests')}>Continuer</button>
              </div>
            ) : null}

            {step === 'guests' ? (
              <div className="movera-st__screen" data-testid="search-step-guests">
                <h2 className="movera-st__title">Voyageurs</h2>
                <p className="movera-st__sub">Dernière étape avant d’explorer la carte.</p>
                <div className="movera-st__guest-card">
                  <div className="movera-st__guest-copy"><strong>Adultes</strong><span>13 ans et plus</span></div>
                  <div className="movera-st__counter">
                    <button type="button" aria-label="Retirer un adulte" onClick={() => setState((current) => ({ ...current, adults: Math.max(1, current.adults - 1) }))}>−</button>
                    <strong data-testid="search-adult-count">{state.adults}</strong>
                    <button type="button" aria-label="Ajouter un adulte" onClick={() => setState((current) => ({ ...current, adults: Math.min(16, current.adults + 1) }))}>+</button>
                  </div>
                </div>
                <p className="movera-st__summary"><strong>{state.destination?.label}</strong><span>{formatDate(state.checkin)} → {formatDate(state.checkout)} · {state.adults} adulte{state.adults > 1 ? 's' : ''}</span></p>
                <button type="button" className="movera-st__action" onClick={submitSearch}><SearchIcon />Rechercher sur la carte</button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>,
    document.body,
  )
}

import { createRoot } from 'react-dom/client'
import { HostPinMap } from './HostPinMap.jsx'

export const HOST_PIN_REACT_QUERY_VALUE = 'react'
export const HOST_MAP_LOCATION_EVENT = 'movera:host-map-address-change'

export function shouldUseReactHostPinMap(search = typeof window !== 'undefined' ? window.location.search : '') {
  return new URLSearchParams(search).get('hostMap') === HOST_PIN_REACT_QUERY_VALUE
}

function publishLocation(location) {
  if (!location || typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(HOST_MAP_LOCATION_EVENT, { detail: location }))
}

function readInitialAddress(card) {
  return card.querySelector('.host-onboarding__address-chip span')?.textContent?.trim() || ''
}

export function installHostPinReactEngine() {
  if (typeof window === 'undefined' || !shouldUseReactHostPinMap()) return () => {}

  let mountedCard = null
  let reactRoot = null
  let reactNode = null

  const unmount = () => {
    reactRoot?.unmount()
    reactNode?.remove()
    if (mountedCard) delete mountedCard.dataset.reactMapEngine
    reactRoot = null
    reactNode = null
    mountedCard = null
  }

  const sync = () => {
    const section = document.querySelector('.host-onboarding[data-screen="pin"]')
    const card = section?.querySelector('.host-onboarding__map-card')

    if (!card) {
      if (mountedCard) unmount()
      return
    }
    if (card === mountedCard) return
    if (mountedCard) unmount()

    card.dataset.reactMapEngine = 'true'
    const hint = card.querySelector('.host-onboarding__map-hint')
    const node = document.createElement('div')
    node.className = 'host-step5-react-engine-root'
    card.prepend(node)

    const setHint = (message) => {
      if (hint && message) hint.textContent = message
    }

    reactNode = node
    mountedCard = card
    reactRoot = createRoot(node)
    reactRoot.render(
      <HostPinMap
        initialAddress={readInitialAddress(card)}
        onLocationChange={publishLocation}
        onHintChange={setHint}
      />,
    )
  }

  const observer = new MutationObserver(sync)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-screen'],
  })
  sync()

  return () => {
    observer.disconnect()
    unmount()
  }
}

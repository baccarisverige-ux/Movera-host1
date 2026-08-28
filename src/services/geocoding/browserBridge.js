import { reverseGeocode, searchAddress } from './geocodingService.js'

export const GEOCODING_BROWSER_BRIDGE_KEY = 'MoveraGeocoding'

export function createGeocodingBrowserBridge() {
  return Object.freeze({
    version: 1,
    searchAddress,
    reverseGeocode,
  })
}

export function installGeocodingBrowserBridge(target = globalThis) {
  if (!target || typeof target !== 'object') return null
  const existing = target[GEOCODING_BROWSER_BRIDGE_KEY]
  if (existing?.version >= 1) return existing
  const bridge = createGeocodingBrowserBridge()
  target[GEOCODING_BROWSER_BRIDGE_KEY] = bridge
  return bridge
}

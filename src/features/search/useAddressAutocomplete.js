import { useEffect, useMemo, useState } from 'react'
import { SEARCH_ADDRESS_SUGGESTIONS, SEARCH_DESTINATIONS } from './searchData.js'

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/'

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase('fr')
}

function localMatches(query) {
  const normalized = normalize(query)
  if (!normalized) return SEARCH_ADDRESS_SUGGESTIONS.slice(0, 4)
  return SEARCH_ADDRESS_SUGGESTIONS.filter((address) => normalize(`${address.label} ${address.subtitle}`).includes(normalized)).slice(0, 5)
}

function nearestDestinationId(lat, lng) {
  let best = SEARCH_DESTINATIONS[0]
  let bestDistance = Number.POSITIVE_INFINITY
  for (const destination of SEARCH_DESTINATIONS) {
    const dLat = destination.viewport.lat - lat
    const dLng = destination.viewport.lng - lng
    const distance = dLat * dLat + dLng * dLng
    if (distance < bestDistance) {
      bestDistance = distance
      best = destination
    }
  }
  return best?.id || 'tunis'
}

function parsePhotonFeature(feature) {
  const coordinates = feature?.geometry?.coordinates
  const properties = feature?.properties || {}
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null

  const lng = Number(coordinates[0])
  const lat = Number(coordinates[1])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const countryCode = String(properties.countrycode || properties.country_code || '').toUpperCase()
  const country = normalize(properties.country)
  if (countryCode && countryCode !== 'TN') return null
  if (!countryCode && country && !/(tunisia|tunisie|تونس)/i.test(country)) return null

  const label = properties.name || properties.street || properties.city || properties.locality || properties.district
  if (!label) return null

  const place = properties.city || properties.locality || properties.district || properties.county || properties.state || 'Tunisie'
  const street = properties.street && properties.street !== label ? properties.street : null
  const subtitle = [street, place].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ')

  return {
    id: `photon-${properties.osm_type || 'place'}-${properties.osm_id || `${lat}-${lng}`}`,
    destinationId: nearestDestinationId(lat, lng),
    label,
    subtitle: subtitle || 'Tunisie',
    viewport: { lat, lng, zoom: properties.type === 'house' || properties.type === 'street' ? 16 : 15 },
    source: 'photon',
  }
}

function dedupe(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = normalize(`${item.label}|${item.subtitle}`)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function useAddressAutocomplete(query, active) {
  const local = useMemo(() => localMatches(query), [query])
  const [remote, setRemote] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const normalized = normalize(query)
    if (!active || normalized.length < 3) {
      setRemote([])
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const url = new URL(PHOTON_ENDPOINT)
        url.searchParams.set('q', query.trim())
        url.searchParams.set('limit', '8')
        url.searchParams.set('lang', 'fr')
        url.searchParams.set('lat', '36.8065')
        url.searchParams.set('lon', '10.1815')

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error(`Autocomplete HTTP ${response.status}`)
        const data = await response.json()
        const next = (Array.isArray(data?.features) ? data.features : [])
          .map(parsePhotonFeature)
          .filter(Boolean)
          .slice(0, 5)
        setRemote(next)
      } catch (error) {
        if (error?.name !== 'AbortError') setRemote([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 280)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, active])

  const suggestions = useMemo(() => dedupe([...local, ...remote]).slice(0, 5), [local, remote])
  return { suggestions, loading }
}

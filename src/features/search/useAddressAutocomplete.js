import { useEffect, useMemo, useState } from 'react'
import { SEARCH_ADDRESS_SUGGESTIONS, SEARCH_DESTINATIONS } from './searchData.js'

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/'

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase('fr')
}

function localMatches(query) {
  const normalized = normalize(query)
  if (!normalized) return SEARCH_ADDRESS_SUGGESTIONS.slice(0, 2)
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

function uniqueParts(parts) {
  const seen = new Set()
  return parts.filter((value) => {
    const key = normalize(value)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function parsePhotonFeature(feature) {
  const coordinates = feature?.geometry?.coordinates
  const properties = feature?.properties || {}
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null

  const lng = Number(coordinates[0])
  const lat = Number(coordinates[1])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const houseNumber = properties.housenumber || properties.house_number || ''
  const street = properties.street || properties.name || ''
  const locality = properties.locality || properties.district || properties.suburb || properties.county || ''
  const city = properties.city || properties.town || properties.village || properties.municipality || ''
  const postcode = properties.postcode || ''
  const state = properties.state || ''
  const country = properties.country || ''
  const type = String(properties.type || '').toLowerCase()

  let label = ''
  if (houseNumber && street) label = `${houseNumber} ${street}`
  else label = properties.name || street || city || locality || state || country
  if (!label) return null

  const cityLine = [postcode, city].filter(Boolean).join(' ')
  const subtitle = uniqueParts([locality, cityLine, state, country])
    .filter((value) => normalize(value) !== normalize(label))
    .join(', ')

  const zoom = type === 'house'
    ? 17
    : type === 'street'
      ? 16
      : ['city', 'town', 'village', 'district', 'locality'].includes(type)
        ? 14
        : 15

  return {
    id: `photon-${properties.osm_type || 'place'}-${properties.osm_id || `${lat}-${lng}`}`,
    destinationId: nearestDestinationId(lat, lng),
    label,
    subtitle: subtitle || country || city || 'Adresse détectée',
    viewport: { lat, lng, zoom },
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
        url.searchParams.set('limit', '10')
        url.searchParams.set('lang', 'fr')
        // Keep Tunisia as a ranking bias for Movera, without restricting results to Tunisia.
        // This lets the popup resolve precise streets, house numbers and cities worldwide.
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
          .slice(0, 6)
        setRemote(next)
      } catch (error) {
        if (error?.name !== 'AbortError') setRemote([])
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, active])

  const suggestions = useMemo(() => {
    const hasQuery = normalize(query).length >= 3
    return dedupe(hasQuery ? [...remote, ...local] : [...local, ...remote]).slice(0, 6)
  }, [local, remote, query])

  return { suggestions, loading }
}

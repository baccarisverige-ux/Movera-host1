import { useEffect, useMemo, useState } from 'react'
import { SEARCH_ADDRESS_SUGGESTIONS, SEARCH_DESTINATIONS } from './searchData.js'

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
export const SEARCH_ADDRESS_PREVIEW_EVENT = 'movera:search-address-preview'

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

function parseNominatimResult(result) {
  if (!result) return null

  const lat = Number(result.lat)
  const lng = Number(result.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  const address = result.address || {}
  const houseNumber = address.house_number || ''
  const road = address.road || address.pedestrian || address.footway || address.path || address.cycleway || ''
  const neighbourhood = address.neighbourhood || address.suburb || address.quarter || address.hamlet || ''
  const city = address.city || address.town || address.village || address.municipality || address.county || ''
  const postcode = address.postcode || ''
  const state = address.state || address.region || ''
  const country = address.country || ''

  let label = ''
  if (houseNumber && road) label = `${houseNumber} ${road}`
  else if (road) label = road
  else label = result.name || neighbourhood || city || state || country || result.display_name || ''
  if (!label) return null

  const cityLine = [postcode, city].filter(Boolean).join(' ')
  const subtitle = uniqueParts([neighbourhood, cityLine, state, country])
    .filter((value) => normalize(value) !== normalize(label))
    .join(', ')

  const addressType = String(result.addresstype || result.type || '').toLowerCase()
  const zoom = houseNumber
    ? 18
    : road
      ? 17
      : ['neighbourhood', 'suburb', 'quarter'].includes(addressType)
        ? 15
        : ['city', 'town', 'village', 'municipality'].includes(addressType)
          ? 13
          : 14

  return {
    id: `nominatim-${result.place_id || `${result.osm_type || 'place'}-${result.osm_id || `${lat}-${lng}`}`}`,
    destinationId: nearestDestinationId(lat, lng),
    label,
    subtitle: subtitle || result.display_name || 'Adresse détectée',
    viewport: { lat, lng, zoom },
    source: 'nominatim',
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

function publishPreview(address) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(SEARCH_ADDRESS_PREVIEW_EVENT, {
    detail: address
      ? {
          id: address.id,
          label: address.label,
          subtitle: address.subtitle,
          viewport: address.viewport,
        }
      : null,
  }))
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
      publishPreview(null)
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      try {
        const url = new URL(NOMINATIM_ENDPOINT)
        url.searchParams.set('format', 'jsonv2')
        url.searchParams.set('addressdetails', '1')
        url.searchParams.set('dedupe', '1')
        url.searchParams.set('limit', '12')
        url.searchParams.set('accept-language', 'fr')
        url.searchParams.set('q', query.trim())

        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error(`Address search HTTP ${response.status}`)
        const data = await response.json()
        const next = dedupe((Array.isArray(data) ? data : [])
          .map(parseNominatimResult)
          .filter(Boolean))
          .slice(0, 10)
        setRemote(next)
        publishPreview(next[0] || null)
      } catch (error) {
        if (error?.name !== 'AbortError') {
          setRemote([])
          publishPreview(null)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 420)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, active])

  const suggestions = useMemo(() => {
    const hasQuery = normalize(query).length >= 3
    if (hasQuery) return remote.slice(0, 10)
    return dedupe(local).slice(0, 5)
  }, [local, remote, query])

  return { suggestions, loading }
}

import { useEffect, useRef, useState } from 'react'
import '../../../styles/map-google-layer.css'

const GOOGLE_MAPS_BROWSER_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()
const GOOGLE_MAPS_SCRIPT_ID = 'movera-google-maps-js'
const GOOGLE_MAPS_CALLBACK = '__moveraGoogleMapsReady'
const GOOGLE_MAPS_TIMEOUT_MS = 15000
const GOOGLE_MAPS_POLL_MS = 50
const CAMERA_EPSILON = 0.000001
const ZOOM_EPSILON = 0.001

function loadGoogleMaps() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google Maps requires a browser'))
  if (!GOOGLE_MAPS_BROWSER_KEY) return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'))
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps)
  if (window.__moveraGoogleMapsPromise) return window.__moveraGoogleMapsPromise

  window.__moveraGoogleMapsPromise = new Promise((resolve, reject) => {
    let settled = false
    let timeoutId = 0
    let pollId = 0
    const previousAuthFailure = window.gm_authFailure

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(pollId)
      if (window[GOOGLE_MAPS_CALLBACK] === handleReady) delete window[GOOGLE_MAPS_CALLBACK]
      if (window.gm_authFailure === handleAuthFailure) {
        if (typeof previousAuthFailure === 'function') window.gm_authFailure = previousAuthFailure
        else delete window.gm_authFailure
      }
    }

    const fail = (error) => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    }

    const resolveIfReady = () => {
      if (settled || !window.google?.maps?.Map) return false
      settled = true
      const maps = window.google.maps
      cleanup()
      resolve(maps)
      return true
    }

    function handleReady() {
      if (!resolveIfReady()) fail(new Error('Google Maps callback fired before Maps was ready'))
    }

    function handleAuthFailure() {
      try { previousAuthFailure?.() } catch { /* preserve previous handler without blocking fallback */ }
      fail(new Error('Google Maps authentication failed'))
    }

    window[GOOGLE_MAPS_CALLBACK] = handleReady
    window.gm_authFailure = handleAuthFailure

    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID)
    if (existing) {
      if (resolveIfReady()) return
      existing.addEventListener('error', () => fail(new Error('Google Maps script failed')), { once: true })
      pollId = window.setInterval(resolveIfReady, GOOGLE_MAPS_POLL_MS)
    } else {
      const script = document.createElement('script')
      script.id = GOOGLE_MAPS_SCRIPT_ID
      script.dataset.moveraGoogleMapsOwned = 'true'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_BROWSER_KEY)}&v=weekly&loading=async&callback=${GOOGLE_MAPS_CALLBACK}`
      script.async = true
      script.defer = true
      script.onerror = () => fail(new Error('Google Maps script failed'))
      script.onload = () => { resolveIfReady() }
      document.head.appendChild(script)
    }

    timeoutId = window.setTimeout(() => fail(new Error('Google Maps readiness timeout')), GOOGLE_MAPS_TIMEOUT_MS)
  }).catch((error) => {
    const script = document.getElementById(GOOGLE_MAPS_SCRIPT_ID)
    if (!window.google?.maps?.Map && script?.dataset.moveraGoogleMapsOwned === 'true') script.remove()
    window.__moveraGoogleMapsPromise = null
    throw error
  })

  return window.__moveraGoogleMapsPromise
}

function mapViewport(map) {
  const center = map?.getCenter?.()
  const zoom = Number(map?.getZoom?.())
  if (!center || !Number.isFinite(zoom)) return null
  const lat = Number(center.lat())
  const lng = Number(center.lng())
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, zoom }
}

function cameraMatches(map, viewport) {
  const current = mapViewport(map)
  if (!current) return false
  return Math.abs(current.lat - viewport.lat) <= CAMERA_EPSILON
    && Math.abs(current.lng - viewport.lng) <= CAMERA_EPSILON
    && Math.abs(current.zoom - viewport.zoom) <= ZOOM_EPSILON
}

export function GoogleMapLayer({ viewport, interactive = false, onStatus, onViewportChange }) {
  const hostRef = useRef(null)
  const mapRef = useRef(null)
  const mapsRef = useRef(null)
  const boundsListenerRef = useRef(null)
  const syncFrameRef = useRef(0)
  const interactiveRef = useRef(interactive)
  const onViewportChangeRef = useRef(onViewportChange)
  const [ready, setReady] = useState(false)

  useEffect(() => { interactiveRef.current = interactive }, [interactive])
  useEffect(() => { onViewportChangeRef.current = onViewportChange }, [onViewportChange])

  useEffect(() => {
    let cancelled = false
    onStatus?.('google-loading')

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !hostRef.current) return
        mapsRef.current = maps
        const map = new maps.Map(hostRef.current, {
          center: { lat: viewport.lat, lng: viewport.lng },
          zoom: viewport.zoom,
          minZoom: 3,
          maxZoom: 18,
          backgroundColor: '#f5f7f8',
          clickableIcons: false,
          disableDefaultUI: true,
          disableDoubleClickZoom: !interactiveRef.current,
          draggable: interactiveRef.current,
          fullscreenControl: false,
          gestureHandling: interactiveRef.current ? 'greedy' : 'none',
          isFractionalZoomEnabled: true,
          keyboardShortcuts: false,
          mapTypeControl: false,
          mapTypeId: 'roadmap',
          rotateControl: false,
          scaleControl: false,
          scrollwheel: interactiveRef.current,
          streetViewControl: false,
          zoomControl: false,
        })
        mapRef.current = map

        boundsListenerRef.current = map.addListener('bounds_changed', () => {
          if (!interactiveRef.current || syncFrameRef.current) return
          syncFrameRef.current = window.requestAnimationFrame(() => {
            syncFrameRef.current = 0
            const next = mapViewport(mapRef.current)
            if (next) onViewportChangeRef.current?.(next)
          })
        })

        setReady(true)
        onStatus?.('google')
      })
      .catch(() => {
        if (cancelled) return
        setReady(false)
        onStatus?.('fallback')
      })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(syncFrameRef.current)
      syncFrameRef.current = 0
      boundsListenerRef.current?.remove?.()
      boundsListenerRef.current = null
      if (mapRef.current && mapsRef.current?.event?.clearInstanceListeners) {
        mapsRef.current.event.clearInstanceListeners(mapRef.current)
      }
      mapRef.current = null
      mapsRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    map.setOptions({
      disableDoubleClickZoom: !interactive,
      draggable: interactive,
      gestureHandling: interactive ? 'greedy' : 'none',
      scrollwheel: interactive,
    })
  }, [interactive, ready])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || cameraMatches(map, viewport)) return
    const camera = { center: { lat: viewport.lat, lng: viewport.lng }, zoom: viewport.zoom }
    if (typeof map.moveCamera === 'function') map.moveCamera(camera)
    else {
      map.setCenter(camera.center)
      map.setZoom(camera.zoom)
    }
  }, [viewport.lat, viewport.lng, viewport.zoom, ready])

  return (
    <div
      className="map-google-layer"
      data-ready={ready ? 'true' : 'false'}
      data-interactive={interactive ? 'true' : 'false'}
      data-testid="map-google-layer"
      aria-hidden="true"
    >
      <div ref={hostRef} className="map-google-layer__canvas" />
    </div>
  )
}

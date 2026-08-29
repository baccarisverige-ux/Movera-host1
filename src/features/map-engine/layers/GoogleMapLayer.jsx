import { useEffect, useRef, useState } from 'react'
import '../../../styles/map-google-layer.css'

const GOOGLE_MAPS_BROWSER_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()
const GOOGLE_MAPS_SCRIPT_ID = 'movera-google-maps-js'
const GOOGLE_MAPS_CALLBACK = '__moveraGoogleMapsReady'
const GOOGLE_MAPS_TIMEOUT_MS = 15000
const GOOGLE_MAPS_POLL_MS = 50

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

export function GoogleMapLayer({ viewport, onStatus }) {
  const hostRef = useRef(null)
  const mapRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    onStatus?.('google-loading')

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !hostRef.current) return
        mapRef.current = new maps.Map(hostRef.current, {
          center: { lat: viewport.lat, lng: viewport.lng },
          zoom: viewport.zoom,
          backgroundColor: '#f5f7f8',
          clickableIcons: false,
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          draggable: false,
          fullscreenControl: false,
          gestureHandling: 'none',
          isFractionalZoomEnabled: true,
          keyboardShortcuts: false,
          mapTypeControl: false,
          mapTypeId: 'roadmap',
          rotateControl: false,
          scaleControl: false,
          scrollwheel: false,
          streetViewControl: false,
          zoomControl: false,
        })
        setReady(true)
        onStatus?.('google')
      })
      .catch(() => {
        if (cancelled) return
        setReady(false)
        onStatus?.('fallback')
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const camera = { center: { lat: viewport.lat, lng: viewport.lng }, zoom: viewport.zoom }
    if (typeof map.moveCamera === 'function') map.moveCamera(camera)
    else {
      map.setCenter(camera.center)
      map.setZoom(camera.zoom)
    }
  }, [viewport.lat, viewport.lng, viewport.zoom, ready])

  return (
    <div className="map-google-layer" data-ready={ready ? 'true' : 'false'} data-testid="map-google-layer" aria-hidden="true">
      <div ref={hostRef} className="map-google-layer__canvas" />
    </div>
  )
}

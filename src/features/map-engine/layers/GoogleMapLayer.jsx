import { useEffect, useRef, useState } from 'react'
import '../../../styles/map-google-layer.css'

const GOOGLE_MAPS_BROWSER_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim()
const GOOGLE_MAPS_SCRIPT_ID = 'movera-google-maps-js'

function loadGoogleMaps() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Google Maps requires a browser'))
  if (!GOOGLE_MAPS_BROWSER_KEY) return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY'))
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps)
  if (window.__moveraGoogleMapsPromise) return window.__moveraGoogleMapsPromise

  window.__moveraGoogleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => window.google?.maps?.Map ? resolve(window.google.maps) : reject(new Error('Google Maps unavailable')), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_MAPS_SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_BROWSER_KEY)}&v=weekly&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => window.google?.maps?.Map ? resolve(window.google.maps) : reject(new Error('Google Maps unavailable'))
    script.onerror = () => reject(new Error('Google Maps script failed'))
    document.head.appendChild(script)
  }).catch((error) => {
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

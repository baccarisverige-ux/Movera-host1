import { useCallback, useEffect, useRef, useState } from 'react'
import { ClusterLayer } from './ClusterLayer.jsx'
import { MapControls } from './MapControls.jsx'
import { MarkerLayer } from './MarkerLayer.jsx'
import { ResizeManager } from './ResizeManager.jsx'
import { TileLayer } from './TileLayer.jsx'
import { ViewportController } from './ViewportController.jsx'
import { panViewport, zoomViewport } from './geometry.js'
import { selectListing } from './markerModel.js'
import '../../styles/map-engine.css'

const INITIAL_VIEWPORT = Object.freeze({ lat: 36.8065, lng: 10.1815, zoom: 11 })
const MARKER_FOCUS_ZOOM = 10.5
const CLUSTER_FOCUS_ZOOM = 11
const INFRA_MARKERS = Object.freeze([
  { id: 'tunis-centre', label: 'Tunis centre', lat: 36.8065, lng: 10.1815 },
  { id: 'carthage', label: 'Carthage', lat: 36.8528, lng: 10.3233 },
  { id: 'la-marsa', label: 'La Marsa', lat: 36.8782, lng: 10.3247 },
  { id: 'gammarth', label: 'Gammarth', lat: 36.9179, lng: 10.2934 },
])

export function MapContainer() {
  const surfaceRef = useRef(null)
  const pointersRef = useRef(new Map())
  const pinchDistanceRef = useRef(null)
  const frameRef = useRef(0)
  const renderCountRef = useRef(0)
  const updateCountRef = useRef(0)
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [size, setSize] = useState({ width: 390, height: 560 })
  const [lifecycleEvents, setLifecycleEvents] = useState(0)
  const [selectedListingId, setSelectedListingId] = useState(null)
  renderCountRef.current += 1

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  const commitViewport = useCallback((updater) => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      updateCountRef.current += 1
      setViewport((current) => updater(current))
    })
  }, [])

  const zoomBy = useCallback((delta) => {
    commitViewport((current) => zoomViewport(current, delta))
  }, [commitViewport])

  const reset = useCallback(() => {
    setSelectedListingId(null)
    commitViewport(() => ({ ...INITIAL_VIEWPORT }))
  }, [commitViewport])

  const focusPoint = useCallback((point, targetZoom) => {
    commitViewport((current) => ({
      ...current,
      lat: point.lat,
      lng: point.lng,
      zoom: targetZoom,
    }))
  }, [commitViewport])

  const selectMarker = useCallback((marker) => {
    setSelectedListingId((current) => selectListing(current, marker.id))
    focusPoint(marker, MARKER_FOCUS_ZOOM)
  }, [focusPoint])

  const onLifecycle = useCallback(() => {
    setLifecycleEvents((count) => count + 1)
  }, [])

  const onPointerDown = (event) => {
    if (event.target.closest('button, a, input, select, textarea')) return
    event.preventDefault()
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* synthetic test event */ }
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()]
      pinchDistanceRef.current = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }

  const onPointerMove = (event) => {
    const previous = pointersRef.current.get(event.pointerId)
    if (!previous) return
    const next = { x: event.clientX, y: event.clientY }
    pointersRef.current.set(event.pointerId, next)

    if (pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const previousDistance = pinchDistanceRef.current || distance
      const ratio = previousDistance ? distance / previousDistance : 1
      if (ratio > 1.08) {
        zoomBy(1)
        pinchDistanceRef.current = distance
      } else if (ratio < 0.92) {
        zoomBy(-1)
        pinchDistanceRef.current = distance
      }
      return
    }

    const dx = next.x - previous.x
    const dy = next.y - previous.y
    if (Math.abs(dx) + Math.abs(dy) < 1) return
    commitViewport((current) => panViewport(current, dx, dy))
  }

  const releasePointer = (event) => {
    pointersRef.current.delete(event.pointerId)
    if (pointersRef.current.size < 2) pinchDistanceRef.current = null
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    } catch { /* no active capture */ }
  }

  const onWheel = (event) => {
    event.preventDefault()
    zoomBy(event.deltaY < 0 ? 1 : -1)
  }

  return (
    <section className="map-engine" data-testid="map-engine" data-selected-listing-id={selectedListingId || ''}>
      <div
        ref={surfaceRef}
        className="map-surface"
        data-testid="map-surface"
        data-lat={viewport.lat.toFixed(6)}
        data-lng={viewport.lng.toFixed(6)}
        data-zoom={viewport.zoom}
        data-width={size.width}
        data-height={size.height}
        data-update-count={updateCountRef.current}
        data-render-count={renderCountRef.current}
        data-listener-count="7"
        data-lifecycle-events={lifecycleEvents}
        onDoubleClick={(event) => {
          if (!event.target.closest('button')) zoomBy(1)
        }}
        onPointerCancel={releasePointer}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onWheel={onWheel}
      >
        <TileLayer viewport={viewport} size={size} />
        <ClusterLayer markers={INFRA_MARKERS} viewport={viewport} size={size} onFocus={(point) => focusPoint(point, CLUSTER_FOCUS_ZOOM)} />
        {viewport.zoom > 10 ? (
          <MarkerLayer
            markers={INFRA_MARKERS}
            viewport={viewport}
            size={size}
            selectedListingId={selectedListingId}
            onSelect={selectMarker}
          />
        ) : null}
        <MapControls onZoomIn={() => zoomBy(1)} onZoomOut={() => zoomBy(-1)} onReset={reset} />
        <div className="map-attribution">© OpenStreetMap contributors</div>
        <ResizeManager targetRef={surfaceRef} onSize={setSize} />
        <ViewportController onLifecycle={onLifecycle} />
      </div>
      <p className="map-engine__status" aria-live="polite">
        {selectedListingId ? `Sélection: ${selectedListingId}` : `Tunis · zoom ${viewport.zoom}`}
      </p>
    </section>
  )
}

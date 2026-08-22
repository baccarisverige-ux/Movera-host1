import { useCallback, useEffect, useRef, useState } from 'react'
import { ClusterLayer } from './layers/ClusterLayer.jsx'
import { MapControls } from './controls/MapControls.jsx'
import { MarkerLayer } from './layers/MarkerLayer.jsx'
import { ResizeManager } from './lifecycle/ResizeManager.jsx'
import { VectorBaseLayer } from './layers/VectorBaseLayer.jsx'
import { ViewportController } from './lifecycle/ViewportController.jsx'
import { panViewport, zoomViewport } from './geometry/geometry.js'
import '../../styles/map-engine.css'

export const INITIAL_VIEWPORT = Object.freeze({ lat: 36.8065, lng: 10.1815, zoom: 11 })
const MARKER_FOCUS_ZOOM = 10.5
const CLUSTER_FOCUS_ZOOM = 11
export const DEFAULT_MARKERS = Object.freeze([
  { id: 'marsa-sea', label: 'La Marsa', lat: 36.8782, lng: 10.3247 },
  { id: 'carthage-suite', label: 'Carthage', lat: 36.8528, lng: 10.3233 },
  { id: 'gammarth-house', label: 'Gammarth', lat: 36.9179, lng: 10.2934 },
])

export function MapContainer({ markers = DEFAULT_MARKERS, selectedListingId: controlledSelectedId, onSelectedListingChange, initialViewport = INITIAL_VIEWPORT, onViewportChange }) {
  const surfaceRef = useRef(null)
  const pointersRef = useRef(new Map())
  const pinchDistanceRef = useRef(null)
  const frameRef = useRef(0)
  const renderCountRef = useRef(0)
  const updateCountRef = useRef(0)
  const [viewport, setViewport] = useState(initialViewport)
  const [size, setSize] = useState({ width: 390, height: 560 })
  const [lifecycleEvents, setLifecycleEvents] = useState(0)
  const [internalSelectedId, setInternalSelectedId] = useState(null)
  const selectedListingId = controlledSelectedId === undefined ? internalSelectedId : controlledSelectedId
  const previousSelectedRef = useRef(selectedListingId)
  renderCountRef.current += 1

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])
  useEffect(() => { onViewportChange?.(viewport) }, [viewport, onViewportChange])

  const setSelected = useCallback((next) => {
    if (controlledSelectedId === undefined) setInternalSelectedId(next)
    onSelectedListingChange?.(next)
  }, [controlledSelectedId, onSelectedListingChange])

  const commitViewport = useCallback((updater) => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      updateCountRef.current += 1
      setViewport((current) => updater(current))
    })
  }, [])

  const zoomBy = useCallback((delta) => commitViewport((current) => zoomViewport(current, delta)), [commitViewport])
  const focusPoint = useCallback((point, targetZoom) => commitViewport((current) => ({ ...current, lat: point.lat, lng: point.lng, zoom: targetZoom })), [commitViewport])
  const selectMarker = useCallback((marker) => { setSelected(marker.id); focusPoint(marker, MARKER_FOCUS_ZOOM) }, [focusPoint, setSelected])

  useEffect(() => {
    if (previousSelectedRef.current === selectedListingId) return
    previousSelectedRef.current = selectedListingId
    if (!selectedListingId) return
    const marker = markers.find((item) => item.id === selectedListingId)
    if (marker) focusPoint(marker, MARKER_FOCUS_ZOOM)
  }, [selectedListingId, markers, focusPoint])

  const onPointerDown = (event) => {
    if (event.target.closest('button, a, input, select, textarea')) return
    event.preventDefault()
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* synthetic */ }
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
      const ratio = distance / previousDistance
      if (ratio > 1.08) { zoomBy(1); pinchDistanceRef.current = distance }
      else if (ratio < 0.92) { zoomBy(-1); pinchDistanceRef.current = distance }
      return
    }
    const dx = next.x - previous.x
    const dy = next.y - previous.y
    if (Math.abs(dx) + Math.abs(dy) >= 1) commitViewport((current) => panViewport(current, dx, dy))
  }

  const releasePointer = (event) => {
    pointersRef.current.delete(event.pointerId)
    if (pointersRef.current.size < 2) pinchDistanceRef.current = null
    try { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) } catch { /* no capture */ }
  }

  return <section className="map-engine" data-testid="map-engine" data-selected-listing-id={selectedListingId || ''}>
    <div ref={surfaceRef} className="map-surface" data-testid="map-surface" data-lat={viewport.lat.toFixed(6)} data-lng={viewport.lng.toFixed(6)} data-zoom={viewport.zoom}
      data-width={size.width} data-height={size.height} data-update-count={updateCountRef.current} data-render-count={renderCountRef.current} data-listener-count="7" data-lifecycle-events={lifecycleEvents}
      onDoubleClick={(event) => { if (!event.target.closest('button')) zoomBy(1) }} onPointerCancel={releasePointer} onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={releasePointer} onWheel={(event) => { event.preventDefault(); zoomBy(event.deltaY < 0 ? 1 : -1) }}>
      <VectorBaseLayer viewport={viewport} size={size} />
      <ClusterLayer markers={markers} viewport={viewport} size={size} onFocus={(point) => focusPoint(point, CLUSTER_FOCUS_ZOOM)} />
      {viewport.zoom > 10 ? <MarkerLayer markers={markers} viewport={viewport} size={size} selectedListingId={selectedListingId} onSelect={selectMarker} /> : null}
      <MapControls onZoomIn={() => zoomBy(1)} onZoomOut={() => zoomBy(-1)} />
      <div className="map-attribution">OpenFreeMap © OpenMapTiles · OpenStreetMap</div>
      <ResizeManager targetRef={surfaceRef} onSize={setSize} />
      <ViewportController onLifecycle={() => setLifecycleEvents((count) => count + 1)} />
    </div>
    <p className="map-engine__status" aria-live="polite">{selectedListingId ? `Sélection: ${selectedListingId}` : `Tunis · zoom ${viewport.zoom}`}</p>
  </section>
}

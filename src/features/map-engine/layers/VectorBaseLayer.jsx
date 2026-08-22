import { useEffect, useRef } from 'react'
import { loadMapRenderer } from '../mapRendererLoader.js'

const BASE_STYLE = 'https://tiles.openfreemap.org/styles/positron'

function safelySetPaint(map, layerId, property, value) {
  try { map.setPaintProperty(layerId, property, value) } catch { /* unsupported by this layer */ }
}

function applyMoveraPalette(map) {
  const layers = map.getStyle()?.layers || []

  for (const layer of layers) {
    const id = layer.id.toLowerCase()
    const sourceLayer = String(layer['source-layer'] || '').toLowerCase()

    if (layer.type === 'background') safelySetPaint(map, layer.id, 'background-color', '#f8f9fa')

    if (layer.type === 'fill') {
      if (sourceLayer === 'water' || id.includes('water')) safelySetPaint(map, layer.id, 'fill-color', '#86daf0')
      else if (sourceLayer === 'building' || id.includes('building')) safelySetPaint(map, layer.id, 'fill-color', '#e1e5e8')
      else if (sourceLayer === 'park' || /park|grass|wood|forest/.test(id)) safelySetPaint(map, layer.id, 'fill-color', '#b8edc8')
      else if (sourceLayer === 'landuse') safelySetPaint(map, layer.id, 'fill-color', '#f3f5f5')
    }

    if (layer.type === 'line') {
      if (sourceLayer === 'waterway' || id.includes('waterway')) safelySetPaint(map, layer.id, 'line-color', '#86daf0')
      else if (sourceLayer === 'transportation') {
        const roadColor = id.includes('casing') ? '#aeb5bb' : /motorway|trunk|primary/.test(id) ? '#b9c0c5' : '#d0d5d9'
        safelySetPaint(map, layer.id, 'line-color', roadColor)
      } else if (sourceLayer === 'boundary') safelySetPaint(map, layer.id, 'line-color', '#c4c9cd')
    }

    if (layer.type === 'symbol') {
      const labelColor = sourceLayer === 'water_name' ? '#236b9a' : sourceLayer === 'park' ? '#27864f' : '#4d555b'
      safelySetPaint(map, layer.id, 'text-color', labelColor)
      safelySetPaint(map, layer.id, 'text-halo-color', 'rgba(255,255,255,.94)')
      safelySetPaint(map, layer.id, 'text-halo-width', 1.2)
    }
  }
}

export function VectorBaseLayer({ viewport, size }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const initialViewportRef = useRef(viewport)

  useEffect(() => {
    if (!containerRef.current) return undefined
    let disposed = false
    let map

    loadMapRenderer().then((maplibregl) => {
      if (disposed || !containerRef.current) return
      const initialViewport = initialViewportRef.current
      map = new maplibregl.Map({
        container: containerRef.current,
        style: BASE_STYLE,
        center: [initialViewport.lng, initialViewport.lat],
        zoom: initialViewport.zoom,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0,
        pitchWithRotate: false,
        renderWorldCopies: true,
      })
      mapRef.current = map
      map.on('style.load', () => applyMoveraPalette(map))
    })

    return () => { disposed = true; mapRef.current = null; map?.remove() }
  }, [])

  useEffect(() => {
    mapRef.current?.jumpTo({ center: [viewport.lng, viewport.lat], zoom: viewport.zoom })
  }, [viewport.lat, viewport.lng, viewport.zoom])

  useEffect(() => { mapRef.current?.resize() }, [size.width, size.height])

  return <div ref={containerRef} className="map-vector-base" data-testid="map-tile-layer" aria-hidden="true" />
}

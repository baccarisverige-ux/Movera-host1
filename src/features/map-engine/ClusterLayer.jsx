import { screenPoint } from './geometry.js'

export function ClusterLayer({ markers, viewport, size, onFocus }) {
  if (viewport.zoom > 10 || markers.length === 0) return null
  const lat = markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length
  const lng = markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length
  const point = screenPoint(lat, lng, viewport, size)
  const visible = point.x > -80 && point.x < size.width + 80 && point.y > -80 && point.y < size.height + 80
  if (!visible) return null

  return (
    <div className="map-cluster-layer" data-testid="map-cluster-layer" data-cluster-size={markers.length}>
      <button
        type="button"
        className="map-cluster"
        data-testid="map-cluster"
        style={{ transform: `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)` }}
        aria-label={`${markers.length} repères`}
        onClick={(event) => {
          event.stopPropagation()
          onFocus({ lat, lng })
        }}
      >
        {markers.length}
      </button>
    </div>
  )
}

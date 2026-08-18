import { screenPoint } from './geometry.js'

export function MarkerLayer({ markers, viewport, size }) {
  return (
    <div className="map-marker-layer" data-testid="map-marker-layer" data-marker-count={markers.length}>
      {markers.map((marker) => {
        const point = screenPoint(marker.lat, marker.lng, viewport, size)
        const visible = point.x > -60 && point.x < size.width + 60 && point.y > -60 && point.y < size.height + 60
        if (!visible) return null
        return (
          <button
            className="map-marker"
            key={marker.id}
            type="button"
            aria-label={marker.label}
            style={{ transform: `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)` }}
          >
            <span aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

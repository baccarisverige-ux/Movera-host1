import { TILE_SIZE, project } from '../geometry/geometry.js'

export function TileLayer({ viewport, size }) {
  const zoom = Math.floor(viewport.zoom)
  const scale = 2 ** (viewport.zoom - zoom)
  const tilesPerAxis = 2 ** zoom
  const center = project(viewport.lat, viewport.lng, zoom)
  const halfWidth = size.width / (2 * scale)
  const halfHeight = size.height / (2 * scale)
  const minTileX = Math.floor((center.x - halfWidth) / TILE_SIZE)
  const maxTileX = Math.floor((center.x + halfWidth) / TILE_SIZE)
  const minTileY = Math.max(0, Math.floor((center.y - halfHeight) / TILE_SIZE))
  const maxTileY = Math.min(tilesPerAxis - 1, Math.floor((center.y + halfHeight) / TILE_SIZE))
  const tiles = []

  for (let y = minTileY; y <= maxTileY; y += 1) {
    for (let x = minTileX; x <= maxTileX; x += 1) {
      const wrappedX = ((x % tilesPerAxis) + tilesPerAxis) % tilesPerAxis
      const left = (x * TILE_SIZE - center.x) * scale + size.width / 2
      const top = (y * TILE_SIZE - center.y) * scale + size.height / 2
      tiles.push({ x, y, wrappedX, left, top })
    }
  }

  return (
    <div className="map-tiles" data-testid="map-tile-layer" data-tile-count={tiles.length} data-tile-zoom={zoom} data-scale={scale} aria-hidden="true">
      {tiles.map((tile) => {
        const src = `https://tile.openstreetmap.org/${zoom}/${tile.wrappedX}/${tile.y}.png`
        return (
          <div
            className="map-tile"
            key={`${zoom}-${tile.x}-${tile.y}`}
            style={{ transform: `translate3d(${tile.left}px, ${tile.top}px, 0) scale(${scale})` }}
          >
            <img
              alt=""
              decoding="async"
              draggable="false"
              fetchPriority="high"
              loading="eager"
              src={src}
              onLoad={(event) => { event.currentTarget.style.visibility = 'visible' }}
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

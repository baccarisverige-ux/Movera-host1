import { TILE_SIZE, project } from './geometry.js'

export function TileLayer({ viewport, size }) {
  const zoom = Math.round(viewport.zoom)
  const tilesPerAxis = 2 ** zoom
  const center = project(viewport.lat, viewport.lng, zoom)
  const minTileX = Math.floor((center.x - size.width / 2) / TILE_SIZE) - 1
  const maxTileX = Math.floor((center.x + size.width / 2) / TILE_SIZE) + 1
  const minTileY = Math.max(0, Math.floor((center.y - size.height / 2) / TILE_SIZE) - 1)
  const maxTileY = Math.min(tilesPerAxis - 1, Math.floor((center.y + size.height / 2) / TILE_SIZE) + 1)
  const tiles = []

  for (let y = minTileY; y <= maxTileY; y += 1) {
    for (let x = minTileX; x <= maxTileX; x += 1) {
      const wrappedX = ((x % tilesPerAxis) + tilesPerAxis) % tilesPerAxis
      const left = x * TILE_SIZE - center.x + size.width / 2
      const top = y * TILE_SIZE - center.y + size.height / 2
      tiles.push({ x, y, wrappedX, left, top })
    }
  }

  return (
    <div className="map-tiles" data-testid="map-tile-layer" data-tile-count={tiles.length} aria-hidden="true">
      {tiles.map((tile) => (
        <div
          className="map-tile"
          key={`${zoom}-${tile.x}-${tile.y}`}
          style={{ transform: `translate3d(${tile.left}px, ${tile.top}px, 0)` }}
        >
          <img
            alt=""
            draggable="false"
            loading="eager"
            src={`https://tile.openstreetmap.org/${zoom}/${tile.wrappedX}/${tile.y}.png`}
            onError={(event) => { event.currentTarget.style.display = 'none' }}
          />
        </div>
      ))}
    </div>
  )
}

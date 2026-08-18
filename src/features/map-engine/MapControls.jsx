export function MapControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="map-controls" data-testid="map-controls">
      <button type="button" aria-label="Zoom avant" onClick={onZoomIn}>+</button>
      <button type="button" aria-label="Zoom arrière" onClick={onZoomOut}>−</button>
      <button className="map-controls__reset" type="button" aria-label="Recentrer la carte" onClick={onReset}>◎</button>
    </div>
  )
}

import { useRef, useState } from 'react'
import { TileLayer } from './layers/TileLayer.jsx'
import { ResizeManager } from './lifecycle/ResizeManager.jsx'

export function SearchMapPreview({ viewport }) {
  const surfaceRef = useRef(null)
  const [size, setSize] = useState({ width: 390, height: 560 })

  return (
    <div className="map-engine map-engine--preview" data-testid="search-map-preview">
      <div ref={surfaceRef} className="map-surface map-surface--preview">
        <TileLayer viewport={viewport} size={size} />
        <ResizeManager targetRef={surfaceRef} onSize={setSize} />
      </div>
    </div>
  )
}

let rendererPromise

export function loadMapRenderer() {
  if (!rendererPromise) {
    rendererPromise = Promise.all([
      import('maplibre-gl'),
      import('maplibre-gl/dist/maplibre-gl.css'),
    ]).then(([module]) => module.default)
  }
  return rendererPromise
}

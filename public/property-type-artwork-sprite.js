(() => {
  const scriptSrc = document.currentScript?.src || window.location.href
  const baseUrl = new URL('.', scriptSrc)
  const assetUrl = new URL('assets/bootstrap/property/property-drawings-sprite.webp.b64.txt', baseUrl)

  fetch(assetUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`property artwork ${response.status}`)
      return response.text()
    })
    .then((base64) => {
      const clean = base64.replace(/\s+/g, '')
      if (!clean.startsWith('UklG')) throw new Error('invalid property artwork')

      const dataUrl = `data:image/webp;base64,${clean}`
      const probe = new Image()
      probe.onload = () => {
        document.documentElement.style.setProperty('--property-drawings-sprite', `url("${dataUrl}")`)
        document.documentElement.dataset.propertyArtwork = 'ready'
      }
      probe.onerror = () => {
        document.documentElement.dataset.propertyArtwork = 'error'
      }
      probe.src = dataUrl
    })
    .catch(() => {
      document.documentElement.dataset.propertyArtwork = 'error'
    })
})()
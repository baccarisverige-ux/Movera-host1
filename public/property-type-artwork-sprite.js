(() => {
  const asset = 'assets/bootstrap/property/property-drawings-sprite.webp.b64.txt'
  const url = new URL(asset, document.baseURI)
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`property artwork ${response.status}`)
      return response.text()
    })
    .then((base64) => {
      const clean = base64.trim()
      if (!clean) return
      document.documentElement.style.setProperty('--property-drawings-sprite', `url("data:image/webp;base64,${clean}")`)
    })
    .catch(() => {})
})()

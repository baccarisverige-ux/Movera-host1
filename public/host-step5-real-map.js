(() => {
  const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  const NOMINATIM = 'https://nominatim.openstreetmap.org'
  const STORE_KEY = 'movera:host-pin-location:v1'
  let leafletPromise
  let currentMount = null
  let reverseTimer = null

  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L)
    if (leafletPromise) return leafletPromise
    leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector('link[data-host-leaflet]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = LEAFLET_CSS
        link.dataset.hostLeaflet = 'true'
        document.head.appendChild(link)
      }
      const existing = document.querySelector('script[data-host-leaflet]')
      if (existing) {
        existing.addEventListener('load', () => resolve(window.L), { once: true })
        existing.addEventListener('error', reject, { once: true })
        return
      }
      const script = document.createElement('script')
      script.src = LEAFLET_JS
      script.async = true
      script.dataset.hostLeaflet = 'true'
      script.onload = () => resolve(window.L)
      script.onerror = reject
      document.head.appendChild(script)
    })
    return leafletPromise
  }

  function addressLabel(result) {
    if (!result) return ''
    const a = result.address || {}
    const street = [a.house_number, a.road || a.pedestrian || a.footway].filter(Boolean).join(' ')
    const district = a.suburb || a.neighbourhood || a.quarter || a.village || ''
    const city = a.city || a.town || a.municipality || a.county || ''
    const postcode = a.postcode || ''
    const compact = [street, district, [postcode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
    return compact || result.display_name || ''
  }

  async function geocode(query) {
    if (!query || query.trim().length < 3) return null
    const url = `${NOMINATIM}/search?format=jsonv2&limit=1&addressdetails=1&accept-language=fr&q=${encodeURIComponent(query)}`
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('geocode failed')
    const items = await response.json()
    if (!Array.isArray(items) || !items[0]) return null
    return { lat: Number(items[0].lat), lng: Number(items[0].lon), raw: items[0] }
  }

  async function reverse(lat, lng) {
    const url = `${NOMINATIM}/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=fr&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('reverse geocode failed')
    return response.json()
  }

  function persist(lat, lng, label) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ lat, lng, address: label, updatedAt: Date.now() }))
    } catch {}
  }

  function savedLocation() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
      if (value && Number.isFinite(Number(value.lat)) && Number.isFinite(Number(value.lng))) return value
    } catch {}
    return null
  }

  function setChip(card, text) {
    const span = card.querySelector('.host-onboarding__address-chip span')
    if (span && text) span.textContent = text
  }

  function setHint(card, text) {
    const hint = card.querySelector('.host-onboarding__map-hint')
    if (hint && text) hint.textContent = text
  }

  function scheduleReverse(map, card) {
    clearTimeout(reverseTimer)
    setHint(card, 'Détection de l’adresse…')
    reverseTimer = setTimeout(async () => {
      const center = map.getCenter()
      try {
        const result = await reverse(center.lat, center.lng)
        const label = addressLabel(result)
        if (label) setChip(card, label)
        persist(center.lat, center.lng, label || result.display_name || '')
        setHint(card, 'Déplacez la carte pour ajuster le repère')
      } catch {
        persist(center.lat, center.lng, '')
        setHint(card, 'Position ajustée · adresse non disponible')
      }
    }, 420)
  }

  function locateUser(map, card, button) {
    if (!navigator.geolocation) {
      setHint(card, 'La géolocalisation n’est pas disponible')
      return
    }
    button.dataset.loading = 'true'
    setHint(card, 'Recherche de votre position…')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        button.dataset.loading = 'false'
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        map.flyTo([lat, lng], 17, { duration: 0.65 })
        try {
          const result = await reverse(lat, lng)
          const label = addressLabel(result)
          if (label) setChip(card, label)
          persist(lat, lng, label || result.display_name || '')
          setHint(card, 'Adresse détectée à partir de votre position')
        } catch {
          persist(lat, lng, '')
          setHint(card, 'Position détectée')
        }
      },
      () => {
        button.dataset.loading = 'false'
        setHint(card, 'Autorisez la localisation ou déplacez la carte')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    )
  }

  async function mount() {
    const section = document.querySelector('.host-onboarding[data-screen="pin"]')
    const card = section?.querySelector('.host-onboarding__map-card')
    if (!card || card.dataset.realMapMounted === 'true') return

    card.dataset.realMapMounted = 'true'
    setHint(card, 'Chargement de la carte…')

    try {
      const L = await loadLeaflet()
      if (!card.isConnected || !document.querySelector('.host-onboarding[data-screen="pin"]')) return

      const layer = document.createElement('div')
      layer.className = 'host-step5-real-map'
      const mapNode = document.createElement('div')
      layer.appendChild(mapNode)
      card.prepend(layer)

      const centerPin = document.createElement('div')
      centerPin.className = 'host-step5-center-pin'
      centerPin.setAttribute('aria-hidden', 'true')
      card.appendChild(centerPin)

      const locate = document.createElement('button')
      locate.type = 'button'
      locate.className = 'host-step5-location-button'
      locate.setAttribute('aria-label', 'Utiliser ma position actuelle')
      locate.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path><circle cx="12" cy="12" r="8"></circle></svg>'
      card.appendChild(locate)

      const map = L.map(mapNode, {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true,
        scrollWheelZoom: false,
      }).setView([36.8065, 10.1815], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      map.zoomControl.setPosition('bottomright')
      map.on('moveend', () => scheduleReverse(map, card))
      locate.addEventListener('click', () => locateUser(map, card, locate))

      currentMount = { card, map }
      setTimeout(() => map.invalidateSize(), 80)

      const saved = savedLocation()
      if (saved) {
        map.setView([Number(saved.lat), Number(saved.lng)], 17, { animate: false })
        if (saved.address) setChip(card, saved.address)
        setHint(card, 'Déplacez la carte pour ajuster le repère')
        return
      }

      const typedAddress = card.querySelector('.host-onboarding__address-chip span')?.textContent?.trim() || ''
      try {
        const found = await geocode(typedAddress)
        if (found && Number.isFinite(found.lat) && Number.isFinite(found.lng)) {
          map.setView([found.lat, found.lng], 17, { animate: false })
          const label = addressLabel(found.raw)
          if (label) setChip(card, label)
          persist(found.lat, found.lng, label)
          setHint(card, 'Adresse détectée · déplacez la carte si nécessaire')
        } else {
          setHint(card, 'Adresse introuvable · utilisez votre position')
        }
      } catch {
        setHint(card, 'Utilisez votre position ou déplacez la carte')
      }
    } catch {
      card.dataset.realMapMounted = 'error'
      setHint(card, 'Impossible de charger la carte pour le moment')
    }
  }

  const observer = new MutationObserver(() => {
    if (currentMount && !currentMount.card.isConnected) {
      try { currentMount.map.remove() } catch {}
      currentMount = null
    }
    mount()
  })

  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-screen'] })
  mount()
})()

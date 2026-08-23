import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BEACH_HERO_IMAGE from './features/beach/assets/hero.webp'
import GUESTHOUSE_HERO_IMAGE from './features/guesthouse/assets/hero.webp'
import HOTEL_HERO_IMAGE from './features/hotel/assets/hero.webp'
import './index.css'
import './styles/partner-category.css'
import './styles/category-luxury-3d.css'
import './styles/collection-card-size.css'
import './styles/home-scroll-link.css'
import './styles/welcome-city-cards.css'
import './styles/search-close-sync.css'
import './styles/search-open-slow.css'
import './styles/search-motion-very-slow.css'
import './styles/search-popup-continuity.css'
import './features/home/categoryIdentity.js'
import './features/home/homeScrollLink.js'
import './features/search/searchOpenFocusGuard.js'
import App from './app/App.jsx'

for (const src of [BEACH_HERO_IMAGE, GUESTHOUSE_HERO_IMAGE, HOTEL_HERO_IMAGE]) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.setAttribute('fetchpriority', 'high')
  document.head.appendChild(link)

  const image = new Image()
  image.decoding = 'async'
  image.fetchPriority = 'high'
  image.src = src
  image.decode?.().catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

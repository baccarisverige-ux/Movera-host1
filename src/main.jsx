import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/partner-category.css'
import './styles/category-luxury-3d.css'
import './styles/collection-card-size.css'
import './styles/home-scroll-link.css'
import './styles/search-close-sync.css'
import './features/home/categoryIdentity.js'
import './features/home/homeScrollLink.js'
import './features/search/searchOpenFocusGuard.js'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

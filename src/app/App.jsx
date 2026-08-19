import { useEffect } from 'react'
import { ResilienceLayer } from '../features/resilience/ResilienceLayer.jsx'
import { SearchTransitionHost } from '../features/search-transition/SearchTransitionHost.jsx'
import { GlobalErrorBoundary } from './error-boundary/GlobalErrorBoundary.jsx'
import { AppProviders } from './providers/AppProviders.jsx'
import { AppRouter, navigate } from './router/index.jsx'

const HOME_ACCESSIBLE_NAMES = {
  homeSearchBtn: 'Rechercher une destination',
  homeMapBtn: 'Explorer la carte',
}

function HomeAccessibilityNames() {
  useEffect(() => {
    const applyAccessibleNames = () => {
      for (const [id, label] of Object.entries(HOME_ACCESSIBLE_NAMES)) {
        const element = document.getElementById(id)
        if (element && element.getAttribute('aria-label') !== label) {
          element.setAttribute('aria-label', label)
        }
      }
    }

    applyAccessibleNames()
    const observer = new MutationObserver(applyAccessibleNames)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}

function App() {
  return (
    <GlobalErrorBoundary>
      <ResilienceLayer>
        <AppProviders>
          <HomeAccessibilityNames />
          <AppRouter />
          <SearchTransitionHost onNavigate={navigate} />
        </AppProviders>
      </ResilienceLayer>
    </GlobalErrorBoundary>
  )
}

export default App

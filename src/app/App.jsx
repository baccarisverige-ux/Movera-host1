import { ResilienceLayer } from '../features/resilience/ResilienceLayer.jsx'
import { GlobalErrorBoundary } from './error-boundary/GlobalErrorBoundary.jsx'
import { AppProviders } from './providers/AppProviders.jsx'
import { AppRouter } from './router/index.jsx'

function App() {
  return (
    <GlobalErrorBoundary>
      <ResilienceLayer>
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </ResilienceLayer>
    </GlobalErrorBoundary>
  )
}

export default App

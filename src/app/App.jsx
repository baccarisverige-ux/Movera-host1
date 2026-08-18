import { GlobalErrorBoundary } from './error-boundary/GlobalErrorBoundary.jsx'
import { AppProviders } from './providers/AppProviders.jsx'
import { AppRouter } from './router/index.jsx'

function App() {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </GlobalErrorBoundary>
  )
}

export default App

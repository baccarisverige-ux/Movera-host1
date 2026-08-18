import { Component } from 'react'

export class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Movera Host] Unhandled render error', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="global-error" data-testid="global-error-boundary">
          <p className="route-page__eyebrow">Erreur</p>
          <h1>Une erreur est survenue</h1>
          <p>L’application reste disponible. Rechargez la page pour réessayer.</p>
          <button className="route-link-button" type="button" onClick={() => window.location.assign('/')}>Retour à l’accueil</button>
        </main>
      )
    }
    return this.props.children
  }
}

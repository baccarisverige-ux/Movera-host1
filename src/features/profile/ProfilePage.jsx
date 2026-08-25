import { useMemo, useState } from 'react'
import { authProviderLabel, signInWithCredentials, startOAuthSignIn } from '../auth/authClient.js'
import { clearAuthSession, useAuthSession } from '../auth/authSession.js'
import './profile-page.css'

function AppleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.8 12.8c0-2.7 2.2-4 2.3-4.1-1.2-1.8-3.2-2-3.9-2-1.7-.2-3.2 1-4.1 1-.9 0-2.2-1-3.7-1C5.5 6.8 3.8 8 2.8 9.8c-2 3.5-.5 8.8 1.4 11.6.9 1.4 2 3 3.5 2.9 1.4-.1 2-1 3.8-1s2.3 1 3.8 1c1.6 0 2.6-1.4 3.5-2.8 1.1-1.6 1.5-3.2 1.5-3.3-.1 0-3.5-1.4-3.5-5.4ZM14.1 4.9c.8-1 1.4-2.4 1.2-3.9-1.2.1-2.7.8-3.6 1.8-.8.9-1.4 2.3-1.2 3.7 1.4.1 2.8-.6 3.6-1.6Z"/></svg>
}

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.3Z"/><path d="M12 22c2.7 0 5-.9 6.6-2.5L15.4 17c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.6Z"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"/></svg>
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3h2.4l1.2 4.4-2 1.4a15 15 0 0 0 6.4 6.4l1.4-2 4.4 1.2v2.4A3.2 3.2 0 0 1 17.8 20C10.2 20 4 13.8 4 6.2A3.2 3.2 0 0 1 7.2 3Z"/></svg>
}

function ChevronIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>
}

export function ProfilePage({ onNavigate }) {
  const { session, isAuthenticated } = useAuthSession()
  const [method, setMethod] = useState('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const returnTo = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get('returnTo')
    return value && value.startsWith('/') && !value.startsWith('//') ? value : ''
  }, [])

  const submitCredentials = (event) => {
    event.preventDefault()
    const result = signInWithCredentials({ method, identifier, password })
    if (!result.ok) {
      setFeedback({ type: 'error', message: result.message })
      return
    }
    setFeedback(null)
    if (returnTo && returnTo !== '/profile') onNavigate(returnTo)
  }

  const startProvider = (provider) => {
    setFeedback(null)
    const result = startOAuthSignIn(provider, returnTo || '/profile')
    if (!result.ok) setFeedback({ type: 'info', message: result.message })
  }

  const signOut = () => {
    clearAuthSession()
    setIdentifier('')
    setPassword('')
    setFeedback(null)
  }

  if (isAuthenticated && session) {
    const initial = (session.displayName || 'M').charAt(0).toUpperCase()
    const contact = session.email || session.phone || 'Compte Movera'
    return (
      <section className="profile-page profile-page--connected" data-testid="page-profile">
        <div className="profile-connected-hero">
          <span className="profile-eyebrow">Votre espace</span>
          <h1>Profil</h1>
          <div className="profile-identity-card">
            <div className="profile-avatar" aria-hidden="true">{initial}</div>
            <div className="profile-identity-copy">
              <strong>{session.displayName || 'Voyageur Movera'}</strong>
              <span>{contact}</span>
              <small>Connecté avec {authProviderLabel(session.provider)}</small>
            </div>
            <div className="profile-verified" aria-label="Session active"><ShieldIcon /></div>
          </div>
        </div>

        <div className="profile-connected-content">
          <span className="profile-section-label">Votre compte</span>
          <div className="profile-menu-card">
            <button type="button" onClick={() => onNavigate('/messages')}>
              <span className="profile-menu-icon"><MailIcon /></span>
              <span><strong>Messages</strong><small>Vos échanges et séjours</small></span>
              <ChevronIcon />
            </button>
            <button type="button" onClick={() => onNavigate('/favorites')}>
              <span className="profile-menu-icon profile-menu-icon--heart">♡</span>
              <span><strong>Favoris</strong><small>Vos adresses enregistrées</small></span>
              <ChevronIcon />
            </button>
          </div>

          <div className="profile-security-note">
            <ShieldIcon />
            <div><strong>Session Movera active</strong><span>Messages est maintenant déverrouillé sur cet appareil.</span></div>
          </div>

          <button type="button" className="profile-signout" onClick={signOut}>Se déconnecter</button>
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page" data-testid="page-profile">
      <header className="profile-login-hero">
        <span className="profile-eyebrow">Bienvenue chez Movera</span>
        <h1>Votre compte,<br/>simplement.</h1>
        <p>Connectez-vous pour retrouver vos messages, vos séjours et votre expérience Movera.</p>
      </header>

      <div className="profile-login-content">
        <div className="profile-social-stack" aria-label="Connexion rapide">
          <button type="button" className="profile-social-button profile-social-button--apple" onClick={() => startProvider('apple')}>
            <AppleIcon /><span>Continuer avec Apple</span>
          </button>
          <button type="button" className="profile-social-button profile-social-button--google" onClick={() => startProvider('google')}>
            <GoogleIcon /><span>Continuer avec Google</span>
          </button>
        </div>

        <div className="profile-divider"><span>ou</span></div>

        <div className="profile-method-switch" role="tablist" aria-label="Méthode de connexion">
          <button type="button" role="tab" aria-selected={method === 'email'} data-active={method === 'email' ? 'true' : 'false'} onClick={() => { setMethod('email'); setIdentifier(''); setFeedback(null) }}>
            <MailIcon />E-mail
          </button>
          <button type="button" role="tab" aria-selected={method === 'phone'} data-active={method === 'phone' ? 'true' : 'false'} onClick={() => { setMethod('phone'); setIdentifier(''); setFeedback(null) }}>
            <PhoneIcon />Téléphone
          </button>
        </div>

        <form className="profile-login-form" onSubmit={submitCredentials} noValidate>
          <label>
            <span>{method === 'email' ? 'Adresse e-mail' : 'Numéro de téléphone'}</span>
            <div className="profile-field">
              {method === 'email' ? <MailIcon /> : <PhoneIcon />}
              <input
                type={method === 'email' ? 'email' : 'tel'}
                inputMode={method === 'email' ? 'email' : 'tel'}
                autoComplete={method === 'email' ? 'email' : 'tel'}
                value={identifier}
                onChange={(event) => { setIdentifier(event.target.value); setFeedback(null) }}
                placeholder={method === 'email' ? 'vous@exemple.com' : '+216 00 000 000'}
                aria-label={method === 'email' ? 'Adresse e-mail' : 'Numéro de téléphone'}
              />
            </div>
          </label>

          <label>
            <span>Mot de passe</span>
            <div className="profile-field profile-field--password">
              <span className="profile-password-dot" aria-hidden="true">●</span>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setFeedback(null) }}
                placeholder="6 caractères minimum"
                aria-label="Mot de passe"
              />
              <button type="button" className="profile-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </label>

          {feedback ? <div className={`profile-feedback profile-feedback--${feedback.type}`} role="status">{feedback.message}</div> : null}

          <button type="submit" className="profile-submit">Se connecter</button>
        </form>

        <div className="profile-login-note">
          <ShieldIcon />
          <p><strong>Connexion protégée</strong><span>Le mot de passe n’est jamais conservé dans la session locale Movera.</span></p>
        </div>
      </div>
    </section>
  )
}

import { writeAuthSession } from './authSession.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[0-9][0-9\s().-]{7,19}$/

const OAUTH_ENTRYPOINTS = Object.freeze({
  google: import.meta.env.VITE_GOOGLE_AUTH_URL || '',
  apple: import.meta.env.VITE_APPLE_AUTH_URL || '',
})

function cleanPhone(value = '') {
  return value.replace(/[\s().-]/g, '')
}

function displayNameFromIdentifier(method, identifier) {
  if (method === 'email') {
    const local = identifier.split('@')[0] || 'Voyageur'
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Voyageur'
  }
  return 'Voyageur Movera'
}

export function validateCredentialSignIn({ method, identifier, password }) {
  const value = String(identifier || '').trim()
  const secret = String(password || '')

  if (method === 'email' && !EMAIL_RE.test(value)) {
    return { ok: false, field: 'identifier', message: 'Entrez une adresse e-mail valide.' }
  }
  if (method === 'phone' && !PHONE_RE.test(value)) {
    return { ok: false, field: 'identifier', message: 'Entrez un numéro de téléphone valide.' }
  }
  if (secret.length < 6) {
    return { ok: false, field: 'password', message: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }
  return { ok: true }
}

export function signInWithCredentials({ method, identifier, password }) {
  const validation = validateCredentialSignIn({ method, identifier, password })
  if (!validation.ok) return validation

  const normalizedIdentifier = method === 'phone'
    ? cleanPhone(identifier.trim())
    : identifier.trim().toLowerCase()

  // Frontend prototype session. A production backend must verify the credential before calling writeAuthSession.
  const session = writeAuthSession({
    authenticated: true,
    userId: `${method}:${normalizedIdentifier}`,
    displayName: displayNameFromIdentifier(method, normalizedIdentifier),
    provider: method,
    email: method === 'email' ? normalizedIdentifier : '',
    phone: method === 'phone' ? normalizedIdentifier : '',
  })

  return { ok: true, session }
}

export function startOAuthSignIn(provider, returnTo = '/profile') {
  const entrypoint = OAUTH_ENTRYPOINTS[provider]
  if (!entrypoint) {
    return {
      ok: false,
      code: 'provider_not_configured',
      message: `Connexion ${provider === 'apple' ? 'Apple' : 'Google'} non configurée sur cet environnement.`,
    }
  }

  try {
    const target = new URL(entrypoint, window.location.origin)
    target.searchParams.set('return_to', returnTo.startsWith('/') ? returnTo : '/profile')
    window.location.assign(target.toString())
    return { ok: true }
  } catch {
    return { ok: false, code: 'invalid_provider_url', message: 'Configuration de connexion invalide.' }
  }
}

export function authProviderLabel(provider) {
  return ({ apple: 'Apple', google: 'Google', email: 'E-mail', phone: 'Téléphone' })[provider] || 'Movera'
}

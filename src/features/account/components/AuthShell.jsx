import { useState } from 'react'
import { authStore } from '../authStore.js'

export function AuthShell({ mode, onNavigate }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('demo@movera.test')
  const [password, setPassword] = useState('Movera123!')
  const [message, setMessage] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const result = mode === 'register' ? authStore.register({ name, email, password }) : mode === 'forgot' ? authStore.forgot(email) : authStore.login({ email, password })
    setMessage(result.message || '')
    if (result.ok && mode !== 'forgot') onNavigate('/profile')
  }
  const title = mode === 'register' ? 'Créer un compte' : mode === 'forgot' ? 'Mot de passe oublié' : 'Connexion'
  return <section className="account-page auth-page" data-testid={`page-${mode}`}><h1>{title}</h1><form onSubmit={submit}>{mode === 'register' ? <label>Nom<input aria-label="Nom" value={name} onChange={e => setName(e.target.value)} required /></label> : null}<label>Email<input aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>{mode !== 'forgot' ? <label>Mot de passe<input aria-label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label> : null}<button type="submit">{title}</button></form>{message ? <p role="alert">{message}</p> : null}{mode === 'login' ? <><button onClick={() => onNavigate('/register')}>Créer un compte</button><button onClick={() => onNavigate('/forgot-password')}>Mot de passe oublié</button></> : null}</section>
}

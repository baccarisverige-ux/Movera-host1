import { useState } from 'react'
import { storageAdapter } from '../../../services/storage/storageAdapter.js'
import { authStore } from '../authStore.js'
import { favoritesStore } from '../favoritesStore.js'
import '../accountStyles.js'

const LANGUAGE_KEY = 'movera-pref-language'

export function ProfilePage({ onNavigate }) {
  const session = authStore.getSession()
  const [language, setLanguage] = useState(storageAdapter.get(LANGUAGE_KEY, 'fr'))
  if (!session) return null
  return <section className="account-page" data-testid="page-profile"><h1>Profil</h1><section data-testid="profile-account"><h2>Compte</h2><p>{session.name || 'Utilisateur'} · {session.email}</p></section><section data-testid="profile-preferences"><h2>Préférences</h2><label>Langue<select aria-label="Langue" value={language} onChange={e => { setLanguage(e.target.value); storageAdapter.set(LANGUAGE_KEY, e.target.value) }}><option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option></select></label></section><section data-testid="profile-saved"><h2>Données enregistrées</h2><p>{favoritesStore.getAll().length} favori(s)</p></section><section data-testid="profile-settings"><h2>Paramètres</h2><button data-testid="logout" onClick={() => { authStore.logout(); onNavigate('/login') }}>Déconnexion</button></section></section>
}

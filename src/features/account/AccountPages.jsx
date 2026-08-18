import { useEffect,useState } from 'react'
import { getListingDetail } from '../listing-detail/listingDetailData.js'
import { authStore } from './authStore.js'
import { favoritesStore } from './favoritesStore.js'
import '../../styles/account.css'

export function FavoritesPage({onNavigate}){
  const [ids,setIds]=useState(()=>favoritesStore.getAll())
  useEffect(()=>favoritesStore.subscribe(()=>setIds(favoritesStore.getAll())),[])
  return <section className="account-page" data-testid="page-favorites"><h1>Favoris</h1>{ids.length===0?<p data-testid="favorites-empty">Aucun favori.</p>:<div>{ids.map(id=>{const l=getListingDetail(id);return <article className="favorite-card" data-testid={`favorite-${id}`} key={id}><div><strong>{l?.title||id}</strong><p>{l?.location||''}</p></div><button onClick={()=>favoritesStore.toggle(id)}>Retirer</button><button onClick={()=>onNavigate(`/listing/${id}`)}>Voir</button></article>})}</div>}</section>
}

function AuthShell({mode,onNavigate}){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('demo@movera.test')
  const [password,setPassword]=useState('Movera123!')
  const [message,setMessage]=useState('')
  const submit=(e)=>{e.preventDefault();const result=mode==='register'?authStore.register({name,email,password}):mode==='forgot'?authStore.forgot(email):authStore.login({email,password});setMessage(result.message||'');if(result.ok&&mode!=='forgot')onNavigate('/profile')}
  const title=mode==='register'?'Créer un compte':mode==='forgot'?'Mot de passe oublié':'Connexion'
  return <section className="account-page auth-page" data-testid={`page-${mode}`}><h1>{title}</h1><form onSubmit={submit}>{mode==='register'?<label>Nom<input aria-label="Nom" value={name} onChange={e=>setName(e.target.value)} required/></label>:null}<label>Email<input aria-label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>{mode!=='forgot'?<label>Mot de passe<input aria-label="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>:null}<button type="submit">{title}</button></form>{message?<p role="alert">{message}</p>:null}{mode==='login'?<><button onClick={()=>onNavigate('/register')}>Créer un compte</button><button onClick={()=>onNavigate('/forgot-password')}>Mot de passe oublié</button></>:null}</section>
}
export const LoginPage=(props)=><AuthShell mode="login" {...props}/>
export const RegisterPage=(props)=><AuthShell mode="register" {...props}/>
export const ForgotPasswordPage=(props)=><AuthShell mode="forgot" {...props}/>

export function ProfilePage({onNavigate}){
  const session=authStore.getSession()
  const [language,setLanguage]=useState(localStorage.getItem('movera-pref-language')||'fr')
  if(!session)return null
  return <section className="account-page" data-testid="page-profile"><h1>Profil</h1><section data-testid="profile-account"><h2>Compte</h2><p>{session.name||'Utilisateur'} · {session.email}</p></section><section data-testid="profile-preferences"><h2>Préférences</h2><label>Langue<select aria-label="Langue" value={language} onChange={e=>{setLanguage(e.target.value);localStorage.setItem('movera-pref-language',e.target.value)}}><option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option></select></label></section><section data-testid="profile-saved"><h2>Données enregistrées</h2><p>{favoritesStore.getAll().length} favori(s)</p></section><section data-testid="profile-settings"><h2>Paramètres</h2><button data-testid="logout" onClick={()=>{authStore.logout();onNavigate('/login')}}>Déconnexion</button></section></section>
}

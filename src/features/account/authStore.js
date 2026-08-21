import { storageAdapter } from '../../services/storage/storageAdapter.js'

const KEY='movera-session-v1'
const USERS='movera-users-v1'
const EVENT='movera:session-change'
function emit(){window.dispatchEvent(new CustomEvent(EVENT))}
export const authStore={
  getSession(){return storageAdapter.getJson(KEY,null)},
  isAuthenticated(){return Boolean(this.getSession()?.email)},
  register({name,email,password}){const users=storageAdapter.getJson(USERS,[]);if(users.some(u=>u.email===email))return{ok:false,message:'Compte déjà existant.'};users.push({name,email,password});storageAdapter.setJson(USERS,users);storageAdapter.setJson(KEY,{name,email});emit();return{ok:true}},
  login({email,password}){const users=storageAdapter.getJson(USERS,[]);let user=users.find(u=>u.email===email&&u.password===password);if(!user&&email==='demo@movera.test'&&password==='Movera123!')user={name:'Demo Movera',email};if(!user)return{ok:false,message:'Identifiants invalides.'};storageAdapter.setJson(KEY,{name:user.name,email:user.email});emit();return{ok:true}},
  logout(){storageAdapter.remove(KEY);emit()},
  forgot(email){return{ok:Boolean(email),message:email?'Instructions envoyées.':'Email requis.'}},
  subscribe(fn){window.addEventListener(EVENT,fn);return()=>window.removeEventListener(EVENT,fn)}
}

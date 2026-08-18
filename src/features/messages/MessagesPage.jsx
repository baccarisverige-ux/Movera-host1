import { useMemo,useState } from 'react'
import '../../styles/account.css'

const seed=[{id:'c1',name:'Imen',messages:[{id:'m1',from:'them',text:'Bonjour, votre arrivée est bien confirmée.'},{id:'m2',from:'me',text:'Merci, à bientôt.'}]},{id:'c2',name:'Seif',messages:[{id:'m3',from:'them',text:'Je reste disponible si besoin.'}]}]
export const MessagingService={list(){return seed.map(({id,name})=>({id,name}))},get(id){return seed.find(c=>c.id===id)||null}}
export function MessagesPage({params,onNavigate}){
  const conversations=useMemo(()=>MessagingService.list(),[])
  const [draft,setDraft]=useState('')
  const [local,setLocal]=useState([])
  const active=params.id?MessagingService.get(params.id):null
  if(!active)return <section className="account-page" data-testid="page-messages"><h1>Messages</h1><div data-testid="conversation-list">{conversations.map(c=><button key={c.id} onClick={()=>onNavigate(`/messages/${c.id}`)}>{c.name}</button>)}</div></section>
  const messages=[...active.messages,...local]
  return <section className="account-page" data-testid="page-conversation"><button onClick={()=>onNavigate('/messages')}>Retour</button><h1>{active.name}</h1><div data-testid="message-list">{messages.map(m=><p className={`message message--${m.from}`} data-testid="message-bubble" key={m.id}>{m.text}</p>)}</div><form data-testid="message-composer" onSubmit={e=>{e.preventDefault();if(!draft.trim())return;setLocal(x=>[...x,{id:`local-${Date.now()}`,from:'me',text:draft.trim()}]);setDraft('')}}><input aria-label="Message" value={draft} onChange={e=>setDraft(e.target.value)}/><button type="submit">Envoyer</button></form></section>
}

import { useState } from 'react'
import { MessageThread } from './components/MessagingViews.jsx'
import { MessagingService } from './data/messagingService.js'
import '../../styles/account.css'

export function ThreadPage({ params, onNavigate }) {
  const active=MessagingService.get(params.id)
  const [draft,setDraft]=useState('')
  const [local,setLocal]=useState([])
  if(!active)return <section className="account-page" data-testid="page-messages"><h1>Messages</h1><button onClick={()=>onNavigate('/messages')}>Retour</button></section>
  const onSend=(e)=>{e.preventDefault();if(!draft.trim())return;setLocal(x=>[...x,{id:`local-${Date.now()}`,from:'me',text:draft.trim()}]);setDraft('')}
  return <section className="account-page" data-testid="page-conversation"><button onClick={()=>onNavigate('/messages')}>Retour</button><h1>{active.name}</h1><MessageThread active={active} local={local} draft={draft} onDraft={setDraft} onSend={onSend}/></section>
}

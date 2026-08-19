import { useMemo } from 'react'
import { ConversationList } from './components/MessagingViews.jsx'
import { MessagingService } from './data/messagingService.js'
import '../../styles/account.css'

export function MessagesPage({ onNavigate }) {
  const conversations=useMemo(()=>MessagingService.list(),[])
  return <section className="account-page" data-testid="page-messages"><h1>Messages</h1><ConversationList conversations={conversations} onOpen={(id)=>onNavigate(`/messages/${id}`)}/></section>
}

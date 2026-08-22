export function ConversationList({ conversations, onOpen }) {
  return <div data-testid="conversation-list">{conversations.map(c=><button key={c.id} onClick={()=>onOpen(c.id)}>{c.name}</button>)}</div>
}

export function MessageThread({ active, local, draft, onDraft, onSend }) {
  const messages=[...active.messages,...local]
  return <><div data-testid="message-list">{messages.map(m=><p className={`message message--${m.from}`} data-testid="message-bubble" key={m.id}>{m.text}</p>)}</div><form data-testid="message-composer" onSubmit={onSend}><input aria-label="Message" value={draft} onChange={e=>onDraft(e.target.value)}/><button type="submit">Envoyer</button></form></>
}

import { useState } from 'react'
import '../../styles/host-app.css'

const KEY='movera-host-listings-v1'
const defaults=[
  {id:'marsa-sea',title:'La Marsa · Vue mer',price:180,status:'active'},
  {id:'carthage-suite',title:'Carthage · Suite',price:240,status:'active'},
]
const reservations=[
  {id:'R-101',guest:'Amine',listing:'La Marsa · Vue mer',status:'confirmed',date:'20–22 août'},
  {id:'R-102',guest:'Sarah',listing:'Carthage · Suite',status:'pending',date:'25–28 août'},
  {id:'R-103',guest:'Nadia',listing:'La Marsa · Vue mer',status:'completed',date:'10–12 août'},
  {id:'R-104',guest:'Yassine',listing:'Carthage · Suite',status:'cancelled',date:'5–7 août'},
]
function load(){try{return JSON.parse(localStorage.getItem(KEY))||defaults}catch{return defaults}}
function save(items){localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event('host-listings-change'))}
function useListings(){const [items,setItems]=useState(load);const commit=(next)=>{setItems(next);save(next)};return [items,commit]}
function Shell({title,children,testId}){return <section className="host-page" data-testid={testId}><header><p className="route-page__eyebrow">Host</p><h1>{title}</h1></header>{children}</section>}

export function HostDashboardPage({onNavigate}){
  const [items]=useListings();const active=items.filter(x=>x.status==='active').length
  return <Shell title="Tableau de bord" testId="page-host"><div className="host-kpis"><article data-testid="host-kpi-listings"><strong>{active}</strong><span>Annonces actives</span></article><article><strong>{reservations.filter(r=>r.status==='confirmed').length}</strong><span>Réservations confirmées</span></article><article><strong>1 420 TND</strong><span>Revenus période</span></article></div><section className="host-panel" data-testid="host-upcoming"><h2>Prochaines réservations</h2>{reservations.slice(0,2).map(r=><p key={r.id}>{r.guest} · {r.date} · {r.status}</p>)}</section><section className="host-panel" data-testid="host-alerts"><h2>Alertes</h2><p>1 demande de réservation à traiter.</p></section><button onClick={()=>onNavigate('/host/listings')}>Gérer mes annonces</button></Shell>
}

export function HostListingsPage({onNavigate}){
  const [items,setItems]=useListings();
  const archive=(id)=>setItems(items.map(x=>x.id===id?{...x,status:'archived'}:x))
  return <Shell title="Mes annonces" testId="page-host-listings"><button data-testid="host-create-link" onClick={()=>onNavigate('/host/listings/new')}>Créer une annonce</button><div className="host-list"><>{items.map(item=><article className="host-listing" key={item.id} data-testid={`host-listing-${item.id}`}><div><strong>{item.title}</strong><span>{item.price} TND/nuit · {item.status}</span></div><div><button onClick={()=>onNavigate(`/host/listings/${item.id}/edit`)}>Modifier</button>{item.status!=='archived'&&<button onClick={()=>archive(item.id)}>Archiver</button>}</div></article>)}</></div></Shell>
}

function ListingForm({initial,onSave,title,testId}){
  const [name,setName]=useState(initial?.title||'');const [price,setPrice]=useState(initial?.price||'');const [error,setError]=useState('')
  const submit=(e)=>{e.preventDefault();if(name.trim().length<3||Number(price)<=0){setError('Titre et prix valides requis.');return}onSave({title:name.trim(),price:Number(price)})}
  return <Shell title={title} testId={testId}><form className="host-form" onSubmit={submit}><label>Titre<input aria-label="Titre" value={name} onChange={e=>setName(e.target.value)}/></label><label>Prix par nuit<input aria-label="Prix par nuit" type="number" value={price} onChange={e=>setPrice(e.target.value)}/></label>{error&&<p role="alert">{error}</p>}<button type="submit">Enregistrer</button></form></Shell>
}
export function HostListingCreatePage({onNavigate}){const [items,setItems]=useListings();return <ListingForm title="Nouvelle annonce" testId="page-host-listing-new" onSave={(data)=>{const id=`listing-${Date.now()}`;setItems([...items,{id,...data,status:'active'}]);onNavigate('/host/listings')}}/>}
export function HostListingEditPage({params,onNavigate}){const [items,setItems]=useListings();const item=items.find(x=>x.id===params.id);if(!item)return <Shell title="Annonce introuvable" testId="host-listing-missing"><button onClick={()=>onNavigate('/host/listings')}>Retour</button></Shell>;return <ListingForm initial={item} title={`Modifier ${item.title}`} testId="page-host-listing-edit" onSave={(data)=>{setItems(items.map(x=>x.id===item.id?{...x,...data}:x));onNavigate('/host/listings')}}/>}

export function HostReservationsPage(){return <Shell title="Réservations" testId="page-host-reservations"><div className="host-status-grid">{['pending','confirmed','completed','cancelled'].map(status=><section className="host-panel" key={status} data-testid={`reservation-${status}`}><h2>{status}</h2>{reservations.filter(r=>r.status===status).map(r=><p key={r.id}>{r.guest} · {r.listing} · {r.date}</p>)}</section>)}</div></Shell>}
export function HostCalendarPage(){const [blocked,setBlocked]=useState(['2026-08-30']);return <Shell title="Calendrier" testId="page-host-calendar"><section className="host-panel"><h2>Disponibilités</h2><p>Août 2026 · dates ouvertes par défaut</p><label>Bloquer une date<input aria-label="Bloquer une date" type="date" onChange={e=>e.target.value&&setBlocked([...new Set([...blocked,e.target.value])])}/></label><div data-testid="calendar-blocked">{blocked.map(d=><span className="host-chip" key={d}>{d}</span>)}</div></section></Shell>}
export function HostEarningsPage(){const rows=[['Août 2026','1 420 TND','Prévu'],['Juillet 2026','3 880 TND','Payé']];return <Shell title="Revenus" testId="page-host-earnings"><section className="host-panel"><h2>Payouts</h2>{rows.map(([period,amount,status])=><p key={period} data-testid="earning-row"><strong>{period}</strong> · {amount} · {status}</p>)}</section></Shell>}
export function HostSettingsPage(){const [instant,setInstant]=useState(false);return <Shell title="Paramètres" testId="page-host-settings"><section className="host-panel"><h2>Préférences hôte</h2><label><input type="checkbox" checked={instant} onChange={e=>setInstant(e.target.checked)}/> Réservation instantanée</label></section></Shell>}

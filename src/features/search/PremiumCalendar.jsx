import { useMemo, useState } from 'react'
import { IconButton } from '../../shared/ui/index.jsx'
import { MotionPresence, MotionSurface } from '../../shared/motion/index.jsx'

const WEEKDAYS=['L','M','M','J','V','S','D']
const MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

const pad=n=>String(n).padStart(2,'0')
const toKey=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`
const fromKey=value=>value?new Date(`${value}T12:00:00`):null
const startOfMonth=date=>new Date(date.getFullYear(),date.getMonth(),1,12)
const addMonths=(date,amount)=>new Date(date.getFullYear(),date.getMonth()+amount,1,12)
const sameDay=(a,b)=>a&&b&&toKey(a)===toKey(b)
const isBefore=(a,b)=>a&&b&&a.getTime()<b.getTime()
const inRange=(date,start,end)=>start&&end&&date>start&&date<end

function buildDays(month,arrival,departure){
 const first=startOfMonth(month)
 const mondayOffset=(first.getDay()+6)%7
 const gridStart=new Date(first);gridStart.setDate(first.getDate()-mondayOffset)
 const today=new Date();today.setHours(0,0,0,0)
 return Array.from({length:42},(_,index)=>{
  const date=new Date(gridStart);date.setDate(gridStart.getDate()+index);date.setHours(12,0,0,0)
  const outside=date.getMonth()!==month.getMonth()
  const disabled=date<today
  return {id:toKey(date),date,label:date.getDate(),outside,disabled,isArrival:sameDay(date,arrival),isDeparture:sameDay(date,departure),inRange:inRange(date,arrival,departure)}
 })
}

export function PremiumCalendar({arrival='',departure='',onChange}){
 const initial=fromKey(arrival)||new Date()
 const [month,setMonth]=useState(startOfMonth(initial))
 const start=fromKey(arrival),end=fromKey(departure)
 const days=useMemo(()=>buildDays(month,start,end),[month,arrival,departure])
 const choose=day=>{
  if(day.disabled)return
  const key=day.id
  if(!arrival||departure||isBefore(day.date,start)||sameDay(day.date,start)) onChange?.({arrival:key,departure:''})
  else onChange?.({arrival,departure:key})
 }
 const monthLabel=`${MONTHS[month.getMonth()]} ${month.getFullYear()}`
 return <section className="premium-calendar" aria-label={`Calendrier ${monthLabel}`}>
  <div className="premium-calendar__selection" aria-live="polite">
   <div data-active={!departure&&arrival?'true':'false'}><span>Arrivée</span><strong>{arrival||'Choisir'}</strong></div>
   <span aria-hidden="true">→</span>
   <div data-active={Boolean(arrival)&&!departure?'true':'false'}><span>Départ</span><strong>{departure||'Choisir'}</strong></div>
  </div>
  <div className="premium-calendar__toolbar"><IconButton label="Mois précédent" onClick={()=>setMonth(value=>addMonths(value,-1))}>‹</IconButton><strong>{monthLabel}</strong><IconButton label="Mois suivant" onClick={()=>setMonth(value=>addMonths(value,1))}>›</IconButton></div>
  <div className="premium-calendar__weekdays" aria-hidden="true">{WEEKDAYS.map((day,index)=><span key={`${day}-${index}`}>{day}</span>)}</div>
  <MotionPresence mode="wait">
   <MotionSurface key={`${month.getFullYear()}-${month.getMonth()}`} variant="fade" className="premium-calendar__grid">
    {days.map(day=><button type="button" key={day.id} disabled={day.disabled} data-outside={day.outside?'true':'false'} data-range={day.inRange?'true':'false'} data-edge={day.isArrival?'arrival':day.isDeparture?'departure':undefined} aria-label={day.id} aria-pressed={day.isArrival||day.isDeparture} onClick={()=>choose(day)}><span>{day.label}</span></button>)}
   </MotionSurface>
  </MotionPresence>
 </section>
}

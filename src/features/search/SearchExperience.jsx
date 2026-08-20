import { useMemo, useState } from 'react'
import { Button, Counter, SearchField, Stepper, Surface } from '../../shared/ui/index.jsx'
import { MotionPresence, MotionSurface } from '../../shared/motion/index.jsx'
import { PremiumCalendar } from './PremiumCalendar.jsx'
import './search-v2.css'

const STEPS=['Destination','Dates','Voyageurs']
const DESTINATIONS=['Sidi Bou Saïd','La Marsa','Hammamet','Sousse','Djerba']

export function SearchExperience({open,onClose,onNavigate}){
 const [step,setStep]=useState(0)
 const [destination,setDestination]=useState('')
 const [arrival,setArrival]=useState('')
 const [departure,setDeparture]=useState('')
 const [adults,setAdults]=useState(2)
 const [children,setChildren]=useState(0)
 const canContinue=step===0?destination.trim().length>0:step===1?Boolean(arrival&&departure):true
 const summary=useMemo(()=>`${adults+children} voyageur${adults+children>1?'s':''}`,[adults,children])
 if(!open)return null
 const next=()=>{if(step<2)setStep(step+1);else{const q=new URLSearchParams({destination,arrival,departure,guests:String(adults+children)});onClose?.();onNavigate(`/map?${q.toString()}`)}}
 return <div className="search-v2" role="dialog" aria-modal="true" aria-label="Recherche Movera">
   <button className="search-v2__backdrop" aria-label="Fermer la recherche" onClick={onClose}/>
   <MotionSurface className="search-v2__panel" variant="rise">
    <header className="search-v2__header"><button className="search-v2__close" onClick={onClose} aria-label="Fermer">×</button><div><span>Planifier votre séjour</span><strong>{STEPS[step]}</strong></div></header>
    <div className="search-v2__progress"><Stepper steps={STEPS} current={step}/></div>
    <div className="search-v2__content">
      <MotionPresence mode="wait">
       <MotionSurface key={step} variant="rise" className="search-v2__screen">
        {step===0&&<><p className="search-v2__eyebrow">Où souhaitez-vous aller ?</p><h2>Trouvez votre destination</h2><SearchField value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Ville, plage ou région" autoFocus/><div className="search-v2__suggestions">{DESTINATIONS.map(item=><button key={item} onClick={()=>setDestination(item)} data-active={destination===item?'true':'false'}>{item}</button>)}</div></>}
        {step===1&&<><p className="search-v2__eyebrow">Quand partez-vous ?</p><h2>Choisissez vos dates</h2><PremiumCalendar arrival={arrival} departure={departure} onChange={({arrival:nextArrival,departure:nextDeparture})=>{setArrival(nextArrival);setDeparture(nextDeparture)}}/></>}
        {step===2&&<><p className="search-v2__eyebrow">Qui voyage ?</p><h2>Ajoutez les voyageurs</h2><Surface className="search-v2__guests"><div><span><strong>Adultes</strong><small>13 ans et plus</small></span><Counter value={adults} min={1} onChange={setAdults}/></div><div><span><strong>Enfants</strong><small>2 à 12 ans</small></span><Counter value={children} min={0} onChange={setChildren}/></div></Surface><p className="search-v2__summary">{summary}</p></>}
       </MotionSurface>
      </MotionPresence>
    </div>
    <footer className="search-v2__footer">{step>0?<button className="search-v2__secondary" onClick={()=>setStep(step-1)}>Retour</button>:<span/>}<Button disabled={!canContinue} onClick={next}>{step===2?'Afficher sur la carte':'Continuer'}</Button></footer>
   </MotionSurface>
 </div>
}

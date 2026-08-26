import { useMemo, useState } from 'react'
import { activateHostProfile } from '../../../entities/host/hostProfileStore.js'
import { useAuthSession } from '../../auth/authSession.js'
import './host-onboarding-page.css'

const PROPERTY_TYPES = ['Appartement', 'Villa', "Maison d’hôte", 'Hôtel']

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M6.5 10v10h11V10M9.5 20v-5h5v5"/></svg>
}

export function HostOnboardingPage({ onNavigate, onActivated }) {
  const { session } = useAuthSession()
  const [step, setStep] = useState(0)
  const [listingName, setListingName] = useState('')
  const [city, setCity] = useState('La Marsa')
  const [type, setType] = useState('Appartement')
  const [basePrice, setBasePrice] = useState('180')
  const [confirmedAuthority, setConfirmedAuthority] = useState(false)
  const [acceptedRules, setAcceptedRules] = useState(false)
  const [feedback, setFeedback] = useState('')

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(listingName.trim() && city.trim() && type)
    if (step === 2) return Number(basePrice) > 0
    if (step === 3) return confirmedAuthority && acceptedRules
    return true
  }, [step, listingName, city, type, basePrice, confirmedAuthority, acceptedRules])

  const next = () => {
    setFeedback('')
    if (!canContinue) {
      setFeedback('Complétez cette étape pour continuer.')
      return
    }
    if (step < 3) setStep((value) => value + 1)
  }

  const finish = () => {
    if (!canContinue || !session?.userId) return
    const profile = activateHostProfile(session.userId, {
      id: 'primary-listing',
      name: listingName,
      city,
      type,
      basePrice: Number(basePrice),
    })
    onActivated?.(profile)
  }

  return (
    <section className="host-onboarding" data-testid="host-onboarding" data-step={step}>
      <header className="host-onboarding__topbar">
        <button type="button" aria-label={step === 0 ? 'Retour au profil' : 'Étape précédente'} onClick={() => step === 0 ? onNavigate('/profile') : setStep((value) => Math.max(0, value - 1))}>
          <BackIcon />
        </button>
        <strong>Movera Host</strong>
        <span>{step ? `${step}/3` : ''}</span>
      </header>

      <div className="host-onboarding__progress" aria-hidden="true"><i style={{ width: `${step ? (step / 3) * 100 : 0}%` }} /></div>

      {step === 0 ? (
        <main className="host-onboarding__intro">
          <div className="host-onboarding__symbol"><HomeIcon /></div>
          <span className="host-onboarding__eyebrow">Première fois</span>
          <h1>Devenir hôte avec Movera.</h1>
          <p>Préparez votre premier logement, définissez votre prix de départ et confirmez les informations essentielles. Vous pourrez ensuite gérer sa disponibilité depuis le calendrier Hôte.</p>
          <div className="host-onboarding__intro-points">
            <span><b>01</b> Votre logement</span>
            <span><b>02</b> Prix & disponibilité</span>
            <span><b>03</b> Confirmation Hôte</span>
          </div>
          <button type="button" className="host-onboarding__primary" onClick={() => setStep(1)}>Commencer <ArrowIcon /></button>
        </main>
      ) : null}

      {step === 1 ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Votre premier logement</span>
          <h1>Qu’allez-vous accueillir ?</h1>
          <p>Ces informations créent le logement actif de votre calendrier Hôte.</p>
          <label><span>Nom du logement</span><input value={listingName} onChange={(event) => setListingName(event.target.value)} placeholder="Ex. Villa Saphir — Front de mer" aria-label="Nom du logement" /></label>
          <label><span>Ville</span><input value={city} onChange={(event) => setCity(event.target.value)} aria-label="Ville du logement" /></label>
          <div className="host-onboarding__types" role="radiogroup" aria-label="Type de logement">
            {PROPERTY_TYPES.map((item) => <button key={item} type="button" role="radio" aria-checked={type === item} data-active={type === item ? 'true' : 'false'} onClick={() => setType(item)}>{item}</button>)}
          </div>
        </main>
      ) : null}

      {step === 2 ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Calendrier</span>
          <h1>Définissez votre prix de départ.</h1>
          <p>Le calendrier utilisera ce tarif comme base. Vous pourrez ensuite modifier plusieurs jours ou bloquer des dates.</p>
          <label className="host-onboarding__price"><span>Prix par nuit</span><div><input inputMode="numeric" value={basePrice} onChange={(event) => setBasePrice(event.target.value.replace(/\D/g, '').slice(0, 5))} aria-label="Prix par nuit" /><b>TND</b></div></label>
          <div className="host-onboarding__preview"><small>Aperçu</small><strong>{Number(basePrice) || 0} TND</strong><span>par nuit · modifiable dans le calendrier</span></div>
        </main>
      ) : null}

      {step === 3 ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Activation</span>
          <h1>Confirmez votre espace Hôte.</h1>
          <p>Cette version prototype prépare votre espace localement. Une vérification d’identité et de paiement réelle sera branchée au backend plus tard.</p>
          <div className="host-onboarding__summary"><span>{type}</span><strong>{listingName}</strong><small>{city} · {Number(basePrice) || 0} TND / nuit</small></div>
          <label className="host-onboarding__check"><input type="checkbox" checked={confirmedAuthority} onChange={(event) => setConfirmedAuthority(event.target.checked)} /><span>Je confirme être autorisé à proposer ce logement sur Movera.</span></label>
          <label className="host-onboarding__check"><input type="checkbox" checked={acceptedRules} onChange={(event) => setAcceptedRules(event.target.checked)} /><span>J’accepte les règles Hôte et les conditions de la plateforme.</span></label>
        </main>
      ) : null}

      {step > 0 ? (
        <footer className="host-onboarding__footer">
          {feedback ? <span role="status">{feedback}</span> : null}
          <button type="button" className="host-onboarding__primary" onClick={step === 3 ? finish : next}>{step === 3 ? 'Activer mon espace Hôte' : 'Continuer'} <ArrowIcon /></button>
        </footer>
      ) : null}
    </section>
  )
}

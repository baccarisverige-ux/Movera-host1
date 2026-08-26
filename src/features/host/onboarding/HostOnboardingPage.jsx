import { useEffect, useMemo, useState } from 'react'
import { activateHostProfile } from '../../../entities/host/hostProfileStore.js'
import { ParkingIcon, SnowflakeIcon, WavesIcon, WifiIcon } from '../../../shared/icons/AppIcons.jsx'
import { useAuthSession } from '../../auth/authSession.js'
import { clearHostOnboardingDraft, readHostOnboardingDraft, writeHostOnboardingDraft } from './hostOnboardingDraftStore.js'
import {
  HOST_AMENITIES,
  HOST_GUEST_ACCESS,
  HOST_HIGHLIGHTS,
  HOST_ONBOARDING_SCREENS,
  HOST_PHASES,
  HOST_PROMOTIONS,
  HOST_PROPERTY_TYPES,
  phaseProgress,
  screenId,
  screenPhase,
} from './hostOnboardingModel.js'
import './host-onboarding-page.css'

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

function BookmarkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12v16l-6-3.7-6 3.7z" /></svg>
}

function QuestionIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.8 9.2a2.4 2.4 0 1 1 3.4 2.2c-.9.5-1.2 1-1.2 2M12 17h.01"/></svg>
}

function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7"/><path d="M6.5 10v10h11V10M9.5 20v-5h5v5"/></svg>
}

function PinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>
}

function PhotoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="m5.5 17 4.5-4.5 3 3 2-2 3.5 3.5"/></svg>
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7"/></svg>
}

function AmenityGlyph({ id }) {
  if (id === 'wifi') return <WifiIcon size={24} />
  if (id === 'parking') return <ParkingIcon size={24} />
  if (id === 'pool') return <WavesIcon size={24} />
  if (id === 'ac') return <SnowflakeIcon size={24} />
  const glyphs = {
    tv: 'TV',
    kitchen: 'K',
    washer: 'W',
    gym: 'G',
    'hot-tub': 'H',
    fireplace: 'F',
    outdoor: 'O',
    workspace: 'D',
  }
  return <span className="host-onboarding__letter-icon" aria-hidden="true">{glyphs[id] || '•'}</span>
}

function CounterRow({ label, value, min = 0, onChange }) {
  return (
    <div className="host-onboarding__counter-row">
      <strong>{label}</strong>
      <div>
        <button type="button" aria-label={`Réduire ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <b>{value}</b>
        <button type="button" aria-label={`Augmenter ${label}`} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  )
}

function PhaseTracker({ phase }) {
  return (
    <div className="host-onboarding__phase-tracker" aria-label={`Phase ${phase} sur 3`}>
      {HOST_PHASES.map((item) => {
        const state = item.id < phase ? 'done' : item.id === phase ? 'active' : 'future'
        return (
          <div key={item.id} data-state={state}>
            <span>{state === 'done' ? <CheckIcon /> : item.id}</span>
            <small>{item.label}</small>
          </div>
        )
      })}
    </div>
  )
}

function PhaseIntro({ number, eyebrow, title, text }) {
  return (
    <main className="host-onboarding__phase-intro">
      <div className="host-onboarding__phase-visual"><span>{number}</span><HomeIcon /></div>
      <span className="host-onboarding__eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </main>
  )
}

export function HostOnboardingPage({ onNavigate, onActivated }) {
  const { session } = useAuthSession()
  const [draft, setDraft] = useState(() => readHostOnboardingDraft(session?.userId))
  const [step, setStep] = useState(() => Math.min(readHostOnboardingDraft(session?.userId).screenIndex || 0, HOST_ONBOARDING_SCREENS.length - 1))
  const [feedback, setFeedback] = useState('')

  const id = screenId(step)
  const phase = screenPhase(step)
  const internalProgress = phaseProgress(step)

  useEffect(() => {
    const nextDraft = readHostOnboardingDraft(session?.userId)
    setDraft(nextDraft)
    setStep(Math.min(nextDraft.screenIndex || 0, HOST_ONBOARDING_SCREENS.length - 1))
  }, [session?.userId])

  useEffect(() => {
    if (!session?.userId) return
    writeHostOnboardingDraft(session.userId, { ...draft, screenIndex: step })
  }, [session?.userId, draft, step])

  const updateDraft = (patch) => setDraft((current) => ({ ...current, ...patch }))
  const updateSafety = (key, value) => setDraft((current) => ({ ...current, safety: { ...current.safety, [key]: value } }))

  const canContinue = useMemo(() => {
    if (id === 'property-type') return Boolean(draft.propertyType)
    if (id === 'guest-access') return Boolean(draft.guestAccess)
    if (id === 'address') return Boolean(draft.address.trim() && draft.city.trim())
    if (id === 'pin') return draft.pinConfirmed
    if (id === 'basics') return draft.guests >= 1 && draft.bedrooms >= 0 && draft.beds >= 1 && draft.bathrooms >= 0
    if (id === 'title') return draft.title.trim().length >= 5
    if (id === 'highlights') return draft.highlights.length >= 1 && draft.highlights.length <= 2
    if (id === 'description') return draft.description.trim().length >= 20
    if (id === 'booking') return Boolean(draft.bookingMode)
    if (id === 'price') return Number(draft.basePrice) > 0
    if (id === 'review') return draft.confirmedAuthority && draft.acceptedRules
    return true
  }, [id, draft])

  const toggleArrayValue = (field, value, max = Infinity) => {
    setDraft((current) => {
      const values = Array.isArray(current[field]) ? current[field] : []
      const exists = values.includes(value)
      if (exists) return { ...current, [field]: values.filter((item) => item !== value) }
      if (values.length >= max) return current
      return { ...current, [field]: [...values, value] }
    })
  }

  const goBack = () => {
    setFeedback('')
    if (step === 0) onNavigate('/profile')
    else setStep((value) => Math.max(0, value - 1))
  }

  const next = () => {
    setFeedback('')
    if (!canContinue) {
      setFeedback('Complétez cette étape pour continuer.')
      return
    }
    if (step < HOST_ONBOARDING_SCREENS.length - 1) setStep((value) => value + 1)
  }

  const finish = () => {
    if (!session?.userId || !canContinue) return
    const profile = activateHostProfile(session.userId, {
      id: 'primary-listing',
      name: draft.title.trim(),
      city: draft.city.trim(),
      type: draft.propertyType,
      basePrice: Number(draft.basePrice),
      address: draft.address.trim(),
      guestAccess: draft.guestAccess,
      guests: draft.guests,
      bedrooms: draft.bedrooms,
      beds: draft.beds,
      bathrooms: draft.bathrooms,
      amenities: draft.amenities,
      highlights: draft.highlights,
      description: draft.description.trim(),
      bookingMode: draft.bookingMode,
      promotions: draft.promotions,
      safety: draft.safety,
      photos: [],
    })
    clearHostOnboardingDraft(session.userId)
    onActivated?.(profile)
  }

  return (
    <section className="host-onboarding" data-testid="host-onboarding" data-screen={id} data-phase={phase}>
      <header className="host-onboarding__topbar">
        <button type="button" className="host-onboarding__top-pill" onClick={() => onNavigate('/profile')}><BookmarkIcon /> Enregistrer et quitter</button>
        <button type="button" className="host-onboarding__top-pill" onClick={() => setFeedback('Le centre d’aide Hôte sera ajouté dans une prochaine étape.')}><QuestionIcon /> Questions ?</button>
      </header>

      <div className="host-onboarding__micro-progress" aria-hidden="true"><i style={{ width: `${Math.round(internalProgress * 100)}%` }} /></div>

      {id === 'intro-place' ? (
        <PhaseIntro number="01" eyebrow="Étape 1" title="Parlez-nous de votre logement." text="Type de logement, accès voyageurs, adresse et informations essentielles : on commence par les bases." />
      ) : null}

      {id === 'property-type' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Votre logement</span>
          <h1>Quel type de logement proposez-vous ?</h1>
          <p>Choisissez la catégorie qui décrit le mieux votre bien.</p>
          <div className="host-onboarding__choice-grid" role="radiogroup" aria-label="Type de logement">
            {HOST_PROPERTY_TYPES.map((item) => <button key={item} type="button" role="radio" aria-checked={draft.propertyType === item} data-active={draft.propertyType === item ? 'true' : 'false'} onClick={() => updateDraft({ propertyType: item })}><span>{item.slice(0, 1)}</span><strong>{item}</strong></button>)}
          </div>
        </main>
      ) : null}

      {id === 'guest-access' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Accès voyageurs</span>
          <h1>Quel espace auront les voyageurs ?</h1>
          <div className="host-onboarding__stacked-options" role="radiogroup" aria-label="Accès voyageurs">
            {HOST_GUEST_ACCESS.map((item) => <button key={item.id} type="button" role="radio" aria-checked={draft.guestAccess === item.id} data-active={draft.guestAccess === item.id ? 'true' : 'false'} onClick={() => updateDraft({ guestAccess: item.id })}><span className="host-onboarding__radio-dot"/><div><strong>{item.label}</strong><small>{item.description}</small></div><HomeIcon /></button>)}
          </div>
        </main>
      ) : null}

      {id === 'address' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Adresse</span>
          <h1>Où se trouve votre logement ?</h1>
          <p>L’adresse exacte ne sera communiquée aux voyageurs qu’après réservation.</p>
          <label><span>Adresse du logement</span><input value={draft.address} onChange={(event) => updateDraft({ address: event.target.value, pinConfirmed: false })} placeholder="Ex. 14 avenue Habib Bourguiba" aria-label="Adresse du logement" /></label>
          <label><span>Ville</span><input value={draft.city} onChange={(event) => updateDraft({ city: event.target.value, pinConfirmed: false })} aria-label="Ville du logement" /></label>
          <div className="host-onboarding__address-note"><PinIcon /><span>Nous utiliserons cette adresse pour positionner le logement sur la carte.</span></div>
        </main>
      ) : null}

      {id === 'pin' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Emplacement</span>
          <h1>Le repère est-il au bon endroit ?</h1>
          <p>Vous pourrez connecter la géolocalisation exacte plus tard. Pour l’instant, confirmez l’adresse saisie.</p>
          <div className="host-onboarding__map-card">
            <div className="host-onboarding__address-chip"><PinIcon /><span>{draft.address}, {draft.city}</span></div>
            <div className="host-onboarding__map-pin"><HomeIcon /></div>
            <span className="host-onboarding__map-road host-onboarding__map-road--one" />
            <span className="host-onboarding__map-road host-onboarding__map-road--two" />
            <span className="host-onboarding__map-road host-onboarding__map-road--three" />
          </div>
          <button type="button" className="host-onboarding__secondary" data-active={draft.pinConfirmed ? 'true' : 'false'} onClick={() => updateDraft({ pinConfirmed: true })}>{draft.pinConfirmed ? 'Emplacement confirmé' : 'Confirmer cet emplacement'} {draft.pinConfirmed ? <CheckIcon /> : <PinIcon />}</button>
        </main>
      ) : null}

      {id === 'basics' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Capacité</span>
          <h1>Quelques informations de base.</h1>
          <p>Vous pourrez préciser les couchages et les pièces plus tard.</p>
          <div className="host-onboarding__counter-card">
            <CounterRow label="Voyageurs" value={draft.guests} min={1} onChange={(value) => updateDraft({ guests: value })} />
            <CounterRow label="Chambres" value={draft.bedrooms} onChange={(value) => updateDraft({ bedrooms: value })} />
            <CounterRow label="Lits" value={draft.beds} min={1} onChange={(value) => updateDraft({ beds: value })} />
            <CounterRow label="Salles de bain" value={draft.bathrooms} onChange={(value) => updateDraft({ bathrooms: value })} />
          </div>
        </main>
      ) : null}

      {id === 'intro-presentation' ? (
        <PhaseIntro number="02" eyebrow="Étape 2" title="Mettez votre logement en valeur." text="Équipements, photos, titre et description : donnez aux voyageurs une image claire de leur futur séjour." />
      ) : null}

      {id === 'amenities' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Équipements</span>
          <h1>Que propose votre logement ?</h1>
          <p>Sélectionnez les équipements disponibles. Vous pourrez compléter cette liste plus tard.</p>
          <div className="host-onboarding__amenity-grid">
            {HOST_AMENITIES.map((item) => {
              const active = draft.amenities.includes(item.id)
              return <button key={item.id} type="button" aria-pressed={active} data-active={active ? 'true' : 'false'} onClick={() => toggleArrayValue('amenities', item.id)}><AmenityGlyph id={item.id} /><strong>{item.label}</strong>{active ? <span className="host-onboarding__choice-check"><CheckIcon /></span> : null}</button>
            })}
          </div>
        </main>
      ) : null}

      {id === 'photos' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Photos</span>
          <h1>Ajoutez les photos de votre logement.</h1>
          <p>Les emplacements restent volontairement vides pour l’instant. Nous brancherons l’upload photo plus tard.</p>
          <div className="host-onboarding__photo-grid" data-testid="host-photo-placeholders">
            <div className="host-onboarding__photo-main"><PhotoIcon /><span>Photo principale</span></div>
            {[1, 2, 3, 4].map((item) => <div key={item}><PhotoIcon /><span>Photo {item + 1}</span></div>)}
          </div>
          <div className="host-onboarding__skip-note">Aucune photo n’est requise dans cette version de test.</div>
        </main>
      ) : null}

      {id === 'title' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Titre</span>
          <h1>Donnez un nom à votre logement.</h1>
          <p>Un titre court, précis et facile à reconnaître.</p>
          <label><span>Titre de l’annonce</span><textarea rows="4" maxLength="50" value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} placeholder="Ex. Villa Saphir — Front de mer" aria-label="Titre de l’annonce" /></label>
          <span className="host-onboarding__char-count">{draft.title.length}/50</span>
        </main>
      ) : null}

      {id === 'highlights' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Points forts</span>
          <h1>Qu’est-ce qui décrit le mieux votre logement ?</h1>
          <p>Choisissez jusqu’à 2 points forts.</p>
          <div className="host-onboarding__chips">
            {HOST_HIGHLIGHTS.map((item) => {
              const active = draft.highlights.includes(item.id)
              return <button key={item.id} type="button" aria-pressed={active} data-active={active ? 'true' : 'false'} onClick={() => toggleArrayValue('highlights', item.id, 2)}>{active ? <CheckIcon /> : null}{item.label}</button>
            })}
          </div>
          <small className="host-onboarding__selection-count">{draft.highlights.length}/2 sélectionné{draft.highlights.length > 1 ? 's' : ''}</small>
        </main>
      ) : null}

      {id === 'description' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Description</span>
          <h1>Présentez votre logement.</h1>
          <p>Expliquez simplement ce qui rend le séjour agréable et particulier.</p>
          <label><span>Description</span><textarea rows="10" maxLength="500" value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} placeholder="Décrivez l’ambiance, les espaces et les principaux atouts…" aria-label="Description du logement" /></label>
          <span className="host-onboarding__char-count">{draft.description.length}/500</span>
        </main>
      ) : null}

      {id === 'safety' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Sécurité</span>
          <h1>Partagez les informations de sécurité.</h1>
          <div className="host-onboarding__safety-card">
            <strong>Surveillance & sécurité</strong>
            <label className="host-onboarding__toggle-row"><span>Caméra extérieure présente</span><input type="checkbox" checked={draft.safety.exteriorCamera} onChange={(event) => updateSafety('exteriorCamera', event.target.checked)} /></label>
            <label className="host-onboarding__toggle-row"><span>Moniteur de bruit présent</span><input type="checkbox" checked={draft.safety.noiseMonitor} onChange={(event) => updateSafety('noiseMonitor', event.target.checked)} /></label>
            <label className="host-onboarding__toggle-row"><span>Arme présente sur la propriété</span><input type="checkbox" checked={draft.safety.weapons} onChange={(event) => updateSafety('weapons', event.target.checked)} /></label>
          </div>
          <div className="host-onboarding__safety-card">
            <strong>Équipements de sécurité</strong>
            <label className="host-onboarding__toggle-row"><span>Détecteur de fumée</span><input type="checkbox" checked={draft.safety.smokeAlarm} onChange={(event) => updateSafety('smokeAlarm', event.target.checked)} /></label>
            <label className="host-onboarding__toggle-row"><span>Détecteur de monoxyde de carbone</span><input type="checkbox" checked={draft.safety.carbonMonoxideAlarm} onChange={(event) => updateSafety('carbonMonoxideAlarm', event.target.checked)} /></label>
          </div>
        </main>
      ) : null}

      {id === 'intro-publish' ? (
        <PhaseIntro number="03" eyebrow="Étape 3" title="Finalisez et publiez." text="Choisissez le fonctionnement des réservations, définissez le prix et vérifiez les derniers réglages avant activation." />
      ) : null}

      {id === 'booking' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Réservations</span>
          <h1>Comment souhaitez-vous recevoir les réservations ?</h1>
          <div className="host-onboarding__stacked-options" role="radiogroup" aria-label="Mode de réservation">
            <button type="button" role="radio" aria-checked={draft.bookingMode === 'request-first'} data-active={draft.bookingMode === 'request-first' ? 'true' : 'false'} onClick={() => updateDraft({ bookingMode: 'request-first' })}><span className="host-onboarding__radio-dot"/><div><strong>Approuver les premières réservations</strong><small>Vous examinez chaque demande avant de confirmer.</small></div></button>
            <button type="button" role="radio" aria-checked={draft.bookingMode === 'instant'} data-active={draft.bookingMode === 'instant' ? 'true' : 'false'} onClick={() => updateDraft({ bookingMode: 'instant' })}><span className="host-onboarding__radio-dot"/><div><strong>Réservation instantanée</strong><small>Les voyageurs peuvent réserver automatiquement.</small></div></button>
          </div>
        </main>
      ) : null}

      {id === 'price' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Tarification</span>
          <h1>Définissez votre prix de départ.</h1>
          <p>Ce tarif sera utilisé comme base dans le calendrier Hôte.</p>
          <label className="host-onboarding__price"><span>Prix de base par nuit</span><div><input inputMode="numeric" value={draft.basePrice} onChange={(event) => updateDraft({ basePrice: event.target.value.replace(/\D/g, '').slice(0, 5) })} aria-label="Prix par nuit" /><b>TND</b></div></label>
          <div className="host-onboarding__preview"><small>Aperçu calendrier</small><strong>{Number(draft.basePrice) || 0} TND</strong><span>par nuit · modifiable ensuite jour par jour</span></div>
        </main>
      ) : null}

      {id === 'promotions' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Promotions</span>
          <h1>Ajoutez des réductions si vous le souhaitez.</h1>
          <p>Ces réglages sont facultatifs et pourront être modifiés après publication.</p>
          <div className="host-onboarding__promotion-list">
            {HOST_PROMOTIONS.map((item) => {
              const active = draft.promotions.includes(item.id)
              return <button key={item.id} type="button" aria-pressed={active} data-active={active ? 'true' : 'false'} onClick={() => toggleArrayValue('promotions', item.id)}><b>{item.value}%</b><span><strong>{item.label}</strong><small>{item.detail}</small></span><i>{active ? <CheckIcon /> : null}</i></button>
            })}
          </div>
        </main>
      ) : null}

      {id === 'review' ? (
        <main className="host-onboarding__step">
          <span className="host-onboarding__eyebrow">Vérification finale</span>
          <h1>Votre logement est prêt.</h1>
          <p>Vérifiez les informations principales avant d’activer votre espace Hôte.</p>
          <div className="host-onboarding__review-card">
            <span>{draft.propertyType} · {draft.city}</span>
            <strong>{draft.title}</strong>
            <small>{draft.guests} voyageurs · {draft.bedrooms} chambre{draft.bedrooms > 1 ? 's' : ''} · {Number(draft.basePrice) || 0} TND / nuit</small>
          </div>
          <div className="host-onboarding__review-section"><strong>Réservation</strong><span>{draft.bookingMode === 'instant' ? 'Réservation instantanée' : 'Validation des premières demandes'}</span></div>
          <div className="host-onboarding__review-section"><strong>Équipements</strong><span>{draft.amenities.length} sélectionné{draft.amenities.length > 1 ? 's' : ''}</span></div>
          <div className="host-onboarding__review-section"><strong>Photos</strong><span>À ajouter plus tard</span></div>
          <label className="host-onboarding__check"><input type="checkbox" checked={draft.confirmedAuthority} onChange={(event) => updateDraft({ confirmedAuthority: event.target.checked })} /><span>Je confirme être autorisé à proposer ce logement sur Movera.</span></label>
          <label className="host-onboarding__check"><input type="checkbox" checked={draft.acceptedRules} onChange={(event) => updateDraft({ acceptedRules: event.target.checked })} /><span>J’accepte les règles Hôte et les conditions de la plateforme.</span></label>
        </main>
      ) : null}

      <footer className="host-onboarding__footer">
        <PhaseTracker phase={phase} />
        {feedback ? <span className="host-onboarding__feedback" role="status">{feedback}</span> : null}
        <div className="host-onboarding__footer-actions">
          <button type="button" className="host-onboarding__back" onClick={goBack}>Retour</button>
          <button type="button" className="host-onboarding__primary" disabled={!canContinue} onClick={id === 'review' ? finish : next}>{id === 'review' ? 'Publier le logement' : step === 0 ? 'Commencer' : 'Continuer'} <ArrowIcon /></button>
        </div>
      </footer>
    </section>
  )
}

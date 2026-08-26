import './host-intro-premium.css'

const INTRO_SELECTOR = '.host-onboarding[data-screen="intro-place"] .host-onboarding__phase-visual'
const PROPERTY_TYPE_SELECTOR = '.host-onboarding[data-screen="property-type"] .host-onboarding__step'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const HOST_INTRO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/host-intro.mp4`
const PROPERTY_TYPES = ['Appartement', 'Villa', "Maison d’hôte", 'Hôtel']

function createIntroVideo() {
  const video = document.createElement('video')
  video.className = 'host-onboarding__intro-video'
  video.src = HOST_INTRO_VIDEO_SRC
  video.muted = true
  video.defaultMuted = true
  video.loop = false
  video.playsInline = true
  video.preload = 'auto'
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  video.setAttribute('aria-hidden', 'true')
  video.tabIndex = -1

  if (!window.matchMedia?.(REDUCED_MOTION_QUERY).matches) {
    video.autoplay = true
    video.addEventListener('canplay', () => {
      const playPromise = video.play()
      if (playPromise?.catch) playPromise.catch(() => {})
    }, { once: true })
  }

  return video
}

function illustrationMarkup(type) {
  if (type === 'Appartement') {
    return `<svg viewBox="0 0 180 132" aria-hidden="true">
      <ellipse cx="94" cy="68" rx="55" ry="47" fill="#faf8f3"/>
      <g stroke="#242622" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M50 104V26h48v78M98 46h22v58M42 104h90" fill="#fff"/>
        <path d="M61 39h8v13h-8zM79 39h8v13h-8zM61 60h8v13h-8zM79 60h8v13h-8zM61 81h8v13h-8zM79 81h8v13h-8z" fill="#dfe8d8"/>
        <path d="M106 60h7v12h-7zM106 80h7v12h-7z" fill="#eadfca"/>
        <path d="M62 104V90h17v14" fill="#efe9df"/>
        <path d="M128 104c-8-13-4-27 3-35 8 8 12 22 3 35" fill="#8aa47d"/>
        <path d="M131 80v24"/>
        <path d="M38 104c2-9 8-14 14-14 5 0 8 5 8 14" fill="#a8b99b"/>
      </g>
    </svg>`
  }

  if (type === 'Villa') {
    return `<svg viewBox="0 0 180 132" aria-hidden="true">
      <ellipse cx="89" cy="68" rx="60" ry="45" fill="#faf8f3"/>
      <g stroke="#252724" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M44 103V59l42-25 40 25v44M34 103h104" fill="#fff"/>
        <path d="M52 57 86 37l34 20" fill="none"/>
        <path d="M77 103V79h20v24" fill="#f0e4d0"/>
        <path d="M55 72h15v19H55zM104 72h15v19h-15z" fill="#dce8e0"/>
        <path d="M34 103h104v7H34z" fill="#efe5d2"/>
        <path d="M134 103V55M126 60c5-10 10-14 14-16M142 61c-4-9-9-14-14-17M135 55c8-7 15-8 21-8M135 55c-8-7-15-8-21-8" fill="none"/>
        <path d="M128 99c2-9 7-14 12-14 6 0 10 5 12 14" fill="#8da77e"/>
        <path d="M38 101c1-8 5-13 10-13 4 0 8 4 9 13" fill="#9fb48f"/>
      </g>
    </svg>`
  }

  if (type === "Maison d’hôte") {
    return `<svg viewBox="0 0 180 132" aria-hidden="true">
      <ellipse cx="87" cy="69" rx="57" ry="44" fill="#faf8f3"/>
      <g stroke="#242622" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M46 103V62l36-25 35 25v41M36 103h97" fill="#fff"/>
        <path d="m44 63 38-27 38 27" fill="none"/>
        <path d="M70 103V78h24v25" fill="#eee2cf"/>
        <path d="M54 73h10v15H54zM101 73h10v15h-10z" fill="#dfe9dc"/>
        <path d="M126 103c-8-17-3-36 6-49 9 13 14 32 6 49" fill="#78936c"/>
        <path d="M132 70v33"/>
        <path d="M37 102c2-8 6-12 11-12s8 4 10 12M102 103c2-8 6-12 11-12s8 4 10 12" fill="#a9bb9e"/>
        <path d="M62 103c0-8 5-13 11-13" fill="none"/>
      </g>
    </svg>`
  }

  return `<svg viewBox="0 0 180 132" aria-hidden="true">
    <ellipse cx="88" cy="70" rx="61" ry="44" fill="#faf8f3"/>
    <g stroke="#242622" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M43 104V54h89v50M31 104h113" fill="#fff"/>
      <path d="M54 54V42h67v12" fill="#f0e5d4"/>
      <path d="M77 104V78h22v26" fill="#eee5d7"/>
      <path d="M52 65h10v13H52zM69 65h10v13H69zM103 65h10v13h-10zM120 65h10v13h-10zM52 84h10v13H52zM120 84h10v13h-10z" fill="#dfe9dd"/>
      <path d="M55 36h9M71 36h9M87 36h9M103 36h9M119 36h9" stroke="#7d9a70" stroke-width="5"/>
      <path d="M35 103c1-8 5-13 10-13s8 5 9 13M128 103c1-8 5-13 10-13s8 5 9 13" fill="#8fa980"/>
    </g>
  </svg>`
}

function checkMarkup() {
  return `<span class="host-onboarding__property-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6.5 12.5 3.4 3.4 7.7-8"/></svg></span>`
}

function findUnderlyingPropertyButton(label) {
  const buttons = document.querySelectorAll('.host-onboarding[data-screen="property-type"] .host-onboarding__choice-grid button')
  return Array.from(buttons).find((button) => button.querySelector('strong')?.textContent?.trim() === label) || null
}

function triggerHostAction(selector) {
  const button = document.querySelector(`.host-onboarding[data-screen="property-type"] ${selector}`)
  button?.click()
}

function syncPropertyTypeScreen(screen) {
  if (!screen) return
  let selected = ''
  PROPERTY_TYPES.forEach((label) => {
    const source = findUnderlyingPropertyButton(label)
    const active = source?.getAttribute('aria-checked') === 'true' || source?.dataset.active === 'true'
    const card = screen.querySelector(`[data-property-type="${CSS.escape(label)}"]`)
    if (!card) return
    card.dataset.active = active ? 'true' : 'false'
    card.setAttribute('aria-checked', active ? 'true' : 'false')
    const check = card.querySelector('.host-onboarding__property-check')
    if (check) check.hidden = !active
    if (active) selected = label
  })

  const continueButton = screen.querySelector('.host-onboarding__coded-continue')
  if (continueButton) continueButton.disabled = !selected
}

function createPropertyTypeScreen() {
  const screen = document.createElement('main')
  screen.className = 'host-onboarding__coded-property-screen'
  screen.innerHTML = `
    <div class="host-onboarding__coded-property-content">
      <span class="host-onboarding__coded-eyebrow">Étape 1</span>
      <h1>Quel type décrit<br>le mieux votre logement&nbsp;?</h1>
      <p>Choisissez la catégorie qui correspond<br>le mieux à votre bien.</p>
      <div class="host-onboarding__coded-property-grid" role="radiogroup" aria-label="Type de logement"></div>
    </div>
    <div class="host-onboarding__coded-bottom">
      <div class="host-onboarding__coded-tracker" aria-label="Étape 1 sur 4">
        <div data-state="active"><span>1</span><small>Votre logement</small></div><i></i>
        <div><span>2</span><small>Équipements</small></div><i></i>
        <div><span>3</span><small>Réglages</small></div><i></i>
        <div><span>4</span><small>Publication</small></div>
      </div>
      <div class="host-onboarding__coded-actions">
        <button type="button" class="host-onboarding__coded-back" aria-label="Retour"><span aria-hidden="true">←</span><b>Retour</b></button>
        <button type="button" class="host-onboarding__coded-continue"><b>Continuer</b><span aria-hidden="true">→</span></button>
      </div>
    </div>`

  const grid = screen.querySelector('.host-onboarding__coded-property-grid')
  PROPERTY_TYPES.forEach((label) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'host-onboarding__coded-property-card'
    button.dataset.propertyType = label
    button.setAttribute('role', 'radio')
    button.setAttribute('aria-checked', 'false')
    button.innerHTML = `${checkMarkup()}<span class="host-onboarding__coded-property-illustration">${illustrationMarkup(label)}</span><strong>${label}</strong>`
    button.addEventListener('click', () => {
      findUnderlyingPropertyButton(label)?.click()
      requestAnimationFrame(() => syncPropertyTypeScreen(screen))
    })
    grid.append(button)
  })

  screen.querySelector('.host-onboarding__coded-back')?.addEventListener('click', () => triggerHostAction('.host-onboarding__back'))
  screen.querySelector('.host-onboarding__coded-continue')?.addEventListener('click', () => triggerHostAction('.host-onboarding__primary'))
  return screen
}

function enhanceHostIntro() {
  const intro = document.querySelector(INTRO_SELECTOR)
  if (!intro || intro.querySelector('.host-onboarding__intro-video')) return
  intro.classList.add('host-onboarding__phase-visual--video')
  intro.append(createIntroVideo())
}

function enhancePropertyTypeScreen() {
  const step = document.querySelector(PROPERTY_TYPE_SELECTOR)
  if (!step) return

  let screen = step.querySelector('.host-onboarding__coded-property-screen')
  if (!screen) {
    step.classList.add('host-onboarding__step--coded-property')
    screen = createPropertyTypeScreen()
    step.append(screen)
  }
  syncPropertyTypeScreen(screen)
}

function enhanceHostOnboardingVisuals() {
  enhanceHostIntro()
  enhancePropertyTypeScreen()
}

const observer = new MutationObserver(enhanceHostOnboardingVisuals)
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['data-screen', 'aria-checked', 'data-active'],
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceHostOnboardingVisuals, { once: true })
} else {
  enhanceHostOnboardingVisuals()
}

requestAnimationFrame(enhanceHostOnboardingVisuals)

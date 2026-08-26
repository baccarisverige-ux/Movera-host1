import './host-intro-premium.css'

const INTRO_SELECTOR = '.host-onboarding[data-screen="intro-place"] .host-onboarding__phase-visual'
const PROPERTY_TYPE_SELECTOR = '.host-onboarding[data-screen="property-type"] .host-onboarding__step'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const HOST_INTRO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/host-intro.mp4`
const HOST_PROPERTY_TYPE_IMAGE_SRC = `${import.meta.env.BASE_URL}assets/bootstrap/bb.jpeg`

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

function triggerHostAction(selector) {
  const button = document.querySelector(`.host-onboarding[data-screen="property-type"] ${selector}`)
  button?.click()
}

function createPropertyTypeScreen() {
  const screen = document.createElement('div')
  screen.className = 'host-onboarding__bb-screen'

  const image = document.createElement('img')
  image.className = 'host-onboarding__bb-screen-image'
  image.src = HOST_PROPERTY_TYPE_IMAGE_SRC
  image.alt = 'Choix du type de logement'
  image.decoding = 'async'
  image.loading = 'eager'
  image.draggable = false

  const backHit = document.createElement('button')
  backHit.type = 'button'
  backHit.className = 'host-onboarding__bb-hit host-onboarding__bb-hit--back'
  backHit.setAttribute('aria-label', 'Retour')
  backHit.addEventListener('click', () => triggerHostAction('.host-onboarding__back'))

  const continueHit = document.createElement('button')
  continueHit.type = 'button'
  continueHit.className = 'host-onboarding__bb-hit host-onboarding__bb-hit--continue'
  continueHit.setAttribute('aria-label', 'Continuer')
  continueHit.addEventListener('click', () => triggerHostAction('.host-onboarding__primary'))

  screen.append(image, backHit, continueHit)
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
  if (!step || step.querySelector('.host-onboarding__bb-screen')) return

  step.classList.add('host-onboarding__step--bb-screen')
  step.append(createPropertyTypeScreen())
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
  attributeFilter: ['data-screen'],
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceHostOnboardingVisuals, { once: true })
} else {
  enhanceHostOnboardingVisuals()
}

requestAnimationFrame(enhanceHostOnboardingVisuals)

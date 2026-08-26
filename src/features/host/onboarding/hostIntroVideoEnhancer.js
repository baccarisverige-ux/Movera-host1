import './host-intro-premium.css'

const INTRO_SELECTOR = '.host-onboarding[data-screen="intro-place"] .host-onboarding__phase-visual'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const HOST_INTRO_VIDEO_SRC = `${import.meta.env.BASE_URL}assets/host-intro.mp4`

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

function enhanceHostIntro() {
  const intro = document.querySelector(INTRO_SELECTOR)
  if (!intro || intro.querySelector('.host-onboarding__intro-video')) return

  intro.classList.add('host-onboarding__phase-visual--video')
  intro.append(createIntroVideo())
}

const observer = new MutationObserver(enhanceHostIntro)
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['data-screen'],
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceHostIntro, { once: true })
} else {
  enhanceHostIntro()
}

requestAnimationFrame(enhanceHostIntro)

(() => {
  const STAGE_BY_SCREEN = Object.freeze({
    'intro-place': 1,
    'property-type': 1,
    'guest-access': 1,
    address: 1,
    pin: 1,
    basics: 1,

    'intro-presentation': 2,
    amenities: 2,
    photos: 2,

    title: 3,
    highlights: 3,
    description: 3,
    safety: 3,
    'intro-publish': 3,
    booking: 3,
    price: 3,
    promotions: 3,
  })

  function applyStageLabel() {
    const onboarding = document.querySelector('.host-onboarding[data-screen]')
    if (!onboarding) return

    const screen = onboarding.dataset.screen || ''
    const stage = STAGE_BY_SCREEN[screen] || 4
    const eyebrow = onboarding.querySelector('.host-onboarding__eyebrow')

    if (eyebrow && eyebrow.textContent !== `Étape ${stage}`) {
      eyebrow.textContent = `Étape ${stage}`
    }
  }

  const observer = new MutationObserver(applyStageLabel)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-screen'],
  })

  applyStageLabel()
})()

const SEARCH_TRIGGER = '.b225-search'
const SEARCH_TRANSITION = '[data-testid="search-transition"]'
const KEYBOARD_FREE_STEPS = new Set(['dates', 'guests'])

function blurCurrentField() {
  const active = document.activeElement
  if (active instanceof HTMLElement && active !== document.body) active.blur()
}

function currentSearchStep() {
  return document.querySelector(SEARCH_TRANSITION)?.getAttribute('data-step') || ''
}

function dismissKeyboardForStep() {
  if (!KEYBOARD_FREE_STEPS.has(currentSearchStep())) return
  blurCurrentField()
}

function onSearchPointerDown(event) {
  const trigger = event.target instanceof Element ? event.target.closest(SEARCH_TRIGGER) : null
  if (!trigger || !document.querySelector('[data-testid="page-home"]')) return
  blurCurrentField()
}

function onSearchClick(event) {
  const trigger = event.target instanceof Element ? event.target.closest(SEARCH_TRIGGER) : null
  if (!trigger || !document.querySelector('[data-testid="page-home"]')) return
  blurCurrentField()
}

function onFocusIn() {
  if (!KEYBOARD_FREE_STEPS.has(currentSearchStep())) return
  requestAnimationFrame(blurCurrentField)
}

const stepObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-step') {
      dismissKeyboardForStep()
      requestAnimationFrame(dismissKeyboardForStep)
      return
    }

    if (mutation.type === 'childList') {
      const popup = document.querySelector(SEARCH_TRANSITION)
      if (popup && KEYBOARD_FREE_STEPS.has(popup.getAttribute('data-step'))) {
        dismissKeyboardForStep()
        requestAnimationFrame(dismissKeyboardForStep)
        return
      }
    }
  }
})

stepObserver.observe(document.documentElement, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['data-step'],
})

document.addEventListener('pointerdown', onSearchPointerDown, true)
document.addEventListener('click', onSearchClick, true)
document.addEventListener('focusin', onFocusIn, true)

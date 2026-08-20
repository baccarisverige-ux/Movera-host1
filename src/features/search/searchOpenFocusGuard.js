const SEARCH_TRIGGER = '.b225-search'

function blurCurrentField() {
  const active = document.activeElement
  if (active instanceof HTMLElement && active !== document.body) active.blur()
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

document.addEventListener('pointerdown', onSearchPointerDown, true)
document.addEventListener('click', onSearchClick, true)

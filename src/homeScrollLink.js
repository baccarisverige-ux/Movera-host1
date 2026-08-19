let moveraScrollRaf = 0
let moveraResizeObserver = null
let moveraCategoryTravel = 0
const MOVERA_CATEGORY_FOLLOW = 0.42

function syncMoveraCategoryScroll() {
  moveraScrollRaf = 0
  const header = document.querySelector('.b225-home-header')
  const categories = document.querySelector('.b225-categories')
  const welcome = document.querySelector('.b225-welcome')
  if (!header || !categories || !welcome) return false

  const headerRect = header.getBoundingClientRect()
  const welcomeRect = welcome.getBoundingClientRect()
  const categoriesHeight = categories.getBoundingClientRect().height

  document.documentElement.style.setProperty('--movera-home-header-height', `${headerRect.height}px`)
  categories.classList.add('movera-categories-linked')

  const distanceAfterWelcomeExit = Math.max(0, -welcomeRect.bottom)
  const targetTravel = Math.min(distanceAfterWelcomeExit, categoriesHeight)
  moveraCategoryTravel += (targetTravel - moveraCategoryTravel) * MOVERA_CATEGORY_FOLLOW
  if (Math.abs(targetTravel - moveraCategoryTravel) < 0.1) moveraCategoryTravel = targetTravel

  document.documentElement.style.setProperty('--movera-category-upward-travel', `${moveraCategoryTravel}px`)
  categories.classList.toggle('movera-categories-moving-under-header', moveraCategoryTravel > 0.1)

  if (Math.abs(targetTravel - moveraCategoryTravel) >= 0.1) requestMoveraCategorySync()

  if (!moveraResizeObserver && 'ResizeObserver' in window) {
    moveraResizeObserver = new ResizeObserver(requestMoveraCategorySync)
    moveraResizeObserver.observe(header)
    moveraResizeObserver.observe(categories)
    moveraResizeObserver.observe(welcome)
  }

  return true
}

function requestMoveraCategorySync() {
  if (moveraScrollRaf) return
  moveraScrollRaf = requestAnimationFrame(syncMoveraCategoryScroll)
}

window.addEventListener('scroll', requestMoveraCategorySync, { passive: true })
window.addEventListener('resize', requestMoveraCategorySync, { passive: true })
window.addEventListener('popstate', requestMoveraCategorySync)

if (!syncMoveraCategoryScroll()) {
  const bootObserver = new MutationObserver(() => {
    if (syncMoveraCategoryScroll()) bootObserver.disconnect()
  })
  bootObserver.observe(document.documentElement, { childList: true, subtree: true })
}

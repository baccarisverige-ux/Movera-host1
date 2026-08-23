let moveraScrollRaf = 0
let moveraResizeObserver = null
let moveraCategoryTravel = 0
let moveraLastFrameTime = 0
let moveraWelcomeExitScrollY = 0
let moveraCategoriesHeight = 0
let moveraHeaderHeight = 0
let moveraObservedHeader = null
let moveraObservedCategories = null
let moveraObservedWelcome = null
const MOVERA_CATEGORY_FOLLOW_MS = 220

function getMoveraDocumentScrollY() {
  const body = document.body
  if (body?.dataset.moveraSearchLock === 'true' && body.style.position === 'fixed') {
    const lockedTop = Number.parseFloat(body.style.top)
    if (Number.isFinite(lockedTop)) return Math.max(0, -lockedTop)
  }
  return Math.max(0, window.scrollY || window.pageYOffset || 0)
}

function observeMoveraHome(header, categories, welcome) {
  if (
    moveraObservedHeader === header
    && moveraObservedCategories === categories
    && moveraObservedWelcome === welcome
  ) return

  moveraResizeObserver?.disconnect()
  moveraResizeObserver = null
  moveraObservedHeader = header
  moveraObservedCategories = categories
  moveraObservedWelcome = welcome
  moveraCategoryTravel = 0
  moveraLastFrameTime = 0
  document.documentElement.style.setProperty('--movera-category-upward-travel', '0px')

  if ('ResizeObserver' in window) {
    moveraResizeObserver = new ResizeObserver(() => {
      measureMoveraCategoryScroll()
      requestMoveraCategorySync()
    })
    moveraResizeObserver.observe(header)
    moveraResizeObserver.observe(categories)
    moveraResizeObserver.observe(welcome)
  }
}

function measureMoveraCategoryScroll() {
  const header = document.querySelector('.b225-home-header')
  const categories = document.querySelector('.b225-categories')
  const welcome = document.querySelector('.b225-welcome')
  if (!header || !categories || !welcome) return false

  observeMoveraHome(header, categories, welcome)

  moveraHeaderHeight = header.getBoundingClientRect().height
  moveraCategoriesHeight = categories.getBoundingClientRect().height
  moveraWelcomeExitScrollY = getMoveraDocumentScrollY() + welcome.getBoundingClientRect().bottom

  document.documentElement.style.setProperty('--movera-home-header-height', `${moveraHeaderHeight}px`)
  categories.classList.add('movera-categories-linked')

  return true
}

function syncMoveraCategoryScroll(timestamp = performance.now()) {
  moveraScrollRaf = 0
  const categories = document.querySelector('.b225-categories')
  if (!categories && !measureMoveraCategoryScroll()) return false
  if (!moveraCategoriesHeight && !measureMoveraCategoryScroll()) return false

  const distanceAfterWelcomeExit = Math.max(0, getMoveraDocumentScrollY() - moveraWelcomeExitScrollY)
  const targetTravel = Math.min(distanceAfterWelcomeExit, moveraCategoriesHeight)
  const elapsed = moveraLastFrameTime ? Math.min(64, Math.max(1, timestamp - moveraLastFrameTime)) : 16.67
  moveraLastFrameTime = timestamp
  const follow = 1 - Math.exp(-elapsed / MOVERA_CATEGORY_FOLLOW_MS)

  moveraCategoryTravel += (targetTravel - moveraCategoryTravel) * follow
  if (Math.abs(targetTravel - moveraCategoryTravel) < 0.08) moveraCategoryTravel = targetTravel

  document.documentElement.style.setProperty('--movera-category-upward-travel', `${moveraCategoryTravel}px`)
  categories.classList.toggle('movera-categories-moving-under-header', moveraCategoryTravel > 0.08)

  if (Math.abs(targetTravel - moveraCategoryTravel) >= 0.08) requestMoveraCategorySync()
  return true
}

function requestMoveraCategorySync() {
  if (moveraScrollRaf) return
  moveraScrollRaf = requestAnimationFrame(syncMoveraCategoryScroll)
}

function refreshMoveraCategoryScroll() {
  moveraLastFrameTime = 0
  if (measureMoveraCategoryScroll()) requestMoveraCategorySync()
}

window.addEventListener('scroll', requestMoveraCategorySync, { passive: true })
window.addEventListener('resize', refreshMoveraCategoryScroll, { passive: true })
window.visualViewport?.addEventListener('resize', refreshMoveraCategoryScroll, { passive: true })
window.addEventListener('popstate', refreshMoveraCategoryScroll)

const homeMountObserver = new MutationObserver(() => {
  if (measureMoveraCategoryScroll()) requestMoveraCategorySync()
})
homeMountObserver.observe(document.getElementById('root') || document.documentElement, {
  childList: true,
  subtree: true,
})

if (measureMoveraCategoryScroll()) requestMoveraCategorySync()

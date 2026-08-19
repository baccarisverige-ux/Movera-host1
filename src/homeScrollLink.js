let moveraScrollRaf = 0
let moveraResizeObserver = null
let moveraCategoryTravel = 0
let moveraLastFrameTime = 0
let moveraWelcomeExitScrollY = 0
let moveraCategoriesHeight = 0
let moveraHeaderHeight = 0
const MOVERA_CATEGORY_FOLLOW_MS = 220

function measureMoveraCategoryScroll() {
  const header = document.querySelector('.b225-home-header')
  const categories = document.querySelector('.b225-categories')
  const welcome = document.querySelector('.b225-welcome')
  if (!header || !categories || !welcome) return false

  moveraHeaderHeight = header.getBoundingClientRect().height
  moveraCategoriesHeight = categories.getBoundingClientRect().height
  moveraWelcomeExitScrollY = window.scrollY + welcome.getBoundingClientRect().bottom

  document.documentElement.style.setProperty('--movera-home-header-height', `${moveraHeaderHeight}px`)
  categories.classList.add('movera-categories-linked')

  if (!moveraResizeObserver && 'ResizeObserver' in window) {
    moveraResizeObserver = new ResizeObserver(() => {
      measureMoveraCategoryScroll()
      requestMoveraCategorySync()
    })
    moveraResizeObserver.observe(header)
    moveraResizeObserver.observe(categories)
    moveraResizeObserver.observe(welcome)
  }

  return true
}

function syncMoveraCategoryScroll(timestamp = performance.now()) {
  moveraScrollRaf = 0
  const categories = document.querySelector('.b225-categories')
  if (!categories && !measureMoveraCategoryScroll()) return false
  if (!moveraCategoriesHeight && !measureMoveraCategoryScroll()) return false

  const distanceAfterWelcomeExit = Math.max(0, window.scrollY - moveraWelcomeExitScrollY)
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
window.addEventListener('popstate', refreshMoveraCategoryScroll)

if (!measureMoveraCategoryScroll()) {
  const bootObserver = new MutationObserver(() => {
    if (measureMoveraCategoryScroll()) {
      bootObserver.disconnect()
      requestMoveraCategorySync()
    }
  })
  bootObserver.observe(document.documentElement, { childList: true, subtree: true })
} else {
  requestMoveraCategorySync()
}

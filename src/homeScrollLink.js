let moveraScrollRaf = 0

function syncMoveraCategoryScroll() {
  moveraScrollRaf = 0
  const header = document.querySelector('.b225-home-header')
  const categories = document.querySelector('.b225-categories')
  const welcome = document.querySelector('.b225-welcome')
  if (!header || !categories || !welcome) return

  const headerRect = header.getBoundingClientRect()
  const welcomeRect = welcome.getBoundingClientRect()
  const categoriesHeight = categories.getBoundingClientRect().height

  document.documentElement.style.setProperty('--movera-home-header-height', `${headerRect.height}px`)
  categories.classList.add('movera-categories-linked')

  // Exact requested trigger: the categories do not start moving until
  // the ENTIRE "Bienvenue chez Movera" card has left the viewport.
  // After that point, move categories upward continuously with scroll so
  // the search/header progressively covers them. No fade, hide, collapse,
  // position switch or jump. Scrolling upward reverses the same motion.
  const distanceAfterWelcomeExit = Math.max(0, -welcomeRect.bottom)
  const upwardTravel = Math.min(distanceAfterWelcomeExit, categoriesHeight)

  document.documentElement.style.setProperty('--movera-category-upward-travel', `${upwardTravel}px`)
  categories.classList.toggle('movera-categories-moving-under-header', upwardTravel > 0)
}

function requestMoveraCategorySync() {
  if (moveraScrollRaf) return
  moveraScrollRaf = requestAnimationFrame(syncMoveraCategoryScroll)
}

window.addEventListener('scroll', requestMoveraCategorySync, { passive: true })
window.addEventListener('resize', requestMoveraCategorySync, { passive: true })

const moveraScrollObserver = new MutationObserver(requestMoveraCategorySync)
moveraScrollObserver.observe(document.documentElement, { childList: true, subtree: true })
requestMoveraCategorySync()

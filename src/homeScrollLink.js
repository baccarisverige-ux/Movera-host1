let moveraScrollRaf = 0

function syncMoveraCategoryScroll() {
  moveraScrollRaf = 0
  const header = document.querySelector('.b225-home-header')
  const categories = document.querySelector('.b225-categories')
  const welcome = document.querySelector('.b225-welcome')
  if (!header || !categories || !welcome) return

  const headerRect = header.getBoundingClientRect()
  document.documentElement.style.setProperty('--movera-home-header-height', `${headerRect.height}px`)
  categories.classList.add('movera-categories-linked')

  // Keep categories visible until the ENTIRE welcome card has passed
  // behind the sticky search/header area. Only then release categories
  // so they continue moving naturally upward underneath the header.
  const welcomeBottom = welcome.getBoundingClientRect().bottom
  const release = welcomeBottom <= headerRect.bottom + 0.5
  categories.classList.toggle('movera-categories-release', release)
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

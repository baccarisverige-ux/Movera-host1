let moveraResizeObserver = null
let moveraObservedHeader = null
let moveraObservedShell = null

function syncMoveraCategorySticky() {
  const header = document.querySelector('.b225-home-header')
  const shell = document.querySelector('.b225-categories-shell')
  const rail = document.querySelector('.b225-categories')

  if (!header || !shell || !rail) return false

  const headerHeight = header.getBoundingClientRect().height
  document.documentElement.style.setProperty('--movera-home-header-height', `${headerHeight}px`)
  shell.classList.add('movera-categories-linked')
  rail.classList.add('movera-categories-linked')

  if (moveraObservedHeader !== header || moveraObservedShell !== shell) {
    moveraResizeObserver?.disconnect()
    moveraObservedHeader = header
    moveraObservedShell = shell

    if ('ResizeObserver' in window) {
      moveraResizeObserver = new ResizeObserver(syncMoveraCategorySticky)
      moveraResizeObserver.observe(header)
      moveraResizeObserver.observe(shell)
    }
  }

  return true
}

function scheduleMoveraCategorySticky() {
  requestAnimationFrame(syncMoveraCategorySticky)
}

window.addEventListener('resize', scheduleMoveraCategorySticky, { passive: true })
window.visualViewport?.addEventListener('resize', scheduleMoveraCategorySticky, { passive: true })
window.addEventListener('popstate', scheduleMoveraCategorySticky)
window.addEventListener('movera-search-restored', scheduleMoveraCategorySticky)

const root = document.getElementById('root') || document.documentElement
const homeMountObserver = new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.type === 'childList')) scheduleMoveraCategorySticky()
})
homeMountObserver.observe(root, { childList: true, subtree: true })

scheduleMoveraCategorySticky()

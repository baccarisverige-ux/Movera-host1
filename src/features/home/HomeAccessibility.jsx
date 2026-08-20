import { useEffect } from 'react'
import { navigate } from '../../app/router/index.jsx'

const HOME_ACCESSIBLE_NAMES = {
  homeSearchBtn: 'Rechercher une destination',
  homeMapBtn: 'Explorer la carte',
}

export function HomeAccessibility() {
  useEffect(() => {
    let welcomeVisual = null

    const activateWelcomeMap = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return
      if (event.type === 'keydown') event.preventDefault()
      navigate('/map')
    }

    const bindWelcomeMapButton = () => {
      const nextVisual = document.querySelector('.b225-welcome__visual')
      if (nextVisual === welcomeVisual) return

      if (welcomeVisual) {
        welcomeVisual.removeEventListener('click', activateWelcomeMap)
        welcomeVisual.removeEventListener('keydown', activateWelcomeMap)
      }

      welcomeVisual = nextVisual
      if (!welcomeVisual) return

      welcomeVisual.removeAttribute('aria-hidden')
      welcomeVisual.setAttribute('role', 'button')
      welcomeVisual.setAttribute('aria-label', 'Explorer la carte de Tunisie')
      welcomeVisual.tabIndex = 0
      welcomeVisual.addEventListener('click', activateWelcomeMap)
      welcomeVisual.addEventListener('keydown', activateWelcomeMap)
    }

    const applyAccessibilityFixes = () => {
      for (const [id, label] of Object.entries(HOME_ACCESSIBLE_NAMES)) {
        const element = document.getElementById(id)
        if (element && element.getAttribute('aria-label') !== label) {
          element.setAttribute('aria-label', label)
        }
      }

      const featuredScroll = document.querySelector('.b225-featured-scroll')
      if (featuredScroll) {
        if (featuredScroll.tabIndex !== 0) featuredScroll.tabIndex = 0
        if (!featuredScroll.getAttribute('aria-label')) {
          featuredScroll.setAttribute('aria-label', "Sélection d'Exception")
        }
      }

      bindWelcomeMapButton()
    }

    applyAccessibilityFixes()
    const observer = new MutationObserver(applyAccessibilityFixes)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      if (welcomeVisual) {
        welcomeVisual.removeEventListener('click', activateWelcomeMap)
        welcomeVisual.removeEventListener('keydown', activateWelcomeMap)
      }
    }
  }, [])

  return null
}

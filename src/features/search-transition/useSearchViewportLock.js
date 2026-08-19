import { useEffect, useRef } from 'react'

export function useSearchViewportLock(active, lockedViewportHeight) {
  const lockedScrollYRef = useRef(0)

  useEffect(() => {
    if (!active) return undefined

    const body = document.body
    const html = document.documentElement
    lockedScrollYRef.current = window.scrollY
    const previous = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      htmlHeight: html.style.height,
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    }

    html.dataset.moveraSearchLock = 'true'
    body.dataset.moveraSearchLock = 'true'
    html.style.height = `${lockedViewportHeight}px`
    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.position = 'fixed'
    body.style.top = `-${lockedScrollYRef.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.height = `${lockedViewportHeight}px`
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'

    const preventMove = (event) => event.preventDefault()
    const keepScrollLocked = () => {
      if (window.scrollY !== lockedScrollYRef.current) window.scrollTo(0, lockedScrollYRef.current)
    }

    document.addEventListener('touchmove', preventMove, { passive: false })
    document.addEventListener('wheel', preventMove, { passive: false })
    window.addEventListener('scroll', keepScrollLocked, { passive: true })

    return () => {
      document.removeEventListener('touchmove', preventMove)
      document.removeEventListener('wheel', preventMove)
      window.removeEventListener('scroll', keepScrollLocked)
      delete html.dataset.moveraSearchLock
      delete body.dataset.moveraSearchLock
      body.style.position = previous.bodyPosition
      body.style.top = previous.bodyTop
      body.style.left = previous.bodyLeft
      body.style.right = previous.bodyRight
      body.style.width = previous.bodyWidth
      body.style.height = previous.bodyHeight
      body.style.overflow = previous.bodyOverflow
      body.style.overscrollBehavior = previous.bodyOverscroll
      html.style.height = previous.htmlHeight
      html.style.overflow = previous.htmlOverflow
      html.style.overscrollBehavior = previous.htmlOverscroll
      window.scrollTo(0, lockedScrollYRef.current)
    }
  }, [active, lockedViewportHeight])
}

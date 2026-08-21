import { useLayoutEffect, useRef, useState } from 'react'

export function useSearchPanelFit({ active, step, addressMode, lockedViewportHeight }) {
  const contentRef = useRef(null)
  const [panelHeight, setPanelHeight] = useState(null)

  useLayoutEffect(() => {
    if (!active || !contentRef.current) return undefined

    const content = contentRef.current
    const visualViewport = window.visualViewport
    let frame = 0

    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const naturalHeight = Math.ceil(content.scrollHeight + 2)
        const liveViewportHeight = Math.round(visualViewport?.height || window.innerHeight || lockedViewportHeight)
        const maxHeight = Math.max(120, liveViewportHeight - 12)
        const nextHeight = Math.min(maxHeight, Math.max(120, naturalHeight))
        setPanelHeight((current) => (current === nextHeight ? current : nextHeight))
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    window.addEventListener('resize', measure, { passive: true })
    visualViewport?.addEventListener('resize', measure, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      visualViewport?.removeEventListener('resize', measure)
    }
  }, [active, step, addressMode, lockedViewportHeight])

  return { contentRef, panelHeight }
}

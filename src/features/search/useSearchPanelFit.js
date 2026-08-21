import { useLayoutEffect, useRef, useState } from 'react'

export function useSearchPanelFit({ active, step, addressMode, lockedViewportHeight }) {
  const contentRef = useRef(null)
  const [panelHeight, setPanelHeight] = useState(null)

  useLayoutEffect(() => {
    if (!active || !contentRef.current) return undefined

    const content = contentRef.current
    let frame = 0

    const measure = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const naturalHeight = Math.ceil(content.scrollHeight + 2)
        const minHeight = addressMode ? 170 : 260
        const maxHeight = Math.max(minHeight, lockedViewportHeight - 12)
        const nextHeight = Math.min(maxHeight, Math.max(minHeight, naturalHeight))
        setPanelHeight((current) => (current === nextHeight ? current : nextHeight))
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [active, step, addressMode, lockedViewportHeight])

  return { contentRef, panelHeight }
}

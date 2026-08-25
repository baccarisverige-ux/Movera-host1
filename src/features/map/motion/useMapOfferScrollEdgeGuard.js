import { useEffect, useRef } from 'react'

const EDGE_EPSILON_PX = 1

function edgeState(node) {
  const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight)
  return {
    atTop: node.scrollTop <= EDGE_EPSILON_PX,
    atBottom: node.scrollTop >= maxScrollTop - EDGE_EPSILON_PX,
  }
}

/**
 * Keeps the offer list fully native while preventing iOS/trackpad overscroll
 * from escaping the list at its top/bottom edge and visually dragging the
 * whole sheet. It never changes scrollTop and never talks to the map engine.
 */
export function useMapOfferScrollEdgeGuard() {
  const nodeRef = useRef(null)
  const lastTouchYRef = useRef(null)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return undefined

    const onTouchStart = (event) => {
      lastTouchYRef.current = event.touches?.[0]?.clientY ?? null
    }

    const onTouchMove = (event) => {
      const currentY = event.touches?.[0]?.clientY
      const previousY = lastTouchYRef.current
      lastTouchYRef.current = currentY ?? previousY

      if (!Number.isFinite(currentY) || !Number.isFinite(previousY)) return

      const { atTop, atBottom } = edgeState(node)
      const fingerDeltaY = currentY - previousY
      const pullingPastTop = atTop && fingerDeltaY > 0
      const pullingPastBottom = atBottom && fingerDeltaY < 0

      if (!pullingPastTop && !pullingPastBottom) return
      event.preventDefault()
      event.stopPropagation()
    }

    const resetTouch = () => {
      lastTouchYRef.current = null
    }

    const onWheel = (event) => {
      const { atTop, atBottom } = edgeState(node)
      const pushingPastTop = atTop && event.deltaY < 0
      const pushingPastBottom = atBottom && event.deltaY > 0

      if (!pushingPastTop && !pushingPastBottom) return
      event.preventDefault()
      event.stopPropagation()
    }

    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', resetTouch, { passive: true })
    node.addEventListener('touchcancel', resetTouch, { passive: true })
    node.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', resetTouch)
      node.removeEventListener('touchcancel', resetTouch)
      node.removeEventListener('wheel', onWheel)
    }
  }, [])

  return nodeRef
}

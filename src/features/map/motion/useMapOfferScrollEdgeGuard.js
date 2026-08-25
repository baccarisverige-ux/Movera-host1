import { useRef } from 'react'

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
  const lastTouchYRef = useRef(null)

  const onTouchStart = (event) => {
    lastTouchYRef.current = event.touches?.[0]?.clientY ?? null
  }

  const onTouchMove = (event) => {
    const currentY = event.touches?.[0]?.clientY
    const previousY = lastTouchYRef.current
    lastTouchYRef.current = currentY ?? previousY

    if (!Number.isFinite(currentY) || !Number.isFinite(previousY)) return

    const { atTop, atBottom } = edgeState(event.currentTarget)
    const fingerDeltaY = currentY - previousY
    const pullingPastTop = atTop && fingerDeltaY > 0
    const pullingPastBottom = atBottom && fingerDeltaY < 0

    if (!pullingPastTop && !pullingPastBottom) return
    if (event.cancelable) event.preventDefault()
    event.stopPropagation()
  }

  const onTouchEnd = () => {
    lastTouchYRef.current = null
  }

  const onWheel = (event) => {
    const { atTop, atBottom } = edgeState(event.currentTarget)
    const pushingPastTop = atTop && event.deltaY < 0
    const pushingPastBottom = atBottom && event.deltaY > 0

    if (!pushingPastTop && !pushingPastBottom) return
    if (event.cancelable) event.preventDefault()
    event.stopPropagation()
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
    onWheel,
  }
}

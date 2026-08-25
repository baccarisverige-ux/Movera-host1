import { useEffect, useRef } from 'react'

const EDGE_EPSILON_PX = 1
const DIRECTION_EPSILON_PX = 1.5

/**
 * Keeps offer scrolling native, but when the sheet is fully open and a
 * downward finger gesture reaches the top of the offer list, ownership of the
 * same gesture is handed to the sheet so it can close from anywhere on a card.
 * This hook never talks to the map engine.
 */
export function useMapOfferScrollSheetHandoff({ expanded, externalDrag }) {
  const nodeRef = useRef(null)
  const gestureRef = useRef(null)
  const externalDragRef = useRef(externalDrag)
  const expandedRef = useRef(expanded)

  useEffect(() => { externalDragRef.current = externalDrag }, [externalDrag])
  useEffect(() => { expandedRef.current = expanded }, [expanded])

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return undefined

    const onTouchStart = (event) => {
      const clientY = event.touches?.[0]?.clientY
      gestureRef.current = Number.isFinite(clientY)
        ? { lastClientY: clientY, handedOff: false }
        : null
    }

    const onTouchMove = (event) => {
      const state = gestureRef.current
      const clientY = event.touches?.[0]?.clientY
      if (!state || !Number.isFinite(clientY)) return

      if (state.handedOff) {
        event.preventDefault()
        event.stopPropagation()
        externalDragRef.current?.move(clientY)
        state.lastClientY = clientY
        return
      }

      const movingFingerDown = clientY - state.lastClientY > DIRECTION_EPSILON_PX
      const atTop = node.scrollTop <= EDGE_EPSILON_PX

      if (expandedRef.current && atTop && movingFingerDown) {
        const started = externalDragRef.current?.start(state.lastClientY)
        if (started) {
          state.handedOff = true
          event.preventDefault()
          event.stopPropagation()
          externalDragRef.current?.move(clientY)
        }
      }

      state.lastClientY = clientY
    }

    const finish = (cancel = false) => {
      const state = gestureRef.current
      gestureRef.current = null
      if (!state?.handedOff) return
      if (cancel) externalDragRef.current?.cancel()
      else externalDragRef.current?.end()
    }

    const onTouchEnd = () => finish(false)
    const onTouchCancel = () => finish(true)

    node.addEventListener('touchstart', onTouchStart, { passive: true })
    node.addEventListener('touchmove', onTouchMove, { passive: false })
    node.addEventListener('touchend', onTouchEnd, { passive: true })
    node.addEventListener('touchcancel', onTouchCancel, { passive: true })

    return () => {
      node.removeEventListener('touchstart', onTouchStart)
      node.removeEventListener('touchmove', onTouchMove)
      node.removeEventListener('touchend', onTouchEnd)
      node.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [])

  return nodeRef
}

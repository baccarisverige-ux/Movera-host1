import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate } from 'motion'
import { motion, useDragControls, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'

const COLLAPSED_VISIBLE_PX = 62
const SNAP_RATIOS = Object.freeze([0, 0.5, 1])
const VELOCITY_PROJECTION_SECONDS = 0.16
const FAST_SWIPE_PX_PER_SECOND = 680

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function nearestIndex(values, value) {
  let bestIndex = 0
  let bestDistance = Infinity
  values.forEach((candidate, index) => {
    const distance = Math.abs(candidate - value)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  })
  return bestIndex
}

function snapTarget(distance, currentY, velocityY) {
  const points = SNAP_RATIOS.map((ratio) => distance * ratio)
  const projected = clamp(currentY + velocityY * VELOCITY_PROJECTION_SECONDS, 0, distance)
  let index = nearestIndex(points, projected)

  if (Math.abs(velocityY) >= FAST_SWIPE_PX_PER_SECOND) {
    const currentIndex = nearestIndex(points, currentY)
    index = velocityY > 0
      ? Math.min(points.length - 1, Math.max(index, currentIndex + 1))
      : Math.max(0, Math.min(index, currentIndex - 1))
  }

  return points[index]
}

/**
 * Motion boundary for the map offer sheet.
 *
 * This is intentionally the only map module that imports Motion. The map
 * engine receives only a normalized 0..1 progress value and remains fully
 * independent from animation-library state.
 */
export function MapOfferSheetMotionSurface({
  className,
  ariaLabel,
  children,
  onProgressChange,
}) {
  const surfaceRef = useRef(null)
  const collapsedYRef = useRef(0)
  const progressRef = useRef(0)
  const progressCallbackRef = useRef(onProgressChange)
  const animationRef = useRef(null)
  const suppressClickRef = useRef(false)
  const y = useMotionValue(0)
  const dragControls = useDragControls()
  const reduceMotion = useReducedMotion()
  const [collapsedY, setCollapsedY] = useState(1)
  const [progress, setProgress] = useState(0)

  useEffect(() => { progressCallbackRef.current = onProgressChange }, [onProgressChange])
  useEffect(() => () => animationRef.current?.stop?.(), [])

  useMotionValueEvent(y, 'change', (latest) => {
    const distance = collapsedYRef.current
    if (distance <= 0) return
    const next = clamp(1 - clamp(latest, 0, distance) / distance)
    progressRef.current = next
    setProgress((current) => Math.abs(current - next) < 0.002 ? current : next)
    progressCallbackRef.current?.(next)
  })

  useLayoutEffect(() => {
    const surface = surfaceRef.current
    if (!surface) return undefined

    const measure = () => {
      const height = surface.getBoundingClientRect().height
      const nextDistance = Math.max(1, height - COLLAPSED_VISIBLE_PX)
      const previousDistance = collapsedYRef.current
      const preservedProgress = previousDistance > 0 ? progressRef.current : 0

      collapsedYRef.current = nextDistance
      setCollapsedY(nextDistance)
      y.set((1 - preservedProgress) * nextDistance)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(surface)
    return () => observer.disconnect()
  }, [y])

  const animateTo = (target, velocity = 0) => {
    animationRef.current?.stop?.()
    if (reduceMotion) {
      y.set(target)
      return
    }
    animationRef.current = animate(y, target, {
      type: 'spring',
      stiffness: 430,
      damping: 38,
      mass: 0.82,
      velocity,
      restDelta: 0.35,
      restSpeed: 2,
    })
  }

  const startDrag = (event) => {
    animationRef.current?.stop?.()
    suppressClickRef.current = false
    dragControls.start(event)
  }

  const toggleExpanded = (event) => {
    if (suppressClickRef.current) {
      event?.preventDefault?.()
      suppressClickRef.current = false
      return
    }
    const distance = collapsedYRef.current
    animateTo(progressRef.current > 0.72 ? distance : 0)
  }

  const roundedProgress = Math.round(progress * 100) / 100

  return (
    <motion.section
      ref={surfaceRef}
      className={className}
      aria-label={ariaLabel}
      data-testid="map-offer-sheet"
      data-progress={roundedProgress}
      data-expanded={progress > 0.86 ? 'true' : 'false'}
      data-motion-engine="motion"
      style={{ y }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: collapsedY }}
      dragElastic={{ top: 0.035, bottom: 0.035 }}
      dragMomentum={false}
      onDragStart={() => { suppressClickRef.current = true }}
      onDragEnd={(_, info) => {
        const distance = collapsedYRef.current
        const currentY = clamp(y.get(), 0, distance)
        animateTo(snapTarget(distance, currentY, info.velocity.y), info.velocity.y)
      }}
    >
      {children({ progress, startDrag, toggleExpanded })}
    </motion.section>
  )
}

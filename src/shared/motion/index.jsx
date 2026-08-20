import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'

export const motionTransitions = Object.freeze({
  spring: { type: 'spring', stiffness: 420, damping: 34, mass: 0.75 },
  springSoft: { type: 'spring', stiffness: 300, damping: 30, mass: 0.9 },
  enter: { duration: 0.22, ease: [0.2, 0, 0, 1] },
  exit: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  press: { type: 'spring', stiffness: 520, damping: 32, mass: 0.55 },
  layout: { type: 'spring', stiffness: 360, damping: 32, mass: 0.8 },
})

export const motionVariants = Object.freeze({
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  rise: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.985 },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
  },
  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
  },
})

export function MoveraMotionProvider({ children }) {
  return (
    <MotionConfig reducedMotion="user" transition={motionTransitions.springSoft}>
      {children}
    </MotionConfig>
  )
}

export function MotionPresence({ children, mode = 'sync', initial = false }) {
  return <AnimatePresence mode={mode} initial={initial}>{children}</AnimatePresence>
}

export function MotionSurface({ children, variant = 'rise', layout = false, transition, ...props }) {
  const reduceMotion = useReducedMotion()
  const variants = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : motionVariants[variant] || motionVariants.rise

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout={layout}
      transition={transition || motionTransitions.enter}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionPressable({ children, scale = 0.97, disabled = false, transition = motionTransitions.press, ...props }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      whileTap={!disabled && !reduceMotion ? { scale } : undefined}
      transition={transition}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Stagger({ children, ...props }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      variants={reduceMotion ? undefined : motionVariants.stagger}
      initial="initial"
      animate="animate"
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...props }) {
  const reduceMotion = useReducedMotion()
  return <motion.div variants={reduceMotion ? undefined : motionVariants.staggerItem} {...props}>{children}</motion.div>
}

export { AnimatePresence, motion, useReducedMotion }

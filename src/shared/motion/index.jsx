import { MotionConfig, motion, useReducedMotion } from 'motion/react'

export const moveraMotion = Object.freeze({
  spring: { type: 'spring', stiffness: 420, damping: 34, mass: 0.78 },
  softSpring: { type: 'spring', stiffness: 280, damping: 30, mass: 0.9 },
  enter: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] },
  exit: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  press: { scale: 0.985 },
  hover: { y: -1 },
})

export const moveraVariants = Object.freeze({
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  lift: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.985 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.99 },
  },
})

export function MoveraMotionProvider({ children }) {
  return <MotionConfig reducedMotion="user" transition={moveraMotion.spring}>{children}</MotionConfig>
}

export function MotionSurface({ children, className = '', variant = 'lift', ...props }) {
  const reduceMotion = useReducedMotion()
  const variants = moveraVariants[variant] || moveraVariants.lift
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      exit={reduceMotion ? undefined : 'exit'}
      transition={reduceMotion ? { duration: 0 } : moveraMotion.enter}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionPressable({ children, className = '', disabled = false, ...props }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      className={className}
      disabled={disabled}
      whileTap={disabled || reduceMotion ? undefined : moveraMotion.press}
      transition={moveraMotion.spring}
      {...props}
    >
      {children}
    </motion.button>
  )
}

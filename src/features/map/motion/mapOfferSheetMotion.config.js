export const MAP_OFFER_SHEET_MOTION = Object.freeze({
  collapsedVisiblePx: 62,
  expandedThreshold: 0.86,
  fastSwipeVelocity: 680,
  snapRatios: Object.freeze([0, 0.5, 1]),
  spring: Object.freeze({
    stiffness: 430,
    damping: 38,
    mass: 0.82,
    restDelta: 0.35,
    restSpeed: 2,
  }),
  toggleThreshold: 0.72,
  velocityProjectionSeconds: 0.16,
})

export const MAP_OFFER_ITEM_MOTION = Object.freeze({
  activeScale: 1,
  enterScale: 0.985,
  enterY: 12,
  exitScale: 0.985,
  exitY: -6,
  inactiveScale: 0.992,
  initialOpacity: 0.82,
  layout: true,
  stagger: 0.02,
  tapScale: 0.988,
  spring: Object.freeze({ stiffness: 410, damping: 35, mass: 0.74 }),
})

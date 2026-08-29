export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSoft = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 22,
  mass: 0.8,
}

export const fadeUp = {
  hidden: {opacity: 0, y: 28},
  visible: {opacity: 1, y: 0},
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

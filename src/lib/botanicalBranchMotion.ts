import type {JourneyPointer} from '@/lib/journeyComposition'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t)
}

function easeInOut(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/** Lane side: 0 = left, 1 = right — opposite of active text. */
export function branchSide(p: number) {
  const keys: Array<{at: number; side: number}> = [
    {at: 0.08, side: 1},
    {at: 0.28, side: 1},
    {at: 0.32, side: 0},
    {at: 0.45, side: 0},
    {at: 0.48, side: 1},
    {at: 0.85, side: 1},
    {at: 0.88, side: 0},
    {at: 0.94, side: 1},
    {at: 1, side: 1},
  ]
  if (p <= keys[0].at) return keys[0].side
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1]
    const next = keys[i]
    if (p <= next.at) {
      const t = (p - prev.at) / Math.max(0.001, next.at - prev.at)
      const e = t * t * (3 - 2 * t)
      return lerp(prev.side, next.side, e)
    }
  }
  return keys[keys.length - 1].side
}

function initDrawPath(path: SVGPathElement | null) {
  if (!path) return 0
  const len = path.getTotalLength()
  path.dataset.length = String(len)
  path.style.strokeDasharray = `${len}`
  path.style.strokeDashoffset = `${len}`
  return len
}

export type BranchMotionOptions = {
  sideFn?: (p: number) => number
  projectDimRange?: [number, number] | null
  fadeInAt?: number
  endFadeAt?: number
  layout?: 'absolute' | 'fixed'
  laneWidth?: number
}

function branchLaneWidth(mobile: boolean, layout: 'absolute' | 'fixed', override?: number) {
  if (override != null) return override
  if (layout === 'fixed') {
    if (mobile) return 14
    if (typeof window !== 'undefined' && window.innerWidth < 900) return 18
    return 28
  }
  return mobile ? 20 : 34
}

/** About page — branch stays right on mobile; drifts left on desktop during approach. */
export function aboutPageBranchSide(p: number, mobile = false) {
  if (mobile) return 1

  const keys: Array<{at: number; side: number}> = [
    {at: 0, side: 1},
    {at: 0.38, side: 1},
    {at: 0.48, side: 0},
    {at: 0.62, side: 0},
    {at: 0.72, side: 1},
    {at: 1, side: 1},
  ]
  if (p <= keys[0].at) return keys[0].side
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1]
    const next = keys[i]
    if (p <= next.at) {
      const t = (p - prev.at) / Math.max(0.001, next.at - prev.at)
      const e = t * t * (3 - 2 * t)
      return lerp(prev.side, next.side, e)
    }
  }
  return keys[keys.length - 1].side
}

export function initBotanicalBranch(root: HTMLElement | null) {
  if (!root) return
  initDrawPath(root.querySelector<SVGPathElement>('[data-branch="stem"]'))
  initDrawPath(root.querySelector<SVGPathElement>('[data-branch="hair"]'))
  initDrawPath(root.querySelector<SVGPathElement>('[data-branch="tendril"]'))
}

function setDraw(path: SVGPathElement | null, progress: number) {
  if (!path) return
  const len = Number(path.dataset.length) || path.getTotalLength()
  if (!path.dataset.length) {
    path.dataset.length = String(len)
    path.style.strokeDasharray = `${len}`
  }
  path.style.strokeDashoffset = `${len * (1 - clamp01(progress))}`
}

function cursorRepel(
  side: number,
  pointer: JourneyPointer,
  mobile: boolean,
): {x: number; y: number} {
  if (mobile || !pointer.active) return {x: 0, y: 0}

  const onRight = side > 0.5
  const near = onRight ? pointer.tx > 0.58 : pointer.tx < 0.42
  if (!near) return {x: 0, y: 0}

  const proximity = onRight ? pointer.tx - 0.58 : 0.42 - pointer.tx
  const strength = clamp01(proximity / 0.22)
  const x = (onRight ? 1 : -1) * strength * 10
  const y = (pointer.ty - 0.5) * strength * 4
  return {x, y}
}

export function applyBotanicalBranch(
  root: HTMLElement | null,
  p: number,
  mobile: boolean,
  pointer: JourneyPointer,
  options: BranchMotionOptions = {},
) {
  if (!root) return

  const {
    sideFn = branchSide,
    projectDimRange = [0.58, 0.76],
    fadeInAt = 0.02,
    endFadeAt = 0.93,
    layout = 'absolute',
    laneWidth,
  } = options

  const growth = easeInOut(clamp01(p / 0.98))
  const side = sideFn(p)
  const laneW = branchLaneWidth(mobile, layout, laneWidth)

  const stem = root.querySelector<SVGPathElement>('[data-branch="stem"]')
  const hair = root.querySelector<SVGPathElement>('[data-branch="hair"]')
  const tendril = root.querySelector<SVGPathElement>('[data-branch="tendril"]')
  const sway = root.querySelector<SVGGElement>('[data-branch-sway]')
  const parallax = root.querySelector<HTMLElement>('[data-branch-parallax]')

  setDraw(stem, growth)
  setDraw(hair, easeInOut(clamp01((growth - 0.06) / 0.9)))
  setDraw(tendril, easeInOut(clamp01((growth - 0.32) / 0.62)))

  if (hair) {
    hair.style.opacity = String(lerp(0, mobile ? 0.38 : 0.45, clamp01((growth - 0.08) / 0.5)))
  }
  if (tendril) {
    tendril.style.opacity = String(lerp(0, mobile ? 0.42 : 0.5, clamp01((growth - 0.3) / 0.45)))
  }

  root.querySelectorAll<SVGGElement>('.branch-leaf').forEach((leaf) => {
    const at = Number(leaf.dataset.leafAt ?? 0)
    const rotStart = Number(leaf.dataset.rot ?? 0)
    const leafP = easeInOut(clamp01((growth - at) / 0.07))
    const scale = lerp(0.12, 1, leafP)
    const rot = lerp(rotStart, rotStart * 0.15, leafP)
    const swayLeaf = Math.sin((p + at) * Math.PI * 5) * (mobile ? 1.5 : 2.2) * leafP

    leaf.style.opacity = String(leafP * lerp(0.38, 0.56, 1))
    leaf.style.transform = `translate3d(${swayLeaf * 0.4}px, 0, 0) scale(${scale}) rotate(${rot}deg)`
    leaf.style.transformOrigin = 'center center'
  })

  const wind =
    Math.sin(p * Math.PI * 3.8) * (mobile ? 2.8 : 4.5) +
    Math.sin(p * Math.PI * 6.4) * (mobile ? 1.2 : 2)
  const lift = Math.sin(p * Math.PI * 2.1) * (mobile ? 0.8 : 1.4)
  const rot = lerp(mobile ? -4 : -7, mobile ? 5 : 9, p) + wind * 0.12
  const repel = cursorRepel(side, pointer, mobile)

  const leftPct = lerp(0, 100 - laneW, side)
  if (layout === 'fixed') {
    if (side > 0.5) {
      root.style.left = 'auto'
      root.style.right = '0'
    } else {
      root.style.right = 'auto'
      root.style.left = '0'
    }
    root.style.maxWidth = mobile ? '3.25rem' : '18rem'
  } else {
    root.style.maxWidth = ''
    root.style.left = mobile ? 'auto' : `${leftPct}%`
    root.style.right = mobile ? '0' : 'auto'
  }
  root.style.width = `${laneW}%`

  const projectDim =
    projectDimRange && p > projectDimRange[0] && p < projectDimRange[1] ? 0.5 : 1
  const endFade = p > endFadeAt ? clamp01((p - endFadeAt) / 0.06) : 0
  const fadeIn = clamp01((p - fadeInAt) / 0.05)
  root.style.opacity = String(fadeIn * projectDim * (1 - endFade))

  if (sway) {
    sway.style.transform = `translate3d(${wind + repel.x}%, ${lift + repel.y * 0.35}%, 0) rotate(${rot}deg)`
    sway.style.transformOrigin = '50% 12%'
  }

  if (parallax) {
    const py = lerp(0, mobile ? -1.8 : -3.2, p) + Math.sin(p * Math.PI * 2.8) * 0.4
    parallax.style.transform = `translate3d(0, ${py}%, 0)`
  }
}

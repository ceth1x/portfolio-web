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

/** Global journey progress at which the opening visual completes (0–1). */
export const OPENING_SCROLL_END = 0.16

export function openingProgress(globalP: number) {
  return clamp01(globalP / OPENING_SCROLL_END)
}

function setDraw(path: SVGPathElement | null, length: number, progress: number) {
  if (!path || !length) return
  path.style.strokeDashoffset = `${length * (1 - clamp01(progress))}`
}

function readLength(path: SVGPathElement | null) {
  if (!path) return 0
  const cached = path.dataset.length
  if (cached) return Number(cached)
  const len = path.getTotalLength()
  path.dataset.length = String(len)
  path.style.strokeDasharray = `${len}`
  return len
}

/** One-time path length setup — call after mount. */
export function initOpeningPaths(root: HTMLElement | null) {
  if (!root) return
  root.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
    readLength(path)
    path.style.strokeDashoffset = `${path.getTotalLength()}`
  })
}

/**
 * Imperative scroll-driven update for the opening organic line.
 * Uses GPU-friendly transforms and stroke-dashoffset only — no React state.
 */
export function applyOpeningVisual(
  root: HTMLElement | null,
  globalP: number,
  mobile: boolean,
) {
  if (!root) return

  const t = openingProgress(globalP)
  const group = root.querySelector<SVGGElement>('[data-opening-group]')
  const split = root.querySelector<SVGGElement>('[data-opening-split]')
  const leaves = root.querySelector<SVGGElement>('[data-opening-leaves]')
  const nodes = root.querySelector<SVGGElement>('[data-opening-nodes]')
  const stem = root.querySelector<SVGPathElement>('[data-draw="stem"]')
  const hair = root.querySelector<SVGPathElement>('[data-draw="hair"]')
  const branch = root.querySelector<SVGPathElement>('[data-draw="branch"]')
  const arc = root.querySelector<SVGPathElement>('[data-draw="arc"]')

  const stemLen = readLength(stem)
  const hairLen = readLength(hair)
  const branchLen = readLength(branch)
  const arcLen = readLength(arc)

  // Shell fade — hands off to botanical lane
  if (globalP < 0.1) {
    root.style.opacity = '1'
  } else if (globalP < 0.19) {
    root.style.opacity = String(lerp(1, 0, (globalP - 0.1) / 0.09))
  } else {
    root.style.opacity = '0'
    root.style.pointerEvents = 'none'
  }

  const svg = root.querySelector<SVGSVGElement>('.opening-svg')
  if (svg) {
    svg.style.opacity = String(lerp(mobile ? 0.22 : 0.28, mobile ? 0.5 : 0.58, t))
  }

  if (group) {
    if (mobile) {
      const tx = lerp(34, 28, easeInOut(t))
      const ty = lerp(-4, 6, easeInOut(t))
      const rot = lerp(-7, 9, t) + Math.sin(t * Math.PI * 1.4) * 2.5
      const scale = lerp(0.86, 1.04, easeInOut(t))
      group.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) rotate(${rot}deg) scale(${scale})`
      group.style.transformOrigin = '88% 12%'
    } else {
      const tx = lerp(46, 40, easeInOut(t))
      const ty = lerp(-5, 7, easeInOut(t))
      const rot = lerp(-11, 13, t) + Math.sin(t * Math.PI * 1.6) * 3
      const scale = lerp(0.92, 1.08, easeInOut(t))
      group.style.transform = `translate3d(${tx}vw, ${ty}vh, 0) rotate(${rot}deg) scale(${scale})`
      group.style.transformOrigin = '72% 14%'
    }
  }

  // 0–45%: primary stem draws in
  setDraw(stem, stemLen, easeInOut(t / 0.45))

  // 15–55%: faint architectural arc behind
  if (arc) {
    setDraw(arc, arcLen, easeInOut((t - 0.12) / 0.38))
    arc.style.opacity = String(lerp(0, mobile ? 0.14 : 0.18, clamp01((t - 0.12) / 0.3)))
  }

  // 22–58%: hairline follows
  if (hair) {
    const hp = easeInOut((t - 0.22) / 0.36)
    setDraw(hair, hairLen, hp)
    hair.style.opacity = String(lerp(0, mobile ? 0.32 : 0.38, hp))
  }

  // 48–78%: branch splits off
  if (branch) {
    const bp = easeInOut((t - 0.48) / 0.3)
    setDraw(branch, branchLen, bp)
    branch.style.opacity = String(lerp(0, mobile ? 0.42 : 0.5, bp))
  }

  if (split) {
    const sp = clamp01((t - 0.52) / 0.35)
    const splitRot = lerp(0, mobile ? 14 : 18, easeInOut(sp))
    split.style.transform = `rotate(${splitRot}deg)`
    split.style.transformOrigin = '72% 48%'
    split.style.opacity = String(lerp(0.6, 1, sp))
  }

  if (leaves) {
    const lp = easeInOut((t - 0.58) / 0.28)
    leaves.style.opacity = String(lp)
    leaves.style.transform = `translate3d(${lerp(0, mobile ? -2 : -4, lp)}%, ${lerp(4, 0, lp)}%, 0)`
  }

  if (nodes) {
    const np = easeInOut((t - 0.35) / 0.4)
    nodes.style.opacity = String(lerp(0, mobile ? 0.55 : 0.7, np))
  }
}

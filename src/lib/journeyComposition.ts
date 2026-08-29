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

export type JourneyPointer = {
  x: number
  y: number
  tx: number
  ty: number
  active: boolean
}

/** Lane side: 0 = left, 1 = right — opposite of active text. */
export function threadSide(p: number) {
  const keys: Array<{at: number; side: number}> = [
    {at: 0.1, side: 1},
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

export function applyJourneyCamera(stage: HTMLElement | null, p: number, mobile: boolean) {
  if (!stage) return

  const drift = Math.sin(p * Math.PI * 2.4) * (mobile ? 0.15 : 0.35)
  const scale = 1 + Math.sin(p * Math.PI * 1.6) * 0.006 - p * 0.008
  const ty = lerp(0, mobile ? -0.6 : -1.1, p) + drift * 0.25
  const tx = lerp(0, mobile ? 0 : 0.55, Math.sin(p * Math.PI * 2) * 0.5 + 0.5)

  stage.style.transform = `translate3d(${tx}%, ${ty}vh, 0) scale(${scale})`
}

export function applyTypeConstruction(stage: HTMLElement | null, p: number, mobile: boolean) {
  if (!stage) return

  const spreadT = easeInOut(clamp01(p / 0.11))
  const settleT = easeInOut(clamp01((p - 0.09) / 0.05))

  stage.querySelectorAll<HTMLElement>('.type-construct-line').forEach((line, li) => {
    const words = line.querySelectorAll<HTMLElement>('.type-word')
    const count = words.length
    words.forEach((word, wi) => {
      const center = (count - 1) / 2
      const offset = (wi - center) * (mobile ? 5 : 14) * spreadT * (1 - settleT * 0.85)
      const lift = li * (mobile ? 2 : 4) * spreadT * (1 - settleT)
      word.style.transform = `translate3d(${offset}px, ${lift}px, 0)`
    })
  })

  const craft = stage.querySelector<HTMLElement>('[data-chapter="craft"]')
  const outline = craft?.querySelector<HTMLElement>('.type-outline-word')
  if (outline && craft) {
    const enter = 0.31
    const full = 0.36
    const exit = 0.46
    const o =
      p <= enter || p >= exit
        ? 0
        : p < full
          ? clamp01((p - enter) / (full - enter))
          : 1
    const outlineAmt = clamp01((o - 0.35) / 0.5)
    outline.classList.toggle('is-outlined', outlineAmt > 0.25 && outlineAmt < 0.92)
  }

  const introPortrait = stage.querySelector<HTMLElement>('.journey-portrait')
  if (introPortrait) {
    const enter = 0.13
    const full = 0.2
    const o = p < enter ? 0 : p < full ? clamp01((p - enter) / (full - enter)) : 1
    const slide = lerp(mobile ? 16 : 28, 0, o)
    introPortrait.style.opacity = String(o)
    introPortrait.style.transform = `translate3d(${slide}px, 0, 0) scale(${lerp(1.04, 1, o)})`
  }
}

export function applyProjectExhibition(
  projectEls: HTMLElement[],
  p: number,
  mobile: boolean,
  pointer: JourneyPointer,
) {
  const projStart = 0.61
  const projEnd = 0.74
  const count = projectEls.length
  if (count === 0) return

  if (p < projStart - 0.04 || p > projEnd + 0.04) {
    projectEls.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0, 32px, 0) scale(0.95)'
    })
    return
  }

  const local = clamp01((p - projStart) / (projEnd - projStart))

  projectEls.forEach((el, i) => {
    const slot = 1 / count
    const center = (i + 0.5) * slot
    const focus = clamp01(1 - Math.abs(local - center) / (slot * 1.05))
    const detail = easeInOut(clamp01((focus - 0.35) / 0.55))

    el.style.opacity = String(lerp(0.08, 1, focus))
    el.style.transform = `translate3d(0, ${lerp(24, 0, focus)}px, 0) scale(${lerp(0.96, 1, focus)})`

    const visual = el.querySelector<HTMLElement>('.journey-project-visual')
    const meta = el.querySelector<HTMLElement>('.journey-project-meta')
    const px =
      pointer.active && !mobile && focus > 0.55
        ? (pointer.tx - 0.5) * (mobile ? 4 : 10)
        : 0
    const py =
      pointer.active && !mobile && focus > 0.55
        ? (pointer.ty - 0.5) * (mobile ? 3 : 8)
        : 0

    if (visual) {
      visual.style.transform = `translate3d(${px * 0.4}px, ${py * 0.3}px, 0) scale(${lerp(1.05, 1, focus)})`
    }
    if (meta) {
      meta.style.opacity = String(detail)
      meta.style.transform = `translate3d(0, ${lerp(18, 0, detail)}px, 0)`
    }
  })
}

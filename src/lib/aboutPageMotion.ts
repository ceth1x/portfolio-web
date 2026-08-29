import {
  aboutPageBranchSide,
  applyBotanicalBranch,
  initBotanicalBranch,
} from '@/lib/botanicalBranchMotion'
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

export function pageScrollProgress(main: HTMLElement) {
  const vh = window.visualViewport?.height ?? window.innerHeight
  const total = main.offsetHeight - vh
  if (total <= 0) return 0
  const rect = main.getBoundingClientRect()
  return clamp01(-rect.top / total)
}

export function initAboutPage(branch: HTMLElement | null) {
  initBotanicalBranch(branch)
}

type AboutMotionTarget = {
  main: HTMLElement
  branch: HTMLElement | null
  portrait: HTMLElement | null
  rule: HTMLElement | null
  rails: HTMLElement[]
  outline: HTMLElement | null
  mobile: boolean
  pointer: JourneyPointer
}

export function applyAboutPageMotion({
  main,
  branch,
  portrait,
  rule,
  rails,
  outline,
  mobile,
  pointer,
}: AboutMotionTarget) {
  const p = pageScrollProgress(main)

  applyBotanicalBranch(branch, p, mobile, pointer, {
    sideFn: (progress) => aboutPageBranchSide(progress, mobile),
    projectDimRange: null,
    fadeInAt: 0,
    endFadeAt: 0.97,
    layout: 'fixed',
  })

  const hero = main.querySelector<HTMLElement>('.about-hero')
  if (hero) {
    const heroRect = hero.getBoundingClientRect()
    const heroP = clamp01(1 - heroRect.top / Math.max(heroRect.height, 1))
    const localHero = easeInOut(clamp01(heroP * 1.4))

    if (portrait) {
      const py = lerp(mobile ? 6 : 22, 0, localHero)
      const scale = lerp(mobile ? 1.03 : 1.06, 1, localHero)
      const px = pointer.active && !mobile ? (pointer.tx - 0.5) * 8 : 0
      portrait.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${scale})`
    }

    if (rule) {
      rule.style.transform = `scaleX(${easeInOut(clamp01(localHero * 1.2))})`
      rule.style.transformOrigin = 'left center'
    }
  }

  rails.forEach((rail) => {
    const block = rail.closest<HTMLElement>('.about-block, .about-hero')
    if (!block) return
    const rect = block.getBoundingClientRect()
    const vh = window.innerHeight
    const enter = clamp01(1 - (rect.top - vh * 0.15) / (vh * 0.55))
    const exit = clamp01((rect.bottom - vh * 0.2) / (vh * 0.4))
    const vis = easeInOut(Math.min(enter, exit))
    rail.style.transform = `scaleY(${lerp(0.08, 1, vis)})`
    rail.style.transformOrigin = 'top center'
    rail.style.opacity = String(lerp(0.15, 0.42, vis))
  })

  if (outline) {
    const rect = outline.getBoundingClientRect()
    const fill = easeInOut(clamp01(1 - (rect.top - window.innerHeight * 0.55) / (window.innerHeight * 0.25)))
    outline.classList.toggle('is-filled', fill > 0.55)
    outline.style.opacity = String(lerp(0.35, 1, fill))
  }
}

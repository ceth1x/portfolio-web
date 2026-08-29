import {OPENING_SCROLL_END} from '@/lib/openingVisualMotion'

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t)
}

type ScrubState = {
  raf: number | null
  targetTime: number
  appliedTime: number
  seeking: boolean
  pendingSeek: boolean
  duration: number
  frameStep: number
  video: HTMLVideoElement | null
}

export function createOpeningVideoScrub() {
  const state: ScrubState = {
    raf: null,
    targetTime: 0,
    appliedTime: -1,
    seeking: false,
    pendingSeek: false,
    duration: 0,
    frameStep: 1 / 24,
    video: null,
  }

  const applySeek = () => {
    const video = state.video
    const duration = state.duration
    if (!video || !duration) return

    if (state.seeking) {
      state.pendingSeek = true
      return
    }

    const step = state.frameStep
    const quantized = Math.round(state.targetTime / step) * step
    const next = Math.min(Math.max(0, quantized), Math.max(0, duration - 0.05))
    const minDelta = step * 0.65
    if (Math.abs(next - state.appliedTime) < minDelta) return

    state.seeking = true
    try {
      video.currentTime = next
    } catch {
      state.seeking = false
      return
    }

    window.setTimeout(() => {
      if (state.seeking && Math.abs(video.currentTime - next) < 0.08) {
        state.seeking = false
        state.appliedTime = video.currentTime
        if (state.pendingSeek) {
          state.pendingSeek = false
          scheduleSeek()
        }
      }
    }, 80)
  }

  const scheduleSeek = () => {
    if (state.raf != null) return
    state.raf = requestAnimationFrame(() => {
      state.raf = null
      applySeek()
    })
  }

  return {
    bind(video: HTMLVideoElement | null, mobile: boolean, onReady?: () => void) {
      state.video = video
      state.frameStep = mobile ? 1 / 12 : 1 / 24
      if (!video) return () => {}

      const onMeta = () => {
        state.duration = video.duration
        video.pause()
        try {
          video.currentTime = 0
          state.appliedTime = 0
        } catch {
          // ignore
        }
        onReady?.()
      }

      const onSeeked = () => {
        state.seeking = false
        state.appliedTime = video.currentTime
        if (state.pendingSeek) {
          state.pendingSeek = false
          scheduleSeek()
        }
      }

      video.addEventListener('loadedmetadata', onMeta)
      video.addEventListener('seeked', onSeeked)
      if (video.readyState >= 1) onMeta()

      return () => {
        video.removeEventListener('loadedmetadata', onMeta)
        video.removeEventListener('seeked', onSeeked)
        if (state.raf != null) cancelAnimationFrame(state.raf)
        state.raf = null
        state.video = null
      }
    },

    scrub(globalP: number, mobile: boolean) {
      state.frameStep = mobile ? 1 / 12 : 1 / 24
      const duration = state.duration
      if (!duration || globalP > OPENING_SCROLL_END + 0.04) return

      const t = clamp01(globalP / OPENING_SCROLL_END)
      state.targetTime = t * Math.max(0, duration - 0.05)
      scheduleSeek()
    },
  }
}

export function applyOpeningVideoShell(root: HTMLElement | null, globalP: number) {
  const shell = root?.querySelector<HTMLElement>('[data-opening-video-shell]')
  if (!shell) return

  if (globalP < 0.12) {
    shell.style.opacity = '1'
    shell.style.transform = 'translate3d(0,0,0) scale(1)'
  } else if (globalP < 0.22) {
    const t = (globalP - 0.12) / 0.1
    shell.style.opacity = String(lerp(1, 0, t))
    shell.style.transform = `translate3d(0, ${lerp(0, -3, t)}%, 0) scale(${lerp(1, 1.03, t)})`
  } else {
    shell.style.opacity = '0'
  }
}

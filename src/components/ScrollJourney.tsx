'use client'

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'
import type {SiteContent} from '@/content/site'
import {BotanicalLine} from '@/components/BotanicalLine'

type Props = {
  content: SiteContent
  reduce: boolean
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function chapterOpacity(p: number, enter: number, full: number, exit: number) {
  if (p <= enter || p >= exit) return 0
  if (p < full) return clamp01((p - enter) / Math.max(0.001, full - enter))
  // Hold briefly, then fade out before the next chapter peaks
  const fade = Math.max(0.001, exit - full)
  const holdEnd = full + fade * 0.35
  if (p < holdEnd) return 1
  return clamp01(1 - (p - holdEnd) / (exit - holdEnd))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t)
}

/**
 * Botanical lane side: 0 = left, 1 = right.
 * Opposite of the active text block. Smoothly blends at chapter handoffs.
 */
function botanicalSide(p: number) {
  // Text left → line right (1); text right → line left (0)
  const keys: Array<{at: number; side: number}> = [
    {at: 0.1, side: 1},
    {at: 0.28, side: 1},
    {at: 0.32, side: 0}, // craft — text right
    {at: 0.45, side: 0},
    {at: 0.48, side: 1}, // approach / projects / learning — text left
    {at: 0.85, side: 1},
    {at: 0.88, side: 0}, // tools — text right
    {at: 0.94, side: 1}, // contact — text left
    {at: 1, side: 1},
  ]
  if (p <= keys[0].at) return keys[0].side
  for (let i = 1; i < keys.length; i++) {
    const prev = keys[i - 1]
    const next = keys[i]
    if (p <= next.at) {
      const t = (p - prev.at) / Math.max(0.001, next.at - prev.at)
      // ease in-out for calm lane handoff
      const e = t * t * (3 - 2 * t)
      return lerp(prev.side, next.side, e)
    }
  }
  return keys[keys.length - 1].side
}

/**
 * Continuous homepage journey:
 * 1) Existing cinematic video scrub (opening)
 * 2) Botanical SVG lane (decorative divider) + calm typography zones
 * Direct DOM / rAF — no React state on scroll.
 */
export function ScrollJourney({content, reduce}: Props) {
  const {person, brand, contact, opening, projects} = content

  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoShellRef = useRef<HTMLDivElement>(null)
  const botanicalRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<(HTMLElement | null)[]>([])

  const rafRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const appliedTimeRef = useRef(-1)
  const seekingRef = useRef(false)
  const pendingSeekRef = useRef(false)
  const durationRef = useRef(0)
  const frameStepRef = useRef(1 / 24)
  const isMobileRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const featured = projects.items.filter((p) => p.featured && p.image).slice(0, 3)

  const setProject = (index: number) => (el: HTMLElement | null) => {
    projectRefs.current[index] = el
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const update = () => {
      const mobile = mq.matches
      isMobileRef.current = mobile
      setIsMobile(mobile)
      frameStepRef.current = mobile ? 1 / 12 : 1 / 24
    }
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduce) return

    const onMeta = () => {
      durationRef.current = video.duration
      setReady(true)
      video.pause()
      try {
        video.currentTime = 0
        appliedTimeRef.current = 0
      } catch {
        // ignore
      }
    }

    const onSeeked = () => {
      seekingRef.current = false
      appliedTimeRef.current = video.currentTime
      if (pendingSeekRef.current) {
        pendingSeekRef.current = false
        scheduleSeek()
      }
    }

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('seeked', onSeeked)
    if (video.readyState >= 1) onMeta()
    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('seeked', onSeeked)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening.videoSrc, reduce])

  const applySeek = () => {
    const video = videoRef.current
    const duration = durationRef.current
    if (!video || !duration) return
    if (seekingRef.current) {
      pendingSeekRef.current = true
      return
    }

    const step = frameStepRef.current
    const quantized = Math.round(targetTimeRef.current / step) * step
    const next = Math.min(Math.max(0, quantized), Math.max(0, duration - 0.05))
    const minDelta = isMobileRef.current ? step * 0.9 : step * 0.6
    if (Math.abs(next - appliedTimeRef.current) < minDelta) return

    seekingRef.current = true
    try {
      video.currentTime = next
    } catch {
      seekingRef.current = false
      return
    }

    window.setTimeout(() => {
      if (seekingRef.current && Math.abs(video.currentTime - next) < 0.08) {
        seekingRef.current = false
        appliedTimeRef.current = video.currentTime
        if (pendingSeekRef.current) {
          pendingSeekRef.current = false
          scheduleSeek()
        }
      }
    }, 80)
  }

  const scheduleSeek = () => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      applySeek()
    })
  }

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return

    const VIDEO_END = 0.14

    const update = () => {
      const rect = track.getBoundingClientRect()
      const total = track.offsetHeight - window.innerHeight
      const p = total > 0 ? clamp01(-rect.top / total) : 0
      const mobile = isMobileRef.current

      const fill = progressFillRef.current
      if (fill) fill.style.transform = `scaleX(${p})`

      // Opening video scrub
      const duration = durationRef.current
      if (duration > 0 && p <= VIDEO_END + 0.04) {
        targetTimeRef.current = clamp01(p / VIDEO_END) * Math.max(0, duration - 0.05)
        scheduleSeek()
      }

      // Video shell exit
      const shell = videoShellRef.current
      if (shell) {
        if (p < 0.12) {
          shell.style.opacity = '1'
          shell.style.transform = 'translate3d(0,0,0) scale(1)'
        } else if (p < 0.22) {
          const t = (p - 0.12) / 0.1
          shell.style.opacity = String(lerp(1, 0, t))
          shell.style.transform = `translate3d(0, ${lerp(0, -4, t)}%, 0) scale(${lerp(1, 1.04, t)})`
        } else {
          shell.style.opacity = '0'
          shell.style.pointerEvents = 'none'
        }
      }

      // Botanical lane — decorative divider in its own zone (never over text)
      // Side keyframes: 1 = right lane, 0 = left lane. Text sits on the opposite side.
      const bot = botanicalRef.current
      if (bot) {
        if (p < 0.1) {
          bot.style.opacity = '0'
        } else {
          const fadeIn = clamp01((p - 0.1) / 0.05)
          const projectDim = p > 0.52 && p < 0.76 ? 0.38 : 1
          bot.style.opacity = String(fadeIn * projectDim)

          const t = clamp01((p - 0.1) / 0.88)
          const side = botanicalSide(p)
          // Wind stays inside the lane — small motion only
          const wind = Math.sin(t * Math.PI * 2.5) * (mobile ? 3 : 5)
          const y = Math.sin(t * Math.PI * 1.8) * (mobile ? 1.5 : 2.5)
          const rot = lerp(mobile ? -3 : -6, mobile ? 4 : 7, t) + Math.sin(t * Math.PI * 2) * 1.8

          if (mobile) {
            bot.style.left = 'auto'
            bot.style.right = '0'
            bot.style.width = '22%'
            bot.style.transform = `translate3d(${wind * 0.35}%, ${y}%, 0) rotate(${rot}deg)`
          } else {
            const laneW = 34
            const leftPct = lerp(0, 100 - laneW, side)
            bot.style.right = 'auto'
            bot.style.width = `${laneW}%`
            bot.style.left = `${leftPct}%`
            bot.style.transform = `translate3d(${wind}%, ${y}%, 0) rotate(${rot}deg)`
          }
        }
      }

      // Chapters
      const chapters = stageRef.current?.querySelectorAll<HTMLElement>('[data-chapter]')
      chapters?.forEach((el) => {
        const enter = Number(el.dataset.in)
        const full = Number(el.dataset.full)
        const exit = Number(el.dataset.out)
        if (!Number.isFinite(enter)) return
        const o = chapterOpacity(p, enter, full, exit)
        el.style.opacity = String(o)
        el.style.visibility = o < 0.08 ? 'hidden' : 'visible'
        el.style.pointerEvents = o > 0.55 ? 'auto' : 'none'
        const rise = lerp(18, 0, clamp01((p - enter) / Math.max(0.001, full - enter)))
        el.style.transform = `translate3d(0, ${rise * (1 - o)}px, 0)`
        el.setAttribute('aria-hidden', o < 0.2 ? 'true' : 'false')
      })

      // Project focus stack
      const projStart = 0.61
      const projEnd = 0.74
      const els = projectRefs.current.filter(Boolean) as HTMLElement[]
      const count = els.length
      if (count > 0 && p >= projStart - 0.04 && p <= projEnd + 0.04) {
        const local = clamp01((p - projStart) / (projEnd - projStart))
        els.forEach((el, i) => {
          const slot = 1 / count
          const center = (i + 0.5) * slot
          const focus = clamp01(1 - Math.abs(local - center) / (slot * 1.1))
          el.style.opacity = String(lerp(0.12, 1, focus))
          el.style.transform = `translate3d(0, ${lerp(28, 0, focus)}px, 0) scale(${lerp(0.94, 1, focus)})`
        })
      } else {
        els.forEach((el) => {
          el.style.opacity = '0'
          el.style.transform = 'translate3d(0, 32px, 0) scale(0.95)'
        })
      }
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll, {passive: true})
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  if (reduce) {
    return (
      <div className="journey-static">
        <section className="section" id="top">
          <div className="wrap">
            <p className="eyebrow">{brand.name}</p>
            <h1 className="display-xl">
              I build
              <br />
              digital
              <br />
              experiences.
            </h1>
            <p className="lead">
              I&apos;m Philippe, a 19-year-old developer and HBO Informatica student based in the
              Netherlands. I combine development and design to turn ideas into polished,
              interactive websites.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/work">
                View my work
              </a>
              <a className="btn btn-secondary" href="/contact">
                Get in touch
              </a>
            </div>
          </div>
        </section>
        <section className="section" id="about">
          <div className="wrap journey-split">
            <div>
              <h2 className="display-lg">
                Curious by nature.
                <br />
                Focused on creating.
              </h2>
            </div>
            <div className="about-copy">
              <p>
                I&apos;ve always been interested in understanding how things work and figuring out
                how to make them better.
              </p>
              <p>
                From programming and problem-solving to visual design, I enjoy taking something from
                an idea to something people can actually use.
              </p>
              <p className="muted">
                Currently studying HBO Informatica in Leiden. Completed part of Harvard&apos;s CS50x
                course.
              </p>
            </div>
          </div>
        </section>
        <section className="section" id="work">
          <div className="wrap">
            <h2 className="display-lg">
              Selected
              <br />
              work
            </h2>
            <div className="projects-row">
              {featured.map((project) => (
                <article key={project.id} className="project-case">
                  {project.image ? (
                    <div className="project-visual">
                      <div className="project-image-wrap">
                        <Image src={project.image} alt="" fill className="project-image" sizes="100vw" />
                      </div>
                    </div>
                  ) : null}
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="contact">
          <div className="wrap">
            <h2 className="display-lg">
              Have an idea?
              <br />
              Let&apos;s build something.
            </h2>
            <a className="btn btn-primary" href="/contact">
              Get in touch →
            </a>
            <p className="contact-email">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
            <p className="contact-email">
              <a href={`tel:${contact.phone}`}>{contact.phoneDisplay}</a>
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <section
      ref={trackRef}
      className={`journey${isMobile ? ' is-mobile' : ''}`}
      aria-label="Portfolio"
    >
      <div className="journey-anchor" id="top" style={{top: '0%'}} />
      <div className="journey-anchor" id="about" style={{top: '18%'}} />
      <div className="journey-anchor" id="craft" style={{top: '32%'}} />
      <div className="journey-anchor" id="work" style={{top: '50%'}} />
      <div className="journey-anchor" id="learning" style={{top: '74%'}} />
      <div className="journey-anchor" id="contact" style={{top: '90%'}} />

      <div className="journey-sticky">
        <div className="journey-stage" ref={stageRef}>
          {/* Keep existing cinematic opening */}
          <div ref={videoShellRef} className={`journey-video-shell${ready ? ' is-ready' : ''}`}>
            <video
              ref={videoRef}
              className="journey-video"
              src={opening.videoSrc}
              poster={opening.posterSrc}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
            />
            <div className="cinema-wash" aria-hidden="true" />
          </div>

          {/* Botanical lane — decorative divider only (clipped to its zone) */}
          <div className="botanical-lane" ref={botanicalRef} aria-hidden="true">
            <BotanicalLine className="botanical-svg" />
          </div>

          {/* Opening — cinematic typography (before botanical) */}
          <div
            className="journey-chapter journey-opening text-side-left"
            data-chapter="opening"
            data-in="0"
            data-full="0.02"
            data-out="0.12"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="name-stack">
                  <span>{brand.line1}</span>
                  <span>{brand.line2}</span>
                </p>
                <h1 className="display-xl">
                  I build
                  <br />
                  digital
                  <br />
                  experiences.
                </h1>
                <p className="lead open-lead">
                  I&apos;m Philippe, a 19-year-old developer and HBO Informatica student based in
                  the Netherlands. I combine development and design to turn ideas into polished,
                  interactive websites.
                </p>
                <div className="cta-row">
                  <a className="text-cta" href="/work">
                    View my work
                  </a>
                  <a className="text-cta text-cta-muted" href="/contact">
                    Get in touch
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Intro — text LEFT, line RIGHT */}
          <div
            className="journey-chapter text-side-left"
            data-chapter="intro"
            data-in="0.13"
            data-full="0.18"
            data-out="0.30"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">About</p>
                <h2 className="display-lg">
                  Curious by nature.
                  <br />
                  Focused on creating.
                </h2>
                <p className="lead">
                  I&apos;ve always been interested in understanding how things work and figuring out
                  how to make them better.
                </p>
                <p className="lead">
                  From programming and problem-solving to visual design, I enjoy taking something
                  from an idea to something people can actually use.
                </p>
                <p className="meta-line">Currently studying HBO Informatica in Leiden.</p>
                <p className="meta-line">Completed part of Harvard&apos;s CS50x course.</p>
                <div className="cta-row">
                  <a className="text-cta" href="/about">
                    More about me →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Craft — text RIGHT, line LEFT */}
          <div
            className="journey-chapter text-side-right"
            data-chapter="craft"
            data-in="0.31"
            data-full="0.36"
            data-out="0.46"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">Craft</p>
                <h2 className="display-lg">
                  Design ×
                  <br />
                  Development
                </h2>
                <p className="lead">I enjoy working where design and technology meet.</p>
                <div className="craft-list">
                  <div>
                    <h3>Web development</h3>
                    <p>
                      Responsive websites built with modern frontend technologies and a strong focus
                      on performance and usability.
                    </p>
                  </div>
                  <div>
                    <h3>UI &amp; visual design</h3>
                    <p>
                      Clean, thoughtful interfaces where typography, composition, color and motion
                      work together.
                    </p>
                  </div>
                  <div>
                    <h3>Interactive experiences</h3>
                    <p>
                      Animations and interactions that make a website feel engaging without getting
                      in the way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approach — text LEFT, line RIGHT */}
          <div
            className="journey-chapter text-side-left"
            data-chapter="approach"
            data-in="0.47"
            data-full="0.52"
            data-out="0.60"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">Approach</p>
                <h2 className="display-lg">
                  Start with an idea.
                  <br />
                  Build something real.
                </h2>
                <p className="lead">
                  I like solving problems by breaking them down, experimenting with different
                  approaches and turning the best idea into something tangible.
                </p>
                <p className="lead">
                  I care about more than just making something work. The details matter — how it
                  feels, how it moves, how it responds and how naturally someone can use it.
                </p>
              </div>
            </div>
          </div>

          {/* Selected work — content LEFT, line RIGHT (dimmed) */}
          <div
            className="journey-chapter journey-projects text-side-left"
            data-chapter="projects"
            data-in="0.61"
            data-full="0.65"
            data-out="0.74"
          >
            <div className="wrap zone-inner zone-inner-wide">
              <div className="text-block text-block-projects">
                <div className="journey-projects-head">
                  <p className="eyebrow">Portfolio</p>
                  <h2 className="display-lg">
                    Selected
                    <br />
                    work
                  </h2>
                  <p className="lead">
                    {featured.length > 0
                      ? "A selection of projects I've designed and built."
                      : 'New projects will appear here as they are completed.'}
                  </p>
                  {featured.length > 0 ? (
                    <a className="text-cta" href="/work">
                      View all work →
                    </a>
                  ) : null}
                </div>

                {featured.length > 0 ? (
                  <div className="journey-project-stack">
                    {featured.map((project, i) => (
                      <article
                        key={project.id}
                        className={`journey-project accent-${project.accent}`}
                        ref={setProject(i)}
                      >
                        <div className="journey-project-visual">
                          <Image
                            src={project.image!}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 88vw, 58vw"
                            className="journey-project-image"
                            loading={i === 0 ? 'eager' : 'lazy'}
                            quality={75}
                          />
                        </div>
                        <div className="journey-project-meta">
                          <p className="project-subtitle">{project.subtitle}</p>
                          <h3>{project.title}</h3>
                          <p className="project-description">{project.description}</p>
                          <ul className="project-tags">
                            {project.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                          <a className="text-cta text-cta-muted" href="/work">
                            View project →
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Learning — text LEFT, line RIGHT */}
          <div
            className="journey-chapter text-side-left"
            data-chapter="learning"
            data-in="0.75"
            data-full="0.79"
            data-out="0.86"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">Growth</p>
                <h2 className="display-lg">
                  Still learning.
                  <br />
                  Always building.
                </h2>
                <p className="lead">
                  I&apos;m at the beginning of my journey in technology, and that&apos;s something I
                  embrace.
                </p>
                <p className="lead">
                  Every project is a chance to learn something new — a technology, a better way to
                  solve a problem, or a clearer approach to design.
                </p>
                <p className="display-sm">
                  How it works.
                  <br />
                  And how it feels.
                </p>
              </div>
            </div>
          </div>

          {/* Tools — text RIGHT, line LEFT */}
          <div
            className="journey-chapter text-side-right"
            data-chapter="tools"
            data-in="0.87"
            data-full="0.90"
            data-out="0.94"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">Stack</p>
                <h2 className="display-lg">
                  Tools &amp;
                  <br />
                  technologies
                </h2>
                <div className="tools-grid">
                  <div>
                    <h3>Development</h3>
                    <p>HTML · CSS · JavaScript · TypeScript · React · Next.js · Git</p>
                  </div>
                  <div>
                    <h3>Design</h3>
                    <p>UI design · Responsive design · Typography · Motion</p>
                  </div>
                  <div>
                    <h3>Currently learning</h3>
                    <p>Computer science · Software development · Modern web technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact — text LEFT, line RIGHT */}
          <div
            className="journey-chapter journey-contact text-side-left"
            data-chapter="contact"
            data-in="0.945"
            data-full="0.97"
            data-out="1.05"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="eyebrow">Contact</p>
                <h2 className="display-lg">
                  Have an idea?
                  <br />
                  Let&apos;s build
                  <br />
                  something.
                </h2>
                <p className="lead">
                  Whether you have a project in mind, want to work together, or simply want to say
                  hello — I&apos;d be happy to hear from you.
                </p>
                <div className="contact-details contact-details-compact">
                  <a className="contact-detail" href={`mailto:${contact.email}`}>
                    <span className="contact-detail-label">Email</span>
                    <span className="contact-detail-value">{contact.email}</span>
                  </a>
                  <a className="contact-detail" href={`tel:${contact.phone}`}>
                    <span className="contact-detail-label">Phone</span>
                    <span className="contact-detail-value">{contact.phoneDisplay}</span>
                  </a>
                </div>
                <a className="text-cta" href="/contact">
                  Contact page →
                </a>
              </div>
            </div>
          </div>

          <div className="journey-progress" aria-hidden="true">
            <div className="cinema-progress-track">
              <div ref={progressFillRef} className="cinema-progress-fill" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import type {SiteContent} from '@/content/site'
import {BotanicalBranch} from '@/components/BotanicalBranch'
import {JourneyMobileFlow} from '@/components/JourneyMobileFlow'
import {OpeningScrollVisual} from '@/components/OpeningScrollVisual'
import {applyBotanicalBranch, initBotanicalBranch} from '@/lib/botanicalBranchMotion'
import {applyOpeningVisual, initOpeningPaths} from '@/lib/openingVisualMotion'
import {
  applyJourneyCamera,
  applyProjectExhibition,
  applyTypeConstruction,
  type JourneyPointer,
} from '@/lib/journeyComposition'
import {applyOpeningVideoShell, createOpeningVideoScrub} from '@/lib/openingVideoScrub'
import {useIsMobile} from '@/lib/useIsMobile'

type Props = {
  content: SiteContent
  reduce: boolean
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function chapterOpacity(p: number, enter: number, full: number, exit: number) {
  if (p >= exit) return 0
  if (enter === 0 && full === 0) return 1
  if (p < enter) return 0
  if (full <= enter) return 1
  if (p < full) return clamp01((p - enter) / Math.max(0.001, full - enter))
  // Hold briefly, then fade out before the next chapter peaks
  const fade = Math.max(0.001, exit - full)
  const holdEnd = full + fade * 0.35
  if (p < holdEnd) return 1
  return clamp01(1 - (p - holdEnd) / (exit - holdEnd))
}

function chapterRise(p: number, enter: number, full: number, o: number) {
  if (full <= enter) return 0
  const rise = lerp(18, 0, clamp01((p - enter) / Math.max(0.001, full - enter)))
  return rise * (1 - o)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t)
}

/**
 * Continuous homepage journey:
 * 1) Scroll-driven organic opening visual
 * 2) Living botanical branch + calm typography zones
 * Direct DOM / rAF — no React state on scroll.
 */
export function ScrollJourney({content, reduce}: Props) {
  const {brand, contact, hero, opening, person, portrait, projects} = content

  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const openingVisualRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<(HTMLElement | null)[]>([])
  const videoScrubRef = useRef(createOpeningVideoScrub())
  const pointerRef = useRef<JourneyPointer>({x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false})
  const pointerRafRef = useRef<number | null>(null)

  const isMobileRef = useRef(false)

  const isMobile = useIsMobile()
  const [openingReady, setOpeningReady] = useState(false)

  useEffect(() => {
    isMobileRef.current = isMobile
  }, [isMobile])

  const featured = projects.items.filter((p) => p.featured && p.image).slice(0, 3)

  const setProject = (index: number) => (el: HTMLElement | null) => {
    projectRefs.current[index] = el
  }

  useLayoutEffect(() => {
    initOpeningPaths(openingVisualRef.current)
    initBotanicalBranch(branchRef.current)
  }, [])

  useEffect(() => {
    if (reduce || isMobile) return
    const video = openingVisualRef.current?.querySelector<HTMLVideoElement>('[data-opening-video]') ?? null
    const unbind = videoScrubRef.current.bind(video, false, () => setOpeningReady(true))
    return unbind
  }, [reduce, isMobile, opening.videoSrc])

  useEffect(() => {
    if (reduce) return
    const stage = stageRef.current
    if (!stage || isMobile) return

    const pointer = pointerRef.current

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      pointer.x = clamp01((e.clientX - rect.left) / rect.width)
      pointer.y = clamp01((e.clientY - rect.top) / rect.height)
      pointer.active = true
    }

    const onLeave = () => {
      pointer.active = false
    }

    const tick = () => {
      pointer.tx += (pointer.x - pointer.tx) * 0.06
      pointer.ty += (pointer.y - pointer.ty) * 0.06
      pointerRafRef.current = requestAnimationFrame(tick)
    }

    pointerRafRef.current = requestAnimationFrame(tick)
    stage.addEventListener('pointermove', onMove, {passive: true})
    stage.addEventListener('pointerleave', onLeave)

    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      if (pointerRafRef.current != null) cancelAnimationFrame(pointerRafRef.current)
    }
  }, [reduce, isMobile])

  useLayoutEffect(() => {
    if (reduce || isMobile) return
    const track = trackRef.current
    if (!track) return

    const update = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.visualViewport?.height ?? window.innerHeight
      const total = track.offsetHeight - vh
      const p = total > 0 ? clamp01(-rect.top / total) : 0
      const mobile = isMobileRef.current

      const fill = progressFillRef.current
      if (fill) fill.style.transform = `scaleX(${p})`

      track.classList.toggle('journey-scroll-active', p > 0.002)

      // Opening — scroll-scrubbed video + organic line overlay
      applyOpeningVideoShell(openingVisualRef.current, p)
      videoScrubRef.current.scrub(p, mobile)
      applyOpeningVisual(openingVisualRef.current, p, mobile)

      applyJourneyCamera(stageRef.current, p, mobile)
      applyBotanicalBranch(branchRef.current, p, mobile, pointerRef.current)
      applyTypeConstruction(stageRef.current, p, mobile)

      // Chapters
      const chapters = stageRef.current?.querySelectorAll<HTMLElement>('[data-chapter]')
      chapters?.forEach((el) => {
        const enter = Number(el.dataset.in)
        const full = Number(el.dataset.full)
        const exit = Number(el.dataset.out)
        if (!Number.isFinite(enter)) return

        const isOpening = el.dataset.chapter === 'opening'

        if (isOpening && p <= 0.001) {
          el.style.removeProperty('opacity')
          el.style.removeProperty('visibility')
          el.style.removeProperty('transform')
          el.style.removeProperty('pointer-events')
          el.setAttribute('aria-hidden', 'false')
          return
        }

        const o = isOpening
          ? chapterOpacity(p, 0, 0, exit)
          : chapterOpacity(p, enter, full, exit)
        el.style.opacity = String(o)
        el.style.visibility = o < 0.08 ? 'hidden' : 'visible'
        el.style.pointerEvents = o > 0.55 ? 'auto' : 'none'
        const rise = chapterRise(p, isOpening ? 0 : enter, isOpening ? 0 : full, o)
        el.style.transform = rise > 0.01 ? `translate3d(0, ${rise}px, 0)` : 'none'
        el.setAttribute('aria-hidden', o < 0.2 ? 'true' : 'false')
      })

      applyProjectExhibition(
        projectRefs.current.filter(Boolean) as HTMLElement[],
        p,
        mobile,
        pointerRef.current,
      )
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
    const raf = requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, {passive: true})
    window.addEventListener('resize', onScroll, {passive: true})
    window.visualViewport?.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('scroll', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, isMobile])

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
            <p className="lead">{hero.lead}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/work">
                Explore my work
              </a>
              <a className="btn btn-secondary" href="/contact">
                Start a project
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
                Currently studying Informatics in Leiden. Completed part of Harvard&apos;s CS50x
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
                        <Image
                          src={project.image}
                          alt={`${project.title} — ${project.subtitle}`}
                          fill
                          className="project-image"
                          sizes="100vw"
                        />
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
    <>
      <div aria-hidden={isMobile ? undefined : true}>
        <JourneyMobileFlow content={content} />
      </div>
      <section
        ref={trackRef}
        className={`journey journey-cinematic${isMobile ? ' is-mobile' : ''}`}
        aria-hidden={isMobile}
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
          {/* Scroll-driven opening visual — organic line composition */}
          <OpeningScrollVisual
            ref={openingVisualRef}
            className="opening-visual"
            videoSrc={opening.videoSrc}
            posterSrc={opening.posterSrc}
            ready={openingReady}
          />

          <BotanicalBranch ref={branchRef} />

          {/* Opening — cinematic typography (before botanical) */}
          <div
            className="journey-chapter journey-opening text-side-left"
            data-chapter="opening"
            data-in="0"
            data-full="0"
            data-out="0.12"
          >
            <div className="wrap zone-inner">
              <div className="text-block">
                <p className="name-stack">
                  <span>{brand.line1}</span>
                  <span>{brand.line2}</span>
                </p>
                <h1 className="display-xl type-construct">
                  <span className="type-construct-line" data-line="0">
                    <span className="type-word">I</span>
                    <span className="type-word">build</span>
                  </span>
                  <span className="type-construct-line" data-line="1">
                    <span className="type-word">digital</span>
                  </span>
                  <span className="type-construct-line" data-line="2">
                    <span className="type-word">experiences.</span>
                  </span>
                </h1>
                <p className="lead open-lead">{hero.lead}</p>
                <div className="cta-row">
                  <a className="text-cta" href="/work">
                    Explore my work
                  </a>
                  <a className="text-cta text-cta-muted" href="/contact">
                    Start a project
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
            <div className="wrap zone-inner zone-intro">
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
                <p className="meta-line">Currently studying Informatics in Leiden.</p>
                <p className="meta-line">Completed part of Harvard&apos;s CS50x course.</p>
                <div className="cta-row">
                  <a className="text-cta" href="/about">
                    More about me →
                  </a>
                </div>
              </div>
              <figure className="journey-portrait">
                <div className="journey-portrait-frame">
                  <Image
                    src={portrait}
                    alt={`Portrait of ${person.name}`}
                    width={480}
                    height={640}
                    className="journey-portrait-img"
                    sizes="(max-width: 768px) 42vw, 220px"
                  />
                </div>
              </figure>
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
                  <span className="type-outline-word">Development</span>
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
                        className={`journey-project journey-project-exhibit accent-${project.accent}`}
                        ref={setProject(i)}
                      >
                        <p className="project-exhibit-label" aria-hidden="true">
                          Project {String(i + 1).padStart(2, '0')}
                        </p>
                        <div className="journey-project-visual">
                          <Image
                            src={project.image!}
                            alt={`${project.title} — ${project.subtitle}`}
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
    </>
  )
}

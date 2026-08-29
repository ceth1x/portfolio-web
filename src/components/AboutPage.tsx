'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'
import type {SiteContent} from '@/content/site'
import {BotanicalBranch} from '@/components/BotanicalBranch'
import {Reveal} from '@/components/motion/Reveal'
import {applyAboutPageMotion, initAboutPage} from '@/lib/aboutPageMotion'
import type {JourneyPointer} from '@/lib/journeyComposition'

type Props = {
  content: SiteContent
}

export function AboutPage({content}: Props) {
  const {person, portrait} = content

  const mainRef = useRef<HTMLElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<JourneyPointer>({x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false})
  const railsRef = useRef<HTMLElement[]>([])
  const isMobileRef = useRef(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      isMobileRef.current = mq.matches
      setReduceMotion(motionMq.matches)
    }
    update()
    mq.addEventListener('change', update)
    motionMq.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      motionMq.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    initAboutPage(branchRef.current)
    railsRef.current = Array.from(
      mainRef.current?.querySelectorAll<HTMLElement>('[data-about-rail]') ?? [],
    )
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const main = mainRef.current
    if (!main) return

    const pointer = pointerRef.current
    let raf: number | null = null

    const onMove = (e: PointerEvent) => {
      const rect = main.getBoundingClientRect()
      pointer.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      pointer.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
      pointer.active = true
    }

    const onLeave = () => {
      pointer.active = false
    }

    const tick = () => {
      pointer.tx += (pointer.x - pointer.tx) * 0.06
      pointer.ty += (pointer.y - pointer.ty) * 0.06
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const update = () => {
      applyAboutPageMotion({
        main,
        branch: branchRef.current,
        portrait: portraitRef.current,
        rule: ruleRef.current,
        rails: railsRef.current,
        outline: main.querySelector<HTMLElement>('.about-outline-line'),
        mobile: isMobileRef.current,
        pointer,
      })
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
    window.visualViewport?.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('scroll', onScroll)
    main.addEventListener('pointermove', onMove, {passive: true})
    main.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('scroll', onScroll)
      main.removeEventListener('pointermove', onMove)
      main.removeEventListener('pointerleave', onLeave)
      if (raf != null) cancelAnimationFrame(raf)
    }
  }, [reduceMotion])

  return (
    <main id="main" ref={mainRef} className="page-main about-page">
      {!reduceMotion ? <BotanicalBranch ref={branchRef} className="about-page-branch" /> : null}

      <section className="about-hero">
        <div className="wrap about-hero-grid">
          <Reveal className="about-hero-copy">
            <p className="about-index">01 — About</p>
            <h1 className="display-lg about-title">
              Curious by nature.
              <br />
              Focused on creating.
            </h1>
            <div ref={ruleRef} className="about-rule" aria-hidden="true" />
            <p className="lead">
              I&apos;m {person.firstName}, a {person.age}-year-old developer and HBO Informatica
              student based in the Netherlands. I combine development and design to turn ideas into
              polished, interactive websites.
            </p>
          </Reveal>

          <Reveal className="about-hero-visual" delay={0.08} y={20}>
            <figure className="portrait-frame portrait-frame-lg">
              <div ref={portraitRef} className="portrait-frame-inner" data-about-portrait>
                <Image
                  src={portrait}
                  alt={`${person.name} on a coastal trail`}
                  width={768}
                  height={1024}
                  className="portrait-img"
                  sizes="(max-width: 768px) 85vw, 420px"
                  priority
                />
              </div>
              <figcaption className="portrait-caption">
                <span>{person.name}</span>
                <span>{person.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="about-block">
        <div className="wrap about-editorial">
          <div className="about-editorial-rail" data-about-rail aria-hidden="true" />
          <Reveal className="about-editorial-body">
            <p className="about-label">Background</p>
            <p className="lead">
              I&apos;ve always been interested in understanding how things work and figuring out how
              to make them better.
            </p>
            <p className="lead">
              From programming and problem-solving to visual design, I enjoy taking something from
              an idea to something people can actually use.
            </p>
            <div className="about-meta-row">
              <p className="meta-line">Currently studying HBO Informatica in Leiden.</p>
              <p className="meta-line">Completed part of Harvard&apos;s CS50x course.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="about-block">
        <div className="wrap about-editorial about-editorial-shift">
          <div className="about-editorial-rail" data-about-rail aria-hidden="true" />
          <Reveal className="about-editorial-body">
            <p className="about-label">Approach</p>
            <h2 className="display-lg">
              Start with an idea.
              <br />
              Build something real.
            </h2>
            <p className="lead">
              I like solving problems by breaking them down, experimenting with different approaches
              and turning the best idea into something tangible.
            </p>
            <p className="lead">
              I care about more than just making something work. The details matter — how it feels,
              how it moves, how it responds and how naturally someone can use it.
            </p>
            <p className="about-outline-line">How it works. And how it feels.</p>
          </Reveal>
        </div>
      </section>

      <section className="about-block about-block-end">
        <div className="wrap about-editorial">
          <div className="about-editorial-rail" data-about-rail aria-hidden="true" />
          <div className="about-editorial-body">
            <Reveal>
              <p className="about-label">Craft</p>
              <h2 className="display-lg">
                Design ×
                <br />
                Development
              </h2>
              <p className="lead">I enjoy working where design and technology meet.</p>
            </Reveal>
            <div className="about-craft">
              <Reveal className="about-craft-item" delay={0.05}>
                <span className="about-craft-num">01</span>
                <div>
                  <h3>Web development</h3>
                  <p>
                    Responsive websites built with modern frontend technologies and a strong focus
                    on performance and usability.
                  </p>
                </div>
              </Reveal>
              <Reveal className="about-craft-item" delay={0.12}>
                <span className="about-craft-num">02</span>
                <div>
                  <h3>UI &amp; visual design</h3>
                  <p>
                    Clean, thoughtful interfaces where typography, composition, color and motion work
                    together.
                  </p>
                </div>
              </Reveal>
              <Reveal className="about-craft-item" delay={0.19}>
                <span className="about-craft-num">03</span>
                <div>
                  <h3>Interactive experiences</h3>
                  <p>
                    Animations and interactions that make a website feel engaging without getting in
                    the way.
                  </p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.24}>
              <div className="cta-row">
                <Link href="/work" className="text-cta">
                  View my work
                </Link>
                <Link href="/contact" className="text-cta text-cta-muted">
                  Get in touch
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}

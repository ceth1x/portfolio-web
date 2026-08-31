'use client'

import Link from 'next/link'
import {AnimatePresence, motion, useReducedMotion} from 'motion/react'
import {useEffect, useState} from 'react'
import {easeOut} from '@/lib/motion'

type Props = {
  brandName: string
}

const NAV = [
  {href: '/about', label: 'About'},
  {href: '/work', label: 'Work'},
  {href: '/contact', label: 'Contact'},
] as const

export function SiteHeader({brandName}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    let ticking = false
    let last = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const next = window.scrollY > 40
        if (next !== last) {
          last = next
          setScrolled(next)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', navOpen)
    return () => document.body.classList.remove('nav-open')
  }, [navOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeNav = () => setNavOpen(false)

  const onNavClick = () => {
    closeNav()
    window.scrollTo(0, 0)
  }

  return (
    <motion.header
      className={`site-header${scrolled ? ' is-scrolled' : ''}`}
      initial={false}
      animate={reduce ? undefined : {opacity: 1, y: 0}}
      transition={{duration: 0.75, ease: easeOut}}
    >
      <div className="wrap header-inner">
        <Link href="/" className="logo" aria-label={`${brandName} — home`} onClick={onNavClick}>
          <span className="logo-mark" aria-hidden="true">
            FB
          </span>
        </Link>

        <button
          className={`nav-toggle${navOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className="nav-toggle-label">Menu</span>
          <span className="nav-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {navOpen ? (
          <motion.div
            className="nav-overlay"
            key="nav-overlay"
            initial={reduce ? false : {opacity: 0}}
            animate={{opacity: 1}}
            exit={reduce ? undefined : {opacity: 0}}
            transition={{duration: 0.38, ease: easeOut}}
          >
            <motion.div
              className="nav-panel"
              initial={reduce ? false : {opacity: 0, y: 16}}
              animate={{opacity: 1, y: 0}}
              exit={reduce ? undefined : {opacity: 0, y: 10}}
              transition={{duration: 0.4, ease: easeOut}}
            >
              <nav id="site-nav" className="site-nav" aria-label="Main">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : {opacity: 0, y: 22}}
                    animate={{opacity: 1, y: 0}}
                    exit={reduce ? undefined : {opacity: 0, y: 10}}
                    transition={{duration: 0.4, delay: reduce ? 0 : 0.06 + i * 0.07, ease: easeOut}}
                  >
                    <Link href={item.href} className="site-nav-link" onClick={onNavClick}>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}

'use client'

import {AnimatePresence, motion, useReducedMotion} from 'motion/react'
import {usePathname} from 'next/navigation'
import type {ReactNode} from 'react'
import {easeOut} from '@/lib/motion'

type Props = {
  children: ReactNode
}

export function PageTransition({children}: Props) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const isHome = pathname === '/'

  if (reduce || isHome) {
    return <div className="page-shell">{children}</div>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="page-shell"
        initial={{opacity: 0, y: 14}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -10}}
        transition={{duration: 0.42, ease: easeOut}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

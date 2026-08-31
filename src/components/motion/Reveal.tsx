'use client'

import {motion, useReducedMotion} from 'motion/react'
import type {ReactNode} from 'react'
import {easeOut} from '@/lib/motion'
import {useIsMobile} from '@/lib/useIsMobile'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({children, className, delay = 0, y = 28}: Props) {
  const reduce = useReducedMotion()
  const isMobile = useIsMobile()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const offsetY = isMobile ? Math.min(y, 14) : y
  const duration = isMobile ? 0.52 : 0.75

  return (
    <motion.div
      className={className}
      initial={{opacity: isMobile ? 0.92 : 0, y: offsetY}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: isMobile ? '-4% 0px' : '-8% 0px'}}
      transition={{duration, delay, ease: easeOut}}
    >
      {children}
    </motion.div>
  )
}

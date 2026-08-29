'use client'

import {motion, useReducedMotion} from 'motion/react'
import type {ReactNode} from 'react'
import {easeOut} from '@/lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function Reveal({children, className, delay = 0, y = 28}: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-8% 0px'}}
      transition={{duration: 0.75, delay, ease: easeOut}}
    >
      {children}
    </motion.div>
  )
}

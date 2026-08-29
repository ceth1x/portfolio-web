'use client'

import {motion, useReducedMotion} from 'motion/react'
import type {ReactNode} from 'react'

type Props = {
  children: ReactNode
  className?: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function MagneticButton({children, className = '', href, variant = 'primary'}: Props) {
  const reduce = useReducedMotion()
  const cls = `btn btn-${variant} ${className}`.trim()

  if (reduce) {
    return (
      <a className={cls} href={href}>
        {children}
      </a>
    )
  }

  return (
    <motion.a
      className={cls}
      href={href}
      whileHover={{y: -2}}
      whileTap={{scale: 0.98}}
      transition={{type: 'spring', stiffness: 400, damping: 28}}
    >
      {children}
    </motion.a>
  )
}

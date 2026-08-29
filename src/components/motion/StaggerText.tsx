'use client'

import {motion, useReducedMotion} from 'motion/react'
import {easeOut} from '@/lib/motion'

type Props = {
  text: string
  className?: string
  as?: 'h1' | 'p' | 'span'
  delay?: number
}

export function StaggerText({text, className, as = 'span', delay = 0}: Props) {
  const reduce = useReducedMotion()
  const Tag = as

  if (reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="stagger-word"
          initial={{opacity: 0, y: 18, filter: 'blur(6px)'}}
          animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
          transition={{duration: 0.65, delay: delay + i * 0.06, ease: easeOut}}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}

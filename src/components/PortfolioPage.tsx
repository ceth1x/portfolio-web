'use client'

import {useReducedMotion} from 'motion/react'
import type {SiteContent} from '@/content/site'
import {ScrollJourney} from '@/components/ScrollJourney'

type Props = {
  content: SiteContent
}

export function PortfolioPage({content}: Props) {
  const reduce = useReducedMotion()

  return (
    <main id="main">
      <ScrollJourney content={content} reduce={!!reduce} />
    </main>
  )
}

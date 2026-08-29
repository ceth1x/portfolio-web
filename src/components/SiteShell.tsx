'use client'

import type {ReactNode} from 'react'
import type {SiteContent} from '@/content/site'
import {PageTransition} from '@/components/PageTransition'
import {SiteFooter} from '@/components/SiteFooter'
import {SiteHeader} from '@/components/SiteHeader'

type Props = {
  content: SiteContent
  children: ReactNode
}

export function SiteShell({content, children}: Props) {
  return (
    <>
      <div className="page-atmosphere" aria-hidden="true" />
      <SiteHeader name={content.person.name} />
      <PageTransition>{children}</PageTransition>
      <SiteFooter content={content} />
    </>
  )
}

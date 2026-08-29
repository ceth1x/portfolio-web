import type {Metadata} from 'next'
import {WorkPage} from '@/components/WorkPage'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected projects and digital work by Philippe Bouman at Bouman Digital — frontend development, web design and interactive experiences.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: `Work · ${siteConfig.name}`,
    description:
      'Selected projects and digital work by Philippe Bouman at Bouman Digital — frontend development, web design and interactive experiences.',
    url: `${siteUrl}/work`,
  },
}

export default function Work() {
  return <WorkPage content={siteContent} />
}

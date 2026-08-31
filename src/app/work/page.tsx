import type {Metadata} from 'next'
import {WorkPage} from '@/components/WorkPage'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected projects and digital work by Philippe Bouman at FrontBlender — frontend development, web design and interactive experiences.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: `Work · ${siteConfig.name}`,
    description:
      'Selected projects and digital work by Philippe Bouman at FrontBlender — frontend development, web design and interactive experiences.',
    url: `${siteUrl}/work`,
    images: [{url: siteConfig.ogImage, width: 1200, height: 1200, alt: `${siteConfig.name} logo`}],
  },
  twitter: {
    card: 'summary',
    title: `Work · ${siteConfig.name}`,
    description:
      'Selected projects and digital work by Philippe Bouman at FrontBlender — frontend development, web design and interactive experiences.',
    images: [siteConfig.ogImage],
  },
}

export default function Work() {
  return <WorkPage content={siteContent} />
}

import type {Metadata} from 'next'
import {AboutPage} from '@/components/AboutPage'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Philippe Bouman — frontend developer, HBO Informatica student in Leiden, and founder of Bouman Digital.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description:
      'About Philippe Bouman — frontend developer, HBO Informatica student in Leiden, and founder of Bouman Digital.',
    url: `${siteUrl}/about`,
    images: [{url: siteConfig.ogImage, width: 1200, height: 1200, alt: `${siteConfig.name} logo`}],
  },
  twitter: {
    card: 'summary',
    title: `About · ${siteConfig.name}`,
    description:
      'About Philippe Bouman — frontend developer, HBO Informatica student in Leiden, and founder of Bouman Digital.',
    images: [siteConfig.ogImage],
  },
}

export default function About() {
  return <AboutPage content={siteContent} />
}

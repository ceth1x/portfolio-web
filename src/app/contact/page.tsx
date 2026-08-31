import type {Metadata} from 'next'
import {ContactPage} from '@/components/ContactPage'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Philippe Bouman at FrontBlender for frontend development, web design and new project collaborations.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact · ${siteConfig.name}`,
    description:
      'Contact Philippe Bouman at FrontBlender for frontend development, web design and new project collaborations.',
    url: `${siteUrl}/contact`,
    images: [{url: siteConfig.ogImage, width: 1200, height: 1200, alt: `${siteConfig.name} logo`}],
  },
  twitter: {
    card: 'summary',
    title: `Contact · ${siteConfig.name}`,
    description:
      'Contact Philippe Bouman at FrontBlender for frontend development, web design and new project collaborations.',
    images: [siteConfig.ogImage],
  },
}

export default function Contact() {
  return <ContactPage content={siteContent} />
}

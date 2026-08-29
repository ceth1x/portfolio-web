import type {Metadata} from 'next'
import {PortfolioPage} from '@/components/PortfolioPage'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'

const homeTitle = siteConfig.title
const homeDescription = siteConfig.description

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: siteUrl,
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 1200,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: homeTitle,
    description: homeDescription,
    images: [siteConfig.ogImage],
  },
}

export default function Home() {
  return <PortfolioPage content={siteContent} />
}

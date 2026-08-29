import type {Metadata} from 'next'
import {AboutPage} from '@/components/AboutPage'
import {siteContent} from '@/content/site'

export const metadata: Metadata = {
  title: `About · ${siteContent.person.name}`,
  description: siteContent.seo.description,
}

export default function About() {
  return <AboutPage content={siteContent} />
}

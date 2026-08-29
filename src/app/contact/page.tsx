import type {Metadata} from 'next'
import {ContactPage} from '@/components/ContactPage'
import {siteContent} from '@/content/site'

export const metadata: Metadata = {
  title: `Contact · ${siteContent.person.name}`,
  description: 'Get in touch with Philippe Bouman.',
}

export default function Contact() {
  return <ContactPage content={siteContent} />
}

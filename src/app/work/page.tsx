import type {Metadata} from 'next'
import {WorkPage} from '@/components/WorkPage'
import {siteContent} from '@/content/site'

export const metadata: Metadata = {
  title: `Work · ${siteContent.person.name}`,
  description: 'Selected projects designed and built by Philippe Bouman.',
}

export default function Work() {
  return <WorkPage content={siteContent} />
}

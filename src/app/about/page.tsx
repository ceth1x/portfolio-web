import {AboutPage} from '@/components/AboutPage'
import {StructuredData} from '@/components/StructuredData'
import {siteContent} from '@/content/site'
import {buildPageMetadata} from '@/lib/metadata'
import {aboutPageStructuredData} from '@/lib/structured-data'

const title = 'About — Web Design & Development'
const description =
  'Meet Philippe Bouman, founder of FrontBlender — a web designer and developer in the Netherlands creating custom, modern websites for clients.'

export const metadata = buildPageMetadata({
  title,
  description,
  path: '/about',
})

export default function About() {
  return (
    <>
      <StructuredData data={aboutPageStructuredData()} />
      <AboutPage content={siteContent} />
    </>
  )
}

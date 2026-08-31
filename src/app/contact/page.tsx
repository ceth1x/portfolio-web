import {ContactPage} from '@/components/ContactPage'
import {StructuredData} from '@/components/StructuredData'
import {siteContent} from '@/content/site'
import {buildPageMetadata} from '@/lib/metadata'
import {contactPageStructuredData} from '@/lib/structured-data'

const title = 'Contact — Start a Project'
const description =
  'Ready for a new website? Contact FrontBlender to discuss web design, development and your next project in the Netherlands.'

export const metadata = buildPageMetadata({
  title,
  description,
  path: '/contact',
})

export default function Contact() {
  return (
    <>
      <StructuredData data={contactPageStructuredData()} />
      <ContactPage content={siteContent} />
    </>
  )
}

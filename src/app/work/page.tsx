import {WorkPage} from '@/components/WorkPage'
import {StructuredData} from '@/components/StructuredData'
import {siteContent} from '@/content/site'
import {buildPageMetadata} from '@/lib/metadata'
import {workPageStructuredData} from '@/lib/structured-data'

const title = 'Work — Custom Websites & Web Design'
const description =
  'Explore web design and development work by FrontBlender — custom websites, UI design and modern frontend development in the Netherlands.'

export const metadata = buildPageMetadata({
  title,
  description,
  path: '/work',
})

export default function Work() {
  return (
    <>
      <StructuredData data={workPageStructuredData()} />
      <WorkPage content={siteContent} />
    </>
  )
}

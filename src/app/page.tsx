import {PortfolioPage} from '@/components/PortfolioPage'
import {StructuredData} from '@/components/StructuredData'
import {siteContent} from '@/content/site'
import {buildPageMetadata} from '@/lib/metadata'
import {siteConfig} from '@/lib/site-config'
import {homePageStructuredData} from '@/lib/structured-data'

export const metadata = buildPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: '/',
})

export default function Home() {
  return (
    <>
      <StructuredData data={homePageStructuredData()} />
      <PortfolioPage content={siteContent} />
    </>
  )
}

import type {Metadata, Viewport} from 'next'
import {Fraunces, Manrope} from 'next/font/google'
import {SiteShell} from '@/components/SiteShell'
import {StructuredData} from '@/components/StructuredData'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'
import {globalStructuredData} from '@/lib/structured-data'
import './site.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{name: siteConfig.personName, url: `${siteUrl}/about`}],
  creator: siteConfig.personName,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#1f4a36',
  colorScheme: 'light',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StructuredData data={globalStructuredData} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell content={siteContent}>{children}</SiteShell>
      </body>
    </html>
  )
}

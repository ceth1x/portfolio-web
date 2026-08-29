import type {Metadata, Viewport} from 'next'
import {Fraunces, Manrope} from 'next/font/google'
import {SiteShell} from '@/components/SiteShell'
import {siteContent} from '@/content/site'
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
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    locale: 'en_NL',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7F3EC',
  colorScheme: 'light',
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell content={siteContent}>{children}</SiteShell>
      </body>
    </html>
  )
}

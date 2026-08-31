import type {Metadata, Viewport} from 'next'
import {Fraunces, Manrope} from 'next/font/google'
import {SiteShell} from '@/components/SiteShell'
import {siteContent} from '@/content/site'
import {siteConfig, siteUrl} from '@/lib/site-config'
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

const ogImage = {
  url: siteConfig.ogImage,
  width: 1200,
  height: 1200,
  alt: `${siteConfig.name} logo`,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{name: siteConfig.personName, url: siteUrl}],
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export const viewport: Viewport = {
  themeColor: '#1f4a36',
  colorScheme: 'light',
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteConfig.name,
      url: siteUrl,
      logo: `${siteUrl}${siteConfig.ogImage}`,
      email: siteConfig.email,
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: siteConfig.personName,
      url: siteUrl,
      email: siteConfig.email,
      jobTitle: 'Frontend Developer',
      worksFor: {'@id': `${siteUrl}/#organization`},
      knowsAbout: [
        'Web development',
        'Frontend development',
        'UI design',
        'React',
        'Next.js',
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Informatics',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Leiden',
          addressCountry: 'NL',
        },
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {'@id': `${siteUrl}/#organization`},
      inLanguage: 'en-NL',
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteConfig.title,
      description: siteConfig.description,
      isPartOf: {'@id': `${siteUrl}/#website`},
      about: {'@id': `${siteUrl}/#person`},
      inLanguage: 'en-NL',
    },
  ],
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteShell content={siteContent}>{children}</SiteShell>
      </body>
    </html>
  )
}

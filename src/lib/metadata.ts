import type {Metadata} from 'next'
import {siteConfig, siteUrl} from '@/lib/site-config'

type PageMetaInput = {
  title: string
  description: string
  path: `/${string}` | '/'
}

export function buildPageMetadata({title, description, path}: PageMetaInput): Metadata {
  const url = path === '/' ? siteUrl : `${siteUrl}${path}`

  return {
    title: {absolute: title},
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

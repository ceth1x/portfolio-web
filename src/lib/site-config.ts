const DEFAULT_SITE_URL = 'https://boumandigital.com'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')

export const siteConfig = {
  name: 'FrontBlender',
  personName: 'Philippe Bouman',
  title: 'FrontBlender — Philippe Bouman · Frontend developer',
  description:
    'Portfolio of Philippe Bouman, founder of FrontBlender. Frontend developer and Informatics student in Leiden, Netherlands — web design, React, Next.js and interactive digital experiences.',
  keywords: [
    'FrontBlender',
    'Philippe Bouman',
    'frontend developer',
    'web developer',
    'portfolio',
    'Leiden',
    'Netherlands',
    'Next.js',
    'React',
    'web design',
    'Informatics',
  ],
  locale: 'en_NL',
  ogImage: '/media/bd-logo.png',
  email: 'boumanphilippe@gmail.com',
} as const

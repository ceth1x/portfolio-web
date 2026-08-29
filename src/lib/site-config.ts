const DEFAULT_SITE_URL = 'https://portfolio-web.vercel.app'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')

export const siteConfig = {
  name: 'Bouman Digital',
  personName: 'Philippe Bouman',
  title: 'Bouman Digital · Developer portfolio',
  description:
    'Bouman Digital — portfolio by Philippe Bouman. Frontend developer and HBO Informatica student in Leiden, Netherlands. Web design, React, Next.js and interactive digital experiences.',
  keywords: [
    'Bouman Digital',
    'Philippe Bouman',
    'frontend developer',
    'web developer',
    'portfolio',
    'Leiden',
    'Netherlands',
    'Next.js',
    'React',
    'web design',
    'HBO Informatica',
  ],
  locale: 'en_NL',
  ogImage: '/media/bd-logo.png',
  email: 'boumanphilippe@gmail.com',
} as const

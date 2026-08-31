const DEFAULT_SITE_URL = 'https://frontblender.com'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '')

export const siteConfig = {
  name: 'FrontBlender',
  personName: 'Philippe Bouman',
  title: 'FrontBlender — Web Design & Development',
  description:
    'FrontBlender creates distinctive, high-performance websites for clients in the Netherlands — combining thoughtful design, modern development and seamless user experiences.',
  keywords: [
    'FrontBlender',
    'web design',
    'website development',
    'custom websites',
    'web developer Netherlands',
    'website designer',
    'frontend development',
    'responsive web design',
    'Philippe Bouman',
    'Leiden',
    'Netherlands',
    'Next.js',
    'React',
  ],
  locale: 'en_NL',
  email: 'boumanphilippe@gmail.com',
  phone: '+31610279351',
  areaServed: 'Netherlands',
  services: [
    'Website design',
    'Website development',
    'Custom websites',
    'UI design',
    'Frontend development',
    'Responsive web design',
  ],
} as const

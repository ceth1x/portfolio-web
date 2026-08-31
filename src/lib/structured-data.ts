import {siteConfig, siteUrl} from '@/lib/site-config'

const organizationId = `${siteUrl}/#organization`
const personId = `${siteUrl}/#person`
const websiteId = `${siteUrl}/#website`

export const globalStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': organizationId,
      name: siteConfig.name,
      url: siteUrl,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      description: siteConfig.description,
      areaServed: {
        '@type': 'Country',
        name: siteConfig.areaServed,
      },
      founder: {'@id': personId},
      serviceType: siteConfig.services,
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: siteConfig.personName,
      url: `${siteUrl}/about`,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      jobTitle: 'Web Designer & Frontend Developer',
      worksFor: {'@id': organizationId},
      knowsAbout: [
        'Web design',
        'Website development',
        'UI design',
        'Frontend development',
        'Responsive design',
        'React',
        'Next.js',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: siteUrl,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {'@id': organizationId},
      inLanguage: 'en-NL',
    },
  ],
}

type WebPageInput = {
  path: `/${string}` | '/'
  title: string
  description: string
  pageId: string
}

function webPageNode({path, title, description, pageId}: WebPageInput) {
  const url = path === '/' ? siteUrl : `${siteUrl}${path}`
  return {
    '@type': 'WebPage',
    '@id': pageId,
    url,
    name: title,
    description,
    isPartOf: {'@id': websiteId},
    about: {'@id': organizationId},
    inLanguage: 'en-NL',
  }
}

export function homePageStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        path: '/',
        title: siteConfig.title,
        description: siteConfig.description,
        pageId: `${siteUrl}/#webpage`,
      }),
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
        ],
      },
    ],
  }
}

export function aboutPageStructuredData() {
  const url = `${siteUrl}/about`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#webpage`,
        url,
        name: `About ${siteConfig.name}`,
        description:
          'About Philippe Bouman — web designer and developer behind FrontBlender, based in the Netherlands.',
        isPartOf: {'@id': websiteId},
        mainEntity: {'@id': personId},
        inLanguage: 'en-NL',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Home', item: siteUrl},
          {'@type': 'ListItem', position: 2, name: 'About', item: url},
        ],
      },
    ],
  }
}

export function workPageStructuredData() {
  const url = `${siteUrl}/work`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageNode({
        path: '/work',
        title: `Work — Custom Websites · ${siteConfig.name}`,
        description:
          'Selected web design and development work by FrontBlender — custom websites, UI and frontend development.',
        pageId: `${url}#webpage`,
      }),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Home', item: siteUrl},
          {'@type': 'ListItem', position: 2, name: 'Work', item: url},
        ],
      },
    ],
  }
}

export function contactPageStructuredData() {
  const url = `${siteUrl}/contact`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${url}#webpage`,
        url,
        name: `Contact ${siteConfig.name}`,
        description:
          'Start a web design or development project with FrontBlender. Get in touch to discuss your website.',
        isPartOf: {'@id': websiteId},
        about: {'@id': organizationId},
        inLanguage: 'en-NL',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {'@type': 'ListItem', position: 1, name: 'Home', item: siteUrl},
          {'@type': 'ListItem', position: 2, name: 'Contact', item: url},
        ],
      },
    ],
  }
}

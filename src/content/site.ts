/**
 * Portfolio content — projects.items stays empty until real completed work is ready.
 */

export type Project = {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  accent: 'amber' | 'cyan' | 'violet' | 'rose' | 'sage' | 'pearl'
  image?: string
  featured?: boolean
}

export type SiteContent = {
  brand: {
    name: string
    line1: string
    line2: string
  }
  person: {
    name: string
    firstName: string
    lastName: string
    age: number
    role: string
  }
  contact: {
    email: string
    phone: string
    phoneDisplay: string
  }
  opening: {
    videoSrc: string
    posterSrc: string
  }
  portrait: string
  projects: {
    items: Project[]
  }
  seo: {
    title: string
    description: string
  }
  footer: {
    text: string
  }
}

export const siteContent: SiteContent = {
  brand: {
    name: 'Bouman Digital',
    line1: 'Bouman',
    line2: 'Digital',
  },
  person: {
    name: 'Philippe Bouman',
    firstName: 'Philippe',
    lastName: 'Bouman',
    age: 19,
    role: 'HBO Informatica · Leiden',
  },
  contact: {
    email: 'boumanphilippe@gmail.com',
    phone: '+31610279351',
    phoneDisplay: '+31 6 10279351',
  },
  opening: {
    videoSrc: '/media/process-cinema.mp4',
    posterSrc: '/media/process-poster.jpg',
  },
  portrait: '/media/philippe.jpg',
  projects: {
    items: [],
  },
  footer: {
    text: 'Designing & building digital experiences.',
  },
  seo: {
    title: 'Bouman Digital · Developer portfolio',
    description:
      'Bouman Digital — portfolio by Philippe Bouman. 19, HBO Informatica student in Leiden. Frontend, web design and interactive digital experiences.',
  },
}

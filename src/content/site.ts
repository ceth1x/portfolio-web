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
  footer: {
    text: string
    location: string
  }
  hero: {
    lead: string
  }
}

export const siteContent: SiteContent = {
  brand: {
    name: 'FrontBlender',
    line1: 'Front',
    line2: 'Blender',
  },
  person: {
    name: 'Philippe Bouman',
    firstName: 'Philippe',
    lastName: 'Bouman',
    age: 19,
    role: 'Web design & development · Netherlands',
  },
  contact: {
    email: 'boumanphilippe@gmail.com',
    phone: '+31610279351',
    phoneDisplay: '+31 6 10279351',
  },
  opening: {
    videoSrc: '/media/process-cinema.mp4',
    posterSrc: '/media/opening-poster.jpg',
  },
  portrait: '/media/philippe.jpg',
  projects: {
    items: [],
  },
  footer: {
    text: 'Web design & development for distinctive brands.',
    location: 'Netherlands',
  },
  hero: {
    lead:
      'I\'m Philippe, founder of FrontBlender. I design and build custom websites for clients in the Netherlands — combining thoughtful design, modern development and polished user experiences.',
  },
}

import Link from 'next/link'
import type {SiteContent} from '@/content/site'

type Props = {
  content: SiteContent
}

export function SiteFooter({content}: Props) {
  const {brand, contact, footer, person} = content
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-name">{brand.name}</p>
            <p className="footer-role">{footer.text}</p>
            <p className="footer-meta">{footer.location}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/about">About</Link>
            <Link href="/work">Explore my work</Link>
            <Link href="/contact">Start a project</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {person.name} · {brand.name}
          </p>
          <a className="footer-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>
      </div>
    </footer>
  )
}

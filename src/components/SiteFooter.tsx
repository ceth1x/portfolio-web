import Link from 'next/link'
import type {SiteContent} from '@/content/site'

type Props = {
  content: SiteContent
}

export function SiteFooter({content}: Props) {
  const {person, footer} = content
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-top">
          <div className="footer-brand-block">
            <p className="footer-name">{person.name}</p>
            <p className="footer-role">{footer.text}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/about">About</Link>
            <Link href="/work">Work</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {person.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

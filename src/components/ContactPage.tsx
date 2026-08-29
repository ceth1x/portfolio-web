import type {SiteContent} from '@/content/site'
import {ContactForm} from '@/components/ContactForm'

type Props = {
  content: SiteContent
}

export function ContactPage({content}: Props) {
  const {person, contact} = content
  const mailto = `mailto:${contact.email}`
  const tel = `tel:${contact.phone}`

  return (
    <main id="main" className="page-main">
      <section className="page-hero page-hero-contact">
        <div className="wrap contact-layout">
          <p className="about-index">Contact</p>
          <h1 className="display-lg contact-title">
            Have an idea?
            <br />
            Let&apos;s build
            <br />
            something.
          </h1>
          <div className="about-rule" aria-hidden="true" />
          <p className="lead contact-lead">
            Whether you have a project in mind, want to work together, or simply want to say hello —
            I&apos;d be happy to hear from you.
          </p>

          <div className="contact-details">
            <a className="contact-detail" href={mailto}>
              <span className="contact-detail-label">Email</span>
              <span className="contact-detail-value">{contact.email}</span>
            </a>
            <a className="contact-detail" href={tel}>
              <span className="contact-detail-label">Phone</span>
              <span className="contact-detail-value">{contact.phoneDisplay}</span>
            </a>
          </div>

          <ContactForm />

          <p className="meta-line contact-signoff-name">{person.name}</p>
          <p className="meta-line">Designing &amp; building digital experiences.</p>
        </div>
      </section>
    </main>
  )
}

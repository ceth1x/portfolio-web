import type {SiteContent} from '@/content/site'
import {ContactForm} from '@/components/ContactForm'

type Props = {
  content: SiteContent
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5h11v7h-11v-7Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M3 5.25 8 8.75l5-3.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.75 2.75h2l1 2.5-1.25.75a6.25 6.25 0 0 0 2.5 2.5l.75-1.25 2.5 1v2a1.25 1.25 0 0 1-1.25 1.25A9.75 9.75 0 0 1 3.5 4A1.25 1.25 0 0 1 4.75 2.75Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M10 2 5 10h4l-1 6 5-8H9l1-6Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2.5 3.75 4.75V9c0 3.1 2.25 5.35 5.25 6.25C12 14.35 14.25 12.1 14.25 9V4.75L9 2.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 9 15 3l-2.25 6L15 15l-6-2.25L3 9Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ContactPage({content}: Props) {
  const {brand, contact} = content
  const mailto = `mailto:${contact.email}`
  const tel = `tel:${contact.phone}`

  return (
    <main id="main" className="page-main">
      <section className="page-hero page-hero-contact">
        <div className="wrap contact-page">
          <header className="contact-hero">
            <p className="eyebrow">Start a project</p>
            <h1 className="display-lg contact-hero-title">Let&apos;s build something great.</h1>
            <p className="lead contact-hero-lead">
              {brand.name} designs and builds custom websites for clients in the Netherlands. Tell me
              about your project — I&apos;m available for new web design and development work.
            </p>

            <div className="contact-quick-links">
              <a className="contact-quick-link" href={mailto}>
                <IconMail />
                <span>{contact.email}</span>
              </a>
              <span className="contact-quick-divider" aria-hidden="true" />
              <a className="contact-quick-link" href={tel}>
                <IconPhone />
                <span>{contact.phoneDisplay}</span>
              </a>
            </div>
          </header>

          <div className="contact-panel">
            <div className="contact-panel-form">
              <ContactForm />
            </div>

            <aside className="contact-panel-aside" aria-label="What to expect">
              <p className="contact-aside-title">I usually respond within 24 hours.</p>
              <p className="contact-aside-copy">
                Whether you need a new website, a redesign or help bringing an idea to life — share a
                few details and we can explore whether {brand.name} is the right fit.
              </p>

              <ul className="contact-benefits">
                <li>
                  <span className="contact-benefit-icon">
                    <IconBolt />
                  </span>
                  <span className="contact-benefit-copy">
                    <strong>Fast response</strong>
                    <span>I aim to reply within one business day.</span>
                  </span>
                </li>
                <li>
                  <span className="contact-benefit-icon">
                    <IconShield />
                  </span>
                  <span className="contact-benefit-copy">
                    <strong>Professional &amp; reliable</strong>
                    <span>Clear communication and commitment.</span>
                  </span>
                </li>
                <li>
                  <span className="contact-benefit-icon">
                    <IconSend />
                  </span>
                  <span className="contact-benefit-copy">
                    <strong>Open to new ideas</strong>
                    <span>Let&apos;s create something meaningful.</span>
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

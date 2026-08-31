'use client'

import Image from 'next/image'
import type {SiteContent} from '@/content/site'
import {Reveal} from '@/components/motion/Reveal'

type Props = {
  content: SiteContent
}

/**
 * Mobile homepage — normal document flow with subtle scroll reveals.
 * Keeps artistic typography and spacing without sticky chapter crossfades.
 */
export function JourneyMobileFlow({content}: Props) {
  const {brand, contact, portrait, projects} = content
  const featured = projects.items.filter((p) => p.featured && p.image).slice(0, 3)

  return (
    <div className="journey-mobile-flow" aria-label="Portfolio">
      <section className="section journey-mobile-section" id="top">
        <div className="wrap">
          <Reveal>
            <p className="name-stack">
              <span>{brand.line1}</span>
              <span>{brand.line2}</span>
            </p>
            <h1 className="display-xl">
              I build
              <br />
              digital
              <br />
              experiences.
            </h1>
            <p className="lead">
              I&apos;m Philippe, a 19-year-old developer and Informatics student in Leiden. I combine
              development and design to turn ideas into polished, interactive websites.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/work">
                View my work
              </a>
              <a className="btn btn-secondary" href="/contact">
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="about">
        <div className="wrap">
          <Reveal>
            <figure className="journey-mobile-portrait">
              <div className="journey-portrait-frame">
                <Image
                  src={portrait}
                  alt=""
                  width={480}
                  height={640}
                  className="journey-portrait-img"
                  sizes="46vw"
                />
              </div>
            </figure>
            <p className="eyebrow">About</p>
            <h2 className="display-lg">
              Curious by nature.
              <br />
              Focused on creating.
            </h2>
            <p className="lead">
              I&apos;ve always been interested in understanding how things work and figuring out how
              to make them better.
            </p>
            <p className="lead">
              From programming and problem-solving to visual design, I enjoy taking something from an
              idea to something people can actually use.
            </p>
            <p className="meta-line">Currently studying Informatics in Leiden.</p>
            <p className="meta-line">Completed part of Harvard&apos;s CS50x course.</p>
            <a className="text-cta" href="/about">
              More about me →
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="craft">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Craft</p>
            <h2 className="display-lg">
              Design ×
              <br />
              Development
            </h2>
            <p className="lead">I enjoy working where design and technology meet.</p>
            <div className="craft-list">
              <div>
                <h3>Web development</h3>
                <p>
                  Responsive websites built with modern frontend technologies and a strong focus on
                  performance and usability.
                </p>
              </div>
              <div>
                <h3>UI &amp; visual design</h3>
                <p>
                  Clean, thoughtful interfaces where typography, composition, color and motion work
                  together.
                </p>
              </div>
              <div>
                <h3>Interactive experiences</h3>
                <p>
                  Animations and interactions that make a website feel engaging without getting in
                  the way.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="approach">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Approach</p>
            <h2 className="display-lg">
              Start with an idea.
              <br />
              Build something real.
            </h2>
            <p className="lead">
              I like solving problems by breaking them down, experimenting with different approaches
              and turning the best idea into something tangible.
            </p>
            <p className="lead">
              I care about more than just making something work. The details matter — how it feels,
              how it moves, how it responds and how naturally someone can use it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="work">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Portfolio</p>
            <h2 className="display-lg">
              Selected
              <br />
              work
            </h2>
            <p className="lead">
              {featured.length > 0
                ? "A selection of projects I've designed and built."
                : 'New projects will appear here as they are completed.'}
            </p>
          </Reveal>
          {featured.length > 0 ? (
            <div className="journey-mobile-projects">
              {featured.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.04}>
                  <article className={`journey-project accent-${project.accent}`}>
                    <div className="journey-project-visual journey-mobile-project-visual">
                      <Image
                        src={project.image!}
                        alt=""
                        width={800}
                        height={450}
                        className="journey-project-image"
                        sizes="100vw"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="journey-project-meta">
                      <p className="project-subtitle">{project.subtitle}</p>
                      <h3>{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
              <a className="text-cta" href="/work">
                View all work →
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section journey-mobile-section" id="learning">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Growth</p>
            <h2 className="display-lg">
              Still learning.
              <br />
              Always building.
            </h2>
            <p className="lead">
              I&apos;m at the beginning of my journey in technology, and that&apos;s something I
              embrace.
            </p>
            <p className="lead">
              Every project is a chance to learn something new — a technology, a better way to solve a
              problem, or a clearer approach to design.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="tools">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Stack</p>
            <h2 className="display-lg">
              Tools &amp;
              <br />
              technologies
            </h2>
            <div className="tools-grid">
              <div>
                <h3>Development</h3>
                <p>HTML · CSS · JavaScript · TypeScript · React · Next.js · Git</p>
              </div>
              <div>
                <h3>Design</h3>
                <p>UI design · Responsive design · Typography · Motion</p>
              </div>
              <div>
                <h3>Currently learning</h3>
                <p>Computer science · Software development · Modern web technologies</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section journey-mobile-section" id="contact">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="display-lg">
              Have an idea?
              <br />
              Let&apos;s build something.
            </h2>
            <p className="lead">
              Whether you have a project in mind, want to work together, or simply want to say hello
              — I&apos;d be happy to hear from you.
            </p>
            <div className="contact-details contact-details-compact">
              <a className="contact-detail" href={`mailto:${contact.email}`}>
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-value">{contact.email}</span>
              </a>
              <a className="contact-detail" href={`tel:${contact.phone}`}>
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-value">{contact.phoneDisplay}</span>
              </a>
            </div>
            <a className="text-cta" href="/contact">
              Contact page →
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

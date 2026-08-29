import Image from 'next/image'
import Link from 'next/link'
import type {SiteContent} from '@/content/site'

type Props = {
  content: SiteContent
}

export function AboutPage({content}: Props) {
  const {person, portrait} = content

  return (
    <main id="main" className="page-main about-page">
      <section className="about-hero">
        <div className="wrap about-hero-grid">
          <div className="about-hero-copy">
            <p className="about-index">01 — About</p>
            <h1 className="display-lg about-title">
              Curious by nature.
              <br />
              Focused on creating.
            </h1>
            <div className="about-rule" aria-hidden="true" />
            <p className="lead">
              I&apos;m {person.firstName}, a {person.age}-year-old developer and HBO Informatica
              student based in the Netherlands. I combine development and design to turn ideas into
              polished, interactive websites.
            </p>
          </div>

          <figure className="portrait-frame portrait-frame-lg">
            <div className="portrait-frame-inner">
              <Image
                src={portrait}
                alt={`${person.name} on a coastal trail`}
                width={768}
                height={1024}
                className="portrait-img"
                sizes="(max-width: 768px) 85vw, 420px"
                priority
              />
            </div>
            <figcaption className="portrait-caption">
              <span>{person.name}</span>
              <span>{person.role}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-block">
        <div className="wrap about-editorial">
          <div className="about-editorial-rail" aria-hidden="true" />
          <div className="about-editorial-body">
            <p className="about-label">Background</p>
            <p className="lead">
              I&apos;ve always been interested in understanding how things work and figuring out how
              to make them better.
            </p>
            <p className="lead">
              From programming and problem-solving to visual design, I enjoy taking something from an
              idea to something people can actually use.
            </p>
            <div className="about-meta-row">
              <p className="meta-line">Currently studying HBO Informatica in Leiden.</p>
              <p className="meta-line">Completed part of Harvard&apos;s CS50x course.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-block">
        <div className="wrap about-editorial about-editorial-shift">
          <div className="about-editorial-rail" aria-hidden="true" />
          <div className="about-editorial-body">
            <p className="about-label">Approach</p>
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
            <p className="about-outline-line">How it works. And how it feels.</p>
          </div>
        </div>
      </section>

      <section className="about-block about-block-end">
        <div className="wrap about-editorial">
          <div className="about-editorial-rail" aria-hidden="true" />
          <div className="about-editorial-body">
            <p className="about-label">Craft</p>
            <h2 className="display-lg">
              Design ×
              <br />
              Development
            </h2>
            <p className="lead">I enjoy working where design and technology meet.</p>
            <div className="about-craft">
              <div className="about-craft-item">
                <span className="about-craft-num">01</span>
                <div>
                  <h3>Web development</h3>
                  <p>
                    Responsive websites built with modern frontend technologies and a strong focus on
                    performance and usability.
                  </p>
                </div>
              </div>
              <div className="about-craft-item">
                <span className="about-craft-num">02</span>
                <div>
                  <h3>UI &amp; visual design</h3>
                  <p>
                    Clean, thoughtful interfaces where typography, composition, color and motion work
                    together.
                  </p>
                </div>
              </div>
              <div className="about-craft-item">
                <span className="about-craft-num">03</span>
                <div>
                  <h3>Interactive experiences</h3>
                  <p>
                    Animations and interactions that make a website feel engaging without getting in
                    the way.
                  </p>
                </div>
              </div>
            </div>
            <div className="cta-row">
              <Link href="/work" className="text-cta">
                View my work
              </Link>
              <Link href="/contact" className="text-cta text-cta-muted">
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

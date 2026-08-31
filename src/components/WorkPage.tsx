import Image from 'next/image'
import Link from 'next/link'
import type {SiteContent} from '@/content/site'

type Props = {
  content: SiteContent
}

export function WorkPage({content}: Props) {
  const {brand, projects} = content
  const items = projects.items

  return (
    <main id="main" className="page-main">
      <section className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Portfolio</p>
          <h1 className="display-lg">
            Selected
            <br />
            work
          </h1>
          <p className="lead">
            {items.length > 0
              ? `A selection of websites and digital work designed and built by ${brand.name}.`
              : `${brand.name} creates custom websites with a focus on design, performance and usability. New case studies will appear here as projects are completed.`}
          </p>
        </div>
      </section>

      <section className="page-section page-section-end">
        {items.length > 0 ? (
          <div className="wrap work-list">
            {items.map((project) => (
              <article key={project.id} className={`work-case accent-${project.accent}`}>
                {project.image ? (
                  <div className="work-visual">
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.subtitle}`}
                      fill
                      className="work-image"
                      sizes="(max-width: 900px) 88vw, 960px"
                      quality={78}
                    />
                  </div>
                ) : null}
                <div className="work-meta">
                  <p className="project-subtitle">{project.subtitle}</p>
                  <h2>{project.title}</h2>
                  <p className="project-description">{project.description}</p>
                  <ul className="project-tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wrap prose-narrow work-empty">
            <p className="lead">
              I work on website design, UI and frontend development — from first concept to a
              polished, responsive site ready to launch.
            </p>
            <p className="lead muted">
              If you&apos;re looking for a custom website in the Netherlands, I&apos;d love to hear
              about your project.
            </p>
          </div>
        )}
        <div className="wrap prose-narrow work-footer-cta">
          <Link href="/contact" className="text-cta">
            Start a project →
          </Link>
        </div>
      </section>
    </main>
  )
}

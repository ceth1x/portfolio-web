import Image from 'next/image'
import Link from 'next/link'
import type {SiteContent} from '@/content/site'

type Props = {
  content: SiteContent
}

export function WorkPage({content}: Props) {
  const {projects} = content
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
              ? "A selection of projects I've designed and built."
              : 'New projects will appear here as they are completed.'}
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
                      alt=""
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
          <div className="wrap prose-narrow">
            <p className="lead muted">No projects listed yet.</p>
          </div>
        )}
        <div className="wrap prose-narrow work-footer-cta">
          <Link href="/contact" className="text-cta">
            Get in touch →
          </Link>
        </div>
      </section>
    </main>
  )
}

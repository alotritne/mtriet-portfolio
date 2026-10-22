import { ArrowUpRight, ChevronDown, FolderCode } from 'lucide-react'
import type { Project, Locale } from '../types'
import type { ReturnTypeCopy } from '../utility-types'

export function ProjectCase({ project, locale, copy, index, headingLevel = 3 }: { project: Project; locale: Locale; copy: ReturnTypeCopy; index: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="portfolio-project-card">
      <header><div className="project-card-eyebrow"><span>{String(index + 1).padStart(2, '0')}</span><FolderCode size={20} aria-hidden="true" /></div><Heading>{project.name}</Heading><p>{project.problem[locale]}</p></header>
      <details className="project-disclosure"><summary>{locale === 'vi' ? 'Chi tiết kỹ thuật' : 'Technical details'}<ChevronDown size={16} aria-hidden="true" /></summary><div className="project-content">
        <div><span>{copy.approach}</span><p>{project.approach[locale]}</p></div>
        <div><span>{copy.features}</span>{project.features.length ? <ul>{project.features.map(feature => <li key={feature[locale]}>{feature[locale]}</li>)}</ul> : <p>{copy.unavailable}</p>}</div>
      </div></details>
      <div className="project-card-footer"><div>{project.stack.length ? project.stack.map(item => <span key={item}>{item}</span>) : <span>{copy.unavailable}</span>}</div>{project.repository ? <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`${copy.openRepo}: ${project.name}`}><ArrowUpRight aria-hidden="true" /></a> : <span>{copy.repository}: {copy.unavailable}</span>}</div>
    </article>
  )
}

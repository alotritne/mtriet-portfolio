import { ArrowUpRight } from 'lucide-react'
import type { Project, Locale } from '../types'
import type { ReturnTypeCopy } from '../utility-types'

export function ProjectCase({ project, locale, copy, index }: { project: Project; locale: Locale; copy: ReturnTypeCopy; index: number }) {
  return (
    <article className="portfolio-project-card">
      <header><span>0{index + 1}</span><h3>{project.name}</h3><p>{project.problem[locale]}</p></header>
      <div className="project-content">
        <div><span>{copy.approach}</span><p>{project.approach[locale]}</p></div>
        <div><span>{copy.features}</span>{project.features.length ? <ul>{project.features.map(feature => <li key={feature[locale]}>{feature[locale]}</li>)}</ul> : <p>{copy.unavailable}</p>}</div>
      </div>
      <div className="project-card-footer"><div>{project.stack.length ? project.stack.map(item => <span key={item}>{item}</span>) : <span>{copy.unavailable}</span>}</div>{project.repository ? <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`${copy.openRepo}: ${project.name}`}><ArrowUpRight aria-hidden="true" /></a> : <span>{copy.repository}: {copy.unavailable}</span>}</div>
    </article>
  )
}

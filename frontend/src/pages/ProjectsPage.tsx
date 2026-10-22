import { useEffect, useState } from 'react'
import { ArrowUpRight, FolderSearch, Search, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { getCopy, profile, projects as fallbackProjects } from '../data'
import { portfolioApi } from '../lib/api'
import { useLocale } from '../hooks/useLocale'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal, ScrollProgress } from '../components/PageMotion'
import { ProjectCase } from '../components/ProjectCase'
import { otherRepositories, projectCopy } from '../projects/copy'

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

export default function ProjectsPage() {
  const [locale, setLocale] = useLocale()
  const [projects, setProjects] = useState(fallbackProjects)
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '')
  const [technology, setTechnology] = useState(() => new URLSearchParams(location.search).get('tech') || '')
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [attempt, setAttempt] = useState(0)
  const reduce = useReducedMotion()
  const copy = projectCopy[locale]
  useEffect(() => { document.title = `${copy.label} — ${profile.name}` }, [copy.label])
  useEffect(() => {
    let active = true
    setStatus('loading')
    portfolioApi.publicProjects().then(items => { if (active) { setProjects(items.length ? items : fallbackProjects); setStatus('ready') } }).catch(() => { if (active) setStatus('fallback') })
    return () => { active = false }
  }, [attempt])
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (technology) params.set('tech', technology)
    window.history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`)
  }, [query, technology])
  const technologies = [...new Set(projects.flatMap(project => project.stack))].sort()
  const visible = projects.filter(project => (!technology || project.stack.includes(technology)) && normalize(`${project.name} ${project.problem[locale]} ${project.stack.join(' ')}`).includes(normalize(query.trim())))
  const clear = () => { setQuery(''); setTechnology('') }
  return <div className="portfolio-page catalog-page" id="top"><a className="skip-link" href="#main">{locale === 'vi' ? 'Đến nội dung' : 'Skip to content'}</a><ScrollProgress /><SiteHeader locale={locale} setLocale={setLocale} current="projects" />
    <main id="main" className="portfolio-shell catalog-main">
      <header className="catalog-heading page-enter"><p className="catalog-eyebrow">01 / {copy.label}</p><h1>{copy.title}</h1><div className="catalog-lead"><p>{copy.intro}</p><a href="/blog" className="catalog-cross-link">Blog<ArrowUpRight aria-hidden="true" size={18} /></a></div></header>
      <section aria-label={copy.label}>
        <div className="catalog-toolbar"><label className="catalog-search"><span>{copy.search}</span><div><Search size={18} aria-hidden="true" /><input type="search" value={query} maxLength={100} placeholder={copy.placeholder} onChange={event => setQuery(event.target.value)} /></div></label><label className="catalog-select"><span>{copy.technology}</span><select value={technology} onChange={event => setTechnology(event.target.value)}><option value="">{copy.all}</option>{technology && !technologies.includes(technology) && <option value={technology}>{technology}</option>}{technologies.map(item => <option key={item}>{item}</option>)}</select></label></div>
        <div className="catalog-results"><p role="status">{String(visible.length).padStart(2, '0')} {copy.results}</p>{(query || technology) && <button onClick={clear}><X size={14} aria-hidden="true" />{copy.clear}</button>}</div>
        {status === 'fallback' && <p className="catalog-notice">{copy.fallback} <button onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button></p>}
        {status === 'loading' && <p className="catalog-notice" role="status">{copy.loading}</p>}
        {visible.length ? <div className="projects-grid catalog-projects"><AnimatePresence initial={false} mode="popLayout">{visible.map((project, index) => <motion.div key={project.id} layout={reduce ? false : 'position'} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.28 }}><Reveal delay={Math.min(index, 3) * 0.05}><ProjectCase headingLevel={2} project={project} index={index} locale={locale} copy={getCopy(locale)} /></Reveal></motion.div>)}</AnimatePresence></div>
          : <div className="catalog-empty"><FolderSearch size={32} aria-hidden="true" /><h2>{copy.empty}</h2><p>{copy.emptyBody}</p><button className="button" onClick={clear}>{copy.clear}</button></div>}
      </section>
      <Reveal className="catalog-repositories"><div><p className="catalog-eyebrow">GitHub</p><h2>{copy.other}</h2><p>{copy.otherBody}</p></div><div>{otherRepositories.map(repo => <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer"><span>{repo.name}</span><ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only">{copy.repo}</span></a>)}</div></Reveal>
      <Reveal><a className="catalog-next" href="/blog"><div><p className="catalog-eyebrow">{copy.next}</p><h2>{copy.blog}</h2><p>{copy.blogBody}</p></div><ArrowUpRight size={32} aria-hidden="true" /></a></Reveal>
    </main><SiteFooter locale={locale} /></div>
}

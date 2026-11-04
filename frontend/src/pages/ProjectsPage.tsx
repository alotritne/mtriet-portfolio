import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Braces, Database, Hand, Search, Server, X } from 'lucide-react'
import { profile, projects as fallbackProjects } from '../data'
import { portfolioApi } from '../lib/api'
import { useLocale } from '../hooks/useLocale'
import { otherRepositories, projectCopy } from '../projects/copy'
import { CatalogLayout } from '../portfolio/CatalogLayout'
import { sortProjects } from '../portfolio/projectOrder'
import type { Locale, Project } from '../types'

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')

function artworkKind(project: Project) {
  const name = normalize(project.name)
  if (name.includes('smarthome') && name.includes('backend')) return 'backend'
  if (name.includes('smarthome') && name.includes('android')) return 'android'
  if (name.includes('vsign')) return 'vsign'
  return 'generic'
}

function ProjectArtwork({ project, number }: { project: Project; number: number }) {
  const kind = artworkKind(project)
  return <div className={`catalog-project-art art-${kind}`} aria-label={`Minh họa ${project.name}`}>
    <div className="catalog-art-grid" aria-hidden="true" />
    {kind === 'backend' && <div className="catalog-flow-art" aria-hidden="true">
      <div className="catalog-flow-top"><span><Server size={16} /> Sensor data</span><i /><span>MQTT</span></div>
      <div className="catalog-flow-center"><Braces size={32} /><div><strong>SmartHome API</strong><small>Node.js / Express</small></div></div>
      <div className="catalog-flow-lines" />
      <div className="catalog-flow-bottom"><span>JWT Auth</span><span>Prisma</span><span><Database size={13} /> MySQL</span></div>
    </div>}
    {kind === 'android' && <div className="catalog-phone-orbit" aria-hidden="true"><div className="catalog-phone">
      <div className="catalog-phone-notch" /><small>MyHome <span>●</span></small><p>Welcome home</p>
      <div className="catalog-phone-temperature">24°<small>Living room</small></div>
      <div className="catalog-phone-device"><span>☀ Lights</span><b>ON</b></div>
      <div className="catalog-phone-device"><span>◉ Security</span><b>ON</b></div>
    </div></div>}
    {kind === 'vsign' && <div className="catalog-sign-art" aria-hidden="true"><div className="catalog-sign-corners"><Hand size={108} strokeWidth={1} /><span className="catalog-scan-line" /></div><div className="catalog-sign-chain"><span>Camera</span><ArrowRight size={14} /><span>MediaPipe</span><ArrowRight size={14} /><span>LSTM</span></div></div>}
    {kind === 'generic' && <div className="catalog-generic-art" aria-hidden="true"><Braces size={116} strokeWidth={1} /><span>{project.name}</span></div>}
    <span className="catalog-art-caption">{String(number).padStart(2, '0')} / {kind === 'backend' ? 'System architecture' : kind === 'android' ? 'Mobile experience' : kind === 'vsign' ? 'Computer vision' : 'Software project'}</span>
  </div>
}

function ProjectCard({ project, number, locale }: { project: Project; number: number; locale: Locale }) {
  const hasRepo = !!project.repository && /^https?:\/\//i.test(project.repository)
  return <article className={`catalog-project-card ${number % 2 === 0 ? 'catalog-project-card-reverse' : ''}`}>
    <ProjectArtwork project={project} number={number} />
    <div className="catalog-project-details">
      <div className="catalog-card-kicker"><span>{String(number).padStart(2, '0')} / {locale === 'vi' ? 'Dự án' : 'Project'}</span><span>{project.stack.slice(0, 2).join(' / ') || 'Software'}</span></div>
      <h2>{project.name}</h2>
      <p className="catalog-project-description">{project.problem?.[locale] || project.approach?.[locale]}</p>
      {project.approach?.[locale] && <p className="catalog-project-approach">{project.approach[locale]}</p>}
      {project.stack.length > 0 && <div className="catalog-tech-tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>}
      {project.features.length > 0 && <details className="catalog-project-features"><summary>{locale === 'vi' ? 'Tính năng chính' : 'Key features'} <span aria-hidden="true">+</span></summary><ul>{project.features.map((feature, index) => <li key={index}>{feature[locale]}</li>)}</ul></details>}
      {hasRepo ? <a className="catalog-source-link" href={project.repository} target="_blank" rel="noopener noreferrer">{locale === 'vi' ? 'Xem mã nguồn' : 'View source'} <ArrowUpRight size={18} aria-hidden="true" /></a> : <span className="catalog-source-unavailable">{locale === 'vi' ? 'Chưa có mã nguồn công khai' : 'Source not public yet'}</span>}
    </div>
  </article>
}

export default function ProjectsPage() {
  const [locale, setLocale] = useLocale()
  const [projects, setProjects] = useState<Project[]>(() => sortProjects(fallbackProjects))
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '')
  const [technology, setTechnology] = useState(() => new URLSearchParams(location.search).get('tech') || '')
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [attempt, setAttempt] = useState(0)
  const copy = projectCopy[locale]

  useEffect(() => { document.title = `${copy.label} — ${profile.name}` }, [copy.label])
  useEffect(() => {
    let active = true
    setStatus('loading')
    portfolioApi.publicProjects()
      .then(items => { if (active) { setProjects(sortProjects(items)); setStatus('ready') } })
      .catch(() => { if (active) setStatus('fallback') })
    return () => { active = false }
  }, [attempt])
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (technology) params.set('tech', technology)
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`)
  }, [query, technology])

  const technologies = [...new Set(projects.flatMap(project => project.stack))].sort()
  const visible = projects.filter(project => (!technology || project.stack.includes(technology)) && normalize(`${project.name} ${project.problem?.[locale] || ''} ${project.approach?.[locale] || ''} ${project.stack.join(' ')}`).includes(normalize(query.trim())))
  const clear = () => { setQuery(''); setTechnology('') }

  return <CatalogLayout locale={locale} setLocale={setLocale} current="projects">
    <main className="catalog-main wrap" id="main">
      <header className="catalog-hero">
        <div className="catalog-hero-copy"><span className="catalog-eyebrow">01 / {copy.label}</span><h1>{locale === 'vi' ? <>Từ bài toán<br />đến <em>sản phẩm.</em></> : <>From a problem<br />to <em>a product.</em></>}</h1><p>{copy.intro}</p><a className="catalog-hero-link" href="/#work">{locale === 'vi' ? 'Dự án nổi bật' : 'Featured work'} <ArrowUpRight size={18} /></a></div>
        <div className="catalog-hero-art" aria-hidden="true"><div className="catalog-hero-blob" /><div className="catalog-hero-blob-inner" /><Braces size={54} strokeWidth={1.5} /></div>
      </header>
      <section aria-label={copy.label} className="catalog-section">
        <div className="catalog-toolbar">
          <label className="catalog-search"><span>{copy.search}</span><div><Search size={18} aria-hidden="true" /><input type="search" value={query} maxLength={100} placeholder={copy.placeholder} onChange={event => setQuery(event.target.value)} /></div></label>
          <label className="catalog-select"><span>{copy.technology}</span><select value={technology} onChange={event => setTechnology(event.target.value)}><option value="">{copy.all}</option>{technology && !technologies.includes(technology) && <option value={technology}>{technology}</option>}{technologies.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="catalog-results"><p role="status">{String(visible.length).padStart(2, '0')} {copy.results}</p>{(query || technology) && <button type="button" onClick={clear}><X size={14} />{copy.clear}</button>}</div>
        {status === 'fallback' && <p className="catalog-notice">{copy.fallback} <button onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button></p>}
        {status === 'loading' && <p className="catalog-notice" role="status">{copy.loading}</p>}
        {visible.length ? <div className="catalog-project-list">{visible.map((project, index) => <ProjectCard key={project.id} project={project} number={index + 1} locale={locale} />)}</div>
          : <div className="catalog-empty"><h2>{copy.empty}</h2><p>{copy.emptyBody}</p><button className="catalog-button" onClick={clear}>{copy.clear}</button></div>}
      </section>
      <section className="catalog-repositories" aria-label={copy.other}><div><span className="catalog-eyebrow">GitHub / 02</span><h2>{copy.other}</h2><p>{copy.otherBody}</p></div><div className="catalog-repo-list">{otherRepositories.map(repo => <a href={repo.url} key={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}<ArrowUpRight size={19} aria-hidden="true" /></a>)}</div></section>
      <a className="catalog-next" href="/blog"><span className="catalog-eyebrow">{copy.next}</span><span>{copy.blog}</span><ArrowUpRight size={31} aria-hidden="true" /></a>
    </main>
  </CatalogLayout>
}

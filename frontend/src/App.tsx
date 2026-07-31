import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Braces, Code2, Database, Mail, MapPin, Smartphone, Wrench } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ProjectCase } from './components/ProjectCase'
import { PortfolioTerminal } from './components/PortfolioTerminal'
import { TypingText } from './components/TypingText'
import { contactLinks, featuredProjects as fallbackProjects, getCopy, localizeSkillItem, profile, skillGroups } from './data'
import { portfolioApi } from './lib/api'
import type { Project } from './types'
import type { Locale } from './types'

function detectLocale(): Locale {
  const saved = localStorage.getItem('portfolio-locale')
  if (saved === 'vi' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

const skillIcons = [Braces, Code2, Database, Smartphone, Wrench]

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [locale, setLocaleState] = useState<Locale>(detectLocale)
  const [menuOpen, setMenuOpen] = useState(false)
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(fallbackProjects)
  const reduceMotion = useReducedMotion()
  const copy = getCopy(locale)
  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('portfolio-locale', next)
  }

  useEffect(() => { document.documentElement.lang = locale }, [locale])
  useEffect(() => { portfolioApi.publicProjects().then(items => { const featured = items.filter(item => item.featured !== false); if (featured.length) setFeaturedProjects(featured) }).catch(() => undefined) }, [])
  const heroGroup = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.065 } },
  }
  const heroItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const } },
  }
  const handlePagePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const page = pageRef.current
    if (!page || event.pointerType === 'touch') return
    page.style.setProperty('--pointer-x', `${event.clientX}px`)
    page.style.setProperty('--pointer-y', `${event.clientY}px`)
    const lightSurface = document.querySelector<HTMLElement>('.portfolio-skills')
    if (lightSurface) {
      const bounds = lightSurface.getBoundingClientRect()
      lightSurface.style.setProperty('--light-pointer-x', `${event.clientX - bounds.left}px`)
      lightSurface.style.setProperty('--light-pointer-y', `${event.clientY - bounds.top}px`)
    }
    document.querySelectorAll<HTMLElement>('.portfolio-project-card').forEach(card => {
      const bounds = card.getBoundingClientRect()
      card.style.setProperty('--card-pointer-x', `${event.clientX - bounds.left}px`)
      card.style.setProperty('--card-pointer-y', `${event.clientY - bounds.top}px`)
    })
  }
  return (
    <div ref={pageRef} className="portfolio-page" id="top" onPointerMove={handlePagePointerMove}>
      <header className="portfolio-nav">
        <a className="portfolio-logo" href="#top" aria-label={`${profile.name} — home`}>MTRIET<span>.</span></a>
        <nav className={menuOpen ? 'portfolio-links is-open' : 'portfolio-links'} aria-label={locale === 'vi' ? 'Điều hướng chính' : 'Primary navigation'}>
          {copy.nav.map((label, index) => <a key={label} href={`#${copy.navIds[index]}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="portfolio-nav-actions">
          <LanguageSwitcher locale={locale} setLocale={setLocale} />
          <button className="portfolio-menu" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? copy.close : copy.menu}</button>
        </div>
      </header>

      <main id="main">
        <section className="portfolio-hero portfolio-shell">
          <motion.div className="portfolio-hero-copy" variants={heroGroup} initial={reduceMotion ? false : 'hidden'} animate="visible">
            <motion.p variants={heroItem} className="portfolio-role">{profile.studentLabel[locale]} · {profile.location[locale]}</motion.p>
            <motion.h1 variants={heroItem} className="kinetic-name">
              <span className="kinetic-line"><span>{profile.nameLines[0]}</span></span>
              <span className="kinetic-line is-accent"><span>{profile.nameLines[1]}</span></span>
            </motion.h1>
            <motion.h2 variants={heroItem}><TypingText texts={profile.roles} /></motion.h2>
            <motion.p variants={heroItem} className="portfolio-summary">{copy.heroBody}</motion.p>
            <motion.div variants={heroItem} className="portfolio-cta"><a className="primary" href="#projects">{copy.viewProjects}<ArrowDown aria-hidden="true" /></a><a href={`mailto:${profile.email}`}>{copy.contact}<Mail aria-hidden="true" /></a></motion.div>
          </motion.div>
          <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}><PortfolioTerminal locale={locale} /></motion.div>
        </section>

        <section className="portfolio-section portfolio-about portfolio-shell" id="about">
          <header className="portfolio-section-head"><span>01</span><div><p>{copy.sectionLabels.about}</p><h2>{copy.aboutTitle}</h2></div></header>
          <div className="portfolio-about-grid"><p>{copy.aboutBody}</p><div><span>{copy.principle}</span>{copy.principles.map(item => <p key={item}>{item}</p>)}</div></div>
        </section>

        <section className="portfolio-section portfolio-skills" id="capabilities">
          <div className="portfolio-shell">
            <header className="portfolio-section-head"><span>02</span><div><p>{copy.sectionLabels.capabilities}</p><h2>{copy.capabilitiesTitle}</h2></div><p>{copy.capabilitiesBody}</p></header>
            <div className="skills-grid">{skillGroups.map((group, index) => { const Icon = skillIcons[index]; return <article key={group.key}><Icon aria-hidden="true" /><h3>{copy.groupLabels[group.key]}</h3><div>{group.items.map(item => <span key={item}>{localizeSkillItem(item, locale)}</span>)}</div></article> })}</div>
          </div>
        </section>

        <section className="portfolio-section portfolio-projects portfolio-shell" id="projects">
          <header className="portfolio-section-head"><span>03</span><div><p>{copy.sectionLabels.projects}</p><h2>{copy.projectsTitle}</h2></div><p>{copy.projectsBody}</p></header>
          <div className="projects-grid">{featuredProjects.map((project, index) => <ProjectCase key={project.id} project={project} locale={locale} copy={copy} index={index} />)}</div>
        </section>

        <section className="portfolio-contact portfolio-shell" id="contact">
          <div><p>04 / {copy.sectionLabels.contact}</p><h2>{copy.contactTitle}</h2></div>
          <div><p>{copy.contactBody}</p><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight aria-hidden="true" /></a></div>
        </section>
      </main>

      <footer className="portfolio-footer portfolio-shell">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <div>{contactLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.id === 'website' && <MapPin aria-hidden="true" />}{link.label}{link.id !== 'website' && <ArrowUpRight aria-hidden="true" />}</a>)}</div>
      </footer>
    </div>
  )
}

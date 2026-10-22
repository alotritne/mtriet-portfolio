import { useEffect, useState } from 'react'
import { ArrowUpRight, Braces, Code2, Database, Mail, Smartphone, Wrench } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { Reveal, ScrollProgress } from './components/PageMotion'
import { projectCopy } from './projects/copy'
import { ProjectCase } from './components/ProjectCase'
import { PortfolioTerminal } from './components/PortfolioTerminal'
import { TypingText } from './components/TypingText'
import { featuredProjects as fallbackProjects, getCopy, profile, skillGroups } from './data'
import { SkillBadge } from './components/SkillBadge'
import { BlogSection } from './blog/BlogList'
import { useLocale } from './hooks/useLocale'
import { portfolioApi } from './lib/api'
import type { Project } from './types'

const skillIcons = [Braces, Code2, Database, Smartphone, Wrench]

export default function App() {
  const [locale, setLocale] = useLocale()
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(fallbackProjects)
  const reduceMotion = useReducedMotion()
  const copy = getCopy(locale)
  useEffect(() => { portfolioApi.publicProjects().then(items => { const featured = items.filter(item => item.featured !== false); if (featured.length) setFeaturedProjects(featured) }).catch(() => undefined) }, [])
  const heroGroup = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.065 } },
  }
  const heroItem = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const } },
  }
  return (
    <div className="portfolio-page" id="top">
      <a className="skip-link" href="#main">{locale === 'vi' ? 'Đến nội dung' : 'Skip to content'}</a>
      <ScrollProgress /><SiteHeader locale={locale} setLocale={setLocale} current="home" />

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
            <motion.div variants={heroItem} className="portfolio-cta"><a className="primary" href="/projects">{copy.viewProjects}<ArrowUpRight aria-hidden="true" /></a><a href={`mailto:${profile.email}`}>{copy.contact}<Mail aria-hidden="true" /></a></motion.div>
          </motion.div>
          <motion.div initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}><PortfolioTerminal locale={locale} /></motion.div>
        </section>

        <motion.section initial={false} whileInView={reduceMotion ? {} : { y: [16, 0], opacity: [0.7, 1] }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="portfolio-section portfolio-about portfolio-shell" id="about">
          <header className="portfolio-section-head"><span>01</span><div><p>{copy.sectionLabels.about}</p><h2>{copy.aboutTitle}</h2></div></header>
          <div className="portfolio-about-grid"><p>{copy.aboutBody}</p><div><span>{copy.principle}</span>{copy.principles.map(item => <p key={item}>{item}</p>)}</div></div>
        </motion.section>

        <section className="portfolio-section portfolio-skills" id="capabilities">
          <div className="portfolio-shell">
            <Reveal><header className="portfolio-section-head"><span>02</span><div><p>{copy.sectionLabels.capabilities}</p><h2>{copy.capabilitiesTitle}</h2></div><p>{copy.capabilitiesBody}</p></header></Reveal>
            <div className="skills-grid">{skillGroups.map((group, index) => { const Icon = skillIcons[index]; return <motion.article key={group.key} initial={false} whileInView={reduceMotion ? {} : { y: [18, 0], opacity: [0.65, 1] }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, delay: index * 0.05 }}><div className="skill-group-heading"><div className="skill-group-icon"><Icon aria-hidden="true" /></div><span className="skill-group-number">{String(index + 1).padStart(2, '0')}</span></div><h3>{copy.groupLabels[group.key]}</h3><div className="skill-items">{group.items.map(item => <SkillBadge key={item} name={item} locale={locale} />)}</div></motion.article> })}</div>
          </div>
        </section>

        <section className="portfolio-section portfolio-projects portfolio-shell" id="projects">
          <Reveal><header className="portfolio-section-head"><span>03</span><div><p>{copy.sectionLabels.projects}</p><h2>{copy.projectsTitle}</h2></div><p>{copy.projectsBody}</p></header></Reveal>
          <div className="projects-grid">{featuredProjects.slice(0, 3).map((project, index) => <Reveal key={project.id} delay={index * 0.06}><ProjectCase project={project} locale={locale} copy={copy} index={index} /></Reveal>)}</div>
          <a className="blog-all" href="/projects">{projectCopy[locale].allProjects}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>

        <BlogSection locale={locale} />

        <section className="portfolio-contact portfolio-shell" id="contact">
          <Reveal className="contact-reveal"><div><p>05 / {copy.sectionLabels.contact}</p><h2>{copy.contactTitle}</h2></div></Reveal>
          <Reveal className="contact-reveal" delay={0.08}><div><p>{copy.contactBody}</p><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight aria-hidden="true" /></a></div></Reveal>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  )
}

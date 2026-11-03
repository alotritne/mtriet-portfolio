import { useEffect, useState } from 'react'
import { ArrowUpRight, Braces, Code2, Database, Mail, Smartphone, Wrench } from 'lucide-react'
import { motion } from 'motion/react'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { Reveal, ScrollProgress } from './components/PageMotion'
import { projectCopy } from './projects/copy'
import { ProjectCase } from './components/ProjectCase'
import { PortfolioTerminal } from './components/PortfolioTerminal'
import { TypingText } from './components/TypingText'
import { featuredProjects as fallbackProjects, getCopy } from './data'
import { defaultSite } from './siteDefaults'
import { TechMarquee, MorphingLoop, MotionSwitch } from './components/LiveMotion'
import { SkillBadge } from './components/SkillBadge'
import { BlogSection } from './blog/BlogList'
import { useLocale } from './hooks/useLocale'
import { useMotionEnabled } from './hooks/useMotionPreference'
import { portfolioApi } from './lib/api'
import type { Project, SiteData } from './types'

const skillIcons = [Braces, Code2, Database, Smartphone, Wrench]

export default function App() {
  const [locale, setLocale] = useLocale()
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(fallbackProjects)
  const [site, setSite] = useState<SiteData>(defaultSite)
  const reduceMotion = !useMotionEnabled()
  const copy = getCopy(locale)
  useEffect(() => {
    portfolioApi.publicProjects().then(items => setFeaturedProjects(items.filter(item => item.featured !== false))).catch(() => undefined)
    portfolioApi.publicSite().then(data => { if (data) setSite(data) }).catch(() => undefined)
  }, [])
  const fullName = site.name.trim().split(/\s+/)
  const splitAt = Math.max(1, Math.floor(fullName.length / 2))
  const nameLines = [fullName.slice(0, splitAt).join(' '), fullName.slice(splitAt).join(' ')]
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
      <MotionSwitch locale={locale} />

      <main id="main">
        <section className="portfolio-hero portfolio-hero-reimagined portfolio-shell" aria-label={locale === 'vi' ? 'Giới thiệu Minh Triết' : 'Introducing Minh Triet'}>
          <motion.div className="portfolio-hero-copy" variants={heroGroup} initial={reduceMotion ? false : 'hidden'} animate="visible">
            <motion.p variants={heroItem} className="hero-edition"><span className="hero-status-dot" /> {locale === 'vi' ? 'PORTFOLIO CÁ NHÂN' : 'PERSONAL PORTFOLIO'} <span>— 2026</span></motion.p>
            <motion.p variants={heroItem} className="portfolio-role">{locale === 'vi' ? `Xin chào, mình là` : `Hello, I'm`}</motion.p>
            <motion.h1 variants={heroItem} className="kinetic-name">
              <span className="kinetic-line"><span>{nameLines[0]}</span></span>
              <span className="kinetic-line is-accent"><span>{nameLines[1]}</span></span>
            </motion.h1>
            <motion.h2 variants={heroItem}><TypingText texts={site.roles} /></motion.h2>
            <motion.p variants={heroItem} className="portfolio-summary">{copy.heroBody}</motion.p>
            <motion.div variants={heroItem} className="portfolio-cta"><a className="primary" href="/projects">{copy.viewProjects}<ArrowUpRight aria-hidden="true" /></a><a href={`mailto:${site.email}`}>{copy.contact}<Mail aria-hidden="true" /></a></motion.div>
            <motion.div variants={heroItem} className="hero-scroll-cue"><span>↘</span>{locale === 'vi' ? 'CUỘN ĐỂ KHÁM PHÁ' : 'SCROLL TO EXPLORE'}<span>01 / 05</span></motion.div>
          </motion.div>
          <motion.div className="hero-artwork" initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
            <div className="hero-artwork-top"><span>FIG. 01 / IDENTITY</span><span>MT — 03</span></div>
            <div className="hero-orbit-field">
              <div className="hero-artwork-crosshair hero-crosshair-one" aria-hidden="true">+</div>
              <div className="hero-artwork-crosshair hero-crosshair-two" aria-hidden="true">+</div>
              <MorphingLoop />
              <div className="hero-centre-label" aria-hidden="true">m<span>t</span><i>®</i></div>
              <div className="hero-float-note hero-float-year"><small>{locale === 'vi' ? 'SINH VIÊN NĂM' : 'STUDY YEAR'}</small><strong>{String(site.studentYear).padStart(2, '0')}</strong></div>
              <div className="hero-float-note hero-float-gpa"><small>GPA / 4.0</small><strong>{site.gpa}</strong></div>
            </div>
            <div className="hero-artwork-bottom"><span>CREATIVE CODE / REAL SYSTEMS</span><span>↗ 001</span></div>
          </motion.div>
          <div className="hero-fact-rail">
            <div><span>01 / {locale === 'vi' ? 'CHUYÊN NGÀNH' : 'DISCIPLINE'}</span><strong>{site.major[locale]}</strong></div>
            <div><span>02 / {locale === 'vi' ? 'ĐỊA ĐIỂM' : 'BASED IN'}</span><strong>{site.location[locale]}</strong></div>
            <div><span>03 / {locale === 'vi' ? 'HỌC VẤN' : 'ACADEMIC'}</span><strong>{locale === 'vi' ? `Năm ${site.studentYear}` : `Year ${site.studentYear}`} · GPA {site.gpa}</strong></div>
          </div>
        </section>

        <TechMarquee technologies={site.skills.flatMap(group => group.items)} />

        <section className="portfolio-console-section portfolio-shell" aria-label={locale === 'vi' ? 'Terminal tương tác' : 'Interactive terminal'}>
          <div className="portfolio-console-intro"><span>↳ 00 / TERMINAL</span><h2>{locale === 'vi' ? <>Gõ một lệnh.<br/><em>Hiểu thêm về mình.</em></> : <>Type a command.<br/><em>Get to know me.</em></>}</h2><p>{locale === 'vi' ? 'Một góc nhỏ để khám phá thông tin, kỹ năng và dự án qua dòng lệnh. Hãy thử một lệnh bên phải.' : 'Explore my background, skills, and projects through the command line. Try a command on the right.'}</p><span className="console-footnote">&lt;/ INTERACTIVE PROFILE &gt;</span></div>
          <div className="portfolio-console-window"><PortfolioTerminal locale={locale} site={site} /></div>
        </section>

        <motion.section initial={false} whileInView={reduceMotion ? {} : { y: [16, 0], opacity: [0.7, 1] }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }} className="portfolio-section portfolio-about portfolio-shell" id="about">
          <header className="portfolio-section-head"><span>01</span><div><p>{copy.sectionLabels.about}</p><h2>{copy.aboutTitle}</h2></div></header>
          <div className="portfolio-about-grid"><p>{copy.aboutBody}</p><div><span>{copy.principle}</span>{copy.principles.map(item => <p key={item}>{item}</p>)}</div></div>
          <dl className="portfolio-facts">
            <div><dt>{locale === 'vi' ? 'Ngành học' : 'Major'}</dt><dd>{site.major[locale]}</dd></div>
            <div><dt>{locale === 'vi' ? 'Năm học' : 'Study year'}</dt><dd>{locale === 'vi' ? `Năm ${site.studentYear}` : `Year ${site.studentYear}`}</dd></div>
            <div><dt>GPA / 4.0</dt><dd>{site.gpa}</dd></div>
            <div><dt>{locale === 'vi' ? 'Địa điểm' : 'Location'}</dt><dd>{site.location[locale]}</dd></div>
          </dl>
        </motion.section>

        <section className="portfolio-section portfolio-skills" id="capabilities">
          <div className="portfolio-shell">
            <Reveal><header className="portfolio-section-head"><span>02</span><div><p>{copy.sectionLabels.capabilities}</p><h2>{copy.capabilitiesTitle}</h2></div><p>{copy.capabilitiesBody}</p></header></Reveal>
            <div className="skills-grid">{site.skills.map((group, index) => { const Icon = skillIcons[index % skillIcons.length]; return <motion.article key={group.key} initial={false} whileInView={reduceMotion ? {} : { y: [18, 0], opacity: [0.65, 1] }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, delay: index * 0.05 }}><div className="skill-group-heading"><div className="skill-group-icon"><Icon aria-hidden="true" /></div><span className="skill-group-number">{String(index + 1).padStart(2, '0')}</span></div><h3>{group.label[locale]}</h3><div className="skill-items">{group.items.map(item => <SkillBadge key={item} name={item} locale={locale} />)}</div></motion.article> })}</div>
          </div>
        </section>

        <section className="portfolio-section portfolio-projects portfolio-shell" id="projects">
          <Reveal><header className="portfolio-section-head"><span>03</span><div><p>{copy.sectionLabels.projects}</p><h2>{copy.projectsTitle}</h2></div><p>{copy.projectsBody}</p></header></Reveal>
          <div className="projects-grid">{featuredProjects.slice(0, 3).map((project, index) => <Reveal key={project.id} delay={index * 0.06}><ProjectCase project={project} locale={locale} copy={copy} index={index} /></Reveal>)}</div>
          <a className="blog-all" href="/projects">{projectCopy[locale].allProjects}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </section>

        <BlogSection locale={locale} />

        <section className="portfolio-contact portfolio-shell" id="contact">
          <Reveal className="contact-reveal"><div><p>05 / {copy.sectionLabels.contact}</p><h2>{copy.contactTitle}</h2><MorphingLoop /></div></Reveal>
          <Reveal className="contact-reveal" delay={0.08}><div><p>{copy.contactBody}</p><a href={`mailto:${site.email}`}>{site.email}<ArrowUpRight aria-hidden="true" /></a></div></Reveal>
        </section>
      </main>

      <SiteFooter locale={locale} site={site} />
    </div>
  )
}

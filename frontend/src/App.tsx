import { useEffect, useState } from 'react'
import template from './portfolio/template.html?raw'
import './portfolio/styles.css'
import { featuredProjects as fallbackProjects } from './data'
import { defaultSite } from './siteDefaults'
import { useLocale } from './hooks/useLocale'
import { portfolioApi } from './lib/api'
import { hydratePortfolio } from './portfolio/hydrate'
import type { Project, SiteData } from './types'

// React must keep this exact object reference between renders. Replacing the
// reference page's DOM would discard event listeners installed by main.js,
// making the marquee and motion toggle stop after data/language updates.
const referenceMarkup = { __html: template }

// The source portfolio is intentionally kept as one cohesive page. React only
// supplies live CMS data and the persistent language choice.
export default function App() {
  const [site, setSite] = useState<SiteData>(defaultSite)
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [locale, setLocale] = useLocale()

  useEffect(() => {
    let alive = true
    portfolioApi.publicSite().then(value => {
      if (alive && value) setSite(value)
    }).catch(() => undefined)
    portfolioApi.publicProjects().then(value => {
      if (alive) setProjects(value.filter(project => project.featured !== false))
    }).catch(() => undefined)
    return () => { alive = false }
  }, [])

  useEffect(() => {
    let alive = true
    const languageButton = document.getElementById('language-toggle')
    const toggleLanguage = () => setLocale(locale === 'vi' ? 'en' : 'vi')
    languageButton?.addEventListener('click', toggleLanguage)

    // DOM is mounted before the original reference's motion and icon code runs.
    void import('./portfolio/main.js').then(motion => {
      if (!alive) return
      hydratePortfolio(site, projects, locale)
      motion.applySkillIcons()
      motion.setMarqueeItems(site.skills.flatMap(group => group.items))
      motion.setRoles(site.roles, locale)
      motion.updateMotionLabel()
    })

    return () => {
      alive = false
      languageButton?.removeEventListener('click', toggleLanguage)
    }
  }, [locale, projects, site, setLocale])

  return <div className="reference-portfolio" dangerouslySetInnerHTML={referenceMarkup} />
}

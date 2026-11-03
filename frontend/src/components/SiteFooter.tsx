import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { defaultSite } from '../siteDefaults'
import type { Locale, SiteData } from '../types'

export function SiteFooter({ locale, site = defaultSite }: { locale: Locale; site?: SiteData }) {
  const links = [{ id: 'github', label: 'GitHub', url: site.github }, { id: 'facebook', label: 'Facebook', url: site.facebook }, { id: 'website', label: 'Website', url: site.website }]
  return <footer className="portfolio-footer portfolio-shell site-footer"><div><span>© {new Date().getFullYear()} {site.name}</span><a className="back-to-top" href="#top">{locale === 'vi' ? 'Về đầu trang' : 'Back to top'}<ArrowUp size={14} aria-hidden="true" /></a></div><div>{links.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></footer>
}

import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { contactLinks, profile } from '../data'
import type { Locale } from '../types'

export function SiteFooter({ locale }: { locale: Locale }) {
  return <footer className="portfolio-footer portfolio-shell site-footer"><div><span>© {new Date().getFullYear()} {profile.name}</span><a className="back-to-top" href="#top">{locale === 'vi' ? 'Về đầu trang' : 'Back to top'}<ArrowUp size={14} aria-hidden="true" /></a></div><div>{contactLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></footer>
}

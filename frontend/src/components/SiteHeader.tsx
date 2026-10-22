import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Locale } from '../types'

export function SiteHeader({ locale, setLocale, current }: { locale: Locale; setLocale: (locale: Locale) => void; current: 'home' | 'projects' | 'blog' }) {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const labels = locale === 'vi'
    ? { home: 'Trang chủ', projects: 'Dự án', blog: 'Blog', contact: 'Liên hệ', menu: 'Mở menu', close: 'Đóng menu', nav: 'Điều hướng chính' }
    : { home: 'Home', projects: 'Projects', blog: 'Blog', contact: 'Contact', menu: 'Open menu', close: 'Close menu', nav: 'Primary navigation' }
  const links = [{ id: 'home', href: current === 'home' ? '#top' : '/' }, { id: 'projects', href: '/projects' }, { id: 'blog', href: '/blog' }, { id: 'contact', href: current === 'home' ? '#contact' : '/#contact' }] as const
  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape) }
  }, [open])
  return <header className="portfolio-nav site-nav" ref={header}>
    <a className="portfolio-logo" href={current === 'home' ? '#top' : '/'} aria-label={`MTRIET — ${labels.home}`}>MTRIET<span>.</span></a>
    <nav id="site-navigation" className={`site-links${open ? ' is-open' : ''}`} aria-label={labels.nav}>
      {links.map(link => <a key={link.id} href={link.href} aria-current={current === link.id ? 'page' : undefined} onClick={() => setOpen(false)}>{labels[link.id]}</a>)}
    </nav>
    <div className="portfolio-nav-actions"><LanguageSwitcher locale={locale} setLocale={setLocale} /><button ref={toggle} className="site-menu" type="button" aria-expanded={open} aria-controls="site-navigation" aria-label={open ? labels.close : labels.menu} onClick={() => setOpen(value => !value)}>{open ? <X size={20} /> : <Menu size={20} />}</button></div>
  </header>
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MoveUpRight } from 'lucide-react'
import { profile } from '../data'
import { setMotionEnabled, useMotionEnabled } from '../hooks/useMotionPreference'
import type { Locale } from '../types'

type Props = {
  locale: Locale
  setLocale: (locale: Locale) => void
  current: 'projects' | 'blog'
  children: ReactNode
}

export function CatalogLayout({ locale, setLocale, current, children }: Props) {
  const isVi = locale === 'vi'
  const animated = useMotionEnabled()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [menuOpen])

  const links = [
    { url: '/#about', label: isVi ? 'Về mình' : 'About', key: 'about' },
    { url: '/#work', label: isVi ? 'Dự án' : 'Projects', key: 'work' },
    { url: '/#skills', label: isVi ? 'Kỹ năng' : 'Skills', key: 'skills' },
    { url: '/#contact', label: isVi ? 'Liên hệ' : 'Contact', key: 'contact' },
    { url: '/projects', label: isVi ? 'Tất cả dự án' : 'All projects', key: 'projects' },
    { url: '/blog', label: 'Blog', key: 'blog' },
  ]
  return <div className="catalog-v2" id="top">
    <a className="catalog-skip" href="#main">{isVi ? 'Đến nội dung chính' : 'Skip to main content'}</a>
    <header className="catalog-header">
      <div className="site-header wrap" ref={headerRef}>
        <a className="brand" href="/" aria-label={isVi ? 'Minh Triết — Trang chủ' : 'Minh Triet — Home'}>
          <img className="brand-symbol" src="/favicon.svg" alt="" width="43" height="43" aria-hidden="true" />
          <span className="brand-text">minhtriet<span className="brand-point">.</span></span>
        </a>
        <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} id="site-nav" aria-label={isVi ? 'Điều hướng chính' : 'Main navigation'}>
          {links.map(link => <a key={link.key} className={link.key === current ? 'is-active' : undefined} aria-current={link.key === current ? 'page' : undefined} href={link.url} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-toggle" onClick={() => setLocale(isVi ? 'en' : 'vi')} type="button" aria-label={isVi ? 'Switch to English' : 'Chuyển sang tiếng Việt'}>{isVi ? 'EN' : 'VI'}</button>
          <button className="motion-toggle" type="button" onClick={() => setMotionEnabled(!animated)} aria-pressed={animated} aria-label={animated ? (isVi ? 'Tắt hiệu ứng chuyển động' : 'Disable motion') : (isVi ? 'Bật hiệu ứng chuyển động' : 'Enable motion')}>
            <span className="motion-toggle-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h2m3-6 1.5-1.5M12 4V2m6 4 1.5-1.5M18 12h2m-5 5 2 2M9 17l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="1.5" /></svg>
            </span>
            <span className="motion-label">{isVi ? `Hiệu ứng: ${animated ? 'Bật' : 'Tắt'}` : `Motion: ${animated ? 'On' : 'Off'}`}</span>
          </button>
          <button ref={menuRef} className="menu-toggle" type="button" aria-label={isVi ? (menuOpen ? 'Đóng menu' : 'Mở menu') : (menuOpen ? 'Close menu' : 'Open menu')} aria-controls="site-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
    {children}
    <section id="contact" className="section section-contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <div>
          <span className="section-index">{isVi ? 'Liên hệ' : 'Contact'}</span>
          <h2 id="contact-title">{isVi ? 'Có ý tưởng?' : 'Have an idea?'}<br /><span>{isVi ? 'Cùng bắt đầu.' : 'Let’s get started.'}</span></h2>
          <p>{isVi ? 'Mình luôn sẵn sàng trao đổi về dự án, công nghệ và những điều mới để học hỏi.' : 'I am always open to conversations about projects, technology, and new things to learn.'}</p>
          <a className="contact-email magnetic" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="contact-decoration" aria-hidden="true"><div className="contact-loop" /><span>Let's build<br />something.</span></div>
      </div>
    </section>
    <footer className="catalog-footer"><div className="wrap catalog-footer-inner"><span>© {new Date().getFullYear()} {profile.name}</span><nav aria-label="Footer"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <MoveUpRight size={12} /></a><a href={profile.facebook} target="_blank" rel="noopener noreferrer">Facebook <MoveUpRight size={12} /></a><a href="/admin">{isVi ? 'Quản trị' : 'Admin'}</a></nav><a href="#top">{isVi ? 'Lên đầu trang ↑' : 'Back to top ↑'}</a></div></footer>
  </div>
}

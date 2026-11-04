import type { ReactNode } from 'react'
import { ArrowUpRight, Menu, MoveUpRight, Pause, Play } from 'lucide-react'
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
  const links = [
    { url: '/', label: isVi ? 'Trang chủ' : 'Home', key: 'home' },
    { url: '/#about', label: isVi ? 'Về mình' : 'About', key: 'about' },
    { url: '/projects', label: isVi ? 'Dự án' : 'Projects', key: 'projects' },
    { url: '/blog', label: 'Blog', key: 'blog' },
    { url: '/#contact', label: isVi ? 'Liên hệ' : 'Contact', key: 'contact' },
  ]
  return <div className="catalog-v2" id="top">
    <a className="catalog-skip" href="#main">{isVi ? 'Đến nội dung chính' : 'Skip to main content'}</a>
    <header className="catalog-header">
      <div className="wrap catalog-header-inner">
        <a className="catalog-brand" href="/" aria-label={isVi ? 'Minh Triết — Trang chủ' : 'Minh Triet — Home'}>
          <img src="/favicon.svg" alt="" width="40" height="40" />
          <span>minhtriet<span className="catalog-brand-dot">.</span></span>
        </a>
        <nav className="catalog-navigation" aria-label={isVi ? 'Điều hướng chính' : 'Main navigation'}>
          {links.map(link => <a key={link.key} className={link.key === current ? 'active' : ''} aria-current={link.key === current ? 'page' : undefined} href={link.url}>{link.label}</a>)}
        </nav>
        <div className="catalog-header-actions">
          <button className="catalog-motion" type="button" onClick={() => setMotionEnabled(!animated)} aria-label={animated ? (isVi ? 'Tắt hiệu ứng' : 'Disable motion') : (isVi ? 'Bật hiệu ứng' : 'Enable motion')} title={animated ? (isVi ? 'Tắt hiệu ứng' : 'Disable motion') : (isVi ? 'Bật hiệu ứng' : 'Enable motion')}>
            {animated ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          </button>
          <button className="catalog-lang" onClick={() => setLocale(isVi ? 'en' : 'vi')} type="button" aria-label={isVi ? 'Switch to English' : 'Chuyển sang tiếng Việt'}>{isVi ? 'EN' : 'VI'}</button>
          <details className="catalog-mobile-nav">
            <summary aria-label={isVi ? 'Mở menu điều hướng' : 'Open navigation'}><Menu size={21} aria-hidden="true" /></summary>
            <nav aria-label={isVi ? 'Điều hướng di động' : 'Mobile navigation'}>{links.map(link => <a key={link.key} href={link.url}>{link.label}</a>)}</nav>
          </details>
        </div>
      </div>
    </header>
    {children}
    <section className="catalog-contact" aria-label={isVi ? 'Liên hệ' : 'Contact'}>
      <div className="wrap catalog-contact-inner">
        <div><span className="catalog-eyebrow">{isVi ? 'Có ý tưởng mới?' : 'Have an idea?'}</span><h2>{isVi ? 'Cùng tạo ra' : "Let's make"}<br /><em>{isVi ? 'điều thú vị.' : 'something good.'}</em></h2><p>{isVi ? 'Mình luôn sẵn sàng trao đổi về công nghệ và những dự án mới.' : 'Always open to ideas, technology, and the next project.'}</p><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={20} aria-hidden="true" /></a></div>
        <div className="catalog-contact-art" aria-hidden="true"><div className="catalog-contact-blob" /><span>MT<span>.</span></span></div>
      </div>
    </section>
    <footer className="catalog-footer"><div className="wrap catalog-footer-inner"><span>© {new Date().getFullYear()} {profile.name}</span><nav aria-label="Footer"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <MoveUpRight size={12} /></a><a href={profile.facebook} target="_blank" rel="noopener noreferrer">Facebook <MoveUpRight size={12} /></a><a href="/admin">{isVi ? 'Quản trị' : 'Admin'}</a></nav><a href="#top">{isVi ? 'Lên đầu trang ↑' : 'Back to top ↑'}</a></div></footer>
  </div>
}

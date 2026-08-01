import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { Locale } from '../types'
import './NotFoundPage.css'

const content = {
  vi: {
    title: 'Không tìm thấy trang',
    description: 'Đường dẫn này không tồn tại hoặc đã được chuyển sang vị trí khác.',
    route: 'Đường dẫn yêu cầu',
    status: 'Trạng thái',
    statusValue: 'Không tìm thấy tài nguyên',
    home: 'Quay về trang chủ',
    language: 'Chọn ngôn ngữ',
  },
  en: {
    title: 'Page not found',
    description: 'This path does not exist or has moved somewhere else.',
    route: 'Requested path',
    status: 'Status',
    statusValue: 'Resource not found',
    home: 'Back to home',
    language: 'Choose language',
  },
} as const

function detectLocale(): Locale {
  const saved = localStorage.getItem('portfolio-locale')
  if (saved === 'vi' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'vi'
}

export function NotFoundPage() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)
  const copy = content[locale]

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('portfolio-locale', next)
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `404 — ${copy.title} · MTRIET`
  }, [copy.title, locale])

  return (
    <div className="not-found-page">
      <header className="not-found-nav">
        <a className="not-found-wordmark" href="/" aria-label="MTRIET — home">
          MTRIET<span>.</span>
        </a>
        <LanguageSwitcher locale={locale} setLocale={setLocale} />
      </header>

      <main className="not-found-main" id="main">
        <p className="not-found-code" aria-hidden="true">404</p>
        <div className="not-found-copy">
          <p className="not-found-protocol">HTTP / 404</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>

        <dl className="not-found-index">
          <div>
            <dt>{copy.route}</dt>
            <dd>{window.location.pathname}</dd>
          </div>
          <div>
            <dt>{copy.status}</dt>
            <dd>{copy.statusValue}</dd>
          </div>
        </dl>

        <a className="not-found-home" href="/">
          <ArrowLeft aria-hidden="true" />
          {copy.home}
        </a>
      </main>

      <footer className="not-found-footer">
        <span>© {new Date().getFullYear()} Nguyễn Ngọc Minh Triết</span>
        <span lang={locale}>{copy.language}: {locale.toUpperCase()}</span>
      </footer>
    </div>
  )
}

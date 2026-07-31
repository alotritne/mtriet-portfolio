import type { Locale } from '../types'

export function LanguageSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (locale: Locale) => void }) {
  return (
    <div className="language-switch" aria-label={locale === 'vi' ? 'Ngôn ngữ' : 'Language'}>
      {(['vi', 'en'] as const).map((item) => (
        <button key={item} type="button" onClick={() => setLocale(item)} aria-pressed={locale === item}>
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

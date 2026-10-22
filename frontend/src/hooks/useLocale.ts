import { useEffect, useState } from 'react'
import type { Locale } from '../types'

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem('portfolio-locale')
    if (saved === 'vi' || saved === 'en') return saved
  } catch { /* Storage may be unavailable in private browsing. */ }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'vi'
}
export function useLocale() {
  const [locale, update] = useState<Locale>(detectLocale)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  const setLocale = (value: Locale) => {
    update(value)
    try { localStorage.setItem('portfolio-locale', value) } catch { /* The in-memory choice still works. */ }
  }
  return [locale, setLocale] as const
}

import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Search, X } from 'lucide-react'
import { portfolioApi } from '../lib/api'
import type { BlogSummary, Locale } from '../types'
import { Reveal } from '../components/PageMotion'
import { blogCopy } from './copy'

type Result = { posts: BlogSummary[]; total: number; tags: string[] }

export function BlogList({ locale, preview = false }: { locale: Locale; preview?: boolean }) {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(preview ? '' : location.search)
    return { query: (params.get('q') || '').slice(0, 100), tag: (params.get('tag') || '').slice(0, 40), page: Math.floor(Math.max(1, Math.min(10000, Number(params.get('page')) || 1))) }
  })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const copy = blogCopy[locale]
  const { query, tag, page } = filters
  const filtered = !!(query || tag)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError(false)
    const timer = window.setTimeout(() => {
      portfolioApi.posts(page, { query, tag, locale, signal: controller.signal })
        .then(data => { if (!controller.signal.aborted) { setResult({ ...data, tags: data.tags || [] }); setLoading(false) } })
        .catch(() => { if (!controller.signal.aborted) { setError(true); setLoading(false) } })
    }, query ? 250 : 0)
    return () => { clearTimeout(timer); controller.abort() }
  }, [page, query, tag, locale, attempt])
  useEffect(() => {
    if (preview) return
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (tag) params.set('tag', tag)
    if (page > 1) params.set('page', String(page))
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`)
  }, [page, query, tag, preview])
  const clear = () => setFilters({ query: '', tag: '', page: 1 })
  const Heading = preview ? 'h3' : 'h2'
  return <div className="blog-list">
    {!preview && <><div className="catalog-toolbar"><label className="catalog-search"><span>{copy.search}</span><div><Search size={18} aria-hidden="true" /><input type="search" maxLength={100} value={query} placeholder={copy.placeholder} onChange={event => setFilters({ ...filters, query: event.target.value, page: 1 })} /></div></label><label className="catalog-select"><span>{copy.topic}</span><select value={tag} onChange={event => setFilters({ ...filters, tag: event.target.value, page: 1 })}><option value="">{copy.topics}</option>{tag && !result?.tags.includes(tag) && <option value={tag}>{tag}</option>}{result?.tags.map(item => <option key={item}>{item}</option>)}</select></label></div><div className="catalog-results"><p role="status">{loading ? copy.loading : error ? '—' : `${String(result?.total || 0).padStart(2, '0')} ${copy.results}`}</p>{filtered && <button onClick={clear}><X size={14} aria-hidden="true" />{copy.clear}</button>}</div></>}
    <div className={loading && result ? 'blog-results is-updating' : 'blog-results'} aria-busy={loading}>
      {error ? <div className="catalog-empty" role="alert"><BookOpen size={30} aria-hidden="true" /><p>{copy.error}</p><button className="button" onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button></div>
        : !result ? <p className="catalog-loading" role="status">{copy.loading}</p>
        : !result.posts.length ? <div className="catalog-empty"><BookOpen size={32} aria-hidden="true" /><Heading>{filtered ? copy.noResults : copy.empty}</Heading><p>{filtered ? copy.noResultsBody : copy.emptyBody}</p>{(filtered || page > 1) && <button className="button" onClick={clear}>{copy.clear}</button>}</div>
        : <div className="blog-rows">{result.posts.slice(0, preview ? 3 : 12).map((post, index) => <Reveal key={post.id} delay={Math.min(index, 3) * 0.045}><a className="blog-row" href={`/blog/${post.slug}`}>
          <span className="blog-number">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>
          <div><div className="blog-meta"><time dateTime={post.publishedAt || undefined}>{post.publishedAt && new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>{post.tags.map(item => <span key={item}>{item}</span>)}</div><Heading>{post.title[locale]}</Heading><p>{post.excerpt[locale]}</p><span className="blog-read">{copy.read}<ArrowRight aria-hidden="true" size={16} /></span></div>
          <ArrowUpRight aria-hidden="true" className="blog-row-arrow" />
        </a></Reveal>)}</div>}
    </div>
    {!preview && !error && result && (result.total > 12 || page > 1) && <nav className="blog-pagination" aria-label={locale === 'vi' ? 'Phân trang bài viết' : 'Article pagination'}><button className="button" disabled={loading || page === 1} onClick={() => setFilters({ ...filters, page: page - 1 })}>{copy.previous}</button><span>{copy.page} {page} / {Math.max(page, Math.ceil(result.total / 12))}</span><button className="button" disabled={loading || page * 12 >= result.total} onClick={() => setFilters({ ...filters, page: page + 1 })}>{copy.next}</button></nav>}
  </div>
}

export function BlogSection({ locale }: { locale: Locale }) {
  const copy = blogCopy[locale]
  return <section id="blog" className="portfolio-section portfolio-shell portfolio-blog"><Reveal><header className="portfolio-section-head"><span>04</span><div><p>Blog</p><h2>{copy.title}</h2></div><p>{copy.intro}</p></header></Reveal><BlogList locale={locale} preview /><a className="blog-all" href="/blog">{copy.all}<ArrowUpRight size={18} aria-hidden="true" /></a></section>
}

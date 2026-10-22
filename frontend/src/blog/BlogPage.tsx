import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal, ScrollProgress } from '../components/PageMotion'
import { useLocale } from '../hooks/useLocale'
import { portfolioApi } from '../lib/api'
import { profile } from '../data'
import type { BlogPost } from '../types'
import { blogCopy } from './copy'
import { BlogList } from './BlogList'
import { ArticleBody } from './ArticleBody'

export default function BlogPage() {
  const [locale, setLocale] = useLocale()
  const copy = blogCopy[locale]
  const slug = window.location.pathname.replace(/\/+$/, '').split('/')[2]
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!slug) return
    let active = true
    setError(false)
    portfolioApi.post(slug).then(data => { if (active) setPost(data) }).catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [slug, attempt])
  useEffect(() => { document.title = `${post ? post.title[locale] : 'Blog'} — ${profile.name}` }, [post, locale])
  return <div className="portfolio-page catalog-page" id="top"><a className="skip-link" href="#main">{locale === 'vi' ? 'Đến nội dung' : 'Skip to content'}</a><ScrollProgress /><SiteHeader locale={locale} setLocale={setLocale} current="blog" />
    <main id="main" className="portfolio-shell catalog-main">
      {!slug ? <><header className="catalog-heading page-enter"><p className="catalog-eyebrow">02 / Blog</p><h1>{copy.title}</h1><div className="catalog-lead"><p>{copy.intro}</p><a className="catalog-cross-link" href="/projects">{copy.projects}<ArrowUpRight size={18} aria-hidden="true" /></a></div></header><BlogList locale={locale} /><Reveal><a className="catalog-next" href="/projects"><div><p className="catalog-eyebrow">{copy.nextSection}</p><h2>{copy.projects}</h2><p>{copy.projectsBody}</p></div><ArrowUpRight size={32} aria-hidden="true" /></a></Reveal></>
        : error ? <div className="blog-empty" role="alert"><p>{copy.error}</p><button className="button" onClick={() => setAttempt(value => value + 1)}>{copy.retry}</button></div>
        : post === undefined ? <p role="status">{copy.loading}</p>
        : post === null ? <div className="blog-empty"><h1>{copy.missing}</h1><p>{copy.missingBody}</p><a className="button" href="/blog">{copy.back}</a></div>
        : <article className="blog-article page-enter"><a className="article-back" href="/blog"><ArrowLeft size={16} aria-hidden="true" />{copy.back}</a><header className="blog-heading"><div className="blog-meta"><time dateTime={post.publishedAt || undefined}>{post.publishedAt && new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h1>{post.title[locale]}</h1><p>{post.excerpt[locale]}</p><span>{profile.name}</span></header><ArticleBody html={post.content[locale]} /><a className="blog-all" href="/blog"><ArrowLeft size={18} />{copy.back}</a></article>}
    </main><SiteFooter locale={locale} /></div>
}

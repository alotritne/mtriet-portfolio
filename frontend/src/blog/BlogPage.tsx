import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, PenLine } from 'lucide-react'
import { profile } from '../data'
import { useLocale } from '../hooks/useLocale'
import { portfolioApi } from '../lib/api'
import { CatalogLayout } from '../portfolio/CatalogLayout'
import type { BlogPost } from '../types'
import { ArticleBody } from './ArticleBody'
import { BlogList } from './BlogList'
import { blogCopy } from './copy'

export default function BlogPage() {
  const [locale, setLocale] = useLocale()
  const slug = window.location.pathname.replace(/\/+$/, '').split('/')[2]
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const copy = blogCopy[locale]

  useEffect(() => {
    document.title = `${slug && post ? post.title[locale] : copy.title} — ${profile.name}`
  }, [copy.title, locale, post, slug])

  useEffect(() => {
    if (!slug) return
    let active = true
    portfolioApi.post(slug)
      .then(item => { if (active) { setPost(item); setError(false) } })
      .catch(() => { if (active) { setPost(null); setError(true) } })
    return () => { active = false }
  }, [slug, attempt])

  return <CatalogLayout locale={locale} setLocale={setLocale} current="blog">
    <main id="main" className="catalog-main wrap">
      {!slug ? <>
        <header className="catalog-hero">
          <div className="catalog-hero-copy">
            <span className="catalog-eyebrow">02 / Blog</span>
            <h1>{locale === 'vi' ? <>Ghi chép &amp;<br /><em>chia sẻ.</em></> : <>Notes &amp;<br /><em>perspectives.</em></>}</h1>
            <p>{copy.intro}</p>
            <a className="catalog-hero-link" href="/projects">{copy.projects} <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="catalog-hero-art" aria-hidden="true">
            <div className="catalog-hero-blob" /><div className="catalog-hero-blob-inner" /><PenLine size={54} strokeWidth={1.5} />
          </div>
        </header>
        <section className="catalog-section" aria-label={copy.title}><BlogList locale={locale} /></section>
        <a className="catalog-next" href="/projects"><span className="catalog-eyebrow">{copy.nextSection}</span><span>{copy.projects}</span><ArrowUpRight size={31} aria-hidden="true" /></a>
      </> : error ? <div className="catalog-empty" role="alert"><h1>{copy.error}</h1><button onClick={() => { setError(false); setPost(undefined); setAttempt(value => value + 1) }}>{copy.retry}</button><a href="/blog">{copy.back}</a></div>
        : post === undefined ? <p className="catalog-loading" role="status">{copy.loading}</p>
          : post === null ? <div className="catalog-empty"><h1>{copy.missing}</h1><p>{copy.missingBody}</p><a href="/blog">{copy.back}</a></div>
            : <article className="blog-article">
              <a className="article-back" href="/blog"><ArrowLeft size={17} aria-hidden="true" />{copy.back}</a>
              <header className="blog-heading">
                <div className="blog-meta">
                  <time dateTime={post.publishedAt || undefined}>{post.publishedAt && new Date(post.publishedAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  {post.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
                <h1>{post.title[locale]}</h1><p>{post.excerpt[locale]}</p><span>{profile.name}</span>
              </header>
              <ArticleBody html={post.content[locale]} />
              <a className="blog-all" href="/blog"><ArrowLeft size={17} aria-hidden="true" />{copy.back}</a>
            </article>}
    </main>
  </CatalogLayout>
}

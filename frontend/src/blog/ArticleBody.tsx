import DOMPurify from 'dompurify'

export function ArticleBody({ html }: { html: string }) {
  return <div className="article-prose" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, FORBID_TAGS: ['form', 'input', 'button', 'style'], ADD_ATTR: ['loading'] }) }} />
}

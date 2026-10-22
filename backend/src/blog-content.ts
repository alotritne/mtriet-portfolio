import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

export function cleanArticle(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'hr', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: {
      a: ['href', 'title', 'rel'], img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      ol: ['start'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'],
      p: ['style'], h2: ['style'], h3: ['style'], h4: ['style'],
    },
    allowedStyles: { '*': { 'text-align': [/^(left|center|right|justify)$/] } },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
      img: sanitizeHtml.simpleTransform('img', { loading: 'lazy' }),
    },
  })
}

const localized = (max: number) => z.object({ vi: z.string().trim().max(max), en: z.string().trim().max(max) })
export const postSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: localized(180), excerpt: localized(500),
  content: localized(180000).transform(value => ({ vi: cleanArticle(value.vi), en: cleanArticle(value.en) })),
  tags: z.array(z.string().trim().min(1).max(40)).max(8),
  published: z.boolean(),
}).superRefine((post, ctx) => {
  if (!post.title.vi && !post.title.en) ctx.addIssue({ code: 'custom', path: ['title'], message: 'Add a title in at least one language.' })
  if (post.published) for (const locale of ['vi', 'en'] as const) {
    for (const field of ['title', 'excerpt', 'content'] as const) {
      const text = sanitizeHtml(post[field][locale], { allowedTags: [], allowedAttributes: {} }).replace(/&nbsp;/g, ' ').trim()
      if (!text) ctx.addIssue({ code: 'custom', path: [field, locale], message: 'Complete both languages before publishing.' })
    }
  }
})

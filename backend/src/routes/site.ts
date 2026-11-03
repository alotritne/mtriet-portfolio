import { Router } from 'express'
import { z } from 'zod'
import { getDb } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const localized = z.object({ vi: z.string().trim().min(1).max(180), en: z.string().trim().min(1).max(180) }).strict()
const publicUrl = z.url().refine(value => /^https?:\/\//i.test(value), 'URL must start with http:// or https://')
export const siteSchema = z.object({
  name: z.string().trim().min(2).max(160),
  major: localized,
  studentYear: z.number().int().min(1).max(10),
  gpa: z.string().trim().regex(/^(?:[0-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/),
  location: localized,
  email: z.email(),
  github: publicUrl,
  facebook: publicUrl,
  website: publicUrl,
  roles: z.array(z.string().trim().min(1).max(100)).min(1).max(10),
  skills: z.array(z.object({
    key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
    label: localized,
    items: z.array(z.string().trim().min(1).max(70)).max(35),
  }).strict()).max(16).refine(groups => new Set(groups.map(group => group.key)).size === groups.length, 'Duplicate skill group'),
}).strict()

type Site = z.infer<typeof siteSchema>
type SiteDocument = Site & { _id: string; updatedAt: Date }

const router = Router()
async function loadSite(): Promise<Site | null> {
  const doc = await (await getDb()).collection<SiteDocument>('siteContent').findOne({ _id: 'main' })
  if (!doc) return null
  const { _id: _idUnused, updatedAt: _updatedAtUnused, ...content } = doc
  void _idUnused
  void _updatedAtUnused
  return siteSchema.parse(content)
}

router.get('/public', async (_req, res, next) => {
  try { res.json({ site: await loadSite() }) } catch (error) { next(error) }
})

router.get('/', requireAdmin, async (_req, res, next) => {
  try { res.json({ site: await loadSite() }) } catch (error) { next(error) }
})

router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = siteSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid site content', details: z.treeifyError(parsed.error) })
    await (await getDb()).collection<SiteDocument>('siteContent').updateOne(
      { _id: 'main' }, { $set: { ...parsed.data, updatedAt: new Date() } }, { upsert: true },
    )
    return res.json({ site: parsed.data })
  } catch (error) { return next(error) }
})

export default router

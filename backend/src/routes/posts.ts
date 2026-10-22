import { Router } from 'express'
import { ObjectId, type Filter } from 'mongodb'
import { getDb } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { postSchema } from '../blog-content.js'
import type { PostDocument } from '../types.js'

const router = Router()
const collection = async () => (await getDb()).collection<PostDocument>('posts')
const serialize = ({ _id, ...post }: PostDocument) => ({ ...post, id: _id?.toHexString() })
const readId = (value: unknown) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null

router.get('/public', async (request, response) => {
  const page = Math.max(1, Math.min(10000, Number(request.query.page) || 1)) | 0
  const query = typeof request.query.q === 'string' ? request.query.q.trim().slice(0, 100) : ''
  const tag = typeof request.query.tag === 'string' ? request.query.tag.trim().slice(0, 40) : ''
  const locale = request.query.locale === 'en' ? 'en' : 'vi'
  const filter: Filter<PostDocument> = { published: true }
  if (tag) filter.tags = tag
  if (query) {
    // Treat search text literally, including regex metacharacters such as + and [.
    const literal = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    filter.$or = [{ [`title.${locale}`]: { $regex: literal, $options: 'i' } }, { [`excerpt.${locale}`]: { $regex: literal, $options: 'i' } }, { tags: { $regex: literal, $options: 'i' } }]
  }
  const posts = await collection()
  const [items, total, tags] = await Promise.all([
    posts.find(filter, { projection: { content: 0 } }).sort({ publishedAt: -1, _id: -1 }).skip((page - 1) * 12).limit(12).toArray(),
    posts.countDocuments(filter),
    posts.distinct('tags', { published: true }),
  ])
  response.json({ posts: items.map(serialize), total, page, tags: tags.sort() })
})
router.get('/public/:slug', async (request, response) => {
  const post = await (await collection()).findOne({ slug: String(request.params.slug), published: true })
  if (!post) return response.status(404).json({ error: 'Post not found' })
  response.json({ post: serialize(post) })
})
router.use(requireAdmin)
router.get('/', async (_request, response) => {
  const posts = await (await collection()).find().sort({ updatedAt: -1 }).toArray()
  response.json({ posts: posts.map(serialize) })
})
router.post('/', async (request, response, next) => {
  const parsed = postSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: 'Invalid article. Check the slug and complete both languages before publishing.', details: parsed.error.flatten() })
  try {
    const now = new Date()
    const post: PostDocument = { ...parsed.data, createdAt: now, updatedAt: now, publishedAt: parsed.data.published ? now : null }
    const result = await (await collection()).insertOne(post)
    response.status(201).json({ post: serialize({ ...post, _id: result.insertedId }) })
  } catch (error) { handleWriteError(error, response, next) }
})
router.put('/:id', async (request, response, next) => {
  const id = readId(request.params.id)
  if (!id) return response.status(400).json({ error: 'Invalid post id' })
  const parsed = postSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: 'Invalid article. Check the slug and complete both languages before publishing.', details: parsed.error.flatten() })
  try {
    const posts = await collection()
    const current = await posts.findOne({ _id: id })
    if (!current) return response.status(404).json({ error: 'Post not found' })
    // Preserve the original publication date across edits and unpublishing.
    const post = await posts.findOneAndUpdate({ _id: id }, { $set: { ...parsed.data, updatedAt: new Date(), publishedAt: current.publishedAt ?? (parsed.data.published ? new Date() : null) } }, { returnDocument: 'after' })
    if (!post) return response.status(404).json({ error: 'Post not found' })
    response.json({ post: serialize(post) })
  } catch (error) { handleWriteError(error, response, next) }
})
router.delete('/:id', async (request, response) => {
  const id = readId(request.params.id)
  if (!id) return response.status(400).json({ error: 'Invalid post id' })
  const result = await (await collection()).deleteOne({ _id: id })
  if (!result.deletedCount) return response.status(404).json({ error: 'Post not found' })
  response.status(204).end()
})

function handleWriteError(error: unknown, response: import('express').Response, next: import('express').NextFunction) {
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) return response.status(409).json({ error: 'This slug already belongs to another article.' })
  next(error)
}
export default router

import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { getDb } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import type { ProjectDocument } from '../types.js'

const router = Router()
const localized = z.object({ vi: z.string().trim().min(1).max(2000), en: z.string().trim().min(1).max(2000) })
const projectSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(120),
  problem: localized,
  approach: localized,
  features: z.array(localized).max(12),
  stack: z.array(z.string().trim().min(1).max(60)).max(20),
  repository: z.union([z.string().url(), z.literal('')]).optional().transform(value => value || undefined),
  featured: z.boolean().default(true),
  published: z.boolean().default(true),
  position: z.number().int().min(0).max(999).default(0),
})

function readId(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : ''
}

function isDuplicateKey(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: unknown }).code === 11000
}

function serialize(project: ProjectDocument) {
  return {
    id: project._id?.toHexString(), slug: project.slug, name: project.name,
    problem: project.problem, approach: project.approach, features: project.features,
    stack: project.stack, repository: project.repository, featured: project.featured,
    published: project.published, position: project.position,
    createdAt: project.createdAt, updatedAt: project.updatedAt,
  }
}

router.get('/public', async (_request, response, next) => {
  try {
    const db = await getDb()
    const projects = await db.collection<ProjectDocument>('projects').find({ published: true }).sort({ position: 1, createdAt: 1 }).toArray()
    response.json({ projects: projects.map(serialize) })
  } catch (error) { next(error) }
})

router.get('/', requireAdmin, async (_request, response, next) => {
  try {
    const db = await getDb()
    const projects = await db.collection<ProjectDocument>('projects').find().sort({ position: 1, createdAt: 1 }).toArray()
    response.json({ projects: projects.map(serialize) })
  } catch (error) { next(error) }
})

router.post('/', requireAdmin, async (request, response, next) => {
  try {
    const parsed = projectSchema.safeParse(request.body)
    if (!parsed.success) return response.status(400).json({ error: 'Project data is invalid', details: parsed.error.flatten() })
    const now = new Date()
    const document: ProjectDocument = { ...parsed.data, createdAt: now, updatedAt: now }
    const db = await getDb()
    const result = await db.collection<ProjectDocument>('projects').insertOne(document)
    response.status(201).json({ project: serialize({ ...document, _id: result.insertedId }) })
  } catch (error: unknown) {
    if (isDuplicateKey(error)) return response.status(409).json({ error: 'Project slug already exists' })
    next(error)
  }
})

router.put('/:id', requireAdmin, async (request, response, next) => {
  try {
    const id = readId(request.params.id)
    if (!ObjectId.isValid(id)) return response.status(400).json({ error: 'Project id is invalid' })
    const parsed = projectSchema.safeParse(request.body)
    if (!parsed.success) return response.status(400).json({ error: 'Project data is invalid', details: parsed.error.flatten() })
    const db = await getDb()
    const result = await db.collection<ProjectDocument>('projects').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...parsed.data, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )
    if (!result) return response.status(404).json({ error: 'Project not found' })
    response.json({ project: serialize(result) })
  } catch (error: unknown) {
    if (isDuplicateKey(error)) return response.status(409).json({ error: 'Project slug already exists' })
    next(error)
  }
})

router.delete('/:id', requireAdmin, async (request, response, next) => {
  try {
    const id = readId(request.params.id)
    if (!ObjectId.isValid(id)) return response.status(400).json({ error: 'Project id is invalid' })
    const db = await getDb()
    const result = await db.collection<ProjectDocument>('projects').deleteOne({ _id: new ObjectId(id) })
    if (!result.deletedCount) return response.status(404).json({ error: 'Project not found' })
    response.status(204).end()
  } catch (error) { next(error) }
})

export default router

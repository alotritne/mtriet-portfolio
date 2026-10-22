import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { randomBytes } from 'node:crypto'
import express from 'express'
import { ObjectId } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { cleanArticle, postSchema } from '../src/blog-content.js'

let mongo: MongoMemoryServer
let app: express.Express
let authorization: string
let closeDatabase: () => Promise<void>

before(async () => {
  mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()
  process.env.MONGODB_DB = 'blog_tests'
  process.env.JWT_ACCESS_SECRET = randomBytes(32).toString('hex')
  process.env.JWT_REFRESH_SECRET = randomBytes(32).toString('hex')
  process.env.NODE_ENV = 'test'
  const db = await import('../src/db.js')
  closeDatabase = db.closeDatabase
  await db.ensureIndexes()
  const { signAccessToken } = await import('../src/auth/tokens.js')
  authorization = `Bearer ${signAccessToken(new ObjectId())}`
  app = (await import('../src/app.js')).default
})
after(async () => { await closeDatabase?.(); await mongo?.stop() })
const draft = {
  slug: 'blog-integration-test', title: { vi: 'Bài thử nghiệm', en: '' }, excerpt: { vi: '', en: '' },
  content: { vi: '<p>Nội dung <strong>in đậm</strong>.</p>', en: '' }, tags: ['Testing'], published: false,
}

test('HTML sanitizer preserves rich content and removes executable content', () => {
  const safe = cleanArticle('<h2>Heading</h2><p style="text-align:center;color:red" onclick="alert(1)">Text</p><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)"><a href="javascript:alert(1)">link</a><iframe src="https://example.com"></iframe><table><tr><td colspan="2">Cell</td></tr></table>')
  assert.ok(!/script|onclick|onerror|javascript|iframe|color:red/.test(safe))
  assert.ok(safe.includes('text-align:center'))
  assert.ok(safe.includes('<td colspan="2">Cell</td>'))
  assert.ok(cleanArticle('<img src="https://example.com/picture.png" alt="Diagram">').includes('src="https://example.com/picture.png"'))
  assert.ok(!cleanArticle('<img src="data:image/svg+xml,bad"><img src="//example.com/x">').includes('src='))
})
test('publishing requires both languages, while drafts allow incomplete content', () => {
  assert.equal(postSchema.safeParse(draft).success, true)
  assert.equal(postSchema.safeParse({ ...draft, published: true }).success, false)
  assert.equal(postSchema.safeParse({ ...draft, slug: '../invalid' }).success, false)
})
test('anonymous users cannot read drafts or mutate posts', async () => {
  await request(app).get('/api/posts').expect(401)
  await request(app).post('/api/posts').send(draft).expect(401)
  await request(app).put(`/api/posts/${new ObjectId()}`).send(draft).expect(401)
  await request(app).delete(`/api/posts/${new ObjectId()}`).expect(401)
})
test('MongoDB lifecycle: draft → publish → reload → edit → unpublish → delete', async () => {
  const created = await request(app).post('/api/posts').set('Authorization', authorization).send(draft).expect(201)
  const id = created.body.post.id as string
  assert.ok(id)
  await request(app).get(`/api/posts/public/${draft.slug}`).expect(404)
  assert.equal((await request(app).get('/api/posts/public')).body.total, 0)
  await request(app).post('/api/posts').set('Authorization', authorization).send(draft).expect(409)
  await request(app).put(`/api/posts/${id}`).set('Authorization', authorization).send({ ...draft, published: true }).expect(400)
  const published = { ...draft, published: true, title: { ...draft.title, en: 'Test article' }, excerpt: { vi: 'Mô tả thử nghiệm', en: 'Test description' }, content: { vi: draft.content.vi, en: '<p>Hello <em>world</em></p><script>alert(1)</script>' } }
  await request(app).put(`/api/posts/${id}`).set('Authorization', authorization).send(published).expect(200)
  const listing = await request(app).get('/api/posts/public').expect(200)
  assert.equal(listing.body.total, 1)
  assert.ok(listing.body.tags.includes('Testing'))
  assert.equal(listing.body.posts[0].content, undefined)
  assert.equal((await request(app).get('/api/posts/public?q=Test&locale=en')).body.total, 1)
  assert.equal((await request(app).get('/api/posts/public?q=not-present&locale=en')).body.total, 0)
  assert.equal((await request(app).get('/api/posts/public?tag=Testing')).body.total, 1)
  assert.equal((await request(app).get('/api/posts/public?q=%5B&locale=en')).body.total, 0)
  const reloaded = await request(app).get(`/api/posts/public/${draft.slug}`).expect(200)
  assert.equal(reloaded.body.post.content.en, '<p>Hello <em>world</em></p>')
  const originalDate = reloaded.body.post.publishedAt
  const edited = await request(app).put(`/api/posts/${id}`).set('Authorization', authorization).send({ ...published, title: { vi: 'Đã sửa', en: 'Edited' } }).expect(200)
  assert.equal(edited.body.post.publishedAt, originalDate)
  assert.equal((await request(app).get(`/api/posts/public/${draft.slug}`)).body.post.title.en, 'Edited')
  await request(app).put(`/api/posts/${id}`).set('Authorization', authorization).send(draft).expect(200)
  await request(app).get(`/api/posts/public/${draft.slug}`).expect(404)
  assert.equal((await request(app).get('/api/posts/public')).body.total, 0)
  assert.equal((await request(app).get('/api/posts').set('Authorization', authorization)).body.posts.length, 1)
  await request(app).delete(`/api/posts/${id}`).set('Authorization', authorization).expect(204)
  await request(app).delete(`/api/posts/${id}`).set('Authorization', authorization).expect(404)
  await request(app).put('/api/posts/invalid').set('Authorization', authorization).send(draft).expect(400)
})

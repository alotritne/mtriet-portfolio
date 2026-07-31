import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Router, type Request } from 'express'
import rateLimit from 'express-rate-limit'
import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { clearAuthCookies, refreshCookieName, setCsrfCookie, setRefreshCookie } from '../auth/cookies.js'
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../auth/tokens.js'
import { env } from '../config/env.js'
import { getDb } from '../db.js'
import { requireCsrf } from '../middleware/csrf.js'
import type { AdminDocument, RefreshTokenDocument } from '../types.js'

const router = Router()
const credentialsSchema = z.object({ email: z.string().email().transform(value => value.toLowerCase()), password: z.string().min(10).max(128) })
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
})
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many session refresh requests. Please try again shortly.' },
})

function requestMeta(request: Request) {
  return { userAgent: request.get('user-agent')?.slice(0, 300), ip: request.ip }
}

async function persistRefreshToken(userId: ObjectId, token: string, familyId: string, request: Request) {
  const db = await getDb()
  const document: RefreshTokenDocument = {
    userId,
    tokenHash: hashToken(token),
    familyId,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86_400_000),
    createdAt: new Date(),
    ...requestMeta(request),
  }
  await db.collection<RefreshTokenDocument>('refreshTokens').insertOne(document)
}

router.get('/csrf', (_request, response) => {
  const token = randomBytes(32).toString('base64url')
  setCsrfCookie(response, token)
  response.json({ csrfToken: token })
})

router.post('/login', loginLimiter, async (request, response, next) => {
  try {
    const result = credentialsSchema.safeParse(request.body)
    if (!result.success) return response.status(400).json({ error: 'Email or password format is invalid' })
    const db = await getDb()
    const admin = await db.collection<AdminDocument>('admins').findOne({ email: result.data.email })
    const passwordMatches = admin ? await bcrypt.compare(result.data.password, admin.passwordHash) : false
    if (!admin?._id || !passwordMatches) return response.status(401).json({ error: 'Email or password is incorrect' })

    const { token: refreshToken, familyId } = signRefreshToken(admin._id)
    await persistRefreshToken(admin._id, refreshToken, familyId, request)
    const csrfToken = randomBytes(32).toString('base64url')
    setRefreshCookie(response, refreshToken)
    setCsrfCookie(response, csrfToken)
    response.json({ accessToken: signAccessToken(admin._id), csrfToken, admin: { email: admin.email, role: admin.role } })
  } catch (error) { next(error) }
})

router.post('/refresh', refreshLimiter, requireCsrf, async (request, response) => {
  const token = request.cookies?.[refreshCookieName]
  if (typeof token !== 'string') return response.status(401).json({ error: 'Refresh token is missing' })
  try {
    const payload = verifyRefreshToken(token)
    const db = await getDb()
    const collection = db.collection<RefreshTokenDocument>('refreshTokens')
    const tokenHash = hashToken(token)
    const userId = new ObjectId(payload.sub)
    const nextToken = signRefreshToken(userId, payload.familyId)
    const nextHash = hashToken(nextToken.token)
    const stored = await collection.findOneAndUpdate(
      { tokenHash, familyId: payload.familyId, revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } },
      { $set: { revokedAt: new Date(), replacedByHash: nextHash } },
      { returnDocument: 'before' },
    )

    if (!stored) {
      await collection.updateMany({ familyId: payload.familyId, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } })
      clearAuthCookies(response)
      return response.status(401).json({ error: 'Refresh token reuse detected or token expired' })
    }

    const admin = await db.collection<AdminDocument>('admins').findOne({ _id: userId })
    if (!admin) {
      clearAuthCookies(response)
      return response.status(401).json({ error: 'Account no longer exists' })
    }

    await persistRefreshToken(userId, nextToken.token, nextToken.familyId, request)
    const csrfToken = randomBytes(32).toString('base64url')
    setRefreshCookie(response, nextToken.token)
    setCsrfCookie(response, csrfToken)
    response.json({ accessToken: signAccessToken(userId), csrfToken, admin: { email: admin.email, role: admin.role } })
  } catch {
    clearAuthCookies(response)
    return response.status(401).json({ error: 'Refresh token is invalid or expired' })
  }
})

router.post('/logout', requireCsrf, async (request, response, next) => {
  try {
    const token = request.cookies?.[refreshCookieName]
    if (typeof token === 'string') {
      const db = await getDb()
      await db.collection<RefreshTokenDocument>('refreshTokens').updateOne({ tokenHash: hashToken(token) }, { $set: { revokedAt: new Date() } })
    }
    clearAuthCookies(response)
    response.status(204).end()
  } catch (error) { next(error) }
})

export default router

import { createHash, randomUUID, timingSafeEqual } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { ObjectId } from 'mongodb'
import { env } from '../config/env.js'

export interface AccessPayload extends jwt.JwtPayload {
  sub: string
  role: 'admin'
  type: 'access'
}

export interface RefreshPayload extends jwt.JwtPayload {
  sub: string
  jti: string
  familyId: string
  type: 'refresh'
}

export function signAccessToken(userId: ObjectId) {
  return jwt.sign(
    { role: 'admin', type: 'access' },
    env.JWT_ACCESS_SECRET,
    { subject: userId.toHexString(), expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'], issuer: 'mtriet-portfolio-api', audience: 'mtriet-portfolio-admin' },
  )
}

export function signRefreshToken(userId: ObjectId, familyId: string = randomUUID()) {
  const jti = randomUUID()
  const token = jwt.sign(
    { jti, familyId, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { subject: userId.toHexString(), expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`, issuer: 'mtriet-portfolio-api', audience: 'mtriet-portfolio-admin' },
  )
  return { token, familyId }
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'mtriet-portfolio-api', audience: 'mtriet-portfolio-admin' }) as AccessPayload
  if (payload.type !== 'access' || payload.role !== 'admin' || !payload.sub) throw new Error('Invalid access token')
  return payload
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { issuer: 'mtriet-portfolio-api', audience: 'mtriet-portfolio-admin' }) as RefreshPayload
  if (payload.type !== 'refresh' || !payload.sub || !payload.jti || !payload.familyId) throw new Error('Invalid refresh token')
  return payload
}

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

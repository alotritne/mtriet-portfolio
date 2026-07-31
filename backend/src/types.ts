import type { ObjectId } from 'mongodb'

export interface AdminDocument {
  _id?: ObjectId
  email: string
  passwordHash: string
  role: 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface RefreshTokenDocument {
  _id?: ObjectId
  userId: ObjectId
  tokenHash: string
  familyId: string
  expiresAt: Date
  createdAt: Date
  revokedAt?: Date
  replacedByHash?: string
  userAgent?: string
  ip?: string
}

export interface ProjectDocument {
  _id?: ObjectId
  slug: string
  name: string
  problem: { vi: string; en: string }
  approach: { vi: string; en: string }
  features: Array<{ vi: string; en: string }>
  stack: string[]
  repository?: string
  featured: boolean
  published: boolean
  position: number
  createdAt: Date
  updatedAt: Date
}

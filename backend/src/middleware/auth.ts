import type { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { verifyAccessToken } from '../auth/tokens.js'

export interface AuthenticatedRequest extends Request {
  adminId?: ObjectId
}

export function requireAdmin(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const header = request.header('authorization')
  if (!header?.startsWith('Bearer ')) return response.status(401).json({ error: 'Authentication required' })
  try {
    const payload = verifyAccessToken(header.slice(7))
    request.adminId = new ObjectId(payload.sub)
    next()
  } catch {
    return response.status(401).json({ error: 'Access token is invalid or expired' })
  }
}

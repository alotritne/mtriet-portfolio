import type { NextFunction, Request, Response } from 'express'
import { csrfCookieName } from '../auth/cookies.js'
import { safeEqual } from '../auth/tokens.js'

export function requireCsrf(request: Request, response: Response, next: NextFunction) {
  const cookieToken = request.cookies?.[csrfCookieName]
  const headerToken = request.header('x-csrf-token')
  if (typeof cookieToken !== 'string' || typeof headerToken !== 'string' || !safeEqual(cookieToken, headerToken)) {
    return response.status(403).json({ error: 'CSRF validation failed' })
  }
  next()
}

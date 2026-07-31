import type { CookieOptions, Response } from 'express'
import { env, isProduction } from '../config/env.js'

export const refreshCookieName = 'portfolio_refresh'
export const csrfCookieName = 'portfolio_csrf'

const shared: CookieOptions = {
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/api/auth',
}

export function setRefreshCookie(response: Response, token: string) {
  response.cookie(refreshCookieName, token, {
    ...shared,
    httpOnly: true,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  })
}

export function setCsrfCookie(response: Response, token: string) {
  response.cookie(csrfCookieName, token, {
    ...shared,
    httpOnly: false,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookies(response: Response) {
  response.clearCookie(refreshCookieName, shared)
  response.clearCookie(csrfCookieName, shared)
}

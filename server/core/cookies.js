import { config } from './config.js'

const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'

const BASE_OPTS = {
  httpOnly: true,
  secure: config.isProd,
  sameSite: 'lax',
}

export function setAuthCookies(res, { token, refreshToken }) {
  res.cookie(ACCESS_COOKIE, token, {
    ...BASE_OPTS,
    maxAge: 15 * 60 * 1000,        // 15 min — matches JWT_EXPIRES_IN default
    path: '/',
  })
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...BASE_OPTS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth/refresh',         // scoped — only sent to refresh endpoint
    })
  }
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { path: '/' })
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth/refresh' })
}

/**
 * Read the access token from either the httpOnly cookie or the Authorization
 * header (kept for Socket.IO handshakes and future API clients).
 */
export function getTokenFromRequest(req) {
  // Cookie path (preferred — XSS-safe)
  const cookieHeader = req.headers.cookie ?? ''
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/)
  if (cookieMatch) return decodeURIComponent(cookieMatch[1])

  // Authorization header fallback (Socket.IO, Swagger, CLI tools)
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  return null
}

/**
 * Same helper for Socket.IO where req is socket.handshake.
 */
export function getTokenFromHandshake(handshake) {
  const cookieHeader = handshake.headers?.cookie ?? ''
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/)
  if (cookieMatch) return decodeURIComponent(cookieMatch[1])

  // Also accept auth header sent by socket client
  const auth = handshake.auth?.token ?? handshake.headers?.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)

  return null
}

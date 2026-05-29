import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { getVisitorLog, getVisitorStats, getVisitorCount, trackVisitor } from '../services/visitorTracker.js'
import { getTokenFromRequest } from '../core/cookies.js'
import { config } from '../core/config.js'

export function createVisitorsRouter(prisma) {
  const router = Router()

  function requireAdmin(req, res, next) {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      if (String(decoded.role || '').toUpperCase() !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' })
      }
      req.user = decoded
      return next()
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }

  router.post('/track', async (req, res) => {
    const sessionKey = req.headers['x-session-id'] || req.body?.sessionId || req.ip
    const page = req.body?.page || '/'

    // Dedup: skip if same session+page tracked in the last 60 seconds
    try {
      const oneMinAgo = new Date(Date.now() - 60 * 1000)
      const recent = await prisma.visitor.findFirst({
        where: {
          sessionId: sessionKey,
          page,
          timestamp: { gte: oneMinAgo },
        },
        select: { id: true },
      })
      if (recent) {
        return res.status(202).json({ ok: true, throttled: true })
      }
    } catch {
      // If dedup check fails, still attempt tracking
    }

    try {
      const visitor = await trackVisitor(req, {
        page,
        referrer: req.body?.referrer,
        sessionId: sessionKey,
      })
      return res.status(201).json({ ok: true, visitorId: visitor.id })
    } catch (error) {
      console.error('[visitors] track failed:', error)
      return res.status(202).json({ ok: true })
    }
  })

  router.get('/', requireAdmin, async (req, res) => {
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 50))
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const offset = (page - 1) * limit

    const [visitors, total] = await Promise.all([
      getVisitorLog(limit, offset),
      getVisitorCount(),
    ])

    return res.json({
      visitors,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    })
  })

  router.get('/stats', requireAdmin, async (req, res) => {
    return res.json(await getVisitorStats())
  })

  return router
}

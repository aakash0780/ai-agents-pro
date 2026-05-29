import { trackVisitor } from '../services/visitorTracker.js'

export function createTrackVisitMiddleware(prisma) {
  return function trackVisit(req, res, next) {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/assets') ||
      req.path.startsWith('/socket.io') ||
      req.path.includes('.')
    ) {
      return next()
    }

    const sessionKey = req.headers['x-session-id'] || req.headers['x-forwarded-for'] || req.ip

    // Fire-and-forget — dedup check runs async, request is not blocked
    ;(async () => {
      try {
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
        const recent = await prisma.visitor.findFirst({
          where: { sessionId: sessionKey, timestamp: { gte: fiveMinAgo } },
          select: { id: true },
        })
        if (!recent) {
          await trackVisitor(req, { sessionId: sessionKey })
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[visitor] tracking failed:', error)
        }
      }
    })()

    return next()
  }
}

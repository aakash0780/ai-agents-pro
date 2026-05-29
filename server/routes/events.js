import { Router } from 'express'
import { eventRateLimiter } from '../middleware/rateLimiter.js'
import { ctaEventSchema, validateBody } from '../middleware/validation.js'

export const eventsRouter = Router()

eventsRouter.post('/cta', eventRateLimiter, validateBody(ctaEventSchema), (req, res) => {
  const { event, label, page } = req.body

  if (process.env.NODE_ENV !== 'production') {
    console.log('[events] cta:', { event, label, page, timestamp: new Date().toISOString() })
  }

  return res.status(200).json({ ok: true })
})

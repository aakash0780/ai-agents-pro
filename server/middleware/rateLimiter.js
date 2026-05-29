import { rateLimit } from 'express-rate-limit'

function limiter(max, message) {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  })
}

export const contactRateLimiter = limiter(5, 'Too many requests. Please wait.')
export const newsletterRateLimiter = limiter(3, 'Too many requests. Please wait.')
export const eventRateLimiter = limiter(30, 'Too many requests. Please wait.')

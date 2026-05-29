import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  company: z.string().min(1, 'Company is required').max(120, 'Company is too long'),
  phone: z.string().max(30, 'Phone is too long').optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000, 'Message is too long'),
  service: z.string().max(120, 'Service is too long').optional(),
  companySize: z.string().max(50, 'Company size is too long').optional(),
  source: z.string().max(120, 'Source is too long').optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  source: z.string().max(120, 'Source is too long').optional(),
})

export const ctaEventSchema = z.object({
  event: z.literal('cta_click'),
  label: z.string().min(1, 'Label is required').max(120, 'Label is too long'),
  page: z.string().min(1, 'Page is required').max(200, 'Page is too long'),
})

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json({
          error: 'Validation failed',
          fields: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      return res.status(422).json({ error: 'Validation failed', fields: [] })
    }
  }
}

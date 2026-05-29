import { Router } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { newsletterRateLimiter } from '../middleware/rateLimiter.js'
import { newsletterSchema, validateBody } from '../middleware/validation.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const subscribersPath = path.resolve(__dirname, '../data/subscribers.json')

export const newsletterRouter = Router()

async function readSubscribers() {
  try {
    const raw = await fs.readFile(subscribersPath, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeSubscribers(subscribers) {
  await fs.writeFile(subscribersPath, `${JSON.stringify(subscribers, null, 2)}\n`, 'utf8')
}

async function sendWelcomeEmail(email) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const fromEmail = process.env.SMTP_USER || process.env.CONTACT_EMAIL || 'helpdesk@aiagentspro.in'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `AI Agents Pro <${fromEmail}>`,
      to: [email],
      subject: 'Welcome to AI Agents Pro updates',
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height:1.6; color:#101010;">
          <h2 style="margin:0 0 12px;">Welcome to AI Agents Pro</h2>
          <p>Thanks for subscribing. You will receive practical AI automation tips, case studies, and product updates.</p>
          <p>Need help now? WhatsApp us at +91 99677 89335.</p>
        </div>
      `,
    }),
  })
}

newsletterRouter.post('/subscribe', newsletterRateLimiter, validateBody(newsletterSchema), async (req, res) => {
  const payload = req.body

  try {
    const subscribers = await readSubscribers()
    const exists = subscribers.some(
      (item) => item.email.toLowerCase() === payload.email.toLowerCase(),
    )

    if (exists) {
      return res.status(409).json({ error: 'Already subscribed' })
    }

    subscribers.push({
      email: payload.email,
      source: payload.source || null,
      subscribedAt: new Date().toISOString(),
    })

    await writeSubscribers(subscribers)
    await sendWelcomeEmail(payload.email)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('[newsletter] failed:', error)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

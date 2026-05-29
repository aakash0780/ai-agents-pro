import { Router } from 'express'
import { contactRateLimiter } from '../middleware/rateLimiter.js'
import { contactSchema, validateBody } from '../middleware/validation.js'

export const contactRouter = Router()

async function sendResendEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

function adminEmailHtml(data) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #101010; line-height:1.5;">
      <h2 style="margin:0 0 12px;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Company Size:</strong> ${data.companySize || 'Not provided'}</p>
      <p><strong>Service:</strong> ${data.service || 'Not provided'}</p>
      <p><strong>Source:</strong> ${data.source || 'Not provided'}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br/>')}</p>
    </div>
  `
}

function autoReplyHtml(name) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #101010; line-height:1.6;">
      <h2 style="margin:0 0 12px;">Thanks for contacting AI Agents Pro</h2>
      <p>Hi ${name},</p>
      <p>We received your message and our team will get back to you within 4 business hours.</p>
      <p>If you need immediate support, reply on WhatsApp at +91 99677 89335.</p>
      <p>Regards,<br/>AI Agents Pro Team</p>
    </div>
  `
}

contactRouter.post('/', contactRateLimiter, validateBody(contactSchema), async (req, res) => {
  const payload = req.body

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[contact] submission:', {
        name: payload.name,
        email: payload.email,
        company: payload.company,
        service: payload.service || null,
      })
    }

    const contactEmail = process.env.CONTACT_EMAIL || 'helpdesk@aiagentspro.in'
    const fromEmail = process.env.SMTP_USER || contactEmail

    await Promise.allSettled([
      sendResendEmail({
        from: `AI Agents Pro <${fromEmail}>`,
        to: [contactEmail],
        subject: `New contact inquiry from ${payload.name}`,
        html: adminEmailHtml(payload),
      }),
      sendResendEmail({
        from: `AI Agents Pro <${fromEmail}>`,
        to: [payload.email],
        subject: 'We received your request — AI Agents Pro',
        html: autoReplyHtml(payload.name),
      }),
    ])

    return res.status(200).json({
      success: true,
      message: "We'll get back to you within 4 hours.",
    })
  } catch (error) {
    console.error('[contact] failed:', error)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

import nodemailer from 'nodemailer'

let transporter

function hasSmtpConfig() {
  const user = process.env.SMTP_USER || ''
  const pass = process.env.SMTP_PASS || ''
  return Boolean(
    process.env.SMTP_HOST &&
    user &&
    pass &&
    !user.startsWith('your-') &&
    !pass.startsWith('your-')
  )
}

function getTransporter() {
  if (!hasSmtpConfig()) return null

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  return transporter
}

export async function sendEmail({ to, subject, html, text }) {
  const smtp = getTransporter()
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@aiagentspro.in'

  if (!smtp) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[email] skipped; SMTP is not configured', { to, subject })
    }
    return { skipped: true }
  }

  return smtp.sendMail({
    from: `"AI Agents Pro" <${from}>`,
    to,
    subject,
    html,
    text,
  })
}

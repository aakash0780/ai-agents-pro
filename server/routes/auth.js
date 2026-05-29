import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { rateLimit } from 'express-rate-limit'
import { sendEmail } from '../utils/mailer.js'
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js'
import { hasPassportStrategy } from '../config/passport.js'
import { config } from '../core/config.js'
import { setAuthCookies, clearAuthCookies, getTokenFromRequest } from '../core/cookies.js'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function safeUser(user) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    company: user.company,
    avatar: user.avatar,
    role: user.role || 'USER',
    createdAt: user.createdAt,
  }
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function brandedEmail(content) {
  return `
    <div style="background:#050507;color:#f2f2f2;padding:40px;font-family:Inter,Arial,sans-serif;line-height:1.6;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #3d3a39;background:#101010;border-radius:8px;padding:28px;">
        <p style="margin:0 0 16px;color:#00d992;font-size:13px;letter-spacing:2px;text-transform:uppercase;">AI Agents Pro</p>
        ${content}
      </div>
    </div>
  `
}

export function createAuthRouter({ prisma, passport, frontendUrl }) {
  const router = Router()
  const appUrl = (frontendUrl || config.frontendUrl).replace(/\/$/, '')

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts, please try again later.' },
  })

  function generateTokens(user) {
    const payload = {
      id: user.id,
      userId: user.id,
      email: user.email,
      role: user.role || 'USER',
    }
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtAccessExpiry,
    })
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiry,
    })
    return { token, refreshToken }
  }

  function sendAuthResponse(res, user, message = 'Authenticated', statusCode = 200) {
    const cleanUser = safeUser(user)
    const tokens = generateTokens(cleanUser)
    setAuthCookies(res, tokens)
    // Tokens also returned in body for the initial migration window.
    // Frontend uses cookies; body tokens will be removed in a future PR.
    return res.status(statusCode).json({
      success: true,
      message,
      data: { user: cleanUser },
      user: cleanUser,
    })
  }

  async function findOrCreateEmailUser(email, name = null) {
    const cleanEmail = normalizeEmail(email)
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          password: null,
        },
      })
    }
    return user
  }

  function handleOAuthSuccess(req, res) {
    const user = safeUser(req.user)
    const tokens = generateTokens(user)
    // Set httpOnly cookies — no tokens in the URL
    setAuthCookies(res, tokens)
    return res.redirect(`${appUrl}/dashboard`)
  }

  function authenticateProvider(provider, options = {}) {
    return (req, res, next) => {
      if (!hasPassportStrategy(provider)) {
        return res.status(500).json({
          success: false,
          error: `${provider} auth is not configured`,
        })
      }
      return passport.authenticate(provider, options)(req, res, next)
    }
  }

  router.use(authLimiter)

  router.post(['/signup', '/register'], async (req, res) => {
    try {
      const { name, email, password, phone, company } = req.body
      const cleanEmail = normalizeEmail(email)

      if (!name || !cleanEmail || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' })
      }
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' })
      }

      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } })
      if (existing) {
        return res.status(400).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'User with this email already exists' },
          message: 'User with this email already exists',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          phone: phone || null,
          company: company || null,
        },
      })
      return sendAuthResponse(res, user, 'Account created', 201)
    } catch (error) {
      console.error('[auth] signup failed:', error)
      return res.status(500).json({ message: 'Unable to create account' })
    }
  })

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      const cleanEmail = normalizeEmail(email)

      if (!cleanEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const user = await prisma.user.findUnique({ where: { email: cleanEmail } })
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      return sendAuthResponse(res, user, 'Login successful')
    } catch (error) {
      console.error('[auth] login failed:', error)
      return res.status(500).json({ message: 'Unable to log in' })
    }
  })

  router.post('/refresh', async (req, res) => {
    try {
      // Refresh token is in the scoped httpOnly cookie (path: /api/auth/refresh)
      const cookieHeader = req.headers.cookie ?? ''
      const cookieMatch = cookieHeader.match(/(?:^|;\s*)refresh_token=([^;]+)/)
      const refreshToken = cookieMatch ? decodeURIComponent(cookieMatch[1]) : req.body?.refreshToken

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' })
      }

      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret)
      const user = await prisma.user.findUnique({ where: { id: decoded.userId || decoded.id } })
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' })
      }

      const tokens = generateTokens(user)
      setAuthCookies(res, tokens)
      return res.json({ success: true })
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }
  })

  router.post('/logout', (req, res) => {
    clearAuthCookies(res)
    req.logout?.(() => {})
    return res.json({ success: true, message: 'Logged out' })
  })

  router.post('/forgot-password', async (req, res) => {
    try {
      const cleanEmail = normalizeEmail(req.body.email)
      const user = cleanEmail ? await prisma.user.findUnique({ where: { email: cleanEmail } }) : null

      if (user?.password) {
        const resetToken = crypto.randomBytes(32).toString('hex')
        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })
        await prisma.passwordResetToken.create({
          data: {
            token: hashResetToken(resetToken),
            userId: user.id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        })

        const resetLink = `${appUrl}/reset-password?token=${resetToken}`
        await sendEmail({
          to: cleanEmail,
          subject: 'Reset your AI Agents Pro password',
          html: brandedEmail(`
            <h2 style="color:#00d992;margin:0 0 12px;">Reset your password</h2>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetLink}" style="background:#00d992;color:#050507;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block;margin-top:12px;">Reset password</a>
            <p style="color:#8b949e;font-size:12px;margin-top:18px;">If you did not request this, you can ignore this email.</p>
          `),
        })
      }

      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions.',
        ...(config.isProd ? {} : { devNote: 'Email sent (check SMTP logs)' }),
      })
    } catch (error) {
      console.error('[auth] forgot password failed:', error)
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions.',
      })
    }
  })

  router.post('/reset-password', async (req, res) => {
    try {
      const { token } = req.body
      const newPassword = req.body.newPassword || req.body.password

      if (!token || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: 'Valid token and password are required' })
      }

      const record = await prisma.passwordResetToken.findUnique({
        where: { token: hashResetToken(token) },
      })
      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired token' })
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: record.userId },
          data: { password: await bcrypt.hash(newPassword, 12) },
        }),
        prisma.passwordResetToken.delete({ where: { id: record.id } }),
      ])

      return res.json({ success: true, message: 'Password reset successful' })
    } catch (error) {
      console.error('[auth] reset password failed:', error)
      return res.status(500).json({ message: 'Unable to reset password' })
    }
  })

  router.post('/send-otp', async (req, res) => {
    try {
      const cleanEmail = normalizeEmail(req.body.email)
      if (!cleanEmail) {
        return res.status(400).json({ message: 'Email is required' })
      }

      const otp = generateOTP()
      await storeOTP(prisma, cleanEmail, otp)
      await sendEmail({
        to: cleanEmail,
        subject: 'Your AI Agents Pro login code',
        html: brandedEmail(`
          <h2 style="color:#00d992;margin:0 0 12px;">Your login code</h2>
          <p style="font-size:44px;font-weight:700;letter-spacing:8px;color:#00d992;margin:18px 0;">${otp}</p>
          <p style="color:#8b949e;">This code expires in 10 minutes.</p>
        `),
      })

      return res.json({
        success: true,
        message: 'OTP sent to email',
        ...(config.isProd ? {} : { otp }),
      })
    } catch (error) {
      console.error('[auth] send otp failed:', error)
      return res.status(500).json({ message: 'Unable to send OTP' })
    }
  })

  router.post('/verify-otp', async (req, res) => {
    try {
      const cleanEmail = normalizeEmail(req.body.email)
      const valid = await verifyOTP(prisma, cleanEmail, req.body.otp)

      if (!valid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' })
      }

      const user = await findOrCreateEmailUser(cleanEmail)
      return sendAuthResponse(res, user, 'OTP verified')
    } catch (error) {
      console.error('[auth] verify otp failed:', error)
      return res.status(500).json({ message: 'Unable to verify OTP' })
    }
  })

  // POST /api/auth/magic-link — send email with opaque one-time link
  router.post('/magic-link', async (req, res) => {
    try {
      const cleanEmail = normalizeEmail(req.body.email)
      if (!cleanEmail) {
        return res.status(400).json({ message: 'Email is required' })
      }

      // Generate an opaque 32-byte token (not a JWT — won't appear in logs as meaningful data)
      const opaqueToken = crypto.randomBytes(32).toString('hex')
      const user = await findOrCreateEmailUser(cleanEmail)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

      // Store in DB — persists across restarts, safe for multi-process
      await prisma.$transaction([
        prisma.magicLinkToken.deleteMany({ where: { userId: user.id } }),
        prisma.magicLinkToken.create({ data: { token: opaqueToken, userId: user.id, expiresAt } }),
      ])

      // Link goes to backend endpoint — never exposes JWTs in URLs
      const magicLink = `${appUrl}/api/auth/magic-link/verify?token=${opaqueToken}`

      await sendEmail({
        to: cleanEmail,
        subject: 'Your AI Agents Pro magic sign-in link',
        html: brandedEmail(`
          <h2 style="color:#00d992;margin:0 0 12px;">Sign in to AI Agents Pro</h2>
          <p>Use this secure link to complete your sign in. It expires in 15 minutes and can only be used once.</p>
          <a href="${magicLink}" style="background:#00d992;color:#050507;padding:12px 18px;border-radius:6px;text-decoration:none;font-weight:700;display:inline-block;margin-top:12px;">Sign in</a>
          <p style="color:#8b949e;font-size:12px;margin-top:18px;">If you did not request this, you can ignore this email.</p>
        `),
      })

      return res.json({
        success: true,
        message: 'Magic link sent',
        ...(config.isProd ? {} : { devNote: 'Check mailer output', magicLink }),
      })
    } catch (error) {
      console.error('[auth] magic link failed:', error)
      return res.status(500).json({ message: 'Unable to send magic link' })
    }
  })

  // GET /api/auth/magic-link/verify — browser hits this, sets cookie, redirects to dashboard
  router.get('/magic-link/verify', async (req, res) => {
    const { token } = req.query

    if (!token) {
      return res.redirect(`${appUrl}/login?error=invalid_magic_link`)
    }

    const record = await prisma.magicLinkToken.findUnique({ where: { token } })

    if (!record || record.expiresAt < new Date()) {
      if (record) await prisma.magicLinkToken.delete({ where: { id: record.id } }).catch(() => {})
      return res.redirect(`${appUrl}/login?error=magic_link_expired`)
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: record.userId } })
      if (!user) {
        return res.redirect(`${appUrl}/login?error=user_not_found`)
      }

      // Consume — one-time use
      await prisma.magicLinkToken.delete({ where: { id: record.id } })

      const tokens = generateTokens(safeUser(user))
      setAuthCookies(res, tokens)
      return res.redirect(`${appUrl}/dashboard`)
    } catch (error) {
      console.error('[auth] magic link verify failed:', error)
      return res.redirect(`${appUrl}/login?error=magic_link_failed`)
    }
  })

  router.get('/me', async (req, res) => {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      const user = await prisma.user.findUnique({ where: { id: decoded.userId || decoded.id } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json({ success: true, data: { user: safeUser(user) }, user: safeUser(user) })
    } catch {
      return res.status(401).json({ message: 'Invalid token' })
    }
  })

  router.put('/profile', async (req, res) => {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      const user = await prisma.user.update({
        where: { id: decoded.userId || decoded.id },
        data: {
          name: req.body.name ?? undefined,
          phone: req.body.phone ?? undefined,
          company: req.body.company ?? undefined,
        },
      })
      return res.json({ success: true, data: { user: safeUser(user) }, user: safeUser(user) })
    } catch (error) {
      console.error('[auth] profile update failed:', error)
      return res.status(500).json({ message: 'Unable to update profile' })
    }
  })

  router.get('/google', authenticateProvider('google', { scope: ['profile', 'email'] }))
  router.get('/google/callback',
    authenticateProvider('google', { session: false, failureRedirect: `${appUrl}/login?error=google_failed` }),
    handleOAuthSuccess,
  )

  router.get('/facebook', authenticateProvider('facebook', { scope: ['email', 'public_profile'] }))
  router.get('/facebook/callback',
    authenticateProvider('facebook', { session: false, failureRedirect: `${appUrl}/login?error=facebook_failed` }),
    handleOAuthSuccess,
  )

  router.get('/github', authenticateProvider('github', { scope: ['user:email'] }))
  router.get('/github/callback',
    authenticateProvider('github', { session: false, failureRedirect: `${appUrl}/login?error=github_failed` }),
    handleOAuthSuccess,
  )

  router.get('/linkedin', authenticateProvider('linkedin'))
  router.get('/linkedin/callback',
    authenticateProvider('linkedin', { session: false, failureRedirect: `${appUrl}/login?error=linkedin_failed` }),
    handleOAuthSuccess,
  )

  router.get('/apple', authenticateProvider('apple'))
  router.post('/apple/callback',
    authenticateProvider('apple', { session: false, failureRedirect: `${appUrl}/login?error=apple_failed` }),
    handleOAuthSuccess,
  )

  return router
}

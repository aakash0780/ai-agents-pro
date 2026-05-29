import fs from 'node:fs'
import { createRequire } from 'node:module'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const require = createRequire(import.meta.url)
const FacebookStrategy = require('passport-facebook').Strategy
const AppleStrategy = require('passport-apple').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

const PROVIDER_ID_FIELDS = {
  google: 'googleId',
  github: 'githubId',
  facebook: 'facebookId',
  apple: 'appleId',
  linkedin: 'linkedinId',
}

function isConfigured(value) {
  return Boolean(value && !String(value).startsWith('your-'))
}

function defaultCallback(provider, port) {
  return `http://localhost:${port}/api/auth/${provider}/callback`
}

function callbackUrl(provider) {
  const key = `${provider.toUpperCase()}_CALLBACK_URL`
  return process.env[key] || defaultCallback(provider, process.env.PORT || 3001)
}

function getApplePrivateKey() {
  if (process.env.APPLE_PRIVATE_KEY) {
    return process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }

  if (process.env.APPLE_PRIVATE_KEY_LOCATION && fs.existsSync(process.env.APPLE_PRIVATE_KEY_LOCATION)) {
    return fs.readFileSync(process.env.APPLE_PRIVATE_KEY_LOCATION, 'utf8')
  }

  return null
}

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role || 'USER',
  }
}

export async function findOrCreateOAuthUser(prisma, { provider, providerId, email, name, avatar }) {
  const cleanEmail = String(email || '').trim().toLowerCase()
  if (!cleanEmail) {
    throw new Error(`No email provided by ${provider}`)
  }

  const providerIdField = PROVIDER_ID_FIELDS[provider]
  const lookup = providerIdField
    ? {
        OR: [
          { [providerIdField]: String(providerId) },
          { email: cleanEmail },
        ],
      }
    : { email: cleanEmail }

  let user = await prisma.user.findFirst({ where: lookup })

  if (!user) {
    const randomPassword = cryptoRandomPassword()
    const hashedPassword = await bcrypt.hash(randomPassword, 10)
    const createData = {
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      password: hashedPassword,
      avatar: avatar || null,
      ...(providerIdField ? { [providerIdField]: String(providerId) } : {}),
    }

    try {
      user = await prisma.user.create({ data: createData })
    } catch (error) {
      if (!providerIdField) throw error
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          password: hashedPassword,
          avatar: avatar || null,
        },
      })
    }
  } else if (providerIdField && !user[providerIdField]) {
    try {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          [providerIdField]: String(providerId),
          avatar: user.avatar || avatar || null,
        },
      })
    } catch {
      user = await prisma.user.findUnique({ where: { id: user.id } })
    }
  }

  return normalizeUser(user)
}

function cryptoRandomPassword() {
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

function doneWithOAuthUser(prisma, provider, mapper) {
  return async (...args) => {
    const done = args.at(-1)
    const profile = args.at(-2)

    try {
      const user = await findOrCreateOAuthUser(prisma, mapper(profile, args))
      return done(null, user)
    } catch (error) {
      return done(error, null)
    }
  }
}

export function configurePassport({ prisma }) {
  if (isConfigured(process.env.GOOGLE_CLIENT_ID) && isConfigured(process.env.GOOGLE_CLIENT_SECRET)) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackUrl('google'),
      scope: ['profile', 'email'],
    }, doneWithOAuthUser(prisma, 'google', (profile) => ({
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    }))))
  }

  if (isConfigured(process.env.FACEBOOK_APP_ID) && isConfigured(process.env.FACEBOOK_APP_SECRET)) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: callbackUrl('facebook'),
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    }, doneWithOAuthUser(prisma, 'facebook', (profile) => ({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    }))))
  }

  if (isConfigured(process.env.GITHUB_CLIENT_ID) && isConfigured(process.env.GITHUB_CLIENT_SECRET)) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: callbackUrl('github'),
      scope: ['user:email'],
    }, doneWithOAuthUser(prisma, 'github', (profile) => ({
      provider: 'github',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
    }))))
  }

  const applePrivateKey = getApplePrivateKey()
  if (
    isConfigured(process.env.APPLE_CLIENT_ID) &&
    isConfigured(process.env.APPLE_TEAM_ID) &&
    isConfigured(process.env.APPLE_KEY_ID) &&
    applePrivateKey
  ) {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      callbackURL: callbackUrl('apple'),
      privateKeyString: applePrivateKey,
      passReqToCallback: true,
    }, async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        const decoded = jwt.decode(idToken, { json: true })
        const appleName = req.body?.user ? JSON.parse(req.body.user)?.name : null
        const name = appleName
          ? [appleName.firstName, appleName.lastName].filter(Boolean).join(' ')
          : 'Apple User'

        const user = await findOrCreateOAuthUser(prisma, {
          provider: 'apple',
          providerId: decoded?.sub,
          email: decoded?.email,
          name,
          avatar: null,
        })
        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }))
  }

  if (isConfigured(process.env.LINKEDIN_CLIENT_ID) && isConfigured(process.env.LINKEDIN_CLIENT_SECRET)) {
    passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: callbackUrl('linkedin'),
      scope: ['r_emailaddress', 'r_liteprofile'],
    }, doneWithOAuthUser(prisma, 'linkedin', (profile) => ({
      provider: 'linkedin',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
    }))))
  }

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } })
      done(null, user ? normalizeUser(user) : null)
    } catch (error) {
      done(error, null)
    }
  })

  return passport
}

export function hasPassportStrategy(provider) {
  return Boolean(passport._strategy(provider))
}

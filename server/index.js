import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
import crypto from 'crypto';
import { validate, signupSchema, loginSchema, profileUpdateSchema, forgotPasswordSchema, resetPasswordSchema, postSchema } from './validation.js';

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set in .env file');
  console.error('Please create a .env file with DATABASE_URL');
  process.exit(1);
}

// Check JWT_SECRET in production
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;
if (isProduction && (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production')) {
  console.error('❌ Error: JWT_SECRET must be set in production environment');
  console.error('Please set a strong, random JWT_SECRET in your .env file');
  process.exit(1);
}
const JWT_SECRET_FINAL = JWT_SECRET || 'your-secret-key-change-in-production'; // Fallback for dev only

// Import Prisma Client - use dynamic import to handle ESM/CommonJS
let PrismaClient;
try {
  const prismaModule = await import('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;
} catch (error) {
  console.error('❌ Error: Prisma Client not found. Please run: npx prisma generate');
  console.error('Make sure DATABASE_URL is set in .env file first');
  process.exit(1);
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const SOCIAL_PROVIDER_ID_FIELDS = {
  google: 'googleId',
  github: 'githubId',
  facebook: 'facebookId',
  apple: 'appleId',
};

const normalizeOrigin = (origin) => origin.trim().replace(/\/$/, '');
const allowedOrigins = Array.from(
  new Set(
    [
      FRONTEND_URL,
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
    ]
      .map((origin) => origin?.trim())
      .filter(Boolean)
      .map(normalizeOrigin)
  )
);

// Trust proxy when behind nginx/Docker so rate limit and X-Forwarded-* work correctly
app.set('trust proxy', 1);

// Security: Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding if needed
}));

app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header are not browser CORS requests.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting for auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use(passport.initialize());

// Passport Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;       // Services ID
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
const APPLE_KEY_ID = process.env.APPLE_KEY_ID;
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY;   // PEM string (use \n for newlines in .env)

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }));
}

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }));
}

if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    scope: ['email'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }));
}

if (APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY) {
  passport.use(new AppleStrategy({
    clientID: APPLE_CLIENT_ID,
    teamID: APPLE_TEAM_ID,
    keyID: APPLE_KEY_ID,
    callbackURL: "/api/auth/apple/callback",
    privateKeyString: APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    passReqToCallback: true,
  }, (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      const decoded = jwt.decode(idToken, { json: true });
      if (!decoded || !decoded.sub) {
        return done(new Error('Invalid Apple token'));
      }
      const email = decoded.email || null;
      const name = req.appleProfile?.name
        ? [req.appleProfile.name.firstName, req.appleProfile.name.lastName].filter(Boolean).join(' ')
        : null;
      const profileLike = {
        id: decoded.sub,
        emails: email ? [{ value: email }] : [],
        displayName: name || 'Apple User',
        photos: [],
      };
      return done(null, profileLike);
    } catch (err) {
      return done(err, null);
    }
  }));
}

// Helper to handle Social Login Result
const handleSocialLogin = async (req, res, profile, provider) => {
  try {
    const providerIdField = SOCIAL_PROVIDER_ID_FIELDS[provider];
    if (!providerIdField) {
      throw new Error(`Unsupported social auth provider: ${provider}`);
    }

    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=No_email_provided_by_${provider}`);
    }

    // Try to find user by specific provider ID first
    let user;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { [providerIdField]: profile.id },
            { email }
          ]
        }
      });
    } catch (dbLookupError) {
      console.error('Social login lookup error:', dbLookupError);
      throw new Error('Unable to load account');
    }

    // If database connection fails (e.g. schema not pushed), we can't proceed smoothly
    if (!user) {
      // Create new user
      // Note: Password is optional due to schema update. 
      // If schema update failed (npx prisma db push), this might throw if password is required.
      // We set a random password as fallback if DB still requires it and migration failed.
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      try {
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || profile.username,
            password: hashedPassword, // Provide a password just in case schema update failed
            [providerIdField]: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
          }
        });
      } catch (dbError) {
        // Fallback if googleId/githubId columns don't exist yet
        console.error(`DB Error (likely missing columns):`, dbError);
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName || profile.username,
            password: hashedPassword,
          }
        });
      }
    } else {
      // Update user with provider ID if missing (linking account)
      try {
        if (!user[providerIdField]) {
          await prisma.user.update({
            where: { id: user.id },
            data: { [providerIdField]: profile.id }
          });
        }
      } catch (updateError) {
        console.error('Failed to link account:', updateError);
      }
    }

    // Generate Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET_FINAL,
      { expiresIn: '7d' }
    );

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);

  } catch (error) {
    console.error('Social Login Error:', error);
    res.redirect(`${FRONTEND_URL}/auth/callback?error=Authentication_failed`);
  }
};


// Middleware to verify JWT token
const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
};

const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET_FINAL);

const authenticateToken = (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    req.user = verifyJwtToken(token);
    next();
  } catch {
    return res.status(403).json({ 
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
};

const tryAuthenticateToken = (req, _res, next) => {
  const token = extractBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    req.user = verifyJwtToken(token);
  } catch {
    req.invalidToken = true;
  }

  next();
};

/* --- Routes --- */

// Google Auth
app.get('/api/auth/google', (req, res, next) => {
  if (!GOOGLE_CLIENT_ID) return res.status(500).json({ error: "Google Auth not configured (Missing Client ID)" });
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => handleSocialLogin(req, res, req.user, 'google')
);

// GitHub Auth
app.get('/api/auth/github', (req, res, next) => {
  if (!GITHUB_CLIENT_ID) return res.status(500).json({ error: "GitHub Auth not configured (Missing Client ID)" });
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

app.get('/api/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => handleSocialLogin(req, res, req.user, 'github')
);

// Facebook Auth
app.get('/api/auth/facebook', (req, res, next) => {
  if (!FACEBOOK_APP_ID) return res.status(500).json({ error: 'Facebook Auth not configured (Missing App ID)' });
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});
app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => handleSocialLogin(req, res, req.user, 'facebook')
);

// Apple Auth (Apple POSTs to callback; strategy merges body into query)
app.get('/api/auth/apple', (req, res, next) => {
  if (!APPLE_CLIENT_ID) return res.status(500).json({ error: 'Apple Sign In not configured (Missing Client ID)' });
  passport.authenticate('apple')(req, res, next);
});
app.post('/api/auth/apple/callback', express.urlencoded({ extended: true }), (req, res, next) => {
  passport.authenticate('apple', (err, user) => {
    if (err) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(err.message || 'Apple_signin_failed')}`);
    }
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=Apple_signin_failed`);
    }
    handleSocialLogin(req, res, user, 'apple');
  })(req, res, next);
});

app.get('/api/auth/failure', (req, res) => {
  res.redirect(`${FRONTEND_URL}/auth/callback?error=OAuth_Provider_Failure`);
});


// Signup endpoint
app.post('/api/auth/signup', authLimiter, validate(signupSchema), async (req, res) => {
  try {
    const { email, password, name, phone, company } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    }).catch(err => {
      console.error("DB Error:", err);
      return null;
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          phone: phone || null,
          company: company || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          company: true,
          role: true,
          createdAt: true,
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET_FINAL,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
        message: 'User created successfully',
      });
    } catch (dbError) {
      console.error('DB Create Error:', dbError);
      return res.status(500).json({ 
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database error creating user. Please try again.',
        },
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// Login endpoint
app.post('/api/auth/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    }).catch(() => null);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    // Treat null password as invalid for password login (must use social)
    if (!user.password) {
      return res.status(401).json({ 
        success: false,
        error: {
          code: 'SOCIAL_LOGIN_REQUIRED',
          message: 'Please log in with your social account',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET_FINAL,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          company: user.company,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// Forgot password: create reset token and return (no email sent; link returned in dev)
app.post('/api/auth/forgot-password', authLimiter, validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user || !user.password) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions.',
      });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });
    const resetLink = `${FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${token}`;
    if (!isProduction) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive reset instructions.',
        resetLink,
      });
    }
    // TODO: send email with resetLink when SMTP is configured
    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive reset instructions.',
    });
  }
});

// Reset password: validate token and set new password
app.post('/api/auth/reset-password', authLimiter, validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OR_EXPIRED_TOKEN',
          message: 'Reset link is invalid or has expired. Please request a new one.',
        },
      });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.delete({ where: { id: record.id } }),
    ]);
    res.json({
      success: true,
      message: 'Password has been reset. You can now sign in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unable to reset password. Please try again.',
      },
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // We add try-catch in case Prisma fails to connect or fields mismatch
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          company: true,
          role: true,
          createdAt: true,
        }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      res.json({ 
        success: true,
        data: { user },
      });
    } catch (prismaError) {
      console.error("Prisma Error in /me:", prismaError);
      return res.status(500).json({ 
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database error',
        },
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// Update user profile endpoint
app.put('/api/auth/profile', authenticateToken, validate(profileUpdateSchema), async (req, res) => {
  try {
    const { name, phone, company } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: name !== undefined ? name : undefined,
        phone: phone !== undefined ? phone : undefined,
        company: company !== undefined ? company : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        role: true,
        createdAt: true,
      }
    });

    res.json({
      success: true,
      data: { user },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  }
});

// --- Blog / Posts (AI & Technology) ---
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'post';
}

async function getUniquePostSlug(baseSlug, excludeId) {
  let slug = baseSlug;
  let counter = 0;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function canManagePost(user, post) {
  return user?.role === 'ADMIN' || user?.userId === post.authorId;
}

// List posts (published only for public; `?published=false` requires auth and includes caller drafts)
app.get('/api/posts', generalLimiter, tryAuthenticateToken, async (req, res) => {
  try {
    const publishedOnly = req.query.published !== 'false';

    if (!publishedOnly) {
      if (req.invalidToken) {
        return res.status(403).json({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
        });
      }

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          error: { code: 'AUTH_REQUIRED', message: 'Authentication is required to view unpublished posts' },
        });
      }
    }

    const where = publishedOnly
      ? { publishedAt: { not: null } }
      : req.user.role === 'ADMIN'
        ? {}
        : {
            OR: [
              { publishedAt: { not: null } },
              { authorId: req.user.userId },
            ],
          };

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.json({ success: true, data: { posts } });
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch posts' },
    });
  }
});

// Get single post by slug
app.get('/api/posts/:slug', generalLimiter, tryAuthenticateToken, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Post not found' },
      });
    }

    if (!post.publishedAt && req.invalidToken) {
      return res.status(403).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    if (!post.publishedAt && !canManagePost(req.user, post)) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Post not found' },
      });
    }
    res.json({ success: true, data: { post } });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch post' },
    });
  }
});

// Create post (authenticated)
app.post('/api/posts', generalLimiter, authenticateToken, validate(postSchema), async (req, res) => {
  try {
    const { title, excerpt, content, slug: slugInput } = req.body;
    const slug = await getUniquePostSlug((slugInput && slugify(slugInput)) || slugify(title));
    const post = await prisma.post.create({
      data: {
        title,
        excerpt: excerpt || null,
        content,
        slug,
        authorId: req.user.userId,
        publishedAt: new Date(), // publish immediately by default
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create post' },
    });
  }
});

// Update post (author or admin)
app.put('/api/posts/:id', generalLimiter, authenticateToken, validate(postSchema), async (req, res) => {
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Post not found' },
      });
    }

    if (!canManagePost(req.user, existingPost)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to edit this post' },
      });
    }

    const { title, excerpt, content, slug: slugInput } = req.body;
    const slug = await getUniquePostSlug(
      (slugInput && slugify(slugInput)) || slugify(title),
      existingPost.id
    );

    const post = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        slug,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: { post },
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update post' },
    });
  }
});

// Delete post (author or admin)
app.delete('/api/posts/:id', generalLimiter, authenticateToken, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Post not found' },
      });
    }

    if (!canManagePost(req.user, post)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this post' },
      });
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete post' },
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    data: { 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'Server is running' 
  });
});

// API root endpoint - lists available endpoints
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Agents API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      google: 'GET /api/auth/google',
      github: 'GET /api/auth/github',
      facebook: 'GET /api/auth/facebook',
      apple: 'GET /api/auth/apple',
      me: 'GET /api/auth/me',
      profile: 'PUT /api/auth/profile'
    },
    docs: 'This is the backend API server. Access the frontend at http://localhost:5173'
  });
});

// Root route - API info
app.get('/', (req, res) => {
  res.json({
    message: 'AI Agents API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      google: 'GET /api/auth/google',
      github: 'GET /api/auth/github',
      facebook: 'GET /api/auth/facebook',
      apple: 'GET /api/auth/apple',
      me: 'GET /api/auth/me',
      profile: 'PUT /api/auth/profile'
    },
    docs: 'This is the backend API server. Access the frontend at http://localhost:5173'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      path: req.path,
      method: req.method,
    },
    hint: 'Make sure you are using the correct HTTP method (GET, POST, etc.)'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

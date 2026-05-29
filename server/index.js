import express from 'express';
import http from 'node:http';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import passport from 'passport';
import session from 'express-session';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { validate, leadSchema, postSchema } from './validation.js';
import { contactRouter } from './routes/contact.js';
import { blogRouter } from './routes/blog.js';
import { newsletterRouter } from './routes/newsletter.js';
import { eventsRouter } from './routes/events.js';
import { configurePassport } from './config/passport.js';
import { createAuthRouter } from './routes/auth.js';
import { createVisitorsRouter } from './routes/visitors.js';
import { createTrackVisitMiddleware } from './middleware/trackVisit.js';
import { initVisitorTracker } from './services/visitorTracker.js';
import { config } from './core/config.js';
import { getTokenFromRequest, getTokenFromHandshake } from './core/cookies.js';

if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL is not set in .env file');
  process.exit(1);
}

let PrismaClient;
try {
  const prismaModule = await import('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;
} catch {
  console.error('❌ Error: Prisma Client not found. Please run: npx prisma generate');
  process.exit(1);
}

const app = express();
const prisma = new PrismaClient();

const normalizeOrigin = (origin) => origin.trim().replace(/\/$/, '');
const allowedOrigins = Array.from(
  new Set(
    [
      'https://aiagentspro.in',
      'https://www.aiagentspro.in',
      'http://localhost:5173',
      config.frontendUrl,
      ...(config.allowedOrigins ? config.allowedOrigins.split(',') : []),
    ]
      .map((o) => o?.trim())
      .filter(Boolean)
      .map(normalizeOrigin)
  )
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initVisitorTracker(io, prisma);

io.on('connection', (socket) => {
  socket.on('join-admin', () => {
    try {
      const token = getTokenFromHandshake(socket.handshake);
      if (!token) return socket.emit('admin-error', { message: 'No token' });
      const decoded = jwt.verify(token, config.jwtSecret);
      if (String(decoded.role || '').toUpperCase() === 'ADMIN') {
        socket.join('admin-room');
        socket.emit('admin-joined', { message: 'Connected to real-time visitor stream' });
      }
    } catch {
      socket.emit('admin-error', { message: 'Invalid admin token' });
    }
  });
});

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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

app.use(createTrackVisitMiddleware(prisma));
app.use('/api/', generalLimiter);
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProd,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/contact', contactRouter);
app.use('/api/blog', blogRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/events', eventsRouter);

configurePassport({ prisma });
app.use('/api/auth', createAuthRouter({ prisma, passport, frontendUrl: config.frontendUrl }));
app.use('/api/visitors', createVisitorsRouter(prisma));

/* --- Auth middleware (used by post/lead routes below) --- */

const authenticateToken = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
  }
};

const tryAuthenticateToken = (req, _res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return next();
  try {
    req.user = jwt.verify(token, config.jwtSecret);
  } catch {
    req.invalidToken = true;
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access is required for this action' },
    });
  }
  next();
};

/* --- Blog / Posts --- */

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
    if (!existing || existing.id === excludeId) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function canManagePost(user, post) {
  return user?.role === 'ADMIN' || user?.userId === post.authorId;
}

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
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });
    res.json({
      success: true,
      data: {
        posts: posts.map((post) => ({
          ...post,
          contentPreview: post.content.slice(0, 160),
          content: undefined,
        })),
      },
    });
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch posts' },
    });
  }
});

app.get('/api/posts/:slug', generalLimiter, tryAuthenticateToken, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { id: true, name: true, email: true } } },
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

app.post('/api/posts', generalLimiter, authenticateToken, requireAdmin, validate(postSchema), async (req, res) => {
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
        publishedAt: new Date(),
      },
      include: { author: { select: { id: true, name: true, email: true } } },
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

app.put('/api/posts/:id', generalLimiter, authenticateToken, validate(postSchema), async (req, res) => {
  try {
    const existingPost = await prisma.post.findUnique({ where: { id: req.params.id } });
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
      data: { title, excerpt: excerpt || null, content, slug },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
    res.json({ success: true, data: { post }, message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update post' },
    });
  }
});

app.delete('/api/posts/:id', generalLimiter, authenticateToken, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
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
    await prisma.post.delete({ where: { id: post.id } });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete post' },
    });
  }
});

/* --- Leads --- */

function normalizeNullable(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

app.post('/api/leads', generalLimiter, validate(leadSchema), async (req, res) => {
  try {
    const tools = Array.isArray(req.body.currentTools)
      ? req.body.currentTools
          .map((tool) => (typeof tool === 'string' ? tool.trim() : ''))
          .filter(Boolean)
      : [];

    const lead = await prisma.lead.create({
      data: {
        fullName: req.body.fullName.trim(),
        email: req.body.email.trim(),
        phone: normalizeNullable(req.body.phone),
        companyName: req.body.companyName.trim(),
        companyWebsite: normalizeNullable(req.body.companyWebsite),
        industry: normalizeNullable(req.body.industry),
        companySize: normalizeNullable(req.body.companySize),
        primaryGoal: req.body.primaryGoal.trim(),
        currentTools: tools,
        conversationVolume: normalizeNullable(req.body.conversationVolume),
        biggestChallenge: req.body.biggestChallenge.trim(),
        preferredContactMethod: normalizeNullable(req.body.preferredContactMethod),
        message: normalizeNullable(req.body.message),
      },
      select: { id: true, status: true, createdAt: true },
    });

    res.status(201).json({
      success: true,
      data: { lead },
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to submit lead details' },
    });
  }
});

/* --- Utility routes --- */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

const apiInfo = {
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
    linkedin: 'GET /api/auth/linkedin',
    refresh: 'POST /api/auth/refresh',
    otp: 'POST /api/auth/send-otp',
    visitors: 'GET /api/visitors',
    leads: 'POST /api/leads',
    contact: 'POST /api/contact',
    blogPosts: 'GET /api/blog/posts',
    blogPost: 'GET /api/blog/posts/:slug',
    newsletter: 'POST /api/newsletter/subscribe',
    ctaEvent: 'POST /api/events/cta',
    me: 'GET /api/auth/me',
    profile: 'PUT /api/auth/profile',
  },
};

app.get('/api', (req, res) => res.json(apiInfo));
app.get('/', (req, res) => res.json(apiInfo));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
});

// Periodic cleanup: expired short-lived tokens and visitor records older than 90 days
async function runCleanup() {
  const now = new Date()
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000)
  await Promise.allSettled([
    prisma.otpToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.magicLinkToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.passwordResetToken.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.visitor.deleteMany({ where: { timestamp: { lt: ninetyDaysAgo } } }),
  ])
}
// Run once at startup and then every 6 hours
runCleanup().catch(() => {})
setInterval(runCleanup, 6 * 60 * 60 * 1000)

server.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
  console.log(`API endpoints available at http://localhost:${config.port}/api`);
});

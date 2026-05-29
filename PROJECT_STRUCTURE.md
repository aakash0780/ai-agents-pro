# Project Structure

This document describes the current file-system hierarchy for the AI Agents Pro project.

## Root Level

```text
ai-web-main/
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .vscode/
│   └── extensions.json
├── docs/
│   ├── audits/
│   ├── setup/
│   ├── AGENTS.md
│   ├── AI_AUTOMATION_BUSINESS_BLUEPRINT.md
│   └── README.md
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── check-env.js
│   ├── fix-db-permissions.sh
│   ├── fix-permissions-quick.sh
│   ├── run.sh
│   ├── setup-env.sh
│   ├── verify-env.js
│   ├── verify-setup.sh
│   └── README.md
├── server/
│   ├── config/
│   ├── data/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── docker-entrypoint.sh
│   ├── index.js
│   └── validation.js
├── src/
│   ├── components/
│   ├── constants/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── BACKEND_OPTIMIZATION_SUMMARY.md
├── DOCKER_AND_CI.md
├── Dockerfile.backend
├── Dockerfile.frontend
├── FRONTEND_OPTIMIZATION_SUMMARY.md
├── README.md
├── components.json
├── docker-compose.yml
├── eslint.config.js
├── index.html
├── jsconfig.json
├── nginx.conf
├── package.json
├── pnpm-lock.yaml
└── vite.config.js
```

Generated or local-only directories such as `node_modules/`, `dist/`, `.git/`, `.cursor/`, and local `.env` files are intentionally excluded from the canonical hierarchy.

## Frontend Source

```text
src/
├── components/
│   ├── landing/                 # Home-page immersive/interactive sections
│   ├── shared/                  # Reusable marketing helpers
│   ├── ui/                      # Radix/shadcn-style primitives
│   ├── FeaturedIntegrationsSection.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── SEO.jsx
│   └── TopProgressBar.jsx
├── constants/
│   ├── blog.js
│   ├── featured-integrations.js
│   ├── integrations.js
│   ├── pricing.js
│   ├── services.js
│   ├── site.js
│   └── team.js
├── contexts/
│   ├── AuthContext.jsx
│   └── auth-context.js
├── hooks/
│   ├── useAuth.js
│   ├── useBlogPosts.js
│   ├── useFormField.js
│   ├── useScrollReveal.js
│   ├── useTheme.js
│   └── useVisitorTracking.js
├── lib/
│   ├── analytics.js
│   ├── api.js
│   └── utils.js
├── pages/
│   ├── admin/
│   │   └── VisitorDashboard.jsx
│   ├── LandingHomePage.jsx
│   ├── GetStartedPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── ClientProfitDashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── BlogPage.jsx
│   ├── BlogPostPage.jsx
│   └── NewPostPage.jsx
├── styles/
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

## Backend Source

```text
server/
├── config/
│   └── passport.js             # OAuth provider setup
├── data/
│   ├── blog-posts.json         # Public blog content source
│   └── subscribers.json        # Local newsletter fallback/storage
├── middleware/
│   ├── rateLimiter.js
│   ├── trackVisit.js
│   └── validation.js
├── routes/
│   ├── auth.js
│   ├── blog.js                 # Static public blog API under /api/blog
│   ├── contact.js
│   ├── events.js
│   ├── newsletter.js
│   └── visitors.js
├── services/
│   └── visitorTracker.js
├── utils/
│   ├── mailer.js
│   └── otp.js
├── docker-entrypoint.sh
├── index.js                    # Main Express app and Prisma-backed APIs
└── validation.js               # Zod request schemas
```

## Route Map

Public frontend routes:

- `/`
- `/services`
- `/pricing`
- `/about`
- `/blog`
- `/blog/:slug`
- `/contact`
- `/get-started`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/auth/callback`

Protected frontend routes:

- `/dashboard`
- `/client-profit-dashboard`
- `/profile`
- `/blog/new`
- `/blog/:slug/edit`
- `/admin/visitors` (admin)

## Documentation

```text
docs/
├── audits/
│   ├── COMPREHENSIVE_PROJECT_REVIEW.md
│   ├── TECHNICAL_UI_AUDIT.md
│   ├── UI_AUDIT_REPORT.md
│   └── UNUSED_FILES_REPORT.md
├── setup/
│   ├── AUTHENTICATION_FEATURES.md
│   ├── FIX_PERMISSIONS.md
│   ├── QUICK_START.md
│   ├── SETUP.md
│   └── TROUBLESHOOTING_SIGNUP.md
├── AGENTS.md
├── AI_AUTOMATION_BUSINESS_BLUEPRINT.md
└── README.md
```

## Operational Files

- `docker-compose.yml`: local production-style stack with Postgres, backend, and nginx frontend.
- `Dockerfile.frontend`: builds Vite app and serves it through nginx.
- `Dockerfile.backend`: builds the Node/Express backend and Prisma client.
- `nginx.conf`: SPA fallback plus `/api` and `/socket.io` proxying to the backend container.
- `vite.config.js`: React/Tailwind build config plus local dev proxy for `/api` and `/socket.io`.

Last updated: April 30, 2026

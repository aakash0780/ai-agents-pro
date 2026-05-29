const isProd = process.env.NODE_ENV === 'production'

function requireProd(key) {
  const val = process.env[key]
  if (isProd && (!val || val.startsWith('your-'))) {
    console.error(`❌ ${key} must be set in production`)
    process.exit(1)
  }
  return val
}

export const config = {
  isProd,
  port: parseInt(process.env.PORT ?? '3001'),
  frontendUrl: (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, ''),

  jwtSecret: requireProd('JWT_SECRET') ?? 'dev-insecure-secret-do-not-use-in-prod',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ??
    process.env.JWT_SECRET ??
    'dev-insecure-refresh-secret',
  jwtAccessExpiry: process.env.JWT_EXPIRES_IN ?? '15m',
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',

  sessionSecret:
    process.env.SESSION_SECRET ??
    process.env.JWT_SECRET ??
    'dev-insecure-session-secret',

  databaseUrl: process.env.DATABASE_URL,
  allowedOrigins: process.env.ALLOWED_ORIGINS,
}

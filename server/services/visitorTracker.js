import { createRequire } from 'node:module'
import { sendEmail } from '../utils/mailer.js'

const require = createRequire(import.meta.url)
const UAParser = require('ua-parser-js')
const geoip = require('geoip-lite')

let io
let prisma
let lastAlertTime = 0

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
}

function normalizeIp(ip) {
  if (ip === '::1' || ip === '::ffff:127.0.0.1') return '127.0.0.1'
  return ip
}

export function initVisitorTracker(socketIo, prismaClient) {
  io = socketIo
  prisma = prismaClient
}

export async function trackVisitor(req, overrides = {}) {
  const rawIp = normalizeIp(getIp(req))
  const userAgent = req.headers['user-agent'] || overrides.userAgent || ''
  const parsed = new UAParser(userAgent).getResult()
  const geo = geoip.lookup(rawIp) || {}

  const sessionId = overrides.sessionId || req.headers['x-session-id'] || req.body?.sessionId || 'unknown'
  const page = overrides.page || req.body?.page || req.headers.referer || req.path || '/'
  const referrer = overrides.referrer || req.body?.referrer || req.headers.referer || 'direct'

  const data = {
    sessionId,
    ip: rawIp,
    page,
    city: geo.city || 'Unknown',
    region: geo.region || '',
    country: geo.country || 'Unknown',
    timezone: geo.timezone || '',
    browser: `${parsed.browser.name || 'Unknown'} ${parsed.browser.version || ''}`.trim(),
    os: `${parsed.os.name || 'Unknown'} ${parsed.os.version || ''}`.trim(),
    device: parsed.device.type || 'desktop',
    deviceModel: parsed.device.model || '',
    referrer,
    language: req.headers['accept-language']?.split(',')[0] || 'unknown',
  }

  const visitor = prisma
    ? await prisma.visitor.create({ data })
    : { id: `${Date.now()}`, ...data, timestamp: new Date().toISOString() }

  if (io) {
    io.to('admin-room').emit('new-visitor', visitor)
  }

  await sendVisitorAlert(visitor)
  return visitor
}

async function sendVisitorAlert(visitor) {
  const now = Date.now()
  if (now - lastAlertTime < 60 * 1000) return
  lastAlertTime = now

  const adminEmail = process.env.ALERT_EMAIL
  if (!adminEmail) return

  await sendEmail({
    to: adminEmail,
    subject: `New visitor on AI Agents Pro - ${visitor.city}, ${visitor.country}`,
    html: `
      <div style="background:#050507;color:#f2f2f2;padding:32px;font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #3d3a39;border-radius:8px;">
        <h2 style="margin:0;color:#00d992;font-size:20px;">New Visitor Alert</h2>
        <p style="margin:4px 0 20px;color:#8b949e;font-size:13px;">${escapeHtml(new Date(visitor.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))} IST</p>
        <table style="width:100%;border-collapse:collapse;">
          ${[
            ['Location', `${visitor.city}, ${visitor.region}, ${visitor.country}`],
            ['Device', `${visitor.device}${visitor.deviceModel ? ` (${visitor.deviceModel})` : ''}`],
            ['Browser', visitor.browser],
            ['OS', visitor.os],
            ['Page', visitor.page],
            ['Referrer', visitor.referrer],
            ['Language', visitor.language],
            ['IP', visitor.ip],
          ].map(([label, value]) => `
            <tr style="border-bottom:1px solid #3d3a39;">
              <td style="padding:12px 0;color:#8b949e;font-size:13px;width:140px;">${escapeHtml(label)}</td>
              <td style="padding:12px 0;color:#f2f2f2;font-size:14px;">${escapeHtml(value)}</td>
            </tr>
          `).join('')}
        </table>
        <a href="${escapeHtml(process.env.FRONTEND_URL || 'http://localhost:5173')}/admin/visitors" style="display:inline-block;margin-top:20px;background:#00d992;color:#050507;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">View dashboard</a>
      </div>
    `,
  })
}

export async function getVisitorLog(limit = 50, offset = 0) {
  if (!prisma) return []
  return prisma.visitor.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
    skip: offset,
  })
}

export async function getVisitorCount() {
  if (!prisma) return 0
  return prisma.visitor.count()
}

export async function getVisitorStats() {
  if (!prisma) return { total: 0, today: 0, countries: 0, devices: {}, recent: [] }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [total, todayCount, countryAgg, deviceAgg, recent] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({ where: { timestamp: { gte: todayStart } } }),
    prisma.visitor.groupBy({ by: ['country'], _count: { country: true } }),
    prisma.visitor.groupBy({ by: ['device'], _count: { device: true } }),
    prisma.visitor.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
  ])

  return {
    total,
    today: todayCount,
    countries: countryAgg.length,
    devices: Object.fromEntries(deviceAgg.map((d) => [d.device, d._count.device])),
    recent,
  }
}

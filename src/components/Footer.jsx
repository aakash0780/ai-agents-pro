import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Linkedin, MessageCircle, Phone, Youtube } from 'lucide-react'
import { subscribeNewsletter } from '@/utils/api'
import { EMAIL, LINKS, PHONE, TAGLINE } from '@/utils/constants'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleSubscribe = async (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setStatus('Enter an email address.')
      return
    }

    setSubmitting(true)
    setStatus('')

    try {
      await subscribeNewsletter({ email, source: 'footer' })
      setStatus('Subscribed successfully.')
      setEmail('')
    } catch (error) {
      setStatus(error?.error || error?.message || 'Unable to subscribe right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="border-t border-[var(--border)] bg-[#050507]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="logo-glow flex h-10 w-10 items-center justify-center rounded-lg border border-[#3d3a39] bg-[#101010]">
              <Bot className="h-5 w-5 text-[#00d992]" />
            </span>
            <div>
              <p className="font-semibold text-[#f2f2f2]">AI Agents Pro</p>
              <p className="text-sm text-[#b8b3b0]">{TAGLINE}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#8b949e]">
            Sales, support, and customer automation for teams that want measurable growth.
          </p>

          <form className="mt-5 space-y-2" onSubmit={handleSubscribe}>
            <label htmlFor="footer-newsletter" className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">
              Newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-10 w-full rounded-lg border border-[#3d3a39] bg-[#101010] px-3 text-sm text-[#f2f2f2] outline-none focus:border-[#00d992]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#00d992] px-4 text-sm font-semibold text-[#050507] disabled:opacity-60"
              >
                {submitting ? '...' : 'Join'}
              </button>
            </div>
            {status ? <p className="text-xs text-[#b8b3b0]">{status}</p> : null}
          </form>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2f2f2]">Product</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/services" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Services</Link>
            <Link to="/pricing" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Pricing</Link>
            <a href={LINKS.watchDemo} target="_blank" rel="noopener noreferrer" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">
              Watch Demo
            </a>
            <Link to="/blog" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Blog</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2f2f2]">Company</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/about" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">About</Link>
            <Link to="/blog" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Blog</Link>
            <span className="text-[#6f7278]">Careers (Coming Soon)</span>
            <Link to="/contact" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Contact</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2f2f2]">Account</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f7278]">Auth</p>
            <Link to="/login" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Login</Link>
            <Link to="/signup" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Sign up</Link>
            <Link to="/get-started" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Get Started</Link>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f7278]">User area</p>
            <Link to="/dashboard" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Dashboard</Link>
            <Link to="/client-profit-dashboard" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Client Profit Dashboard</Link>
            <Link to="/profile" className="text-[#b8b3b0] no-underline hover:text-[#00d992]">Profile</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2f2f2]">Contact</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[#b8b3b0]">
            <a href={LINKS.whatsappDirect} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 no-underline hover:text-[#00d992]">
              <MessageCircle className="h-4 w-4" />
              +91 99677 89335
            </a>
            <a href={LINKS.email} className="no-underline hover:text-[#00d992]">
              {EMAIL}
            </a>
            <a href={LINKS.phone} className="inline-flex items-center gap-2 no-underline hover:text-[#00d992]">
              <Phone className="h-4 w-4" />
              {PHONE}
            </a>
            <p className="text-[#8b949e]">We reply within 4 business hours.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-[#8b949e] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 AI Agents Pro</p>
          <div className="flex items-center gap-4">
            <a href={LINKS.whatsappDirect} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-[#00d992]">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#00d992]">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[#00d992]">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

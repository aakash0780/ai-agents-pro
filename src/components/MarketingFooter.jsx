import { Bot, Linkedin, Mail, MessageCircle, Phone, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, DEMO_URL, NAV_LINKS, SITE_NAME, SITE_TAGLINE, WHATSAPP_URL } from '@/constants/site'

export function MarketingFooter() {
  return (
    <footer className="bg-[#050507]">
      <div className="footer-wave relative -mt-px h-16 w-full overflow-hidden border-t border-[#3d3a39]">
        <svg viewBox="0 0 1280 140" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path
            d="M0,40 C220,120 420,0 640,68 C820,120 1020,20 1280,80 L1280,0 L0,0 Z"
            fill="rgba(0,217,146,0.08)"
          />
        </svg>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#3d3a39] bg-[#101010]">
              <Bot className="h-5 w-5 text-[#00d992]" />
            </div>
            <div>
              <p className="font-[system-ui] text-base font-semibold text-[#f2f2f2]">{SITE_NAME}</p>
              <p className="text-sm text-[#b8b3b0]">{SITE_TAGLINE}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[#8b949e]">
            Sales, support, and service automation for teams that want to scale without adding headcount.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2f2f2]">Product</h2>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#bdbdbd]">
            <Link to="/services" className="no-underline hover:text-[#00d992]">Services</Link>
            <Link to="/pricing" className="no-underline hover:text-[#00d992]">Pricing</Link>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-[#00d992]">Watch Demo</a>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2f2f2]">Company</h2>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#bdbdbd]">
            {NAV_LINKS.filter((link) => link.href !== '/').map((link) => (
              <Link key={link.href} to={link.href} className="no-underline hover:text-[#00d992]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f2f2f2]">Contact</h2>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#bdbdbd]">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 no-underline hover:text-[#00d992]">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 no-underline hover:text-[#00d992]">
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
            <a href="tel:+919967789335" className="inline-flex items-center gap-2 no-underline hover:text-[#00d992]">
              <Phone className="h-4 w-4" />
              +91 99677 89335
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3d3a39]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-[#8b949e] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="AI Agents Pro on WhatsApp" className="social-tilt hover:text-[#00d992]">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="AI Agents Pro on LinkedIn" className="social-tilt hover:text-[#00d992]">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="AI Agents Pro on YouTube" className="social-tilt hover:text-[#00d992]">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

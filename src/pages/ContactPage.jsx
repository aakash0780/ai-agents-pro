import { useState } from 'react'
import { CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { SEO } from '@/components/SEO'
import { trackCTA } from '@/utils/api'
import { EMAIL, LINKS, PHONE } from '@/utils/constants'

const initialForm = {
  name: '',
  email: '',
  company: '',
  phone: '',
  companySize: '',
  service: '',
  message: '',
  source: '',
}

const companySizes = ['1–10', '11–50', '51–200', '200+']
const serviceOptions = [
  'Sales Automation',
  'Customer Support',
  'Lead Qualification',
  'Multi-Channel',
  'Analytics',
  'Full Package',
  'Other',
]
const heardOptions = ['WhatsApp', 'LinkedIn', 'Google Search', 'Referral', 'Other']

function validateForm(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Full name is required.'
  if (!values.email.trim()) {
    errors.email = 'Work email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.company.trim()) errors.company = 'Company name is required.'
  if (!values.companySize) errors.companySize = 'Select company size.'
  if (!values.service) errors.service = 'Select a service.'
  if (!values.message.trim()) {
    errors.message = 'Message is required.'
  } else if (values.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.'
  }

  return errors
}

export function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone || undefined,
          companySize: form.companySize,
          service: form.service,
          message: form.message,
          source: form.source || undefined,
        }),
      })
      if (!response.ok) throw new Error('Server error')

      trackCTA('contact_form_submit', '/contact').catch(() => {})
      toast.success('Message sent! We\'ll get back to you within 2 hours.')
      setForm(initialForm)
      setSubmitted(true)
    } catch (error) {
      const message = error?.message || 'Unable to submit your request right now.'
      setSubmitError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title="Contact AI Agents Pro | Get Started or Book a Demo"
        description="Get in touch with the AI Agents Pro team. Book a demo, ask about pricing, or get a custom quote. WhatsApp, email, or contact form."
        url="https://www.aiagentspro.in/contact"
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <article className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6">
          <h1 className="font-[system-ui] text-[clamp(34px,5vw,48px)] font-light leading-[1.05] tracking-[-0.7px]">
            Get Started or Book a Demo
          </h1>
          <p className="mt-4 text-[var(--text-2)]">
            Tell us your goals and we&apos;ll map the right automation rollout for your team.
          </p>

          {submitError ? (
            <div className="mt-5 rounded-lg border border-[#7f1d1d] bg-[#2a1111] px-4 py-3 text-sm text-[#ffb4b4]">
              {submitError}
            </div>
          ) : null}

          {submitted ? (
            <div className="mt-8 rounded-lg border border-[var(--border-accent)] bg-[var(--green-dim)] p-5 text-sm text-[var(--text)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--green)]" />
                <div>
                  <p className="font-medium text-[var(--green)]">
                    Thanks {form.name}! We&apos;ll get back to you within 4 hours.
                  </p>
                  <p className="mt-2 text-[var(--text-2)]">
                    If you want immediate support, use the WhatsApp button on the right.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm text-[var(--text-2)]">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className={`mt-1 h-11 w-full rounded-lg border bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                      errors.name ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                    }`}
                  />
                  {errors.name ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.name}</p> : null}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm text-[var(--text-2)]">Work Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className={`mt-1 h-11 w-full rounded-lg border bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                      errors.email ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                    }`}
                  />
                  {errors.email ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.email}</p> : null}
                </div>

                <div>
                  <label htmlFor="company" className="text-sm text-[var(--text-2)]">Company Name</label>
                  <input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={onChange}
                    className={`mt-1 h-11 w-full rounded-lg border bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                      errors.company ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                    }`}
                  />
                  {errors.company ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.company}</p> : null}
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm text-[var(--text-2)]">Phone / WhatsApp Number (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="mt-1 h-11 w-full rounded-lg border border-[var(--border-warm)] bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)]"
                  />
                </div>

                <div>
                  <label htmlFor="companySize" className="text-sm text-[var(--text-2)]">Company Size</label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={form.companySize}
                    onChange={onChange}
                    className={`mt-1 h-11 w-full rounded-lg border bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                      errors.companySize ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                    }`}
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.companySize ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.companySize}</p> : null}
                </div>

                <div>
                  <label htmlFor="service" className="text-sm text-[var(--text-2)]">Service Interested In</label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={onChange}
                    className={`mt-1 h-11 w-full rounded-lg border bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                      errors.service ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                    }`}
                  >
                    <option value="">Select service</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.service ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.service}</p> : null}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="text-sm text-[var(--text-2)]">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  maxLength={1000}
                  value={form.message}
                  onChange={onChange}
                  className={`mt-1 w-full rounded-lg border bg-[#101010] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--green)] ${
                    errors.message ? 'border-[#ef4444]' : 'border-[var(--border-warm)]'
                  }`}
                />
                <p className={`mt-1 text-xs ${1000 - form.message.length < 100 ? 'text-destructive' : 'text-[var(--text-3)]'}`}>
                  {1000 - form.message.length} characters remaining
                </p>
                {errors.message ? <p className="mt-1 text-xs text-[#ff8b8b]">{errors.message}</p> : null}
              </div>

              <div>
                <label htmlFor="source" className="text-sm text-[var(--text-2)]">How did you hear about us? (optional)</label>
                <select
                  id="source"
                  name="source"
                  value={form.source}
                  onChange={onChange}
                  className="mt-1 h-11 w-full rounded-lg border border-[var(--border-warm)] bg-[#101010] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--green)]"
                >
                  <option value="">Select source</option>
                  {heardOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </article>

        <aside className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6">
          <h2 className="font-[system-ui] text-[32px] leading-[1.1] tracking-[-0.8px]">
            Let&apos;s talk about your automation needs.
          </h2>
          <p className="mt-3 text-[var(--text-2)]">
            Most teams are live within 48 hours. Let&apos;s find the right plan for you.
          </p>

          <div className="mt-6 space-y-4 text-sm text-[var(--text-2)]">
            <a
              href="https://wa.me/919967789335?text=Hi%20AI%20Agents%20Pro%2C%20I%27d%20like%20to%20get%20started."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[#0c0c10] p-3 no-underline"
            >
              <MessageCircle className="mt-0.5 h-4 w-4 text-[var(--green)]" />
              <span>WhatsApp: +91 99677 89335 — Click to open chat</span>
            </a>
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[#0c0c10] p-3">
              <Mail className="mt-0.5 h-4 w-4 text-[var(--green)]" />
              <span>{EMAIL}</span>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[#0c0c10] p-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-[var(--green)]" />
              <span>We respond within 2 hours (Mon–Sat, 9AM–8PM IST)</span>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[#0c0c10] p-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[var(--green)]" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[#0c0c10] p-3">
              <Phone className="mt-0.5 h-4 w-4 text-[var(--green)]" />
              <span>{PHONE}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={LINKS.getStarted}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--green)] px-6 py-3 text-sm font-semibold text-[#050507] no-underline"
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href={LINKS.watchDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border-warm)] px-6 py-3 text-sm font-medium text-[#fff] no-underline"
            >
              📅 Book a Demo Call
            </a>
          </div>

          <div className="mt-6 text-sm text-[var(--text-3)]">
            <p>Office Hours</p>
            <p className="mt-2">Mon–Fri: 9:00 AM – 8:00 PM IST</p>
            <p>Sat: 10:00 AM – 4:00 PM IST</p>
            <p>Sun: WhatsApp support only</p>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">
            500+ clients · SOC 2 Compliant · 99.9% Uptime
          </p>
        </aside>
      </section>
    </main>
  )
}

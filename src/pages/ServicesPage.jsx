import { motion as Motion } from 'framer-motion'
import {
  BarChart3,
  Bot,
  Building2,
  Cpu,
  Globe,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  ShoppingBag,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionLabel } from '@/components/shared/SectionLabel'
import {
  industries,
  integrationCategories,
  services,
} from '@/constants/services'
import { LINKS } from '@/utils/constants'

const iconMap = {
  Sparkles,
  Headphones,
  UserCheck,
  Globe,
  BarChart3,
  Users,
  ShoppingBag,
  Cpu,
  Building2,
  HeartPulse,
  GraduationCap,
  Landmark,
}

export function ServicesPage() {
  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title="AI Agent Services | Sales, Support & Automation — AI Agents Pro"
        description="Explore our full suite of AI agent services: sales automation, 24/7 customer support, lead qualification, multi-channel deployment, analytics, and human handoff."
        url="https://www.aiagentspro.in/services"
      />

      <section className="border-b border-[var(--border)] bg-gradient-to-br from-[rgba(37,99,235,0.08)] to-[rgba(147,51,234,0.08)] py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[system-ui] text-[clamp(36px,5vw,56px)] font-light leading-[1.08] tracking-[-1px]">
            AI Automation Services Built for Results
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--text-2)]">
            From custom chatbots to full workflow automation — we build solutions that deliver
            measurable ROI.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              aria-label="Get a custom automation quote"
              className="inline-flex rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline transition hover:shadow-[0_0_24px_rgba(0,217,146,0.3)]"
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <Motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionLabel>SERVICES</SectionLabel>
            <h1 className="mt-4 font-[system-ui] text-[clamp(40px,6vw,60px)] font-light leading-[1.02] tracking-[-0.8px]">
              AI Agent Services Built for Real Business Outcomes
            </h1>
            <p className="mt-6 text-lg text-[var(--text-2)]">
              From first contact to closed deal — our agents handle every touchpoint so your team
              can focus on what matters.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={LINKS.getStarted}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline"
              >
                Get Started
              </a>
              <a
                href={LINKS.talkToSales}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[var(--border-warm)] px-7 py-3.5 text-sm font-medium text-[#fff] no-underline hover:bg-black/20"
              >
                Talk to Sales
              </a>
            </div>
          </Motion.div>

          <div className="landing-grid-bg rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Response time', '< 30s'],
                ['Ticket deflection', '72%'],
                ['Qualified leads', '3x'],
                ['Channels', '4+'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-[var(--border)] bg-[#0c0c10] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">{label}</p>
                  <p className="mt-2 text-2xl text-[var(--text)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Bot

            return (
              <Motion.article
                key={service.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-8 rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6 shadow-[rgba(92,88,85,0.2)_0_0_15px]"
              >
                <div className={`grid gap-8 lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border)] bg-[#0b0b0e] text-[var(--green)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-3xl">{service.title}</h2>
                    <p className="mt-4 text-[var(--text-2)]">{service.description}</p>
                    <ul className="mt-5 space-y-2 text-sm text-[var(--text-2)]">
                      {service.capabilities.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-md border border-[var(--border)] bg-[#0b0b0e] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-3)]">How it is used</p>
                    <p className="mt-3 text-[var(--text-2)]">{service.useCase}</p>
                    <p className="mt-5 rounded-md border border-[var(--border-accent)] bg-[var(--green-dim)] px-4 py-3 text-sm text-[var(--green)]">
                      {service.stat}
                    </p>
                  </div>
                </div>

                <Link
                  to="/contact"
                  aria-label={`Get a quote for ${service.title}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-warm)] px-4 py-3 text-sm font-medium text-[#fff] no-underline hover:bg-black/20"
                >
                  Get a Quote
                </Link>
              </Motion.article>
            )
          })}
        </div>
      </section>

      <div className="py-6 text-center">
        <p className="text-sm text-[var(--text-2)]">
          Pilot projects start from ₹1,50,000 ·{' '}
          <Link to="/pricing" aria-label="View full pricing plans" className="text-[var(--green)] no-underline hover:underline">
            View full pricing →
          </Link>
        </p>
      </div>

      <section className="border-y border-[var(--border)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>INTEGRATION PARTNERS</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Integrates with 50+ tools you already use
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {integrationCategories.map((group) => (
              <article key={group.label} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
                <h3 className="text-lg">{group.label}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-[var(--border)] bg-[#0b0b0e] px-3 py-1 text-xs text-[var(--text-2)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm text-[var(--text-2)]">
            Don\'t see your tool? We build custom integrations.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>INDUSTRIES</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Built for teams across industries
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = iconMap[industry.icon] || Bot
              return (
                <article key={industry.name} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
                  <Icon className="h-5 w-5 text-[var(--green)]" />
                  <h3 className="mt-4 text-lg">{industry.name}</h3>
                  <p className="mt-2 text-sm text-[var(--text-2)]">{industry.useCase}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-10 rounded-lg border border-[var(--green)] bg-[var(--card)] p-8">
            <h3 className="text-2xl">Need a custom deployment plan?</h3>
            <p className="mt-3 text-[var(--text-2)]">
              We\'ll map your channels, automation goals, and ROI targets before implementation.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

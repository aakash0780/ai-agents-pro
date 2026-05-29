import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { FEATURED_INTEGRATIONS } from '@/constants/featured-integrations'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SectionLabel } from '@/components/shared/SectionLabel'

export function FeaturedIntegrationsSection() {
  return (
    <AnimatedSection className="relative overflow-hidden border-b border-[var(--border)] py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      >
        <span className="absolute left-[8%] top-14 h-px w-48 bg-gradient-to-r from-transparent via-[#00d992]/40 to-transparent" />
        <span className="absolute right-[10%] top-24 h-44 w-44 rounded-full border border-[#00d992]/10 shadow-[0_0_55px_rgba(0,217,146,0.08)]" />
        <span className="absolute bottom-12 left-[18%] h-16 w-16 border border-[#00d992]/20 bg-[#101010]/60 [transform:rotateX(58deg)_rotateZ(42deg)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>INTEGRATIONS</SectionLabel>
        <h2 className="mt-4 max-w-3xl font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
          Works with the tools your team already trusts.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-2)]">
          Connect CRM, messaging, support, commerce, and telephony — one AI layer across your stack.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_INTEGRATIONS.map((item) => (
            <Link
              key={item.slug}
              to={`/get-started?integration=${item.slug}`}
              className="group relative flex min-h-[176px] flex-col overflow-hidden rounded-lg border border-[var(--border-warm)] bg-[linear-gradient(145deg,rgba(16,16,16,0.92),rgba(5,5,7,0.88))] p-5 no-underline shadow-[rgba(0,0,0,0.35)_0_12px_28px] backdrop-blur-md transition-[transform,border-color,box-shadow,background] duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-[var(--green)]/55 motion-safe:hover:shadow-[0_18px_42px_-14px_rgba(0,217,146,0.48),0_0_0_1px_rgba(0,217,146,0.14)_inset] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              aria-label={`${item.name}: ${item.blurb}`}
            >
              <span
                className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 18% 14%, #${item.color}2e, transparent 46%), linear-gradient(135deg, #${item.color}12, transparent 60%)`,
                }}
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />

              <div className="relative z-10 flex items-start gap-4">
                <span
                  className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-lg border bg-[#0b0b0e]/90 text-sm font-bold tracking-[0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  style={{
                    borderColor: `#${item.color}70`,
                    color: `#${item.color}`,
                    boxShadow: `0 0 22px #${item.color}1f, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}
                  aria-hidden="true"
                >
                  {item.badge}
                </span>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--text)]">{item.name}</h3>
                </div>
              </div>

              <p className="relative z-10 mt-4 text-sm leading-relaxed text-[var(--text-2)]">{item.blurb}</p>

              <span className="relative z-10 mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-[var(--green)] opacity-90 transition-opacity group-hover:opacity-100">
                Plan setup
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-lg border border-[var(--border-warm)] bg-[#101010]/55 p-4 backdrop-blur-md sm:grid-cols-3">
          {[
            ['CRM sync', 'Contacts, deals, tickets, and tasks stay current.'],
            ['Channel memory', 'Web, WhatsApp, SMS, and voice share one customer context.'],
            ['Human handoff', 'Escalations include transcript, intent, and next best action.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-md border border-white/5 bg-[#050507]/70 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-3)]">{copy}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-3)]">
          Local brand-style badges are shown for identification. See how agents connect across your stack on the{' '}
          <Link to="/services" className="text-[var(--green)] no-underline hover:underline">
            Services page
          </Link>
          .
        </p>
      </div>
    </AnimatedSection>
  )
}

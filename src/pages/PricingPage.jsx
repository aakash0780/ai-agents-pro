import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SEO } from '@/components/SEO'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { addOns, comparisonRows, pricingFaqs, pricingTiers } from '@/constants/pricing'

function formatPrice(value) {
  if (value == null) return 'Custom'
  return `₹${value.toLocaleString('en-IN')}/mo`
}

const TIER_CTA = {
  Starter: {
    label: 'Start Pilot',
    href: 'https://wa.me/919967789335?text=Hi%2C%20I%27d%20like%20to%20start%20a%20Pilot%20Project',
    external: true,
  },
  Growth: {
    label: 'Scale Up',
    href: 'https://wa.me/919967789335?text=Hi%2C%20I%27m%20interested%20in%20the%20Growth%20plan',
    external: true,
  },
  Enterprise: {
    label: 'Contact Sales',
    href: '/contact',
    external: false,
  },
}

export function PricingPage() {
  const [billing, setBilling] = useState('monthly')

  const tiers = useMemo(
    () =>
      pricingTiers.map((tier) => ({
        ...tier,
        displayPrice: billing === 'annual' ? formatPrice(tier.annual) : formatPrice(tier.monthly),
      })),
    [billing],
  )

  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title="Pricing | AI Agents Pro — Transparent Plans for Every Scale"
        description="Choose the right AI agent plan for your business. Starter from ₹4,999/mo. Growth ₹12,999/mo. Enterprise custom pricing. 14-day free trial included."
        url="https://www.aiagentspro.in/pricing"
      />

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <SectionLabel centered>PRICING</SectionLabel>
          <h1 className="mt-4 font-[system-ui] text-[clamp(40px,6vw,60px)] font-light leading-[1.04] tracking-[-0.8px]">
            Transparent plans for every stage of growth.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-[var(--text-2)]">
            Choose monthly or annual billing and scale your AI operations with zero guesswork.
          </p>

          <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-full border border-[var(--border-warm)] bg-[var(--card)] p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`rounded-full px-5 py-2 text-sm ${
                billing === 'monthly'
                  ? 'bg-[var(--green)] text-[#050507]'
                  : 'text-[var(--text-2)]'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`rounded-full px-5 py-2 text-sm ${
                billing === 'annual'
                  ? 'bg-[var(--green)] text-[#050507]'
                  : 'text-[var(--text-2)]'
              }`}
            >
              Annual
            </button>
          </div>
          {billing === 'annual' ? (
            <p className="mt-3 text-sm text-[var(--green)]">Save 20% with annual billing</p>
          ) : null}
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-lg bg-[var(--card)] p-6 shadow-[rgba(92,88,85,0.2)_0_0_15px] ${
                tier.featured ? 'border-2 border-[var(--green)]' : 'border border-[var(--border-warm)]'
              }`}
            >
              {tier.badge ? (
                <span className="inline-flex rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-3 py-1 text-xs text-[var(--green)]">
                  {tier.badge}
                </span>
              ) : null}
              <h2 className="mt-4 text-2xl">{tier.name}</h2>
              <p className="mt-2 text-sm text-[var(--text-2)]">For: {tier.for}</p>
              <p className="mt-5 text-4xl font-light tracking-[-0.5px]">{tier.displayPrice}</p>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text-2)]">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-[var(--green)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={TIER_CTA[tier.name]?.href ?? '/contact'}
                target={TIER_CTA[tier.name]?.external ? '_blank' : undefined}
                rel={TIER_CTA[tier.name]?.external ? 'noopener noreferrer' : undefined}
                aria-label={`${TIER_CTA[tier.name]?.label ?? tier.cta} — ${tier.name} plan`}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold no-underline ${
                  tier.ctaType === 'primary'
                    ? 'bg-[var(--green)] text-[#050507]'
                    : 'border border-[var(--border-warm)] text-[#fff] hover:bg-black/20'
                }`}
              >
                {TIER_CTA[tier.name]?.label ?? tier.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FEATURE COMPARISON</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Compare plans feature by feature.
          </h2>

          <div className="mt-8 overflow-x-auto rounded-lg border border-[var(--border-warm)]">
            <table className="w-full min-w-[720px] border-collapse bg-[var(--card)] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text)]">
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Starter</th>
                  <th className="px-4 py-3">Growth</th>
                  <th className="px-4 py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[var(--border)] text-[var(--text-2)]">
                    <td className="px-4 py-3 text-[var(--text)]">{row.feature}</td>
                    <td className="px-4 py-3">
                      {typeof row.starter === 'boolean' ? (row.starter ? '✓' : '—') : row.starter}
                    </td>
                    <td className="px-4 py-3">
                      {typeof row.growth === 'boolean' ? (row.growth ? '✓' : '—') : row.growth}
                    </td>
                    <td className="px-4 py-3">
                      {typeof row.enterprise === 'boolean'
                        ? row.enterprise
                          ? '✓'
                          : '—'
                        : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>ADD-ON SERVICES</SectionLabel>
          <div className="mt-6 rounded-lg border border-[var(--border-warm)] bg-[var(--card)]">
            {addOns.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center justify-between px-5 py-4 text-sm ${
                  index < addOns.length - 1 ? 'border-b border-[var(--border)]' : ''
                }`}
              >
                <span className="text-[var(--text)]">{item.name}</span>
                <span className="text-[var(--text-2)]">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Common pricing and setup questions
          </h2>

          <div className="mt-8 rounded-lg border border-[var(--border-warm)] bg-[var(--card)] px-5 py-2">
            <Accordion type="single" collapsible>
              {pricingFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-[var(--border)]">
                  <AccordionTrigger className="text-left text-[var(--text)] hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--text-2)]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl rounded-lg border border-[var(--green)] bg-[var(--card)] px-6 py-10 text-center sm:px-8">
          <h2 className="font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Still have questions?
          </h2>
          <p className="mt-3 text-[var(--text-2)]">
            Let us map the right plan based on your channels, volume, and response-time goals.
          </p>
          <a
            href="/contact"
            aria-label="Contact sales team"
            className="mt-6 inline-flex rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline"
          >
            Talk to Sales
          </a>
        </div>
      </section>
    </main>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { SectionLabel } from '@/components/shared/SectionLabel'
import {
  certifications,
  companyStats,
  companyValues,
  partners,
  storyTimeline,
  teamMembers,
} from '@/constants/team'

function CounterCard({ label, value, suffix }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        const duration = 1200
        const start = performance.now()

        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * value))
          if (progress < 1) {
            requestAnimationFrame(tick)
          }
        }

        requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return (
    <article ref={ref} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
      <p className="text-sm text-[var(--text-3)]">{label}</p>
      <p className="mt-3 text-4xl font-light text-[var(--text)]">
        {count.toLocaleString('en-IN')}
        {suffix}
      </p>
    </article>
  )
}

export function AboutPage() {
  return (
    <main className="bg-[var(--bg)] pt-28 text-[var(--text)]">
      <SEO
        title="About AI Agents Pro | Our Mission, Team & Story"
        description="AI Agents Pro was founded to make AI automation accessible to every B2B team. Learn about our mission, values, and the team behind the platform."
        url="https://www.aiagentspro.in/about"
      />

      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionLabel>ABOUT</SectionLabel>
          <h1 className="mt-4 font-[system-ui] text-[clamp(40px,6vw,60px)] font-light leading-[1.02] tracking-[-0.8px]">
            We believe every business deserves a tireless AI workforce.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[var(--text-2)]">
            AI Agents Pro was founded in Mumbai with a simple conviction: the tools that large
            enterprises use to automate customer operations should be accessible to every growing
            business — not just the Fortune 500. We build AI agents that work around the clock,
            handle real conversations, and deliver measurable results from day one.
          </p>
          <p className="mt-5 text-lg leading-8 text-[var(--text-2)]">
            We&apos;ve worked with 500+ businesses across e-commerce, SaaS, real estate, healthcare,
            and education — and we&apos;ve learned that great AI automation isn&apos;t about replacing
            humans. It&apos;s about giving your best people the leverage to do their best work.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {companyStats.map((item) => (
            <CounterCard key={item.label} label={item.label} value={item.value} suffix={item.suffix} />
          ))}
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>OUR STORY</SectionLabel>
          <div className="mx-auto mt-6 max-w-3xl text-center">
            <p className="text-lg leading-8 text-[var(--text-2)]">
              AI Agents Pro was founded after watching too many growing businesses lose qualified
              leads overnight because their teams couldn&apos;t be everywhere at once. We believed that
              the same AI tools powering Fortune 500 contact centres should be within reach of every
              ambitious B2B team. So we built them — and made them deployable in 48 hours, not 6
              months.
            </p>
          </div>
          <div className="relative mt-10 border-l border-[var(--border)] pl-6">
            {storyTimeline.map((entry) => (
              <article key={entry.year} className="relative mb-7">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[var(--green)]" />
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--green)]">{entry.year}</p>
                <p className="mt-2 text-[var(--text-2)]">{entry.title}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FOUNDER</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Meet the Founder
          </h2>

          <div className="mt-8 max-w-sm">
            {teamMembers.slice(0, 1).map((member) => (
              <Motion.article
                key={member.name}
                whileHover={{ y: -4 }}
                className="rounded-lg border-2 border-[var(--green)] bg-[var(--card)] p-5"
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[#0d1512] text-xl font-semibold text-[var(--green)]"
                  aria-label={`${member.name} avatar`}
                >
                  {member.initials}
                </div>
                <h3 className="mt-4 text-xl">{member.name}</h3>
                <p className="text-sm text-[var(--green)]">{member.role}</p>
                <p className="mt-2 text-sm text-[var(--text-2)]">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--text-2)] no-underline hover:text-[var(--green)]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Motion.article>
            ))}
          </div>

          <h3 className="mt-14 font-[system-ui] text-2xl tracking-[-0.4px]">Our Team</h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.slice(1).map((member) => (
              <Motion.article
                key={member.name}
                whileHover={{ y: -4 }}
                className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5"
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[#0d1512] text-xl font-semibold text-[var(--green)]"
                  aria-label={`${member.name} avatar`}
                >
                  {member.initials}
                </div>
                <h4 className="mt-4 text-xl">{member.name}</h4>
                <p className="text-sm text-[var(--green)]">{member.role}</p>
                <p className="mt-2 text-sm text-[var(--text-2)]">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name} LinkedIn`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--text-2)] no-underline hover:text-[var(--green)]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>VALUES</SectionLabel>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyValues.map((value) => (
              <article key={value.title} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
                <h3 className="text-lg">{value.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-2)]">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>PARTNERS & CERTIFICATIONS</SectionLabel>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
              <h3 className="text-lg">Partners</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {partners.map((partner) => (
                  <span
                    key={partner}
                    className="rounded-full border border-[var(--border)] bg-[#0b0b0e] px-3 py-1 text-sm text-[var(--text-2)]"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-5">
              <h3 className="text-lg">Certifications</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {certifications.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-3 py-1 text-sm text-[var(--green)]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl rounded-lg border border-[var(--green)] bg-[var(--card)] px-6 py-10 text-center sm:px-8">
          <h2 className="font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">Work with us</h2>
          <p className="mt-3 text-[var(--text-2)]">
            Most clients are live within 48 hours with a scoped rollout plan.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline"
          >
            Contact AI Agents Pro
          </Link>
        </div>
      </section>
    </main>
  )
}

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  Wrench,
} from 'lucide-react'

const audienceCards = [
  {
    title: 'Service businesses',
    description: 'Handle repeated FAQs, missed calls, and booking requests without adding headcount.',
    icon: Phone,
  },
  {
    title: 'Support teams',
    description: 'Deflect repetitive queries, route complex cases, and keep human handoff clean.',
    icon: Users,
  },
  {
    title: 'Sales-led businesses',
    description: 'Qualify inbound leads from website and WhatsApp before your team follows up.',
    icon: MessageCircle,
  },
]

const painPoints = [
  'Leads arrive after hours and nobody replies until the next day.',
  'Your team repeats the same answers across website chat, WhatsApp, and email.',
  'Enquiries are unqualified, so sales spends time on low-intent conversations.',
]

const demoProof = [
  {
    title: 'Live chatbot flow',
    description: 'See how the bot answers FAQs, captures lead details, and escalates edge cases.',
    icon: Bot,
  },
  {
    title: 'Knowledge grounding',
    description: 'Review the exact pages, docs, or FAQs used to generate responses.',
    icon: Search,
  },
  {
    title: 'Handoff + routing',
    description: 'Watch website or WhatsApp conversations move into your team workflow.',
    icon: Workflow,
  },
]

const useCases = [
  {
    title: 'Lead qualification',
    summary: 'Collect budget, location, service interest, and urgency before a rep steps in.',
  },
  {
    title: 'Support deflection',
    summary: 'Answer pricing, policy, onboarding, and delivery questions instantly.',
  },
  {
    title: 'Booking automation',
    summary: 'Send scheduling links, confirm appointments, and trigger reminders automatically.',
  },
]

const implementationSteps = [
  {
    title: 'Choose one workflow',
    description: 'We start with the highest-friction point: missed leads, support volume, or booking delays.',
  },
  {
    title: 'Train on your content',
    description: 'We connect your FAQs, website pages, docs, and internal rules into one assistant.',
  },
  {
    title: 'Deploy where enquiries happen',
    description: 'Website widget, WhatsApp, or both, with routing rules for human takeover.',
  },
  {
    title: 'Review and improve',
    description: 'We refine prompts, fix failure cases, and improve conversion or deflection over time.',
  },
]

const trustPoints = [
  'Demo-first process: we show the workflow before pushing a long commitment.',
  'Founder-led delivery with direct WhatsApp and email access.',
  'Pilot-friendly scope focused on one measurable use case instead of “AI for everything.”',
]

export function HomePage() {
  return (
    <main id="main-content" className="pt-16 min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_35%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 border-none bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
                For inbound-heavy businesses
              </Badge>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                AI support agents for businesses that lose leads after hours.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                We build website and WhatsApp assistants that answer repetitive questions, qualify inbound
                enquiries, and push only the right conversations to your team.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-full px-7 text-base bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <a
                    href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20see%20the%20live%20AI%20chatbot%20demo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 no-underline"
                  >
                    See Live Demo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-base" asChild>
                  <a href="/pricing" className="flex items-center gap-2 no-underline">
                    View Pricing
                  </a>
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  'Website + WhatsApp deployment',
                  'Human handoff for complex cases',
                  'Custom setup using your own FAQs and docs',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
                  >
                    <div className="mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Included</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Demo conversation flow</p>
                    <p className="text-sm text-slate-500">Website chat to lead qualification to team handoff</p>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Live-ready
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      Visitor asks: "Do you handle same-day AC repair in Mumbai?"
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-600 p-4 text-white">
                    <p className="text-sm">
                      Yes. We cover Mumbai, collect your issue details, and offer the next available booking slot.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Captured</p>
                      <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Location, urgency, service type</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next step</p>
                      <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">Send to team + booking link</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        The demo should show the exact handoff logic, not just marketing copy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Best fit
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              This is for teams with repetitive inbound conversations, not for everyone.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {audienceCards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Card className="h-full border-slate-200 shadow-sm dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-slate-950 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Why leads slip</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Most businesses do not need more traffic first. They need faster response and cleaner routing.
              </h2>
            </div>
            <div className="space-y-4">
              {painPoints.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                  <p className="text-slate-200">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Product proof
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              What a real demo should prove before anyone buys.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              No fake testimonials, no inflated metrics, no vague “AI platform” claims. Show the workflow, the
              knowledge source, and the handoff logic.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="grid gap-6">
              {demoProof.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <Card className="border-slate-200 dark:border-slate-800">
                    <CardContent className="flex gap-4 p-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm dark:bg-slate-950 dark:text-blue-300">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card className="border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Implementation snapshot</p>
                    <p className="text-sm text-slate-500">Example of what the assistant is doing behind the scenes</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    Sample view
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Knowledge source</p>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      FAQ page, service policy, pricing sheet, escalation rules
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Channels</p>
                      <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">Website widget, WhatsApp</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Escalation</p>
                      <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">Fallback to human when confidence is low</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      If you have screenshots, Loom videos, or case-study numbers, this section is where they should go next.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Use cases
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Start with one workflow that already costs you time or revenue.
              </h2>
            </div>
            <div className="grid gap-5">
              {useCases.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-slate-50 py-16 md:py-20 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              A simple rollout path instead of a giant transformation pitch.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {implementationSteps.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Card className="h-full border-slate-200 shadow-sm dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      0{index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                Trust
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                What this site can honestly claim right now.
              </h2>
            </div>
            <div className="space-y-4">
              {trustPoints.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
                >
                  {index === 0 && <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />}
                  {index === 1 && <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />}
                  {index === 2 && <Wrench className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />}
                  <p className="text-slate-700 dark:text-slate-200">{item}</p>
                </motion.div>
              ))}

              <div className="rounded-3xl bg-slate-950 p-6 text-white dark:bg-slate-900">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Direct contact</p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="h-12 rounded-full px-6 bg-white text-slate-950 hover:bg-slate-100" asChild>
                    <a
                      href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%20want%20to%20book%20a%20demo%20for%20my%20business."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 no-underline"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Book Demo on WhatsApp
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 rounded-full px-6 border-white/30 text-white hover:bg-white/10" asChild>
                    <a href="mailto:aakash99677@gmail.com?subject=Demo%20request%20for%20AI%20support%20agent" className="no-underline">
                      Email for Case Discussion
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-cta-section className="border-t border-border bg-blue-600 py-16 text-white md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Next step</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            See one workflow built around your business before you commit.
          </h2>
          <p className="mt-4 text-lg text-blue-50">
            The strongest CTA here is a demo, not a generic free trial.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 rounded-full px-7 bg-white text-blue-700 hover:bg-blue-50" asChild>
              <a
                href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20a%20demo%20for%20my%20website%20or%20WhatsApp%20AI%20assistant."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 no-underline"
              >
                Book Demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 rounded-full px-7 border-white/40 text-white hover:bg-white/10" asChild>
              <a href="/pricing" className="no-underline">
                See Engagement Models
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

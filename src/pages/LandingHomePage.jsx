import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import * as THREE from 'three'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Check,
  Globe,
  Headphones,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { StatsTicker } from '@/components/shared/StatsTicker'
import { FeaturedIntegrationsSection } from '@/components/FeaturedIntegrationsSection'
import { homeFeatures, serviceSteps, socialProofLogos, tickerItems } from '@/constants/services'
import { pricingTiers } from '@/constants/pricing'
import { fetchBlogPosts, subscribeNewsletter, trackCTA } from '@/utils/api'
import { LINKS } from '@/utils/constants'

const iconMap = {
  Sparkles,
  Headphones,
  UserCheck,
  Globe,
  BarChart3,
  Users,
}

const pains = [
  'Slow response times that kill qualified demand',
  'High support payroll for repetitive conversations',
  'Inconsistent service quality across channels',
  'Lost leads after hours and during peak volume',
]

const solutions = [
  'Instant AI responses across web, WhatsApp, and voice',
  'Automation at a fraction of full-time team cost',
  'Consistent answers with built-in guardrails',
  'Always-on capture, qualification, and routing',
]

const testimonials = [
  {
    name: 'Elena Brooks',
    role: 'VP CX, Northstar Commerce',
    quote:
      'We cut repetitive support volume by 42% and still improved response quality significantly.',
  },
  {
    name: 'Rahul Menon',
    role: 'Head of Revenue, PulsePay',
    quote:
      'Inbound leads get qualified before our team touches them, which cleaned up our pipeline fast.',
  },
  {
    name: 'Danielle Price',
    role: 'Director of Admissions, EduPilot',
    quote:
      'We finally gave prospects instant answers outside business hours without hiring a night team.',
  },
]

function formatDate(value) {
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function LandingHomePage() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [liveCounter, setLiveCounter] = useState(124)
  const [blogPosts, setBlogPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState({ loading: false, message: '' })

  useEffect(() => {
    const hero = heroRef.current
    const canvas = canvasRef.current
    if (!hero || !canvas) return undefined

    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    } catch {
      return undefined
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.z = 5

    const count = 600
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 20
      positions[index * 3 + 1] = (Math.random() - 0.5) * 14
      positions[index * 3 + 2] = (Math.random() - 0.5) * 10

      const tint = Math.random()
      colors[index * 3] = tint * 0.3
      colors[index * 3 + 1] = 0.8 + tint * 0.2
      colors[index * 3 + 2] = 0.52 + tint * 0.12
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const pointer = { x: 0, y: 0 }
    let frame = 0
    let animationFrame = 0

    const resize = () => {
      const width = hero.offsetWidth
      const height = hero.offsetHeight
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    const onMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.5
      pointer.y = -(event.clientY / window.innerHeight - 0.5) * 0.3
    }

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate)
      frame += 0.003
      points.rotation.y = frame * 0.08 + pointer.x
      points.rotation.x = Math.sin(frame * 0.05) * 0.05 + pointer.y
      renderer.render(scene, camera)
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('mousemove', onMouseMove)
      window.cancelAnimationFrame(animationFrame)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const node = heroRef.current
    if (!node) return undefined

    let timer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        timer = window.setInterval(() => {
          if (Math.random() > 0.55) {
            setLiveCounter((current) => current + Math.floor(Math.random() * 2) + 1)
          }
        }, 3000)
        observer.disconnect()
      },
      { threshold: 0.1 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (timer) window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchBlogPosts({ limit: 3 })
      .then((response) => {
        if (!cancelled) {
          setBlogPosts(response.posts || [])
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBlogPosts([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingPosts(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const heroStats = useMemo(
    () => [
      { metric: '70%', label: 'Cost Reduction' },
      { metric: '24/7', label: 'Availability' },
      { metric: '500+', label: 'Businesses Served' },
    ],
    [],
  )

  const onCardMove = useCallback((event) => {
    const node = event.currentTarget
    const bounds = node.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    node.style.setProperty('--mx', `${x.toFixed(1)}%`)
    node.style.setProperty('--my', `${y.toFixed(1)}%`)
  }, [])

  const submitNewsletter = async (event) => {
    event.preventDefault()
    if (!newsletterEmail.trim()) {
      setNewsletterState({ loading: false, message: 'Please enter an email address.' })
      return
    }

    setNewsletterState({ loading: true, message: '' })

    try {
      await subscribeNewsletter({ email: newsletterEmail, source: 'home_cta' })
      setNewsletterEmail('')
      setNewsletterState({ loading: false, message: 'You are subscribed. Thanks for joining.' })
    } catch (error) {
      setNewsletterState({
        loading: false,
        message: error?.error || error?.message || 'Unable to subscribe right now.',
      })
    }
  }

  const onPrimaryCta = (label) => {
    trackCTA(label, '/').catch(() => {})
  }

  return (
    <main className="landing-page bg-[var(--bg)] pt-[68px] text-[var(--text)]">
      <SEO
        title="AI Agents Pro | AI-Powered Automation for B2B Teams"
        description="Deploy intelligent AI agents that handle sales, support, and customer conversations 24/7. 70% cost reduction. 500+ businesses served."
        url="https://www.aiagentspro.in/"
      />

      <section ref={heroRef} className="relative min-h-[100vh] overflow-hidden border-b border-[var(--border)]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div
          className="landing-hero-tech pointer-events-none absolute inset-0 motion-reduce:hidden"
          aria-hidden
        >
          <span className="hero-orbit-ring" />
          <span className="hero-circuit-line hero-circuit-line--h" />
          <span className="hero-circuit-line hero-circuit-line--v" />
          <span className="hero-node hero-node--a" />
          <span className="hero-node hero-node--b" />
          <span className="hero-node hero-node--c" />
          <span className="hero-cube-iso" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(0,217,146,0.18),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(0,217,146,0.09),transparent_34%)]" />

        <Motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="relative mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8"
        >
          <div className="space-y-7">
            <Motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--green)]">
                <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />
                AI-POWERED AUTOMATION
              </span>
            </Motion.div>

            <Motion.h1
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="max-w-3xl font-[system-ui] text-[clamp(40px,6vw,64px)] font-light leading-[1.08] tracking-[-1.5px]"
            >
              Stop Losing Customers.
              <br />
              Let <span className="font-medium text-[var(--green)]">AI</span> Handle It.
            </Motion.h1>

            <Motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="max-w-2xl text-[17px] leading-[1.7] text-[var(--text-2)]"
            >
              Deploy intelligent agents that sell, support, and scale — 24/7, without hiring a
              single person.
            </Motion.p>

            <Motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href="https://wa.me/919967789335?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20demo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onPrimaryCta('hero_book_demo')}
                aria-label="Book a free demo on WhatsApp"
                className="inline-flex items-center rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline transition hover:shadow-[0_0_24px_rgba(0,217,146,0.35)]"
              >
                Book a Free Demo
              </a>
              <Link
                to="/pricing"
                onClick={() => onPrimaryCta('hero_view_pricing')}
                aria-label="View pricing plans"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-warm)] bg-transparent px-7 py-3.5 text-sm font-medium text-[#fff] no-underline transition hover:bg-black/20"
              >
                View Pricing
              </Link>
            </Motion.div>

            <Motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="text-sm text-[var(--text-3)]"
            >
              500+ businesses automated · 70% avg cost reduction · 4.9★ rated
            </Motion.p>

            <Motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-2)]"
            >
              {heroStats.map((item, index) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="font-medium text-[var(--text)]">{item.metric}</span>
                  <span>{item.label}</span>
                  {index < heroStats.length - 1 ? <span className="text-[var(--border-warm)]">|</span> : null}
                </div>
              ))}
            </Motion.div>
          </div>

          <Motion.aside
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="landing-glass-panel hidden rounded-xl border border-[var(--border-warm)] bg-[var(--card)]/65 p-5 shadow-[rgba(92,88,85,0.2)_0_0_15px] backdrop-blur-xl backdrop-saturate-150 lg:block"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text)]">AI Agents Runtime</p>
                <p className="text-xs text-[var(--text-3)]">Sales + support orchestration</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-3 py-1 text-xs text-[var(--green)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ['Leads Routed', liveCounter],
                ['First Reply', '18s'],
                ['Accuracy', '97%'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-[var(--border)] bg-[#0b0b0e] p-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-3)]">{label}</p>
                  <p className="mt-2 text-xl font-medium text-[var(--text)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 rounded-md border border-[var(--border)] bg-[#0b0b0e] p-4">
              {[
                ['U', 'I need pricing for 50 users'],
                ['AI', 'Our Growth plan is a strong fit. Want to schedule a quick demo?'],
                ['U', 'Yes, Thursday works'],
              ].map(([speaker, message], index) => (
                <div key={`${speaker}-${message}`} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      speaker === 'AI' ? 'bg-[var(--green-dim)] text-[var(--green)]' : 'bg-[#1a1a1f] text-[#d8d8dc]'
                    }`}
                  >
                    {speaker}
                  </span>
                  <p className="text-xs text-[var(--text-2)]">{message}</p>
                  {index === 2 ? (
                    <span className="ml-auto mt-1 inline-flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-[var(--green)] animate-pulse" />
                      <span className="h-1 w-1 rounded-full bg-[var(--green)] animate-pulse [animation-delay:150ms]" />
                      <span className="h-1 w-1 rounded-full bg-[var(--green)] animate-pulse [animation-delay:300ms]" />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </Motion.aside>
        </Motion.div>
      </section>

      <StatsTicker items={tickerItems} />

      <section className="border-b border-[var(--border)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--text-2)]">Trusted by teams at</p>
          <div className="landing-marquee-mask mt-5 overflow-hidden">
            <div className="marquee-track flex w-max items-center gap-3">
              {[...socialProofLogos, ...socialProofLogos].map((logo, index) => (
                <span
                  key={`${logo}-${index}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm text-[var(--text-2)]"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>THE PROBLEM</SectionLabel>
          <h2 className="mt-4 max-w-3xl font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Manual customer ops break as volume grows.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-7 shadow-[rgba(92,88,85,0.2)_0_0_15px]">
              <h3 className="text-xl">Without AI Agents Pro</h3>
              <div className="mt-5 space-y-3">
                {pains.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[var(--text-2)]">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2a1717] text-xs text-[#ff7b7b]">
                      <X className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-lg border-2 border-[var(--green)] bg-[var(--card)] p-7 shadow-[rgba(92,88,85,0.2)_0_0_15px]">
              <h3 className="text-xl">With AI Agents Pro</h3>
              <div className="mt-5 space-y-3">
                {solutions.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[var(--text-2)]">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green-dim)] text-xs text-[var(--green)]">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FEATURES</SectionLabel>
          <h2 className="mt-4 max-w-3xl font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Built for speed, consistency, and measurable outcomes.
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeFeatures.map((feature) => {
              const Icon = iconMap[feature.icon]
              return (
                <article
                  key={feature.title}
                  onMouseMove={onCardMove}
                  className="feature-card card relative rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(0,217,146,0.22),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--border)] bg-[#0b0b0e] text-[var(--green)]">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>
                    <h3 className="text-xl">{feature.title}</h3>
                    <p className="mt-3 text-[var(--text-2)]">{feature.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">Go live in three steps.</h2>

          <div className="relative mt-10 grid gap-6 md:grid-cols-3">
            <span className="absolute left-[10%] top-12 hidden h-px w-[80%] bg-[var(--border)] md:block" />
            {serviceSteps.map((step) => (
              <article key={step.number} className="relative rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6">
                <p className="font-[system-ui] text-[64px] font-extralight leading-none text-[var(--green)]">{step.number}</p>
                <h3 className="mt-4 text-xl">{step.title}</h3>
                <p className="mt-3 text-[var(--text-2)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <FeaturedIntegrationsSection />

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>PRICING</SectionLabel>
          <h2 className="mt-4 text-center font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Choose a plan built for your growth stage.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingTiers.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-lg bg-[var(--card)] p-6 shadow-[rgba(92,88,85,0.2)_0_0_15px] ${
                  plan.featured ? 'border-2 border-[var(--green)]' : 'border border-[var(--border-warm)]'
                }`}
              >
                {plan.badge ? (
                  <span className="inline-flex rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-3 py-1 text-xs text-[var(--green)]">
                    {plan.badge}
                  </span>
                ) : null}
                <h3 className="mt-4 text-2xl">{plan.name}</h3>
                <p className="mt-2 text-sm text-[var(--text-2)]">{plan.for}</p>
                <p className="mt-4 text-3xl font-light">
                  {plan.monthly ? `₹${plan.monthly.toLocaleString('en-IN')}/mo` : 'Custom'}
                </p>
                {plan.name === 'Enterprise' ? (
                  <a
                    href={LINKS.talkToSales}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-[var(--border-warm)] px-4 py-3 text-sm font-semibold text-[#fff] no-underline hover:bg-black/20"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    to="/get-started"
                    className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold no-underline ${
                      plan.featured
                        ? 'bg-[var(--green)] text-[#050507]'
                        : 'border border-[var(--border-warm)] text-[#fff] hover:bg-black/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/pricing" className="text-sm text-[var(--green)] no-underline hover:underline">
              See Full Pricing →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>TESTIMONIALS</SectionLabel>
          <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
            Teams using AI Agents Pro are shipping faster outcomes.
          </h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="relative overflow-hidden rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-6"
              >
                <span className="absolute -right-2 top-2 text-8xl font-semibold text-[rgba(0,217,146,0.06)]">&quot;</span>
                <p className="relative text-[var(--text-2)]">“{item.quote}”</p>
                <p className="mt-5 font-medium text-[var(--text)]">{item.name}</p>
                <p className="text-sm text-[var(--text-3)]">{item.role}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-[var(--border)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <SectionLabel>INSIGHTS & RESOURCES</SectionLabel>
              <h2 className="mt-4 font-[system-ui] text-[36px] leading-[1.11] tracking-[-0.9px]">
                Insights & Resources
              </h2>
            </div>
            <Link to="/blog" className="text-sm text-[var(--green)] no-underline hover:underline">
              View All Posts →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loadingPosts
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                    <div className="h-40 animate-pulse rounded-md bg-[#17171d]" />
                    <div className="mt-4 h-3 w-20 animate-pulse rounded bg-[#17171d]" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#17171d]" />
                    <div className="mt-2 h-4 max-w-[70%] animate-pulse rounded bg-[#17171d]" />
                    <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-[#17171d]" />
                  </div>
                ))
              : blogPosts.map((post) => (
                  <article key={post.slug} className="rounded-lg border border-[var(--border-warm)] bg-[var(--card)] p-4">
                    <img
                      src={post.coverImage}
                      alt={`${post.title} cover`}
                      width="1200"
                      height="630"
                      className="aspect-video w-full rounded-md border border-[var(--border)] object-cover"
                    />
                    <span className="mt-4 inline-flex rounded-full border border-[var(--border-accent)] bg-[var(--green-dim)] px-2.5 py-1 text-xs text-[var(--green)]">
                      {post.tag}
                    </span>
                    <h3 className="mt-3 text-lg leading-snug">
                      <Link to={`/blog/${post.slug}`} className="no-underline transition hover:text-[var(--green)]">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--text-2)]">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-[var(--text-3)]">
                      {post.author} · {formatDate(post.date)}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-3 inline-flex text-sm text-[var(--green)] no-underline hover:underline"
                    >
                      Read More →
                    </Link>
                  </article>
                ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="bg-[linear-gradient(135deg,rgba(0,217,146,0.16),rgba(0,0,0,0.0))] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[system-ui] text-[clamp(34px,5vw,52px)] font-light tracking-[-0.04em] text-[var(--green)]">
            Ready to automate your business?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Start your free trial today and see results in the first week.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/get-started"
              onClick={() => onPrimaryCta('cta_band_get_started')}
              className="inline-flex items-center rounded-xl bg-[var(--green)] px-7 py-3.5 text-sm font-semibold text-[#050507] no-underline"
            >
              Get Started Free
            </Link>
            <a
              href={LINKS.watchDemo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onPrimaryCta('cta_band_book_demo')}
              className="inline-flex items-center rounded-xl border border-[var(--border-warm)] px-7 py-3.5 text-sm font-medium text-[#fff] no-underline hover:bg-black/20"
            >
              Book a Demo
            </a>
          </div>

          <form onSubmit={submitNewsletter} className="mx-auto mt-8 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-12 w-full rounded-xl border border-[var(--border-warm)] bg-[var(--card)] px-4 text-sm text-[var(--text)] outline-none focus:border-[var(--green)]"
              />
              <button
                type="submit"
                disabled={newsletterState.loading}
                className="h-12 rounded-xl bg-[var(--green)] px-6 text-sm font-semibold text-[#050507] disabled:opacity-60"
              >
                {newsletterState.loading ? 'Sending...' : 'Get Updates'}
              </button>
            </div>
            {newsletterState.message ? (
              <p className="mt-3 text-sm text-[var(--text-2)]">{newsletterState.message}</p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  )
}

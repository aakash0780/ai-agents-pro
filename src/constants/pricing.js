export const pricingTiers = [
  {
    name: 'Starter',
    monthly: 4999,
    annual: 3999,
    for: 'Solo founders, small teams, and early-stage companies',
    featured: false,
    cta: 'Start Free Trial',
    ctaType: 'ghost',
    features: [
      '1 AI agent',
      'Up to 500 conversations/month',
      'Web chat channel only',
      'Basic FAQ & support automation',
      'Email integration',
      'Standard analytics dashboard',
      'Email support (24h response)',
      '1 human handoff seat',
      'Onboarding call (1 session)',
    ],
  },
  {
    name: 'Growth',
    monthly: 12999,
    annual: 10399,
    for: 'Scale-ups and growing customer-facing teams',
    featured: true,
    badge: 'Most Popular',
    cta: 'Get Started',
    ctaType: 'primary',
    features: [
      '3 AI agents',
      'Up to 5,000 conversations/month',
      'Web + WhatsApp + Email channels',
      'Sales automation + lead qualification',
      'CRM sync (HubSpot or Salesforce)',
      'Advanced analytics + custom reports',
      'Priority support (4h response)',
      '5 human handoff seats',
      'Dedicated onboarding (3 sessions)',
      'A/B testing for agent responses',
      'Custom brand voice training',
    ],
  },
  {
    name: 'Enterprise',
    monthly: null,
    annual: null,
    for: 'Large organizations, agencies, and multi-brand operations',
    featured: false,
    cta: 'Talk to Sales',
    ctaType: 'ghost',
    features: [
      'Unlimited AI agents',
      'Unlimited conversations',
      'All channels (Web, WhatsApp, Voice, Email, SMS)',
      'Full custom integration development',
      'Multi-language support',
      'White-label option',
      'SLA guarantee (99.9% uptime)',
      'Dedicated account manager',
      'Custom training & onboarding',
      'On-premise deployment option',
      'Security audit & compliance docs',
    ],
  },
]

export const comparisonRows = [
  { feature: 'AI agents included', starter: '1', growth: '3', enterprise: 'Unlimited' },
  { feature: 'Monthly conversations', starter: '500', growth: '5,000', enterprise: 'Unlimited' },
  { feature: 'Web chat', starter: true, growth: true, enterprise: true },
  { feature: 'WhatsApp channel', starter: false, growth: true, enterprise: true },
  { feature: 'Email channel', starter: true, growth: true, enterprise: true },
  { feature: 'Voice / phone channel', starter: false, growth: false, enterprise: true },
  { feature: 'Sales automation', starter: false, growth: true, enterprise: true },
  { feature: 'Lead qualification', starter: false, growth: true, enterprise: true },
  { feature: 'CRM integration', starter: false, growth: 'HubSpot or Salesforce', enterprise: 'Custom / Multiple' },
  { feature: 'Analytics dashboard', starter: 'Standard', growth: 'Advanced', enterprise: 'Custom + White-label' },
  { feature: 'Human handoff seats', starter: '1', growth: '5', enterprise: 'Custom' },
  { feature: 'Onboarding sessions', starter: '1', growth: '3', enterprise: 'Custom' },
  { feature: 'SLA guarantee', starter: false, growth: false, enterprise: true },
  { feature: 'White-label option', starter: false, growth: false, enterprise: true },
]

export const addOns = [
  { name: 'Extra agent (+1)', price: '₹2,999/mo' },
  { name: 'Extra conversation pack (+1,000)', price: '₹999/mo' },
  { name: 'Voice channel activation', price: '₹3,999/mo' },
  { name: 'Custom integration build', price: '₹9,999 one-time' },
  { name: 'White-label license', price: '₹7,999/mo' },
  { name: 'Priority onboarding (extra sessions)', price: '₹2,499/session' },
]

export const pricingFaqs = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes — all plans include a 14-day free trial with full features. No credit card required.',
  },
  {
    question: 'What counts as a "conversation"?',
    answer:
      'A conversation is a single user session, from first message to resolution or handoff, regardless of message count.',
  },
  {
    question: 'Can I switch plans mid-month?',
    answer: 'Yes. Upgrades take effect immediately. Downgrades apply at the next billing cycle.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee if your agent does not meet the agreed performance benchmarks.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most clients are live within 48–72 hours. Enterprise deployments take 1–2 weeks.',
  },
  {
    question: 'What languages does the agent support?',
    answer: 'English, Hindi, and major Indian regional languages. Additional languages on request.',
  },
  {
    question: 'Is my data secure?',
    answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 compliant.',
  },
  {
    question: 'Can I use my own AI model?',
    answer: 'Enterprise plan supports BYO model (GPT-4o, Claude, Gemini) via API key.',
  },
  {
    question: 'What is the WhatsApp Business setup process?',
    answer: 'We handle the full BSP onboarding and phone number registration on your behalf.',
  },
  {
    question: 'Do you offer agency/reseller pricing?',
    answer: 'Yes — contact us for white-label and revenue-share arrangements.',
  },
]

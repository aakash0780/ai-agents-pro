import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  CheckCircle,
  Zap,
  Shield,
  Rocket,
  Headphones,
  Settings,
  Database,
  Briefcase
} from 'lucide-react'

export function PricingPage() {
  const [conversations, setConversations] = useState(5000)

  // Cost Calculation based on Document:
  // n8n Cloud Pro: ~$60 (₹5,000)
  // Claude 3.5 Sonnet: ~$60 for 10k queries (₹5,000)
  // Vector DB: ~$40 (₹3,500)
  // Hosting: ~₹2,000
  // Total Base for 10k: ~₹15,000/mo
  // Price to Client: ₹25,000 - ₹50,000/mo (Margin-based)

  const calculateCost = (convs) => {
    // Base platform fee: ₹15,000
    // Variable cost per conversation: ₹3 (buffer for token spikes)
    const baseFee = 15000
    const variableCost = convs * 3
    return baseFee + variableCost
  }

  const estimatedCost = calculateCost(conversations)

  const engagements = [
    {
      name: 'Pilot Project',
      price: '₹1,50,000',
      period: 'one-time',
      description: 'Validate AI value with a low-risk implementation of 1-2 high-impact use cases.',
      features: [
        'Discovery Workshop & Strategy',
        '1-2 Custom AI Workflows',
        'Basic RAG Chatbot Setup',
        '2-4 Weeks Delivery',
        'internal Team Training'
      ],
      cta: 'Start Pilot',
      popular: false,
      icon: Rocket
    },
    {
      name: 'Growth',
      price: '₹4,00,000',
      period: 'starting at',
      description: 'Scale your automation with comprehensive workflows and department-wide agents.',
      features: [
        'Full Process Process Mapping',
        '5-10 Integrated Workflows',
        'Advanced Knowledge Base',
        'CRM & ERP Integrations',
        'Custom Dashboard'
      ],
      cta: 'Scale Up',
      popular: true,
      icon: Zap
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'quote',
      description: 'Full digital transformation with dedicated infrastructure and heavy compliance.',
      features: [
        'On-Premise / Self-Hosted',
        'Unlimited Workflows',
        'SLA & Priority Support',
        'Custom LLM Fine-tuning',
        'Dedicated Account Manager'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: Shield
    }
  ]

  const retainers = [
    {
      name: 'Maintenance',
      price: '₹25,000',
      desc: 'Monitoring, updates, and minor tweaks.',
      features: ['Uptime Monitoring', 'Bug Fixes', 'Monthly Report']
    },
    {
      name: 'Optimization',
      price: '₹60,000',
      desc: 'Continuous improvement and new features.',
      features: ['Prompt Optimization', 'New Workflows', 'Weekly Review', 'Priority Support']
    }
  ]

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
            High-ROI Investment
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
            Simple, Transparent Engagement Models
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            We don't sell "tools". We sell outcomes. Choose a model that fits your stage of growth.
          </p>
        </div>

        {/* Engagement Models (Setup) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {engagements.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className={`relative flex flex-col h-full border-2 ${plan.popular ? 'border-blue-600 shadow-2xl md:scale-105 z-10' : 'border-slate-200 dark:border-slate-800 shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-200">
                    <plan.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="pt-2 min-h-[50px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-500 ml-2 text-sm uppercase font-semibold">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button className={`w-full h-12 text-lg ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Engagement Process Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">How We Work</h2>
          
          {/* Mobile Timeline */}
          <div className="md:hidden relative border-l-4 border-blue-200 dark:border-blue-900 ml-6 space-y-12 pl-8">
            {[
              {
                step: '01',
                title: 'Discovery Workshop',
                desc: 'We map your existing manual processes and identify high-ROI automation opportunities.',
                color: 'bg-blue-600'
              },
              {
                step: '02',
                title: 'Architecture & Design',
                desc: 'We design the agent workflows, database schema, and security protocols for your approval.',
                color: 'bg-purple-600'
              },
              {
                step: '03',
                title: 'Agile Implementation',
                desc: 'We build the agents, connect integrations, and train the AI on your specific data.',
                color: 'bg-green-600'
              },
              {
                step: '04',
                title: 'Testing & Handover',
                desc: 'Rigorous testing, team training, and deployment to production with documentation.',
                color: 'bg-yellow-600'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <div className={`absolute -left-[45px] w-8 h-8 rounded-full ${item.color} border-4 border-white dark:border-slate-950`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {item.step}</span>
                <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                <p className="text-slate-500 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Desktop Timeline - Alternating Left/Right */}
          <div className="hidden md:block relative max-w-5xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-900 -translate-x-1/2" />
            
            <div className="space-y-20">
              {[
                {
                  step: '01',
                  title: 'Discovery Workshop',
                  desc: 'We map your existing manual processes and identify high-ROI automation opportunities.',
                  color: 'bg-blue-600'
                },
                {
                  step: '02',
                  title: 'Architecture & Design',
                  desc: 'We design the agent workflows, database schema, and security protocols for your approval.',
                  color: 'bg-purple-600'
                },
                {
                  step: '03',
                  title: 'Agile Implementation',
                  desc: 'We build the agents, connect integrations, and train the AI on your specific data.',
                  color: 'bg-green-600'
                },
                {
                  step: '04',
                  title: 'Testing & Handover',
                  desc: 'Rigorous testing, team training, and deployment to production with documentation.',
                  color: 'bg-yellow-600'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-12 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  {/* Content Box */}
                  <div className="w-1/2">
                    <div className={`bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 ${index % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                      <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Step {item.step}</span>
                      <h3 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-3">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center Timeline Dot */}
                  <div className="relative flex justify-center">
                    <div className={`w-12 h-12 rounded-full ${item.color} border-4 border-white dark:border-slate-950 z-10 flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform duration-200 shadow-lg`}>
                      •
                    </div>
                  </div>

                  {/* Empty space (right side for left items, left side for right items) */}
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Retainers */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Ongoing Support & Maintenance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {retainers.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-2xl font-bold text-blue-600">{plan.price}<span className="text-sm text-slate-400 font-normal">/mo</span></span>
                    </CardTitle>
                    <CardDescription>{plan.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {plan.features.map((f, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Usage Cost Estimator */}
        <motion.div
          className="max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-24 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-blue-400" />
                <h2 className="text-2xl font-bold">Infrastructure Costs</h2>
              </div>
              <p className="text-slate-400 mb-8">
                We pass on infrastructure costs (LLM tokens, Server hosting, Vector DB) with complete transparency. Include this in your monthly budget.
              </p>

              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Monthly Conversations</span>
                  <span className="font-bold text-blue-400">{conversations.toLocaleString()}</span>
                </div>
                <Slider
                  value={[conversations]}
                  onValueChange={(val) => setConversations(val[0])}
                  max={50000}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>100</span>
                  <span>50,000+</span>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> GPT-4o / Claude 3.5</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> Unmetered Bandwidth</span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors duration-300">
              <h3 className="text-slate-400 font-medium mb-4">Estimated Monthly Infra Cost</h3>
              <div className="text-5xl font-bold text-white mb-2">
                ₹{estimatedCost.toLocaleString()}
                <span className="text-lg text-slate-500 font-normal">/mo</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                *Includes Hosting, Database, Vector Store, and LLM API costs.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get a Detailed Quote
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Why is there a setup fee?",
                a: "Building a reliable AI agent requires process mapping, custom prompting, and rigorous testing. This is a consulting and engineering engagement, not just a software subscription."
              },
              {
                q: "What if I need more workflows later?",
                a: "You can move to our Growth plan or we can quote individual workflows as add-ons to your existing retainer."
              },
              {
                q: "Do you offer a guarantee?",
                a: "Yes. For Pilot projects, we define clear success metrics (e.g., 'Answers 80% of FAQs correctly'). If we don't hit them, we keep refining until we do, or you get your money back."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Building2,
  Headphones,
  Briefcase,
  CheckCircle,
  MessageCircle,
  Mail,
  Home,
  Heart,
  Phone,
  ShoppingCart,
  GraduationCap,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ServicesPage() {
  const mainServices = [
    {
      icon: Building2,
      title: 'Sales Automation',
      description: 'Transform your sales process with intelligent AI agents.',
      features: [
        'Lead qualification and scoring',
        'Personalized recommendations',
        'Automated follow-up sequences',
        'Demo scheduling',
        'CRM integration',
        'Pipeline optimization'
      ],
      benefits: [
        '3x increase in lead conversion',
        '50% reduction in sales cycle',
        '24/7 lead capture',
        'Consistent messaging'
      ]
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Provide exceptional customer service around the clock.',
      features: [
        '24/7 FAQ handling',
        'Order tracking updates',
        'Intelligent ticket routing',
        'Multi-channel support',
        'Human escalation',
        'Satisfaction tracking'
      ],
      benefits: [
        '70% reduction in costs',
        '95% satisfaction rate',
        'Instant response times',
        'Reduced agent workload'
      ]
    },
    {
      icon: Briefcase,
      title: 'Custom Solutions',
      description: 'Tailored AI solutions for unique business challenges.',
      features: [
        'Custom workflow automation',
        'Knowledge base creation',
        'Regulatory adherence',
        'Specialized integrations',
        'Custom reporting',
        'Scalable architecture'
      ],
      benefits: [
        'Industry expertise',
        'Faster implementation',
        'High accuracy',
        'Compliance built-in'
      ]
    }
  ]

  const industries = [
    {
      icon: Home,
      title: 'Real Estate',
      description: 'Property inquiries, lead qualification, and scheduling.',
      features: ['Property matching', 'Virtual tours']
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Appointment booking, patient inquiries, and reminders.',
      features: ['Scheduling', 'Symptom checks']
    },
    {
      icon: Phone,
      title: 'BPO & Call Centers',
      description: 'Multilingual support, routing, and QA analytics.',
      features: ['Multi-language', 'Quality monitoring']
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Order assistance, recommendations, and support.',
      features: ['Product advice', 'Order tracking']
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'Student inquiries, enrollment, and guidance.',
      features: ['Course info', 'Enrollment help']
    },
    {
      icon: TrendingUp,
      title: 'Finance',
      description: 'Account inquiries, transaction support, and advice.',
      features: ['Account mgmt', 'Compliance']
    }
  ]

  const processSteps = [
    { step: '01', title: 'Discovery', desc: 'We analyze your current processes and needs.' },
    { step: '02', title: 'Design', desc: 'We design a tailored AI solution for you.' },
    { step: '03', title: 'Build', desc: 'We develop and test your AI agents.' },
    { step: '04', title: 'Deploy', desc: 'We launch and train your team.' },
    { step: '05', title: 'Optimize', desc: 'Continuous monitoring and improvement.' }
  ]

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary/5 blur-3xl rounded-full scale-150 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
              🎯 Our Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Complete AI Solutions for{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Every Industry
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From sales automation to customer support, we provide comprehensive AI solutions tailored to your specific business needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive automation to transform operations.</p>
          </div>

          <div className="space-y-12">
            {mainServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass border-none overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                          <service.icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6">{service.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-fit" asChild>
                        <a href={`https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27m%20interested%20in%20${service.title}.`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Get Started
                        </a>
                      </Button>
                    </CardContent>

                    <CardContent className="p-8 bg-muted/30 flex flex-col justify-center">
                      <h4 className="font-semibold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Key Benefits
                      </h4>
                      <div className="space-y-4">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-background/50 p-3 rounded-lg border border-border/50">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industies Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground">Specialized solutions for unique challenges.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="glass border-none h-full hover:bg-background/80 transition-colors">
                  <CardHeader>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                      <industry.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{industry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{industry.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {industry.features.map((Tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs font-normal">{Tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How We Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full glass border-none text-center pt-8 hover:-translate-y-1 transition-transform">
                  <CardContent className="flex flex-col items-center">
                    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary/20 to-transparent mb-4 select-none">
                      {step.step}
                    </span>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-900 opacity-90"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Automate?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let's discuss how our AI solutions can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white shadow-xl border-none" asChild>
              <a href="https://wa.me/919967789335" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Discuss Your Needs
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md" asChild>
              <a href="mailto:aakash99677@gmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

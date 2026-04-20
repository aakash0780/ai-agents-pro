import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  Users,
  Target,
  Award,
  Lightbulb,
  MessageCircle,
  Mail,
  CheckCircle,
  Bot,
  Rocket
} from 'lucide-react'

export function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly push the boundaries of AI technology to deliver cutting-edge solutions that give our clients a competitive advantage.'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Every solution we build is designed with the end-user in mind, ensuring seamless experiences for both businesses and their customers.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do, from code quality to customer service, delivering exceptional results every time.'
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Our focus is on measurable outcomes that directly impact your bottom line, with proven ROI across all our implementations.'
    }
  ]

  const achievements = [
    { number: '500+', label: 'Businesses Transformed' },
    { number: '2M+', label: 'Customer Interactions Automated' },
    { number: '70%', label: 'Average Cost Reduction' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ]

  const teamMembers = [
    {
      name: 'Akash Mali',
      role: 'Founder & CEO',
      icon: Users,
      description: 'AI expert with 5+ years in automation and customer service solutions. Passionate about transforming businesses through intelligent technology.',
      contact: {
        whatsapp: 'https://wa.me/919967789335',
        email: 'aakash99677@gmail.com'
      }
    },
    {
      name: 'Nova (AI Agent)',
      role: '24/7 Business Assistant',
      icon: Bot,
      description: 'Our advanced AI agent dedicated to instant data analysis, workflow optimization, and ensuring 100% operational uptime for your business.',
      contact: {
        whatsapp: 'https://wa.me/919967789335', // Routing to main business contact for now
        email: 'aakash99677@gmail.com'
      }
    }
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4">🚀 About AI Agents Pro</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Pioneering the Future of{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Business Automation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are a team of AI specialists dedicated to revolutionizing how businesses interact with their customers.
              Our mission is to make advanced AI technology accessible to businesses of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <h2 className="text-3xl font-bold mb-4 text-blue-600">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To democratize AI technology by providing businesses with intelligent automation solutions
                  that enhance customer experiences, reduce operational costs, and drive sustainable growth.
                  We believe every business deserves access to cutting-edge AI capabilities, regardless of size or industry.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <h2 className="text-3xl font-bold mb-4 text-purple-600">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the global leader in AI-powered business automation, creating a world where
                  intelligent agents seamlessly handle routine tasks, allowing human teams to focus on
                  innovation, creativity, and building meaningful relationships with customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and shape our approach to AI development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Impact</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Numbers that reflect our commitment to delivering exceptional results
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-cyan-400 mb-2">
                  {achievement.number}
                </div>
                <div className="text-lg text-gray-300">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 border-none dark:bg-blue-900/20 dark:text-blue-400">
              👥 Our Team
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The experts behind AI Agents Pro, dedicated to transforming your business with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-xl transition-all duration-300 border-2 ${
                  member.name === 'Nova (AI Agent)' 
                    ? 'hover:border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20' 
                    : 'hover:border-blue-500'
                }`}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-32 h-32 bg-gradient-to-br ${
                      member.name === 'Nova (AI Agent)' 
                        ? 'from-purple-500 to-pink-600' 
                        : 'from-blue-500 to-purple-600'
                    } rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative`}>
                      <member.icon className="h-16 w-16 text-white" />
                      {member.name === 'Nova (AI Agent)' && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className={`font-semibold mb-4 ${
                      member.name === 'Nova (AI Agent)' 
                        ? 'text-purple-600 dark:text-purple-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {member.role}
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{member.description}</p>
                    <div className="flex justify-center gap-3">
                      <Button 
                        size="sm" 
                        className={member.name === 'Nova (AI Agent)' 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                        } 
                        asChild
                      >
                        {member.name === 'Nova (AI Agent)' ? (
                          <a 
                            href={member.contact.whatsapp + '?text=Hi%2C%20I%27d%20like%20to%20create%20my%20own%20company%20AI%20agent.'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Learn more about creating your AI agent"
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Create Your Agent
                          </a>
                        ) : (
                          <a 
                            href={member.contact.whatsapp} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`Contact ${member.name} on WhatsApp`}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </a>
                        )}
                      </Button>
                      {member.name !== 'Nova (AI Agent)' && (
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={`mailto:${member.contact.email}`}
                            aria-label={`Email ${member.name}`}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose AI Agents Pro?</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We combine technical expertise with deep business understanding to deliver solutions that truly work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Proven track record with 500+ successful implementations',
              'Industry-specific expertise across multiple sectors',
              '24/7 support and continuous optimization',
              'Transparent pricing with no hidden costs',
              'Rapid deployment in as little as 48 hours',
              'Comprehensive training and ongoing support'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-white/90">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-green-500 hover:bg-green-600" asChild>
              <a
                href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20learn%20more%20about%20AI%20Agents%20Pro."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get Started Today
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

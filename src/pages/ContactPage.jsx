import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Headphones,
  Users,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setSubmitting(true)

    try {
      // Create WhatsApp message with form data
      const message = `Hi Akash, I'm interested in AI Agents Pro services.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company: ${formData.company}
Service Interest: ${formData.service}
Message: ${formData.message}`

      const whatsappUrl = `https://wa.me/919967789335?text=${encodeURIComponent(message)}`

      // Artificial delay for UX
      await new Promise(resolve => setTimeout(resolve, 800))

      window.open(whatsappUrl, '_blank')

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        service: ''
      })

      toast.success('Form submitted! Opening WhatsApp...')
    } catch (error) {
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Get instant responses to your queries',
      value: '+91 99677 89335',
      action: 'Chat Now',
      link: 'https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20know%20more%20about%20AI%20Agents%20Pro.',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us detailed inquiries',
      value: 'aakash99677@gmail.com',
      action: 'Send Email',
      link: 'mailto:aakash99677@gmail.com?subject=AI%20Agents%20Inquiry',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Speak directly with our team',
      value: '+91 99677 89335',
      action: 'Call Now',
      link: 'tel:+919967789335',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-violet-600'
    }
  ]

  const supportOptions = [
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your needs'
    },
    {
      icon: Users,
      title: 'Dedicated Team',
      description: 'Expert AI specialists assigned to your project'
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Book consultations at your convenience'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
              📞 Contact Us
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Let's Transform Your Business{' '}
              <span className="text-gradient">
                Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to revolutionize your customer interactions with AI? Get in touch with our experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{method.title}</h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    <p className="font-medium mb-6 text-lg">{method.value}</p>
                    <Button className={`w-full bg-gradient-to-r ${method.gradient} hover:opacity-90 transition-opacity`} asChild>
                      <a href={method.link} target="_blank" rel="noopener noreferrer" aria-label={`Contact via ${method.title}`}>
                        {method.action}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-secondary/50 -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Send Us a Message</h2>
            <p className="text-xl text-muted-foreground">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl text-center font-bold">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          className={cn(
                            "transition-all duration-300 h-12 pl-4",
                            errors.name && "border-destructive focus-visible:ring-destructive/30"
                          )}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                      </div>
                      {errors.name && (
                        <motion.p 
                          id="name-error" 
                          className="text-sm text-destructive flex items-center gap-1 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </motion.p>
                      )}
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                          className={cn(
                            "transition-all duration-300 h-12 pl-4",
                            errors.email && "border-destructive focus-visible:ring-destructive/30"
                          )}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                      </div>
                      {errors.email && (
                        <motion.p 
                          id="email-error" 
                          className="text-sm text-destructive flex items-center gap-1 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="transition-all duration-300 h-12 pl-4"
                      />
                    </motion.div>
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="company" className="text-sm font-medium">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        className="transition-all duration-300 h-12 pl-4"
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="service" className="text-sm font-medium">Service Interest</Label>
                    <Select value={formData.service} onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-12 transition-all duration-300">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pilot Project">Pilot Project (₹1.5L)</SelectItem>
                        <SelectItem value="Growth">Growth Engagement (₹4L+)</SelectItem>
                        <SelectItem value="Enterprise">Enterprise Solution</SelectItem>
                        <SelectItem value="AI Agents">AI Agents & Workflows</SelectItem>
                        <SelectItem value="Task Automation">Task Automation</SelectItem>
                        <SelectItem value="Custom Chatbot">Custom AI Chatbot</SelectItem>
                        <SelectItem value="Consultation">Free Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your business needs..."
                      rows={5}
                      required
                      className={cn(
                        "transition-all duration-300 resize-none",
                        errors.message && "border-destructive focus-visible:ring-destructive/30"
                      )}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <motion.p 
                        id="message-error" 
                        className="text-sm text-destructive flex items-center gap-1 mt-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.message}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Our Support?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to providing exceptional support throughout your AI journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-none bg-secondary/30 h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md text-white">
                      <option.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Bot, MessageCircle, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4 hover:opacity-90 transition-opacity">
              <Bot className="h-8 w-8 text-primary" />
              AI Agents Pro
            </Link>
            <p className="mb-6 max-w-sm leading-relaxed text-sm">
              We build AI support agents for businesses that handle repetitive website and WhatsApp enquiries every day.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/919967789335"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 p-2 rounded-lg hover:bg-green-500/10 hover:text-green-500 transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="mailto:aakash99677@gmail.com"
                className="bg-slate-900 p-2 rounded-lg hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+919967789335"
                className="bg-slate-900 p-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-500 transition-all"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">Lead Qualification</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">Support Automation</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">WhatsApp Workflows</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">Engagement Models</Link>
              </li>
            </ul>
          </div>

          {/* Contact / Industries */}
          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Client Login</Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20book%20a%20demo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Book Demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI Agents Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

import { MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        asChild
      >
        <a
          href="https://wa.me/919967789335?text=Hi%20Akash%2C%20I%27d%20like%20to%20book%20a%20demo%20for%20an%20AI%20support%20agent."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book a demo on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </Button>
      
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        asChild
      >
        <a
          href="mailto:aakash99677@gmail.com?subject=Demo%20request%20for%20AI%20support%20agent"
          aria-label="Request a demo by email"
        >
          <Mail className="h-6 w-6" />
        </a>
      </Button>
    </div>
  )
}

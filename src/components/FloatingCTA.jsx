import { MessageCircle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pb-16 sm:pb-0">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full border border-border bg-card text-primary shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 hover:scale-110"
        asChild
      >
        <Link to="/get-started" aria-label="Open get started page">
          <MessageCircle className="h-6 w-6" />
        </Link>
      </Button>
      
      <Button
        size="icon"
        className="h-14 w-14 rounded-full border border-border bg-card text-foreground shadow-lg hover:bg-background hover:shadow-xl transition-all duration-300 hover:scale-110"
        asChild
      >
        <Link to="/contact" aria-label="Open contact page">
          <Mail className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
}

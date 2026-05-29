/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) {
        setIsVisible(false)
        return
      }

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show sticky CTA after scrolling down 300px on mobile only
      if (isMobile) {
        // Hide near footer (last 400px of page)
        const nearFooter = scrollY > documentHeight - windowHeight - 400
        // Hide in first 300px (hero section with CTAs)
        const inHero = scrollY < 300
        
        setIsVisible(scrollY > 300 && !nearFooter && !inHero)
      } else {
        setIsVisible(false) // Hide on desktop
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-4 right-4 z-40 flex justify-center"
          role="complementary"
          aria-label="Call to action button"
        >
          <div className="relative w-full flex justify-center">
            <Button
              size="lg"
              className="h-auto rounded-md border border-border bg-card px-6 py-5 text-sm font-semibold text-primary shadow-2xl transition-all hover:scale-105 hover:bg-background hover:shadow-xl active:scale-95 sm:px-8 sm:py-6 sm:text-base"
              asChild
            >
              <Link
                to="/get-started"
                className="flex items-center gap-2 no-underline"
                aria-label="Open get started page"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Get Started</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
            
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-14 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss call to action button"
              title="Dismiss this button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

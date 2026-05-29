import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const hasObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const [isVisible, setIsVisible] = useState(!hasObserver)

  useEffect(() => {
    const target = ref.current
    if (!target) {
      return undefined
    }

    if (!hasObserver) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (options.once !== false) {
            observer.disconnect()
          }
        } else if (options.once === false) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px',
      },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [hasObserver, options.once, options.rootMargin, options.threshold])

  return { ref, isVisible }
}

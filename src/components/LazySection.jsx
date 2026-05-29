import { useEffect, useRef, useState } from 'react'

export function LazySection({ children, minHeight = 240, rootMargin = '240px' }) {
  const anchorRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = anchorRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={anchorRef} style={{ minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}


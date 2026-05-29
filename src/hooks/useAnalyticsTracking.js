import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from '@/lib/analytics'

export function useAnalyticsTracking() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const page = `${location.pathname}${location.search}`
    const timeoutId = window.setTimeout(() => {
      trackPageView(page)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [location.pathname, location.search])
}

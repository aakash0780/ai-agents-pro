import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function TopProgressBar() {
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const intervalRef = useRef(null)
  const finishRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = window.setTimeout(() => {
      setVisible(true)
      setProgress(8)
    }, 0)

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
    }
    if (finishRef.current) {
      window.clearTimeout(finishRef.current)
    }

    intervalRef.current = window.setInterval(() => {
      setProgress((current) => (current >= 92 ? current : current + Math.max(1, (95 - current) * 0.08)))
    }, 90)

    finishRef.current = window.setTimeout(() => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
      setProgress(100)
      window.setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 240)
    }, 550)

    return () => {
      if (startRef.current) window.clearTimeout(startRef.current)
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (finishRef.current) window.clearTimeout(finishRef.current)
    }
  }, [location.pathname, location.search, location.hash])

  return (
    <div
      className={`pointer-events-none fixed left-0 right-0 top-0 z-[120] h-[2px] transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#00d992] via-[#57f5cc] to-[#00d992] shadow-[0_0_20px_rgba(0,217,146,0.65)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

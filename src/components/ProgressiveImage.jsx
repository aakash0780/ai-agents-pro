import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ProgressiveImage({
  src,
  alt,
  className,
  wrapperClassName,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('overflow-hidden', wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-auto w-full transition-all duration-700',
          loaded ? 'scale-100 blur-0 opacity-100' : 'scale-[1.04] blur-sm opacity-70',
          className
        )}
        {...props}
      />
    </div>
  )
}


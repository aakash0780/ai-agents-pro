import { useEffect, useMemo } from 'react'
import { COMPANY, DOMAIN } from '@/utils/constants'

/** Managed meta tags use data-aip so we never collide with or mis-update other head tags. */
function ensureMeta(dataKey, attributes) {
  const selector = `meta[data-aip="${dataKey}"]`
  let node = document.head.querySelector(selector)

  if (!node) {
    node = document.createElement('meta')
    node.setAttribute('data-aip', dataKey)
    document.head.appendChild(node)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value != null) node.setAttribute(key, String(value))
  })
}

function setStructuredDataScripts(items) {
  document.head.querySelectorAll('script[data-aip-schema="true"]').forEach((n) => n.remove())

  items.forEach((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.aipSchema = 'true'
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
  })
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.image]
 * @param {string} [props.url] Absolute or path — full URL for canonical + OG when set
 * @param {string} [props.canonicalPath] Path segment e.g. `/get-started` (used when `url` omitted)
 * @param {object[]} [props.structuredData] JSON-LD objects
 */
export function SEO({
  title,
  description,
  image = '/og-image.webp',
  url,
  canonicalPath,
  structuredData = [],
}) {
  const resolvedUrl = useMemo(() => {
    if (url && /^https?:\/\//i.test(url)) return url
    if (url) return new URL(url, DOMAIN).toString()
    const path = canonicalPath || '/'
    const normalized = path.startsWith('/') ? path : `/${path}`
    return new URL(normalized, DOMAIN).toString()
  }, [url, canonicalPath])

  const structuredKey = useMemo(() => JSON.stringify(structuredData), [structuredData])

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : new URL(DOMAIN).origin
    const finalImage = new URL(image, origin).toString()

    document.title = title

    ensureMeta('description', { name: 'description', content: description })
    ensureMeta('og:title', { property: 'og:title', content: title })
    ensureMeta('og:description', { property: 'og:description', content: description })
    ensureMeta('og:image', { property: 'og:image', content: finalImage })
    ensureMeta('og:url', { property: 'og:url', content: resolvedUrl })
    ensureMeta('og:site_name', { property: 'og:site_name', content: COMPANY })
    ensureMeta('og:type', { property: 'og:type', content: 'website' })
    ensureMeta('twitter:card', { name: 'twitter:card', content: 'summary_large_image' })
    ensureMeta('twitter:title', { name: 'twitter:title', content: title })
    ensureMeta('twitter:description', { name: 'twitter:description', content: description })
    ensureMeta('twitter:image', { name: 'twitter:image', content: finalImage })

    let canonical = document.head.querySelector('link[data-aip="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('data-aip', 'canonical')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', resolvedUrl)
  }, [title, description, image, resolvedUrl])

  useEffect(() => {
    if (!structuredData.length) {
      document.head.querySelectorAll('script[data-aip-schema="true"]').forEach((node) => node.remove())
      return undefined
    }

    setStructuredDataScripts(structuredData)

    return () => {
      document.head.querySelectorAll('script[data-aip-schema="true"]').forEach((node) => node.remove())
    }
  }, [structuredKey, structuredData])

  return null
}

/** Alias for pages that previously imported from `Seo.jsx` */
export { SEO as Seo }

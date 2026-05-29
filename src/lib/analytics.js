const UMAMI_SCRIPT_URL = normalize(import.meta.env.VITE_UMAMI_SCRIPT_URL)
const UMAMI_WEBSITE_ID = normalize(import.meta.env.VITE_UMAMI_WEBSITE_ID)
const GA4_MEASUREMENT_ID = normalize(import.meta.env.VITE_GA4_MEASUREMENT_ID)
const GOOGLE_SITE_VERIFICATION = normalize(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION)
const CLARITY_PROJECT_ID = normalize(import.meta.env.VITE_CLARITY_PROJECT_ID)
const HOTJAR_SITE_ID = normalize(import.meta.env.VITE_HOTJAR_SITE_ID)
const HOTJAR_VERSION = normalize(import.meta.env.VITE_HOTJAR_VERSION) || '6'
const META_PIXEL_ID = normalize(import.meta.env.VITE_META_PIXEL_ID)

const initialized = {
  umami: false,
  ga4: false,
  searchConsole: false,
  clarity: false,
  hotjar: false,
  metaPixel: false,
}

let customProvider
let lastTrackedPage = ''

function normalize(value) {
  return String(value || '').trim()
}

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function appendScriptOnce(id, src) {
  if (!canUseDOM() || document.querySelector(`script[data-analytics="${id}"]`)) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = src
  script.dataset.analytics = id
  document.head.appendChild(script)
}

function initUmami() {
  if (!UMAMI_SCRIPT_URL || !UMAMI_WEBSITE_ID || initialized.umami || !canUseDOM()) {
    return
  }

  const existingScript = document.querySelector(`script[data-umami="${UMAMI_WEBSITE_ID}"]`)

  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = UMAMI_SCRIPT_URL
    script.dataset.websiteId = UMAMI_WEBSITE_ID
    script.dataset.umami = UMAMI_WEBSITE_ID
    script.dataset.analytics = 'umami'
    document.head.appendChild(script)
  }

  initialized.umami = true
}

function initGA4() {
  if (!GA4_MEASUREMENT_ID || initialized.ga4 || !canUseDOM()) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: false })
  appendScriptOnce('ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_MEASUREMENT_ID)}`)

  initialized.ga4 = true
}

function initSearchConsoleVerification() {
  if (!GOOGLE_SITE_VERIFICATION || initialized.searchConsole || !canUseDOM()) {
    return
  }

  let meta = document.querySelector('meta[name="google-site-verification"]')

  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'google-site-verification'
    document.head.appendChild(meta)
  }

  meta.content = GOOGLE_SITE_VERIFICATION
  initialized.searchConsole = true
}

function initClarity() {
  if (!CLARITY_PROJECT_ID || initialized.clarity || !canUseDOM()) {
    return
  }

  window.clarity = window.clarity || function clarity() {
    ;(window.clarity.q = window.clarity.q || []).push(arguments)
  }

  appendScriptOnce('clarity', `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`)
  initialized.clarity = true
}

function initHotjar() {
  if (!HOTJAR_SITE_ID || initialized.hotjar || !canUseDOM()) {
    return
  }

  window.hj = window.hj || function hj() {
    ;(window.hj.q = window.hj.q || []).push(arguments)
  }
  window._hjSettings = {
    hjid: Number(HOTJAR_SITE_ID),
    hjsv: Number(HOTJAR_VERSION),
  }

  appendScriptOnce('hotjar', `https://static.hotjar.com/c/hotjar-${encodeURIComponent(HOTJAR_SITE_ID)}.js?sv=${encodeURIComponent(HOTJAR_VERSION)}`)
  initialized.hotjar = true
}

function initMetaPixel() {
  if (!META_PIXEL_ID || initialized.metaPixel || !canUseDOM()) {
    return
  }

  if (!window.fbq) {
    const fbq = function fbq() {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments)
      } else {
        fbq.queue.push(arguments)
      }
    }

    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    window.fbq = fbq
    window._fbq = fbq
  }

  appendScriptOnce('meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('init', META_PIXEL_ID)
  initialized.metaPixel = true
}

export function configureAnalytics(nextProvider) {
  customProvider = nextProvider
}

export function initAnalytics() {
  customProvider?.init?.()
  initSearchConsoleVerification()
  initUmami()
  initGA4()
  initClarity()
  initHotjar()
  initMetaPixel()
}

export function trackPageView(path, title = canUseDOM() ? document.title : '') {
  if (!canUseDOM()) {
    return
  }

  const pagePath = path || `${window.location.pathname}${window.location.search}`
  const pageKey = `${pagePath}:${title}`

  if (pageKey === lastTrackedPage) {
    return
  }

  lastTrackedPage = pageKey
  customProvider?.pageview?.({ path: pagePath, title })

  if (GA4_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: title,
      page_location: window.location.href,
    })
  }

  if (META_PIXEL_ID && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView')
  }

  if (HOTJAR_SITE_ID && typeof window.hj === 'function') {
    window.hj('stateChange', pagePath)
  }
}

export function trackEvent(eventName, params = {}) {
  const name = normalize(eventName)

  if (!name || !canUseDOM()) {
    return
  }

  customProvider?.track?.(name, params)

  if (UMAMI_WEBSITE_ID && typeof window.umami?.track === 'function') {
    window.umami.track(name, params)
  }

  if (GA4_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }

  if (META_PIXEL_ID && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, params)
  }

  if (CLARITY_PROJECT_ID && typeof window.clarity === 'function') {
    window.clarity('event', name)
  }

  if (HOTJAR_SITE_ID && typeof window.hj === 'function') {
    window.hj('event', name)
  }
}

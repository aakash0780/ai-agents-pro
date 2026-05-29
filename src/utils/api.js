const RAW_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const BASE_URL = RAW_BASE_URL.replace(/\/$/, '')
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw data || { error: 'Request failed', status: response.status }
  }

  return data
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  return parseResponse(response)
}

export async function submitContact(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function subscribeNewsletter(payload) {
  return request('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchBlogPosts({ page = 1, limit = 9, tag = '', search = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (tag) params.set('tag', tag)
  if (search) params.set('search', search)

  return request(`/blog/posts?${params.toString()}`)
}

export async function fetchBlogPost(slug) {
  return request(`/blog/posts/${encodeURIComponent(slug)}`)
}

export async function trackCTA(label, page) {
  return request('/events/cta', {
    method: 'POST',
    body: JSON.stringify({ event: 'cta_click', label, page }),
  })
}

export async function healthCheck() {
  return request('/health')
}

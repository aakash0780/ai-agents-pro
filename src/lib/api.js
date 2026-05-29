const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function normalizeApiBaseUrl(value) {
  const trimmed = String(value || '').replace(/\/$/, '');
  if (!trimmed) return '/api';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

const API_BASE_URL = normalizeApiBaseUrl(RAW_API_BASE_URL);

/** Full API root URL for redirects (OAuth). Relative paths use current origin. */
export function getApiRootUrl() {
  if (typeof window === 'undefined') return API_BASE_URL;
  if (API_BASE_URL.startsWith('http')) return API_BASE_URL.replace(/\/$/, '');
  const base = API_BASE_URL.startsWith('/') ? API_BASE_URL : `/${API_BASE_URL}`;
  return `${window.location.origin}${base}`;
}

export function getSocketUrl() {
  const configured = import.meta.env.VITE_SOCKET_URL;
  if (configured) return configured.replace(/\/$/, '');
  const root = getApiRootUrl();
  return root.endsWith('/api') ? root.slice(0, -4) : root;
}

/** Clean up any legacy localStorage tokens left from before the cookie migration. */
export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * No-ops kept so imports in AuthContext don't break during the migration.
 * Tokens are now stored in httpOnly cookies set by the server.
 */
export const getToken = () => null;
export const setToken = () => {};
export const getRefreshToken = () => null;
export const setRefreshToken = () => {};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server error: ${text || response.statusText || 'Unknown error'}`);
    }

    if (!response.ok) {
      const detailMessage = Array.isArray(data.error?.details)
        ? data.error.details
            .map((detail) => detail?.message)
            .filter(Boolean)
            .join(', ')
        : null;
      const msg = typeof data.error === 'string'
        ? data.error
        : (detailMessage || data.error?.message || (data.error && typeof data.error === 'object' ? JSON.stringify(data.error) : null));
      throw new Error(msg || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const hint = API_BASE_URL.startsWith('/')
        ? 'Check that the app is served from the same host that proxies /api to the backend.'
        : 'Please make sure the backend server is running (e.g. on port 3001 when using pnpm dev).';
      throw new Error(`Unable to connect to server. ${hint}`);
    }
    throw error;
  }
};

// Backend returns { success, data: { user? } }; normalize for AuthContext
export const authAPI = {
  signup: async (userData) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const user = data.data?.user ?? data.user;
    return { user };
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const user = data.data?.user ?? data.user;
    return { user };
  },

  logout: async () => {
    removeToken();
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore — cookie cleared client-side too
    }
  },

  getCurrentUser: async () => {
    const data = await apiRequest('/auth/me', { method: 'GET' });
    const user = data.data?.user ?? data.user;
    return { user };
  },

  updateProfile: async (profileData) => {
    const data = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    const user = data.data?.user ?? data.user;
    return { user };
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  refresh: async () => {
    // Browser sends refresh_token httpOnly cookie automatically via credentials: 'include'
    return apiRequest('/auth/refresh', { method: 'POST', body: JSON.stringify({}) });
  },

  sendOtp: async (email) => {
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email, otp) => {
    const data = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    const user = data.data?.user ?? data.user;
    return { user };
  },

  sendMagicLink: async (email) => {
    return apiRequest('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // No-op: cookies are now set by the server redirect, not the frontend
  storeSession: () => {},
};

// Blog API
export const blogAPI = {
  getPosts: async (publishedOnly = true) => {
    const data = await apiRequest(`/posts?published=${publishedOnly}`);
    return { posts: data.data?.posts ?? data.posts ?? [] };
  },

  getPostBySlug: async (slug) => {
    const data = await apiRequest(`/posts/${encodeURIComponent(slug)}`);
    return { post: data.data?.post ?? data.post };
  },

  createPost: async (body) => {
    const data = await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { post: data.data?.post ?? data.post };
  },

  updatePost: async (id, body) => {
    const data = await apiRequest(`/posts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { post: data.data?.post ?? data.post };
  },

  deletePost: async (id) => {
    return apiRequest(`/posts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};

export const contactAPI = {
  submit: async (payload) => {
    const data = await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      contact: data.data?.contact ?? data.contact,
      whatsappUrl: data.data?.whatsappUrl ?? data.whatsappUrl,
    };
  },
};

export const leadsAPI = {
  submit: async (payload) => {
    const data = await apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { lead: data.data?.lead ?? data.lead };
  },
};

export const visitorsAPI = {
  track: async ({ page, referrer, sessionId }) => {
    return apiRequest('/visitors/track', {
      method: 'POST',
      headers: sessionId ? { 'X-Session-Id': sessionId } : undefined,
      body: JSON.stringify({ page, referrer, sessionId }),
    });
  },

  getStats: async () => {
    return apiRequest('/visitors/stats', { method: 'GET' });
  },

  getVisitors: async ({ page = 1, limit = 50 } = {}) => {
    return apiRequest(`/visitors?page=${page}&limit=${limit}`, { method: 'GET' });
  },
};

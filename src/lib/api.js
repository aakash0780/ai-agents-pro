const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/** Full API root URL for redirects (OAuth). Relative paths use current origin. */
export function getApiRootUrl() {
  if (typeof window === 'undefined') return API_BASE_URL;
  if (API_BASE_URL.startsWith('http')) return API_BASE_URL.replace(/\/$/, '');
  const base = API_BASE_URL.startsWith('/') ? API_BASE_URL : `/${API_BASE_URL}`;
  return `${window.location.origin}${base}`;
}

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server error: ${text || response.statusText || 'Unknown error'}`);
    }

    if (!response.ok) {
      const msg = typeof data.error === 'string'
        ? data.error
        : (data.error?.message || (data.error && typeof data.error === 'object' ? JSON.stringify(data.error) : null));
      throw new Error(msg || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors or CORS issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const hint = API_BASE_URL.startsWith('/')
        ? 'Check that the app is served from the same host that proxies /api to the backend.'
        : 'Please make sure the backend server is running (e.g. on port 3001 when using pnpm dev).';
      throw new Error(`Unable to connect to server. ${hint}`);
    }
    throw error;
  }
};

// Backend returns { success, data: { user?, token? } }; normalize for AuthContext
export const authAPI = {
  signup: async (userData) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const token = data.data?.token ?? data.token;
    const user = data.data?.user ?? data.user;
    if (token) setToken(token);
    return { user, token };
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = data.data?.token ?? data.token;
    const user = data.data?.user ?? data.user;
    if (token) setToken(token);
    return { user, token };
  },

  logout: () => {
    removeToken();
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
};

// Blog API (uses same apiRequest + auth for create)
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

export { getToken, setToken, removeToken };


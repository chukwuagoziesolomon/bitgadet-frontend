// Function to get CSRF token from cookies
export const getCsrfToken = (): string | null => {
  // Try common CSRF token names
  const possibleNames = ['csrftoken', 'bitgadgets_csrf', 'csrf_token'];
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      for (const name of possibleNames) {
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
      if (cookieValue) break;
    }
  }
  return cookieValue;
};

// API Configuration
export const API_CONFIG = {
  // Use environment variable for production, proxy for development
  BASE_URL: process.env.REACT_APP_API_URL || '',
  ENDPOINTS: {
    CATEGORIES_TREND: '/api/categories/trend-indicators/',
    PRODUCTS: '/api/products/',
    PRODUCTS_NEW_ARRIVALS: '/api/products/?is_new_arrival=true&limit=5',
    PRODUCTS_NEW_ARRIVALS_ALL: '/api/products/?is_new_arrival=true',
    PRODUCTS_FEATURED: '/api/products/?featured=true',
    PRODUCTS_BEST_SELLERS: '/api/products/best-sellers/?limit=5',
    PRODUCTS_BEST_SELLERS_ALL: '/api/products/best-sellers/',
    PRODUCTS_DETAIL: '/api/products/{slug}/',
    PRODUCTS_REVIEWS: '/api/products/{slug}/reviews/',
    PRODUCTS_RECOMMENDATIONS: '/api/products/recommendations/',
    PRODUCTS_FEATURED_COLLECTION: '/api/products/featured/',
    PRODUCTS_BEST_SELLERS_COLLECTION: '/api/products/best-sellers/',
    PRODUCTS_NEW_ARRIVALS_COLLECTION: '/api/products/new-arrivals/',
    PRODUCTS_CURRENT_DEAL: '/api/products/current-deal/',
    PRODUCTS_COUPONS: '/api/products/?is_coupon=true',
    CATEGORIES: '/api/categories/',
    BANNERS_ACTIVE: '/api/banners/active/',
    BANNERS_CTA: '/api/banners/cta/',
    PHONE_SWAP_SUBMIT: '/api/phone-swap/submit/',
    BRANDS: '/api/brands/',
    AUTH_LOGIN: '/api/auth/login/',
    AUTH_SIGNUP: '/api/auth/signup/',
    AUTH_LOGOUT: '/api/auth/logout/',
    AUTH_ME: '/api/auth/me/',
    USER_ORDER_STATS: '/api/user/order-stats/',
    USER_RECENT_ORDERS: '/api/user/recent-orders/',
    USER_ORDER_HISTORY: '/api/user/order-history/',
    USER_RECENT_WISHLIST: '/api/user/recent-wishlist/',
    WISHLIST_ALL: '/api/wishlist/all/',
    AUTH_PROFILE_SETTINGS: '/api/auth/profile-settings/',
    AUTH_PASSWORD_REQUIREMENTS: '/api/auth/profile-settings/?info=password-requirements',
    // New User Profile Management Endpoints
    USER_PROFILE: '/api/user/profile/',
    USER_PROFILE_SETTINGS: '/api/user/profile/settings/',
    USER_PROFILE_UPDATE: '/api/user/profile/update/',
    USER_CHANGE_PASSWORD: '/api/user/change-password/',
    USER_DELETE_ACCOUNT: '/api/user/delete-account/',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to normalize base URL (convert HTTPS to HTTP for localhost)
const normalizeBaseUrl = (url: string): string => {
  if (!url) return url;
  // Convert https://127.0.0.1 or https://localhost to http://
  if (url.startsWith('https://127.0.0.1') || url.startsWith('https://localhost')) {
    return url.replace('https://', 'http://');
  }
  return url;
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Normalize base URL to use HTTP for localhost
  let baseUrl = normalizeBaseUrl(API_CONFIG.BASE_URL);
  // Remove trailing slash from base URL and leading slash from endpoint to avoid double slashes
  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// API fetch wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Use direct backend URL instead of proxy for proper cookie handling
  let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, '');
  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  console.log('🌐 Making authenticated API request to:', url);

  const token = localStorage.getItem('authToken');

  // Validate token exists and has reasonable length
  // Token should be the raw token value without 'Token ' prefix
  const isTokenValid = token && token.length > 10;

  const isPostOrPut = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH';
  const csrfToken = isPostOrPut ? getCsrfToken() : null;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Important for Django sessions - send cookies
    headers: {
      'Content-Type': 'application/json',
      // Add 'Token ' prefix here when sending the header
      ...(isTokenValid && { 'Authorization': `Token ${token}` }),
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    console.log('📡 Response status:', response.status, response.statusText);
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = null
    }

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`) as any;
      error.response = {
        status: response.status,
        data: responseData
      };

      // Clear invalid token on 401
      if (response.status === 401) {
        console.warn('🔒 Received 401, clearing invalid auth token');
        localStorage.removeItem('authToken');
        // Optionally dispatch an event that your app can listen to
        window.dispatchEvent(new CustomEvent('auth:token-invalid'));
      }

      throw error;
    }

    console.log('📦 Response data:', responseData);
    return responseData;
  } catch (error) {
    console.error(`❌ API request failed for ${url}:`, error);
    throw error;
  }
};

// Public API fetch wrapper without authentication headers
export const publicApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Use direct backend URL instead of proxy for proper cookie handling
  let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, '');
  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  console.log('🌐 Making public API request to:', url);

  const isPostOrPut = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH';
  const csrfToken = isPostOrPut ? getCsrfToken() : null;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Important for Django sessions - send cookies
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    console.log('📡 Response status:', response.status, response.statusText);

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = null
    }

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`) as any;
      error.response = {
        status: response.status,
        data: responseData
      };
      throw error;
    }

    console.log('📦 Response data:', responseData);
    return responseData;
  } catch (error) {
    console.error(`❌ Public API request failed for ${url}:`, error);
    throw error;
  }
};

// Conditional API request that uses authentication when token is available
export const conditionalApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('authToken');

  // If no token, always use public
  if (!token) {
    return publicApiRequest<T>(endpoint, options);
  }

  // With token: try authenticated first, and if the server rejects with 401
  // (common when an endpoint is public-only or ignores token auth),
  // automatically retry once without Authorization headers.
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error: any) {
    const status = error?.response?.status;
    const method = (options.method || 'GET').toString().toUpperCase();
    const isSafeMethod = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

    if (status === 401 && isSafeMethod) {
      console.warn('🔁 Auth request returned 401 on a public/safe endpoint. Retrying without auth...');
      return await publicApiRequest<T>(endpoint, options);
    }
    throw error;
  }
};
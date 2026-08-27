// Import cartService for cart_token management
import { cartService } from '../services/cartService';
import { extractErrorMessage } from '../utils/errorHandler';

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
    CATEGORIES_TREND: '/api/v1/categories/trend-indicators/',
    PRODUCTS: '/api/v1/products/',
    PRODUCTS_NEW_ARRIVALS: '/api/v1/products/?is_new_arrival=true&limit=5',
    PRODUCTS_NEW_ARRIVALS_ALL: '/api/v1/products/?is_new_arrival=true',
    PRODUCTS_FEATURED: '/api/v1/products/?featured=true',
    PRODUCTS_BEST_SELLERS: '/api/v1/products/best-sellers/?limit=5',
    PRODUCTS_BEST_SELLERS_ALL: '/api/v1/products/best-sellers/',
    PRODUCTS_DETAIL: '/api/v1/products/{slug}/',
    PRODUCTS_REVIEWS: '/api/v1/products/{slug}/reviews/',
    PRODUCTS_RECOMMENDATIONS: '/api/v1/products/recommendations/',
    PRODUCTS_FEATURED_COLLECTION: '/api/v1/products/featured/',
    PRODUCTS_BEST_SELLERS_COLLECTION: '/api/v1/products/best-sellers/',
    PRODUCTS_NEW_ARRIVALS_COLLECTION: '/api/v1/products/new-arrivals/',
    PRODUCTS_CURRENT_DEAL: '/api/v1/deals/current/',
    PRODUCTS_COUPONS: '/api/v1/products/?is_coupon=true',
    CATEGORIES: '/api/v1/shop/categories/',
    BANNERS_ACTIVE: '/api/v1/banners/active/',
    BANNERS_CTA: '/api/v1/banners/cta/',
    PHONE_SWAP_SUBMIT: '/api/v1/phone-swap/submit/',
    BRANDS: '/api/v1/brands/',
    AUTH_LOGIN: '/api/v1/auth/login/',
    AUTH_SIGNUP: '/api/v1/auth/signup/',
    AUTH_LOGOUT: '/api/v1/auth/logout/',
    AUTH_ME: '/api/v1/auth/me/',
    AUTH_FORGOT_PASSWORD: '/api/v1/auth/forgot-password/',
    // Order Statistics Endpoints
    USER_ORDER_STATS: '/api/v1/user/order-stats/',
    ORDER_SUMMARY_STATS: '/api/v1/orders/summary/',
    USER_RECENT_ORDERS: '/api/v1/user/recent-orders/',
    USER_ORDER_HISTORY: '/api/v1/user/order-history/',
    USER_RECENT_WISHLIST: '/api/v1/user/recent-wishlist/',
    WISHLIST_ALL: '/api/v1/wishlist/all/',
    AUTH_PROFILE_SETTINGS: '/api/v1/auth/profile-settings/',
    AUTH_PASSWORD_REQUIREMENTS: '/api/v1/auth/profile-settings/?info=password-requirements',
    AUTH_CHANGE_PASSWORD: '/api/v1/auth/password/change/',
    // New User Profile Management Endpoints
    USER_PROFILE: '/api/v1/user/profile/',
    USER_PROFILE_SETTINGS: '/api/v1/user/profile/settings/',
    USER_PROFILE_UPDATE: '/api/v1/user/profile/update/',
    USER_CHANGE_PASSWORD: '/api/v1/auth/password/change/',
    USER_DELETE_ACCOUNT: '/api/v1/user/delete-account/',
    // Checkout and Payment Endpoints
    CHECKOUT_CREATE: '/api/v1/checkout/create/',
    CHECKOUT_ORDER_STATUS: '/api/v1/checkout/{order_id}/status/',
    CHECKOUT_VALIDATE_EMAIL: '/api/v1/checkout/validate-email/',
    COUPONS_VALIDATE: '/api/v1/coupons/validate/',
    COUPONS_APPLY: '/api/v1/coupons/apply/',
    COUPONS_REMOVE: '/api/v1/coupons/remove/',
    // Cart Endpoints (JWT Token Based)
    CART_ADD: '/api/v1/cart/add/',
    CART_GET: '/api/v1/cart/',
    CART_UPDATE: '/api/v1/cart/update/',
    CART_REMOVE: '/api/v1/cart/remove/',
    CART_CLEAR: '/api/v1/cart/clear/',
    CART_SUMMARY: '/api/v1/cart/summary/',
    // Payment Verification Endpoints
    PAYMENT_PAYSTACK_VERIFY: '/api/v1/payments/paystack/{reference}/verify/',
    PAYMENT_DVA_VERIFY: '/api/v1/payments/dva/{order_id}/verify/',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to normalize base URL (convert HTTPS to HTTP for localhost)
const normalizeBaseUrl = (url: string): string => {
  if (!url) return url;
  // Convert https://127.0.0.1 or https://localhost to http://
  if (url.startsWith('https://127.0.0.1') || url.startsWith('https://localhost')) {
    url = url.replace('https://', 'http://');
  }
  // If env accidentally includes API path, strip it to prevent /api/v1/api/v1 duplication.
  url = url.replace(/\/api\/v1\/?$/i, '');
  url = url.replace(/\/api\/?$/i, '');
  return url;
};

// Helper to unwrap standard/nested API envelopes
const getResponsePayload = (responseData: any): any => {
  if (!responseData) return responseData;
  if (responseData?.data?.data !== undefined) return responseData.data.data;
  if (responseData?.data !== undefined) return responseData.data;
  return responseData;
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

// Helper function to check if endpoint is a cart endpoint
const isCartEndpoint = (endpoint: string): boolean => {
  return endpoint.includes('/api/v1/cart/') || endpoint.includes('/api/v1/user/order-stats/') || endpoint.includes('/api/v1/checkout/create/');
};

// Helper function to check if endpoint is a wishlist endpoint
const isWishlistEndpoint = (endpoint: string): boolean => {
  return endpoint.includes('/api/v1/wishlist/');
};

// Helper function to check if endpoint needs credentials removed
const needsNoCredentials = (endpoint: string): boolean => {
  // These endpoints use JWT cart_token instead of Django sessions
  return endpoint.includes('/api/v1/cart/') || 
         endpoint.includes('/api/v1/wishlist/') || 
         endpoint.includes('/api/v1/orders/summary/') ||
         endpoint.includes('/api/v1/user/order-stats/') ||
         endpoint.includes('/api/v1/checkout/create/');
};

// Helper function to handle cart_token in request body
const addCartTokenToBody = (body: string | undefined, cartToken: string | null): string => {
  if (!body) {
    return cartToken ? JSON.stringify({ cart_token: cartToken }) : '{}';
  }
  
  try {
    const parsed = JSON.parse(body);
    if (cartToken) {
      parsed.cart_token = cartToken;
    }
    return JSON.stringify(parsed);
  } catch (e) {
    // If body is not valid JSON, return as is
    return body;
  }
};

// Helper function to add cart_token to URL as query parameter
const addCartTokenToUrl = (url: string, cartToken: string | null): string => {
  if (!cartToken) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cart_token=${encodeURIComponent(cartToken)}`;
};

// Helper function to save cart_token from response
const saveCartTokenFromResponse = (responseData: any): void => {
  const payload = getResponsePayload(responseData);
  const cartToken = payload?.cart_token;

  if (cartToken) {
    cartService.setCartToken(cartToken);
    console.log('🛒 Saved cart_token from response:', cartToken);
  }
};

// API fetch wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Use direct backend URL instead of proxy for proper cookie handling
  let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Normalize base URL to avoid duplicated API path segments
  baseUrl = normalizeBaseUrl(baseUrl);
  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, '');
  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  // Handle cart_token for cart and wishlist endpoints
  const isCart = isCartEndpoint(endpoint);
  const isWishlist = isWishlistEndpoint(endpoint);
  const cartToken = (isCart || isWishlist) ? cartService.getCartToken() : null;
  const method = (options.method || 'GET').toUpperCase();
  const isGetRequest = method === 'GET';

  // For GET requests to cart or wishlist endpoints, add cart_token as query parameter
  if ((isCart || isWishlist) && isGetRequest && cartToken) {
    url = addCartTokenToUrl(url, cartToken);
  }

  console.log('🌐 Making authenticated API request to:', url);

  const token = localStorage.getItem('authToken');

  // Validate token exists and has reasonable length
  // Token should be the raw token value without 'Token ' prefix
  const isTokenValid = token && token.length > 10;

  const isPostOrPut = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH';
  const csrfToken = isPostOrPut ? getCsrfToken() : null;

  // Handle cart_token in request body for POST/PUT/PATCH to cart or wishlist endpoints
  let body = options.body as string | undefined;
  if ((isCart || isWishlist) && isPostOrPut) {
    body = addCartTokenToBody(body, cartToken);
  }

  // Don't use credentials for cart, wishlist, and order summary endpoints
  const useCredentials = !needsNoCredentials(endpoint);

  const defaultOptions: RequestInit = {
    ...(useCredentials && { credentials: 'include' }),
    headers: {
      'Content-Type': 'application/json',
      // Add 'Token ' prefix here when sending the header
      ...(isTokenValid && { 'Authorization': `Token ${token}` }),
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
    ...(body !== undefined && { body }),
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
      // Use enhanced error extraction function
      const errorMessage = responseData ? extractErrorMessage(responseData) : `HTTP error! status: ${response.status}`;
      
      const error = new Error(errorMessage) as any;
      error.response = {
        status: response.status,
        data: responseData
      };
      console.error('❌ API Error Response:', {
        status: response.status,
        data: responseData,
        url: url
      });

      // Clear invalid token on 401
      if (response.status === 401) {
        console.warn('🔒 Received 401, clearing invalid auth token');
        localStorage.removeItem('authToken');
        // Optionally dispatch an event that your app can listen to
        window.dispatchEvent(new CustomEvent('auth:token-invalid'));
      }

      throw error;
    }

    // Save cart_token from response if present (for cart or wishlist endpoints)
    if (isCart || isWishlist) {
      saveCartTokenFromResponse(responseData);
    }

    console.log('📦 Response data:', responseData);
    // Unwrap common API envelope { success, status, message, data }
    const payload = getResponsePayload(responseData);
    return payload;
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
  // Normalize base URL to avoid duplicated API path segments
  baseUrl = normalizeBaseUrl(baseUrl);
  // Remove trailing slash from base URL
  baseUrl = baseUrl.replace(/\/$/, '');
  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  // Handle cart_token for cart and wishlist endpoints
  const isCart = isCartEndpoint(endpoint);
  const isWishlist = isWishlistEndpoint(endpoint);
  const cartToken = (isCart || isWishlist) ? cartService.getCartToken() : null;
  const method = (options.method || 'GET').toUpperCase();
  const isGetRequest = method === 'GET';

  // For GET requests to cart or wishlist endpoints, add cart_token as query parameter
  if ((isCart || isWishlist) && isGetRequest && cartToken) {
    url = addCartTokenToUrl(url, cartToken);
  }

  console.log('🌐 Making public API request to:', url);

  const isPostOrPut = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH';
  const csrfToken = isPostOrPut ? getCsrfToken() : null;

  // Handle cart_token in request body for POST/PUT/PATCH to cart or wishlist endpoints
  let body = options.body as string | undefined;
  if ((isCart || isWishlist) && isPostOrPut) {
    body = addCartTokenToBody(body, cartToken);
  }

  // Don't use credentials for cart, wishlist, and order summary endpoints
  const useCredentials = !needsNoCredentials(endpoint);

  const defaultOptions: RequestInit = {
    ...(useCredentials && { credentials: 'include' }),
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
    ...(body !== undefined && { body }),
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
      // Use enhanced error extraction function
      const errorMessage = responseData ? extractErrorMessage(responseData) : `HTTP error! status: ${response.status}`;
      
      const error = new Error(errorMessage) as any;
      error.response = {
        status: response.status,
        data: responseData
      };
      console.error('❌ API Error Response:', {
        status: response.status,
        data: responseData,
        url: url
      });
      throw error;
    }

    // Save cart_token from response if present (for cart or wishlist endpoints)
    if (isCart || isWishlist) {
      saveCartTokenFromResponse(responseData);
    }

    console.log('📦 Response data:', responseData);
    const payload = getResponsePayload(responseData);
    return payload;
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

// Checkout API request with cart_token in query parameter to avoid CORS preflight
export const checkoutApiRequest = async <T>(
  endpoint: string,
  cartToken: string,
  options: RequestInit = {}
): Promise<T> => {
  // Use direct backend URL instead of proxy
  let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  // Normalize base URL to avoid duplicated API path segments
  baseUrl = normalizeBaseUrl(baseUrl);
  baseUrl = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  // Add cart_token as query parameter to avoid CORS preflight
  const separator = url.includes('?') ? '&' : '?';
  url = `${url}${separator}cart_token=${encodeURIComponent(cartToken)}`;

  const isPostOrPut = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH';
  const csrfToken = isPostOrPut ? getCsrfToken() : null;

  console.log('🛒 Making checkout request with cart_token in query parameter');

  const defaultOptions: RequestInit = {
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRFToken': csrfToken }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    console.log('📡 Checkout response status:', response.status, response.statusText);
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = null;
    }

    if (!response.ok) {
      const errorMessage = responseData ? extractErrorMessage(responseData) : `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage) as any;
      error.response = {
        status: response.status,
        data: responseData
      };
      console.error('❌ Checkout API Error Response:', {
        status: response.status,
        data: responseData,
        url: url
      });
      throw error;
    }

    console.log('📦 Checkout response data:', responseData);
    const payload = getResponsePayload(responseData);
    return payload;
  } catch (error) {
    console.error(`❌ Checkout request failed for ${url}:`, error);
    throw error;
  }
};
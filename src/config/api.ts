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
  },
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove trailing slash from base URL and leading slash from endpoint to avoid double slashes
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/') ? API_CONFIG.BASE_URL.slice(0, -1) : API_CONFIG.BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// API fetch wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);

  console.log('🌐 Making API request to:', url);

  const token = localStorage.getItem('authToken');
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Token ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Response data:', data);
    return data;
  } catch (error) {
    console.error(`❌ API request failed for ${url}:`, error);
    throw error;
  }
};

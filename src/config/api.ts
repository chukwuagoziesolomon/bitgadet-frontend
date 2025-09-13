// API Configuration
export const API_CONFIG = {
  // Use relative URLs in development (proxy handles the backend URL)
  // In production, you might want to use the full backend URL
  BASE_URL: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8000' : '',
  ENDPOINTS: {
    CATEGORIES_TREND: '/api/categories/trend-indicators/',
    PRODUCTS: '/api/products/',
    PRODUCTS_NEW_ARRIVALS: '/api/products/?is_new_arrival=true&limit=5',
    PRODUCTS_NEW_ARRIVALS_ALL: '/api/products/?is_new_arrival=true',
    PRODUCTS_FEATURED: '/api/products/?featured=true',
    PRODUCTS_BEST_SELLERS: '/api/products/best-sellers/?limit=5',
    PRODUCTS_BEST_SELLERS_ALL: '/api/products/best-sellers/',
    CATEGORIES: '/api/categories/',
    BANNERS_ACTIVE: '/api/banners/active/',
  },
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API fetch wrapper with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint);

  console.log('🌐 Making API request to:', url);

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
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

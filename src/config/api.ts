// API Configuration
export const API_CONFIG = {
  // Use relative URLs in development (proxy handles the backend URL)
  // In production, you might want to use the full backend URL
  BASE_URL: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8000' : '',
  ENDPOINTS: {
    CATEGORIES_TREND: '/api/categories/trend-indicators/',
    PRODUCTS: '/api/products/',
    CATEGORIES: '/api/categories/',
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
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

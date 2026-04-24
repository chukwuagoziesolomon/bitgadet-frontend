import { Product } from '../hooks/useFeaturedProducts';

// Helper function to normalize base URL (convert HTTPS to HTTP for localhost)
const normalizeBaseUrl = (url: string): string => {
  if (!url) return url;
  // Convert https://127.0.0.1 or https://localhost to http://
  if (url.startsWith('https://127.0.0.1') || url.startsWith('https://localhost')) {
    return url.replace('https://', 'http://');
  }
  return url;
};

const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_URL || '');

export const productService = {
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/products/featured/` : '/api/v1/products/featured/';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
};

export default productService;

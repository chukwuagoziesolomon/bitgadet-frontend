import { Product } from '../hooks/useFeaturedProducts';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const productService = {
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/featured/`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
};

export default productService;

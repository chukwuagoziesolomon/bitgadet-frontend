import { useState, useEffect } from 'react';
import { publicApiRequest, API_CONFIG } from '../config/api';
import { Product } from './useFeaturedProducts';

export const useBestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const data = await publicApiRequest<{ products: Product[] }>(API_CONFIG.ENDPOINTS.PRODUCTS_BEST_SELLERS_COLLECTION);
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch best sellers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { products, loading, error };
};
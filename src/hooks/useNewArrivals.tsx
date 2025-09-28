import { useState, useEffect } from 'react';
import { apiRequest, API_CONFIG } from '../config/api';
import { Product } from './useFeaturedProducts';

export const useNewArrivals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<{ products: Product[] }>(API_CONFIG.ENDPOINTS.PRODUCTS_NEW_ARRIVALS_COLLECTION);
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch new arrivals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return { products, loading, error };
};
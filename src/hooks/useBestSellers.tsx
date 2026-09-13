import { useState, useEffect } from 'react';
import { conditionalApiRequest, API_CONFIG } from '../config/api';
import { Product } from './useFeaturedProducts';

export const useBestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const data = await conditionalApiRequest<any>(API_CONFIG.ENDPOINTS.PRODUCTS_BEST_SELLERS);
        const products = data?.data?.results || data?.results || data?.products || [];
        setProducts(products.slice(0, 5).map((product: any) => ({
          ...product,
          product_condition: product.product_condition || product.productCondition,
          productCondition: product.productCondition,
        })));
        setError(null);
      } catch (err) {
        setError('Failed to fetch best sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { products, loading, error };
};
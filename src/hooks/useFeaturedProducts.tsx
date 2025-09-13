import { useState, useEffect } from 'react';
import { productService } from '../services/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  // Add other product properties as needed
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getFeaturedProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch featured products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return { products, loading, error };
};

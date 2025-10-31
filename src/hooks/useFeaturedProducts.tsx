import { useState, useEffect } from 'react';
import { conditionalApiRequest, API_CONFIG } from '../config/api';

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  short_description: string;
  current_price: string;
  current_price_usdt: string;
  original_price: string;
  original_price_usdt: string;
  brand: string;
  model: string;
  main_image: string;
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  savings_usd: string;
  savings_usdt: string;
  is_in_stock: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  stock_quantity: number;
  total_sales: number;
  views_count: number;
  created_at: string;
  is_available: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  product_condition?: string;
  condition_display?: string;
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const data = await conditionalApiRequest<{ products: Product[] }>(API_CONFIG.ENDPOINTS.PRODUCTS_FEATURED_COLLECTION);
        setProducts(data.products || []);
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

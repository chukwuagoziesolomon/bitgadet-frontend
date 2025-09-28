import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';
import { Product } from './useFeaturedProducts';

interface AllProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface UseAllProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  ordering?: string;
}

export const useAllProducts = (options: UseAllProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.search) params.append('search', options.search);
        if (options.category) params.append('category', options.category);
        if (options.brand) params.append('brand', options.brand);
        if (options.min_price !== undefined) params.append('min_price', options.min_price.toString());
        if (options.max_price !== undefined) params.append('max_price', options.max_price.toString());
        if (options.is_featured !== undefined) params.append('is_featured', options.is_featured.toString());
        if (options.ordering) params.append('ordering', options.ordering);

        const endpoint = `/api/products/?${params.toString()}`;
        const data: AllProductsResponse = await apiRequest(endpoint);

        setProducts(data.results || []);
        setTotalCount(data.count || 0);
        setNextPage(data.next);
        setPreviousPage(data.previous);

      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
        setProducts([]);
        setTotalCount(0);
        setNextPage(null);
        setPreviousPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    options.page,
    options.limit,
    options.search,
    options.category,
    options.brand,
    options.min_price,
    options.max_price,
    options.is_featured,
    options.ordering
  ]);

  return {
    products,
    loading,
    error,
    totalCount,
    nextPage,
    previousPage,
    hasNextPage: !!nextPage,
    hasPreviousPage: !!previousPage
  };
};
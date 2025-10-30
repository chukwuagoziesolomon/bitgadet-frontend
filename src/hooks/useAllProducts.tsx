import { useState, useEffect } from 'react';
import { conditionalApiRequest } from '../config/api';
import { Product } from './useFeaturedProducts';

interface AllProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface UseAllProductsOptions {
  page?: number;
  search?: string;
  categories?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  min_rating?: number;
  sort_by?: string;
  product_filter?: 'all' | 'toaster';
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
        if (options.search) params.append('search', options.search);
        if (options.categories) params.append('categories', options.categories);
        if (options.min_price !== undefined) params.append('min_price', options.min_price.toString());
        if (options.max_price !== undefined) params.append('max_price', options.max_price.toString());
        if (options.in_stock !== undefined) params.append('in_stock', options.in_stock.toString());
        if (options.min_rating !== undefined) params.append('min_rating', options.min_rating.toString());
        if (options.sort_by) params.append('sort_by', options.sort_by);
        if (options.product_filter) params.append('product_filter', options.product_filter);

        const endpoint = `/api/products/filter/?${params.toString()}`;
        const data: AllProductsResponse = await conditionalApiRequest(endpoint);

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
    options.search,
    options.categories,
    options.min_price,
    options.max_price,
    options.in_stock,
    options.min_rating,
    options.sort_by,
    options.product_filter
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
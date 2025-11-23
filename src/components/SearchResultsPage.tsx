import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { conditionalApiRequest, apiRequest, publicApiRequest } from '../config/api';
import ProductCard from './ProductCard';
import { useToast } from '../hooks/useToast';
import { cartService } from '../services/cartService';
import './SearchResultsPage.css';

interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  current_price: string;
  original_price: string | null;
  current_price_usdt?: string;
  original_price_usdt?: string;
  brand: string;
  main_image: string;
  is_on_sale: boolean;
  is_in_stock: boolean;
  stock_quantity: number;
  url: string;
  is_coupon?: boolean;
  coupon_value?: number;
}

interface Brand {
  id: number;
  display_name: string;
  name: string;
  logo: string;
  url: string;
}

interface Category {
  id: number;
  display_name: string;
  name: string;
  url: string;
}

interface SearchResults {
  query: string;
  total_results: number;
  products: {
    count: number;
    results: Product[];
  };
  categories?: {
    count: number;
    results: Category[];
  };
  brands?: {
    count: number;
    results: Brand[];
  };
  has_results: boolean;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  useEffect(() => {
    const fetchWishlistAndCart = async () => {
      try {
        // Fetch wishlist on mount (uses authentication if available)
        const wishlistRes = await conditionalApiRequest<any>('/api/wishlist/');
        setWishlist(wishlistRes.wishlist || []);
      } catch (error: any) {
        // Only show error if user is actually logged in (has token)
        const token = localStorage.getItem('authToken');
        if (token) {
          showError('Failed to load wishlist', error.message || 'Please try again later.');
        }
      }

      try {
        // Fetch cart on mount (uses authentication if available)
        const cartRes = await conditionalApiRequest<any>('/api/cart/');
        setCart(cartRes.cart || {});
      } catch (error: any) {
        // Only show error if user is actually logged in (has token)
        const token = localStorage.getItem('authToken');
        if (token) {
          showError('Failed to load cart', error.message || 'Please try again later.');
        }
      }
    };

    fetchWishlistAndCart();
  }, [showError]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await conditionalApiRequest<SearchResults>(`/api/search/?q=${encodeURIComponent(searchQuery)}`);
      setResults(response);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    console.log('🛒 Attempting to add product to cart:', productId);

    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const result = await cartService.addToCart(productId, 1);
      console.log('✅ Add to cart API response:', result);
      showSuccess('Added to cart', 'Product added successfully');
    } catch (error: any) {
      console.error('❌ Add to cart failed:', error);
      // Revert optimistic update
      setCart(prev => {
        const newCart = { ...prev };
        if (newCart[productId] > 1) {
          newCart[productId]--;
        } else {
          delete newCart[productId];
        }
        return newCart;
      });
      showError('Failed to add to cart', error.message || 'Please try again.');
    }
  };

  // Toggle wishlist on single click
  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const token = localStorage.getItem('authToken');
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';

    // Optimistic update
    setWishlist(prev => willBeInWishlist ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
      const res = await publicApiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      setWishlist(res.wishlist || []);
    } catch (error: any) {
      console.error('❌ Wishlist update failed:', error);
      // Revert optimistic update
      setWishlist(prev => willBeInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
      // Only show error if user is actually logged in (has token)
      if (token) {
        showError('Failed to update wishlist', error.message || 'Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching for "{query}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-error">
            <h2>Search Error</h2>
            <p>{error}</p>
            <Link to="/home" className="back-home-btn">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.total_results === 0) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-header">
            <h1>Search Results for "{query}"</h1>
          </div>
          <div className="no-results">
            <h2>No results found</h2>
            <p>We couldn't find any products, categories, or brands matching "{query}".</p>
            <p>Try adjusting your search terms or browse our categories:</p>
            <div className="suggestions">
              <Link to="/all-products" className="suggestion-link">All Products</Link>
              <Link to="/smartphones" className="suggestion-link">Smartphones</Link>
              <Link to="/laptops" className="suggestion-link">Laptops</Link>
              <Link to="/gaming" className="suggestion-link">Gaming</Link>
              <Link to="/accessories" className="suggestion-link">Accessories</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        <div className="search-header">
          <h1>Search Results for "{query}"</h1>
          <div className="results-summary">
            Found {results?.total_results || 0} results ({results?.products?.count || 0} products, {results?.categories?.count || 0} categories, {results?.brands?.count || 0} brands)
          </div>
        </div>

        {/* Products Section */}
        {results && results.products && results.products.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Products ({results.products.count})</h2>
              <Link to={`/products?q=${encodeURIComponent(query)}`} className="view-all-link">
                View all products
              </Link>
            </div>
            <div className="products-grid">
              {results.products.results.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand?.toString() || 'Unknown'}
                  image={product.main_image}
                  price={parseFloat(product.current_price)}
                  originalPrice={product.original_price ? parseFloat(product.original_price) : null}
                  usdtPrice={product.current_price_usdt || '0 USDT'}
                  originalUsdtPrice={product.original_price_usdt}
                  rating={4.5} // Default rating since API doesn't provide it
                  reviews={10} // Default reviews count
                  inStock={product.is_in_stock}
                  showBadges={true}
                  showWishlist={true}
                  showActions={true}
                  onAddToCart={handleAddToCart}
                  isInCart={cart[product.id] > 0}
                  isInWishlist={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  is_coupon={product.is_coupon}
                  coupon_value={product.coupon_value}
                />
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {results && results.categories && results.categories.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Categories ({results.categories.count})</h2>
            </div>
            <div className="categories-grid">
              {results.categories.results.map((category) => (
                <Link key={category.id} to={category.url} className="category-card">
                  <h3>{category.display_name}</h3>
                  <p>{category.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Brands Section */}
        {results && results.brands && results.brands.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Brands ({results.brands.count})</h2>
            </div>
            <div className="brands-grid">
              {results.brands.results.map((brand) => (
                <Link key={brand.id} to={brand.url} className="brand-card">
                  <div className="brand-logo">
                    <img src={brand.logo} alt={brand.display_name} />
                  </div>
                  <h3>{brand.display_name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
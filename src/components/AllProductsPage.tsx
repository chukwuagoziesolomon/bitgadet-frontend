import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './AllProductsPage.css';
import { apiRequest, publicApiRequest, conditionalApiRequest } from '../config/api';
import { cartService } from '../services/cartService';
import { useAllProducts } from '../hooks/useAllProducts';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
const AllProductsPage: React.FC = () => {
  const { setLoading, setLoadingText } = useGlobalLoading();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [productFilter, setProductFilter] = useState<'all' | 'toaster'>('all');

  // Calculate min_rating from selectedRatings
  const getMinRating = () => {
    if (selectedRatings.length === 0) return undefined;
    const ratings = selectedRatings.map(r => parseInt(r.split('+')[0]));
    return Math.min(...ratings);
  };

  // Map sortBy to API sort_by values
  const getSortByValue = () => {
    switch (sortBy) {
      case 'name': return 'name_asc';
      case '-name': return 'name_desc';
      case 'current_price': return 'price_low';
      case '-current_price': return 'price_high';
      case '-created_at': return 'newest';
      case 'created_at': return 'oldest';
      default: return 'default';
    }
  };

  // Use the new hook with all filtering options
  const {
    products,
    loading,
    error,
    totalCount,
    hasNextPage,
    hasPreviousPage
  } = useAllProducts({
    page: currentPage,
    search: searchQuery || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    min_price: priceRange.min ? parseFloat(priceRange.min) : undefined,
    max_price: priceRange.max ? parseFloat(priceRange.max) : undefined,
    in_stock: inStockOnly || undefined,
    min_rating: getMinRating(),
    sort_by: getSortByValue(),
    product_filter: productFilter
  });

  useEffect(() => {
    // Sync global loading state with products loading
    setLoading(loading);
    if (loading) {
      setLoadingText('Loading products...');
    }
  }, [loading, setLoading, setLoadingText]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const cartToken = cartService.getCartToken();

    // If neither auth token nor cart token, skip wishlist and cart fetches
    if (!token && !cartToken) {
      setWishlist([]);
      setCart({});
      return;
    }

    // Fetch wishlist on mount (silent - no error toasts)
    (async () => {
      try {
        const wishlistUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.WISHLIST_ALL}?cart_token=${cartToken}` : '/api/wishlist/';
        const wishlistRes = token
          ? await conditionalApiRequest<any>(wishlistUrl)
          : await publicApiRequest<any>(wishlistUrl);
        setWishlist(wishlistRes.wishlist || []);
      } catch (error) {
        if (token) console.error('Failed to fetch wishlist:', error);
      }
    })();

    // Fetch cart on mount (silent - no error toasts)
    (async () => {
      try {
        const cartUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.CART_GET}?cart_token=${cartToken}` : '/api/cart/';
        const cartRes = token
          ? await conditionalApiRequest<any>(cartUrl)
          : await publicApiRequest<any>(cartUrl);
        setCart(cartRes.cart || {});
      } catch (error) {
        if (token) console.error('Failed to fetch cart:', error);
      }
    })();
  }, []);


  const categories = [
    'Smartphones',
    'Laptops', 
    'Smartwatches',
    'Accessories',
    'Audio',
    'Gaming'
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSelectedRatings([]);
    setSearchQuery('');
    setCurrentPage(1);
    setProductFilter('all');
  };

  // Since filtering is now done on the backend, just return products directly
  const getFilteredProducts = () => {
    return products;
  };

  // Get filter props for ProductCard
  const getProductCardProps = (product: any) => {
    return {
      key: product.id,
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand_name || product.brand,
      image: product.main_image,
      price: parseFloat(product.current_price),
      originalPrice: parseFloat(product.original_price),
      usdtPrice: product.current_price_usdt,
      originalUsdtPrice: product.original_price_usdt,
      rating: 4.5,
      reviews: 0,
      badges: product.is_featured ? ['featured'] : product.is_best_seller ? ['best-seller'] : product.is_new_arrival ? ['new-arrival'] : [],
      inStock: product.is_in_stock,
      onAddToCart: handleAddToCart,
      isInCart: cart[product.id] > 0,
      isInWishlist: wishlist.includes(product.id),
      onToggleWishlist: handleToggleWishlist,
      product_condition: product.product_condition,
      condition_display: product.condition_display,
      is_coupon: product.is_coupon,
      coupon_value: product.coupon_value,
    };
  };

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');

    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const res = await (token ? apiRequest : publicApiRequest)<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      setCart(res.cart || {});
    } catch (error) {
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
      // Only log error if user is actually logged in (has token)
      if (token) {
        console.error('Failed to add to cart:', error);
      }
      // Silent failure - ProductCard already shows success toast
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
    } catch (error) {
      console.error('❌ Wishlist update failed:', error);
      // Revert optimistic update
      setWishlist(prev => willBeInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
      // Only log error if user is actually logged in (has token)
      if (token) {
        console.error('Failed to toggle wishlist:', error);
      }
      // Silent failure - ProductCard already shows appropriate toast
    }
  };

  return (
    <div className="all-products-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>All Product</h1>
          <p>Discover our complete collection of premium gadgets and accessories</p>
          <div className="hero-features">
            <span>• Categories</span>
            <span>• 216+ Products</span>
            <span>• Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-container">
            <Search className="search-icon" size={24} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Filters (Desktop) */}
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              {categories.map((category) => (
                <label key={category} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <div className="price-slider">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="100000"
                  className="slider"
                />
              </div>
              <div className="price-inputs">
                <input
                  type="text"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>Availability</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Rating</h3>
            <div className="filter-options">
              {['4+ Stars', '3+ Stars', '2+ Stars', '1+ Stars'].map((rating) => (
                <label key={rating} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                  />
                  <span>{rating}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Product Filter</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="productFilter"
                  value="all"
                  checked={productFilter === 'all'}
                  onChange={(e) => setProductFilter(e.target.value as any)}
                />
                <span>All Products</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="productFilter"
                  value="toaster"
                  checked={productFilter === 'toaster'}
                  onChange={(e) => setProductFilter(e.target.value as any)}
                />
                <span>Toaster Products Only</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="sort-options">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default</option>
                <option value="name">Name (A-Z)</option>
                <option value="-name">Name (Z-A)</option>
                <option value="current_price">Price (Low to High)</option>
                <option value="-current_price">Price (High to Low)</option>
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
              </select>
            </div>
          </div>

          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <div className="products-header">
            <div className="products-count">
              {loading ? 'Loading...' : `${getFilteredProducts().length} of ${totalCount} products found`}
            </div>
            <div className="products-controls">
            {/* Mobile/Tablet: Categories toggle button */}
            <button 
              className="mobile-categories-btn"
              onClick={() => setShowMobileFilters(prev => !prev)}
              aria-expanded={showMobileFilters}
              aria-controls="mobile-filters-panel"
            >
              Categories <ChevronDown size={16} />
            </button>

            {/* Desktop: text dropdown placeholder (hidden on mobile) */}
            <div className="categories-dropdown">
              <button className="categories-btn">
                Categories <ChevronDown size={16} />
                </button>
              </div>
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {/* Render mobile filters only on small screens via CSS; safe on desktop because panel is display:none */}
          {showMobileFilters && (
            <div id="mobile-filters-panel" className="mobile-filters-panel">
              <div className="filter-section">
                <h3>Categories</h3>
                <div className="filter-options">
                  {categories.map((category) => (
                    <label key={category} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3>Price Range</h3>
                <div className="price-range">
                  <div className="price-slider">
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="100000"
                      className="slider"
                    />
                  </div>
                  <div className="price-inputs">
                    <input
                      type="text"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h3>Availability</h3>
                <div className="filter-options">
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h3>Rating</h3>
                <div className="filter-options">
                  {['4+ Stars', '3+ Stars', '2+ Stars', '1+ Stars'].map((rating) => (
                    <label key={rating} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingChange(rating)}
                      />
                      <span>{rating}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="reset-filters-btn" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}

          <div className={`products-grid ${viewMode}`}>
            {loading ? (
              <div className="loading-products">
                <div className="loading-spinner">Loading products...</div>
              </div>
            ) : error ? (
              <div className="error-products">
                <div className="error-message">{error}</div>
              </div>
            ) : getFilteredProducts().length === 0 ? (
              <div className="empty-products">
                <div className="empty-state">
                  <div className="empty-icon-container">
                    <Search size={64} className="empty-icon" />
                  </div>
                  <h3 className="empty-title">
                    {productFilter === 'toaster' ? 'No toaster products found' : 'No products found'}
                  </h3>
                  <p className="empty-description">
                    {productFilter === 'toaster'
                      ? 'No toaster products match your criteria. Try adjusting your filters.'
                      : 'We couldn\'t find any products matching your criteria. Try adjusting your search terms or filters.'
                    }
                  </p>
                  <button
                    className="empty-action-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategories([]);
                      setPriceRange({ min: '', max: '' });
                      setInStockOnly(false);
                      setSelectedRatings([]);
                      setSortBy('');
                      setCurrentPage(1);
                      setProductFilter('all');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              getFilteredProducts().map((product) => (
                <ProductCard
                  {...getProductCardProps(product)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && totalCount > 20 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="pagination-info">
                Page {currentPage} of {Math.ceil(totalCount / 20)}
              </span>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
              >
                Next
                <ChevronRight size={16} />
              </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;

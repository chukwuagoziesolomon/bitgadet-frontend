import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './AllProductsPage.css';
import { apiRequest } from '../config/api';
import { useAllProducts } from '../hooks/useAllProducts';
const AllProductsPage: React.FC = () => {
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
  const [productFilter, setProductFilter] = useState<'all' | 'toasters' | 'exclude-specific'>('all');
  // Add specific product IDs to exclude here (e.g., the toaster model from the image)
  const [excludedProductIds, setExcludedProductIds] = useState<number[]>([
    // Example: 123, 456  // Replace with actual product IDs to exclude
  ]);

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
    limit: 20,
    search: searchQuery || undefined,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    min_price: priceRange.min ? parseFloat(priceRange.min) : undefined,
    max_price: priceRange.max ? parseFloat(priceRange.max) : undefined,
    ordering: sortBy || undefined
  });

  useEffect(() => {
    // Fetch wishlist on mount (silent - no error toasts)
    apiRequest<any>('/api/wishlist/').then(res => {
      setWishlist(res.wishlist || []);
    }).catch(error => {
      console.error('Failed to fetch wishlist:', error);
      // Silent failure - don't show error toast to user
    });

    // Fetch cart on mount (silent - no error toasts)
    apiRequest<any>('/api/cart/').then(res => {
      setCart(res.cart || {});
    }).catch(error => {
      console.error('Failed to fetch cart:', error);
      // Silent failure - don't show error toast to user
    });
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
    setExcludedProductIds([]);
  };

  // Filter products based on current filter settings
  const getFilteredProducts = () => {
    let filteredProducts = products;

    // Apply toaster filter
    if (productFilter === 'toasters') {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes('toaster')
      );
    }

    // Apply product exclusions
    if (excludedProductIds.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        !excludedProductIds.includes(product.id)
      );
    }

    return filteredProducts;
  };

  // Get filter props for ProductCard
  const getProductCardProps = (product: any) => {
    const baseProps = {
      key: product.id,
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.main_image,
      price: parseFloat(product.current_price),
      originalPrice: parseFloat(product.original_price),
      usdtPrice: product.current_price_usdt,
      rating: 4.5,
      reviews: 0,
      badges: product.is_featured ? ['featured'] : product.is_best_seller ? ['best-seller'] : product.is_new_arrival ? ['new-arrival'] : [],
      inStock: product.is_in_stock,
      onAddToCart: handleAddToCart,
      isInCart: cart[product.id] > 0,
      isInWishlist: wishlist.includes(product.id),
      onToggleWishlist: handleToggleWishlist,
    };

    // Add filtering props based on current filter state
    if (productFilter === 'toasters') {
      return {
        ...baseProps,
        category: 'toasters',
        excludeProductIds: excludedProductIds,
      };
    }

    return baseProps;
  };

  const handleAddToCart = (productId: number) => {
    apiRequest<any>('/api/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    }).then(res => {
      setCart(res.cart || {});
      // Toast notification handled by ProductCard component
    }).catch(error => {
      console.error('Failed to add to cart:', error);
      // Silent failure - ProductCard already shows success toast
    });
  };

  // Toggle wishlist on single click
  const handleToggleWishlist = (productId: number, willBeInWishlist?: boolean) => {
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';
    apiRequest<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }).then(res => {
      setWishlist(res.wishlist || []);
      // Toast notification handled by ProductCard component
    }).catch(error => {
      console.error('Failed to toggle wishlist:', error);
      // Silent failure - ProductCard already shows appropriate toast
    });
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
                  value="toasters"
                  checked={productFilter === 'toasters'}
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
                    {productFilter === 'toasters' ? 'No toaster products found' : 'No products found'}
                  </h3>
                  <p className="empty-description">
                    {productFilter === 'toasters'
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
                      setExcludedProductIds([]);
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

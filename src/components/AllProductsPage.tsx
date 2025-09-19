import React, { useState } from 'react';
import { Search, ChevronDown, Grid3X3, List } from 'lucide-react';
import ProductCard from './ProductCard';
import './AllProductsPage.css';

const AllProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      image: '/phone1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-12% OFF', 'New', 'Bestseller'],
      inStock: true
    },
    {
      id: 2,
      name: 'Play Station (PS) 5 Console',
      brand: 'SONY',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-14%', 'out of stock'],
      inStock: false
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 13 9360',
      brand: 'DELL',
      image: '/laptop1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 4,
      name: 'Sony Smartwatch 15',
      brand: 'SONY',
      image: '/phonewatch2.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['New', 'Bestseller'],
      inStock: true
    },
    {
      id: 5,
      name: 'Galaxy S25 Ultra',
      brand: 'Samsung',
      image: '/phone1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-12% OFF'],
      inStock: true
    },
    {
      id: 6,
      name: 'MacBook Pro 16"',
      brand: 'Apple',
      image: '/laptop1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-12% OFF', 'New', 'Bestseller'],
      inStock: true
    },
    {
      id: 7,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      image: '/phone1.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 8,
      name: 'AirPods Pro 2',
      brand: 'Apple',
      image: '/headphone.png',
      price: 1850000,
      originalPrice: 2100000,
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 64,
      badges: ['New', 'Bestseller'],
      inStock: true
    }
  ];

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

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSelectedRatings([]);
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
  };

  const handleToggleWishlist = (productId: number) => {
    console.log(`Toggling wishlist for product ${productId}`);
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
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar Filters */}
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

          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <div className="products-header">
            <div className="products-count">
              {products.length} products found
            </div>
            <div className="products-controls">
              <div className="sort-dropdown">
                <button className="sort-btn">
                  Sort by <ChevronDown size={16} />
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

          <div className={`products-grid ${viewMode}`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                image={product.image}
                price={product.price}
                originalPrice={product.originalPrice}
                usdtPrice={product.usdtPrice}
                rating={product.rating}
                reviews={product.reviews}
                badges={product.badges}
                inStock={product.inStock}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;

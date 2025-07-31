import React, { useState } from 'react';
import './ProductsPage.css';
import ProductCard from './ProductCard';

const ProductsPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const products = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro',
      brand: 'Apple',
      image: 'phone.png',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New', 'Bestseller'],
      inStock: true
    },
    {
      id: 2,
      name: 'SONY Play Station (PS) 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: false
    },
    {
      id: 3,
      name: 'DELL Laptop Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 4,
      name: 'Apple iPhone 15 Pro',
      brand: 'Apple',
      image: 'phone.png',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New', 'Bestseller'],
      inStock: true
    },
    {
      id: 5,
      name: 'SONY Play Station (PS) 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: false
    },
    {
      id: 6,
      name: 'DELL Laptop Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 7,
      name: 'SONY Play Station (PS) 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: false
    },
    {
      id: 8,
      name: 'DELL Laptop Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
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

  const ratings = [
    '4+ Stars',
    '3+ Stars', 
    '2+ Stars',
    '1+ Stars'
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
    setPriceRange({ min: '', max: '' });
    setSelectedCategories([]);
    setInStockOnly(false);
    setSelectedRatings([]);
  };

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>All Product</h1>
          <p>Discover our complete collection of premium gadgets and accessories.</p>
          <div className="hero-features">
            <span>Categories</span>
            <span>216+ Products</span>
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>

      <div className="products-container">
        {/* Left Sidebar - Filters */}
        <div className="filters-sidebar">
          {/* Search */}
          <div className="filter-section">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search products..."
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          {/* Categories */}
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

          {/* Price Range */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <div className="price-input">
                <label>Min</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div className="price-input">
                <label>Max</label>
                <input 
                  type="number" 
                  placeholder="1000000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
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

          {/* Rating */}
          <div className="filter-section">
            <h3>Rating</h3>
            <div className="filter-options">
              {ratings.map((rating) => (
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

          {/* Reset Filters */}
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Right Side - Product Grid */}
        <div className="products-section">
          {/* Product Count and View Options */}
          <div className="products-header">
            <span className="product-count">{products.length} products found</span>
            <div className="view-options">
              <button className="view-btn active">📊</button>
              <button className="view-btn">📋</button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 
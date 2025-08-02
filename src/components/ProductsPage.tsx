import React, { useState } from 'react';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample products data - exactly 9 products for 3x3 grid (3 rows)
  const products = [
    {
      id: 1,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 2,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 3,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 4,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 5,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 6,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 7,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 8,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    },
    {
      id: 9,
      name: 'Gadget Name',
      image: '/phone.png',
      price: 'N180,000',
      originalPrice: 'N800000',
      rating: 3.5,
      reviews: 10
    }
  ];

  const categories = [
    'Electronics',
    'Smartphones', 
    'Laptops',
    'Smart Watches',
    'Headphones',
    'Gaming',
    'Accessories'
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <p>Discover our complete collection of premium gadgets and accessories</p>
          <div className="breadcrumb">
            <span>🏠 Categories</span>
            <span>📱 All Products</span>
            <span>🛍️ Best Delivery</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="brands-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          {/* Search */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map((category) => (
                <label key={category} className="category-item">
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
              <input type="number" placeholder="Min" className="price-input" />
              <input type="number" placeholder="Max" className="price-input" />
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <h3>Availability</h3>
            <label className="category-item">
              <input type="checkbox" />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h3>Rating</h3>
            <label className="category-item">
              <input type="checkbox" />
              <span>4+ Stars</span>
            </label>
            <label className="category-item">
              <input type="checkbox" />
              <span>3+ Stars</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button className="reset-filters-btn">Reset Filters</button>
        </div>

        {/* Main Content - 3x3 Grid */}
        <div className="main-content">
          {/* Products Grid - 3x3 Grid */}
          <div className="brands-products-grid">
            {products.map((product) => (
              <div key={product.id} className="brands-product-card">
                <div className="brands-product-image-container">
                  <img src={product.image} alt={product.name} className="brands-product-image" />
                </div>

                <div className="brands-product-info">
                  <h3 className="brands-product-name">{product.name}</h3>

                  <div className="brands-product-rating">
                    <div className="brands-stars">
                      {renderStars(product.rating)}
                    </div>
                    <span className="brands-rating-text">({product.rating} stars) • {product.reviews} reviews</span>
                  </div>

                  <div className="brands-product-pricing">
                    <span className="brands-current-price">{product.price}</span>
                    <span className="brands-original-price">{product.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

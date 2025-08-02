import React, { useState } from 'react';
import './BrandsPage.css';

const BrandsPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState([5000, 800000]);

  // Sample products data - exactly 9 products for 3x3 grid
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
    <div className="brands-page">
      <div className="brands-container">
        {/* Main Content - 3x3 Grid */}
        <div className="main-content">
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

        {/* Right Sidebar */}
        <div className="sidebar">
          {/* Filter by Price */}
          <div className="filter-section">
            <h3>Filter by Price</h3>
            <div className="price-slider-container">
              <input
                type="range"
                min="5000"
                max="800000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider"
              />
              <button className="filter-btn">Filter</button>
              <div className="price-range">
                Price: N{priceRange[0].toLocaleString()} - N{priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filter by Category */}
          <div className="filter-section">
            <h3>Filter by:</h3>
            <div className="filter-options">
              <select className="filter-select">
                <option>RAM</option>
                <option>4GB</option>
                <option>8GB</option>
                <option>16GB</option>
              </select>
              
              <select className="filter-select">
                <option>Storage</option>
                <option>64GB</option>
                <option>128GB</option>
                <option>256GB</option>
              </select>
              
              <select className="filter-select">
                <option>Categories</option>
                <option>Phones</option>
                <option>Laptops</option>
                <option>Tablets</option>
              </select>
            </div>
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <h3>Cart:</h3>
            <div className="cart-item">
              <img src="/phone.png" alt="Redmi 14C" className="cart-item-image" />
              <div className="cart-item-details">
                <h4>Redmi 14C</h4>
                <p><strong>Colors:</strong> Aquamarine Blue</p>
                <p><strong>Storage:</strong> 256GB</p>
                <p><strong>RAM:</strong> 8GB</p>
                <p className="cart-item-price">1 x N170,500.00</p>
              </div>
            </div>
            
            <div className="cart-summary">
              <div className="subtotal">
                <span>Subtotal:</span>
                <span>N170,000</span>
              </div>
              
              <button className="view-cart-btn">View Cart</button>
              <button className="checkout-btn">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;

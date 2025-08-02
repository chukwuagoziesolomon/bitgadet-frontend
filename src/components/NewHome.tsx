import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Smartphone, Laptop, Tablet, Gamepad2, Watch, Headphones, TrendingUp, ArrowRight } from 'lucide-react';
import './NewHome.css';

const NewHome: React.FC = () => {
  const categories = [
    {
      name: 'Phones',
      image: 'phone.png',
      icon: Smartphone,
      description: 'Latest smart phones and mobile devices',
      itemCount: 97,
      color: '#4CAF50'
    },
    {
      name: 'Laptops',
      image: 'laptop.png',
      icon: Laptop,
      description: 'High-performance laptops and notebooks',
      itemCount: 45,
      color: '#2196F3'
    },
    {
      name: 'Tablets',
      image: 'tablet.png',
      icon: Tablet,
      description: 'iPads, Android Tablets and e-Readers',
      itemCount: 67,
      color: '#E91E63'
    },
    {
      name: 'Games',
      image: 'games.png',
      icon: Gamepad2,
      description: 'Gaming consoles and accessories',
      itemCount: 105,
      color: '#FF9800'
    },
    {
      name: 'Smartwatches',
      image: 'watch.png',
      icon: Watch,
      description: 'Smart wearables and fitness trackers',
      itemCount: 78,
      color: '#9C27B0'
    },
    {
      name: 'Accessories',
      image: 'headphone.png',
      icon: Headphones,
      description: 'Phone cases, chargers, and more',
      itemCount: 67,
      color: '#F44336'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.5,
      reviews: 324,
      discount: '12% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 2,
      name: 'PlayStation (PS) 5 Console',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 156,
      discount: '12% OFF',
      isNew: false,
      outOfStock: true
    },
    {
      id: 3,
      name: 'Laptop Dell XPS 15 9560',
      brand: 'DELL',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.6,
      reviews: 89,
      discount: '12% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 4,
      name: 'Sony Smartwatch 15',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.3,
      reviews: 234,
      discount: 'New',
      isNew: true,
      outOfStock: false
    },
    {
      id: 5,
      name: 'Sony Smartwatch 15',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 178,
      discount: '12% OFF',
      isNew: false,
      outOfStock: false
    }
  ];

  return (
    <div className="home-page">
      {/* Shop by Category Section */}
      <section className="shop-by-category">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide range of products across various categories</p>
          
          <div className="categories-grid">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="category-card">
                  <div className="category-image-container">
                    <img src={category.image} alt={category.name} className="category-product-image" />
                    <div className="category-icon-overlay">
                      <IconComponent size={24} color="white" />
                    </div>
                  </div>
                  <div className="category-content">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <div className="category-stats">
                      <TrendingUp size={14} color="#00c896" />
                      <span className="item-count">{category.itemCount} items</span>
                    </div>
                    <Link to={`/categories/${category.name.toLowerCase()}`} className="shop-now-link">
                      Shop Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="our-products">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          
          <div className="product-tabs">
            <button className="tab-button active">Featured</button>
            <button className="tab-button">Best Sellers</button>
            <button className="tab-button">New Arrivals</button>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-badges">
                    {product.isNew ? (
                      <span className="badge new-badge">New</span>
                    ) : (
                      <span className="badge discount-badge">{product.discount}</span>
                    )}
                    {product.outOfStock && <span className="badge stock-badge">Out of Stock</span>}
                  </div>
                  <button className="wishlist-btn">
                    <Heart size={16} />
                  </button>
                </div>
                
                <div className="product-info">
                  <p className="product-brand">{product.brand}</p>
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(product.rating) ? "#FFD700" : "none"}
                          color="#FFD700"
                        />
                      ))}
                    </div>
                    <span className="rating-text">({product.reviews})</span>
                  </div>
                  
                  <div className="product-pricing">
                    <span className="current-price">{product.price}</span>
                    <span className="original-price">{product.originalPrice}</span>
                  </div>
                  
                  <div className="product-actions">
                    {product.outOfStock ? (
                      <div className="out-of-stock-text">Out of stock</div>
                    ) : (
                      <>
                        <button className="add-to-cart-button">
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button className="wishlist-enquiry-button">
                          WhatsApp Enquiry
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="customer-testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Don't take our word for it. Here's what our customers have to say about our products and services</p>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="stars-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                ))}
              </div>
              <p className="testimonial-text">
                "Amazing service and top-quality products! I've been shopping with BitGadgetz for over a year now, and they never disappoint. Fast delivery, excellent customer support, and genuine products every time."
              </p>
              <div className="customer-info">
                <div className="customer-avatar">
                  <img src="/api/placeholder/60/60" alt="Customer" />
                </div>
                <div className="customer-details">
                  <h4 className="customer-name">Sarah Johnson</h4>
                  <p className="customer-title">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Section */}
      <section className="trusted-section">
        <div className="container">
          <h2 className="section-title">Trusted by Thousands</h2>
          <p className="section-subtitle">Join thousands of satisfied customers who trust us for their tech needs</p>

          <div className="trust-stats">
            <div className="stat-item">
              <h3 className="stat-number">10,000+</h3>
              <p className="stat-label">Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">4.9/5</h3>
              <p className="stat-label">Average Rating</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">99%</h3>
              <p className="stat-label">Customer Satisfaction</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Customer Support</p>
            </div>
          </div>

          <div className="trust-actions">
            <button className="cta-button primary">Shop Now</button>
            <button className="cta-button secondary">Contact Us</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHome;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, HeartPlus, Smartphone, Laptop, Tablet, Gamepad2, Watch, Headphones, TrendingUp, ArrowRight } from 'lucide-react';
import { apiRequest, API_CONFIG } from '../config/api';
import './NewHome.css';

// Types for API response
interface CategoryTrendData {
  category_name: string;
  display_name: string;
  item_count: number;
  trend_level: string;
  trend_color: string;
  has_items: boolean;
}

interface CategoryApiResponse {
  categories: CategoryTrendData[];
  total_categories: number;
}

// Enhanced category interface for UI
interface CategoryWithUI extends CategoryTrendData {
  image: string;
  icon: React.ComponentType<any>;
  description: string;
}

const NewHome: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'newarrivals'>('featured');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Welcome to BitGadgetz",
      subtitle: "Your Premier Tech Destination",
      description: "Discover the latest gadgets with crypto and Naira payment options",
      backgroundColor: "#667eea",
      textColor: "#ffffff"
    },
    {
      id: 2,
      title: "Pay with Crypto",
      subtitle: "Bitcoin & Ethereum Accepted",
      description: "Seamless cryptocurrency payments for all your tech purchases",
      backgroundColor: "#f093fb",
      textColor: "#ffffff"
    },
    {
      id: 3,
      title: "Premium Quality",
      subtitle: "100% Authentic Products",
      description: "All products come with manufacturer warranty and authenticity guarantee",
      backgroundColor: "#4facfe",
      textColor: "#ffffff"
    },
    {
      id: 4,
      title: "Fast Delivery",
      subtitle: "Express Shipping Available",
      description: "Get your gadgets delivered quickly and safely to your doorstep",
      backgroundColor: "#43e97b",
      textColor: "#ffffff"
    }
  ];

  // Carousel auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [bannerSlides.length]);

  // Icon mapping for categories
  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      phones: Smartphone,
      laptops: Laptop,
      tablets: Tablet,
      games: Gamepad2,
      smartwatches: Watch,
      accessories: Headphones,
    };
    return iconMap[categoryName.toLowerCase()] || Smartphone;
  };

  // Image mapping for categories
  const getImageForCategory = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      phones: 'phone.png',
      laptops: 'laptop.png',
      tablets: 'tablet.png',
      games: 'games.png',
      smartwatches: 'watch.png',
      accessories: 'headphone.png',
    };
    return imageMap[categoryName.toLowerCase()] || 'phone.png';
  };

  // Description mapping for categories
  const getDescriptionForCategory = (categoryName: string) => {
    const descriptionMap: { [key: string]: string } = {
      phones: 'Latest smart phones and mobile devices',
      laptops: 'High-performance laptops and notebooks',
      tablets: 'iPads, Android Tablets and e-Readers',
      games: 'Gaming consoles and accessories',
      smartwatches: 'Smart wearables and fitness trackers',
      accessories: 'Phone cases, chargers, and more',
    };
    return descriptionMap[categoryName.toLowerCase()] || 'Quality tech products';
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data: CategoryApiResponse = await apiRequest<CategoryApiResponse>(
          API_CONFIG.ENDPOINTS.CATEGORIES_TREND
        );

        // Transform API data to include UI elements
        const enhancedCategories: CategoryWithUI[] = data.categories.map(category => ({
          ...category,
          image: getImageForCategory(category.category_name),
          icon: getIconForCategory(category.category_name),
          description: getDescriptionForCategory(category.category_name),
        }));

        setCategories(enhancedCategories);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');

        // Fallback to static data if API fails
        const fallbackCategories: CategoryWithUI[] = [
          {
            category_name: 'phones',
            display_name: 'Phones',
            item_count: 97,
            trend_level: 'high',
            trend_color: '#4CAF50',
            has_items: true,
            image: 'phone.png',
            icon: Smartphone,
            description: 'Latest smart phones and mobile devices'
          },
          {
            category_name: 'laptops',
            display_name: 'Laptops',
            item_count: 45,
            trend_level: 'medium',
            trend_color: '#2196F3',
            has_items: true,
            image: 'laptop.png',
            icon: Laptop,
            description: 'High-performance laptops and notebooks'
          },
          {
            category_name: 'tablets',
            display_name: 'Tablets',
            item_count: 67,
            trend_level: 'low',
            trend_color: '#E91E63',
            has_items: true,
            image: 'tablet.png',
            icon: Tablet,
            description: 'iPads, Android Tablets and e-Readers'
          }
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Featured Products
  const featuredProducts = [
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
      name: 'MacBook Pro 16"',
      brand: 'Apple',
      price: '₦2,450,000',
      originalPrice: '₦2,800,000',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 289,
      discount: '15% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: '₦1,650,000',
      originalPrice: '₦1,900,000',
      image: '/api/placeholder/200/200',
      rating: 4.6,
      reviews: 412,
      discount: '13% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 4,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      price: '₦1,200,000',
      originalPrice: '₦1,400,000',
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 198,
      discount: '14% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 5,
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      price: '₦450,000',
      originalPrice: '₦520,000',
      image: '/api/placeholder/200/200',
      rating: 4.9,
      reviews: 567,
      discount: '13% OFF',
      isNew: false,
      outOfStock: false
    }
  ];

  // Best Sellers
  const bestSellersProducts = [
    {
      id: 6,
      name: 'PlayStation 5 Console',
      brand: 'Sony',
      price: '₦850,000',
      originalPrice: '₦950,000',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 1234,
      discount: '11% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 7,
      name: 'AirPods Pro (2nd Gen)',
      brand: 'Apple',
      price: '₦320,000',
      originalPrice: '₦380,000',
      image: '/api/placeholder/200/200',
      rating: 4.6,
      reviews: 892,
      discount: '16% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 8,
      name: 'Dell XPS 13',
      brand: 'Dell',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/api/placeholder/200/200',
      rating: 4.5,
      reviews: 456,
      discount: '12% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 9,
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      price: '₦650,000',
      originalPrice: '₦750,000',
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 723,
      discount: '13% OFF',
      isNew: false,
      outOfStock: false
    },
    {
      id: 10,
      name: 'Samsung Galaxy Buds2 Pro',
      brand: 'Samsung',
      price: '₦280,000',
      originalPrice: '₦320,000',
      image: '/api/placeholder/200/200',
      rating: 4.4,
      reviews: 634,
      discount: '13% OFF',
      isNew: false,
      outOfStock: false
    }
  ];

  // New Arrivals
  const newArrivalsProducts = [
    {
      id: 11,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: '₦2,150,000',
      originalPrice: '₦2,150,000',
      image: '/api/placeholder/200/200',
      rating: 4.9,
      reviews: 89,
      discount: 'New',
      isNew: true,
      outOfStock: false
    },
    {
      id: 12,
      name: 'MacBook Air M3',
      brand: 'Apple',
      price: '₦1,950,000',
      originalPrice: '₦1,950,000',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 45,
      discount: 'New',
      isNew: true,
      outOfStock: false
    },
    {
      id: 13,
      name: 'Samsung Galaxy Tab S9',
      brand: 'Samsung',
      price: '₦850,000',
      originalPrice: '₦850,000',
      image: '/api/placeholder/200/200',
      rating: 4.6,
      reviews: 67,
      discount: 'New',
      isNew: true,
      outOfStock: false
    },
    {
      id: 14,
      name: 'Google Pixel 8 Pro',
      brand: 'Google',
      price: '₦1,450,000',
      originalPrice: '₦1,450,000',
      image: '/api/placeholder/200/200',
      rating: 4.7,
      reviews: 123,
      discount: 'New',
      isNew: true,
      outOfStock: false
    },
    {
      id: 15,
      name: 'Nothing Phone (2)',
      brand: 'Nothing',
      price: '₦750,000',
      originalPrice: '₦750,000',
      image: '/api/placeholder/200/200',
      rating: 4.5,
      reviews: 234,
      discount: 'New',
      isNew: true,
      outOfStock: false
    }
  ];

  // Get current products based on active tab
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'featured':
        return featuredProducts;
      case 'bestsellers':
        return bestSellersProducts;
      case 'newarrivals':
        return newArrivalsProducts;
      default:
        return featuredProducts;
    }
  };

  return (
    <div className="home-page">
      {/* Banner Carousel Section */}
      <section className="banner-section">
        <div className="banner-container">
          <div className="banner-carousel">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${slide.backgroundColor} 0%, ${slide.backgroundColor}dd 100%)`,
                  color: slide.textColor
                }}
              >
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <h2 className="slide-subtitle">{slide.subtitle}</h2>
                  <p className="slide-description">{slide.description}</p>
                  <div className="slide-actions">
                    <Link to="/products" className="cta-button primary">
                      Shop Now
                    </Link>
                    <Link to="/contact" className="cta-button secondary">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Carousel Navigation */}
            <button
              className="carousel-nav prev"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              className="carousel-nav next"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="shop-by-category">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our wide range of products across various categories</p>

          {loading ? (
            <div className="loading-state">
              <p>Loading categories...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={category.category_name} className="category-card">
                    <div className="category-image-container">
                      <img src={category.image} alt={category.display_name} className="category-product-image" />
                      <div className="category-icon-overlay">
                        <IconComponent size={24} color="white" />
                      </div>
                      {/* Trend indicator */}
                      <div className="trend-indicator" style={{ backgroundColor: category.trend_color }}>
                        <TrendingUp size={12} color="white" />
                        <span className="trend-level">{category.trend_level}</span>
                      </div>
                    </div>
                    <div className="category-content">
                      <h3 className="category-name">{category.display_name}</h3>
                      <p className="category-description">{category.description}</p>

                      {/* Centered trend stats box */}
                      <div className="category-stats-box">
                        <div className="trend-info">
                          <TrendingUp size={16} color={category.trend_color} />
                          <span className="trend-level-text" style={{ color: category.trend_color }}>
                            {category.trend_level.toUpperCase()}
                          </span>
                        </div>
                        <div className="item-info">
                          <span className="item-count">{category.item_count} items</span>
                          {!category.has_items && (
                            <span className="no-items-badge">Coming Soon</span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/categories/${category.category_name}`}
                        className={`shop-now-link ${!category.has_items ? 'disabled' : ''}`}
                      >
                        {category.has_items ? 'Shop Now' : 'Coming Soon'} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Our Products Section */}
      <section className="our-products">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          
          <div className="product-tabs">
            <button
              className={`tab-button ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              Featured
            </button>
            <button
              className={`tab-button ${activeTab === 'bestsellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('bestsellers')}
            >
              Best Sellers
            </button>
            <button
              className={`tab-button ${activeTab === 'newarrivals' ? 'active' : ''}`}
              onClick={() => setActiveTab('newarrivals')}
            >
              New Arrivals
            </button>
          </div>

          <div className="products-grid">
            {getCurrentProducts().map((product) => (
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
                    <HeartPlus size={16} />
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

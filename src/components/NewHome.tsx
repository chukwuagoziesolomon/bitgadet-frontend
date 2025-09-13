import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Smartphone, Laptop, Tablet, Gamepad2, Watch, Headphones, TrendingUp, ArrowRight } from 'lucide-react';
import { apiRequest, API_CONFIG } from '../config/api';
import './NewHome.css';

// Types for API responses
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

interface BannerData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  banner_type: string;
  link_type: string;
  product_name?: string;
  button_text: string;
  generated_link_url: string;
  is_currently_active: boolean;
  display_order: number;
}

interface BannersApiResponse {
  banners: {
    hero: BannerData[];
    promotional: BannerData[];
    category: BannerData[];
    seasonal: BannerData[];
  };
  total_banners: number;
  banner_types: string[];
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  category_slug: string;
  short_description: string;
  current_price: string;
  current_price_usdt: string;
  original_price: string;
  original_price_usdt: string;
  brand: string;
  model: string;
  main_image: string;
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  is_in_stock: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  stock_quantity: number;
  total_sales: number;
  views_count: number;
  created_at: string;
}

interface ProductsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductData[];
}

// Enhanced category interface for UI
interface CategoryWithUI extends CategoryTrendData {
  image: string;
  icon: React.ComponentType<any>;
  description: string;
}

const NewHome: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithUI[]>([]);
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductData[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const [newArrivalsError, setNewArrivalsError] = useState<string | null>(null);
  const [bestSellersError, setBestSellersError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'featured' | 'bestSellers' | 'newArrivals'>('featured');

  // Fallback banner data
  const fallbackBanners: BannerData[] = [
    {
      id: 1,
      title: "Welcome to BitGadgetz",
      subtitle: "Your Premier Tech Destination",
      image: "",
      banner_type: "hero",
      link_type: "page",
      button_text: "Shop Now",
      generated_link_url: "/products",
      is_currently_active: true,
      display_order: 1
    },
    {
      id: 2,
      title: "Pay with Crypto",
      subtitle: "Bitcoin & Ethereum Accepted",
      image: "",
      banner_type: "hero",
      link_type: "page",
      button_text: "Learn More",
      generated_link_url: "/contact",
      is_currently_active: true,
      display_order: 2
    }
  ];

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        console.log('🔄 Fetching banners from:', API_CONFIG.ENDPOINTS.BANNERS_ACTIVE);
        const data: BannersApiResponse = await apiRequest<BannersApiResponse>(
          API_CONFIG.ENDPOINTS.BANNERS_ACTIVE
        );
        console.log('✅ Banners data received:', data);

        // Use hero banners for the carousel, fallback to other types if no hero banners
        const heroBanners = data.banners.hero || [];
        const allBanners = [
          ...heroBanners,
          ...(data.banners.promotional || []),
          ...(data.banners.seasonal || [])
        ].filter(banner => banner.is_currently_active)
         .sort((a, b) => a.display_order - b.display_order);

        setBanners(allBanners.length > 0 ? allBanners : fallbackBanners);
        setBannersError(null);
      } catch (err) {
        console.error('Failed to fetch banners:', err);
        setBannersError('Failed to load banners. Using default content.');
        setBanners(fallbackBanners);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Fetch new arrivals from API
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setNewArrivalsLoading(true);
        setNewArrivalsError(null);
        console.log('🔄 Fetching new arrivals (first 5 for homepage)...');

        const data: ProductsApiResponse = await apiRequest<ProductsApiResponse>(
          API_CONFIG.ENDPOINTS.PRODUCTS_NEW_ARRIVALS
        );

        console.log('✅ New arrivals API response:', data);

        if (data && data.results) {
          // Limit to first 5 products for homepage
          const limitedResults = data.results.slice(0, 5);
          setNewArrivals(limitedResults);
          console.log('✅ New arrivals data received:', limitedResults.length, 'products (limited to 5 for homepage)');
          setNewArrivalsError(null);
        } else {
          console.warn('⚠️ No results in API response:', data);
          setNewArrivals([]);
          setNewArrivalsError('No new arrivals found.');
        }
      } catch (err) {
        console.error('❌ Failed to fetch new arrivals:', err);
        setNewArrivalsError(`Failed to load new arrivals: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setNewArrivals([]);
      } finally {
        setNewArrivalsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Fetch best sellers from API
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setBestSellersLoading(true);
        setBestSellersError(null);
        console.log('🔄 Fetching best sellers (first 5 for homepage)...');

        const data: ProductsApiResponse = await apiRequest<ProductsApiResponse>(
          API_CONFIG.ENDPOINTS.PRODUCTS_BEST_SELLERS
        );

        console.log('✅ Best sellers API response:', data);

        if (data && data.results) {
          // Limit to first 5 products for homepage
          const limitedResults = data.results.slice(0, 5);
          setBestSellers(limitedResults);
          console.log('✅ Best sellers data received:', limitedResults.length, 'products (limited to 5 for homepage)');
          setBestSellersError(null);
        } else {
          console.warn('⚠️ No results in best sellers API response:', data);
          setBestSellers([]);
          setBestSellersError('No best sellers found.');
        }
      } catch (err) {
        console.error('❌ Failed to fetch best sellers:', err);
        setBestSellersError(`Failed to load best sellers: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setBestSellers([]);
      } finally {
        setBestSellersLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Carousel auto-slide effect
  useEffect(() => {
    if (banners.length > 1) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(slideInterval);
    }
  }, [banners.length]);

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
        console.log('🔄 Fetching categories from:', API_CONFIG.ENDPOINTS.CATEGORIES_TREND);
        const data: CategoryApiResponse = await apiRequest<CategoryApiResponse>(
          API_CONFIG.ENDPOINTS.CATEGORIES_TREND
        );
        console.log('✅ Categories data received:', data);

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

  const staticProducts = [
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

  // Get current products based on active tab
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'featured':
        return staticProducts;
      case 'bestSellers':
        return bestSellers.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: `₦${parseFloat(product.current_price).toLocaleString()}`,
          originalPrice: `₦${parseFloat(product.original_price).toLocaleString()}`,
          image: product.main_image,
          rating: Math.min(5, Math.max(3, 3 + (product.views_count / 50))),
          reviews: product.views_count,
          discount: product.is_on_sale ? `${Math.round(product.discount_percentage)}% OFF` : 'Best Seller',
          isNew: product.is_new_arrival,
          outOfStock: !product.is_in_stock,
          isBestSeller: product.is_best_seller,
          isOnSale: product.is_on_sale,
          discountPercentage: product.discount_percentage
        }));
      case 'newArrivals':
        return newArrivals.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: `₦${parseFloat(product.current_price).toLocaleString()}`,
          originalPrice: `₦${parseFloat(product.original_price).toLocaleString()}`,
          image: product.main_image,
          rating: Math.min(5, Math.max(3, 3 + (product.views_count / 50))),
          reviews: product.views_count,
          discount: product.is_on_sale ? `${Math.round(product.discount_percentage)}% OFF` : 'New Arrival',
          isNew: product.is_new_arrival,
          outOfStock: !product.is_in_stock,
          isBestSeller: product.is_best_seller,
          isOnSale: product.is_on_sale,
          discountPercentage: product.discount_percentage
        }));
      default:
        return staticProducts;
    }
  };

  return (
    <div className="home-page">
      {/* Banner Carousel Section */}
      <section className="banner-section">
        <div className="banner-container">
          {bannersLoading ? (
            <div className="banner-loading">
              <p>Loading banners...</p>
            </div>
          ) : bannersError ? (
            <div className="banner-error">
              <p>{bannersError}</p>
            </div>
          ) : (
            <div className="banner-carousel">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    backgroundImage: banner.image ? `url(${banner.image})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="slide-overlay"></div>

                  <div className="slide-content">
                    <h1 className="slide-title">{banner.title}</h1>
                    <h2 className="slide-subtitle">{banner.subtitle}</h2>
                    {banner.product_name && (
                      <p className="slide-product">{banner.product_name}</p>
                    )}
                    <div className="slide-actions">
                      <Link to={banner.generated_link_url} className="cta-button primary">
                        {banner.button_text}
                      </Link>
                      <Link to="/products" className="cta-button secondary">
                        Browse All
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Carousel Indicators */}
              {banners.length > 1 && (
                <div className="carousel-indicators">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Carousel Navigation */}
              {banners.length > 1 && (
                <>
                  <button
                    className="carousel-nav prev"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>
                  <button
                    className="carousel-nav next"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                    aria-label="Next slide"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}
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
              className={`tab-button ${activeTab === 'bestSellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('bestSellers')}
            >
              Best Sellers
            </button>
            <button
              className={`tab-button ${activeTab === 'newArrivals' ? 'active' : ''}`}
              onClick={() => setActiveTab('newArrivals')}
            >
              New Arrivals
            </button>
          </div>

          {activeTab === 'newArrivals' && newArrivalsLoading ? (
            <div className="products-loading">
              <p>Loading new arrivals...</p>
            </div>
          ) : activeTab === 'newArrivals' && newArrivalsError ? (
            <div className="products-error">
              <p>{newArrivalsError}</p>
            </div>
          ) : activeTab === 'bestSellers' && bestSellersLoading ? (
            <div className="products-loading">
              <p>Loading best sellers...</p>
            </div>
          ) : activeTab === 'bestSellers' && bestSellersError ? (
            <div className="products-error">
              <p>{bestSellersError}</p>
            </div>
          ) : (
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

              {getCurrentProducts().length === 0 && activeTab === 'newArrivals' && !newArrivalsLoading && (
                <div className="no-products">
                  <p>No new arrivals available at the moment.</p>
                </div>
              )}

              {getCurrentProducts().length === 0 && activeTab === 'bestSellers' && !bestSellersLoading && (
                <div className="no-products">
                  <p>No best sellers available at the moment.</p>
                </div>
              )}
            </div>
          )}
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

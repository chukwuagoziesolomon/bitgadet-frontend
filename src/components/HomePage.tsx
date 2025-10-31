import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Laptop, Gamepad2, Watch, Headphones, TrendingUp, TrendingDown, Star, Award, Sparkles, Package } from 'lucide-react';
import ProductCard from './ProductCard';
import './HomePage.css';
import { apiRequest, publicApiRequest, conditionalApiRequest, API_CONFIG } from '../config/api';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import { useBestSellers } from '../hooks/useBestSellers';
import { useNewArrivals } from '../hooks/useNewArrivals';
import { useToast } from '../hooks/useToast';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState<boolean>(true);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const [categoryMeta, setCategoryMeta] = useState<Record<string, { total_items: number; trend?: string }>>({});
  const [wishlist, setWishlist] = useState<number[]>([]); // NEW
  const [cart, setCart] = useState<Record<number, number>>({}); // NEW
  const navigate = useNavigate();
  const { showError } = useToast();

  // Use the new hooks for product data
  const { products: featuredProducts, loading: featuredLoading, error: featuredError } = useFeaturedProducts();
  const { products: bestSellers, loading: bestSellersLoading, error: bestSellersError } = useBestSellers();
  const { products: newArrivals, loading: newArrivalsLoading, error: newArrivalsError } = useNewArrivals();

  // Fetch banners for hero slideshow
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        const data = await publicApiRequest<any>(API_CONFIG.ENDPOINTS.BANNERS_ACTIVE);
        // New response structure: { banners: { hero: [...], ... }, total_banners, banner_types }
        const heroBanners = data?.banners?.hero || [];
        const items = Array.isArray(heroBanners) ? heroBanners : [];
        setBanners(items);
        setBannersError(null);
      } catch (error: any) {
        setBannersError('Failed to load banners');
        setBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const total = banners.length;
    if (total <= 1) return; // no need to rotate
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === total - 1 ? 0 : prevSlide + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Fetch categories data for Home category cards
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await publicApiRequest<{ categories: any[] } | any[]>('/api/shop/categories/');
        const categoriesArray = Array.isArray(data) ? data : (data as any).categories || [];

        const meta: Record<string, { total_items: number; trend?: string }> = {};
        categoriesArray.forEach((category: any) => {
          meta[category.category_name] = {
            total_items: category.item_count,
            trend: category.trend_level
          };
        });
        setCategoryMeta(meta);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Set default values for all categories
        const defaultMeta: Record<string, { total_items: number; trend?: string }> = {};
        ['phones', 'laptops', 'tablets', 'games', 'smartwatches', 'accessories'].forEach(slug => {
          defaultMeta[slug] = { total_items: 0, trend: undefined };
        });
        setCategoryMeta(defaultMeta);
      }
    };

    fetchCategories();
  }, []);

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

  // Get current products based on active tab
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'featured':
        return featuredProducts;
      case 'bestsellers':
        return bestSellers;
      case 'new':
        return newArrivals;
      default:
        return featuredProducts;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'featured':
        return featuredLoading;
      case 'bestsellers':
        return bestSellersLoading;
      case 'new':
        return newArrivalsLoading;
      default:
        return featuredLoading;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 'featured':
        return featuredError;
      case 'bestsellers':
        return bestSellersError;
      case 'new':
        return newArrivalsError;
      default:
        return featuredError;
    }
  };

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');
    console.log('🛒 Attempting to add product to cart:', productId, 'User logged in:', !!token);

    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const res = await conditionalApiRequest<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      console.log('✅ Add to cart API response:', res);
      setCart(res.cart || {});
      console.log('🛒 Updated cart state:', res.cart || {});
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
      // Only show error if user is actually logged in (has token)
      if (token) {
        showError('Failed to add to cart', error.message || 'Please try again.');
      }
    }
  };

  // Toggle wishlist on single click
  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const token = localStorage.getItem('authToken');
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';

    // Optimistic update
    setWishlist(prev => willBeInWishlist ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
      const res = await conditionalApiRequest<any>(endpoint, {
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

  const handleHeroCTAClick = (slideIndex: number) => {
    const slide = banners[slideIndex];
    if (slide?.product_url) {
      navigate(slide.product_url);
      return;
    }
    // If no specific URL, navigate to products page
    navigate('/products');
  };

  return (
    <div className="home-page">
      {/* Hero Section - Slideshow Banner */}
      <section className="hero-section">
        <div className="hero-slideshow">
          <div className="slideshow-container">
            {bannersLoading ? (
              <div className="slide-wrapper">
                <div className="slide active">
                  <div className="slide-overlay">
                    <div className="slide-content">
                      <h1>Loading banners…</h1>
                      <p>Please wait.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : bannersError ? (
              <div className="slide-wrapper">
                <div className="slide active">
                  <div className="slide-overlay">
                    <div className="slide-content">
                      <h1>Unable to load banners</h1>
                      <p>Try again later.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : banners.length === 0 ? (
              <div className="slide-wrapper">
                <div className="slide active">
                  <div className="slide-overlay">
                    <div className="slide-content">
                      <h1>No banners yet</h1>
                      <p>Come back soon for exciting offers.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="slide-wrapper">
                {banners.map((slide, index) => (
                  <div
                    key={slide.id || index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                  >
                    <img src={slide?.image || '/logo.png'} alt={slide?.product_name || slide?.title || 'Banner'} className="slide-image" onClick={() => navigate(slide?.product_url || '/products')} style={{ cursor: 'pointer' }} />
                    <div className="slide-overlay">
                      <div className="slide-content">
                        <h1>{slide?.title || slide?.button_text || 'Shop Now'}</h1>
                        {slide?.subtitle && <p>{slide.subtitle}</p>}
                        <button className="cta-button" onClick={() => handleAddToCart(slide?.product_id)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Slide indicators */}
            <div className="slide-indicators">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <p className="section-subtitle">Discover our wide range of premium gadgets and accessories</p>
          <div className="categories-grid">
            <div className="category-card" onClick={() => navigate('/categories/phones')}>
              <div className="category-image">
                <img
                  src="/phone1.png"
                  alt="Phones"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=Phones'; // Cloudinary-style fallback
                  }}
                />
                <div className="category-overlay">
                  <Smartphone className="category-icon" size={32} color="#00C896" />
        </div>
            </div>
            <h3>Phones</h3>
              <p>Latest smart phones and mobile devices.</p>
              <div className="category-count">
                <span>{categoryMeta['phones']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/phones')}>Shop Now →</button>
            </div>
            
            <div className="category-card" onClick={() => navigate('/categories/laptops')}>
              <div className="category-image">
                <img src="/laptop1.png" alt="Laptops" />
                <div className="category-overlay">
                  <Laptop className="category-icon" size={32} color="#00C896" />
                </div>
            </div>
            <h3>Laptops</h3>
            <p>High-performance laptops and notebooks</p>
              <div className="category-count">
                <span>{categoryMeta['laptops']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/laptops')}>Shop Now →</button>
            </div>
            
            <div className="category-card" onClick={() => navigate('/categories/tablets')}>
              <div className="category-image">
              <img src="/tablet.png" alt="Tablets" />
                <div className="category-overlay">
                  <Smartphone className="category-icon" size={32} color="#00C896" />
                </div>
            </div>
            <h3>Tablets</h3>
            <p>iPads, Android Tablets and e-Readers</p>
              <div className="category-count">
                <span>{categoryMeta['tablets']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/tablets')}>Shop Now →</button>
            </div>
            
            <div className="category-card" onClick={() => navigate('/categories/games')}>
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="Games" />
                <div className="category-overlay">
                  <Gamepad2 className="category-icon" size={32} color="#00C896" />
                </div>
            </div>
            <h3>Games</h3>
            <p>Gaming consoles and accessories</p>
              <div className="category-count">
                <span>{categoryMeta['games']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/games')}>Shop Now →</button>
            </div>
            
            <div className="category-card" onClick={() => navigate('/categories/smartwatches')}>
              <div className="category-image">
                <img src="/phonewatch2.png" alt="Smartwatches" />
                <div className="category-overlay">
                  <Watch className="category-icon" size={32} color="#00C896" />
                </div>
            </div>
            <h3>Smartwatches</h3>
            <p>Smart wearables and fitness trackers</p>
              <div className="category-count">
                <span>{categoryMeta['smartwatches']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/smartwatches')}>Shop Now →</button>
            </div>
            
            <div className="category-card" onClick={() => navigate('/categories/accessories')}>
              <div className="category-image">
              <img src="/headphone.png" alt="Accessories" />
                <div className="category-overlay">
                  <Headphones className="category-icon" size={32} color="#00C896" />
                </div>
            </div>
            <h3>Accessories</h3>
            <p>Phone cases, chargers, and more</p>
              <div className="category-count">
                <span>{categoryMeta['accessories']?.total_items ?? 0} items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn" onClick={() => navigate('/categories/accessories')}>Shop Now →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="products-header-row">
            <div className="section-header">
              <h2>Our Products</h2>
            </div>
            <div className="product-tabs">
              <button
                className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => setActiveTab('featured')}
              >
                <Star size={18} />
                Featured
              </button>
              <button
                className={`tab-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
                onClick={() => setActiveTab('bestsellers')}
              >
                <Award size={18} />
                Best Sellers
              </button>
              <button
                className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
                onClick={() => setActiveTab('new')}
              >
                <Sparkles size={18} />
                New Arrivals
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {getCurrentLoading() ? (
              <div className="loading-products">
                <div className="loading-spinner">Loading products...</div>
              </div>
            ) : getCurrentError() ? (
              <div className="error-products">
                <div className="error-message">{getCurrentError()}</div>
              </div>
            ) : getCurrentProducts().length === 0 ? (
              <div className="empty-products">
                <div className="empty-state">
                  {activeTab === 'featured' && (
                    <>
                      <Star size={48} className="empty-icon" />
                      <h3>No Featured Products Yet</h3>
                      <p>We're curating the best products for you. Check back soon!</p>
                    </>
                  )}
                  {activeTab === 'bestsellers' && (
                    <>
                      <Award size={48} className="empty-icon" />
                      <h3>No Best Sellers Yet</h3>
                      <p>Our top-selling products will appear here once available.</p>
                    </>
                  )}
                  {activeTab === 'new' && (
                    <>
                      <Sparkles size={48} className="empty-icon" />
                      <h3>No New Arrivals Yet</h3>
                      <p>Fresh products are on the way. Stay tuned for updates!</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              getCurrentProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  price={parseFloat(product.current_price)}
                  originalPrice={parseFloat(product.original_price)}
                  usdtPrice={product.current_price_usdt}
                  rating={4.5} // Default rating since not in API response
                  reviews={0} // Default reviews since not in API response
                  image={product.main_image}
                  badges={
                    product.is_featured ? ['featured'] :
                    product.is_best_seller ? ['best-seller'] :
                    product.is_new_arrival ? ['new-arrival'] : []
                  }
                  inStock={product.is_in_stock}
                  onAddToCart={handleAddToCart}
                  isInCart={cart[product.id] > 0}
                  isInWishlist={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  product_condition={product.product_condition}
                  condition_display={product.condition_display}
                />
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

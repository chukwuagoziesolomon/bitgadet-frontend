import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Laptop, Gamepad2, Watch, Headphones, TrendingUp, TrendingDown, Star, Award, Sparkles, Package } from 'lucide-react';
import ProductCard from './ProductCard';
import './HomePage.css';
import { apiRequest, API_CONFIG } from '../config/api';
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
        const data = await apiRequest<any>(API_CONFIG.ENDPOINTS.BANNERS_CTA);
        const items = Array.isArray(data?.banners) ? data.banners : [];
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

  // Fetch per-category total_items and trend for Home category cards
  useEffect(() => {
    const slugs = ['phones', 'laptops', 'tablets', 'games', 'smartwatches', 'accessories'];
    const fetchOne = async (slug: string) => {
      try {
        const data = await apiRequest<any>(`/api/categories/${encodeURIComponent(slug)}/products`);
        const total = typeof data?.total_items === 'number' ? data.total_items : (Array.isArray(data?.products) ? data.products.length : 0);
        const trend = data?.trend;
        return [slug, { total_items: total, trend }] as const;
      } catch {
        return [slug, { total_items: 0, trend: undefined }] as const;
      }
    };
    (async () => {
      const results = await Promise.all(slugs.map(fetchOne));
      const meta: Record<string, { total_items: number; trend?: string }> = {};
      results.forEach(([slug, info]) => { meta[slug] = info; });
      setCategoryMeta(meta);
    })();
  }, []);

  useEffect(() => {
    const fetchWishlistAndCart = async () => {
      try {
        // Fetch wishlist on mount
        const wishlistRes = await apiRequest<any>('/api/wishlist/');
        setWishlist(wishlistRes.wishlist || []);
      } catch (error: any) {
        showError('Failed to load wishlist', error.message || 'Please try again later.');
      }

      try {
        // Fetch cart on mount
        const cartRes = await apiRequest<any>('/api/cart/');
        setCart(cartRes.cart || {});
      } catch (error: any) {
        showError('Failed to load cart', error.message || 'Please try again later.');
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
    try {
      const res = await apiRequest<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      setCart(res.cart || {});
    } catch (error: any) {
      showError('Failed to add to cart', error.message || 'Please try again.');
    }
  };

  // Toggle wishlist on single click
  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';
    try {
      const res = await apiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      setWishlist(res.wishlist || []);
    } catch (error: any) {
      showError('Failed to update wishlist', error.message || 'Please try again.');
    }
  };

  const handleHeroCTAClick = (slideIndex: number) => {
    const slide = banners[slideIndex];
    if (slide?.productId) {
      navigate(`/product/${slide.productId}`);
      return;
    }
    if (slide?.deepLink) {
      navigate(slide.deepLink);
      return;
    }
    if (slide?.category) {
      navigate(`/products?category=${encodeURIComponent(slide.category)}`);
      return;
    }
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
                    key={slide.bannerId || index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                  >
                    <img src={slide?.snapshot?.image || '/logo.png'} alt={slide?.productSlug || slide?.ctaLabel || 'Banner'} className="slide-image" />
                    <div className="slide-overlay">
                      <div className="slide-content">
                        <h1>{slide?.ctaLabel || 'Shop Now'}</h1>
                        {slide?.snapshot?.price && (
                          <p>
                            ₦{slide.snapshot.price}
                            {slide?.snapshot?.originalPrice ? ` · Was ₦${slide.snapshot.originalPrice}` : ''}
                          </p>
                        )}
                        <button className="cta-button" onClick={() => handleHeroCTAClick(index)}>{slide?.ctaLabel || 'Shop Now'}</button>
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
                {categoryMeta['phones']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['phones']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
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
                {categoryMeta['laptops']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['laptops']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
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
                {categoryMeta['tablets']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['tablets']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
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
                {categoryMeta['games']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['games']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
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
                {categoryMeta['smartwatches']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['smartwatches']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
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
                {categoryMeta['accessories']?.trend === 'up' && <TrendingUp size={16} color="#00C896" style={{ marginLeft: 6 }} />}
                {categoryMeta['accessories']?.trend === 'down' && <TrendingDown size={16} color="#FF6B6B" style={{ marginLeft: 6 }} />}
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="products-section">
        <div className="container">
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

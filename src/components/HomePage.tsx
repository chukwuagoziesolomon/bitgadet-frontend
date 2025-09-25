import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Laptop, Gamepad2, Watch, Headphones, TrendingUp, TrendingDown } from 'lucide-react';
import ProductCard from './ProductCard';
import './HomePage.css';
import { apiRequest, API_CONFIG } from '../config/api';

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
        const data = await apiRequest<any>(`/api/categories/${encodeURIComponent(slug)}/products/`);
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
    // Fetch wishlist on mount
    apiRequest<any>('/api/wishlist/').then(res => {
      setWishlist(res.wishlist || []);
    });
    // Fetch cart on mount
    apiRequest<any>('/api/cart/').then(res => {
      setCart(res.cart || {});
    });
  }, []);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      price: 850000,
      originalPrice: 950000,
      usdtPrice: 425,
      rating: 4.8,
      reviews: 124,
      image: "/phone1.png",
      badges: ["new-arrival"],
      inStock: true
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      price: 750000,
      originalPrice: 850000,
      usdtPrice: 375,
      rating: 4.7,
      reviews: 98,
      image: "/phone2.png",
      badges: ["best-seller"],
      inStock: true
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      brand: "Apple",
      price: 1200000,
      originalPrice: 1350000,
      usdtPrice: 600,
      rating: 4.9,
      reviews: 67,
      image: "/laptop1.png",
      badges: ["featured"],
      inStock: true
    },
    {
      id: 4,
      name: "Dell XPS 15",
      brand: "Dell",
      price: 950000,
      originalPrice: 1100000,
      usdtPrice: 475,
      rating: 4.6,
      reviews: 89,
      image: "/laptop2.png",
      badges: ["featured"],
      inStock: true
    },
    {
      id: 5,
      name: "AirPods Pro 2",
      brand: "Apple",
      price: 180000,
      originalPrice: 200000,
      usdtPrice: 90,
      rating: 4.8,
      reviews: 156,
      image: "/airpods.png",
      badges: ["best-seller"],
      inStock: true
    }
  ];

  const handleAddToCart = (productId: number) => {
    apiRequest<any>('/api/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    }).then(res => {
      setCart(res.cart || {});
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
    });
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
              Featured
            </button>
            <button 
              className={`tab-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('bestsellers')}
            >
              Best Sellers
            </button>
            <button 
              className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New Arrivals
            </button>
        </div>

          {/* Products Grid */}
        <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                originalPrice={product.originalPrice}
                usdtPrice={product.usdtPrice.toString()}
                rating={product.rating}
                reviews={product.reviews}
                image={product.image}
                badges={product.badges}
                inStock={product.inStock}
                onAddToCart={handleAddToCart}
                isInCart={cart[product.id] > 0}
                isInWishlist={wishlist.includes(product.id)} // NEW
                onToggleWishlist={handleToggleWishlist} // NEW
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

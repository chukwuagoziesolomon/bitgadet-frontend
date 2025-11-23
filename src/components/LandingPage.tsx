import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, MapPin, RefreshCw, Target, Eye, Headphones, Shield, Truck, CreditCard, RotateCcw, Clock, TruckIcon, Zap } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { publicApiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './LandingPage.css';

interface DealResponse {
  page_title?: string;
  page_description?: string;
  deals: any[];
  total_deals: number;
  success?: boolean;
  deal?: any;
  time_info?: {
    time_remaining: number;
  };
}

const LandingPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // State for animation switches
  const [topSwitched, setTopSwitched] = useState(false);
  const [sidesSwitched, setSidesSwitched] = useState(false);
  const [bottomSwitched, setBottomSwitched] = useState(false);

  // State for customer reviews rotation
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // State for responsive service cards
  const [visibleServiceCards, setVisibleServiceCards] = useState(1);

  // State for deal of the day
  const [deals, setDeals] = useState<any[]>([]);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const [deal, setDeal] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [formattedTime, setFormattedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // State for banners slideshow
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // Service cards data
  const serviceCards = [
    {
      id: 1,
      title: "Express Delivery",
      description: "Fast and reliable delivery across Nigeria.",
      icon: "/truck.png"
    },
    {
      id: 2,
      title: "Pay in Crypto",
      description: "Securely pay with Bitcoin, Ethereum, and more",
      icon: "/icon1.png"
    },
    {
      id: 3,
      title: "Fuss free return",
      description: "Easy returns, no stress.",
      icon: "/icon2.png"
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "We are here to help anytime",
      icon: "/icon3.png"
    }
  ];
  
  // Customer reviews data
  const customerReviews = [
    {
      name: "Aisha O., Lagos",
      avatar: "/customer-avatar.png",
      rating: 5,
      review:"I bought my first smartphone from Bitgadgetz and the experience was amazing. The delivery was fast and the phone was exactly as described. I will definitely order again!"
      ,
      date: "August 14, 2025"
    },
    {
      name: "Tunde K., Abuja",
      avatar: "/customer-avatar2.png",
      rating: 5,
      review:  "Swapping my old phone was so easy and safe. Bitgadgetz made the whole process stress-free, and their customer support was very helpful whenever I had questions.",
      date: "September 2, 2025"
    },
    {
      name: "Chinwe A., Enugu",
      avatar: "/customer-avatar3.png",
      rating: 5,
      review: "I love that I could pay with crypto. The process was simple and secure, and my gadget arrived quickly. Bitgadgetz is now my go-to store for gadgets!",
      date: "September 15, 2025"
    },
    {
      name: "Emeka J., Port Harcourt",
      avatar: "/customer-avatar4.png",
      rating: 5,
      review:  "The team at Bitgadgetz really cares about their customers. They guided me through choosing the right phone and even helped me track my device till it got delivered. Highly recommended!",
      date: "October 1, 2023"
    }
  ];

  // Animation effect for top phones (every 5 seconds)
  useEffect(() => {
    const topInterval = setInterval(() => {
      setTopSwitched(prev => !prev);
    }, 5000);

    return () => clearInterval(topInterval);
  }, []);

  // Customer review rotation effect (every 5 seconds)
  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % customerReviews.length);
    }, 5000); // 5 seconds = 5,000 milliseconds

    return () => clearInterval(reviewInterval);
  }, [customerReviews.length]);

  // Animation effect for side items (every 5 seconds)
  useEffect(() => {
    const sidesInterval = setInterval(() => {
      setSidesSwitched(prev => !prev);
    }, 5000);

    return () => clearInterval(sidesInterval);
  }, []);

  // Animation effect for bottom item (every 5 seconds)
  useEffect(() => {
    const bottomInterval = setInterval(() => {
      setBottomSwitched(prev => !prev);
    }, 5000);

    return () => clearInterval(bottomInterval);
  }, []);

  // Responsive service cards effect
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 375) {
        setVisibleServiceCards(1); // iPhone SE and smaller
      } else if (width <= 430) {
        setVisibleServiceCards(2); // iPhone 14 Pro Max
      } else if (width <= 768) {
        setVisibleServiceCards(3); // Tablet
      } else {
        setVisibleServiceCards(4); // Desktop
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch current deal
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const data = await publicApiRequest<DealResponse>(API_CONFIG.ENDPOINTS.PRODUCTS_CURRENT_DEAL);
        
        // Handle new API response format (deals array)
        if (data.deals && data.deals.length > 0) {
          setDeals(data.deals);
          setCurrentDealIndex(0);
          const firstDeal = data.deals[0];
          setDeal(firstDeal);
          console.log('Deal image:', firstDeal.deal_image);
          console.log('Product data main image:', firstDeal.product_data?.main_image);
          
          // Calculate time remaining if available
          if (firstDeal.end_time) {
            const endTime = new Date(firstDeal.end_time).getTime();
            const now = new Date().getTime();
            const remaining = Math.max(0, endTime - now);
            setTimeRemaining(remaining);
          }
        } 
        // Handle old API response format (single deal)
        else if (data.deal) {
          setDeal(data.deal);
          setDeals([data.deal]);
          setCurrentDealIndex(0);
          setTimeRemaining(data.time_info?.time_remaining || 0);
        } 
        else {
          setDeal(null);
          setDeals([]);
        }
      } catch (error) {
        console.error('Failed to fetch deal:', error);
        setDeal(null);
        setDeals([]);
      }
    };

    fetchDeal();
  }, []);

  // Handle deal slideshow navigation
  const goToNextDeal = () => {
    if (deals.length === 0) return;
    const nextIndex = (currentDealIndex + 1) % deals.length;
    setCurrentDealIndex(nextIndex);
    setDeal(deals[nextIndex]);
    
    if (deals[nextIndex].end_time) {
      const endTime = new Date(deals[nextIndex].end_time).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
    }
  };

  const goToPrevDeal = () => {
    if (deals.length === 0) return;
    const prevIndex = (currentDealIndex - 1 + deals.length) % deals.length;
    setCurrentDealIndex(prevIndex);
    setDeal(deals[prevIndex]);
    
    if (deals[prevIndex].end_time) {
      const endTime = new Date(deals[prevIndex].end_time).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
    }
  };

  // Auto-rotate deals every 5 seconds
  useEffect(() => {
    if (deals.length <= 1) return;
    
    const autoRotateInterval = setInterval(() => {
      setCurrentDealIndex(prev => {
        const nextIndex = (prev + 1) % deals.length;
        setDeal(deals[nextIndex]);
        
        if (deals[nextIndex].end_time) {
          const endTime = new Date(deals[nextIndex].end_time).getTime();
          const now = new Date().getTime();
          const remaining = Math.max(0, endTime - now);
          setTimeRemaining(remaining);
        }
        
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(autoRotateInterval);
  }, [deals]);

  

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining]);

  // Update formatted time
  useEffect(() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    setFormattedTime({ hours, minutes, seconds });
  }, [timeRemaining]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await publicApiRequest<any>(API_CONFIG.ENDPOINTS.BANNERS_ACTIVE);
        // New response structure: { banners: { hero: [...], ... }, total_banners, banner_types }
        const heroBanners = data?.banners?.hero || [];
        const items = Array.isArray(heroBanners) ? heroBanners : [];
        setBanners(items);
      } catch (error: any) {
        console.error('Failed to load banners:', error);
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const autoRotateInterval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(autoRotateInterval);
  }, [banners]);

  // Handle banner click - navigate to product_url
  const handleBannerClick = () => {
    const banner = banners[currentBannerIndex];
    if (banner?.product_url) {
      navigate(banner.product_url);
      return;
    }
    // Default to all products if no URL specified
    navigate('/all-products');
  };

  // Handle buy now - navigate to product details or cta_url_display
  const handleBuyNow = () => {
    // First priority: use cta_url_display from new API response
    if (deal?.cta_url_display) {
      navigate(deal.cta_url_display);
      return;
    }

    // Fallback: construct URL from product data (old API compatibility)
    const productId = deal?.product || deal?.product?.id;
    if (!productId) {
      showError('Error', 'Product ID not found');
      return;
    }

    // Get product slug for URL
    const productSlug = deal?.product_data?.slug || deal?.product?.slug || 'product';
    
    // Navigate to product details page
    navigate(`/product/${productId}/${productSlug}`);
  };

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Buy Gadgets with<br />
              <span className="crypto-text">Crypto</span> & <span className="naira-text">Naira</span>
            </h1>
            <p className="hero-description">
            ​​Bitgadgetz is your trusted online gadget store in Nigeria. Buy new gadgets, swap phones, track lost devices & enjoy secure shopping with fast delivery.

            </p>
            <Link to="/home" className="shop-now-btn">
              Shop Now
            </Link>
          </div>

          <div className="hero-products">
            {/* Inner white circle */}
            <div className="inner-white-circle"></div>

            {/* Thick green line between top phones */}
            <div className="top-green-line"></div>

            {/* Top center - Single phone (rotates with other products) */}
            <div className="product-item phone-2">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/earpod.png.png" :
                  topSwitched && sidesSwitched ? "/laptop1.png" :
                  topSwitched && bottomSwitched ? "/Apple.png" :
                  sidesSwitched && bottomSwitched ? "/phone1.png" :
                  topSwitched ? "/Apple.png" :
                  sidesSwitched ? "/laptop1.png" :
                  bottomSwitched ? "/earpod.png.png" :
                  "/phone1.png"
                }
                alt="Product"
              />
            </div>

            {/* Left side - Laptop (rotates with other products) */}
            <div className="product-item laptop">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/phone1.png" :
                  topSwitched && sidesSwitched ? "/Apple.png" :
                  topSwitched && bottomSwitched ? "/laptop1.png" :
                  sidesSwitched && bottomSwitched ? "/earpod.png.png" :
                  topSwitched ? "/laptop1.png" :
                  sidesSwitched ? "/Apple.png" :
                  bottomSwitched ? "/phone1.png" :
                  "/laptop1.png"
                }
                alt="Product"
              />
            </div>

            {/* Center - Watches */}
            <div className="product-item watch-group">
              <img src="/phonewatch1.png" alt="Smartwatch" className="watch-1" />
              <img src="/phonewatch2.png" alt="Smartwatch" className="watch-2" />
            </div>

            {/* Right side - Apple product (rotates with other products) */}
            <div className="product-item phone-3">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/laptop1.png" :
                  topSwitched && sidesSwitched ? "/phone1.png" :
                  topSwitched && bottomSwitched ? "/earpod.png.png" :
                  sidesSwitched && bottomSwitched ? "/Apple.png" :
                  topSwitched ? "/phone1.png" :
                  sidesSwitched ? "/earpod.png.png" :
                  bottomSwitched ? "/laptop1.png" :
                  "/Apple.png"
                }
                alt="Product"
              />
            </div>

            {/* Bottom - Headphones (rotates with other products) */}
            <div className="product-item headphone">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/Apple.png" :
                  topSwitched && sidesSwitched ? "/earpod.png.png" :
                  topSwitched && bottomSwitched ? "/phone1.png" :
                  sidesSwitched && bottomSwitched ? "/laptop1.png" :
                  topSwitched ? "/earpod.png.png" :
                  sidesSwitched ? "/phone1.png" :
                  bottomSwitched ? "/Apple.png" :
                  "/earpod.png.png"
                }
                alt="Product"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Service Section */}
      <section className="our-service-section">
        <div className="our-service-features">
          {serviceCards.slice(0, visibleServiceCards).map((card) => (
            <div key={card.id} className="our-service-feature-item">
              <div className="our-service-feature-icon">
                <img src={card.icon} alt={card.title} className="truck-icon" />
              </div>
              <div className="our-service-feature-text">
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About BitGadgetz Section */}
      <section className="our-story-section">
        <div className="our-story-container">
          <h2><span className="highlight">About</span> <span className="brand-name">BitGadgetz</span></h2>

          <div className="story-content">
            <div className="story-image">
              <img src="/ourstory.png" alt="About BitGadgetz" />
            </div>

            <div className="story-text">
              <div className="story-paragraph">
                <p>Founded in 2025, BitGadgetz started with a simple mission: to make authentic, high-quality tech gadgets accessible to everyone in Nigeria. What began as a small online shop has grown into the country's most trusted tech retailer.</p>
              </div>

              <div className="story-paragraph">
                <p>We recognized the challenges Nigerians faced when trying to buy genuine tech products - from fake or counterfeit goods to unreliable delivery. That's why we built BitGadgetz with authenticity, reliability, and customer satisfaction at its core.</p>
              </div>

              <div className="story-paragraph">
                <p>Today, we're proud to serve over 10,000 satisfied customers across Nigeria, offering everything from the latest smartphones to cutting-edge laptops, all with the convenience of cryptocurrency payments.</p>
              </div>

              <div className="story-actions">
                <Link to="/about" className="learn-more-btn">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BitGadgetz Section */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2>Why Choose <span className="highlight">BitGadgetz</span>?</h2>
          <p>We are always available to answer questions and guide you through your orders.</p>

          <div className="why-choose-features">
            <div className="why-feature-item">
              <div className="why-feature-icon">
                <CreditCard size={48} color="#00D4AA" />
              </div>
              <div className="why-feature-text">
                <h4>Flexible Payments</h4>
                <p>Pay with cryptocurrency or Naira, whichever suits you best.</p>
              </div>
            </div>

            <div className="why-feature-item">
              <div className="why-feature-icon">
                <Shield size={48} color="#00D4AA" />
              </div>
              <div className="why-feature-text">
                <h4>Authentic Products</h4>
                <p>All our products are 100% genuine with manufacturer warranty.</p>
              </div>
            </div>

            <div className="why-feature-item">
              <div className="why-feature-icon">
                <Headphones size={48} color="#00D4AA" />
              </div>
              <div className="why-feature-text">
                <h4>24/7 Customer Support</h4>
                <p>Get quick responses to all your queries via WhatsApp or Telegram.</p>
              </div>
            </div>

            <div className="why-feature-item">
              <div className="why-feature-icon">
                <Truck size={48} color="#00D4AA" />
              </div>
              <div className="why-feature-text">
                <h4>Fast & Reliable Delivery</h4>
                <p>Get quick responses to all your queries via WhatsApp or Telegram.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="what-we-offer-section">
        <div className="what-we-offer-container">
          <h2>What We Offer</h2>
          <p>Discover our comprehensive range of services designed to meet all your tech needs.</p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <Smartphone size={48} color="#6ee7b7" />
              </div>
              <h3>Gadget Sales</h3>
              <p>We've got the latest phones, smartwatches, and accessories you need, all original and available at great prices. Whether you're buying something new or replacing an old device, we've got you covered.</p>
              <Link to="/products" className="service-link">Check out our gadgets →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <RefreshCw size={48} color="#6ee7b7" />
              </div>
              <h3>Phone Swap and Trade In</h3>
              <p>Tired of your old phone? You can bring it to us and get a newer one at a discounted price. We'll check the condition, give you a fair value, and help you upgrade on the spot.</p>
              <Link to="/service" className="service-link">Start a phone swap →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <MapPin size={48} color="#6ee7b7" />
              </div>
              <h3>Phone Tracking Support</h3>
              <p>If you ever lose your phone, we're here to help. We support you with tracking options and guidance so you have a better chance of recovering your device. This service is available for devices bought from us.</p>
              <Link to="/service" className="service-link">Get help with tracking →</Link>
            </div>
          </div>

          <div className="what-we-offer-actions">
            <Link to="/service" className="learn-more-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Deal of the Day Banner */}
      {deal && deals.length > 0 && (
        <section className="deal-banner">
          <div className="deal-banner-container">
            {/* Left Section - Product Image */}
            <div className="deal-banner-left">
              <img 
                src={deal.deal_image || deal.product?.main_image || deal.product_data?.main_image || 'https://via.placeholder.com/300x300?text=Deal'} 
                alt={deal.title || deal.product?.name || deal.product_data?.name} 
                className="deal-product-image"
                onError={(e) => {
                  console.log('Image failed to load');
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Deal';
                }}
              />
            </div>

            {/* Right Section - Product Details */}
            <div className="deal-banner-right">
              <div className="deal-tag">Deal of the Day</div>

              <div className="deal-product-info">
                <div className="deal-title-timer-pricing-row">
                  <div className="deal-left-section">
                    <h2 className="deal-product-title">
                      {deal.title || deal.product?.name || deal.product_data?.name}<br />
                      <span className="deal-title-highlight">{deal.subtitle || 'Limited Time'}</span>
                    </h2>

                    <p className="deal-product-description">
                      {deal.deal_description || 'Limited time offer on premium products.'}
                    </p>
                  </div>

                  <div className="deal-right-section">
                    <div className="deal-offer-timer">
                      <span className="deal-timer-label">Offer ends in:</span>
                      <div className="deal-countdown">
                        <div className="deal-time-box">
                          <span className="deal-time-number">{formattedTime.hours.toString().padStart(2, '0')}</span>
                          <span className="deal-time-label">Hours</span>
                        </div>
                        <div className="deal-time-box">
                          <span className="deal-time-number">{formattedTime.minutes.toString().padStart(2, '0')}</span>
                          <span className="deal-time-label">Minutes</span>
                        </div>
                        <div className="deal-time-box">
                          <span className="deal-time-number">{formattedTime.seconds.toString().padStart(2, '0')}</span>
                          <span className="deal-time-label">Seconds</span>
                        </div>
                      </div>
                    </div>

                    <div className="deal-pricing">
                      <div className="deal-current-price">₦{parseFloat(deal.deal_price).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                      <div className="deal-original-price">₦{parseFloat(deal.original_price).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                      <div className="deal-crypto-price">{parseFloat(deal.deal_price_usdt).toFixed(2)} USDT</div>
                    </div>
                  </div>
                </div>

                { (deal.external_url || deal.product?.external_url) ? (
                  <a
                    className="deal-buy-now-btn shop-now-btn"
                    href={(deal.external_url || deal.product?.external_url) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                ) : (
                  <button
                    className="deal-buy-now-btn"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                )}
              
              </div>
            </div>

            {/* Navigation Buttons and Indicators - Show only if multiple deals */}
            {deals.length > 1 && (
              <>
                {/* Previous Button */}
                <button 
                  className="deal-carousel-btn deal-carousel-prev"
                  onClick={goToPrevDeal}
                  aria-label="Previous deal"
                >
                  ‹
                </button>

                {/* Next Button */}
                <button 
                  className="deal-carousel-btn deal-carousel-next"
                  onClick={goToNextDeal}
                  aria-label="Next deal"
                >
                  ›
                </button>

                {/* Slide Indicators */}
                <div className="deal-carousel-indicators">
                  {deals.map((_, index) => (
                    <button
                      key={index}
                      className={`deal-carousel-dot ${index === currentDealIndex ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentDealIndex(index);
                        setDeal(deals[index]);
                        
                        if (deals[index].end_time) {
                          const endTime = new Date(deals[index].end_time).getTime();
                          const now = new Date().getTime();
                          const remaining = Math.max(0, endTime - now);
                          setTimeRemaining(remaining);
                        }
                      }}
                      aria-label={`Go to deal ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* What Our Customers Say Section */}
      <section className="customers-say-section">
        <div className="customers-say-container">
          <h2>What Our Customers Say</h2>
          <p>Don't just take our word for it. Here's what our customers have to say about their experience with BitGadgetz.</p>

          <div className="testimonial-card">
            <div className="customer-profile">
              <div className="customer-avatar">
                <img src={customerReviews[currentReviewIndex].avatar} alt={customerReviews[currentReviewIndex].name} />
              </div>
              <div className="customer-info">
                <h4>{customerReviews[currentReviewIndex].name}</h4>
                <div className="rating">
                  {Array.from({ length: customerReviews[currentReviewIndex].rating }, (_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="testimonial-content">
              <p>"{customerReviews[currentReviewIndex].review}"</p>
              <span className="testimonial-date">{customerReviews[currentReviewIndex].date}</span>
            </div>
          </div>

          <div className="testimonial-pagination">
            {customerReviews.map((_, index) => (
              <div
                key={index}
                className={`pagination-dot ${index === currentReviewIndex ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Thousands Section */}
      <section className="trusted-section">
        <div className="trusted-container">
          <h2>Trusted by Thousands</h2>
          <p>Join our growing community of satisfied customers</p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Customers</div>
              </div>

            <div className="stat-card">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Average Rating</div>
              </div>

            <div className="stat-card">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <span className="checkmark">✓</span>
              <span>Verified Reviews</span>
            </div>

            <div className="trust-badge">
              <span className="checkmark">✓</span>
              <span>Authentic Products</span>
            </div>

            <div className="trust-badge">
              <span className="checkmark">✓</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

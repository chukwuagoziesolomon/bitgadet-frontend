import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, MapPin, RefreshCw, Target, Eye, Headphones, Shield, Truck, CreditCard, RotateCcw, Clock, TruckIcon, Zap } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  // State for animation switches
  const [topSwitched, setTopSwitched] = useState(false);
  const [sidesSwitched, setSidesSwitched] = useState(false);
  const [bottomSwitched, setBottomSwitched] = useState(false);
  
  // State for customer reviews rotation
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  
  // State for responsive service cards
  const [visibleServiceCards, setVisibleServiceCards] = useState(1);
  
  // Service cards data
  const serviceCards = [
    {
      id: 1,
      title: "Express Delivery",
      description: "We have thousands of ATMs located across the U.S. wh",
      icon: "/truck.png"
    },
    {
      id: 2,
      title: "Pay in Crypto",
      description: "We have thousands of ATMs located across the U.S. wh",
      icon: "/truck.png"
    },
    {
      id: 3,
      title: "Fuss free return",
      description: "We have thousands of ATMs located across the U.S. wh",
      icon: "/truck.png"
    },
    {
      id: 4,
      title: "24/7 Support",
      description: "We have thousands of ATMs located across the U.S. wh",
      icon: "/truck.png"
    }
  ];
  
  // Customer reviews data
  const customerReviews = [
    {
      name: "Chioma A.",
      avatar: "/customer-avatar.png",
      rating: 5,
      review: "BitGadgetz delivered my iPhone 14 Pro Max in perfect condition and the crypto payment process was seamless. Highly recommend!",
      date: "August 14, 2023"
    },
    {
      name: "Emeka O.",
      avatar: "/customer-avatar2.png",
      rating: 5,
      review: "Amazing service! Got my MacBook Pro delivered within 24 hours. The quality is top-notch and the customer support is excellent.",
      date: "September 2, 2023"
    },
    {
      name: "Fatima K.",
      avatar: "/customer-avatar3.png",
      rating: 5,
      review: "Best tech store in Nigeria! Their phone swap service saved me so much money. The team is professional and trustworthy.",
      date: "September 15, 2023"
    },
    {
      name: "David M.",
      avatar: "/customer-avatar4.png",
      rating: 5,
      review: "Crypto payments made everything so easy. No bank issues, no delays. BitGadgetz has changed how I buy tech gadgets!",
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

  // Customer review rotation effect (every 3 minutes)
  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % customerReviews.length);
    }, 180000); // 3 minutes = 180,000 milliseconds

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
              BitGadgetz is a modern eCommerce platform that sells gadgets and accessories with crypto and Naira payment options.
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
                <p>Founded in 2019, BitGadgetz started with a simple mission: to make authentic, high-quality tech gadgets accessible to everyone in Nigeria. What began as a small online shop has grown into the country's most trusted tech retailer.</p>
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
          <p>We're not just another electronics store. Here's what makes us different.</p>

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
      <section className="deal-banner">
        <div className="deal-banner-container">
          {/* Left Section - Product Image */}
          <div className="deal-banner-left">
            <div className="discount-badge">-30% OFF</div>
            <img src="/salesoff.png" alt="Premium Wireless Headphones" className="deal-product-image" />
            </div>

          {/* Right Section - Product Details */}
          <div className="deal-banner-right">
            <div className="deal-tag">Deal of the Day</div>
            
            <div className="deal-product-info">
              <div className="deal-title-timer-pricing-row">
                <div className="deal-left-section">
                  <h2 className="deal-product-title">
                Premium Wireless<br />
                    <span className="deal-title-highlight">Headphones</span>
              </h2>
              
                  <p className="deal-product-description">
                    Experience crystal clear sound with noise<br />
                    cancellation technology and 40-hour battery life.
              </p>
            </div>

                <div className="deal-right-section">
                  <div className="deal-offer-timer">
                    <span className="deal-timer-label">Offer ends in:</span>
                    <div className="deal-countdown">
                      <div className="deal-time-box">
                        <span className="deal-time-number">23</span>
                        <span className="deal-time-label">Hours</span>
                      </div>
                      <div className="deal-time-box">
                        <span className="deal-time-number">46</span>
                        <span className="deal-time-label">Minutes</span>
                      </div>
                      <div className="deal-time-box">
                        <span className="deal-time-number">51</span>
                        <span className="deal-time-label">Seconds</span>
                      </div>
                    </div>
                  </div>

                  <div className="deal-pricing">
                    <div className="deal-current-price">₦75,000</div>
                    <div className="deal-original-price">₦105,000</div>
                    <div className="deal-crypto-price">40.00 USDT</div>
                  </div>
              </div>
            </div>

              <button className="deal-buy-now-btn">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

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
                onClick={() => setCurrentReviewIndex(index)}
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

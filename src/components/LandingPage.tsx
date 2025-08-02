import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, MapPin, RefreshCw, Target, Eye, Headphones, Shield } from 'lucide-react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  // State for animation switches
  const [topSwitched, setTopSwitched] = useState(false);
  const [sidesSwitched, setSidesSwitched] = useState(false);
  const [bottomSwitched, setBottomSwitched] = useState(false);

  // Animation effect for top phones (every 5 seconds)
  useEffect(() => {
    const topInterval = setInterval(() => {
      setTopSwitched(prev => !prev);
    }, 5000);

    return () => clearInterval(topInterval);
  }, []);

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

  return (
    <div className="landing-page">
      {/* Standalone Header for Landing Page */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="landing-logo">
            <img src="/logo.png" alt="BitGadgetz Logo" className="logo-image" />
          
          </div>
          <Link to="/home" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </header>

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
                  topSwitched && sidesSwitched ? "/laptop1.png" :
                  topSwitched ? "/Apple.png" :
                  "/phone1.png"
                }
                alt={
                  topSwitched && sidesSwitched ? "Laptop" :
                  topSwitched ? "Apple Product" :
                  "Phone"
                }
              />
            </div>

            {/* Left side - Laptop (rotates with Phone, Apple and Earbuds) */}
            <div className="product-item laptop">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/phone1.png" :
                  sidesSwitched && bottomSwitched ? "/earpod.png.png" :
                  sidesSwitched ? "/Apple.png" :
                  "/laptop1.png"
                }
                alt={
                  topSwitched && sidesSwitched && bottomSwitched ? "Phone" :
                  sidesSwitched && bottomSwitched ? "Earbuds" :
                  sidesSwitched ? "Apple Product" :
                  "Laptop"
                }
              />
            </div>

            {/* Center - Watches */}
            <div className="product-item watch-group">
              <img src="/phonewatch1.png" alt="Smartwatch" className="watch-1" />
              <img src="/phonewatch2.png" alt="Smartwatch" className="watch-2" />
            </div>

            {/* Right side - Apple product (rotates with Phone, Laptop and Earbuds) */}
            <div className="product-item phone-3">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/Apple.png" :
                  sidesSwitched && bottomSwitched ? "/laptop1.png" :
                  sidesSwitched ? "/earpod.png.png" :
                  "/Apple.png"
                }
                alt={
                  topSwitched && sidesSwitched && bottomSwitched ? "Apple Product" :
                  sidesSwitched && bottomSwitched ? "Laptop" :
                  sidesSwitched ? "Earbuds" :
                  "Apple Product"
                }
              />
            </div>

            {/* Bottom - Headphones (rotates with Phone, Laptop and Apple) */}
            <div className="product-item headphone">
              <img
                src={
                  topSwitched && sidesSwitched && bottomSwitched ? "/earpod.png.png" :
                  sidesSwitched && bottomSwitched ? "/Apple.png" :
                  sidesSwitched ? "/laptop1.png" :
                  "/earpod.png.png"
                }
                alt={
                  topSwitched && sidesSwitched && bottomSwitched ? "Earbuds" :
                  sidesSwitched && bottomSwitched ? "Apple Product" :
                  sidesSwitched ? "Laptop" :
                  "Earbuds"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Service Section */}
      <section className="our-service-section">
        <div className="our-service-container">
          <h2>Our Service</h2>
          <p>At BitGadgetz, we're not just here to sell gadgets. We're here to help you get the best tech experience with services that make things easy, affordable, and stress-free.</p>
          <Link to="/products" className="browse-products-btn">
            Browse Our Products
          </Link>
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
              <p>We've got all the latest phones, smartwatches, and accessories you need, all original and hundreds of great prices. Whether you're looking for the newest iPhone or Android device, we've got you covered.</p>
              <Link to="/products" className="service-link">Check out our gadgets →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <RefreshCw size={48} color="#6ee7b7" />
              </div>
              <h3>Phone Swap and Trade In</h3>
              <p>Tired of your old phone? You can bring it in as well get a newer one at a discounted price. We'll check the condition, give you a fair quote, and help you get your new device on the spot.</p>
              <Link to="/service" className="service-link">Start a phone swap →</Link>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <MapPin size={48} color="#6ee7b7" />
              </div>
              <h3>Phone Tracking Support</h3>
              <p>If you ever lost or misplaced your phone, we're here to help. We support you with tracking options and guidance so you have a better chance of finding your device. This service is also available for devices bought from us.</p>
              <Link to="/service" className="service-link">Get help with tracking →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BitGadgetz Section */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <h2>Why Choose BitGadgetz?</h2>
          <p>We're committed to providing exceptional service and value to our customers.</p>

          <div className="why-choose-features">
            <div className="why-feature-item">
              <img src="/fasticon.png" alt="Express Delivery" className="why-feature-icon" />
              <div className="why-feature-text">
                <h4>Express Delivery</h4>
                <p>Fast and reliable delivery to your doorstep</p>
              </div>
            </div>

            <div className="why-feature-item">
              <img src="/fasticon.png" alt="Pay in Crypto" className="why-feature-icon" />
              <div className="why-feature-text">
                <h4>Pay in Crypto</h4>
                <p>Accept Bitcoin and other cryptocurrencies</p>
              </div>
            </div>

            <div className="why-feature-item">
              <img src="/fasticon.png" alt="Fuss free return" className="why-feature-icon" />
              <div className="why-feature-text">
                <h4>Fuss free return</h4>
                <p>Easy returns and exchanges within 30 days</p>
              </div>
            </div>

            <div className="why-feature-item">
              <img src="/fasticon.png" alt="24/7 Support" className="why-feature-icon" />
              <div className="why-feature-text">
                <h4>24/7 Support</h4>
                <p>Round-the-clock customer support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Need Immediate Assistance Section */}
      <section className="assistance-section">
        <div className="assistance-container">
          <h2>Need Immediate Assistance?</h2>
          <p>Our WhatsApp support team is available 24/7 to help you with your needs.</p>
          <Link to="/contact" className="whatsapp-btn">
            Chat on WhatsApp
          </Link>
        </div>
      </section>

      {/* About BitGadgetz Section */}
      <section className="about-bitgadgetz-section">
        <div className="about-bitgadgetz-container">
          <h2>About BitGadgetz</h2>
          <p>We're here to help! Reach out to us through any of these channels.</p>
          <Link to="/contact" className="worldwide-support-btn">
            24/7 Worldwide Support Available
          </Link>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="our-story-container">
          <h2>Our Story</h2>

          <div className="story-content">
            <div className="story-image">
              <img src="/our story.png" alt="BitGadgetz Story" />
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
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="mission-vision-section">
        <div className="mission-vision-container">
          <div className="mission-card">
            <div className="mission-icon">
              <Target size={48} color="#6ee7b7" />
            </div>
            <h3>Our Mission</h3>
            <p>To democratize access to authentic technology products in Nigeria by providing a reliable, secure, and convenient platform that accepts both traditional and cryptocurrency payments.</p>
          </div>

          <div className="vision-card">
            <div className="vision-icon">
              <Eye size={48} color="#6ee7b7" />
            </div>
            <h3>Our Vision</h3>
            <p>To become Africa's leading technology retailer, known for authenticity, innovation, and exceptional customer service, while pioneering the adoption of cryptocurrency in everyday purchases.</p>
          </div>
        </div>
      </section>

      {/* Why Choose BitGadgetz Section */}
      <section className="about-why-choose-section">
        <div className="about-why-choose-container">
          <h2>Why Choose BitGadgetz?</h2>
          <p>We're not just another electronics store. Here's what makes us different.</p>

          <div className="about-features-grid">
            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Smartphone size={20} color="white" />
              </div>
              <div className="about-feature-content">
                <h4>Fast & Reliable Delivery</h4>
                <p>Quick delivery across Nigeria with real-time tracking. Lagos delivery in 1-2 days, nationwide in 3-5 days.</p>
              </div>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Shield size={20} color="white" />
              </div>
              <div className="about-feature-content">
                <h4>Authenticity Guaranteed</h4>
                <p>Every product we sell is 100% authentic and comes with manufacturer warranty. We source directly from authorized distributors.</p>
              </div>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">
                <Headphones size={20} color="white" />
              </div>
              <div className="about-feature-content">
                <h4>24/7 Customer Support</h4>
                <p>Our dedicated support team is always ready to help via WhatsApp, email, or phone. Your satisfaction is our priority.</p>
              </div>
            </div>

            <div className="about-feature-card">
              <div className="about-feature-icon">
                <RefreshCw size={20} color="white" />
              </div>
              <div className="about-feature-content">
                <h4>Flexible Payment Options</h4>
                <p>Pay with Naira via bank transfer, cards, or cryptocurrency (Bitcoin & Ethereum). Secure and convenient.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

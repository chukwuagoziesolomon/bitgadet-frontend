import React from 'react';
import { 
  Target, 
  Heart, 
  Truck, 
  Shield, 
  Headphones, 
  CreditCard,
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2
} from 'lucide-react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About BitGadgetz</h1>
          <p>We're here to help! Reach out to us through any of these channels.</p>
          <button className="whatsapp-support-btn">
            24/7 WhatsApp Support Available
          </button>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="container">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <div className="story-graphic">
              <div className="gadgets-illustration">
                <img src="/ourstory.png" alt="Our Story" className="story-image" />
              </div>
            </div>
            <div className="story-text">
              <p>
                Founded in 2019, BitGadgetz started with a simple mission: to make authentic, high-quality 
                tech gadgets accessible to everyone in Nigeria. What began as a small online store has grown 
                into the country's most trusted electronics retailer.
              </p>
              <p>
                We recognized the challenges Nigerians faced when trying to purchase genuine tech products - 
                from counterfeit goods to unreliable delivery. That's why we built BitGadgetz with authenticity, 
                reliability, and customer satisfaction at its core.
              </p>
              <p>
                Today, we're proud to serve over 10,000 satisfied customers across Nigeria, offering everything 
                from the latest smartphones to cutting-edge laptops, all with flexible payment options including 
                cryptocurrency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">
                <Target size={32} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To democratize access to authentic technology products in Nigeria by providing a reliable, 
                secure, and convenient platform that accepts both traditional and cryptocurrency payments.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <Heart size={32} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become Africa's leading technology retailer, known for authenticity, innovation, and 
                exceptional customer service, while pioneering the adoption of cryptocurrency in everyday commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose BitGadgetz?</h2>
          <p className="section-subtitle">
            We're not just another electronics store. Here's what makes us different.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Truck size={24} />
              </div>
              <div className="feature-content">
                <h3>Fast & Reliable Delivery</h3>
                <p>
                  Quick delivery across Nigeria with real-time tracking. Lagos deliveries in 1-2 days, nationwide in 2-5 days.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <div className="feature-content">
                <h3>Authenticity Guaranteed</h3>
                <p>
                  Every product we sell is 100% authentic and comes with manufacturer warranty. We source directly from authorized distributors.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Headphones size={24} />
              </div>
              <div className="feature-content">
                <h3>24/7 Customer Support</h3>
                <p>
                  Our dedicated support team is always ready to help via WhatsApp, email, or phone. Your satisfaction is our priority.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <CreditCard size={24} />
              </div>
              <div className="feature-content">
                <h3>Flexible Payment Options</h3>
                <p>
                  Pay with Naira via bank transfer, cards, or cryptocurrency (Bitcoin & Ethereum). Secure and convenient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

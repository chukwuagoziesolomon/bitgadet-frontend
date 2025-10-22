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
              Bitgadgetz was founded in 2025 with a simple mission to build a trusted gadget store in Nigeria where people could buy and swap gadgets 
              without the fear of scams, fake products, or bad deals. We had all seen the struggles, friends losing money to counterfeit phones, 
              unreliable swaps, and sellers who could not deliver on their promises. We came together to create a better solution.

              </p>
              <p>
              What started small, helping people around us find genuine smartphones, guiding safe phone swaps, and making sure buyers got
               what they paid for, quickly grew into something bigger. We realized that Nigerians needed more than just another online shop. 
               They needed an online gadget store built on authenticity, convenience, and trust.

              </p>
              <p>
              That is how Bitgadgetz took shape. Today, we specialize in gadget sales, phone swapping, and phone tracking services,
               giving people across Nigeria peace of mind when shopping for technology. We are still a young startup, but our focus 
               remains clear, to make gadget shopping simple, safe, and reliable for everyone.

              </p>
              <p>
              Every order we fulfill and every customer we serve brings us closer to our vision of becoming Nigeria's most reliable gadget store.
               This is only the beginning, and we are excited to grow Bitgadgetz into a platform that truly changes how people buy, swap, and track gadgets in Nigeria.
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
              Our mission is to make buying, swapping, and tracking gadgets in Nigeria simple, safe, and reliable.
               We aim to provide authentic products, trustworthy services, and a seamless online experience so that every customer can enjoy technology without stress.

              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">
                <Heart size={32} />
              </div>
              <h3>Our Vision</h3>
              <p>
              Our vision is to become Africa’s most trusted digital gadget store, known for reliability, authenticity,
               and excellent customer service. We aspire to transform how people across Africa buy, swap, and track gadgets by building a platform that they can truly rely on.

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

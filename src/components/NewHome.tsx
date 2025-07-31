import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import GadgetCarousel from './GadgetCarousel';
import './LandingPage.css';

const NewHome: React.FC = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the <span className="highlight">Best Tech</span> for Your Digital Life
          </h1>
          <p className="hero-subtitle">
            Explore our curated collection of premium gadgets and electronics at unbeatable prices.
            Free shipping on all orders over $50.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="primary-button">
              Shop Now <ArrowRight size={18} />
            </Link>
            <a href="#featured" className="secondary-button">
              Learn More <ChevronRight size={18} />
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">1K+</span>
              <span className="stat-label">Premium Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Customer Support</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <GadgetCarousel />
        </div>
      </section>

      {/* Featured Categories */}
      <section id="featured" className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/categories" className="view-all">View All Categories <ChevronRight size={16} /></Link>
        </div>
        
        <div className="category-grid">
          {[
            { name: 'Smartphones', icon: '📱', count: 256 },
            { name: 'Laptops', icon: '💻', count: 189 },
            { name: 'Headphones', icon: '🎧', count: 324 },
            { name: 'Smart Watches', icon: '⌚', count: 142 },
          ].map((category) => (
            <div key={category.name} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.count} items</p>
              <Link to={`/category/${category.name.toLowerCase()}`} className="category-link">
                Explore <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Get 15% Off Your First Order</h2>
          <p>Subscribe to our newsletter and get exclusive deals and updates</p>
          <div className="cta-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="primary-button">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHome;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Check, Truck, Shield, Headphones } from 'lucide-react';
import './Home.css';

interface StatItem {
  value: string;
  label: string;
  color: string;
}

interface FeatureItem {
  icon: React.ReactNode;
  text: string;
}

const Home: React.FC = () => {
  const stats: StatItem[] = [
    { value: '10K+', label: 'Happy Customers', color: '#10B981' },
    { value: '1K+', label: 'Premium Products', color: '#3B82F6' },
    { value: '24/7', label: 'Support', color: '#8B5CF6' },
  ];

  const features: FeatureItem[] = [
    { icon: <Truck size={20} />, text: 'Free Shipping' },
    { icon: <Shield size={20} />, text: 'Secure Payment' },
    { icon: <Check size={20} />, text: 'Quality Guarantee' },
    { icon: <Headphones size={20} />, text: '24/7 Support' },
  ];

  return (
    <div className="home">
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
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <h2 className="stats-title">Trusted by Thousands</h2>
          <p className="stats-subtitle">Join our growing community of satisfied customers</p>
          
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="features-badges">
            {features.map((feature, index) => (
              <div key={index} className="feature-badge">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

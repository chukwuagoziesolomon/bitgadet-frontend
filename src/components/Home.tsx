import React, { useState } from 'react';
import './Home.css';
import CategoryCard from './home/CategoryCard';
import ProductCard from './home/ProductCard';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  discount?: string;
  isNew: boolean;
  inStock: boolean;
}

// Temporary stub data until real API is available
const categories = [
  {
    id: 1,
    name: 'Phones',
    description: 'Latest smart phones and mobile devices.',
    items: 67,
    image: '/phone.png',
    iconType: 'phone',
  },
  {
    id: 2,
    name: 'Laptops',
    description: 'High-performance laptops and notebooks',
    items: 45,
    image: '/laptop.png',
    iconType: 'laptop',
  },
  {
    id: 3,
    name: 'Tablets',
    description: 'iPads, Android Tablets and e-Readers',
    items: 67,
    image: '/phone.png',
    iconType: 'tablet',
  },
  {
    id: 4,
    name: 'Games',
    description: 'Gaming consoles and accessories',
    items: 105,
    image: '/games.png',
    iconType: 'games',
  },
  {
    id: 5,
    name: 'Smartwatches',
    description: 'Smart wearables and fitness trackers',
    items: 78,
    image: '/watch.png',
    iconType: 'watch',
  },
  {
    id: 6,
    name: 'Accessories',
    description: 'Phone cases, chargers, and more',
    items: 67,
    image: '/headphone.png',
    iconType: 'accessories',
  },
];

const productData: { [key: string]: Product[] } = {
  featured: [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'APPLE',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/phone.png',
      rating: 4.5,
      reviews: 84,
      discount: '-12%',
      isNew: true,
      inStock: true
    },
    {
      id: 2,
      name: 'Play Station (PS) 5 Console',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      image: '/games.png',
      rating: 4.8,
      reviews: 64,
      discount: '-10%',
      isNew: false,
      inStock: false
    },
    {
      id: 3,
      name: 'Laptops Dell XPS 13 9360',
      brand: 'DELL',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      image: '/laptop.png',
      rating: 4.2,
      reviews: 84,
      discount: '-12%',
      isNew: false,
      inStock: true
    },
    {
      id: 4,
      name: 'Sony Smartwatch 15',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,000,000',
      image: '/watch.png',
      rating: 4.7,
      reviews: 64,
      discount: '-8%',
      isNew: true,
      inStock: true
    },
    {
      id: 5,
      name: 'Sony Headphones Pro',
      brand: 'SONY',
      price: '₦1,850,000',
      originalPrice: '₦2,000,000',
      image: '/headphone.png',
      rating: 4.9,
      reviews: 64,
      discount: '-8%',
      isNew: false,
      inStock: true
    }
  ],
  bestSellers: [
    {
      id: 6,
      name: 'MacBook Pro M3',
      brand: 'APPLE',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      image: '/laptop.png',
      rating: 4.9,
      reviews: 156,
      discount: '-11%',
      isNew: false,
      inStock: true
    }
  ],
  newArrivals: [
    {
      id: 7,
      name: 'iPhone 16 Pro Max',
      brand: 'APPLE',
      price: '₦2,200,000',
      image: '/phone.png',
      rating: 5.0,
      reviews: 23,
      isNew: true,
      inStock: true
    }
  ]
};

const testimonials = [
  {
    id: 1,
    name: 'Chioma A.',
    rating: 5,
    comment: 'BitGadgetz delivered my iPhone 14 Pro Max in perfect condition and the crypto payment process was seamless. Highly recommend!',
    date: 'August 14, 2023',
    avatar: '/avatar1.png'
  },
  {
    id: 2,
    name: 'David O.',
    rating: 5,
    comment: 'Amazing customer service and genuine products. Got my MacBook Pro within 24 hours of payment!',
    date: 'July 28, 2023',
    avatar: '/avatar2.png'
  },
  {
    id: 3,
    name: 'Sarah M.',
    rating: 5,
    comment: 'Best tech store in Nigeria! Quality products, fair prices, and excellent support team.',
    date: 'September 5, 2023',
    avatar: '/avatar3.png'
  }
];

const stats = [
  { label: 'Happy Customers', value: '10,000+', color: '#00c896' },
  { label: 'Average Rating', value: '4.9/5', color: '#00c896' },
  { label: 'Satisfaction Rate', value: '99%', color: '#00c896' },
  { label: 'Customer Support', value: '24/7', color: '#00c896' }
];

const features = [
  { text: 'Verified Reviews', icon: '✓' },
  { text: 'Authentic Products', icon: '✓' },
  { text: 'Secure Payments', icon: '✓' }
];

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestSellers' | 'newArrivals'>('featured');
  
  return (
    <main className="home-container">
      {/* Reserved space for future banner */}
      <section className="banner-placeholder"></section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">These categories have all kinds of components</p>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              image={cat.image}
              description={cat.description}
              items={cat.items}
              iconType={cat.iconType}
            />
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <h2 className="section-title">Our Products</h2>
        
        {/* Product Tabs */}
        <div className="product-tabs">
          <button 
            className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveTab('featured')}
          >
            Featured
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bestSellers' ? 'active' : ''}`}
            onClick={() => setActiveTab('bestSellers')}
          >
            Best Sellers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'newArrivals' ? 'active' : ''}`}
            onClick={() => setActiveTab('newArrivals')}
          >
            New Arrivals
          </button>
        </div>
        
        {/* Product Grid */}
        <div className="product-grid">
          {productData[activeTab].map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              brand={prod.brand}
              price={prod.price}
              originalPrice={prod.originalPrice}
              image={prod.image}
              rating={prod.rating}
              reviews={prod.reviews}
              discount={prod.discount}
              isNew={prod.isNew}
              inStock={prod.inStock}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">What Our Customers Say</h2>
          <p className="testimonials-subtitle">
            Don't just take our word for it. Here's what our customers have to say about their experience with BitGadgetz.
          </p>
          
          <div className="testimonial-slider">
            <div className="testimonial-card-new">
              <div className="testimonial-header">
                <img src="/avatar1.png" alt="Chioma A." className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Chioma A.</h4>
                  <div className="testimonial-stars">
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                    <span className="star filled">★</span>
                  </div>
                </div>
              </div>
              <p className="testimonial-comment">
                BitGadgetz delivered my iPhone 14 Pro Max in perfect condition and the crypto payment process was seamless. Highly recommend!
              </p>
              <div className="testimonial-date">August 14, 2023</div>
            </div>
            
            <div className="testimonial-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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
    </main>
  );
};

export default Home;

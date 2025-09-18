import React, { useState } from 'react';
import { Smartphone, Laptop, Gamepad2, Watch, Headphones } from 'lucide-react';
import ProductCard from './ProductCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');

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
    console.log('Added to cart:', productId);
  };

  const handleToggleWishlist = (productId: number) => {
    console.log('Toggled wishlist:', productId);
  };

  return (
    <div className="home-page">
      {/* Hero Section - Left blank for banner */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            {/* Banner content will be added here */}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <p className="section-subtitle">Discover our wide range of premium gadgets and accessories</p>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-image">
                <img src="/phone1.png" alt="Phones" />
                <div className="category-overlay">
                  <Smartphone className="category-icon" size={32} />
        </div>
            </div>
            <h3>Phones</h3>
              <p>Latest smart phones and mobile devices.</p>
              <div className="category-count">
              <span>67 items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src="/laptop1.png" alt="Laptops" />
                <div className="category-overlay">
                  <Laptop className="category-icon" size={32} />
                </div>
            </div>
            <h3>Laptops</h3>
            <p>High-performance laptops and notebooks</p>
              <div className="category-count">
                <span>45 items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
            
            <div className="category-card">
              <div className="category-image">
              <img src="/tablet.png" alt="Tablets" />
                <div className="category-overlay">
                  <Smartphone className="category-icon" size={32} />
                </div>
            </div>
            <h3>Tablets</h3>
            <p>iPads, Android Tablets and e-Readers</p>
              <div className="category-count">
                <span>67 items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="Games" />
                <div className="category-overlay">
                  <Gamepad2 className="category-icon" size={32} />
                </div>
            </div>
            <h3>Games</h3>
            <p>Gaming consoles and accessories</p>
              <div className="category-count">
                <span>105 items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
            
            <div className="category-card">
              <div className="category-image">
                <img src="/phonewatch2.png" alt="Smartwatches" />
                <div className="category-overlay">
                  <Watch className="category-icon" size={32} />
                </div>
            </div>
            <h3>Smartwatches</h3>
            <p>Smart wearables and fitness trackers</p>
              <div className="category-count">
              <span>78 items</span>
                <span className="arrow">→</span>
              </div>
              <button className="shop-now-btn">Shop Now →</button>
            </div>
            
            <div className="category-card">
              <div className="category-image">
              <img src="/headphone.png" alt="Accessories" />
                <div className="category-overlay">
                  <Headphones className="category-icon" size={32} />
                </div>
            </div>
            <h3>Accessories</h3>
            <p>Phone cases, chargers, and more</p>
              <div className="category-count">
              <span>67 items</span>
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
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

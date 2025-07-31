import React, { useState } from 'react';
import './BrandsPage.css';
import ProductCard from './ProductCard';

const BrandsPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState([5000, 800000]);
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      image: 'phone.png',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 2,
      name: 'PlayStation 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: true
    },
    {
      id: 3,
      name: 'Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 4,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      image: 'phone.png',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 5,
      name: 'PlayStation 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: true
    },
    {
      id: 6,
      name: 'Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 7,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      image: 'phone.png',
      price: '₦1,850,000',
      originalPrice: '₦2,100,000',
      usdtPrice: '650 USDT',
      rating: 4.5,
      reviews: 324,
      badges: ['-12% OFF', 'New'],
      inStock: true
    },
    {
      id: 8,
      name: 'PlayStation 5 Console',
      brand: 'SONY',
      image: 'games.png',
      price: '₦1,850,000',
      originalPrice: '₦2,050,000',
      usdtPrice: '650 USDT',
      rating: 4.8,
      reviews: 64,
      badges: ['-14%'],
      inStock: true
    },
    {
      id: 9,
      name: 'Dell XPS 13 9360',
      brand: 'DELL',
      image: 'laptop.png',
      price: '₦2,500,000',
      originalPrice: '₦2,800,000',
      usdtPrice: '850 USDT',
      rating: 4.7,
      reviews: 120,
      badges: ['-12% OFF', 'New'],
      inStock: true
    }
  ];

  const cartItem = {
    name: 'Redmi 14C',
    image: 'phone.png',
    color: 'Aquamarine Blue',
    storage: '256GB',
    ram: '8GB',
    quantity: 1,
    price: 'N170,500.00'
  };



  return (
    <div className="brands-page">
      <div className="brands-container">
        {/* Main Product Grid */}
        <div className="products-section">
                    <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>

                     {/* Recently Viewed Section */}
           <div className="recently-viewed">
             <h3>Recently Viewed</h3>
             <div className="recently-viewed-grid">
               {products.slice(0, 5).map((product) => (
                 <ProductCard
                   key={`recent-${product.id}`}
                   {...product}
                   showActions={false}
                 />
               ))}
             </div>
           </div>

          {/* Brand Logos */}
          <div className="brand-logos">
            <div className="brand-logo">DELL</div>
            <div className="brand-logo">ASUS</div>
            <div className="brand-logo">JBL</div>
            <div className="brand-logo">Apple</div>
            <div className="brand-logo">SAMSUNG</div>
            <div className="brand-logo">LG</div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar">
          {/* Price Filter */}
          <div className="filter-section">
            <h3>Filter by Price</h3>
            <div className="price-slider">
              <input
                type="range"
                min="5000"
                max="800000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="slider"
              />
              <button className="filter-btn">Filter</button>
            </div>
            <div className="price-range">
              Price: N{priceRange[0].toLocaleString()} - N{priceRange[1].toLocaleString()}
            </div>
          </div>

          {/* Filter by */}
          <div className="filter-section">
            <h3>Filter by:</h3>
            <div className="filter-dropdowns">
              <select 
                value={selectedRam} 
                onChange={(e) => setSelectedRam(e.target.value)}
                className="filter-select"
              >
                <option value="">RAM</option>
                <option value="4gb">4GB</option>
                <option value="8gb">8GB</option>
                <option value="16gb">16GB</option>
              </select>
              
              <select 
                value={selectedStorage} 
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="filter-select"
              >
                <option value="">Storage</option>
                <option value="128gb">128GB</option>
                <option value="256gb">256GB</option>
                <option value="512gb">512GB</option>
              </select>
              
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">Categories</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="tablets">Tablets</option>
              </select>
            </div>
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <h3>Cart:</h3>
            <div className="cart-item">
              <div className="cart-item-image">
                <img src={cartItem.image} alt={cartItem.name} />
                <div className="color-options">
                  {['green', 'blue', 'purple', 'black'].map((color) => (
                    <div key={color} className={`color-option ${color}`}></div>
                  ))}
                </div>
              </div>
              <div className="cart-item-details">
                <h4>{cartItem.name}</h4>
                <p>Colors: {cartItem.color}</p>
                <p>Storage: {cartItem.storage}</p>
                <p>RAM: {cartItem.ram}</p>
                <p className="cart-item-price">{cartItem.quantity} x {cartItem.price}</p>
              </div>
            </div>
            
            <div className="cart-subtotal">
              <span>Subtotal:</span>
              <span>N170,000</span>
            </div>
            
            <div className="cart-actions">
              <button className="view-cart-btn">View Cart</button>
              <button className="checkout-btn">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage; 
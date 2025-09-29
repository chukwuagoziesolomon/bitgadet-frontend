import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, Trash2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wishlist');

  // Sample user data
  const userData = {
    name: 'Emmanuel',
    fullName: 'Ux Nuel',
    role: 'Ux Designer',
    profileImage: '/profile-placeholder.png',
  };

  // Sample wishlist data
  const wishlistItems = [
    {
      id: 1,
      brand: 'Apple',
      productName: 'iPhone 15 Pro Max',
      image: '/phone1.png',
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      stock: 50000
    },
    {
      id: 2,
      brand: 'Apple',
      productName: 'iPhone 15 Pro Max',
      image: '/phone1.png',
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      stock: 50000
    },
    {
      id: 3,
      brand: 'Apple',
      productName: 'iPhone 15 Pro Max',
      image: '/phone1.png',
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      stock: 50000
    }
  ];

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleSidebarNavigation = (itemId: string) => {
    setActiveTab(itemId);

    switch (itemId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'profile':
        navigate('/profile-settings');
        break;
      case 'orders':
        navigate('/order-history');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'support':
        navigate('/contact-support');
        break;
      case 'logout':
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
        {/* Wishlist Section */}
        <div className="wishlist-section">
          <div className="section-header">
            <h2>Wishlist</h2>
          </div>
          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <img src={item.image} alt={item.productName} className="wishlist-image" />
                <div className="wishlist-info">
                  <div className="item-brand">{item.brand}</div>
                  <div className="item-name">{item.productName}</div>
                  <div className="item-pricing">
                    <span className="current-price">{formatNaira(item.currentPrice)}</span>
                    <span className="original-price">{formatNaira(item.originalPrice)}</span>
                    <span className="discount-badge">-{item.discount}%</span>
                  </div>
                  <div className="stock-info">
                    <span className="stock-text">{formatNaira(item.stock)} in stock</span>
                  </div>
                </div>
                <div className="wishlist-actions">
                  <button className="cart-button">
                    <ShoppingBag size={16} />
                  </button>
                  <button className="remove-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>

      <Footer />
    </div>
  );
};

export default Wishlist;

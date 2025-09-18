import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ExternalLink,
  TrendingUp,
  Trash2,
  Plus
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Sample user data
  const userData = {
    name: 'Emmanuel',
    fullName: 'Ux Nuel',
    role: 'Ux Designer',
    profileImage: '/profile-placeholder.png',
    totalOrders: 24,
    wishlistCount: 10,
    ordersGrowth: 12,
    wishlistGrowth: 3
  };

  // Sample orders data
  const recentOrders = [
    {
      id: 'ORD-2025-001',
      productName: 'MacBook Pro 14" M3',
      image: '/laptop1.png',
      date: '1/14/2024',
      status: 'Delivered',
      price: 2850000,
      statusColor: 'delivered'
    },
    {
      id: 'ORD-2025-002',
      productName: 'iPhone 13 Pro',
      image: '/phone1.png',
      date: '1/10/2024',
      status: 'Delivered',
      price: 540000,
      statusColor: 'delivered'
    },
    {
      id: 'ORD-2025-003',
      productName: 'PS 4 Pro',
      image: '/games.png',
      date: '1/8/2024',
      status: 'Processing',
      price: 350000,
      statusColor: 'processing'
    },
    {
      id: 'ORD-2025-004',
      productName: 'Sony Headphone pro 2',
      image: '/headphone.png',
      date: '1/5/2024',
      status: 'Processing',
      price: 155000,
      statusColor: 'processing'
    }
  ];

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
      productName: 'MacBook Pro 14" M3',
      image: '/laptop1.png',
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
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'support':
        // Navigate to support page when created
        console.log('Navigate to support page');
        break;
      default:
        // Let the Sidebar component handle navigation for other items
        break;
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation} />

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {userData.name}</h1>
              <p>Manage your account and track your orders.</p>
            </div>
            <div className="profile-section">
              <img src={userData.profileImage} alt="Profile" className="profile-image" />
              <div className="profile-info">
                <span className="profile-name">{userData.fullName}</span>
                <span className="profile-role">{userData.role}</span>
              </div>
              <button className="notification-button">
                <Bell size={20} />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-header">
                <h3>Total Orders</h3>
                <span className="card-number">{userData.totalOrders}</span>
              </div>
              <div className="card-footer">
                <div className="growth-indicator positive">
                  <TrendingUp size={16} />
                  <span>+{userData.ordersGrowth}% from last month</span>
                </div>
                <span className="card-description">All-time purchases</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-header">
                <h3>Wishlist</h3>
                <span className="card-number">{userData.wishlistCount}</span>
              </div>
              <div className="card-footer">
                <div className="growth-indicator positive">
                  <TrendingUp size={16} />
                  <span>+{userData.wishlistGrowth} this week</span>
                </div>
                <span className="card-description">Saved for later</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Recent Orders */}
            <div className="orders-section">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <Link to="/orders" className="view-all-link">
                  View All
                  <ExternalLink size={16} />
                </Link>
              </div>
              <div className="orders-list">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="order-item">
                    <img src={order.image} alt={order.productName} className="order-image" />
                    <div className="order-details">
                      <div className="order-id">{order.id}</div>
                      <div className="order-product">{order.productName}</div>
                      <div className="order-date">{order.date}</div>
                      <Link to={`/track/${order.id}`} className="track-link">Track Order</Link>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.statusColor}`}>{order.status}</span>
                      <div className="order-price">{formatNaira(order.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist */}
            <div className="wishlist-section">
              <div className="section-header">
                <h2>Wishlist</h2>
                <Link to="/wishlist" className="view-all-link">
                  View All
                  <ExternalLink size={16} />
                </Link>
              </div>
              <div className="wishlist-items">
                {wishlistItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <img src={item.image} alt={item.productName} className="wishlist-image" />
                    <div className="wishlist-details">
                      <div className="item-brand">{item.brand}</div>
                      <div className="item-name">{item.productName}</div>
                      <div className="item-pricing">
                        <span className="current-price">{formatNaira(item.currentPrice)}</span>
                        <span className="original-price">{formatNaira(item.originalPrice)}</span>
                        <span className="discount-tag">-{item.discount}%</span>
                      </div>
                      <div className="stock-info">
                        <span className="stock-amount">{formatNaira(item.stock)} In Stock</span>
                      </div>
                    </div>
                    <div className="wishlist-actions">
                      <button className="action-button add-to-cart">
                        <Plus size={16} />
                      </button>
                      <button className="action-button remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

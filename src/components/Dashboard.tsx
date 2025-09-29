import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ExternalLink,
  TrendingUp,
  Trash2,
  Plus,
  ShoppingBag,
  Heart,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import OrderTrackingModal from './OrderTrackingModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
      status: 'En Route',
      price: 540000,
      statusColor: 'en-route'
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
        // Navigate to support page when created
        console.log('Navigate to support page');
        break;
      case 'logout':
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const handleTrackOrder = (order: any) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setTrackingModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="dashboard">
      <Navbar />

      <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
        {/* Header Cards */}
        <div className="header-cards">
          <div className="header-card">
            <div className="card-icon">
              <ShoppingBag size={20} color="#00C896" />
            </div>
            <div className="card-content">
              <h3>Total Orders</h3>
              <div className="card-value">
                <span className="main-number">{userData.totalOrders}</span>
                <div className="growth-indicator positive">
                  <TrendingUp size={14} />
                  <span>+{userData.ordersGrowth}% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="header-card">
            <div className="card-icon">
              <Heart size={20} color="#00C896" />
            </div>
            <div className="card-content">
              <h3>Wishlist</h3>
              <div className="card-value">
                <span className="main-number">{userData.wishlistCount}</span>
                <div className="growth-indicator positive">
                  <TrendingUp size={14} />
                  <span>+{userData.wishlistGrowth} this week</span>
                </div>
              </div>
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
                  <div className="order-item-content">
                    <img src={order.image} alt={order.productName} className="order-image" />
                    <div className="order-info">
                      <div className="order-header">
                        <div className="order-id">{order.id}</div>
                      </div>
                      <div className="order-product">{order.productName}</div>
                      <div className="order-meta">
                        <div className="order-date">{order.date}</div>
                        <button onClick={() => handleTrackOrder(order)} className="track-link">Track Order</button>
                      </div>
                    </div>
                  </div>
                  <div className="order-right-section">
                    <span className={`status-badge ${order.statusColor}`}>
                      {order.statusColor === 'delivered' && <CheckCircle size={12} />}
                      {order.statusColor === 'processing' && <Clock size={12} />}
                      {order.statusColor === 'en-route' && <Truck size={12} />}
                      {order.status}
                    </span>
                    <div className="order-price">{formatNaira(order.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wishlist */}
          <div className="wishlist-section">
            <div className="section-header">
              <h2><Heart size={20} className="section-icon" />Wishlist</h2>
              <Link to="/wishlist" className="view-all-link">
                View All
                <ExternalLink size={16} />
              </Link>
            </div>
            <div className="wishlist-items">
              {wishlistItems.slice(0, 4).map((item) => (
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
        </div>
      </Sidebar>

      <Footer />

      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={closeTrackingModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default Dashboard;

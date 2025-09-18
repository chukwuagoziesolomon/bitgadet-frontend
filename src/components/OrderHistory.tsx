import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck, Package, Clock } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId);
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
        console.log('Unknown sidebar item:', itemId);
    }
  };

  // Sample orders data
  const orders = [
    {
      id: 'ORD-2025-001',
      productName: 'MacBook Pro 14" M3',
      image: '/laptop1.png',
      date: '1/14/2024',
      status: 'Delivered',
      price: 2850000,
      statusColor: 'delivered',
      statusIcon: CheckCircle
    },
    {
      id: 'ORD-2025-002',
      productName: 'iPhone 13 Pro',
      image: '/phone1.png',
      date: '1/10/2024',
      status: 'Delivered',
      price: 2850000,
      statusColor: 'delivered',
      statusIcon: Truck
    },
    {
      id: 'ORD-2025-003',
      productName: 'PlayStation 5 Console',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      date: '1/8/2024',
      status: 'Processing',
      price: 2850000,
      statusColor: 'processing',
      statusIcon: Package
    },
    {
      id: 'ORD-2025-004',
      productName: 'Sony WH-1000XM4 Headphones',
      image: '/headphone.png',
      date: '1/5/2024',
      status: 'Processing',
      price: 2850000,
      statusColor: 'processing',
      statusIcon: Clock
    }
  ];

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#10b981';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="order-history-page">
      <Navbar />
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activeTab="orders" onItemClick={handleSidebarItemClick} />

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="order-history-container">
            <div className="order-history-header">
              <Link to="/dashboard" className="back-link">
                <ArrowLeft size={20} />
                Back to Dashboard
              </Link>
              <h1>Order History</h1>
              <p>Track and manage your past orders</p>
            </div>

            <div className="orders-list">
              {orders.map((order) => {
                const StatusIcon = order.statusIcon;
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-image">
                      <img src={order.image} alt={order.productName} />
                    </div>
                    
                    <div className="order-details">
                      <div className="order-info">
                        <h3 className="order-id">{order.id}</h3>
                        <h4 className="product-name">{order.productName}</h4>
                        <p className="order-date">{order.date}</p>
                        <Link to="#" className="track-order-link">Track Order</Link>
                      </div>
                      
                      <div className="order-status-price">
                        <div 
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          <StatusIcon size={16} />
                          <span>{order.status}</span>
                        </div>
                        <div className="order-price">{formatNaira(order.price)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderHistory;

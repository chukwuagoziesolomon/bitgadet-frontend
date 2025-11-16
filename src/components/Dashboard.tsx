import React, { useState, useEffect } from 'react';
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
  Truck,
  Package
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import OrderTrackingModal from './OrderTrackingModal';
import { apiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [apiRecentOrders, setApiRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [recentWishlist, setRecentWishlist] = useState<any[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Sample user data (keeping for other parts)
  const userData = {
    name: 'Emmanuel',
    fullName: 'Ux Nuel',
    role: 'Ux Designer',
    profileImage: '/profile-placeholder.png'
  };

  // Fetch order stats and recent orders on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch order stats
      try {
        setStatsLoading(true);
        const statsData = await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_ORDER_STATS);
        setOrderStats(statsData);
      } catch (error: any) {
        console.error('Failed to fetch order stats:', error);
        showError('Failed to load dashboard stats', error.message || 'Please try again later.');
        // Set default values if API fails
        setOrderStats({
          total_orders: 0,
          orders_this_month: 0,
          orders_last_month: 0,
          orders_percentage_change: 0,
          wishlist_count: 0,
          wishlist_percentage_change: 0
        });
      } finally {
        setStatsLoading(false);
      }

      // Fetch recent orders
      try {
        setOrdersLoading(true);
        const ordersData = await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_RECENT_ORDERS);
        setApiRecentOrders(ordersData.recent_orders || []);
      } catch (error: any) {
        console.error('Failed to fetch recent orders:', error);
        showError('Failed to load recent orders', error.message || 'Please try again later.');
        // Keep empty array if API fails
        setApiRecentOrders([]);
      } finally {
        setOrdersLoading(false);
      }

      // Fetch recent wishlist
      try {
        setWishlistLoading(true);
        const wishlistData = await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_RECENT_WISHLIST);
        setRecentWishlist(wishlistData.recent_wishlist || []);
      } catch (error: any) {
        console.error('Failed to fetch recent wishlist:', error);
        showError('Failed to load recent wishlist', error.message || 'Please try again later.');
        // Keep empty array if API fails
        setRecentWishlist([]);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchDashboardData();
  }, [showError]);

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
    // Transform API order data to match modal expectations
    const transformedOrder = {
      id: order.order_id,
      productName: order.products?.[0]?.name || 'Product',
      image: order.products?.[0]?.image || '/placeholder.png',
      status: order.status,
      statusColor: order.status, // Use status as statusColor for now
      date: order.date,
      price: order.total_amount
    };
    setSelectedOrder(transformedOrder);
    setTrackingModalOpen(true);
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await apiRequest<any>('/api/wishlist/remove/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });

      // Remove from local state
      setRecentWishlist(prev => prev.filter(item => item.product_id !== productId));
      showSuccess('Removed from wishlist', 'Item has been removed from your wishlist.');
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      showError('Failed to remove item', error.message || 'Please try again.');
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await apiRequest<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      showSuccess('Added to cart', 'Item has been added to your cart.');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      showError('Failed to add to cart', error.message || 'Please try again.');
    }
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
                <span className="main-number">
                  {statsLoading ? '...' : (orderStats?.total_orders || 0)}
                </span>
                {!statsLoading && orderStats && (
                  <div className={`growth-indicator ${orderStats.orders_percentage_change >= 0 ? 'positive' : 'negative'}`}>
                    <TrendingUp size={14} />
                    <span>{orderStats.orders_percentage_change >= 0 ? '+' : ''}{orderStats.orders_percentage_change.toFixed(1)}% from last month</span>
                  </div>
                )}
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
                <span className="main-number">
                  {statsLoading ? '...' : (orderStats?.wishlist_count || 0)}
                </span>
                {!statsLoading && orderStats && (
                  <div className={`growth-indicator ${orderStats.wishlist_percentage_change >= 0 ? 'positive' : 'negative'}`}>
                    <TrendingUp size={14} />
                    <span>{orderStats.wishlist_percentage_change >= 0 ? '+' : ''}{orderStats.wishlist_percentage_change.toFixed(1)}% this week</span>
                  </div>
                )}
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
              {ordersLoading ? (
                <div className="loading-orders">
                  <div className="loading-spinner">Loading recent orders...</div>
                </div>
              ) : apiRecentOrders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-state">
                    <Package size={48} className="empty-icon" />
                    <p>No recent orders found.</p>
                  </div>
                </div>
              ) : (
                apiRecentOrders.slice(0, 4).map((order) => {
                  const firstProduct = order.products?.[0];
                  return (
                    <div key={order.order_id} className="order-item">
                      <div className="order-item-content">
                        <img src={firstProduct?.image || '/placeholder.png'} alt={firstProduct?.name || 'Product'} className="order-image" />
                        <div className="order-info">
                          <div className="order-header">
                            <div className="order-id">{order.order_id}</div>
                          </div>
                          <div className="order-product">{firstProduct?.name || 'Product'}</div>
                          <div className="order-meta">
                            <div className="order-date">{order.date}</div>
                            <button onClick={() => handleTrackOrder(order)} className="track-link">Track Order</button>
                          </div>
                        </div>
                      </div>
                      <div className="order-right-section">
                        <span className={`status-badge ${order.status}`}>
                          {order.status === 'delivered' && <CheckCircle size={12} />}
                          {order.status === 'processing' && <Clock size={12} />}
                          {order.status === 'en-route' && <Truck size={12} />}
                          {order.status_display || order.status}
                        </span>
                        <div className="order-price">{formatNaira(order.total_amount)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Wishlist */}
          <div className="wishlist-section">
            <div className="section-header">
              <h2><Heart size={20} className="section-icon" />Recent Wishlist</h2>
              <Link to="/wishlist" className="view-all-link">
                View All
                <ExternalLink size={16} />
              </Link>
            </div>

            {wishlistLoading ? (
              <div className="loading-wishlist">
                <div className="loading-spinner">Loading wishlist...</div>
              </div>
            ) : recentWishlist.length === 0 ? (
              <div className="empty-wishlist">
                <div className="empty-state">
                  <Heart size={48} className="empty-icon" />
                  <p>No recent wishlist items</p>
                </div>
              </div>
            ) : (
              <div className="wishlist-items">
                {recentWishlist.slice(0, 4).map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <img src={item.main_image} alt={item.product_name} className="wishlist-image" />
                    <div className="wishlist-info">
                      <div className="item-brand">{item.brand}</div>
                      <div className="item-name">{item.product_name}</div>
                      <div className="item-pricing">
                        <span className="current-price">{formatNaira(item.current_price)}</span>
                        {item.original_price && item.original_price > item.current_price && (
                          <span className="original-price">{formatNaira(item.original_price)}</span>
                        )}
                        {item.discount_percentage > 0 && (
                          <span className="discount-badge">-{item.discount_percentage}%</span>
                        )}
                      </div>
                      <div className="stock-info">
                        <span className={`stock-text ${item.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                          {item.is_in_stock ? `${item.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="added-date">
                        Added {item.added_at}
                      </div>
                    </div>
                    <div className="wishlist-actions">
                      <button
                        className="cart-button"
                        onClick={() => handleAddToCart(item.product_id)}
                        disabled={!item.is_in_stock}
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Sidebar>

      <Footer />

      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={closeTrackingModal}
        orderId={selectedOrder?.id || null}
      />
    </div>
  );
};

export default Dashboard;

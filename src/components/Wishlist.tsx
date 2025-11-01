import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, Trash2, Heart } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { conditionalApiRequest, publicApiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('wishlist');
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample user data (keeping for other parts)
  const userData = {
    name: 'Emmanuel',
    fullName: 'Ux Nuel',
    role: 'Ux Designer',
    profileImage: '/profile-placeholder.png',
  };

  // Fetch wishlist items on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await conditionalApiRequest<any>(API_CONFIG.ENDPOINTS.WISHLIST_ALL);
        setWishlistItems(response.wishlist || []);
      } catch (error: any) {
        console.error('Failed to fetch wishlist:', error);
        showError('Failed to load wishlist', error.message || 'Please try again later.');
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [showError]);

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

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await publicApiRequest<any>('/api/wishlist/remove/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });

      // Remove from local state
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      showSuccess('Removed from wishlist', 'Item has been removed from your wishlist.');
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      showError('Failed to remove item', error.message || 'Please try again.');
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await publicApiRequest<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      showSuccess('Added to cart', 'Item has been added to your cart.');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      showError('Failed to add to cart', error.message || 'Please try again.');
    }
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
        {/* Wishlist Section */}
        <div className="wishlist-section">
          <div className="section-header">
            <h2><Heart size={20} className="section-icon" />Wishlist</h2>
            {wishlistItems.length > 0 && (
              <div className="items-count">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {loading ? (
            <div className="loading-wishlist">
              <div className="loading-spinner">Loading wishlist...</div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-state">
                <Heart size={48} className="empty-icon" />
                <p>Your wishlist is empty</p>
                <p>Start adding items you love!</p>
              </div>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map((item) => (
                <div key={item.product_id} className="wishlist-item">
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
      </Sidebar>

      <Footer />
    </div>
  );
};

export default Wishlist;

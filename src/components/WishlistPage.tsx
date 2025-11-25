import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Share2, ArrowRight, Filter } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductCard from './ProductCard';
import { conditionalApiRequest, publicApiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './WishlistPage.css';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Helper to get cart token from all possible keys
  const getCartToken = () => {
    return (
      localStorage.getItem('cartToken') ||
      localStorage.getItem('bitgadgets_cart_token') ||
      null
    );
  };

  // Fetch wishlist items on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const cartToken = getCartToken();

        // If not logged in and no cart token, show empty wishlist and skip API call
        if (!token && !cartToken) {
          setWishlistItems([]);
          setLoading(false);
          return;
        }

        let url = API_CONFIG.ENDPOINTS.WISHLIST_ALL;
        if (!token && cartToken) {
          url = `${API_CONFIG.ENDPOINTS.WISHLIST_ALL}?cart_token=${cartToken}`;
        }

        const response = token
          ? await conditionalApiRequest<any>(url)
          : await publicApiRequest<any>(url);

        setWishlistItems(response.products || []);
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

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const cartToken = getCartToken();

      const payload: any = { product_id: productId };
      
      // Add cart_token for guest users
      if (!token && cartToken) {
        payload.cart_token = cartToken;
      }

      // Use appropriate request function
      const response = token
        ? await conditionalApiRequest<any>('/api/wishlist/remove/', {
            method: 'POST',
            body: JSON.stringify(payload),
          })
        : await publicApiRequest<any>('/api/wishlist/remove/', {
            method: 'POST',
            body: JSON.stringify(payload),
          });

      setWishlistItems(prev => prev.filter(item => item.product_id !== productId || item.id !== productId));
      showSuccess('Removed from wishlist', 'Item has been removed from your wishlist.');
    } catch (error: any) {
      console.error('Failed to remove from wishlist:', error);
      showError('Failed to remove item', error.message || 'Please try again.');
    }
  };

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');
    const cartToken = getCartToken();

    const payload: any = { product_id: productId, quantity: 1 };
    
    // Add cart_token for guest users
    if (!token && cartToken) {
      payload.cart_token = cartToken;
    }

    try {
      const response = token
        ? await conditionalApiRequest<any>('/api/cart/add/', {
            method: 'POST',
            body: JSON.stringify(payload),
          })
        : await publicApiRequest<any>('/api/cart/add/', {
            method: 'POST',
            body: JSON.stringify(payload),
          });

      showSuccess('Added to cart', 'Item has been added to your cart.');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      showError('Failed to add to cart', error.message || 'Please try again.');
    }
  };

  const handleShareWishlist = () => {
    const wishlistText = wishlistItems
      .map(item => `${item.name} - ${formatNaira(parseFloat(item.current_price))}`)
      .join('\n');
    
    const text = `Check out my wishlist on BitGadgetz:\n\n${wishlistText}\n\nVisit: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My BitGadgetz Wishlist',
        text: text,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text);
      showSuccess('Copied to clipboard', 'Wishlist link copied to clipboard!');
    }
  };

  const getSortedItems = () => {
    let sorted = [...wishlistItems];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => parseFloat(a.current_price) - parseFloat(b.current_price));
        break;
      case 'price-high':
        sorted.sort((a, b) => parseFloat(b.current_price) - parseFloat(a.current_price));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }
    
    return sorted;
  };

  const getFilteredItems = () => {
    let filtered = getSortedItems();
    
    switch (filterBy) {
      case 'in-stock':
        filtered = filtered.filter(item => item.is_in_stock);
        break;
      case 'out-stock':
        filtered = filtered.filter(item => !item.is_in_stock);
        break;
      case 'on-sale':
        filtered = filtered.filter(item => item.discount_percentage > 0);
        break;
      case 'all':
      default:
        break;
    }
    
    return filtered;
  };

  const filteredItems = getFilteredItems();
  const totalValue = filteredItems.reduce((sum, item) => sum + parseFloat(item.current_price), 0);
  const savedAmount = filteredItems.reduce((sum, item) => {
    const current = parseFloat(item.current_price);
    const original = parseFloat(item.original_price);
    if (original && original > current) {
      return sum + (original - current);
    }
    return sum;
  }, 0);

  return (
    <div className="wishlist-page-container">
      <Navbar />

      {/* Hero Section */}
      <div className="wishlist-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Heart size={64} />
          </div>
          <h1>Your Wishlist</h1>
          <p>Keep track of your favorite products and get notified when they go on sale</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="wishlist-main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Heart size={80} />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding items you love! When you find something you like, click the heart icon to save it here.</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="wishlist-summary">
              <div className="summary-card">
                <div className="summary-label">Total Items</div>
                <div className="summary-value">{wishlistItems.length}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Total Value</div>
                <div className="summary-value">{formatNaira(totalValue)}</div>
              </div>
              <div className="summary-card highlight">
                <div className="summary-label">Potential Savings</div>
                <div className="summary-value">{formatNaira(savedAmount)}</div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="wishlist-controls">
              <div className="sort-filter">
                <div className="control-group">
                  <label htmlFor="sort">Sort By:</label>
                  <select 
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <div className="control-group">
                  <label htmlFor="filter">Filter By:</label>
                  <select 
                    id="filter"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Items ({wishlistItems.length})</option>
                    <option value="in-stock">In Stock ({wishlistItems.filter(i => i.is_in_stock).length})</option>
                    <option value="out-stock">Out of Stock ({wishlistItems.filter(i => !i.is_in_stock).length})</option>
                    <option value="on-sale">On Sale ({wishlistItems.filter(i => i.discount_percentage > 0).length})</option>
                  </select>
                </div>
              </div>

              <button 
                className="share-wishlist-btn"
                onClick={handleShareWishlist}
              >
                <Share2 size={18} />
                Share
              </button>
            </div>

            {/* Wishlist Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="wishlist-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="wishlist-grid-item">
                    <ProductCard
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      brand={item.brand_name}
                      image={item.main_image || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image+Available'}
                      price={parseFloat(item.current_price) || 0}
                      originalPrice={parseFloat(item.original_price) || null}
                      rating={item.rating || 0}
                      reviews={item.review_count || 0}
                      inStock={item.is_in_stock}
                      isInWishlist={true}
                      discount_percentage={item.discount_percentage || 0}
                      is_on_sale={item.is_on_sale}
                      is_in_stock={item.is_in_stock}
                      is_featured={item.is_featured}
                      is_new_arrival={item.is_new_arrival}
                      is_best_seller={item.is_best_seller}
                      product_condition={item.product_condition}
                      condition_display={item.condition_display}
                      stock_quantity={item.stock_quantity}
                      is_coupon={item.is_coupon}
                      coupon_value={item.coupon_value}
                      onAddToCart={() => handleAddToCart(item.id)}
                      onToggleWishlist={() => handleRemoveFromWishlist(item.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No items match your filter. Try adjusting your filters.</p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;

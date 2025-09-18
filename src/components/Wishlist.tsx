import React, { useState } from 'react';
import { ShoppingCart, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from './Sidebar';
import './Wishlist.css';

interface WishlistItem {
  id: number;
  name: string;
  brand: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  savings: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  priceTrend: 'up' | 'down';
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      savings: 250000,
      stockStatus: 'in-stock',
      priceTrend: 'up'
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      savings: 250000,
      stockStatus: 'low-stock',
      priceTrend: 'down'
    },
    {
      id: 3,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
      currentPrice: 1850000,
      originalPrice: 2100000,
      discount: 20,
      savings: 250000,
      stockStatus: 'in-stock',
      priceTrend: 'up'
    }
  ]);

  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // Handle add to cart logic
    console.log('Adding to cart:', id);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'green';
      case 'low-stock':
        return 'red';
      case 'out-of-stock':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="wishlist-page">
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar activeTab="wishlist" />

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="wishlist-content">
            {/* Page Header */}
            <div className="wishlist-header">
              <h1>Wishlist</h1>
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
              <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="wishlist-card">
                    {/* Product Image */}
                    <div className="product-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                      <div className="product-brand">{item.brand}</div>
                      <div className="product-name">{item.name}</div>
                      
                      {/* Pricing */}
                      <div className="product-pricing">
                        <div className="price-row">
                          <span className="current-price">{formatNaira(item.currentPrice)}</span>
                          <span className="original-price">{formatNaira(item.originalPrice)}</span>
                        </div>
                        <div className="discount-badge">-{item.discount}%</div>
                        <div className="savings">
                          {item.priceTrend === 'up' ? (
                            <TrendingUp className="trend-icon up" />
                          ) : (
                            <TrendingDown className="trend-icon down" />
                          )}
                          <span className="savings-amount">{formatNaira(item.savings)}</span>
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className={`stock-status ${item.stockStatus}`}>
                        {getStockStatusText(item.stockStatus)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="wishlist-actions">
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item.id)}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={20} />
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromWishlist(item.id)}
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-wishlist">
                <div className="empty-icon">💝</div>
                <h3>Your wishlist is empty</h3>
                <p>Start adding products you love to your wishlist!</p>
                <button className="shop-now-btn">Shop Now</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Wishlist;

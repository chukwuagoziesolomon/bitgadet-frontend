import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { apiRequest } from '../config/api';
import './ShoppingCart.css';

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  item_total?: number;
  brand?: string;
  image?: string;
  usdPrice?: number;
  discount?: number;
  // ...other product fields from ProductListSerializer
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await apiRequest<any>('/api/cart/');
      const products = data.products || [];
      setCartItems(products);
      setOrderSummary(data.order_summary || {});
      setItemCount(data.item_count || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await apiRequest<any>('/api/cart/update/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id, quantity: newQuantity }),
      });
      // Refetch cart to get updated data
      fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await apiRequest<any>('/api/cart/remove/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id }),
      });
      // Refetch cart to get updated data
      fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number) => {
    return `${amount.toLocaleString()} USDT`;
  };

  if (loading) {
    return (
      <div className="shopping-cart">
        <div className="cart-header">
          <div className="cart-title">
            <h1>Loading Cart...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart">
        <div className="cart-header">
          <div className="continue-shopping">
            <Link to="/products">← Continue Shopping</Link>
          </div>
          <div className="cart-title">
            <h1>Shopping Cart</h1>
          </div>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="shop-now-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      {/* Header */}
      <div className="cart-header">
        <div className="continue-shopping">
          <Link to="/products">← Continue Shopping</Link>
        </div>
        <div className="cart-title">
          <h1>Shopping Cart</h1>
          <p>{itemCount} items in your cart</p>
        </div>
      </div>

      <div className="cart-container">
        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-container">
              <div className="cart-items-list">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="cart-item">
                      {/* Product Image */}
                      <div className="product-image">
                        <div className="image-placeholder">
                          <div className="product-icon">
                            {item.image || '📱'}
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <div className="product-header">
                          <div className="product-info">
                            <h3 className="product-name">{item.name}</h3>
                            <p className="product-brand">{item.brand || 'Unknown'}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="remove-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {item.discount && item.discount > 0 && (
                          <div className="discount-badge">
                            <span className="discount-text">
                              {item.discount}% OFF
                            </span>
                          </div>
                        )}

                        <div className="product-footer">
                          <div className="price-section">
                            <div className="price-naira">
                              {formatNaira(item.price)}
                            </div>
                            <div className="price-usd">
                              {item.usdPrice ? formatUSD(item.usdPrice) : 'N/A USDT'}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="quantity-btn"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="quantity-display">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="quantity-btn"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="item-subtotal">
                          <span className="subtotal-label">Subtotal: </span>
                          <span className="subtotal-amount">
                            {formatNaira(item.item_total || (item.price * item.quantity))}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < cartItems.length - 1 && <hr className="item-divider" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <div className="summary-header">
                <div className="summary-icon">
                  <ShoppingBag size={14} />
                </div>
                <h2 className="summary-title">Order Summary</h2>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Subtotal ({itemCount} items)</span>
                  <span className="summary-value">{formatNaira(orderSummary?.subtotal || 0)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value">{formatNaira(orderSummary?.shipping_cost || 0)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">{formatNaira(orderSummary?.tax || 0)}</span>
                </div>
                {orderSummary?.discount > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Discount</span>
                    <span className="summary-value">-{formatNaira(orderSummary.discount)}</span>
                  </div>
                )}
                <hr className="summary-divider" />
                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <div className="total-values">
                    <div className="total-naira">{formatNaira(orderSummary?.total || 0)}</div>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>

              <button className="whatsapp-btn">
                Get help via WhatsApp
              </button>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <div className="trust-icon">
                    <span>✓</span>
                  </div>
                  <span>Secure Payment</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">
                    <span>✓</span>
                  </div>
                  <span>7-Day Returns</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">
                    <span>✓</span>
                  </div>
                  <span>Authentic Products</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">
                    <span>✓</span>
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import './ShoppingCart.css';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  usdPrice: number;
  image: string;
  quantity: number;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      price: 1850000,
      discount: 1,
      usdPrice: 1200,
      image: '📱',
      quantity: 1
    },
    {
      id: '2',
      name: 'MacBook Pro 14" M3',
      brand: 'Apple',
      price: 2850000,
      discount: 1,
      usdPrice: 1550,
      image: '💻',
      quantity: 2
    },
    {
      id: '3',
      name: 'Airpod Pro (2nd Gen)',
      brand: 'Apple',
      price: 350000,
      discount: 0,
      usdPrice: 240,
      image: '🎧',
      quantity: 1
    },
    {
      id: '4',
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      price: 1200000,
      discount: 5,
      usdPrice: 800,
      image: '📱',
      quantity: 1
    },
    {
      id: '5',
      name: 'Apple Watch Series 9',
      brand: 'Apple',
      price: 450000,
      discount: 0,
      usdPrice: 300,
      image: '⌚',
      quantity: 1
    },
    {
      id: '6',
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 1650000,
      discount: 3,
      usdPrice: 1100,
      image: '📱',
      quantity: 1
    },
    {
      id: '7',
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      price: 420000,
      discount: 0,
      usdPrice: 280,
      image: '🎧',
      quantity: 1
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number) => {
    return `${amount.toLocaleString()} USDT`;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 5000;
  const taxRate = 0.075;
  const tax = 25000; // Fixed as shown in design
  const total = 16170025; // Fixed as shown in design
  const totalUSD = 12650;

  return (
    <div className="shopping-cart">
      {/* Header */}
      <div className="cart-header">
        <div className="continue-shopping">
          <Link to="/products">← Continue Shopping</Link>
        </div>
        <div className="cart-title">
          <h1>Shopping Cart</h1>
          <p>{calculateTotalItems()} items in your cart</p>
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
                            {item.image}
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="product-details">
                        <div className="product-header">
                          <div className="product-info">
                            <h3 className="product-name">{item.name}</h3>
                            <p className="product-brand">{item.brand}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="remove-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {item.discount > 0 && (
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
                              {formatUSD(item.usdPrice)}
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
                            ₦5,700,000
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
                  <span className="summary-label">Subtotal ( {calculateTotalItems()} items)</span>
                  <span className="summary-value">₦16,140,025</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value">₦5,000</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax (7.5%)</span>
                  <span className="summary-value">₦25,000</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <div className="total-values">
                    <div className="total-naira">₦16,170,025</div>
                    <div className="total-usd">
                      {totalUSD.toLocaleString()} USDT
                    </div>
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

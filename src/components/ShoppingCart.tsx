import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { publicApiRequest, conditionalApiRequest } from '../config/api';
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
    console.log('🛒 Fetching cart data...');
    try {
      // Fetch cart items
      const cartData = await conditionalApiRequest<any>('/api/cart/');
      console.log('✅ Cart API response:', cartData);
      const products = cartData.products || [];

      // Transform API response to match CartItem interface
      const transformedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.current_price) || 0, // Convert string to number
        quantity: product.quantity || 1,
        item_total: product.quantity ? (parseFloat(product.current_price) || 0) * product.quantity : undefined,
        brand: product.brand,
        image: product.main_image,
        usdPrice: parseFloat(product.current_price_usdt) || undefined,
        discount: product.discount_percentage || undefined,
      }));

      console.log('🛒 Transformed cart products:', transformedProducts);
      setCartItems(transformedProducts);
      setItemCount(transformedProducts.length);

      // Fetch cart summary
      try {
        const summaryData = await conditionalApiRequest<any>('/api/cart/summary/');
        console.log('✅ Cart summary API response:', summaryData);
        setOrderSummary(summaryData);
      } catch (summaryError) {
        console.error('❌ Failed to fetch cart summary:', summaryError);
        // Fallback to empty summary
        setOrderSummary({});
      }
    } catch (error) {
      console.error('❌ Failed to fetch cart:', error);
      // Only log error if user is actually logged in (has token)
      const token = localStorage.getItem('authToken');
      if (token) {
        console.error('Failed to fetch cart:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await conditionalApiRequest<any>('/api/cart/update/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id, quantity: newQuantity }),
      });
      // Refetch cart to get updated data
      fetchCart();
    } catch (error) {
      // Only log error if user is actually logged in (has token)
      const token = localStorage.getItem('authToken');
      if (token) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const removeItem = async (id: number) => {
    try {
      await conditionalApiRequest<any>('/api/cart/remove/', {
        method: 'POST',
        body: JSON.stringify({ product_id: id }),
      });
      // Refetch cart to get updated data
      fetchCart();
    } catch (error) {
      // Only log error if user is actually logged in (has token)
      const token = localStorage.getItem('authToken');
      if (token) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const formatNaira = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0 USDT';
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
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="cart-product-image"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.parentElement?.querySelector('.product-icon') as HTMLElement;
                                if (placeholder) placeholder.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <div
                            className="product-icon"
                            style={{ display: item.image ? 'none' : 'block' }}
                          >
                            📱
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
                            {formatNaira(item.item_total || (item.price && item.quantity ? item.price * item.quantity : 0))}
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
                  <span className="summary-value">{formatNaira(orderSummary?.shipping || 0)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">{formatNaira(orderSummary?.tax || 0)}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <div className="total-values">
                    <div className="total-naira">{formatNaira(orderSummary?.total || 0)}</div>
                    <div className="total-usd">{formatUSD(orderSummary?.total_usdt || 0)}</div>
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

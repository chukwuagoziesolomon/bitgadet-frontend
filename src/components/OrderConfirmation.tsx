import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Truck, MapPin, Download, MessageCircle, Bell, Shield, Copy, User, Key } from 'lucide-react';
import { publicApiRequest, conditionalApiRequest } from '../config/api';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { orderData: initialOrderData, loginCredentials, nextSteps } = location.state || {};

  const [cartSummary, setCartSummary] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract order_id from initial data
  const orderId = initialOrderData?.order_id || initialOrderData?.order?.order_id;

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Fetch cart summary to get purchased items (uses authentication if available)
        const cartResponse = await conditionalApiRequest<any>('/api/cart/summary/');

        // Fetch order status if we have an order_id (uses authentication if available)
        let statusResponse = null;
        if (orderId) {
          statusResponse = await conditionalApiRequest<any>(`/checkout/status/${orderId}/`);
        }

        setCartSummary(cartResponse);
        setOrderStatus(statusResponse);
      } catch (error) {
        // Only log error if user is actually logged in (has token)
        const token = localStorage.getItem('authToken');
        if (token) {
          console.error('Failed to fetch order data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  // Fallback data if no state is passed
  const defaultOrderData = {
    order_id: 'BG-GSFMQJHWW',
    created_at: new Date().toLocaleDateString(),
    order: {
      cart_items: {},
      subtotal: 0,
      total_amount: 0,
      shipping_address_full: '123 Victoria Island, Lagos, Lagos State, Nigeria',
      payment_method_display: 'Credit Card'
    }
  };

  const currentOrderData = initialOrderData || defaultOrderData;
  const currentLoginCredentials = loginCredentials || null;
  const currentNextSteps = nextSteps || [];

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="order-confirmation">
      <div className="order-confirmation-container">
        {/* Login Credentials Section - Show if available */}
        {currentLoginCredentials && (
          <div className="login-credentials-section">
            <div className="credentials-header">
              <User size={24} />
              <h2>Your Account Has Been Created</h2>
            </div>
            <div className="credentials-content">
              <div className="credential-item">
                <div className="credential-label">
                  <User size={16} />
                  <span>Email:</span>
                </div>
                <div className="credential-value">
                  <span>{currentLoginCredentials.email}</span>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(currentLoginCredentials.email)}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="credential-item">
                <div className="credential-label">
                  <Key size={16} />
                  <span>Password:</span>
                </div>
                <div className="credential-value">
                  <span>{currentLoginCredentials.password}</span>
                  <button
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(currentLoginCredentials.password)}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <p className="credentials-note">{currentLoginCredentials.message}</p>
              <div className="credentials-actions">
                <Link to="/login" className="login-btn">
                  Login to Your Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="confirmation-header">
          <div className={`status-icon ${orderStatus?.order_status === 'confirmed' ? 'confirmed' : 'pending'}`}>
            {orderStatus?.order_status === 'confirmed' ? (
              <CheckCircle size={48} />
            ) : (
              <div className="pending-icon">⏳</div>
            )}
          </div>
          <h1>{orderStatus?.order_status === 'confirmed' ? 'Order Confirmed!' : 'Order Processing...'}</h1>
          <p className="confirmation-message">
            {orderStatus?.order_status === 'confirmed'
              ? 'Thank you for your purchase from BitGadgetz'
              : 'Your order is being processed. Please wait while we confirm your payment.'
            }
          </p>
          <div className="order-details">
            <span>Order #{currentOrderData.order_id} • Placed on {new Date(currentOrderData.created_at).toLocaleDateString()}</span>
            {orderStatus?.order_status !== 'confirmed' && (
              <div className="order-status-badge pending">
                Status: {orderStatus?.order_status || 'Processing'}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="confirmation-content">
          {/* Left Column */}
          <div className="confirmation-left">
            {/* Order Items */}
            <div className="order-section">
              <div className="section-header">
                <ShoppingBag size={20} />
                <h3>Order Items</h3>
              </div>
              <div className="order-items">
                {loading ? (
                  <div className="loading-items">Loading order items...</div>
                ) : cartSummary ? (
                  // Display cart summary items - assuming cartSummary has items array
                  // If cartSummary doesn't have detailed items, show summary
                  cartSummary.items && cartSummary.items.length > 0 ? (
                    cartSummary.items.map((item: any, index: number) => (
                      <div key={index} className="order-item">
                        <img src={item.image || '/phone1.png'} alt={item.name || 'Product'} className="item-image" />
                        <div className="item-details">
                          <h4>{item.name || 'Product'}</h4>
                          <div className="item-quantity">Qty: {item.quantity || 1}</div>
                          <div className="item-price">{formatNaira(item.price || 0)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback to summary if no detailed items
                    <div className="order-item">
                      <div className="item-details">
                        <h4>Purchased Items</h4>
                        <div className="item-quantity">Total Items: {cartSummary.total_items || 0}</div>
                        <div className="item-price">{formatNaira(cartSummary.subtotal || 0)}</div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="error-items">Failed to load order items</div>
                )}
              </div>
            </div>

            {/* Order Tracking */}
            <div className="order-section">
              <div className="section-header">
                <Truck size={20} />
                <h3>Track Your Order</h3>
              </div>
              <div className="tracking-info">
                <div className="tracking-message">
                  <p>Login to your account to track your order in real-time and receive updates on shipping status.</p>
                </div>
                <div className="tracking-actions">
                  <Link to="/login" className="track-order-btn">
                    Login to Track Order
                  </Link>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="order-section">
              <div className="section-header">
                <MapPin size={20} />
                <h3>Delivery Information</h3>
              </div>
              <div className="delivery-info">
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <div className="address-details">
                    <p><strong>{currentOrderData.first_name} {currentOrderData.last_name}</strong></p>
                    <p>{currentOrderData.street_address}</p>
                    <p>{currentOrderData.city}, {currentOrderData.state} {currentOrderData.postal_code}</p>
                    <p>{currentOrderData.country}</p>
                  </div>
                </div>
                <div className="customer-contact">
                  <h4>Contact Information:</h4>
                  <div className="contact-details">
                    <p><strong>Email:</strong> {currentOrderData.email}</p>
                    <p><strong>Phone:</strong> {currentOrderData.phone_number}</p>
                  </div>
                </div>
                <div className="estimated-delivery">
                  <h4>Estimated Delivery:</h4>
                  <p>2-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="confirmation-right">
            {/* Order Summary */}
            <div className="order-section">
              <h3>Order Summary</h3>
              <div className="order-summary">
                {loading ? (
                  <div className="loading-summary">Loading order summary...</div>
                ) : cartSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal ({cartSummary.total_items || 0} Items):</span>
                      <span>{formatNaira(cartSummary.subtotal || 0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>{formatNaira(cartSummary.tax_amount || 0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span className="free-shipping">Free</span>
                    </div>
                    {cartSummary.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount:</span>
                        <span>-{formatNaira(cartSummary.discount)}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{formatNaira(cartSummary.total || 0)}</span>
                    </div>
                    {cartSummary.total_usdt && (
                      <div className="summary-row crypto">
                        <span>Crypto Total:</span>
                        <span>{cartSummary.total_usdt.toLocaleString()} USDT</span>
                      </div>
                    )}
                    <div className="payment-method">
                      <span>Payment Method: {currentOrderData.order?.payment_method_display || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  <div className="error-summary">Failed to load order summary</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="order-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn download">
                  <Download size={16} />
                  Download Receipt
                </button>
                <button className="action-btn whatsapp">
                  <MessageCircle size={16} />
                  WhatsApp Support
                </button>
                <Link to="/home" className="action-btn continue">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="order-section help-section">
              <h3>Need Help?</h3>
              <p>Our customer support team is available 24/7 to help with your order.</p>
              <div className="contact-info">
                <div className="contact-item">
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/2349012345678">+234 901 234 5678</a>
                </div>
                <div className="contact-item">
                  <span>Email:</span>
                  <a href="mailto:support@bitgadgetz.com">support@bitgadgetz.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps from API */}
        {currentNextSteps && currentNextSteps.length > 0 && (
          <div className="next-steps-section">
            <h2>Next Steps</h2>
            <div className="next-steps-list">
              {currentNextSteps.map((step: string, index: number) => (
                <div key={index} className="next-step-item">
                  <CheckCircle size={20} />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div className="whats-next-section">
          <h2>What's Next?</h2>
          <div className="next-steps">
            <div className="next-step">
              <div className="step-icon order-updates">
                <Bell size={24} />
              </div>
              <h3>Order Updates</h3>
              <p>We'll send you updates via WhatsApp and email as your order progresses.</p>
            </div>

            <div className="next-step">
              <div className="step-icon fast-delivery">
                <Truck size={24} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Your order will be delivered within 2-3 business days in Lagos.</p>
            </div>

            <div className="next-step">
              <div className="step-icon quality-guarantee">
                <Shield size={24} />
              </div>
              <h3>Quality Guarantee</h3>
              <p>All products come with manufacturer warranty and our quality guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

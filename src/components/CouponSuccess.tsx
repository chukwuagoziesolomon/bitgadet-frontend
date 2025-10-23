import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conditionalApiRequest } from '../config/api';
import './CouponSuccess.css';

interface OrderDetails {
  id: string;
  order_number: string;
  total: number;
  status: string;
  coupon_code?: string;
  coupon_value?: number;
  created_at: string;
  customer_email: string;
  cart_items: Array<{
    product: {
      name: string;
      is_coupon: boolean;
      coupon_value?: number;
    };
    quantity: number;
    total_price: number;
  }>;
}

const CouponSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await conditionalApiRequest<OrderDetails>(`/api/orders/${orderId}/`);
        console.log('Order details:', data);
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCopyCouponCode = () => {
    if (orderDetails?.coupon_code) {
      navigator.clipboard.writeText(orderDetails.coupon_code);
      // You could add a toast notification here
    }
  };

  const handlePrintCoupon = () => {
    window.print();
  };

  const handleBackToShop = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="coupon-success-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your coupon details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="coupon-success-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Unable to Load Order</h2>
          <p>{error || 'Order not found'}</p>
          <button onClick={handleBackToShop} className="back-to-shop-btn">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const couponItems = orderDetails.cart_items.filter(item => item.product.is_coupon);
  const totalCouponValue = couponItems.reduce((sum, item) => 
    sum + (item.product.coupon_value || 0) * item.quantity, 0
  );

  return (
    <div className="coupon-success-container">
      <div className="coupon-success-content">
        {/* Header */}
        <div className="success-header">
          <div className="success-icon">🎉</div>
          <h1>Coupon Purchase Successful!</h1>
          <p className="success-message">
            Thank you for your purchase! Your gift coupon has been generated and sent to your email.
          </p>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="order-details">
            <div className="order-info">
              <span className="label">Order Number:</span>
              <span className="value">{orderDetails.order_number}</span>
            </div>
            <div className="order-info">
              <span className="label">Total Paid:</span>
              <span className="value">₦{orderDetails.total.toLocaleString()}</span>
            </div>
            <div className="order-info">
              <span className="label">Total Coupon Value:</span>
              <span className="value coupon-value">₦{totalCouponValue.toLocaleString()}</span>
            </div>
            <div className="order-info">
              <span className="label">Purchase Date:</span>
              <span className="value">
                {new Date(orderDetails.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Coupon Code Display */}
        {orderDetails.coupon_code && (
          <div className="coupon-code-card">
            <h2>Your Gift Coupon Code</h2>
            <div className="coupon-code-display">
              <div className="coupon-code">{orderDetails.coupon_code}</div>
              <button 
                onClick={handleCopyCouponCode}
                className="copy-btn"
                title="Copy coupon code"
              >
                📋 Copy
              </button>
            </div>
            <p className="coupon-instructions">
              Use this code during checkout to redeem your ₦{totalCouponValue.toLocaleString()} gift coupon value.
            </p>
          </div>
        )}

        {/* Email Confirmation */}
        <div className="email-confirmation-card">
          <div className="email-icon">📧</div>
          <div className="email-content">
            <h3>Check Your Email</h3>
            <p>
              We've sent your coupon code and purchase confirmation to{' '}
              <strong>{orderDetails.customer_email}</strong>
            </p>
            <p className="email-note">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handlePrintCoupon} className="print-btn">
            🖨️ Print Coupon
          </button>
          <button onClick={handleBackToShop} className="back-to-shop-btn">
            🛍️ Continue Shopping
          </button>
        </div>

        {/* Purchase Items */}
        <div className="purchased-items">
          <h3>Purchased Items</h3>
          {couponItems.map((item, index) => (
            <div key={index} className="purchased-item">
              <div className="item-details">
                <span className="item-name">{item.product.name}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
              </div>
              <div className="item-value">
                ₦{(item.product.coupon_value || 0).toLocaleString()} Value Each
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponSuccess;

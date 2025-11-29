import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Package, MapPin, Clock } from 'lucide-react';
import { checkoutService, OrderStatusResponse } from '../services/checkoutService';
import { formatNaira, getOrderStatusText } from '../utils/paymentUtils';
import './OrderSuccess.module.css';

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');
  const email = searchParams.get('email');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const orderData = await checkoutService.getOrderStatus(orderId, email || undefined);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Failed to load order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, email]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-container">
        <div className="error-state">
          <h1>Unable to Load Order</h1>
          <p>{error || 'Order not found'}</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="success-content">
        {/* Success Header */}
        <div className="success-header">
          <CheckCircle size={64} className="success-icon" />
          <h1>Order Confirmed!</h1>
          <p className="subtitle">Thank you for your purchase</p>
        </div>

        {/* Order ID */}
        <div className="order-id-section">
          <p className="order-id-label">Order ID</p>
          <p className="order-id-value">#{order.order_id}</p>
          <p className="order-date">
            Placed on {new Date(order.created_at).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <div className="details-grid">
            {/* Amount */}
            <div className="detail-item">
              <span className="detail-label">Total Amount</span>
              <span className="detail-value">{formatNaira(order.total_amount)}</span>
            </div>

              {/* (USDT shipping/discount removed here — shown only in checkout order summary) */}

            {/* Status */}
            <div className="detail-item">
              <span className="detail-label">Payment Status</span>
              <span className={`detail-value status-${order.status}`}>
                {getOrderStatusText(order.status)}
              </span>
            </div>

            {/* Payment Method */}
            <div className="detail-item">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value">{order.payment_method}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="shipping-info-section">
          <h2>
            <MapPin size={20} />
            Shipping To
          </h2>
          <div className="shipping-details">
            <p className="customer-name">
              {order.first_name} {order.last_name}
            </p>
            {order.address && <p className="address-line">{order.address}</p>}
            <p className="city-line">
              {order.city && order.state ? `${order.city}, ${order.state}` : order.city || order.state || ''}
            </p>
            <p className="email-line">
              <Mail size={16} />
              {order.email}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-section">
          <h2>
            <Clock size={20} />
            What's Next?
          </h2>
          <ul className="steps-list">
            <li>
              <span className="step-number">1</span>
              <span>Check your email for order confirmation</span>
            </li>
            <li>
              <span className="step-number">2</span>
              <span>You'll receive shipping updates via email</span>
            </li>
            <li>
              <span className="step-number">3</span>
              <span>Login to your account to track order status</span>
            </li>
            <li>
              <span className="step-number">4</span>
              <span>Order typically ships within 1-2 business days</span>
            </li>
          </ul>
        </div>

        {/* Bank Transfer Details (if applicable) */}
        {order.payment_method === 'bank_transfer' && (
          <div className="bank-transfer-section">
            <h2>
              <Package size={20} />
              Bank Transfer Reference
            </h2>
            <div className="transfer-details">
              <p className="reference-label">Payment Reference:</p>
              <p className="reference-value">{order.payment_reference || 'N/A'}</p>
              <p className="expires-label">Valid Until:</p>
              <p className="expires-value">
                {order.bank_transfer_expires_at
                  ? new Date(order.bank_transfer_expires_at).toLocaleString('en-NG')
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="account-info-section">
          <h2>Your Account</h2>
          <p className="account-message">
            A user account has been created for you. You can now login and track your orders.
          </p>
          <div className="account-credentials">
            <p className="credential-item">
              <span className="label">Email:</span>
              <span className="value">{order.email}</span>
            </p>
            <p className="credential-item credential-notice">
              Check your email for login instructions
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login to Account
          </button>
          <button
            onClick={() => navigate(`/order-tracking/${order.order_id}`)}
            className="btn-secondary"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="btn-outline"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

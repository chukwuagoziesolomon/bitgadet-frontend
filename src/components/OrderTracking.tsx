import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicApiRequest } from '../config/api';
import styles from './OrderTracking.module.css';

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SVG icons for tracking steps
  const checkIcon = (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="10.5" r="10.5" fill="#E5FFF1"/>
      <path d="M15.5 8l-4.2 4.25L7.5 10.5" stroke="#23b26d" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const grayCircle = (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="10.5" r="9.25" stroke="#d1dde8" strokeWidth="1.5" fill="#fff"/>
    </svg>
  );
  const processingIcon = (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="10.5" r="10.5" fill="#fff3cd"/>
      <path d="M10.5 6v3l2.5 2.5" stroke="#856404" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const trackOrder = async () => {
    if (!orderId || !email) {
      setError('Please provide both Order ID and Email');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await publicApiRequest<any>(`/api/v1/orders/track/${orderId}/?email=${encodeURIComponent(email)}`);
      setOrderData(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Network error. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', desc: 'Your order has been received and confirmed' },
      { key: 'payment_verified', label: 'Payment Verified', desc: 'Payment has been verified and processed' },
      { key: 'preparing', label: 'Preparing for Shipment', desc: 'Your items are being prepared for shipping' },
      { key: 'shipped', label: 'Shipped', desc: 'Your order is on the way' },
      { key: 'delivered', label: 'Delivered', desc: 'Your order has been delivered' }
    ];

    return steps.map(step => {
      let icon = grayCircle;
      let isComplete = false;
      let isCurrent = false;

      // Status mapping logic
      switch (status) {
        case 'paid':
        case 'confirmed':
          isComplete = ['confirmed', 'payment_verified'].includes(step.key);
          isCurrent = step.key === 'payment_verified';
          break;
        case 'processing':
          isComplete = step.key === 'confirmed';
          isCurrent = step.key === 'payment_verified';
          break;
        case 'preparing':
          isComplete = ['confirmed', 'payment_verified'].includes(step.key);
          isCurrent = step.key === 'preparing';
          break;
        case 'shipped':
        case 'in_transit':
          isComplete = ['confirmed', 'payment_verified', 'preparing', 'shipped'].includes(step.key);
          isCurrent = step.key === 'shipped';
          break;
        case 'delivered':
          isComplete = true;
          break;
        default:
          isComplete = step.key === 'confirmed';
          isCurrent = step.key === 'payment_verified';
      }

      if (isComplete) icon = checkIcon;
      else if (isCurrent) icon = processingIcon;

      return { ...step, icon, isComplete, isCurrent };
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.trackingCard}>
        <h1 className={styles.title}>Track Your Order</h1>
        
        {!orderData ? (
          <div className={styles.searchSection}>
            <div className={styles.inputGroup}>
              <label>Order ID</label>
              <input 
                type="text" 
                value={orderId || ''} 
                readOnly 
                className={styles.orderIdInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.emailInput}
              />
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <button 
              onClick={trackOrder} 
              disabled={loading}
              className={styles.trackButton}
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
        ) : (
          <div className={styles.orderDetails}>
            <div className={styles.orderHeader}>
              <h2>Order #{orderData.order_id}</h2>
              <div className={styles.statusBadge}>
                {orderData.current_status}
              </div>
            </div>
            
            <div className={styles.orderInfo}>
              <p><strong>Status:</strong> {orderData.status_description}</p>
              <p><strong>Order Date:</strong> {orderData.order_date}</p>
              <p><strong>Customer:</strong> {orderData.customer_name}</p>
              <p><strong>Total:</strong> ₦{Number(orderData.total_amount).toLocaleString()}</p>
            </div>

            <div className={styles.trackingSteps}>
              <h3>Order Progress</h3>
              {getTrackingSteps(orderData.current_status).map((step, index) => (
                <div key={step.key} className={styles.trackingStep}>
                  <span className={step.isComplete ? styles.completedIcon : styles.pendingIcon}>
                    {step.icon}
                  </span>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>{step.label}</div>
                    <div className={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setOrderData(null);
                setEmail('');
                setError(null);
              }}
              className={styles.newSearchButton}
            >
              Track Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

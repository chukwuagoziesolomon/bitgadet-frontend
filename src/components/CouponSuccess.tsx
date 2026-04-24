import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { conditionalApiRequest } from '../config/api';
import styles from './OrderConfirmation.module.css';

const CouponSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchCouponData(orderId);
    }
  }, [orderId]);

  const fetchCouponData = async (id: string) => {
    try {
      const response = await conditionalApiRequest<any>(`/api/v1/orders/coupon/${id}/`);
      setCouponData(response);
    } catch (error) {
      console.error('Failed to fetch coupon data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading coupon information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header/Hero */}
      <div className={styles.confirmHeaderWrapper}>
        <div className={styles.confirmIconCircle}>
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
            <circle cx="27" cy="27" r="27" fill="#E5FFF1"/>
            <path d="M36 21L25.5 31.5L21 27" stroke="#23b26d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.orderConfirmedText}>
          🎁 Coupon Purchase Successful!
        </div>
        <div className={styles.confirmSubhead}>
          Your coupon codes have been sent to your email
        </div>
        <div className={styles.confirmOrderLine}>
          <span className={styles.orderNumber}>Order #{orderId}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          {/* Coupon Information */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>🎫 Your Coupon Codes</div>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '30px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📧</div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Check Your Email!</h3>
                <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
                  Your coupon codes have been sent to your registered email address.
                  Please check your inbox (and spam folder) for the codes.
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e9ecef'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>What to expect:</h4>
                <ul style={{
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  <li>Unique coupon codes for each item purchased</li>
                  <li>Instructions on how to redeem your coupons</li>
                  <li>Expiration dates and terms of use</li>
                  <li>Customer support contact information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {couponData && (
            <div className={styles.card}>
              <div className={styles.sectionTitle}>Order Summary</div>
              <div className={styles.summaryRow}>
                <span>Order Total</span>
                <span className={styles.bold}>₦{couponData.total_amount?.toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Payment Method</span>
                <span className={styles.methodTag}>{couponData.payment_method}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Quick Actions</div>
            <button
              className={styles.downloadBtn}
              onClick={() => window.open('mailto:', '_blank')}
            >
              <span className={styles.downloadIcon}>
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                  <path d="M18 6L10 12L2 6V4L10 10L18 4V6Z" stroke="#2181e2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Open Email App
            </button>
            <a href="https://wa.me/2349138666111" target="_blank" rel="noopener noreferrer">
              <button className={styles.whatsappBtn}>
                <span className={styles.whatsappIcon}>
                  <svg width="18" height="18" viewBox="0 0 34 34" fill="none">
                    <circle cx="17" cy="17" r="17" fill="#25D366"/>
                    <path d="M23.19 19.87c-.34-.18-2.04-1-2.35-1.11-.3-.11-.52-.18-.74.18-.22.36-.85 1.11-1.05 1.33-.19.22-.39.24-.72.06-.34-.18-1.42-.52-2.71-1.66-1-1-.67-1.08-.49-1.27.16-.16.36-.39.54-.58.18-.2.24-.35.36-.57.12-.23.06-.42-.03-.6-.1-.17-.74-1.8-1-2.46-.26-.63-.53-.54-.73-.55-.19-.01-.41-.01-.63-.01-.22 0-.57.07-.87.32-.29.25-1.1 1.07-1.1 2.59s1.13 3.01 1.29 3.22c.16.22 2.23 3.56 5.45 4.42 3.23.86 3.23.57 3.82.54.59-.03 1.89-.77 2.16-1.54.28-.77.28-1.44.19-1.54-.08-.1-.3-.16-.63-.33z" fill="#fff"/>
                  </svg>
                </span>
                WhatsApp Support
              </button>
            </a>
            <button className={styles.continueBtn} onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>

          {/* Help Section */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Need Help?</div>
            <div className={styles.helpText}>
              If you don't receive your coupon codes within 10 minutes, please contact our support team.
            </div>
            <div className={styles.contactItem}>Email: <span className={styles.contactVal}>support@bitgadgetz.store</span></div>
            <div className={styles.contactItem}>WhatsApp: <span className={styles.contactVal}>+234 913 866 6111</span></div>
          </div>
        </div>
      </div>

      {/* What's Next Section */}
      <div className={styles.whatsNextCard}>
        <div className={styles.whatsNextTitle}>How to Use Your Coupons</div>
        <div className={styles.whatsNextGrid}>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#e5efff'}}>
              <span style={{ fontSize: '32px' }}>🎫</span>
            </div>
            <div className={styles.whatsNextLabel}>Copy Code</div>
            <div className={styles.whatsNextDesc}>Copy the coupon code from your email and paste it during checkout.</div>
          </div>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#e6fff1'}}>
              <span style={{ fontSize: '32px' }}>🛒</span>
            </div>
            <div className={styles.whatsNextLabel}>Apply at Checkout</div>
            <div className={styles.whatsNextDesc}>Enter the code in the coupon field during your next purchase.</div>
          </div>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#f6ebff'}}>
              <span style={{ fontSize: '32px' }}>⏰</span>
            </div>
            <div className={styles.whatsNextLabel}>Check Expiration</div>
            <div className={styles.whatsNextDesc}>Use your coupons before they expire. Check the email for validity dates.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponSuccess;

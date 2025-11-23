import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, Gift, Zap, ArrowRight } from 'lucide-react';
import { conditionalApiRequest } from '../config/api';
import './CouponSuccessBeautiful.css';

const CouponSuccessBeautiful: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [couponData, setCouponData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    if (orderId) {
      fetchCouponData(orderId);
    }
  }, [orderId, searchParams]);

  const fetchCouponData = async (id: string) => {
    try {
      const response = await conditionalApiRequest<any>(`/api/orders/coupon/${id}/`);
      setCouponData(response);
    } catch (error) {
      console.error('Failed to fetch coupon data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="coupon-success-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Preparing your celebration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coupon-success-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-gift">🎁</div>
        <div className="floating-star">⭐</div>
        <div className="floating-gift2">🎁</div>
      </div>

      {/* Main Content */}
      <div className="coupon-success-content">
        {/* Success Header */}
        <div className="success-header-section">
          <div className="success-icon-wrapper">
            <div className="icon-circle">
              <CheckCircle size={80} className="success-icon" />
            </div>
            <div className="confetti-animation"></div>
          </div>

          <h1 className="success-title">🎉 Congratulations!</h1>
          <p className="success-subtitle">Your coupon purchase was successful</p>

          {/* Order Number */}
          <div className="order-number-badge">
            <span className="badge-label">Order ID:</span>
            <span className="badge-value">#{orderId}</span>
          </div>
        </div>

        {/* Main Message Box */}
        <div className="message-box">
          <div className="message-icon">📧</div>
          <h2 className="message-title">Check Your Email for Your Codes</h2>
          <p className="message-text">
            Your exclusive coupon codes have been sent to
            <br />
            <strong className="email-highlight">{email || 'your registered email'}</strong>
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Unique Codes</h3>
            <p>Each product has its own unique coupon code</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Instructions</h3>
            <p>Clear redemption instructions included</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Validity Period</h3>
            <p>Check expiration dates in your email</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Safe & Secure</h3>
            <p>Your codes are confidential & secure</p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="what-to-expect">
          <h3 className="what-to-expect-title">📋 What You'll Find in Your Email:</h3>
          <ul className="expectations-list">
            <li>
              <span className="check-mark">✓</span>
              <span>Individual coupon codes for each item</span>
            </li>
            <li>
              <span className="check-mark">✓</span>
              <span>Step-by-step redemption guide</span>
            </li>
            <li>
              <span className="check-mark">✓</span>
              <span>Expiration dates and terms of use</span>
            </li>
            <li>
              <span className="check-mark">✓</span>
              <span>24/7 customer support contact</span>
            </li>
            <li>
              <span className="check-mark">✓</span>
              <span>Frequently asked questions</span>
            </li>
          </ul>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h3 className="tips-title">💡 Pro Tips:</h3>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-number">1</span>
              <div className="tip-content">
                <strong>Check Spam Folder</strong>
                <p>If you don't see the email in your inbox, please check your spam or promotions folder.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">2</span>
              <div className="tip-content">
                <strong>Save Your Codes</strong>
                <p>Save or screenshot your coupon codes for safekeeping.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">3</span>
              <div className="tip-content">
                <strong>Act Soon</strong>
                <p>Coupon codes have expiration dates, so redeem them as soon as possible.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="cta-section">
          <button
            className="btn btn-primary"
            onClick={() => {
              // Open email in new tab if possible
              if (email) {
                const domain = email.split('@')[1];
                window.open(`https://${domain}`, '_blank');
              }
            }}
          >
            <Mail size={20} />
            Open Email Provider
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/home')}>
            Continue Shopping
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Support Section */}
        <div className="support-section">
          <h4 className="support-title">Need Help?</h4>
          <p className="support-text">
            If you don't receive your coupon codes within 5 minutes, please contact our support team at
            <br />
            <strong>support@bitgadgetz.com</strong> or call <strong>+234 (0) XXX XXXX XXXX</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CouponSuccessBeautiful;

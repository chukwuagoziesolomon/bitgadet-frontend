import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, Headphones, X, CheckCircle, Copy } from 'lucide-react';
import { publicApiRequest, conditionalApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './Checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cryptoMethod, setCryptoMethod] = useState<string>('btc');
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const formatNaira = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  const formatUSD = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0 USDT';
    return `${amount.toLocaleString()} USDT`;
  };

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria'
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    instructions: '',
    termsAgreed: false,
    newsletter: true
  });

  useEffect(() => {
    fetchOrderSummary();
  }, []);

  const fetchOrderSummary = async () => {
    try {
      const data = await conditionalApiRequest<any>('/api/cart/summary/');
      setOrderSummary(data);
    } catch (error) {
      // Only log error if user is actually logged in (has token)
      const token = localStorage.getItem('authToken');
      if (token) {
        console.error('Failed to fetch order summary:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setAdditionalInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: customerInfo.firstName,
        last_name: customerInfo.lastName,
        email: customerInfo.email,
        phone_number: customerInfo.phone,
        street_address: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode,
        country: shippingAddress.country,
        payment_method: paymentMethod === 'card' ? 'credit_card' :
                      paymentMethod === 'bank' ? 'bank_transfer' :
                      paymentMethod === 'crypto' ? 'crypto' : 'credit_card',
        additional_info: additionalInfo.instructions,
        terms_agreed: additionalInfo.termsAgreed
      };

      const response = await conditionalApiRequest<any>('/api/checkout/create/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success) {
        console.log('🎉 Order created successfully, showing payment modal');
        handlePaymentMethod(response.payment_info);
      } else {
        // Handle validation errors and show toast notifications
        if (response.errors) {
          const errors = response.errors;

          // Handle non_field_errors specifically
          if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
            const nonFieldErrors = errors.non_field_errors.join(', ');
            showError('Validation Error', nonFieldErrors);
          } else {
            // Handle field-specific errors
            const errorMessages = Object.values(errors).flat().join(', ');
            showError('Validation Error', errorMessages);
          }
        } else if (response.message) {
          showError('Error', response.message);
        } else {
          showError('Error', 'There was an error processing your order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethod = (paymentInfo: any) => {
    console.log('🔥 handlePaymentMethod called with:', paymentInfo);
    const { payment_method } = paymentInfo;

    // Always show payment modal first
    setPaymentInfo(paymentInfo);
    setShowPaymentModal(true);
    console.log('✅ Modal should be visible now');

    switch(payment_method) {
      case 'credit_card':
        // For credit card, show modal with redirect button
        // User will click button to go to Paystack
        break;

      case 'bank_transfer':
        // Start polling for payment confirmation
        startPaymentPolling(paymentInfo.order_id);
        break;

      case 'crypto':
        // Start polling for payment confirmation
        startPaymentPolling(paymentInfo.order_id);
        break;
    }
  };

  const startPaymentPolling = (orderId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await conditionalApiRequest<any>(`/api/checkout/status/${orderId}/`);
        if (response.payment_status?.status === 'paid') {
          setPaymentStatus('paid');
          clearInterval(interval);
          setPollingInterval(null);
          // Navigate to order confirmation page with order data and login credentials
          navigate('/order-confirmation', {
            state: {
              orderData: response,
              loginCredentials: response.login_credentials,
              nextSteps: response.next_steps
            }
          });
        }
      } catch (error) {
        // Only log error if user is actually logged in (has token)
        const token = localStorage.getItem('authToken');
        if (token) {
          console.error('Failed to check payment status:', error);
        }
      }
    }, 1000); // Check every 1 second

    setPollingInterval(interval);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={20} /> Back to Cart
        </Link>
        <h1>Checkout</h1>
        <p className="checkout-subtitle">Complete your purchase securely and safely</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <section className="form-section">
            <h2>Customer Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={customerInfo.firstName}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={customerInfo.lastName}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {/* Credit/Debit Card */}
              <div 
                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="payment-method-header">
                  <div className="payment-method-radio">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'}
                      onChange={() => {}}
                    />
                    <div className="payment-icon">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNyZWRpdC1jYXJkLWljb24gbHVjaWRlLWNyZWRpdC1jYXJkIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHg9IjIiIHk9IjUiIHJ4PSIyIi8+PGxpbmUgeDE9IjIiIHgyPSIyMiIgeTE9IjEwIiB5Mj0iMTAiLz48L3N2Zz4=" 
                        alt="Credit Card"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span>Credit/Debit Card</span>
                  </div>
                </div>
                <div className="payment-logos">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>Verve</span>
                </div>
              </div>

              {/* Cryptocurrency */}
              <div 
                className={`payment-method ${paymentMethod === 'crypto' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <div className="payment-method-header">
                  <div className="payment-method-radio">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'crypto'}
                      onChange={() => {}}
                    />
                    <div className="payment-icon">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJpdGNvaW4taWNvbiBsdWNpZGUtYml0Y29pbiI+PHBhdGggZD0iTTExLjc2NyAxOS4wODljNC45MjQuODY4IDYuMTQtNi4wMjUgMS4yMTYtNi44OTRtLTEuMjE2IDYuODk0TDUuODYgMTguMDQ3bTUuOTA4IDEuMDQyLS4zNDcgMS45N20xLjU2My04Ljg2NGM0LjkyNC44NjkgNi4xNC02LjAyNSAxLjIxNS02Ljg5M20tMS4yMTUgNi44OTMtMy45NC0uNjk0bTUuMTU1LTYuMkw4LjI5IDQuMjZtNS45MDggMS4wNDIuMzQ4LTEuOTdNNy40OCAyMC4zNjRsMy4xMjYtMTcuNzI3Ii8+PC9zdmc+" 
                        alt="Cryptocurrency"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span>Cryptocurrency</span>
                  </div>
                  <span className="recommended-tag">Recommended</span>
                </div>
                
                {paymentMethod === 'crypto' && (
                  <div className="crypto-options">
                    <label className="crypto-option">
                      <input 
                        type="radio" 
                        name="crypto" 
                        value="btc"
                        checked={cryptoMethod === 'btc'}
                        onChange={() => setCryptoMethod('btc')}
                      />
                      <span className="crypto-option-text">Bitcoin (BTC)</span>
                    </label>
                    <label className="crypto-option">
                      <input 
                        type="radio" 
                        name="crypto" 
                        value="eth"
                        checked={cryptoMethod === 'eth'}
                        onChange={() => setCryptoMethod('eth')}
                      />
                      <span className="crypto-option-text">Ethereum (ETH)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Bank Transfer */}
              <div 
                className={`payment-method ${paymentMethod === 'bank' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <div className="payment-method-header">
                  <div className="payment-method-radio">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'bank'}
                      onChange={() => {}}
                    />
                    <div className="payment-icon">
                      <img 
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJhbmtub3RlLWljb24gbHVjaWRlLWJhbmtub3RlIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHg9IjIiIHk9IjYiIHJ4PSIyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIvPjxwYXRoIGQ9Ik02IDEyaC4wMU0xOCAxMmguMDEiLz48L3N2Zz4=" 
                        alt="Bank Transfer"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span>Bank Transfer</span>
                  </div>
                </div>
                <p className="bank-transfer-note">Direct Bank Transfer</p>
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                name="instructions"
                value={additionalInfo.instructions}
                onChange={handleAdditionalInfoChange}
                rows={4}
                placeholder="Any special instructions for your order..."
              ></textarea>
            </div>
          </section>

          <section className="info-section">
            <div className="info-item">
              <div className="info-icon">
                <Shield size={16} />
              </div>
              <div className="info-content">
                <h4>Secure Checkout</h4>
                <p>Your information is protected by SSL encryption</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Truck size={16} />
              </div>
              <div className="info-content">
                <h4>Fast Delivery</h4>
                <p>2-5 business days</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">
                <Headphones size={16} />
              </div>
              <div className="info-content">
                <h4>24/7 Support</h4>
                <p>Whatsapp & Telegram</p>
              </div>
            </div>
          </section>

          <div className="form-actions">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={additionalInfo.termsAgreed}
                onChange={handleAdditionalInfoChange}
                required
              />
              I agree to the <a href="/terms">Terms and Conditions</a>, and <a href="/privacy">Privacy Policy</a>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                checked={additionalInfo.newsletter}
                onChange={handleAdditionalInfoChange}
              />
              Subscribe to our newsletter for exclusive deals and updates
            </label>

            <button className="complete-order-btn" onClick={handleCompleteOrder} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Order...' : 'Complete Order'}
            </button>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="coupon-box">
            <input type="text" placeholder="Enter coupon code" />
            <button className="apply-btn">Apply</button>
          </div>
          
          <div className="order-details">
            {loading ? (
              <div className="loading-summary">Loading order summary...</div>
            ) : orderSummary ? (
              <>
                <div className="order-row">
                  <span>Subtotal ({orderSummary.total_items || 0} Items)</span>
                  <span>{formatNaira(orderSummary.subtotal)}</span>
                </div>
                <div className="order-row">
                  <span>Tax</span>
                  <span>{formatNaira(orderSummary.tax)}</span>
                </div>
                <div className="order-row">
                  <span>Shipping</span>
                  <span>{formatNaira(orderSummary.shipping)}</span>
                </div>
                {orderSummary.discount && orderSummary.discount > 0 && (
                  <div className="order-row discount">
                    <span>Discount</span>
                    <span>-{formatNaira(orderSummary.discount)}</span>
                  </div>
                )}
                <div className="order-total">
                  <span>Total</span>
                  <span>{formatNaira(orderSummary.total)}</span>
                </div>
                <div className="usdt-total">
                  ≈ {formatUSD(orderSummary.total_usdt)}
                </div>
              </>
            ) : (
              <div className="error-summary">Failed to load order summary</div>
            )}
          </div>

          <div className="shipping-info">
            <h4>Shipping Information</h4>
            <p>Your order will be processed and shipped within 24-48 hours. You'll receive a confirmation email with tracking details once your order is on its way.</p>
            <p>Estimated delivery: 2-5 business days</p>
          </div>

          <div className="guarantees">
            <div className="guarantee">
              <Shield size={20} />
              <span>Secure Payment</span>
            </div>
            <div className="guarantee">
              <Truck size={20} />
              <span>7-Day Returns</span>
            </div>
            <div className="guarantee">
              <Shield size={20} />
              <span>Authentic Products</span>
            </div>
            <div className="guarantee">
              <Headphones size={20} />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && paymentInfo && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowPaymentModal(false)}
            >
              <X size={24} />
            </button>

            <div className="modal-content">
              {/* Debug Info - Remove this after testing */}
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'red',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '300px',
                maxHeight: '200px',
                overflow: 'auto',
                borderRadius: '8px'
              }}>
                <strong>DEBUG INFO:</strong><br/>
                showPaymentModal: {showPaymentModal ? 'true' : 'false'}<br/>
                paymentInfo exists: {paymentInfo ? 'true' : 'false'}<br/>
                paymentInfo keys: {paymentInfo ? Object.keys(paymentInfo).join(', ') : 'none'}<br/>
                payment_method: {paymentInfo?.payment_method || 'undefined'}<br/>
                showSuccess: {paymentInfo?.showSuccess ? 'true' : 'false'}<br/>
                <br/>
                <strong>Full paymentInfo:</strong><br/>
                {JSON.stringify(paymentInfo, null, 2)}
              </div>
              {/* Debug Info - Remove this after testing */}
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'red',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                zIndex: 9999,
                maxWidth: '300px',
                maxHeight: '200px',
                overflow: 'auto',
                borderRadius: '8px'
              }}>
                <strong>DEBUG INFO:</strong><br/>
                showPaymentModal: {showPaymentModal ? 'true' : 'false'}<br/>
                paymentInfo exists: {paymentInfo ? 'true' : 'false'}<br/>
                paymentInfo keys: {paymentInfo ? Object.keys(paymentInfo).join(', ') : 'none'}<br/>
                payment_method: {paymentInfo?.payment_method || 'undefined'}<br/>
                showSuccess: {paymentInfo?.showSuccess ? 'true' : 'false'}<br/>
                <br/>
                <strong>Full paymentInfo:</strong><br/>
                {JSON.stringify(paymentInfo, null, 2)}
              </div>
              {paymentInfo.showSuccess ? (
                /* SUCCESS STATE */
                <div className="success-state">
                  <div className="success-header">
                    <div className="success-icon-wrapper">
                      <CheckCircle size={80} />
                      <div className="success-particles">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                      </div>
                    </div>
                    <h2 className="modal-title">🎉 Payment Successful!</h2>
                    <p className="modal-subtitle">Your order has been confirmed</p>
                  </div>

                  <div className="success-content">
                    {/* Account Information Card */}
                    {paymentInfo.login_credentials && (
                      <div className="info-card account-card">
                        <div className="card-header">
                          <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <h3>Your Account Created</h3>
                        </div>
                        <div className="card-content">
                          <div className="credential-row">
                            <span className="label">Email:</span>
                            <span className="value">{paymentInfo.login_credentials.email}</span>
                          </div>
                          <div className="credential-row">
                            <span className="label">Password:</span>
                            <div className="password-field">
                              <span className="value">{paymentInfo.login_credentials.password}</span>
                              <button
                                className="copy-btn"
                                onClick={() => navigator.clipboard.writeText(paymentInfo.login_credentials.password)}
                                title="Copy password"
                              >
                                <Copy size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="credential-note">{paymentInfo.login_credentials.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Next Steps Card */}
                    {paymentInfo.next_steps && (
                      <div className="info-card steps-card">
                        <div className="card-header">
                          <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11l3 3L22 4"></path>
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                          </div>
                          <h3>What's Next?</h3>
                        </div>
                        <div className="card-content">
                          <ul className="steps-list">
                            {paymentInfo.next_steps.map((step: string, index: number) => (
                              <li key={index} className="step-item">
                                <div className="step-number">{index + 1}</div>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="success-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/login')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10,17 15,12 10,7"></polyline>
                        <line x1="15" x2="3" y1="12" y2="12"></line>
                      </svg>
                      Login to Your Account
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate('/orders')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"></path>
                      </svg>
                      View Orders
                    </button>
                  </div>
                </div>
              ) : (
                /* PAYMENT PENDING STATE */
                <div className="payment-state">
                  <div className="payment-header">
                    <div className="payment-icon-wrapper">
                      <div className="payment-icon">
                        {paymentInfo.payment_method === 'bank_transfer' && '🏦'}
                        {paymentInfo.payment_method === 'crypto' && '₿'}
                        {paymentInfo.payment_method === 'credit_card' && '💳'}
                      </div>
                    </div>
                    <h2 className="modal-title">Complete Your Payment</h2>
                    <p className="modal-subtitle">Choose your preferred payment method</p>
                  </div>

                  <div className="payment-content">
                    {/* Payment Method Card */}
                    <div className="info-card payment-method-card">
                      <div className="card-header">
                        <div className="card-icon">
                          {paymentInfo.payment_method === 'bank_transfer' && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                          )}
                          {paymentInfo.payment_method === 'crypto' && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                              <path d="M12 17h.01"></path>
                            </svg>
                          )}
                          {paymentInfo.payment_method === 'credit_card' && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3>{paymentInfo.payment_method_display || paymentInfo.payment_method}</h3>
                          <p className="payment-amount">Total: ₦{paymentInfo.total_amount?.toLocaleString() || paymentInfo.amount_to_pay}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Transfer Details */}
                    {paymentInfo.payment_method === 'bank_transfer' && paymentInfo.account_details && (
                      <div className="info-card bank-details-card">
                        <div className="card-header">
                          <h3>Bank Transfer Details</h3>
                          <span className="status-badge">Required</span>
                        </div>
                        <div className="card-content">
                          <div className="bank-details-grid">
                            <div className="detail-item">
                              <span className="label">Amount to Pay:</span>
                              <span className="value highlight">₦{paymentInfo.account_details.amount_to_pay?.toLocaleString() || paymentInfo.amount_to_pay}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Bank Name:</span>
                              <span className="value">{paymentInfo.account_details.bank_name}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Account Name:</span>
                              <span className="value">{paymentInfo.account_details.account_name}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Account Number:</span>
                              <div className="account-number-field">
                                <span className="value">{paymentInfo.account_details.account_number}</span>
                                <button
                                  className="copy-btn"
                                  onClick={() => navigator.clipboard.writeText(paymentInfo.account_details.account_number)}
                                  title="Copy account number"
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {paymentInfo.account_details.expires_in && (
                            <div className="expiry-notice">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                              </svg>
                              Expires in: {paymentInfo.account_details.expires_in}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Crypto Payment Details */}
                    {paymentInfo.payment_method === 'crypto' && (
                      <div className="info-card crypto-details-card">
                        <div className="card-header">
                          <h3>Cryptocurrency Payment</h3>
                          <span className="status-badge recommended">Fast & Secure</span>
                        </div>
                        <div className="card-content">
                          <div className="crypto-details">
                            <div className="detail-item">
                              <span className="label">Amount:</span>
                              <span className="value highlight">{paymentInfo.expected_amount} {paymentInfo.currency}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Network:</span>
                              <span className="value">{paymentInfo.network}</span>
                            </div>
                            <div className="detail-item">
                              <span className="label">Wallet Address:</span>
                              <div className="wallet-address-field">
                                <span className="value">{paymentInfo.wallet_address}</span>
                                <button
                                  className="copy-btn"
                                  onClick={() => navigator.clipboard.writeText(paymentInfo.wallet_address)}
                                  title="Copy wallet address"
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {paymentInfo.qr_code_url && (
                            <div className="qr-section">
                              <p className="qr-label">Scan QR Code</p>
                              <div className="qr-container">
                                <img src={paymentInfo.qr_code_url} alt="Payment QR Code" className="qr-code" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Credit Card Payment */}
                    {paymentInfo.payment_method === 'credit_card' && (
                      <div className="info-card card-details-card">
                        <div className="card-header">
                          <h3>Card Payment</h3>
                          <span className="status-badge">Secure</span>
                        </div>
                        <div className="card-content">
                          <p className="card-instructions">{paymentInfo.instructions}</p>
                          <button className="btn btn-primary card-payment-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                              <line x1="2" y1="10" x2="22" y2="10"></line>
                            </svg>
                            Proceed to Secure Payment
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Payment Status */}
                    <div className="info-card status-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                          </svg>
                        </div>
                        <h3>Payment Status</h3>
                      </div>
                      <div className="card-content">
                        <div className="status-indicator">
                          <div className={`status-dot ${paymentStatus === 'paid' ? 'success' : 'pending'}`}></div>
                          <span className={`status-text ${paymentStatus}`}>
                            {paymentStatus === 'paid' ? 'Payment Confirmed' : 'Waiting for Payment'}
                          </span>
                        </div>
                        {paymentStatus === 'pending' && (
                          <p className="status-note">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="loading-icon">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                                <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" values="31.416;0" />
                              </circle>
                            </svg>
                            Checking payment status every second...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="info-card instructions-card">
                      <div className="card-header">
                        <div className="card-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <path d="M12 17h.01"></path>
                          </svg>
                        </div>
                        <h3>Payment Instructions</h3>
                      </div>
                      <div className="card-content">
                        <div className="instructions-content">
                          {paymentInfo.account_details?.instructions || paymentInfo.instructions || 'Please complete your payment using the details above.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="payment-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary confirm-payment-btn"
                      onClick={() => navigate('/order-confirmation')}
                      disabled={paymentStatus !== 'paid'}
                    >
                      {paymentStatus === 'paid' ? (
                        <>
                          <CheckCircle size={20} />
                          View Order Confirmation
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                          </svg>
                          Confirm Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

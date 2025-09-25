import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, Headphones, X, CheckCircle, Copy } from 'lucide-react';
import { apiRequest } from '../config/api';
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
      const data = await apiRequest<any>('/api/cart/summary/');
      setOrderSummary(data);
    } catch (error) {
      console.error('Failed to fetch order summary:', error);
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

      const response = await apiRequest<any>('/api/checkout/create/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.success) {
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
    const { payment_method } = paymentInfo;

    // Always show payment modal first
    setPaymentInfo(paymentInfo);
    setShowPaymentModal(true);

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
        const response = await apiRequest<any>(`/api/checkout/status/${orderId}/`);
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
        console.error('Failed to check payment status:', error);
      }
    }, 10000); // Check every 10 seconds

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
                  <span>Subtotal ({orderSummary.total_items} Items)</span>
                  <span>₦{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="order-row">
                  <span>Tax</span>
                  <span>₦{orderSummary.tax_amount.toLocaleString()}</span>
                </div>
                <div className="order-row">
                  <span>Shipping</span>
                  <span>₦0</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="order-row discount">
                    <span>Discount</span>
                    <span>-₦{orderSummary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="order-total">
                  <span>Total</span>
                  <span>₦{orderSummary.total.toLocaleString()}</span>
                </div>
                <div className="usdt-total">
                  ≈ {orderSummary.total_usdt.toLocaleString()} USDT
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
              {paymentInfo.showSuccess ? (
                <>
                  <div className="success-icon">
                    <CheckCircle size={64} />
                  </div>

                  <h2 className="modal-title">Payment Confirmed!</h2>

                  <p className="modal-message">
                    {paymentInfo.message}
                  </p>

                  {paymentInfo.login_credentials && (
                    <div className="login-credentials">
                      <h3>Your Account Details</h3>
                      <div className="credential-item">
                        <strong>Email:</strong> {paymentInfo.login_credentials.email}
                      </div>
                      <div className="credential-item">
                        <strong>Password:</strong>
                        <div className="address-container">
                          <span>{paymentInfo.login_credentials.password}</span>
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(paymentInfo.login_credentials.password)}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="credential-note">{paymentInfo.login_credentials.message}</p>
                    </div>
                  )}

                  {paymentInfo.next_steps && (
                    <div className="next-steps">
                      <h3>Next Steps</h3>
                      <ul>
                        {paymentInfo.next_steps.map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="success-icon">
                    <CheckCircle size={64} />
                  </div>

                  <h2 className="modal-title">Order Created Successfully!</h2>

                  <p className="modal-message">
                    Your order has been created. Please complete your payment using the details below.
                  </p>

                  {paymentInfo.payment_method === 'crypto' && (
                    <div className="payment-details">
                      <h3>Cryptocurrency Payment</h3>
                      <div className="payment-info-item">
                        <strong>Amount:</strong> {paymentInfo.expected_amount} {paymentInfo.currency}
                      </div>
                      <div className="payment-info-item">
                        <strong>Network:</strong> {paymentInfo.network}
                      </div>
                      <div className="payment-info-item">
                        <strong>Wallet Address:</strong>
                        <div className="address-container">
                          <span>{paymentInfo.wallet_address}</span>
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(paymentInfo.wallet_address)}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      {paymentInfo.qr_code_url && (
                        <div className="qr-code">
                          <img src={paymentInfo.qr_code_url} alt="Payment QR Code" />
                        </div>
                      )}
                      <div className="payment-instructions">
                        <strong>Instructions:</strong>
                        <p>{paymentInfo.instructions}</p>
                      </div>
                      <div className="payment-status">
                        <p>Payment Status: <span className={`status-${paymentStatus}`}>{paymentStatus}</span></p>
                        {paymentStatus === 'pending' && <p>Checking payment status every 10 seconds...</p>}
                      </div>
                    </div>
                  )}

                  {paymentInfo.payment_method === 'bank_transfer' && (
                    <div className="payment-details">
                      <h3>Bank Transfer</h3>
                      <div className="payment-info-item">
                        <strong>Amount:</strong> ₦{paymentInfo.account_details?.amount_to_pay || paymentInfo.amount_to_pay}
                      </div>
                      <div className="payment-info-item">
                        <strong>Bank Name:</strong> {paymentInfo.account_details?.bank_name}
                      </div>
                      <div className="payment-info-item">
                        <strong>Account Name:</strong> {paymentInfo.account_details?.account_name}
                      </div>
                      <div className="payment-info-item">
                        <strong>Account Number:</strong>
                        <div className="address-container">
                          <span>{paymentInfo.account_details?.account_number}</span>
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(paymentInfo.account_details?.account_number)}
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      {paymentInfo.account_details?.expires_in && (
                        <div className="payment-info-item">
                          <strong>Expires:</strong> {paymentInfo.account_details.expires_in}
                        </div>
                      )}
                      <div className="payment-instructions">
                        <strong>Instructions:</strong>
                        <p>{paymentInfo.account_details?.instructions || paymentInfo.instructions}</p>
                      </div>
                      <div className="payment-status">
                        <p>Payment Status: <span className={`status-${paymentStatus}`}>{paymentStatus}</span></p>
                        {paymentStatus === 'pending' && <p>Checking payment status every 10 seconds...</p>}
                      </div>
                    </div>
                  )}

                  {paymentInfo.payment_method === 'credit_card' && (
                    <div className="payment-details">
                      <h3>Debit/Credit Card Payment</h3>
                      <p>{paymentInfo.instructions}</p>
                      <button className="payment-gateway-btn">
                        Proceed to Payment Gateway
                      </button>
                    </div>
                  )}
                </>
              )}

              <div className="modal-actions">
                {!paymentInfo.showSuccess && (
                  <button
                    className="modal-primary-btn"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Close
                  </button>
                )}
                {paymentInfo.showSuccess && (
                  <button
                    className="modal-primary-btn"
                    onClick={() => navigate('/login')}
                  >
                    Login to Account
                  </button>
                )}
                <button
                  className="modal-secondary-btn"
                  onClick={() => navigate('/orders')}
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

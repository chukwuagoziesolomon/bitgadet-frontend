import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingBag from './icons/ShoppingBag';
import Gamepad2 from './icons/Gamepad2';
import ShoppingCart from './icons/ShoppingCart';
import './PaymentDetails.css';


const PaymentDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data from Checkout component state
  const orderData = location.state?.orderData;
  const paymentInfo = location.state?.paymentInfo;
  const accountInfo = location.state?.accountInfo;
  const paymentMethod = location.state?.paymentMethod;

  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Check if we have the required data from Checkout
    if (!orderData || !paymentInfo) {
      setError('Order data or payment information missing!');
      setLoading(false);
      return;
    }

    // Set the payment data directly from the API response
    setPaymentData({
      order: orderData,
      payment_info: paymentInfo,
      account_info: accountInfo
    });
        setLoading(false);
  }, [orderData, paymentInfo, accountInfo]);

  // Auto-redirect for card payments
  useEffect(() => {
    if (paymentData && paymentData.payment_details?.payment_method === 'card' && paymentData.payment_details.authorization_url) {
      window.open(paymentData.payment_details.authorization_url, '_blank');
    }
  }, [paymentData]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!paymentData?.payment_info?.order_id || !paymentData?.order?.email) {
      setError('Order ID or Email missing!');
      return;
    }
    setError(null);
    setConfirming(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/api/checkout/confirm-payment/${paymentData.payment_info.order_id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: paymentData.order.email }),
      });
      const data = await response.json();
      navigate('/order-confirmation', { state: { orderConfirmation: data } });
    } catch (err) {
      setError('Failed to confirm payment. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="payment-details-container">
      <div className="payment-details-overlay">
        <div className="payment-details-card">
          {/* Modern Header with Gradient */}
          <div className="payment-header">
            <div className="payment-icon-wrapper">
              <div className="payment-icon">
                <ShoppingCart />
              </div>
              <div className="payment-status-badge">
                <span className="status-dot"></span>
                <span>Secure Payment</span>
              </div>
            </div>
            <h1>Complete Your Payment</h1>
            <p>Your order is ready for payment. Follow the instructions below to complete your purchase.</p>
          </div>

          <div className="payment-content">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading payment details...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3>Payment Error</h3>
                <p>{error}</p>
              </div>
            ) : paymentData ? (
              <>
                {/* Order Summary Card */}
                <div className="order-summary-card">
                  <div className="order-header">
                    <h3>Order Summary</h3>
                    <div className="order-id-badge">
                      <span>Order ID: {paymentData.payment_info.order_id}</span>
                    </div>
                  </div>
                  <div className="order-amount">
                    <span className="amount-label">Total Amount</span>
                    <span className="amount-value">₦{paymentData.payment_info.total_amount?.toLocaleString()}</span>
                  </div>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="payment-method-card bank-transfer">
                    <div className="method-header">
                      <div className="method-icon">
                        <ShoppingBag />
                      </div>
                      <div className="method-info">
                        <h2>Bank Transfer</h2>
                        <p>Transfer funds to our dedicated account</p>
                      </div>
                    </div>

                    <div className="bank-details-grid">
                      <div className="bank-detail-card">
                        <label>Account Number</label>
                        <div className="detail-input-group">
                          <input 
                            type="text" 
                            value={paymentData.order.dedicated_account_number} 
                            readOnly 
                            className="detail-input"
                          />
                          <button
                            className="copy-btn"
                            onClick={() => handleCopy(paymentData.order.dedicated_account_number, 'account')}
                          >
                            {copied === 'account' ? '✓' : '📋'}
                          </button>
                        </div>
                      </div>

                      <div className="bank-detail-card">
                        <label>Account Name</label>
                        <div className="detail-input">
                          {paymentData.order.dedicated_account_name}
                        </div>
                      </div>

                      <div className="bank-detail-card">
                        <label>Bank Name</label>
                        <div className="detail-input">
                          {paymentData.order.dedicated_bank_name}
                        </div>
                      </div>

                      <div className="bank-detail-card amount-card">
                        <label>Amount to Transfer</label>
                        <div className="amount-display">
                          ₦{paymentData.payment_info.total_amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="payment-instructions">
                      <div className="instructions-header">
                        <span className="instruction-icon">💡</span>
                        <h4>Payment Instructions</h4>
                      </div>
                      <div className="instructions-list">
                        <div className="instruction-item">
                          <span className="step-number">1</span>
                          <span>Transfer the exact amount to the account above</span>
                        </div>
                        <div className="instruction-item">
                          <span className="step-number">2</span>
                          <span>Use your Order ID as the transfer reference</span>
                        </div>
                        <div className="instruction-item">
                          <span className="step-number">3</span>
                          <span>Click "Confirm Payment" after transferring</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="payment-method-card crypto-payment">
                    <div className="method-header">
                      <div className="method-icon">
                        <Gamepad2 />
                      </div>
                      <div className="method-info">
                        <h2>Cryptocurrency Payment</h2>
                        <p>Pay with Bitcoin, Ethereum, or other cryptocurrencies</p>
                      </div>
                    </div>

                    <div className="crypto-details">
                      <div className="crypto-wallet-section">
                        <label>Wallet Address</label>
                        <div className="wallet-address-input">
                          <input 
                            type="text" 
                            value="Cryptocurrency payment details will be provided here" 
                            readOnly 
                            className="wallet-input"
                          />
                          <button className="copy-btn">
                            📋
                          </button>
                        </div>
                      </div>

                      <div className="crypto-amount-section">
                        <div className="amount-card">
                          <span className="amount-label">Amount to Pay</span>
                          <span className="amount-value">₦{paymentData.payment_info.total_amount?.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="crypto-instructions">
                        <div className="instructions-header">
                          <span className="instruction-icon">🔐</span>
                          <h4>Payment Instructions</h4>
                        </div>
                        <div className="instructions-list">
                          <div className="instruction-item">
                            <span className="step-number">1</span>
                            <span>Send the exact amount to the wallet address above</span>
                          </div>
                          <div className="instruction-item">
                            <span className="step-number">2</span>
                            <span>Include your Order ID in the transaction memo</span>
                          </div>
                          <div className="instruction-item">
                            <span className="step-number">3</span>
                            <span>Wait for blockchain confirmation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="payment-method-card card-payment">
                    <div className="method-header">
                      <div className="method-icon">
                        <ShoppingBag />
                      </div>
                      <div className="method-info">
                        <h2>Card Payment</h2>
                        <p>Secure payment with your credit or debit card</p>
                      </div>
                    </div>

                    <div className="card-payment-section">
                      <div className="card-processing">
                        <div className="processing-icon">
                          <div className="spinner"></div>
                        </div>
                        <h3>Processing Your Payment</h3>
                        <p>Your card payment is being processed securely. Please wait for confirmation.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Information Card */}
                {paymentData.account_info && (
                  <div className="account-info-card">
                    <div className="account-header">
                      <div className="account-icon">👤</div>
                      <div className="account-title">
                        <h3>Your Account</h3>
                        <p>Account credentials for order tracking</p>
                      </div>
                    </div>

                    <div className="account-credentials">
                      <div className="credential-item">
                        <label>Email Address</label>
                        <div className="credential-value">
                          {paymentData.account_info.email}
                        </div>
                      </div>
                      <div className="credential-item">
                        <label>Generated Password</label>
                        <div className="credential-input-group">
                          <input 
                            type="text" 
                            value={paymentData.account_info.generated_password} 
                            readOnly 
                            className="credential-input"
                          />
                          <button
                            className="copy-btn"
                            onClick={() => handleCopy(paymentData.account_info.generated_password, 'password')}
                          >
                            {copied === 'password' ? '✓' : '📋'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="account-message">
                      <div className="message-icon">ℹ️</div>
                      <p>{paymentData.account_info.message}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-api-data">
                <div className="warning-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Payment Details Not Available
                </div>
                <p className="fallback-message">
                  Unable to load payment details. Please try again or contact support.
                </p>
              </div>
            )}
          </div>

          {/* Modern Action Buttons */}
          <div className="payment-actions">
            <button 
              className="back-button" 
              onClick={() => navigate('/checkout')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12,19 5,12 12,5"></polyline>
              </svg>
              Back to Checkout
            </button>
            <button
              className="confirm-payment-btn"
              onClick={handleConfirmPayment}
              disabled={confirming}
            >
              {confirming ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    <path d="M13 12h3a2 2 0 0 1 2 2v1"></path>
                    <path d="M9 12H6a2 2 0 0 0-2 2v1"></path>
                  </svg>
                  Confirm Payment
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-toast">
              <div className="error-icon">⚠️</div>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;

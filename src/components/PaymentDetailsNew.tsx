import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingBag from './icons/ShoppingBag';
import Gamepad2 from './icons/Gamepad2';
import ShoppingCart from './icons/ShoppingCart';
import { Copy, Check, AlertTriangle, Lightbulb, Lock, User, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { publicApiRequest } from '../config/api';
import { cartService } from '../services/cartService';
import { paymentService } from '../services/paymentService';
import type { PaymentVerificationResult } from '../services/paymentService';
import './PaymentDetails.css';


const PaymentDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

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
  const [pollingActive, setPollingActive] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);

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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up payment polling on component unmount');
      paymentService.stopAllPolling();
    };
  }, []);

  // Stop polling when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🧹 Stopping payment polling before page unload');
      paymentService.stopAllPolling();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleCopy = (text: string, label: string, key?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    // use a short key to control which icon shows the check
    if (key) setCopied(key);
    else setCopied(label);
    showSuccess('Copied!', `${label} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!paymentData?.order_id) {
      setError('Order ID missing!');
      return;
    }

    // Stop any existing polling
    paymentService.stopAllPolling();

    setError(null);
    setConfirming(true);
    setVerificationResult(null);

    try {
      // Start polling based on payment method
      setPollingActive(true);

      const pollingOptions = {
        interval: paymentMethod === 'bank' ? 10000 : paymentService.getPollingInterval(paymentMethod), // 10 seconds for bank transfers
        maxAttempts: 100, // Reasonable limit
        onUpdate: (result: PaymentVerificationResult) => {
          console.log('🔄 Payment verification update:', result);
          setVerificationResult(result);

          // Show status updates to user
          if (result.status === 'confirming' || result.status === 'pending') {
            showSuccess(`Payment status: ${result.status}`, 'Checking payment...');
          }
        },
        onComplete: (result: PaymentVerificationResult) => {
          console.log('🏁 Payment verification completed:', result);
          setPollingActive(false);
          setVerificationResult(result);

          if (result.success) {
            // Clear cart token on successful payment
            console.log('✅ Payment successful, clearing cart token');
            cartService.clearCartToken();

            // Handle login credentials if provided
            if (result.data?.login_credentials) {
              showSuccess('Login credentials sent to your email!', 'Check your inbox');
            }

            // Handle coupon details if provided
            if (result.data?.coupon_details) {
              showSuccess(result.data.coupon_details.message, 'Coupon details');
            }

            // Navigate to order confirmation
            navigate('/order-confirmation', {
              state: {
                orderConfirmation: result.data,
                paymentMethod: paymentMethod
              }
            });
          } else {
            // Handle failure
            const errorMsg = result.error || `Payment ${result.status}`;
            setError(errorMsg);
            showSuccess(`Payment ${result.status}`, 'Please try again or contact support');
          }
        },
        onError: (error: any) => {
          console.error('❌ Payment verification error:', error);
          setPollingActive(false);
          setError('Payment verification failed. Please try again.');
        }
      };

      // Start polling with appropriate identifier
      let identifier: string;
      let method: 'paystack' | 'crypto' | 'bank';

      switch (paymentMethod) {
        case 'card':
          method = 'paystack';
          identifier = paymentData.reference || paymentData.order_id;
          break;
        case 'crypto':
          method = 'crypto';
          identifier = paymentData.payment_id || paymentData.order_id;
          break;
        case 'bank':
          method = 'bank';
          identifier = paymentData.order_id;
          break;
        default:
          throw new Error(`Unknown payment method: ${paymentMethod}`);
      }

      console.log(`🚀 Starting ${method} verification polling for identifier: ${identifier}`);
      paymentService.startPolling(method, identifier, pollingOptions);

    } catch (err: any) {
      console.error('❌ Failed to initiate payment verification:', err);
      setError(err.message || 'Failed to start payment verification. Please try again.');
      setPollingActive(false);
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
                <div className="error-icon"><AlertTriangle /></div>
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
                      <span>Order ID: {paymentData.order_id || paymentData.payment_info?.order_id}</span>
                    </div>
                  </div>
                  <div className="order-amount">
                    <span className="amount-label">Total Amount</span>
                    <span className="amount-value">{paymentData.currency_symbol || '₦'}{paymentData.total_amount?.toLocaleString() || paymentData.payment_info?.total_amount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Polling Status */}
                {pollingActive && verificationResult && (
                  <div className="polling-status-card">
                    <div className="polling-header">
                      <div className="polling-icon">
                        <div className="polling-spinner"></div>
                      </div>
                      <div className="polling-info">
                        <h3>Verifying Payment</h3>
                        <p>Status: {verificationResult.status}</p>
                      </div>
                    </div>
                    <div className="polling-message">
                      <p>Please wait while we verify your payment. This may take a few moments.</p>
                    </div>
                  </div>
                )}

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
                            value={paymentData.account_details?.account_number || paymentData.order?.dedicated_account_number}
                            readOnly
                            className="detail-input"
                          />
                          <button
                            className="copy-btn"
                            onClick={() => handleCopy(paymentData.account_details?.account_number || paymentData.order?.dedicated_account_number, 'Account Number', 'account')}
                          >
                            {copied === 'account' ? <Check /> : <Copy />}
                          </button>
                        </div>
                      </div>

                      <div className="bank-detail-card">
                        <label>Account Name</label>
                        <div className="detail-input">
                          {paymentData.account_details?.account_name || paymentData.order?.dedicated_account_name}
                        </div>
                      </div>

                      <div className="bank-detail-card">
                        <label>Bank Name</label>
                        <div className="detail-input">
                          {paymentData.account_details?.bank_name || paymentData.order?.dedicated_bank_name}
                        </div>
                      </div>

                      <div className="bank-detail-card amount-card">
                        <label>Amount to Transfer</label>
                        <div className="amount-display">
                          {paymentData.currency_symbol || '₦'}{paymentData.account_details?.amount_to_pay?.toLocaleString() || paymentData.total_amount?.toLocaleString() || paymentData.payment_info?.total_amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="payment-instructions">
                      <div className="instructions-header">
                        <span className="instruction-icon"><Lightbulb /></span>
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
                          <span>Click "I've Made the Transfer" after transferring</span>
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
                        <p>Pay with {paymentData.currency} on {paymentData.network} network</p>
                      </div>
                    </div>

                    <div className="crypto-details">
                      <div className="crypto-wallet-section">
                        <label>Wallet Address</label>
                        <div className="wallet-address-input">
                          <input
                            type="text"
                            value={paymentData.wallet_address || paymentData.payment_info?.wallet_address || 'N/A'}
                            readOnly
                            className="wallet-input"
                          />
                          <button
                            className="copy-btn"
                            onClick={() => handleCopy(paymentData.wallet_address || paymentData.payment_info?.wallet_address, 'Wallet Address', 'wallet')}
                          >
                            {copied === 'wallet' ? <Check /> : <Copy />}
                          </button>
                        </div>
                      </div>

                      <div className="crypto-info-grid">
                        <div className="crypto-detail-card">
                          <label>Network</label>
                          <div className="detail-input">
                            {paymentData.network || paymentData.blockchain || paymentData.payment_info?.network || 'N/A'}
                          </div>
                        </div>

                        <div className="crypto-detail-card">
                          <label>Currency</label>
                          <div className="detail-input">
                            {paymentData.currency || paymentData.payment_info?.currency || 'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="crypto-amount-section">
                        <div className="amount-card">
                          <span className="amount-label">Expected Amount</span>
                          <span className="amount-value">{paymentData.expected_amount?.toFixed(6) || paymentData.total_amount_usdt?.toFixed(6) || paymentData.payment_info?.expected_amount?.toFixed(6)} {paymentData.currency || paymentData.payment_info?.currency}</span>
                        </div>
                      </div>

                      <div className="crypto-instructions">
                        <div className="instructions-header">
                          <span className="instruction-icon"><Lock /></span>
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
                        <h3>Ready for Payment</h3>
                        <p>{paymentData.instructions || 'Click "Confirm Payment" to proceed with your card payment securely.'}</p>
                        {paymentData.features && (
                          <div className="card-features">
                            {paymentData.features.map((feature: string, index: number) => (
                              <div key={index} className="feature-item">
                                <span className="feature-check">✓</span>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Information Card */}
                {paymentData.account_info && (
                  <div className="account-info-card">
                    <div className="account-header">
                      <div className="account-icon"><User /></div>
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
                            onClick={() => handleCopy(paymentData.account_info.generated_password, 'Password', 'password')}
                          >
                            {copied === 'password' ? <Check /> : <Copy />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="account-message">
                      <div className="message-icon"><Info /></div>
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
              disabled={confirming || pollingActive}
            >
              {confirming ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : pollingActive ? (
                <>
                  <div className="btn-spinner"></div>
                  Verifying Payment...
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
                  {paymentMethod === 'bank' ? "I've Made the Transfer" : 'Confirm Payment'}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-toast">
              <div className="error-icon"><AlertTriangle /></div>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
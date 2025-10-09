import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShoppingBag from './icons/ShoppingBag';
import Gamepad2 from './icons/Gamepad2';
import ShoppingCart from './icons/ShoppingCart';
import './PaymentDetails.css';


const PaymentDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentMethod = location.state?.paymentMethod || 'bank';
  const cryptoType = location.state?.cryptoType || 'btc';

  // Get data from API response
  const orderData = location.state?.orderData;
  const paymentInfo = location.state?.paymentInfo;
  const accountInfo = location.state?.accountInfo;

  const [copied, setCopied] = useState<string | null>(null);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<any[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // Fetch enabled cryptocurrencies from API
    fetch('/api/payments/crypto/currencies/')
      .then(response => response.json())
      .then(data => {
        if (data.currencies) {
          setCryptoCurrencies(data.currencies);
        }
      })
      .catch(error => {
        console.error('Error fetching crypto currencies:', error);
      });
  }, []);

  // Auto-redirect for credit card payments
  React.useEffect(() => {
    if (paymentInfo && paymentMethod === 'card' && paymentInfo.payment_method === 'credit_card' && paymentInfo.gateway_url) {
      // Auto-redirect to credit card payment gateway
      window.open(paymentInfo.gateway_url, '_blank');
    }
  }, [paymentInfo, paymentMethod]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Find order_id and customer email from state or inputs; fallback if needed
  const orderId = paymentInfo?.order_id;
  const customerEmail = paymentInfo?.customer_email || (orderData && orderData.email);

  const handleConfirmPayment = async () => {
    if (!orderId || !customerEmail) {
      setError('Order ID or Email missing!');
      return;
    }
    setError(null);
    setConfirming(true);
    try {
      const response = await fetch(`/api/checkout/confirm-payment/${orderId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customerEmail }),
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
          <div className="payment-header">
            <div className="payment-icon"><ShoppingCart /></div>
            <h1>Payment Details</h1>
            <p>Complete your payment securely</p>
          </div>

          <div className="payment-content">
            {paymentInfo ? (
              // Display dynamic payment info from API
              <>
                {paymentMethod === 'crypto' && paymentInfo.payment_method === 'crypto' && (
                  <div className="payment-section">
                    <h2><Gamepad2 /> Cryptocurrency Payment</h2>
                    <div className="order-info">
                      <div className="order-detail">
                        <strong>Order ID:</strong> {paymentInfo.order_id}
                      </div>
                      <div className="order-detail">
                        <strong>Payment ID:</strong> {paymentInfo.payment_id}
                      </div>
                      <div className="order-detail">
                        <strong>Amount:</strong> ₦{paymentInfo.total_amount?.toLocaleString()}
                      </div>
                      <div className="order-detail">
                        <strong>Status:</strong> {paymentInfo.status}
                      </div>
                      <div className="order-detail">
                        <strong>Currency:</strong> {paymentInfo.currency} ({paymentInfo.network})
                      </div>
                    </div>

                    <div className="crypto-payment-details">
                      <div className="wallet-address">
                        <div className="address-text">
                          {paymentInfo.wallet_address}
                        </div>
                        <button
                          className="copy-button"
                          onClick={() => handleCopy(paymentInfo.wallet_address, 'wallet')}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={copied === 'wallet' ? '#10b981' : '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="payment-amount">
                        <div className="amount-detail">
                          <strong>Expected Amount:</strong> {paymentInfo.expected_amount} {paymentInfo.currency}
                        </div>
                      </div>

                      {paymentInfo.qr_code_url && (
                        <div className="qr-code">
                          <img src={paymentInfo.qr_code_url} alt="Payment QR Code" />
                          <p>Scan QR code to pay</p>
                        </div>
                      )}

                      {paymentInfo.payment_url && (
                        <div className="payment-url">
                          <a href={paymentInfo.payment_url} target="_blank" rel="noopener noreferrer" className="payment-link">
                            Open Payment Page
                          </a>
                        </div>
                      )}

                      <div className="payment-instructions">
                        <h4>Instructions:</h4>
                        <p>{paymentInfo.instructions}</p>
                        {paymentInfo.message && (
                          <p className="payment-message"><em>{paymentInfo.message}</em></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paystack' && paymentInfo.payment_method === 'paystack' && (
                  <div className="payment-section">
                    <h2><ShoppingBag /> Paystack Payment</h2>
                    <div className="paystack-details">
                      <div className="order-info">
                        <div className="order-detail">
                          <strong>Order ID:</strong> {paymentInfo.order_id}
                        </div>
                        <div className="order-detail">
                          <strong>Amount:</strong> ₦{paymentInfo.total_amount?.toLocaleString()}
                        </div>
                      </div>

                      <div className="paystack-actions">
                        <div className="order-detail">
                          <strong>Reference:</strong> {paymentInfo.reference}
                        </div>
                        <div className="order-detail">
                          <strong>Access Code:</strong> {paymentInfo.access_code}
                        </div>

                        <button
                          className="paystack-button"
                          onClick={() => window.open(paymentInfo.authorization_url, '_blank')}
                        >
                          Pay with Paystack
                        </button>
                        <p className="paystack-instructions">{paymentInfo.instructions}</p>
                        {paymentInfo.message && (
                          <p className="paystack-message"><em>{paymentInfo.message}</em></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && paymentInfo.payment_method === 'bank_transfer' && (
                  <div className="payment-section">
                    <h2><ShoppingBag /> Bank Transfer</h2>
                    <div className="bank-details">
                      <div className="order-info">
                        <div className="order-detail">
                          <strong>Order ID:</strong> {paymentInfo.order_id}
                        </div>
                        <div className="order-detail">
                          <strong>Amount:</strong> ₦{paymentInfo.total_amount?.toLocaleString()}
                        </div>
                      </div>

                      {paymentInfo.account_details && (
                        <div className="account-details">
                          <div className="detail-item">
                            <label>Account Number</label>
                            <div className="detail-value">
                              {paymentInfo.account_details.account_number}
                              <button
                                className="copy-button"
                                onClick={() => handleCopy(paymentInfo.account_details.account_number, 'account')}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={copied === 'account' ? '#10b981' : '#3b82f6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="detail-item">
                            <label>Account Name</label>
                            <div className="detail-value">{paymentInfo.account_details.account_name}</div>
                          </div>
                          <div className="detail-item">
                            <label>Bank Name</label>
                            <div className="detail-value">{paymentInfo.account_details.bank_name}</div>
                          </div>
                          <div className="detail-item">
                            <label>Amount to Pay</label>
                            <div className="detail-value">₦{paymentInfo.account_details.amount_to_pay?.toLocaleString()}</div>
                          </div>
                          {paymentInfo.account_details.provider && (
                            <div className="detail-item">
                              <label>Provider</label>
                              <div className="detail-value">{paymentInfo.account_details.provider}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="transfer-instructions">
                        <p><strong>Instructions:</strong> {paymentInfo.instructions}</p>
                        {paymentInfo.account_details?.expires_in && (
                          <p className="expiry-note"><strong>Note:</strong> {paymentInfo.account_details.expires_in}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && paymentInfo.payment_method === 'credit_card' && (
                  <div className="payment-section">
                    <h2><ShoppingBag /> Credit Card Payment</h2>
                    <div className="card-details">
                      <div className="order-info">
                        <div className="order-detail">
                          <strong>Order ID:</strong> {paymentInfo.order_id}
                        </div>
                        <div className="order-detail">
                          <strong>Amount:</strong> ₦{paymentInfo.total_amount?.toLocaleString()}
                        </div>
                      </div>

                      <div className="card-redirect">
                        <div className="redirect-message">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15,3 21,3 21,9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          Redirecting to secure payment gateway...
                        </div>
                        <p className="card-instructions">{paymentInfo.instructions}</p>
                        {paymentInfo.message && (
                          <p className="card-message"><em>{paymentInfo.message}</em></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Show message if no API data available
              <div className="no-api-data">
                <div className="warning-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Complete Order Required
                </div>
                <p className="fallback-message">
                  Please complete your order through the checkout process to receive payment details.
                </p>
              </div>
            )}
          </div>

          <div className="payment-actions">
            <button className="back-button" onClick={() => navigate('/checkout')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12,19 5,12 12,5"></polyline>
              </svg>
              Back to Checkout
            </button>
            <button
              className="confirm-button"
              onClick={handleConfirmPayment}
              disabled={confirming}
            >
              {confirming ? 'Processing...' : 'Confirm Payment'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;

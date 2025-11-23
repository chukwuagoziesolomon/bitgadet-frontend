import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { checkoutService } from '../services/checkoutService';
import { paymentService } from '../services/paymentService';
import { BankAccountDetails, copyToClipboard, formatTimeRemaining, formatNaira } from '../utils/paymentUtils';
import { useToast } from '../hooks/useToast';
import './PaymentPage.css';

interface PaymentPageProps {
  paymentMethod?: 'bank_transfer' | 'card' | 'crypto';
}

const PaymentPage: React.FC<PaymentPageProps> = ({ paymentMethod = 'bank_transfer' }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'processing' | 'completed' | 'failed'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pollingId, setPollingId] = useState<string | null>(null);

  // Load payment data from session storage on component mount
  useEffect(() => {
    const loadPaymentData = () => {
      const paymentData = checkoutService.getCheckoutData('payment_info');
      const orderData = checkoutService.getCheckoutData('current_order');

      if (!paymentData || !orderData) {
        setError('Payment information not found');
        setLoading(false);
        return;
      }

      setPaymentInfo(paymentData);
      setOrder(orderData);
      setLoading(false);

      // Start polling for bank transfer verification
      if (paymentMethod === 'bank_transfer' && orderData.order_id) {
        startPaymentPolling(orderData.order_id, orderData.email);
      }
    };

    loadPaymentData();
  }, [paymentMethod]);

  // Update time remaining every second
  useEffect(() => {
    if (!paymentInfo?.account_details?.expires_at) return;

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(paymentInfo.account_details.expires_at);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentInfo]);

  const [error, setError] = useState<string | null>(null);

  /**
   * Start polling for payment status
   */
  const startPaymentPolling = (orderId: string, email: string) => {
    const id = paymentService.startPolling('bank', orderId, {
      interval: 30000, // Check every 30 seconds
      maxAttempts: 960, // 8 hours max
      onUpdate: (result) => {
        console.log('Payment status update:', result);
        if (result.success) {
          setPaymentStatus('completed');
        } else if (result.status === 'processing') {
          setPaymentStatus('processing');
        }
      },
      onComplete: (result) => {
        if (result.success) {
          setPaymentStatus('completed');
          showSuccess('Payment confirmed!', 'Your order has been paid successfully');
          setTimeout(() => {
            // Check if order contains coupon products
            if (order?.has_coupon_products || order?.items?.some((item: any) => item.is_coupon)) {
              navigate(`/coupon-success/${orderId}?email=${encodeURIComponent(email)}`);
            } else {
              navigate(`/order-success?order_id=${orderId}&email=${email}`);
            }
          }, 2000);
        } else {
          setPaymentStatus('failed');
          showError('Payment verification failed', result.error || 'Please try again');
        }
      },
      onError: (error) => {
        console.error('Polling error:', error);
        setPaymentStatus('failed');
      }
    });
    setPollingId(id);
  };

  /**
   * Handle manual status check
   */
  const handleCheckStatus = async () => {
    if (!order?.order_id) return;

    try {
      const status = await checkoutService.getOrderStatus(order.order_id, order.email);
      console.log('Order status:', status);

      if (status.status === 'paid') {
        setPaymentStatus('completed');
        showSuccess('Payment confirmed!', 'Redirecting to order confirmation...');
        setTimeout(() => {
          // Check if order contains coupon products
          if (order?.has_coupon_products || order?.items?.some((item: any) => item.is_coupon)) {
            navigate(`/coupon-success/${order.order_id}?email=${encodeURIComponent(order.email)}`);
          } else {
            navigate(`/order-success?order_id=${order.order_id}&email=${order.email}`);
          }
        }, 2000);
      } else {
        showSuccess('Status updated', `Current status: ${status.status}`);
      }
    } catch (err: any) {
      showError('Status check failed', err.message);
    }
  };

  /**
   * Handle copy to clipboard
   */
  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      showSuccess('Copied!', `${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } else {
      showError('Copy failed', 'Could not copy to clipboard');
    }
  };

  /**
   * Handle clear cart and continue shopping
   */
  const handleClearCart = () => {
    localStorage.removeItem('bitgadgets_cart_token');
    checkoutService.clearCheckoutData();
    navigate('/shop');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <AlertCircle size={48} />
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/checkout')} className="btn-primary">
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  const accountDetails: BankAccountDetails = paymentInfo?.account_details;

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          {paymentStatus === 'completed' && (
            <>
              <CheckCircle size={64} className="success-icon" />
              <h1>Payment Confirmed!</h1>
              <p>Your payment has been verified successfully</p>
            </>
          )}
          {paymentStatus === 'processing' && (
            <>
              <Clock size={64} className="processing-icon" />
              <h1>Processing Payment</h1>
              <p>Your payment is being verified...</p>
            </>
          )}
          {['waiting', 'failed'].includes(paymentStatus) && (
            <>
              <AlertCircle size={64} className="info-icon" />
              <h1>Bank Transfer Payment</h1>
              <p>Complete your payment using the details below</p>
            </>
          )}
        </div>

        {/* Expiry Timer */}
        {accountDetails && !['completed'].includes(paymentStatus) && (
          <div className={`expiry-timer ${paymentStatus === 'failed' ? 'expired' : ''}`}>
            <Clock size={20} />
            <span>
              {paymentStatus === 'failed' ? 'Account Expired' : `Expires in: ${timeRemaining}`}
            </span>
          </div>
        )}

        {/* Account Details - Bank Transfer */}
        {paymentMethod === 'bank_transfer' && accountDetails && (
          <div className="account-details-section">
            <h2>Transfer Details</h2>
            <div className="details-grid">
              {/* Bank Name */}
              <div className="detail-item">
                <label className="detail-label">Bank Name</label>
                <div className="detail-value-with-copy">
                  <span className="detail-value">{accountDetails.bank_name}</span>
                  <button
                    className={`copy-btn ${copiedField === 'bank' ? 'copied' : ''}`}
                    onClick={() => handleCopy(accountDetails.bank_name, 'Bank Name')}
                    title="Copy bank name"
                  >
                    {copiedField === 'bank' ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div className="detail-item">
                <label className="detail-label">Account Name</label>
                <div className="detail-value-with-copy">
                  <span className="detail-value">{accountDetails.account_name}</span>
                  <button
                    className={`copy-btn ${copiedField === 'name' ? 'copied' : ''}`}
                    onClick={() => handleCopy(accountDetails.account_name, 'Account Name')}
                    title="Copy account name"
                  >
                    {copiedField === 'name' ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Account Number */}
              <div className="detail-item">
                <label className="detail-label">Account Number</label>
                <div className="detail-value-with-copy">
                  <code className="detail-value">{accountDetails.account_number}</code>
                  <button
                    className={`copy-btn ${copiedField === 'account' ? 'copied' : ''}`}
                    onClick={() => handleCopy(accountDetails.account_number, 'Account Number')}
                    title="Copy account number"
                  >
                    {copiedField === 'account' ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="detail-item">
                <label className="detail-label">Amount to Transfer</label>
                <div className="detail-value-with-copy">
                  <span className="detail-value amount">{formatNaira(accountDetails.amount_to_pay)}</span>
                  <button
                    className={`copy-btn ${copiedField === 'amount' ? 'copied' : ''}`}
                    onClick={() => handleCopy(accountDetails.amount_to_pay.toString(), 'Amount')}
                    title="Copy amount"
                  >
                    {copiedField === 'amount' ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Reference */}
              {accountDetails.reference && (
                <div className="detail-item">
                  <label className="detail-label">Payment Reference</label>
                  <div className="detail-value-with-copy">
                    <code className="detail-value">{accountDetails.reference}</code>
                    <button
                      className={`copy-btn ${copiedField === 'reference' ? 'copied' : ''}`}
                      onClick={() => handleCopy(accountDetails.reference, 'Reference')}
                      title="Copy reference"
                    >
                      {copiedField === 'reference' ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions-section">
          <h2>Step-by-Step Instructions</h2>
          <ol className="instructions-list">
            <li>Open your bank's mobile app or website</li>
            <li>Go to "Transfer" or "Send Money"</li>
            <li>Select "{accountDetails?.bank_name}"</li>
            <li>Enter account number: <code>{accountDetails?.account_number}</code></li>
            <li>Enter exact amount: <strong>{formatNaira(accountDetails?.amount_to_pay)}</strong></li>
            <li>Use reference as description: <strong>{accountDetails?.reference}</strong></li>
            <li>Review and confirm</li>
            <li>Payment will be verified automatically</li>
          </ol>
        </div>

        {/* Important Notes */}
        <div className="important-notes">
          <h3>⚠️ Important Notes</h3>
          <ul>
            <li>Transfer the <strong>exact amount</strong> ({formatNaira(accountDetails?.amount_to_pay)})</li>
            <li>Include the reference in the description for faster processing</li>
            <li>This account is valid until: <strong>{accountDetails && new Date(accountDetails.expires_at).toLocaleString()}</strong></li>
            <li>You will receive an email when payment is confirmed</li>
            <li>Do NOT share account details publicly</li>
            <li>Payment verification is automatic within 1-2 minutes</li>
          </ul>
        </div>

        {/* Payment Status Section */}
        <div className="payment-status-section">
          <h2>Payment Status</h2>
          <div className={`status-indicator ${paymentStatus}`}>
            {paymentStatus === 'waiting' && <span>Waiting for transfer...</span>}
            {paymentStatus === 'processing' && <span>Processing...</span>}
            {paymentStatus === 'completed' && <span>✅ Payment Confirmed!</span>}
            {paymentStatus === 'failed' && <span>❌ Payment Failed</span>}
          </div>

          <div className="status-actions">
            <button
              onClick={handleCheckStatus}
              className="btn-secondary"
              disabled={paymentStatus === 'completed'}
            >
              Check Payment Status
            </button>
            <button
              onClick={handleClearCart}
              className="btn-outline"
            >
              Clear Cart & Continue Shopping
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h2>Need Help?</h2>
          <p>
            If you don't receive a confirmation email within 5 minutes, please contact our support team.
          </p>
          <a href="mailto:support@bitgadgets.com" className="btn-link">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

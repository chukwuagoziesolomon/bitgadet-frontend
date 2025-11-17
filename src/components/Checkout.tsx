import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { conditionalApiRequest } from '../config/api';
import './Checkout.css';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cryptoType, setCryptoType] = useState('btc');
  const [agree, setAgree] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<any[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [hasCouponProducts, setHasCouponProducts] = useState(false);

  const navigate = useNavigate();
  const { addToast, showSuccess, showError } = useToast();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch available cryptocurrencies when crypto payment is selected
  useEffect(() => {
    if (paymentMethod === 'crypto') {
      setCryptoLoading(true);
      conditionalApiRequest<any>('/api/payments/crypto/currencies/')
        .then(data => {
          if (data.currencies) {
            setCryptoCurrencies(data.currencies);
            // Set first available currency as default if current selection is not available
            if (data.currencies.length > 0 && !data.currencies.find((c: any) => c.code.toLowerCase() === cryptoType)) {
              setCryptoType(data.currencies[0].code.toLowerCase());
            }
          }
        })
        .catch(error => {
          console.error('Error fetching crypto currencies:', error);
          showError('Failed to load cryptocurrency options');
        })
        .finally(() => {
          setCryptoLoading(false);
        });
    }
  }, [paymentMethod, addToast]);

  // Fetch order summary
  useEffect(() => {
    const fetchOrderSummary = async () => {
      setSummaryLoading(true);
      try {
        console.log('Fetching order summary from /api/orders/summary/');
        const data = await conditionalApiRequest<any>('/api/orders/summary/');
        console.log('Order summary data:', data);
        setOrderSummary(data);

        // Note: The new API doesn't include cart_items, so we can't check for coupon products here
        // This check might need to be moved to a different endpoint or removed
        setHasCouponProducts(false);
      } catch (error) {
        console.error('Error fetching order summary:', error);
        showError('Failed to load order summary');
        // Set a fallback summary for development
        setOrderSummary({
          subtotal: 150000.0,
          item_count: 2,
          shipping: 2000.0,
          tax: 11250.0,
          total: 163250.0,
          currency: "NGN",
          currency_symbol: "₦"
        });
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchOrderSummary();
  }, [addToast]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showError('Please enter a coupon code');
      return;
    }

    if (!formData.email) {
      showError('Please enter your email address first');
      return;
    }

    if (!orderSummary?.total) {
      showError('Unable to calculate discount - order summary not loaded');
      return;
    }

    setCouponLoading(true);

    try {
      const response = await conditionalApiRequest<any>('/api/coupons/validate/', {
        method: 'POST',
        body: JSON.stringify({
          coupon_code: couponCode.trim(),
          user_email: formData.email,
          order_amount: orderSummary.total
        })
      });

      if (response.valid) {
        setAppliedCoupon(response);
        showSuccess('Coupon applied!', response.message);

        // Update order summary with discount
        setOrderSummary((prev: any) => ({
          ...prev,
          discount: response.coupon.discount_amount,
          total: response.order_summary.final_amount
        }));
      } else {
        showError('Invalid coupon', 'This coupon code is not valid or has expired');
      }
    } catch (error: any) {
      console.error('Coupon validation failed:', error);
      showError('Coupon validation failed', error.message || 'Please try again');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');

    // Restore original total
    setOrderSummary((prev: any) => ({
      ...prev,
      discount: 0,
      total: (prev.subtotal || 0) + (prev.shipping_cost || 0)
    }));

    showSuccess('Coupon removed');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agree) return;

    setIsSubmitting(true);

    try {
      // Prepare cart items (this would come from your cart state/context)
      const cartItems: { [key: string]: number } = {};
      // For now, we'll use a sample product - in real app this would come from cart
      cartItems['sample_product_id'] = 1;

      const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        payment_method: paymentMethod,
        cart_items: cartItems,
        subtotal: 155000, // Sample amount - in real app from cart total
        shipping_cost: 5000, // Sample shipping - in real app from calculation
        total_amount: 160000, // Sample total - in real app from calculation
        additional_info: specialInstructions,
        terms_agreed: agree
      };

      const result = await conditionalApiRequest<any>('/api/checkout/create/', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      
      // Debug logging
      console.log('Checkout API Response:', result);
      console.log('Payment Info:', result.payment_info);
      console.log('Order Data:', result.order);

      if (result.success) {
        showSuccess('Order created successfully!', 'Redirecting to payment details...');
        // Navigate to payment details with the API response
        navigate('/payment-details', {
          state: {
            paymentMethod,
            cryptoType,
            orderData: result.order,
            paymentInfo: result.payment_info,
            accountInfo: result.account_info
          }
        });
      } else {
        showError('Error creating order', result.message);
      }
    } catch (error: any) {
      console.error('Error submitting order:', error);

      let errorMessage = 'Error submitting order. Please try again.';
      let errorTitle = 'Checkout Failed';

      // Handle specific error types based on response
      if (error.message) {
        // Handle specific API error messages
        if (error.message.includes('cart is empty')) {
          errorMessage = 'Your cart is empty. Please add some products before proceeding to checkout.';
          errorTitle = 'Empty Cart';
        } else if (error.message.includes('address') || error.message.includes('shipping')) {
          errorMessage = 'Please provide a valid shipping address.';
          errorTitle = 'Shipping Address Error';
        } else if (error.message.includes('payment')) {
          errorMessage = 'There was an issue with your payment method. Please try again or contact support.';
          errorTitle = 'Payment Error';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
          errorTitle = 'Connection Error';
        } else {
          errorMessage = error.message;
        }
      } else if (error.errors) {
        // Handle validation errors from API
        if (Array.isArray(error.errors)) {
          errorMessage = error.errors.join(', ');
        } else {
          errorMessage = Object.values(error.errors).flat().join(', ');
        }
        errorTitle = 'Validation Error';
      } else if (error.response?.data) {
        // Handle nested error responses
        const responseData = error.response.data;
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.errors) {
          if (Array.isArray(responseData.errors)) {
            errorMessage = responseData.errors.join(', ');
          } else {
            errorMessage = Object.values(responseData.errors).flat().join(', ');
          }
          errorTitle = 'Validation Error';
        }
      }

      showError(errorTitle, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('Checkout component rendered');

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <a href="/cart" className="back-link">&larr; Back to Cart</a>
        <h1>Checkout</h1>
        <p className="checkout-subtitle">Complete your purchase securely and safely</p>
      </div>
      <div className="checkout-content">
        {isMobile && (
          <div className="checkout-summary">
            <div className="summary-box">
              <div className="summary-title">Order Summary</div>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button className="apply-btn remove" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <div className="applied-coupon">
                  <div className="coupon-success">
                    <span className="coupon-check">✓</span>
                    <span className="coupon-text">
                      {appliedCoupon.coupon.description}
                    </span>
                  </div>
                </div>
              )}
              <div className="summary-details">
                {summaryLoading ? (
                  <div className="summary-loading">Loading order summary...</div>
                ) : orderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal ({orderSummary.item_count || 0} items)</span>
                      <span>{orderSummary.currency_symbol || '₦'}{orderSummary.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{orderSummary.currency_symbol || '₦'}{orderSummary.shipping?.toLocaleString() || '0'}</span>
                    </div>
                    {orderSummary.tax && (
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>{orderSummary.currency_symbol || '₦'}{orderSummary.tax.toLocaleString()}</span>
                      </div>
                    )}
                    {orderSummary.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount</span>
                        <span>-₦{orderSummary.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₦{orderSummary.total?.toLocaleString() || '0'}</span>
                    </div>
                    {orderSummary.total_usdt && (
                      <div className="summary-row usdt">
                        <span></span>
                        <span>{orderSummary.total_usdt.toLocaleString()} USDT</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="summary-error">Unable to load order summary</div>
                )}
              </div>
              
              {/* Coupon notice */}
              {hasCouponProducts && (
                <div className="coupon-notice">
                  <div className="coupon-notice-icon">🎁</div>
                  <div className="coupon-notice-text">
                    <strong>Gift Coupon Purchase</strong><br/>
                    Your coupon code will be sent to your email after successful payment.
                  </div>
                </div>
              )}
              
              <div className="shipping-info">
                <div className="shipping-title">Shipping Information</div>
                <ul>
                  <li>Enugu: 1-2 business days</li>
                  <li>Other states: 3-5 business days</li>
                  <li>Free shipping on orders above ₦500,000</li>
                </ul>
              </div>
              <div className="trust-badges">
                <span>Secure Payment</span>
                <span>Authentic Products</span>
                <span>7-Day Returns</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        )}
        <form className="checkout-form" onSubmit={handleOrder} autoComplete="off">
          {/* Customer Information */}
          <section className="checkout-section">
            <div className="section-title"><span className="section-number">1</span> Customer Information</div>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
          </section>

          {/* Shipping Address */}
          <section className="checkout-section">
            <div className="section-title"><span className="section-number">2</span> Shipping Address</div>
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address *"
              className="full-width"
              value={formData.streetAddress}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City *"
                value={formData.city}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <input
                type="text"
                name="state"
                placeholder="State *"
                value={formData.state}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-section">
            <div className="section-title"><span className="section-number">3</span> Payment Method</div>
            <div className="payment-options">
              <label className={`payment-option${paymentMethod === 'card' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div>
                  <div>Credit/Debit Card</div>
                  <small>Pay with Visa, Mastercard, or Verve</small>
                </div>
              </label>
              <label className={`payment-option${paymentMethod === 'crypto' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                <div>
                  <div>Cryptocurrency <span className="recommended">Recommended</span></div>
                  <small>Pay with Bitcoin or Ethereum</small>
                </div>
              </label>
              <label className={`payment-option${paymentMethod === 'bank' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                <div>
                  <div>Bank Transfer</div>
                  <small>Direct bank transfer</small>
                </div>
              </label>
            </div>
            {paymentMethod === 'crypto' && (
              <div className="crypto-select">
                <div className="crypto-label">Select Cryptocurrency</div>
                {cryptoLoading ? (
                  <div className="crypto-loading">Loading cryptocurrencies...</div>
                ) : cryptoCurrencies.length > 0 ? (
                  cryptoCurrencies.map((currency) => (
                    <label key={currency.code}>
                      <input
                        type="radio"
                        name="crypto"
                        value={currency.code.toLowerCase()}
                        checked={cryptoType === currency.code.toLowerCase()}
                        onChange={() => setCryptoType(currency.code.toLowerCase())}
                      />
                      <div className="crypto-option">
                        <img
                          src={currency.code === 'USDT' ? '/usdt.png' : currency.logo_url}
                          alt={currency.name}
                          className="crypto-icon"
                        />
                        <div className="crypto-info">
                          <div className="crypto-name">{currency.display_name}</div>
                          <div className="crypto-network">{currency.network}</div>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <>
                    <label>
                      <input type="radio" name="crypto" value="btc" checked={cryptoType === 'btc'} onChange={() => setCryptoType('btc')} />
                      <div className="crypto-option">
                        <div className="crypto-icon">₿</div>
                        <div className="crypto-info">
                          <div className="crypto-name">Bitcoin (BTC)</div>
                          <div className="crypto-network">BTC Network</div>
                        </div>
                      </div>
                    </label>
                    <label>
                      <input type="radio" name="crypto" value="eth" checked={cryptoType === 'eth'} onChange={() => setCryptoType('eth')} />
                      <div className="crypto-option">
                        <div className="crypto-icon">Ξ</div>
                        <div className="crypto-info">
                          <div className="crypto-name">Ethereum (ETH)</div>
                          <div className="crypto-network">ERC20 Network</div>
                        </div>
                      </div>
                    </label>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Additional Information */}
          <section className="checkout-section">
            <div className="section-title"><span className="section-number">4</span> Additional Information</div>
            <label className="special-label">Special Instructions (Optional)</label>
            <textarea
              className="special-textarea"
              placeholder="Special Instructions (Optional)"
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              rows={3}
            />
            <div className="info-badges-row">
              <div className="info-badge secure">
                <div className="info-badge-title">Secure Checkout</div>
                <div className="info-badge-desc">SSL encrypted</div>
              </div>
              <div className="info-badge delivery">
                <div className="info-badge-title">Fast Delivery</div>
                <div className="info-badge-desc">2-5 business days</div>
              </div>
              <div className="info-badge support">
                <div className="info-badge-title">24/7 Support</div>
                <div className="info-badge-desc">WhatsApp & Telegram</div>
              </div>
            </div>

            
  
            <div className="checkbox-row">
              <label className="checkbox-label">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} required />
                I agree to the <a href="#">Terms and Conditions</a> and <a href="#">Privacy Policy</a> *
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
                Subscribe to our newsletter for exclusive deals and updates
              </label>
            </div>
            <button
              className="complete-order-btn"
              type="submit"
              disabled={!agree || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Order'}
            </button>
          </section>
        </form>
        {!isMobile && (
          <div className="checkout-summary">
            <div className="summary-box">
              <div className="summary-title">Order Summary</div>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <button className="apply-btn remove" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <div className="applied-coupon">
                  <div className="coupon-success">
                    <span className="coupon-check">✓</span>
                    <span className="coupon-text">
                      {appliedCoupon.coupon.description}
                    </span>
                  </div>
                </div>
              )}
              <div className="summary-details">
                {summaryLoading ? (
                  <div className="summary-loading">Loading order summary...</div>
                ) : orderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal ({orderSummary.item_count || 0} items)</span>
                      <span>{orderSummary.currency_symbol || '₦'}{orderSummary.subtotal?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>{orderSummary.currency_symbol || '₦'}{orderSummary.shipping?.toLocaleString() || '0'}</span>
                    </div>
                    {orderSummary.tax && (
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>{orderSummary.currency_symbol || '₦'}{orderSummary.tax.toLocaleString()}</span>
                      </div>
                    )}
                    {orderSummary.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount</span>
                        <span>-₦{orderSummary.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₦{orderSummary.total?.toLocaleString() || '0'}</span>
                    </div>
                    {orderSummary.total_usdt && (
                      <div className="summary-row usdt">
                        <span></span>
                        <span>{orderSummary.total_usdt.toLocaleString()} USDT</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="summary-error">Unable to load order summary</div>
                )}
              </div>
              
              {/* Coupon notice */}
              {hasCouponProducts && (
                <div className="coupon-notice">
                  <div className="coupon-notice-icon">🎁</div>
                  <div className="coupon-notice-text">
                    <strong>Gift Coupon Purchase</strong><br/>
                    Your coupon code will be sent to your email after successful payment.
                  </div>
                </div>
              )}
              
              <div className="shipping-info">
                <div className="shipping-title">Shipping Information</div>
                <ul>
                  <li>Enugu: 1-2 business days</li>
                  <li>Other states: 3-5 business days</li>
                  <li>Free shipping on orders above ₦500,000</li>
                </ul>
              </div>
              <div className="trust-badges">
                <span>Secure Payment</span>
                <span>Authentic Products</span>
                <span>7-Day Returns</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

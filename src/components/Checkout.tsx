import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { conditionalApiRequest, checkoutApiRequest, API_CONFIG } from '../config/api';
import { handleApiError } from '../utils/errorHandler';
import { cartService } from '../services/cartService';
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
            if (data.currencies.length > 0 && !data.currencies.find((c: any) => c.id === cryptoType)) {
              setCryptoType(data.currencies[0].id);
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
        // Get cart token for guest users
        const cartToken = cartService.getCartToken();
        
        console.log('Fetching order summary with cart_token:', cartToken);
        
        // Build query parameters for order summary
        const params = new URLSearchParams();
        if (cartToken) params.append('cart_token', cartToken);
        if (formData.state) params.append('state', formData.state);
        params.append('payment_method', paymentMethod);
        
        // Use the correct endpoint for order summary (works for both guests and authenticated users)
        const endpoint = `${API_CONFIG.ENDPOINTS.ORDER_SUMMARY_STATS}?${params.toString()}`;
        
        const data = await conditionalApiRequest<any>(endpoint);
        console.log('Order summary data:', data);
        setOrderSummary(data);

        // Note: The new API doesn't include cart_items, so we can't check for coupon products here
        // This check might need to be moved to a different endpoint or removed
        setHasCouponProducts(false);
      } catch (error) {
        console.error('Error fetching order summary:', error);
        const errorMessage = handleApiError(error as any, 'Order Summary');
        showError('Failed to load order summary', errorMessage);
        // Set a fallback summary for development - matching the actual API response format
        setOrderSummary({
          total_orders: 0,
          total_spent: 0.0,
          average_order_value: 0.0,
          status_breakdown: {},
          currency: "USD"
        });
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchOrderSummary();
  }, [addToast]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showError('Validation Error', 'Please enter a coupon code');
      return;
    }

    if (!formData.email) {
      showError('Validation Error', 'Please enter your email address first');
      return;
    }

    setCouponLoading(true);

    try {
      // Get cart token for guest users
      const cartToken = cartService.getCartToken();
      
      const response = await conditionalApiRequest<any>(API_CONFIG.ENDPOINTS.COUPONS_VALIDATE, {
        method: 'POST',
        body: JSON.stringify({
          coupon_code: couponCode.trim(),
          user_email: formData.email,
          cart_token: cartToken,
          state: formData.state,
          payment_method: paymentMethod
        })
      });

      if (response.success) {
        // Store coupon data with all details
        setAppliedCoupon({
          code: response.coupon_code,
          discount_type: response.discount_type,
          discount_value: response.discount_value,
          discount_amount: response.discount_amount,
          final_amount: response.final_amount
        });
        
        // Format discount message based on type
        const discountText = response.discount_type === 'percentage' 
          ? `${response.discount_value}% off` 
          : `₦${response.discount_amount?.toLocaleString()} off`;
        
        showSuccess('Coupon Applied!', `You saved ${discountText} on your order!`);

        // Now fetch the updated order summary with the coupon code applied
        try {
          console.log('Fetching updated order summary with coupon...');
          
          // Get cart token for guest users
          const cartToken = cartService.getCartToken();
          
          // Build query parameters
          const params = new URLSearchParams();
          if (cartToken) params.append('cart_token', cartToken);
          if (formData.state) params.append('state', formData.state);
          params.append('payment_method', paymentMethod);
          params.append('coupon_code', couponCode.trim());
          
          const summaryEndpoint = `${API_CONFIG.ENDPOINTS.ORDER_SUMMARY_STATS}?${params.toString()}`;
          const summaryData = await conditionalApiRequest<any>(summaryEndpoint);
          
          if (summaryData) {
            console.log('Updated order summary with coupon:', summaryData);
            // Update order summary with discount information
            setOrderSummary((prev: any) => ({
              ...prev,
              ...summaryData,
              coupon_applied: true,
              applied_coupon_code: couponCode.trim()
            }));
          }
        } catch (summaryError) {
          console.warn('Could not fetch updated order summary:', summaryError);
          // Continue anyway - the discount will still be shown from the coupon response
          setOrderSummary((prev: any) => ({
            ...prev,
            coupon_applied: true,
            applied_coupon_code: couponCode.trim(),
            discount_amount: response.discount_amount,
            discount: response.discount_amount
          }));
        }

      } else {
        showError('Invalid Coupon', response.message || 'This coupon code is not valid or has expired');
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      console.error('Coupon validation failed:', error);
      const errorMessage = handleApiError(error, 'Coupon Validation');
      showError('Coupon Validation Failed', errorMessage);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setAppliedCoupon(null);
    setCouponCode('');

    try {
      // Fetch the original order summary without coupon
      console.log('Fetching original order summary without coupon...');
      const summaryData = await conditionalApiRequest<any>(API_CONFIG.ENDPOINTS.ORDER_SUMMARY_STATS);
      
      if (summaryData) {
        console.log('Original order summary restored:', summaryData);
        setOrderSummary((prev: any) => ({
          ...prev,
          ...summaryData,
          coupon_applied: false,
          applied_coupon_code: null,
          discount_amount: 0,
          discount: 0
        }));
      }
    } catch (error) {
      console.warn('Could not restore original order summary:', error);
      // Restore original total manually
      setOrderSummary((prev: any) => ({
        ...prev,
        discount: 0,
        discount_amount: 0,
        coupon_applied: false,
        applied_coupon_code: null,
        total: (prev.subtotal || 0) + (prev.shipping_cost || 0)
      }));
    }

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
      // Validate cart is not empty
      if (!orderSummary || orderSummary.total_items === 0) {
        showError('Empty Cart', 'Your cart is empty. Please add items before checking out.');
        setIsSubmitting(false);
        return;
      }

      // Get cart token for guest users
      const cartToken = cartService.getCartToken();
      
      if (!cartToken) {
        showError('Cart Error', 'Unable to identify your cart. Please add items to cart first.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Creating order with cart_token:', cartToken);
      console.log('Order summary:', orderSummary);

      // Use actual order summary data instead of hardcoded values
      const orderData = {
        coupon_code: appliedCoupon?.code || couponCode || null,
        state: formData.state,
        payment_method: paymentMethod,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        street_address: formData.streetAddress,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        additional_info: specialInstructions,
        terms_agreed: agree,
        // Use actual totals from order summary
        subtotal: orderSummary?.subtotal || 0,
        tax_amount: orderSummary?.tax_amount || 0,
        shipping_cost: orderSummary?.shipping_cost || 0,
        discount_amount: orderSummary?.discount_amount || 0,
        total_amount: orderSummary?.total || orderSummary?.total_naira || 0,
        total_amount_usdt: orderSummary?.total_usdt || 0
      };

      // Use checkoutApiRequest with X-Cart-Token header instead of body
      const result = await checkoutApiRequest<any>('/api/checkout/create/', cartToken, {
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
            cartToken,
            orderData: result.order,
            paymentInfo: result.payment_info,
            accountInfo: result.account_info
          }
        });
      } else {
        showError('Error creating order', result.message);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      const errorMessage = handleApiError(error as any, 'Order Submission');
      showError('Error submitting order', errorMessage);
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
                      {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₦${appliedCoupon.discount_value?.toLocaleString()}`} off
                    </span>
                  </div>
                  <div className="coupon-details">
                    <div className="coupon-detail-row">
                      <span>Discount:</span>
                      <span className="discount-amount">-₦{appliedCoupon.discount_amount?.toLocaleString()}</span>
                    </div>
                    <div className="coupon-detail-row final">
                      <span>Final Amount:</span>
                      <span className="final-amount">₦{appliedCoupon.final_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="summary-details">
                {summaryLoading ? (
                  <div className="summary-loading">Loading order summary...</div>
                ) : orderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>
                        ₦{orderSummary.subtotal?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                        {orderSummary.subtotal_usdt && orderSummary.subtotal_usdt !== orderSummary.subtotal && (
                          <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '8px' }}>
                            ({orderSummary.subtotal_usdt?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT)
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {orderSummary.tax_amount > 0 && (
                      <div className="summary-row">
                        <span>Tax ({(orderSummary.tax_amount / orderSummary.subtotal * 100).toFixed(1)}%)</span>
                        <span>
                          ₦{orderSummary.tax_amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                          {orderSummary.tax_amount_usdt && orderSummary.tax_amount_usdt !== orderSummary.tax_amount && (
                            <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '8px' }}>
                              ({orderSummary.tax_amount_usdt?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {orderSummary.shipping_cost > 0 && (
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>
                          ₦{orderSummary.shipping_cost?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                          {orderSummary.shipping_cost_usdt && orderSummary.shipping_cost_usdt !== orderSummary.shipping_cost && (
                            <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '8px' }}>
                              ({orderSummary.shipping_cost_usdt?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {/* Display discount if coupon is applied */}
                    {orderSummary.coupon_applied && orderSummary.discount_amount > 0 && (
                      <>
                        <div style={{ borderTop: '1px solid #e0e0e0', margin: '12px 0', paddingTop: '12px' }}>
                          <div className="summary-row discount-row">
                            <span style={{ color: '#10b981', fontWeight: '600' }}>Discount:</span>
                            <span style={{ color: '#10b981', fontWeight: '700' }}>
                              -₦{(orderSummary.discount_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              {orderSummary.discount_amount_usdt && orderSummary.discount_amount_usdt !== orderSummary.discount_amount && (
                                <span style={{ fontSize: '0.9rem', marginLeft: '8px' }}>
                                  ({orderSummary.discount_amount_usdt?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Final Total */}
                    <div className="summary-row total-row" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#059669', borderTop: '1px solid #e0e0e0', paddingTop: '12px', marginTop: '12px' }}>
                      <span>Total:</span>
                      <span>
                        ₦{(orderSummary.total_naira || orderSummary.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        {orderSummary.total_usdt && (
                          <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '8px' }}>
                            ({orderSummary.total_usdt?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT)
                          </span>
                        )}
                      </span>
                    </div>
                    
                    {orderSummary.note && (
                      <div className="summary-row note" style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>
                        <span>{orderSummary.note}</span>
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
                    <label key={currency.id}>
                      <input
                        type="radio"
                        name="crypto"
                        value={currency.id}
                        checked={cryptoType === currency.id}
                        onChange={() => setCryptoType(currency.id)}
                      />
                      <div className="crypto-option">
                        <div className="crypto-icon" style={currency.symbol === 'USDT' ? {backgroundColor: '#26a17b', color: 'white'} : {}}>
                          {currency.symbol}
                        </div>
                        <div className="crypto-info">
                          <div className="crypto-name">{currency.name}</div>
                          <div className="crypto-network">{currency.network_name}</div>
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

            {/* WhatsApp Help Section */}
            <div className="whatsapp-help-section">
              <div className="whatsapp-help-title">Need Help?</div>
              <p className="whatsapp-help-text">Get instant assistance from our support team</p>
              <button
                type="button"
                className="whatsapp-help-btn"
                onClick={() => {
                  const message = "Hi, I need help with my order during checkout.";
                  const whatsappUrl = `https://api.whatsapp.com/send?phone=2349138666111&text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Get Help by WhatsApp
              </button>
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
                      {appliedCoupon.code}: {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₦${appliedCoupon.discount_value?.toLocaleString()}`} off
                    </span>
                  </div>
                  <div className="coupon-details">
                    <div className="coupon-detail-row">
                      <span>Discount:</span>
                      <span className="discount-amount">-₦{appliedCoupon.discount_amount?.toLocaleString()}</span>
                    </div>
                    <div className="coupon-detail-row final">
                      <span>Final Amount:</span>
                      <span className="final-amount">₦{appliedCoupon.final_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="summary-details">
                {summaryLoading ? (
                  <div className="summary-loading">Loading order summary...</div>
                ) : orderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Total Orders</span>
                      <span>{orderSummary.total_orders || 0}</span>
                    </div>
                    <div className="summary-row">
                      <span>Total Spent</span>
                      <span>{orderSummary.currency || 'USD'} {orderSummary.total_spent?.toLocaleString() || '0.00'}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Average Order Value</span>
                      <span>{orderSummary.currency || 'USD'} {orderSummary.average_order_value?.toLocaleString() || '0.00'}</span>
                    </div>
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



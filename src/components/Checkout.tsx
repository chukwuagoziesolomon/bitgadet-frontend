import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { conditionalApiRequest, checkoutApiRequest, publicApiRequest, API_CONFIG } from '../config/api';
import { handleApiError } from '../utils/errorHandler';
import { cartService } from '../services/cartService';
import './Checkout.css';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('crypto');
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
  const [shippingRate, setShippingRate] = useState<{ shipping_cost: number; available: boolean } | null>(null);

  const navigate = useNavigate();
  const { addToast, showSuccess, showError } = useToast();
  const summarySubtotalNgn = orderSummary?.subtotal_ngn ?? orderSummary?.subtotal ?? 0;
  const summaryDiscountNgn = orderSummary?.discount_ngn ?? orderSummary?.discount_amount ?? orderSummary?.discount ?? 0;
  const summaryTaxNgn = orderSummary?.tax_ngn ?? orderSummary?.tax ?? 0;
  const summaryShippingNgn = orderSummary?.shipping_cost_ngn ?? orderSummary?.shipping_cost ?? 0;
  const summaryTotalNgn = orderSummary?.total_ngn ?? orderSummary?.total_amount ?? orderSummary?.total ?? 0;
  const summarySubtotalUsdt = orderSummary?.subtotal_usdt ?? 0;
  const summaryDiscountUsdt = orderSummary?.discount_usdt ?? orderSummary?.discount_amount_usdt ?? orderSummary?.discount_amount_secondary ?? 0;
  const summaryTaxUsdt = orderSummary?.tax_usdt ?? orderSummary?.tax_amount_usdt ?? 0;
  const summaryShippingUsdt = orderSummary?.shipping_cost_usdt ?? 0;
  const summaryTotalUsdt = orderSummary?.total_usdt ?? 0;
  const hasOrderSummary = !!orderSummary && (
    orderSummary.subtotal_ngn !== undefined ||
    orderSummary.total_ngn !== undefined ||
    orderSummary.subtotal !== undefined ||
    orderSummary.total !== undefined
  );
  const formatNgn = (amount: number) => `₦${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch enhanced order summary with state-based shipping
  const fetchOrderSummary = async (state?: string, couponCode?: string) => {
    try {
      setSummaryLoading(true);
      const apiPaymentMethod = paymentMethod === 'crypto' ? 'nowpayments'
        : paymentMethod === 'bank' ? 'bank_transfer'
        : 'paystack';
      const summaryData = await cartService.getCartSummary({
        ...(state ? { state } : {}),
        ...(couponCode ? { coupon_code: couponCode } : {}),
        payment_method: apiPaymentMethod,
      });
      if (summaryData && (
        summaryData.total_ngn !== undefined ||
        summaryData.subtotal_ngn !== undefined ||
        summaryData.total_amount !== undefined ||
        summaryData.subtotal !== undefined
      )) {
        setOrderSummary(summaryData);
      }
    } catch (error) {
      console.error('Error fetching order summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Fetch summary on initial load
  useEffect(() => {
    fetchOrderSummary();
  }, []);

  // Re-fetch when payment method changes (if state already entered)
  useEffect(() => {
    if (formData.state.trim()) {
      fetchOrderSummary(formData.state.trim(), appliedCoupon?.code || couponCode || undefined);
    }
  }, [paymentMethod]);

  // Fetch available cryptocurrencies when crypto payment is selected
  useEffect(() => {
    if (paymentMethod === 'crypto') {
      setCryptoLoading(true);
      conditionalApiRequest<any>('/api/v1/payments/crypto/currencies/')
        .then(data => {
          const cryptoData = data?.data || data;
          if (cryptoData.currencies) {
            setCryptoCurrencies(cryptoData.currencies);
            if (cryptoData.currencies.length > 0 && !cryptoData.currencies.find((c: any) => c.id === cryptoType)) {
              setCryptoType(cryptoData.currencies[0].id);
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
          order_amount: orderSummary?.total || orderSummary?.total_amount || orderSummary?.total_ngn || 0
        })
      });

      if (response.success) {
        const couponData = response.data || response;
        // Store coupon data with all details
        setAppliedCoupon({
          code: couponData.code,
          discount_type: couponData.discount_type,
          discount_value: couponData.discount_value,
          discount_amount: couponData.discount_amount,
          final_amount: couponData.final_amount
        });
        
        // Format discount message based on type
        const discountText = couponData.discount_type === 'percentage' 
          ? `${couponData.discount_value}% off` 
          : `₦${couponData.discount_amount?.toLocaleString()} off`;
        
        showSuccess('Coupon Applied!', `You saved ${discountText} on your order!`);

        // Now fetch the updated order summary with the coupon code applied
        try {
          console.log('Fetching updated order summary with coupon...');
          
          const summaryData = await cartService.getCartSummary({
            ...(formData.state ? { state: formData.state } : {}),
            payment_method: paymentMethod,
            coupon_code: couponCode.trim(),
          });
          
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
      const summaryData = await cartService.getCartSummary({
        ...(formData.state ? { state: formData.state } : {}),
        payment_method: paymentMethod,
      });
      
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
    
    // Fetch updated order summary when state changes
    if (name === 'state' && value.trim()) {
      fetchOrderSummary(value.trim());
          // Fetch shipping rate for display
          publicApiRequest<any>(`/api/v1/shipping/rates/?state_to=${encodeURIComponent(value.trim())}`)
            .then(res => {
              const d = res?.data || res;
              setShippingRate({ shipping_cost: d.shipping_cost, available: d.available });
            })
            .catch(() => setShippingRate(null));
    }
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
      // Map UI payment method to API values
      const apiPaymentMethod = paymentMethod === 'crypto' ? 'nowpayments'
        : paymentMethod === 'bank' ? 'bank_transfer'
        : 'paystack';
      const apiCurrency = paymentMethod === 'crypto' ? 'USDT' : 'NGN';

      const orderPayload: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        shipping_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country || 'Nigeria',
        payment_method: apiPaymentMethod,
        currency: apiCurrency,
      };
      if (appliedCoupon?.code) orderPayload.coupon_code = appliedCoupon.code;
      if (cartToken) orderPayload.cart_token = cartToken;

      const result = await conditionalApiRequest<any>('/api/v1/orders/create/', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      console.log('Order creation response:', result);

      if (!result.success) {
        showError('Error creating order', result.message || 'Order creation failed');
        return;
      }

      const createdOrder = result.data || result;
      const orderId = createdOrder.order_id;

      showSuccess('Order created!', 'Initiating payment...');

      if (paymentMethod === 'paystack') {
        // Paystack: call payments/create/ and redirect to authorization_url
        const payRes = await conditionalApiRequest<any>('/api/v1/payments/create/', {
          method: 'POST',
          body: JSON.stringify({
            order_id: orderId,
            amount: createdOrder.total,
            currency: 'NGN',
            email: formData.email,
          })
        });
        const payData = payRes.data || payRes;
        if (payData.authorization_url) {
          window.location.href = payData.authorization_url;
        } else {
          showError('Payment Error', 'Could not get Paystack payment URL');
        }
      } else if (paymentMethod === 'crypto') {
        // Resolve USDT total: prefer already-fetched cart summary; if missing, fetch order summary
        let usdtTotal: number = summaryTotalUsdt;
        if (!usdtTotal) {
          try {
            const orderSummaryData = await cartService.getCreatedOrderSummary(orderId);
            usdtTotal = orderSummaryData?.total_usdt ?? 0;
          } catch (_) {
            // fall through to NGN fallback
          }
        }

        // Crypto: call payments/crypto/create/ and navigate to PaymentDetails
        const cryptoRes = await conditionalApiRequest<any>('/api/v1/payments/crypto/create/', {
          method: 'POST',
          body: JSON.stringify({
            order_id: orderId,
            amount: usdtTotal || createdOrder.total,
            currency: 'USDT',
          })
        });
        const cryptoData = cryptoRes.data || cryptoRes;
        navigate('/payment-details', {
          state: {
            paymentMethod: 'crypto',
            cryptoType,
            cartToken,
            orderData: { ...createdOrder, email: formData.email },
            paymentInfo: {
              order_id: orderId,
              payment_address: cryptoData.payment_address,
              amount_crypto: cryptoData.amount_crypto,
              network: cryptoData.network,
              expires_at: cryptoData.expires_at,
              currency: 'USDT',
            }
          }
        });
      } else {
        // Bank transfer: navigate to payment details with order info
        navigate('/payment-details', {
          state: {
            paymentMethod: 'bank',
            cartToken,
            orderData: { ...createdOrder, email: formData.email },
            paymentInfo: { order_id: orderId },
            accountInfo: null,
          }
        });
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
                ) : hasOrderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal ({orderSummary.items_count || orderSummary.total_items || 0} items)</span>
                      <span>
                        {formatNgn(summarySubtotalNgn)}
                        <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                          ({summarySubtotalUsdt.toFixed(2)} USDT)
                        </small>
                      </span>
                    </div>

                    {orderSummary.coupon_applied && summaryDiscountNgn > 0 && (
                      <>
                        <div style={{ borderTop: '1px solid #e0e0e0', margin: '12px 0', paddingTop: '12px' }}>
                          <div className="summary-row discount-row">
                            <span style={{ color: '#10b981', fontWeight: '600' }}>Discount:</span>
                            <span style={{ color: '#10b981', fontWeight: '700' }}>
                              -{formatNgn(summaryDiscountNgn)}
                              {summaryDiscountUsdt > 0 && (
                                <span style={{ fontSize: '0.9rem', marginLeft: '8px' }}>
                                  ({summaryDiscountUsdt.toFixed(2)} USDT)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="summary-row">
                      <span>Tax</span>
                      <span>
                        {formatNgn(summaryTaxNgn)}
                        <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                          ({summaryTaxUsdt.toFixed(2)} USDT)
                        </small>
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>
                        {formatNgn(summaryShippingNgn)}
                        <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                          ({summaryShippingUsdt.toFixed(2)} USDT)
                        </small>
                      </span>
                    </div>

                    <div className="summary-row total-row" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#059669', borderTop: '1px solid #e0e0e0', paddingTop: '12px', marginTop: '12px' }}>
                      <span>Total</span>
                      <span>
                        {formatNgn(summaryTotalNgn)}
                        <small style={{ display: 'block', color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                          ({summaryTotalUsdt.toFixed(2)} USDT)
                        </small>
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
                  <li>Lagos: 1-3 business days</li>
                  <li>Other states: 4-5 business days</li>
                  <li>Free shipping on orders above ₦1,000,000</li>
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
              {/* <label className={`payment-option${paymentMethod === 'card' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <div>
                  <div>Credit/Debit Card</div>
                  <small>Pay with Visa, Mastercard, or Verve</small>
                </div>
              </label> */}
              <label className={`payment-option${paymentMethod === 'crypto' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                <div>
                  <div>Cryptocurrency <span className="recommended">Recommended</span></div>
                  <small>Pay with Bitcoin or Ethereum</small>
                </div>
              </label>
              <label className={`payment-option${paymentMethod === 'paystack' ? ' selected' : ''}`}>
                <input type="radio" name="payment" value="paystack" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                <div>
                  <div>Paystack (Card / Bank)</div>
                  <small>Pay with debit card or bank transfer via Paystack</small>
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
            
            {/* Mobile Checkout Summary - appears before checkout button */}
            {isMobile && (
              <div className="mobile-checkout-summary">
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
                    ) : hasOrderSummary ? (
                      <>
                        <div className="summary-row">
                          <span>Subtotal ({orderSummary.items_count || orderSummary.total_items || 0} items)</span>
                          <span>
                            {formatNgn(summarySubtotalNgn)}
                            <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                              ({summarySubtotalUsdt.toFixed(2)} USDT)
                            </small>
                          </span>
                        </div>

                        {orderSummary.coupon_applied && summaryDiscountNgn > 0 && (
                          <div className="summary-row" style={{ color: '#10b981' }}>
                            <span>Discount</span>
                            <span>
                              -{formatNgn(summaryDiscountNgn)}
                              <small style={{ display: 'block', color: '#10b981', fontSize: '12px' }}>
                                ({summaryDiscountUsdt.toFixed(2)} USDT)
                              </small>
                            </span>
                          </div>
                        )}

                        <div className="summary-row">
                          <span>Tax</span>
                          <span>
                            {formatNgn(summaryTaxNgn)}
                            <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                              ({summaryTaxUsdt.toFixed(2)} USDT)
                            </small>
                          </span>
                        </div>

                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>
                            {formatNgn(summaryShippingNgn)}
                            <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                              ({summaryShippingUsdt.toFixed(2)} USDT)
                            </small>
                            {orderSummary.shipping_note && (
                              <small style={{ display: 'block', color: '#64748b', fontSize: '11px', marginTop: '2px' }}>
                                {orderSummary.shipping_note}
                              </small>
                            )}
                          </span>
                        </div>

                        <div className="summary-row total-row" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#059669', borderTop: '1px solid #e0e0e0', paddingTop: '12px', marginTop: '12px' }}>
                          <span>Total</span>
                          <span>
                            {formatNgn(summaryTotalNgn)}
                            <small style={{ display: 'block', color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                              ({summaryTotalUsdt.toFixed(2)} USDT)
                            </small>
                          </span>
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
                      <li>Lagos: 1-3 business days</li>
                      <li>Other states: 4-5 business days</li>
                      <li>Free shipping on orders above ₦1,000,000</li>
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
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    Loading order summary...
                  </div>
                ) : hasOrderSummary ? (
                  <>
                    <div className="summary-row">
                      <span>Subtotal ({orderSummary.items_count || orderSummary.total_items || 0} items)</span>
                      <span>
                        {formatNgn(summarySubtotalNgn)}
                        {summarySubtotalUsdt >= 0 && (
                          <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                            ({summarySubtotalUsdt.toFixed(2)} USDT)
                          </small>
                        )}
                      </span>
                    </div>

                    {orderSummary.coupon_applied && summaryDiscountNgn > 0 && (
                      <div className="summary-row discount-row">
                        <span style={{ color: '#10b981' }}>Discount</span>
                        <span style={{ color: '#10b981' }}>
                          -{formatNgn(summaryDiscountNgn)}
                          {summaryDiscountUsdt > 0 && (
                            <small style={{ display: 'block', color: '#10b981', fontSize: '12px' }}>
                              (-{summaryDiscountUsdt.toFixed(2)} USDT)
                            </small>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Tax</span>
                      <span>
                        {formatNgn(summaryTaxNgn)}
                        {summaryTaxUsdt >= 0 && (
                          <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                            ({summaryTaxUsdt.toFixed(2)} USDT)
                          </small>
                        )}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>
                        {formatNgn(summaryShippingNgn)}
                        <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                          ({summaryShippingUsdt.toFixed(2)} USDT)
                        </small>
                        {orderSummary.shipping_note && (
                          <small style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                            {orderSummary.shipping_note}
                          </small>
                        )}
                      </span>
                    </div>

                    {!orderSummary.is_free_shipping && orderSummary.free_shipping_remaining && (
                      <div style={{ fontSize: '12px', color: '#f59e0b', fontStyle: 'italic', marginTop: '8px', padding: '8px', backgroundColor: '#fffbeb', borderRadius: '4px' }}>
                        Add ₦{orderSummary.free_shipping_remaining?.toLocaleString()} more for FREE SHIPPING!
                      </div>
                    )}

                    <div className="summary-row total-row" style={{ fontWeight: '700', fontSize: '1.2rem', color: '#059669', borderTop: '1px solid #e0e0e0', paddingTop: '12px', marginTop: '12px' }}>
                      <span>Total</span>
                      <span>
                        {formatNgn(summaryTotalNgn)}
                        <small style={{ display: 'block', color: '#059669', fontSize: '14px', fontWeight: '500' }}>
                          ({summaryTotalUsdt.toFixed(2)} USDT)
                        </small>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₦0.00</span>
                  </div>
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
                {shippingRate && (
                  <div className="summary-row note" style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '10px' }}>
                    <span>
                      Estimated shipping: ₦{shippingRate.shipping_cost.toLocaleString()}
                      {!shippingRate.available ? ' (default rate applied)' : ''}
                    </span>
                  </div>
                )}
                <ul>
                  <li>Lagos: 1-3 business days</li>
                  <li>Other states: 4-5 business days</li>
                  <li>Free shipping on orders above ₦1,000,000</li>
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



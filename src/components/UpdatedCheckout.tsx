import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Phone, Mail } from 'lucide-react';
import { checkoutService, CheckoutFormData } from '../services/checkoutService';
import { cartService } from '../services/cartService';
import { useToast } from '../hooks/useToast';
import { handleApiError } from '../utils/errorHandler';
import {
  validateCheckoutForm,
  formatNaira,
  NIGERIAN_STATES,
  SHIPPING_OPTIONS,
  getPaymentMethodDescription
} from '../utils/paymentUtils';
import './UpdatedCheckout.css';

const UpdatedCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<CheckoutFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postal_code: '',
    payment_method: 'bank_transfer',
    shipping_method: 'standard',
    coupon_code: null,
    cart_token: null
  });

  const [cartSummary, setCartSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Load cart summary and initialize
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get cart summary
        const summary = await cartService.getCartSummary();
        setCartSummary(summary);

        // Get cart token
        const cartToken = cartService.getCartToken();
        setFormData(prev => ({
          ...prev,
          cart_token: cartToken
        }));

        setLoading(false);
      } catch (error: any) {
        showError('Failed to load cart', error.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showError('Invalid coupon', 'Please enter a coupon code');
      return;
    }

    try {
      setApplyingCoupon(true);
      const result = await checkoutService.applyCoupon(couponCode, formData.cart_token);
      setAppliedCoupon(result);
      showSuccess('Coupon applied!', `Discount: ${result.discount || 0}%`);
      setCouponCode('');
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Apply Coupon');
      showError('Invalid coupon', errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await checkoutService.removeCoupon(formData.cart_token);
      setAppliedCoupon(null);
      showSuccess('Coupon removed', 'Your discount has been removed');
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Remove Coupon');
      showError('Failed to remove coupon', errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const { valid, errors: validationErrors } = validateCheckoutForm(formData);
    if (!valid) {
      setErrors(validationErrors);
      showError('Validation failed', 'Please check all required fields');
      return;
    }

    // Prepare checkout data
    const checkoutData: CheckoutFormData = {
      ...formData,
      coupon_code: appliedCoupon?.code || null
    };

    try {
      setSubmitting(true);
      const response = await checkoutService.createOrder(checkoutData);

      if (response.success) {
        // Save payment data
        checkoutService.saveCheckoutData('current_order', response.order);
        checkoutService.saveCheckoutData('payment_info', response.payment_info);
        checkoutService.saveCheckoutData('account_info', response.account_info);

        showSuccess('Order created!', 'Redirecting to payment...');

        // Route based on payment method
        if (formData.payment_method === 'bank_transfer') {
          setTimeout(() => {
            navigate('/payment', { state: { method: 'bank_transfer' } });
          }, 1000);
        } else if (formData.payment_method === 'paystack') {
          // Handle Paystack payment
          // TODO: Initialize Paystack
          showError('Coming soon', 'Paystack payment coming soon');
        }
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error, 'Checkout');
      showError('Checkout failed', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const shippingCost = SHIPPING_OPTIONS.find(
    opt => opt.value === formData.shipping_method
  )?.price || 0;

  const subtotal = cartSummary?.total_amount || 0;
  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal + shippingCost - discount;

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner">
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        {/* Main Form */}
        <div className="checkout-main">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Information */}
            <section className="form-section">
              <h2 className="section-title">
                <MapPin size={20} />
                Shipping Information
              </h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={errors.first_name ? 'error' : ''}
                  />
                  {errors.first_name && (
                    <span className="error-message">{errors.first_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={errors.last_name ? 'error' : ''}
                  />
                  {errors.last_name && (
                    <span className="error-message">{errors.last_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+234 or 070x"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  >
                    <option value="">Select a state</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <span className="error-message">{errors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postal_code">Postal Code</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={errors.country ? 'error' : ''}
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>
                  {errors.country && (
                    <span className="error-message">{errors.country}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="form-section">
              <h2 className="section-title">Shipping Method</h2>
              <div className="shipping-options">
                {SHIPPING_OPTIONS.map(option => (
                  <label key={option.value} className="shipping-option">
                    <input
                      type="radio"
                      name="shipping_method"
                      value={option.value}
                      checked={formData.shipping_method === option.value}
                      onChange={handleInputChange}
                    />
                    <div className="option-content">
                      <div className="option-title">{option.label}</div>
                      <div className="option-desc">{option.description}</div>
                      <div className="option-price">{formatNaira(option.price)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section className="form-section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment_method"
                    value="bank_transfer"
                    checked={formData.payment_method === 'bank_transfer'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <div className="option-title">Bank Transfer</div>
                    <div className="option-desc">
                      {getPaymentMethodDescription('bank_transfer')}
                    </div>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment_method"
                    value="paystack"
                    checked={formData.payment_method === 'paystack'}
                    onChange={handleInputChange}
                  />
                  <div className="option-content">
                    <div className="option-title">Credit/Debit Card</div>
                    <div className="option-desc">
                      {getPaymentMethodDescription('paystack')}
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="checkout-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            {/* Cart Items Summary */}
            <div className="summary-section">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>

              {/* Shipping */}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{formatNaira(shippingCost)}</span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatNaira(discount)}</span>
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              {!appliedCoupon ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={applyingCoupon}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="btn-apply-coupon"
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <div className="coupon-badge">
                    ✓ {appliedCoupon.code}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="btn-remove-coupon"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="summary-total">
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">{formatNaira(total)}</span>
              </div>
            </div>

            {/* Items Count */}
            <div className="items-count">
              {cartSummary?.total_items} items in cart
            </div>
          </div>

          {/* Cart Empty Message */}
          {!cartSummary || cartSummary.total_items === 0 && (
            <div className="empty-cart-message">
              <p>Your cart is empty</p>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="btn-continue-shopping"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default UpdatedCheckout;

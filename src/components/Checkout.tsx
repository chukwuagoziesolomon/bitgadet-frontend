import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Truck, Headphones } from 'lucide-react';
import './Checkout.css';

const Checkout: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [cryptoMethod, setCryptoMethod] = useState<string>('btc');
  
  // Sample cart data - in a real app, this would come from a state management solution
  const cartItems = [
    { id: '1', name: 'iPhone 15 Pro', price: 1850000, quantity: 1 },
    { id: '2', name: 'MacBook Pro 14\" M3', price: 2850000, quantity: 1 },
    { id: '3', name: 'Airpod Pro (2nd Gen)', price: 350000, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5000;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + shipping + tax;
  const usdtRate = 0.00077; // 1 NGN = 0.00077 USDT
  const totalInUsdt = (total * usdtRate).toLocaleString('en-US', { maximumFractionDigits: 2 });

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
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" required />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input type="text" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select required>
                  <option value="">Select Country</option>
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                  <option value="KE">Kenya</option>
                  <option value="ZA">South Africa</option>
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
              <textarea rows={4} placeholder="Any special instructions for your order..."></textarea>
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
              <input type="checkbox" required />
              I agree to the <a href="/terms">Terms and Conditions</a>, and <a href="/privacy">Privacy Policy</a>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              Subscribe to our newsletter for exclusive deals and updates
            </label>
            
            <button className="complete-order-btn">
              Complete Order
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
            <div className="order-row">
              <span>Subtotal (8 Items)</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="order-row">
              <span>Shipping</span>
              <span>₦{shipping.toLocaleString()}</span>
            </div>
            <div className="order-row">
              <span>Tax (7.5%)</span>
              <span>₦{tax.toLocaleString()}</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="usdt-total">
              ≈ {totalInUsdt} USDT
            </div>
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
    </div>
  );
};

export default Checkout;

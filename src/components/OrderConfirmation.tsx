import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Truck, MapPin, Download, MessageCircle, Bell, Shield } from 'lucide-react';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  // Sample order data - in a real app, this would come from props or state
  const orderData = {
    orderNumber: 'BG-GSFMQJHWW',
    orderDate: 'August 19, 2025',
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        image: '/phone1.png',
        quantity: 1,
        price: 1850000
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria'
    },
    estimatedDelivery: 'August 21, 2025',
    subtotal: 1850000,
    shipping: 0,
    total: 1850000,
    cryptoTotal: '1.2 BTC',
    paymentMethod: 'Bitcoin'
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="order-confirmation">
      <div className="order-confirmation-container">
        {/* Header Section */}
        <div className="confirmation-header">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">Thank you for your purchase from BitGadgetz</p>
          <div className="order-details">
            <span>Order #{orderData.orderNumber} • Placed on {orderData.orderDate}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="confirmation-content">
          {/* Left Column */}
          <div className="confirmation-left">
            {/* Order Items */}
            <div className="order-section">
              <div className="section-header">
                <ShoppingBag size={20} />
                <h3>Order Items</h3>
              </div>
              <div className="order-items">
                {orderData.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                      <div className="item-price">{formatNaira(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracking */}
            <div className="order-section">
              <div className="section-header">
                <Truck size={20} />
                <h3>Order Tracking</h3>
              </div>
              <div className="tracking-steps">
                <div className="tracking-step completed">
                  <CheckCircle size={16} />
                  <div className="step-content">
                    <h4>Order Confirmed</h4>
                    <p>Your order has been received and confirmed</p>
                  </div>
                </div>
                <div className="tracking-step completed">
                  <CheckCircle size={16} />
                  <div className="step-content">
                    <h4>Payment Verified</h4>
                    <p>Crypto payment has been verified on blockchain</p>
                  </div>
                </div>
                <div className="tracking-step pending">
                  <div className="step-icon pending">⏰</div>
                  <div className="step-content">
                    <h4>Preparing for Shipment</h4>
                    <p>Your items are being prepared for shipping</p>
                  </div>
                </div>
                <div className="tracking-step pending">
                  <div className="step-icon pending">🚚</div>
                  <div className="step-content">
                    <h4>Out for Delivery</h4>
                    <p>Your order is on the way</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="order-section">
              <div className="section-header">
                <MapPin size={20} />
                <h3>Delivery Information</h3>
              </div>
              <div className="delivery-info">
                <div className="shipping-address">
                  <h4>Shipping Address:</h4>
                  <div className="address-details">
                    <p>{orderData.shippingAddress.name}</p>
                    <p>{orderData.shippingAddress.address}</p>
                    <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
                    <p>{orderData.shippingAddress.country}</p>
                  </div>
                </div>
                <div className="estimated-delivery">
                  <h4>Estimated Delivery:</h4>
                  <p>{orderData.estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="confirmation-right">
            {/* Order Summary */}
            <div className="order-section">
              <h3>Order Summary</h3>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatNaira(orderData.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatNaira(orderData.total)}</span>
                </div>
                <div className="summary-row crypto">
                  <span>Crypto Total:</span>
                  <span>{orderData.cryptoTotal}</span>
                </div>
                <div className="payment-method">
                  <span>Payment Method: {orderData.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="order-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="action-btn download">
                  <Download size={16} />
                  Download Receipt
                </button>
                <button className="action-btn whatsapp">
                  <MessageCircle size={16} />
                  WhatsApp Support
                </button>
                <Link to="/home" className="action-btn continue">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Need Help Section */}
            <div className="order-section help-section">
              <h3>Need Help?</h3>
              <p>Our customer support team is available 24/7 to help with your order.</p>
              <div className="contact-info">
                <div className="contact-item">
                  <span>WhatsApp:</span>
                  <a href="https://wa.me/2349012345678">+234 901 234 5678</a>
                </div>
                <div className="contact-item">
                  <span>Email:</span>
                  <a href="mailto:support@bitgadgetz.com">support@bitgadgetz.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="whats-next-section">
          <h2>What's Next?</h2>
          <div className="next-steps">
            <div className="next-step">
              <div className="step-icon order-updates">
                <Bell size={24} />
              </div>
              <h3>Order Updates</h3>
              <p>We'll send you updates via WhatsApp and email as your order progresses.</p>
            </div>
            
            <div className="next-step">
              <div className="step-icon fast-delivery">
                <Truck size={24} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Your order will be delivered within 2-3 business days in Lagos.</p>
            </div>
            
            <div className="next-step">
              <div className="step-icon quality-guarantee">
                <Shield size={24} />
              </div>
              <h3>Quality Guarantee</h3>
              <p>All products come with manufacturer warranty and our quality guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const confirmation = location.state?.orderConfirmation || {};
  const orderId = confirmation.order_id || 'BG-GSFMQJHWW';

  const [downloading, setDownloading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // SVG icons... (same as before)
  const boxIcon = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3.25 7l6.75-3 6.75 3M3.25 7v6a2 2 0 001.28 1.85l5.47 2.19a2 2 0 001.5 0l5.47-2.19a2 2 0 001.28-1.85V7M3.25 7l6.75 3.25L17.25 7" stroke="#4888d2" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  );
  const truckIcon = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M13 14V7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h10zm0 0h1.38a2 2 0 001.73-1.02l1.62-2.81A1 1 0 0017 9.13V7a2 2 0 00-2-2h-2" stroke="#35af57" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="7" cy="15" r="1.3" stroke="#b6bec1" strokeWidth="1.2"/><circle cx="15" cy="15" r="1.3" stroke="#b6bec1" strokeWidth="1.2"/></svg>
  );
  const checkIcon = (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none"><circle cx="10.5" cy="10.5" r="10.5" fill="#E5FFF1"/><path d="M15.5 8l-4.2 4.25L7.5 10.5" stroke="#23b26d" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const grayCircle = (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none"><circle cx="10.5" cy="10.5" r="9.25" stroke="#d1dde8" strokeWidth="1.5" fill="#fff"/></svg>
  );

  // Fetch comprehensive order status/summary on mount
  useEffect(() => {
    if (orderId) {
      setLoading(true);
      fetch(`/api/checkout/status/${orderId}/`)
        .then(res => res.json())
        .then(data => setCheckoutStatus(data))
        .catch(() => setCheckoutStatus(null))
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  const downloadReceipt = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/receipt/download/`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BitGadgetz_Receipt_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        } else {
        alert('Failed to download receipt');
        }
      } catch (error) {
      alert('Error downloading receipt');
      } finally {
      setDownloading(false);
    }
  };

  const formatNaira = (amount: any) => {
    const num = Number(amount);
    if (isNaN(num)) return amount;
    return '₦' + num.toLocaleString();
  };

  // Extract data from checkoutStatus (with fallback to confirmation)
  const orderSummary = checkoutStatus?.order_summary || {};
  const delivery = checkoutStatus?.delivery_info || {};
  const products = checkoutStatus?.products || [];
  const customer = orderSummary;
  const status = orderSummary.status || confirmation.status;
  const statusDisplay = orderSummary.status_display || status;
  const paymentMethod = orderSummary.payment_method_display || orderSummary.payment_method || confirmation.payment_method || 'Bitcoin';
  const isPaid = status === 'paid';
  const isProcessing = status === 'payment_processing';
  const orderDate = orderSummary.order_date || confirmation.created_at || 'Placed date unavailable';

  // Enhanced Order Tracking steps based on actual order status
  const getTrackingSteps = (orderStatus: string) => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', desc: 'Your order has been received and confirmed' },
      { key: 'payment_verified', label: 'Payment Verified', desc: `${paymentMethod} payment has been verified` },
      { key: 'preparing', label: 'Preparing for Shipment', desc: 'Your items are being prepared for shipping' },
      { key: 'shipped', label: 'Out for Delivery', desc: 'Your order is on the way' }
    ];

    return steps.map(step => {
      let isComplete = false;
      let isCurrent = false;

      // Enhanced status mapping based on order status
      switch (orderStatus) {
        case 'paid':
        case 'confirmed':
          isComplete = ['confirmed', 'payment_verified'].includes(step.key);
          isCurrent = step.key === 'payment_verified';
          break;
        case 'payment_processing':
          isComplete = step.key === 'confirmed';
          isCurrent = step.key === 'payment_verified';
          break;
        case 'preparing':
          isComplete = ['confirmed', 'payment_verified'].includes(step.key);
          isCurrent = step.key === 'preparing';
          break;
        case 'shipped':
        case 'in_transit':
          isComplete = ['confirmed', 'payment_verified', 'preparing', 'shipped'].includes(step.key);
          isCurrent = step.key === 'shipped';
          break;
        default:
          isComplete = step.key === 'confirmed';
          isCurrent = step.key === 'payment_verified';
      }

      return {
        ...step,
        icon: isComplete ? checkIcon : grayCircle,
        highlight: isComplete
      };
    });
  };

  const trackingSteps = getTrackingSteps(status);

  // --- Render ---
    return (
    <div className={styles.container}>
      {/* Header/Hero */}
      <div className={styles.confirmHeaderWrapper}>
        {(isPaid) ? (
          <div className={styles.confirmIconCircle}>
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <circle cx="27" cy="27" r="27" fill="#E5FFF1"/>
              <path d="M36 21L25.5 31.5L21 27" stroke="#23b26d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
        ) : (
          <div className={styles.confirmIconCircle}></div>
        )}
        <div className={styles.orderConfirmedText}>
          {isPaid ? (statusDisplay || 'Order Confirmed!') : 'Payment is still processing'}
            </div>
        <div className={styles.confirmSubhead}>
          Thank you for your purchase from BitGadgetz{customer.customer_name ? `, ${customer.customer_name}` : ''}
            </div>
        <div className={styles.confirmOrderLine}>
          <span className={styles.orderNumber}>Order #{orderSummary.order_id || orderId}</span>
          <span className={styles.dot}>•</span>
          <span className={styles.placedOn}>{orderDate}</span>
        </div>
      </div>
      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          {/* Order Items - actual products */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>{boxIcon} Order Items</div>
            {products.length ? (
              products.map((prod: any) => (
                <div className={styles.orderItemRow} key={prod.id}>
                  <img
                    src={prod.image || ''}
                    alt={prod.name || ''}
                    className={styles.productImg}
                  />
                  <div>
                    <div className={styles.productName}>{prod.name}</div>
                    <div className={styles.productPrice}>{formatNaira(prod.discounted_price ?? prod.price)}</div>
                    <div className={styles.productQty}>Quantity: {prod.quantity}</div>
                    <div className={styles.productQty} style={{opacity:0.7}}>{prod.brand} {prod.model}</div>
            </div>
                </div>
              ))
            ) : (
              <div>No products found for this order.</div>
            )}
          </div>
            {/* Order Tracking */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>{truckIcon} Order Tracking</div>
            {trackingSteps.map((step, idx) => (
              <div className={styles.trackingStep} key={step.label}>
                <span className={step.highlight ? styles.checkIcon : styles.grayIcon}>{step.icon}</span>
                <div>
                  <div className={styles.stepTitle}>{step.label}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
            </div>
          {/* Delivery Info */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}><span className={styles.deliveryIcon}>📍</span> Delivery Information</div>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryLabel}>Shipping Address</div>
              <div>{delivery.shipping_address?.full_address || 'N/A'}</div>
              <div className={styles.estimatedDelivery}>
                Estimated Delivery <span className={styles.deliveryDate}>{delivery.estimated_delivery || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightCol}>
            {/* Order Summary */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Order Summary</div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.bold}>{delivery.subtotal !== undefined ? formatNaira(delivery.subtotal) : ''}</span>
                </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.success}>{delivery.shipping_cost === 0 || delivery.shipping_cost === '0' ? 'Free' : formatNaira(delivery.shipping_cost)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.boldTotal}>{delivery.total_amount !== undefined ? formatNaira(delivery.total_amount) : ''}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Payment Method</span>
              <span className={styles.methodTag}>{paymentMethod}</span>
            </div>
          </div>
          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Quick Actions</div>
            <button className={styles.downloadBtn} onClick={downloadReceipt} disabled={downloading}>
              <span className={styles.downloadIcon}>
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none"><path d="M10 3v9.588m0 0l4.166-4.166m-4.166 4.166L5.833 8.422M3 17h14" stroke="#2181e2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              {downloading ? 'Downloading...' : 'Download Receipt'}
            </button>
            <a href="https://wa.me/2349138666111" target="_blank" rel="noopener noreferrer">
              <button className={styles.whatsappBtn}>
                <span className={styles.whatsappIcon}>
                  <svg width="18" height="18" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="17" fill="#25D366"/><path d="M23.19 19.87c-.34-.18-2.04-1-2.35-1.11-.3-.11-.52-.18-.74.18-.22.36-.85 1.11-1.05 1.33-.19.22-.39.24-.72.06-.34-.18-1.42-.52-2.71-1.66-1-1-.67-1.08-.49-1.27.16-.16.36-.39.54-.58.18-.2.24-.35.36-.57.12-.23.06-.42-.03-.6-.1-.17-.74-1.8-1-2.46-.26-.63-.53-.54-.73-.55-.19-.01-.41-.01-.63-.01-.22 0-.57.07-.87.32-.29.25-1.1 1.07-1.1 2.59s1.13 3.01 1.29 3.22c.16.22 2.23 3.56 5.45 4.42 3.23.86 3.23.57 3.82.54.59-.03 1.89-.77 2.16-1.54.28-.77.28-1.44.19-1.54-.08-.1-.3-.16-.63-.33z" fill="#fff"/></svg>
                </span>
                WhatsApp Support
              </button>
            </a>
            <button className={styles.continueBtn}>Continue Shopping</button>
          </div>
          {/* Need Help */}
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Need Help?</div>
            <div className={styles.helpText}>Our customer support team is available 24/7 to help with your order.</div>
            <div className={styles.contactItem}>WhatsApp: <span className={styles.contactVal}>{customer.customer_phone || '+234 901 234 5678'}</span></div>
            <div className={styles.contactItem}>Email: <span className={styles.contactVal}>{customer.customer_email || 'support@bitgadgetz.com'}</span></div>
          </div>
        </div>
                </div>
      {/* What's Next Section - Spanning Full Width */}
      <div className={styles.whatsNextCard}>
        <div className={styles.whatsNextTitle}>What's Next?</div>
        <div className={styles.whatsNextGrid}>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#e5efff'}}>
              {/* Message Icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="none"/><path d="M23 11C23 9.89543 22.1046 9 21 9H11C9.89543 9 9 9.89543 9 11V18C9 19.1046 9.89543 20 11 20H19.5858L22.2929 22.7071C22.9229 23.3371 24 22.8903 24 22.0001V11ZM21 13L16 16L11 13" stroke="#2766e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className={styles.whatsNextLabel}>Order Updates</div>
            <div className={styles.whatsNextDesc}>We’ll send you updates via WhatsApp and email as your order progresses.</div>
          </div>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#e6fff1'}}>
              {/* Truck Icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="none" /><path d="M6 20V12C6 10.8954 6.89543 10 8 10H20C21.1046 10 22 10.8954 22 12V20M22 20H23C23.5523 20 24 19.5523 24 19V17C24 16.4477 23.5523 16 23 16H22M22 20V22M6 22V20M14 23C14.5523 23 15 22.5523 15 22C15 21.4477 14.5523 21 14 21C13.4477 21 13 21.4477 13 22C13 22.5523 13.4477 23 14 23ZM22 23C22.5523 23 23 22.5523 23 22C23 21.4477 22.5523 21 22 21C21.4477 21 21 21.4477 21 22C21 22.5523 21.4477 23 22 23Z" stroke="#01ad69" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className={styles.whatsNextLabel}>Fast Delivery</div>
            <div className={styles.whatsNextDesc}>Your order will be delivered within 2-3 business days in Lagos.</div>
              </div>
          <div className={styles.whatsNextFeature}>
            <div className={styles.whatsNextIcon} style={{background:'#f6ebff'}}>
              {/* Shield-Check/Guarantee Icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="none" /><path d="M23 12V17.5C23 20.5376 19.9642 23 16 23C12.0358 23 9 20.5376 9 17.5V12L16 9L23 12ZM14.6464 17.3536L12.6464 15.3536C12.4512 15.1583 12.1346 15.1583 11.9393 15.3536C11.7441 15.5488 11.7441 15.8654 11.9393 16.0607L14.2929 18.4142C14.6834 18.8047 15.3166 18.8047 15.7071 18.4142C15.8047 18.3166 15.9414 18.3166 16.039 18.4142L20.0607 14.3924C20.2559 14.1972 20.2559 13.8806 20.0607 13.6854C19.8654 13.4901 19.5488 13.4901 19.3536 13.6854L15.3536 17.6854C15.1583 17.8806 14.8417 17.8806 14.6464 17.6854V17.3536Z" stroke="#9D5DEF" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <div className={styles.whatsNextLabel}>Quality Guarantee</div>
            <div className={styles.whatsNextDesc}>All products come with manufacturer warranty and our quality guarantee.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

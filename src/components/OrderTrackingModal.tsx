import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Truck, Clock, MapPin, Package, Loader2 } from 'lucide-react';
import { conditionalApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './OrderTrackingModal.css';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, orderId }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';

      // Fetch tracking data when modal opens
      if (orderId) {
        fetchTrackingData(orderId);
      }
    } else {
      setIsAnimating(false);
      setTrackingData(null);
      setError(null);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, orderId]);

  const fetchTrackingData = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await conditionalApiRequest<any>(`/api/checkout/${id}/status/`);
      setTrackingData(response);
    } catch (err: any) {
      console.error('Failed to fetch tracking data:', err);
      setError(err.message || 'Failed to load tracking information');
      showError('Failed to load tracking data', err.message || 'Please try again later');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !orderId) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={48} color="#00C896" />;
      case 'paid':
      case 'processing':
        return <Package size={48} color="#f59e0b" />;
      case 'shipped':
      case 'in_transit':
        return <Truck size={48} color="#3b82f6" />;
      default:
        return <Clock size={48} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#00C896';
      case 'paid':
      case 'processing':
        return '#f59e0b';
      case 'shipped':
      case 'in_transit':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className={`modal-overlay ${isAnimating ? 'active' : ''}`} onClick={onClose}>
      <div className={`modal-content ${isAnimating ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="order-info">
            <div className="order-details">
              <h3 className="order-id">Order #{trackingData?.order_summary?.order_id || orderId}</h3>
              {trackingData && (
                <>
                  <p className="order-date">Ordered on {formatDate(trackingData.order_summary?.order_date || new Date().toISOString())}</p>
                  <p className="order-status">Status: {trackingData.order_summary?.status_display}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-section">
              <Loader2 size={48} className="loading-spinner" />
              <p>Loading tracking information...</p>
            </div>
          ) : error ? (
            <div className="error-section">
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={() => orderId && fetchTrackingData(orderId)}>
                Try Again
              </button>
            </div>
          ) : trackingData ? (
            <>
              <div className="status-section">
                <div className="status-icon">
                  {getStatusIcon(trackingData.order_summary?.status)}
                </div>
                <h2 className="status-title" style={{ color: getStatusColor(trackingData.order_summary?.status) }}>
                  {trackingData.order_summary?.status_display}
                </h2>
              </div>

              {/* Products Section */}
              {trackingData.products && trackingData.products.length > 0 && (
                <div className="products-section">
                  <h3>Order Items</h3>
                  <div className="products-list">
                    {trackingData.products.map((product: any, index: number) => (
                      <div key={index} className="product-item">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="product-thumbnail" />
                        )}
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-quantity">Qty: {product.quantity}</p>
                          <p className="product-price">{formatNaira(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary Section */}
              {trackingData.order_summary && (
                <div className="order-summary-section">
                  <h3>Order Summary</h3>
                  <div className="summary-item">
                    <span>Total Amount:</span>
                    <span className="summary-value">{formatNaira(trackingData.order_summary.total_amount)}</span>
                  </div>
                </div>
              )}

              {/* Payment Status Section */}
              {trackingData.payment_status && (
                <div className="payment-section">
                  <h3>Payment Information</h3>
                  <div className="payment-details">
                    <div className="payment-item">
                      <strong>Status:</strong> 
                      <span style={{ 
                        color: trackingData.payment_status.status === 'paid' ? '#00C896' : '#f59e0b',
                        textTransform: 'capitalize'
                      }}>
                        {trackingData.payment_status.status}
                      </span>
                    </div>
                    {trackingData.payment_status.payment_reference && (
                      <div className="payment-item">
                        <strong>Reference:</strong> {trackingData.payment_status.payment_reference}
                      </div>
                    )}
                    {trackingData.order_summary?.payment_method && (
                      <div className="payment-item">
                        <strong>Method:</strong> 
                        <span style={{ textTransform: 'capitalize' }}>
                          {trackingData.order_summary.payment_method.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tracking Information Section */}
              {trackingData.payment_status?.tracking_info && (
                <div className="tracking-info">
                  <h3>Shipping Information</h3>
                  <div className="tracking-details">
                    {trackingData.payment_status.tracking_info.tracking_number && (
                      <div className="tracking-item">
                        <strong>Tracking Number:</strong> {trackingData.payment_status.tracking_info.tracking_number}
                      </div>
                    )}
                    {trackingData.payment_status.tracking_info.carrier_name && (
                      <div className="tracking-item">
                        <strong>Carrier:</strong> {trackingData.payment_status.tracking_info.carrier_name}
                      </div>
                    )}
                    {trackingData.payment_status.tracking_info.estimated_delivery && (
                      <div className="tracking-item">
                        <strong>Estimated Delivery:</strong> {formatDate(trackingData.payment_status.tracking_info.estimated_delivery)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {trackingData.payment_status?.tracking_info?.tracking_notes && (
                <div className="tracking-timeline">
                  <h3>Tracking Updates</h3>
                  <div className="tracking-notes">
                    {trackingData.payment_status.tracking_info.tracking_notes.split('\n').map((note: string, index: number) => (
                      <div key={index} className="tracking-note">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address Section */}
              {trackingData.delivery_info && (
                <div className="delivery-info">
                  {trackingData.delivery_info.shipping_address && (
                    <div className="info-card">
                      <MapPin size={20} />
                      <div>
                        <h4>Delivery Address</h4>
                        <div className="address-text">
                          {trackingData.delivery_info.shipping_address.street_address && (
                            <p>{trackingData.delivery_info.shipping_address.street_address}</p>
                          )}
                          {trackingData.delivery_info.shipping_address.city && (
                            <p>
                              {trackingData.delivery_info.shipping_address.city}
                              {trackingData.delivery_info.shipping_address.state && `, ${trackingData.delivery_info.shipping_address.state}`}
                            </p>
                          )}
                          {trackingData.delivery_info.shipping_address.country && (
                            <p>{trackingData.delivery_info.shipping_address.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {trackingData.delivery_info.tracking_available && (
                    <div className="info-card">
                      <Package size={20} />
                      <div>
                        <h4>Tracking Available</h4>
                        <p>Yes</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {trackingData && trackingData.order_summary?.status !== 'delivered' && (
            <button className="btn-primary">
              Contact Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
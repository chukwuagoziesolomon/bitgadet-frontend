import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Truck, Clock, MapPin, Package, Loader2, CreditCard } from 'lucide-react';
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
      const response = await conditionalApiRequest<any>(`/api/checkout/status/${id}/`);
      console.log('📍 Tracking data received:', response);
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
              <h3 className="order-id">Order #{trackingData?.order?.order_id || orderId}</h3>
              {trackingData?.order && (
                <>
                  <p className="order-status">Status: {trackingData.order.status?.charAt(0).toUpperCase() + trackingData.order.status?.slice(1).replace('_', ' ')}</p>
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
              {/* Status Icon and Title */}
              <div className="status-section">
                <div className="status-icon">
                  {getStatusIcon(trackingData.order?.status)}
                </div>
                <h2 className="status-title" style={{ color: getStatusColor(trackingData.order?.status) }}>
                  {trackingData.order?.status ? trackingData.order.status.charAt(0).toUpperCase() + trackingData.order.status.slice(1).replace('_', ' ') : 'Order Status Unknown'}
                </h2>
              </div>

              {/* Tracking Available Badge */}
              {trackingData.order && (
                <div style={{ marginBottom: '20px' }}>
                  {['shipped', 'en_route', 'delivered'].includes(trackingData.order.status) ? (
                    <div style={{
                      background: '#d1fae5',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#065f46',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle size={16} />
                      <span>Tracking Available</span>
                    </div>
                  ) : (
                    <div style={{
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#92400e',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Clock size={16} />
                      <span>{trackingData.order.status === 'pending' ? 'Awaiting Payment' : 'Order Being Prepared'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tracking Information - When Shipped */}
              {trackingData.order && ['shipped', 'en_route', 'delivered'].includes(trackingData.order.status) && (
                <div className="tracking-info" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={18} />
                    <span>Shipping Details</span>
                  </h3>
                  {trackingData.order.tracking_number && (
                    <div style={{ marginBottom: '12px', padding: '10px', background: '#f0f9ff', borderRadius: '6px' }}>
                      <strong>Tracking Number:</strong>
                      <div style={{ fontSize: '14px', color: '#1e40af', fontFamily: 'monospace', marginTop: '4px' }}>
                        {trackingData.order.tracking_number}
                      </div>
                    </div>
                  )}
                  {trackingData.order.carrier_name && (
                    <div style={{ marginBottom: '12px', padding: '10px', background: '#f3f4f6', borderRadius: '6px' }}>
                      <strong>Carrier:</strong>
                      <div style={{ fontSize: '14px', marginTop: '4px' }}>
                        {trackingData.order.carrier_name}
                      </div>
                    </div>
                  )}
                  {trackingData.order.tracking_url && (
                    <a 
                      href={trackingData.order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '12px',
                        padding: '10px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      Track Package →
                    </a>
                  )}
                </div>
              )}

              {/* Payment Status Section */}
              {trackingData.payment_status && (
                <div className="payment-section" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} />
                    <span>Payment Status</span>
                  </h3>
                  <div style={{
                    padding: '12px',
                    background: trackingData.payment_status.is_paid ? '#d1fae5' : '#fef3c7',
                    border: `1px solid ${trackingData.payment_status.is_paid ? '#10b981' : '#f59e0b'}`,
                    borderRadius: '6px',
                    color: trackingData.payment_status.is_paid ? '#065f46' : '#92400e'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {trackingData.payment_status.is_paid ? (
                        <><CheckCircle size={14} /> <span>Payment Confirmed</span></>
                      ) : (
                        <><Clock size={14} /> <span>Payment Pending</span></>
                      )}
                    </div>
                    <div style={{ fontSize: '13px' }}>
                      Method: {trackingData.payment_status.payment_method}
                    </div>
                    {trackingData.payment_status.payment_reference && (
                      <div style={{ fontSize: '13px', marginTop: '4px' }}>
                        Reference: <code>{trackingData.payment_status.payment_reference}</code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bank Transfer Details - If Pending */}
              {trackingData.payment_status?.is_pending && trackingData.payment_status?.bank_transfer && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} />
                    <span>Bank Transfer Details</span>
                  </h3>
                  <div style={{ 
                    padding: '14px', 
                    background: '#f8fafc', 
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Bank Name</div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{trackingData.payment_status.bank_transfer.bank_name}</div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Account Name</div>
                      <div style={{ fontWeight: '600' }}>{trackingData.payment_status.bank_transfer.account_name}</div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Account Number</div>
                      <div style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '15px' }}>
                        {trackingData.payment_status.bank_transfer.account_number}
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Reference</div>
                      <div style={{ fontWeight: '600', color: '#3b82f6', fontFamily: 'monospace' }}>
                        {trackingData.payment_status.bank_transfer.reference}
                      </div>
                    </div>
                    {trackingData.payment_status.bank_transfer.expires_at && (
                      <div style={{ 
                        marginTop: '12px',
                        padding: '8px',
                        background: '#fef2f2',
                        borderRadius: '4px',
                        color: '#991b1b',
                        fontSize: '12px'
                      }}>
                        <Clock size={12} /> Payment expires on {formatDate(trackingData.payment_status.bank_transfer.expires_at)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Amount */}
              {trackingData.order?.total_amount && (
                <div style={{
                  padding: '14px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>Total Amount</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
                    {formatNaira(trackingData.order.total_amount)}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {trackingData?.order && trackingData.order.status !== 'delivered' && (
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
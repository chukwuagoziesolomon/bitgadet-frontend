import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Truck, Clock, MapPin, Package } from 'lucide-react';
import './OrderTrackingModal.css';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    productName: string;
    image: string;
    status: string;
    statusColor: string;
    date: string;
    price: number;
  } | null;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, order }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={48} color="#00C896" />;
      case 'processing':
        return <Package size={48} color="#f59e0b" />;
      case 'en-route':
      case 'en route':
        return <Truck size={48} color="#3b82f6" />;
      default:
        return <Truck size={48} color="#3b82f6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#00C896';
      case 'processing':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          title: 'Order Delivered Successfully!',
          message: 'Your order has been delivered to your doorstep. Enjoy your new gadget!',
          steps: [
            { icon: Package, label: 'Order Placed', completed: true, time: '2 days ago' },
            { icon: Clock, label: 'Processing', completed: true, time: '1 day ago' },
            { icon: Truck, label: 'Out for Delivery', completed: true, time: '6 hours ago' },
            { icon: CheckCircle, label: 'Delivered', completed: true, time: 'Just now' }
          ]
        };
      case 'processing':
        return {
          title: 'Order is Being Processed',
          message: 'Your order is currently being prepared and will be shipped soon.',
          steps: [
            { icon: Package, label: 'Order Placed', completed: true, time: '1 day ago' },
            { icon: Clock, label: 'Processing', completed: true, time: 'Now' },
            { icon: Truck, label: 'Out for Delivery', completed: false, time: 'Soon' },
            { icon: CheckCircle, label: 'Delivered', completed: false, time: '2-3 days' }
          ]
        };
      case 'en-route':
      case 'en route':
        return {
          title: 'Order is On the Way!',
          message: 'Your order is out for delivery and will arrive soon.',
          steps: [
            { icon: Package, label: 'Order Placed', completed: true, time: '3 days ago' },
            { icon: Clock, label: 'Processing', completed: true, time: '2 days ago' },
            { icon: Truck, label: 'Out for Delivery', completed: true, time: 'Now' },
            { icon: CheckCircle, label: 'Delivered', completed: false, time: 'Today' }
          ]
        };
      default:
        return {
          title: 'Order is On the Way!',
          message: 'Your order is out for delivery and will arrive soon.',
          steps: [
            { icon: Package, label: 'Order Placed', completed: true, time: '3 days ago' },
            { icon: Clock, label: 'Processing', completed: true, time: '2 days ago' },
            { icon: Truck, label: 'Out for Delivery', completed: true, time: 'Now' },
            { icon: CheckCircle, label: 'Delivered', completed: false, time: 'Today' }
          ]
        };
    }
  };

  const statusInfo = getStatusMessage(order.status);

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
            <img src={order.image} alt={order.productName} className="order-image" />
            <div className="order-details">
              <h3 className="order-id">Order #{order.id}</h3>
              <p className="product-name">{order.productName}</p>
              <p className="order-date">Ordered on {order.date}</p>
              <p className="order-price">{formatNaira(order.price)}</p>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="status-section">
            <div className="status-icon">
              {getStatusIcon(order.status)}
            </div>
            <h2 className="status-title" style={{ color: getStatusColor(order.status) }}>
              {statusInfo.title}
            </h2>
            <p className="status-message">{statusInfo.message}</p>
          </div>

          <div className="tracking-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline">
              {statusInfo.steps.map((step, index) => (
                <div key={index} className={`timeline-item ${step.completed ? 'completed' : 'pending'}`}>
                  <div className="timeline-icon">
                    <step.icon size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>{step.label}</h4>
                    <p>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-info">
            <div className="info-card">
              <MapPin size={20} />
              <div>
                <h4>Delivery Address</h4>
                <p>123 Tech Street, Lagos, Nigeria</p>
              </div>
            </div>
            <div className="info-card">
              <Truck size={20} />
              <div>
                <h4>Estimated Delivery</h4>
                <p>{order.status === 'Delivered' ? 'Delivered' : '2-3 business days'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {order.status !== 'Delivered' && (
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
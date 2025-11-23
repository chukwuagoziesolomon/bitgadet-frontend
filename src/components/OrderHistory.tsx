import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import OrderTrackingModal from './OrderTrackingModal';
import { apiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<any>(
          `${API_CONFIG.ENDPOINTS.USER_ORDER_HISTORY}?page=${currentPage}&page_size=${pageSize}`
        );
        setOrders(response.orders || []);
        setPagination(response.pagination);
      } catch (error: any) {
        console.error('Failed to fetch order history:', error);
        showError('Failed to load order history', error.message || 'Please try again later.');
        setOrders([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [currentPage, pageSize, showError]);

 const formatNaira = (amount: number) => {
   return `₦${amount.toLocaleString()}`;
 };

 const handleSidebarNavigation = (itemId: string) => {
   setActiveTab(itemId);

   switch (itemId) {
     case 'dashboard':
       navigate('/dashboard');
       break;
     case 'profile':
       navigate('/profile-settings');
       break;
     case 'orders':
       navigate('/order-history');
       break;
     case 'wishlist':
       navigate('/wishlist');
       break;
     case 'support':
       navigate('/contact-support');
       break;
     case 'logout':
       navigate('/login');
       break;
     default:
       break;
   }
 };

 const handleTrackOrder = (order: any) => {
   setSelectedOrder(order.order_id);
   setTrackingModalOpen(true);
 };

 const canTrackOrder = (status: string) => {
   return ['shipped', 'en_route', 'en-route', 'delivered'].includes(status?.toLowerCase());
 };

 const getTrackingBadgeInfo = (status: string) => {
   const statusLower = status?.toLowerCase();
   if (['shipped', 'en_route', 'en-route'].includes(statusLower)) {
     return { text: '📦 In Transit', color: '#3b82f6', bgColor: '#eff6ff' };
   } else if (statusLower === 'delivered') {
     return { text: '✓ Delivered', color: '#10b981', bgColor: '#f0fdf4' };
   } else if (statusLower === 'pending') {
     return { text: '⏳ Pending Payment', color: '#f59e0b', bgColor: '#fffbeb' };
   } else if (['processing', 'payment_processing'].includes(statusLower)) {
     return { text: '⚙ Preparing', color: '#8b5cf6', bgColor: '#f5f3ff' };
   }
   return { text: status, color: '#6b7280', bgColor: '#f3f4f6' };
 };

 const handlePageChange = (page: number) => {
   setCurrentPage(page);
 };

 const closeTrackingModal = () => {
   setTrackingModalOpen(false);
   setSelectedOrder(null);
 };

 return (
   <div className="order-history-page">
     <Navbar />

     <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
       <div className="order-history-section">
         <div className="section-header">
           <h2>Order History</h2>
           {pagination && (
             <div className="orders-count">
               {pagination.total_orders} orders total
             </div>
           )}
         </div>

         {loading ? (
           <div className="loading-orders">
             <div className="loading-spinner">Loading order history...</div>
           </div>
         ) : orders.length === 0 ? (
           <div className="empty-orders">
             <div className="empty-state">
               <CheckCircle size={48} className="empty-icon" />
               <p>No orders found.</p>
             </div>
           </div>
         ) : (
           <>
             <div className="orders-list">
               {orders.map((order) => {
                 const firstProduct = order.products?.[0];
                 const canTrack = canTrackOrder(order.status);
                 const trackingBadge = getTrackingBadgeInfo(order.status);
                 
                 return (
                   <div key={order.order_id} className="order-card">
                     <div className="order-image-container">
                       <img src={firstProduct?.image || '/placeholder.png'} alt={firstProduct?.name || 'Product'} className="order-image" />
                     </div>
                     <div className="order-content">
                       <div className="order-header">
                         <div className="order-id">{order.order_id}</div>
                       </div>
                       <h3 className="order-product">{firstProduct?.name || 'Product'}</h3>
                       <div className="order-date">{order.date}</div>
                       
                       {/* Tracking Badge */}
                       <div style={{
                         display: 'inline-block',
                         padding: '4px 10px',
                         borderRadius: '6px',
                         fontSize: '13px',
                         fontWeight: '600',
                         backgroundColor: trackingBadge.bgColor,
                         color: trackingBadge.color,
                         marginBottom: '8px'
                       }}>
                         {trackingBadge.text}
                       </div>
                       
                       <button 
                         onClick={() => handleTrackOrder(order)} 
                         className="track-button"
                         style={{
                           opacity: canTrack ? 1 : 0.6,
                           cursor: canTrack ? 'pointer' : 'default'
                         }}
                       >
                         {canTrack ? 'Track Order' : 'View Details'}
                       </button>
                     </div>
                     <div className="order-right-section">
                       <span className={`status-badge ${order.status}`}>
                         {order.status === 'delivered' && <CheckCircle size={14} />}
                         {order.status === 'processing' && <Clock size={14} />}
                         {order.status === 'en-route' && <Truck size={14} />}
                         {order.status_display || order.status}
                       </span>
                       <div className="order-price">
                         {formatNaira(order.total_amount)}
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>

             {/* Pagination */}
             {pagination && pagination.total_pages > 1 && (
               <div className="pagination">
                 <button
                   className="pagination-btn"
                   onClick={() => handlePageChange(currentPage - 1)}
                   disabled={!pagination.has_previous}
                 >
                   <ChevronLeft size={16} />
                   Previous
                 </button>

                 <div className="pagination-info">
                   Page {pagination.current_page} of {pagination.total_pages}
                 </div>

                 <button
                   className="pagination-btn"
                   onClick={() => handlePageChange(currentPage + 1)}
                   disabled={!pagination.has_next}
                 >
                   Next
                   <ChevronRight size={16} />
                 </button>
               </div>
             )}
           </>
         )}
       </div>
     </Sidebar>

     <Footer />

     <OrderTrackingModal
       isOpen={trackingModalOpen}
       onClose={closeTrackingModal}
       orderId={selectedOrder}
     />
   </div>
 );
};

export default OrderHistory;
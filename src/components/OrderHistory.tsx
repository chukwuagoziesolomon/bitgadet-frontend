import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Truck } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import OrderTrackingModal from './OrderTrackingModal';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('orders');
 const [trackingModalOpen, setTrackingModalOpen] = useState(false);
 const [selectedOrder, setSelectedOrder] = useState<any>(null);


 // Sample orders data
 const orders = [
   {
     id: 'ORD-2025-001',
     productName: 'MacBook Pro 14" M3',
     image: '/laptop1.png',
     date: '1/14/2024',
     status: 'Delivered',
     price: 2850000,
     statusColor: 'delivered'
   },
   {
     id: 'ORD-2025-002',
     productName: 'iPhone 13 Pro',
     image: '/phone1.png',
     date: '1/10/2024',
     status: 'En Route',
     price: 540000,
     statusColor: 'en-route'
   },
   {
     id: 'ORD-2025-003',
     productName: 'MacBook Pro 14" M3',
     image: '/laptop.png',
     date: '1/8/2024',
     status: 'Processing',
     price: 2850000,
     statusColor: 'processing'
   },
   {
     id: 'ORD-2025-004',
     productName: 'MacBook Pro 14" M3',
     image: '/headphone.png',
     date: '1/5/2024',
     status: 'Processing',
     price: 2850000,
     statusColor: 'processing'
   }
 ];

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
   setSelectedOrder(order);
   setTrackingModalOpen(true);
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
         </div>
         <div className="orders-list">
           {orders.map((order) => (
             <div key={order.id} className="order-card">
               <div className="order-image-container">
                 <img src={order.image} alt={order.productName} className="order-image" />
               </div>
               <div className="order-content">
                 <div className="order-header">
                   <div className="order-id">{order.id}</div>
                 </div>
                 <h3 className="order-product">{order.productName}</h3>
                 <div className="order-date">{order.date}</div>
                 <button onClick={() => handleTrackOrder(order)} className="track-button">
                   Track Order
                 </button>
               </div>
               <div className="order-right-section">
                 <span className={`status-badge ${order.statusColor}`}>
                   {order.statusColor === 'delivered' && <CheckCircle size={14} />}
                   {order.statusColor === 'processing' && <Clock size={14} />}
                   {order.statusColor === 'en-route' && <Truck size={14} />}
                   {order.status}
                 </span>
                 <div className="order-price">
                   {formatNaira(order.price)}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
     </Sidebar>

     <Footer />

     <OrderTrackingModal
       isOpen={trackingModalOpen}
       onClose={closeTrackingModal}
       order={selectedOrder}
     />
   </div>
 );
};

export default OrderHistory;
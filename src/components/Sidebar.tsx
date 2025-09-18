import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Heart, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import TrendingUp from './icons/TrendingUp';
import './Sidebar.css';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path?: string;
}

interface SidebarProps {
  activeTab?: string;
  onItemClick?: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'profile', label: 'Profile Settings', icon: User, path: '/profile-settings' },
    { id: 'orders', label: 'Order History', icon: FileText, path: '/order-history' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/contact-support' },
    { id: 'logout', label: 'Sign Out', icon: LogOut }
  ];

  const handleItemClick = (item: SidebarItem) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      // Default navigation behavior
      if (item.id === 'logout') {
        navigate('/login');
      } else if (item.path) {
        navigate(item.path);
      }
    }
  };

  const getActiveTab = () => {
    if (activeTab) {
      return activeTab;
    }
    
    // Auto-detect active tab based on current route
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.id : 'dashboard';
  };

  return (
    <aside className="dashboard-sidebar">
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${getActiveTab() === item.id ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

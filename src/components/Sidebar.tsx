import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  FileText,
  Heart,
  HelpCircle,
  LogOut,
  Bell,
  BarChart3
} from 'lucide-react';
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
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onItemClick, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(activeTab || 'dashboard');

  // Get user data from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const userData = {
    name: user?.first_name || 'User',
    fullName: user ? `${user.first_name} ${user.last_name}` : 'User',
    role: 'Customer',
    profileImage: '/profile-placeholder.png',
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'profile', label: 'Profile Settings', icon: User, path: '/profile-settings' },
    { id: 'orders', label: 'Order History', icon: FileText, path: '/order-history' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/contact-support' },
    { id: 'logout', label: 'Sign Out', icon: LogOut }
  ];

  const handleItemClick = (item: SidebarItem) => {
    setCurrentTab(item.id);

    if (onItemClick) {
      onItemClick(item.id);
    } else {
      if (item.id === 'logout') {
        navigate('/login');
      } else if (item.path) {
        navigate(item.path);
      }
    }
  };

  const getActiveTab = () => {
    if (currentTab) {
      return currentTab;
    }
    const currentPath = location.pathname;
    const currentItem = sidebarItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.id : 'dashboard';
  };

  return (
    <div className="sidebar-layout">
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

      <main className="sidebar-main">
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {userData.name}</h1>
            <p>Manage your account and track your orders.</p>
          </div>
          <div className="profile-section">
            <img src={userData.profileImage} alt="Profile" className="profile-image" />
            <div className="profile-info">
              <span className="profile-name">{userData.fullName}</span>
              <span className="profile-role">{userData.role}</span>
            </div>
            <button className="notification-button">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
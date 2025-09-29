import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './ProfileSettings.css';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Emmanuel',
    lastName: 'Nchuma',
    displayName: 'nchumaemmanuel@gmail.com',
    currentPassword: 'nchumaemmanuel@gmail.com',
    newPassword: 'nchumaemmanuel@gmail.com',
    confirmPassword: 'nchumaemmanuel@gmail.com',
    newsletter: 'subscribe'
  });

  const [activeTab, setActiveTab] = useState('profile');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      newsletter: e.target.value
    }));
  };

  const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log('Saving changes:', formData);

    // Use custom notification instead of browser alert
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">✓</span>
          <span>Changes saved successfully!</span>
        </div>
      </div>
    `;

    // Add animation styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };


  return (
    <div className="profile-settings">
      <Navbar />

      <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
        <div className="profile-content">
          <div className="profile-header-section">
            <h2>Profile Settings</h2>
            <button className="save-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>

          <form className="profile-form">
            {/* Personal Information */}
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="displayName">Display name *</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="form-section">
              <h3>CHANGE PASSWORD</h3>
              <div className="form-group">
                <label htmlFor="currentPassword">Current password *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm new password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Newsletter Preferences */}
            <div className="form-section">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="newsletter"
                    value="subscribe"
                    checked={formData.newsletter === 'subscribe'}
                    onChange={handleRadioChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  Subscribe to our newsletter
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="newsletter"
                    value="unsubscribe"
                    checked={formData.newsletter === 'unsubscribe'}
                    onChange={handleRadioChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  Unsubscribe to our newsletter
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="newsletter"
                    value="receive-order"
                    checked={formData.newsletter === 'receive-order'}
                    onChange={handleRadioChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  Receive Order
                </label>
              </div>
            </div>
          </form>
        </div>
      </Sidebar>

      <Footer />
    </div>
  );
};

export default ProfileSettings;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { apiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './ProfileSettings.css';

// Password validation utility functions
const validatePasswordRequirement = (password: string, requirement: string): boolean => {
  // Handle different types of requirements
  if (requirement.toLowerCase().includes('at least') && requirement.toLowerCase().includes('characters')) {
    const match = requirement.match(/at least (\d+) characters/);
    if (match) {
      return password.length >= parseInt(match[1]);
    }
  }

  if (requirement.toLowerCase().includes('uppercase') && requirement.toLowerCase().includes('lowercase')) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password);
  }

  if (requirement.toLowerCase().includes('letters and numbers')) {
    return /[a-zA-Z]/.test(password) && /\d/.test(password);
  }

  if (requirement.toLowerCase().includes('special characters')) {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  if (requirement.toLowerCase().includes('numbers')) {
    return /\d/.test(password);
  }

  if (requirement.toLowerCase().includes('letters')) {
    return /[a-zA-Z]/.test(password);
  }

  // For requirements that are hard to validate programmatically, return true if password is not empty
  return password.length > 0;
};

const checkPasswordRequirements = (password: string, requirements: string[]): boolean[] => {
  return requirements.map(req => validatePasswordRequirement(password, req));
};

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    display_name: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [newsletter, setNewsletter] = useState('subscribe');
  const [passwordRequirements, setPasswordRequirements] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordValidationStatus, setPasswordValidationStatus] = useState<boolean[]>([]);

  // Fetch password requirements on component mount
  useEffect(() => {
    const fetchPasswordRequirements = async () => {
      try {
        const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_PASSWORD_REQUIREMENTS);
        if (response.password_requirements) {
          setPasswordRequirements(response.password_requirements);
          // Initialize validation status array with false values
          setPasswordValidationStatus(new Array(response.password_requirements.requirements?.length || 0).fill(false));
        }
      } catch (error: any) {
        console.error('Failed to fetch password requirements:', error);
        // Don't show error for password requirements, as it's not critical
      }
    };

    fetchPasswordRequirements();
  }, []);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_PROFILE_SETTINGS);
        // Handle nested user object in response
        const userData = response.user || response;
        setProfileData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          display_name: userData.display_name || ''
        });
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        showError('Failed to load profile', error.message || 'Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [showError]);

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

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update validation status in real-time for new password field
    if (name === 'new_password' && passwordRequirements?.requirements) {
      const validationResults = checkPasswordRequirements(value, passwordRequirements.requirements);
      setPasswordValidationStatus(validationResults);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletter(e.target.value);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await apiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_PROFILE_SETTINGS, {
        method: 'PUT',
        body: JSON.stringify({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone_number: profileData.phone_number
        }),
      });
      showSuccess('Profile updated', 'Your profile has been updated successfully.');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      // Handle validation errors from API
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(', ');
        showError('Profile update failed', errorMessages);
      } else {
        showError('Failed to update profile', error.message || 'Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showError('Password mismatch', 'New password and confirmation do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      await apiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_PROFILE_SETTINGS, {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password
        }),
      });

      // Clear password fields
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      showSuccess('Password changed', 'Your password has been changed successfully.');
    } catch (error: any) {
      console.error('Failed to change password:', error);

      let errorMessages: string[] = [];
      let errorTitle = 'Password change failed';

      if (error.errors) {
        // Handle the new error format with specific password errors
        if (Array.isArray(error.errors)) {
          errorMessages = error.errors;
        } else {
          errorMessages = Object.values(error.errors).flat() as string[];
        }
      } else if (error.message) {
        errorMessages = [error.message];
      } else {
        errorMessages = ['Please try again.'];
      }

      // If password requirements are included in error response, store them
      if (error.password_requirements) {
        setPasswordRequirements(error.password_requirements);
        // Initialize validation status array with false values
        setPasswordValidationStatus(new Array(error.password_requirements.requirements?.length || 0).fill(false));
      }

      // Show the first error message as the main error, and include all errors
      const mainErrorMessage = errorMessages[0] || 'Password change failed';
      const allErrors = errorMessages.join(', ');

      showError(errorTitle, `${mainErrorMessage}${errorMessages.length > 1 ? ` (${allErrors})` : ''}`);
    } finally {
      setChangingPassword(false);
    }
  };


  return (
    <div className="profile-settings">
      <Navbar />

      <Sidebar activeTab={activeTab} onItemClick={handleSidebarNavigation}>
        <div className="profile-content">
          <div className="profile-header-section">
            <h2>Profile Settings</h2>
            <div className="action-buttons">
              <button
                className="save-button"
                onClick={handleSaveProfile}
                disabled={saving || loading}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                className="change-password-button"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

          <form className="profile-form">
            {/* Personal Information */}
            <div className="form-section">
              {loading ? (
                <div className="loading-profile">
                  <div className="loading-spinner">Loading profile...</div>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first_name">First name *</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileInputChange}
                        className="form-input"
                        disabled={saving}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name">Last name *</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileInputChange}
                        className="form-input"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileInputChange}
                      className="form-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone_number">Phone number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleProfileInputChange}
                      className="form-input"
                      disabled={saving}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Change Password */}
            <div className="form-section">
              <h3>CHANGE PASSWORD</h3>
              <div className="form-group">
                <label htmlFor="current_password">Current password *</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordInputChange}
                  className="form-input"
                  disabled={changingPassword}
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password">New password *</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordInputChange}
                  className="form-input"
                  disabled={changingPassword}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm new password *</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordInputChange}
                  className="form-input"
                  disabled={changingPassword}
                />
              </div>

              {/* Password Requirements and Suggestions */}
              {passwordRequirements && (
                <div className="password-requirements-section">
                  <h4>Password Requirements</h4>
                  {passwordRequirements.requirements && passwordRequirements.requirements.length > 0 ? (
                    <div className="requirements-list">
                      <h5>Password must:</h5>
                      <div className="requirements-checkboxes">
                        {passwordRequirements.requirements.map((req: string, index: number) => {
                          const isMet = passwordValidationStatus[index] || false;
                          return (
                            <label key={index} className={`requirement-item ${isMet ? 'met' : 'unmet'}`}>
                              <input
                                type="checkbox"
                                checked={isMet}
                                readOnly
                                className="requirement-checkbox"
                              />
                              <span className="requirement-text">{req}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="requirements-loading">
                      <p>Loading password requirements...</p>
                    </div>
                  )}
                  {passwordRequirements.suggestions && passwordRequirements.suggestions.length > 0 && (
                    <div className="suggestions-list">
                      <h5>Suggestions for a strong password:</h5>
                      <ul>
                        {passwordRequirements.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Newsletter Preferences */}
            <div className="form-section">
              <h3>NEWSLETTER PREFERENCES</h3>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="newsletter"
                    value="subscribe"
                    checked={newsletter === 'subscribe'}
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
                    checked={newsletter === 'unsubscribe'}
                    onChange={handleRadioChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  Unsubscribe from our newsletter
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="newsletter"
                    value="receive-order"
                    checked={newsletter === 'receive-order'}
                    onChange={handleRadioChange}
                    className="radio-input"
                  />
                  <span className="radio-custom"></span>
                  Receive order updates only
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

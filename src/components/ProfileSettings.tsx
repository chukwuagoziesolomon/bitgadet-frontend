import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { apiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import { handleApiError } from '../utils/errorHandler';
import './ProfileSettings.css';
import { AlertTriangle } from 'lucide-react';

// Password validation utility functions
interface PasswordRequirementsObject {
  min_length?: number;
  require_uppercase?: boolean;
  require_lowercase?: boolean;
  require_numbers?: boolean;
  require_special?: boolean;
  common_passwords_blocked?: boolean;
}

const validatePasswordRequirement = (password: string, requirement: string, requirementsObj?: PasswordRequirementsObject | null): boolean => {
  // Handle different types of requirements
  if (requirement.toLowerCase().includes('at least') && requirement.toLowerCase().includes('characters')) {
    const match = requirement.match(/at least (\d+) characters/);
    if (match) {
      return password.length >= parseInt(match[1]);
    }
  }

  if (requirement.toLowerCase().includes('uppercase')) {
    return /[A-Z]/.test(password);
  }

  if (requirement.toLowerCase().includes('lowercase')) {
    return /[a-z]/.test(password);
  }

  if (requirement.toLowerCase().includes('letters and numbers')) {
    return /[a-zA-Z]/.test(password) && /\d/.test(password);
  }

  if (requirement.toLowerCase().includes('special characters')) {
    return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
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

const checkPasswordRequirements = (password: string, requirements: string[], requirementsObj?: PasswordRequirementsObject | null): boolean[] => {
  return requirements.map(req => validatePasswordRequirement(password, req, requirementsObj));
};

// Convert password requirements object to human-readable array
const buildRequirementsArray = (reqObj: PasswordRequirementsObject): string[] => {
  const requirements: string[] = [];
  
  if (reqObj.min_length) {
    requirements.push(`At least ${reqObj.min_length} characters`);
  }
  if (reqObj.require_uppercase) {
    requirements.push('Include at least one uppercase letter');
  }
  if (reqObj.require_lowercase) {
    requirements.push('Include at least one lowercase letter');
  }
  if (reqObj.require_numbers) {
    requirements.push('Include at least one number');
  }
  if (reqObj.require_special) {
    requirements.push('Include at least one special character (!@#$%^&*)');
  }
  if (reqObj.common_passwords_blocked) {
    requirements.push('Not be a common password');
  }
  
  return requirements;
};

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    date_of_birth: '',
    agree_to_terms: false,
    date_joined: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [newsletter, setNewsletter] = useState('subscribe');
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirementsObject | null>(null);
  const [passwordRequirementsArray, setPasswordRequirementsArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordValidationStatus, setPasswordValidationStatus] = useState<boolean[]>([]);

  // Fetch password requirements on component mount
  useEffect(() => {
    const fetchPasswordRequirements = async () => {
      try {
        const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_PASSWORD_REQUIREMENTS);
        if (response.password_requirements) {
          const reqObj: PasswordRequirementsObject = response.password_requirements;
          setPasswordRequirements(reqObj);
          
          // Convert object to array of human-readable requirements
          const requirementsArray = buildRequirementsArray(reqObj);
          setPasswordRequirementsArray(requirementsArray);
          
          // Initialize validation status array
          setPasswordValidationStatus(new Array(requirementsArray.length).fill(false));
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
        const response = await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_PROFILE_SETTINGS);

        // Extract user data from nested structure
        const userData = response.user || {};
        const profileData_api = response.profile || {};

        // Check if shipping fields are empty and need fallback from checkout
        let phone_number = response.phone_number || '';
        let address = response.address || '';
        let city = response.city || '';
        let state = response.state || '';
        let country = response.country || '';

        // If key shipping fields are empty, look up most recent checkout order
        if (!phone_number || !address || !city || !state) {
          try {
            // Assuming there's an endpoint to get recent orders, or we can use existing order history
            const ordersResponse = await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_RECENT_ORDERS);
            if (ordersResponse && ordersResponse.length > 0) {
              const latestOrder = ordersResponse[0];
              if (latestOrder.shipping_address) {
                if (!phone_number) phone_number = latestOrder.phone_number || '';
                if (!address) address = latestOrder.shipping_address.street_address || '';
                if (!city) city = latestOrder.shipping_address.city || '';
                if (!state) state = latestOrder.shipping_address.state || '';
                if (!country) country = latestOrder.shipping_address.country || '';
              }
            }
          } catch (checkoutError) {
            console.warn('Could not fetch checkout data for fallback:', checkoutError);
            // Continue without checkout fallback
          }
        }

        setProfileData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || profileData_api.email || '',
          phone_number: phone_number,
          address: address,
          city: city,
          state: state,
          country: country,
          date_of_birth: response.date_of_birth || null,
          agree_to_terms: response.agree_to_terms || false,
          date_joined: userData.date_joined || ''
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
    if (name === 'new_password' && passwordRequirementsArray.length > 0) {
      const validationResults = checkPasswordRequirements(value, passwordRequirementsArray, passwordRequirements);
      setPasswordValidationStatus(validationResults);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletter(e.target.value);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_PROFILE_UPDATE, {
        method: 'PATCH',
        body: JSON.stringify({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone_number: profileData.phone_number,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          date_of_birth: profileData.date_of_birth,
          agree_to_terms: profileData.agree_to_terms
        }),
      });

      // Update localStorage user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.first_name = profileData.first_name;
        user.last_name = profileData.last_name;
        user.email = profileData.email;
        localStorage.setItem('user', JSON.stringify(user));
      }

      showSuccess('Profile updated', 'Your profile has been updated successfully.');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = handleApiError(error, 'Profile Update');
      showError('Profile update failed', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Frontend validation
    if (!passwordData.current_password) {
      showError('Validation Error', 'Current password is required.');
      return;
    }

    if (!passwordData.new_password) {
      showError('Validation Error', 'New password is required.');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showError('Validation Error', 'New password must be at least 8 characters long.');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      showError('Password mismatch', 'New password and confirmation do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          old_password: passwordData.current_password,
          new_password: passwordData.new_password,
          new_password_confirm: passwordData.confirm_password
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
      const errorMessage = handleApiError(error, 'Change Password');
      showError('Password change failed', errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showError('Password required', 'Please enter your password to delete your account.');
      return;
    }

    try {
      setDeletingAccount(true);
      await apiRequest<any>(API_CONFIG.ENDPOINTS.USER_DELETE_ACCOUNT, {
        method: 'DELETE',
        body: JSON.stringify({
          password: deletePassword
        }),
      });

      // Clear only relevant user-related keys instead of wiping all of localStorage
      // This prevents accidental removal of unrelated data (like guest cart tokens)
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('loginType');
        localStorage.removeItem('rememberedEmail');
        // It's acceptable to remove the guest cart token when an account is deleted,
        // but avoid blanket clears elsewhere to preserve cart persistence on auth transitions.
        localStorage.removeItem('bitgadgets_cart_token');
        console.log('🧹 Cleared user-related localStorage keys after account deletion');
      } catch (e) {
        console.warn('Failed to clear some localStorage keys during account deletion', e);
      }

      showSuccess('Account deleted', 'Your account has been successfully deleted.');
      navigate('/login');
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      const errorMessage = handleApiError(error, 'Delete Account');
      showError('Account deletion failed', errorMessage);
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
      setDeletePassword('');
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
                  <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth</label>
                    <input
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={profileData.date_of_birth}
                      onChange={handleProfileInputChange}
                      className="form-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileInputChange}
                      className="form-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileInputChange}
                        className="form-input"
                        disabled={saving}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileInputChange}
                        className="form-input"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={profileData.country}
                      onChange={handleProfileInputChange}
                      className="form-input"
                      disabled={saving}
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        id="agree_to_terms"
                        name="agree_to_terms"
                        checked={profileData.agree_to_terms}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          agree_to_terms: e.target.checked
                        }))}
                        className="checkbox-input"
                        disabled={saving}
                      />
                      <span className="checkbox-custom"></span>
                      I agree to the terms and conditions
                    </label>
                  </div>
                  {profileData.date_joined && (
                    <div className="form-group">
                      <label>Member Since</label>
                      <div className="read-only-field">{new Date(profileData.date_joined).toLocaleDateString()}</div>
                    </div>
                  )}
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
                  {passwordRequirementsArray && passwordRequirementsArray.length > 0 ? (
                    <div className="requirements-list">
                      <h5>Password must:</h5>
                      <div className="requirements-checkboxes">
                        {passwordRequirementsArray.map((req: string, index: number) => {
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
                </div>
              )}

              {/* Change Password Button */}
              <div className="form-group">
                <button
                  className="change-password-button"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  style={{ marginTop: '20px' }}
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
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

            {/* Delete Account Section */}
            <div className="form-section delete-account-section">
              <h3 style={{ color: '#ef4444' }}>DELETE ACCOUNT</h3>
              <p className="delete-account-warning">
                Warning: Deleting your account will permanently remove all your data and cannot be undone.
              </p>
              <button
                type="button"
                className="delete-account-button"
                onClick={() => setShowDeleteModal(true)}
                disabled={deletingAccount}
              >
                <AlertTriangle size={20} />
                Delete My Account
              </button>
            </div>
          </form>
        </div>
      </Sidebar>

      <Footer />

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Account</h2>
            <p className="modal-message">
              This action cannot be undone. Please enter your password to confirm.
            </p>
            <div className="form-group">
              <label htmlFor="delete_password">Enter your password *</label>
              <input
                type="password"
                id="delete_password"
                name="delete_password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="form-input"
                disabled={deletingAccount}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                disabled={deletingAccount}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-delete-button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || !deletePassword}
              >
                {deletingAccount ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileSettings;

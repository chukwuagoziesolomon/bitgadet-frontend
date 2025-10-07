import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { publicApiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      showError('Terms Agreement Required', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await publicApiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_SIGNUP, {
        method: 'POST',
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          password_confirm: formData.confirmPassword,
          agree_to_terms: agreedToTerms,
        }),
      });

      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('isAdmin', response.is_admin.toString());
      localStorage.setItem('loginType', response.login_type || 'user');

      showSuccess('Account Created', response.message || 'Welcome to BitGadgetz!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Signup failed:', error);
      let errorMessage = 'Signup failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      showError('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <div className="logo-section">
              <img src="/logo.png" alt="BitGadgetz" className="signup-logo" />
              <h1>Create Account</h1>
              <p>Join BitGadgetz and start shopping for premium gadgets</p>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={20} className="input-icon" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={subscribedToNewsletter}
                  onChange={(e) => setSubscribedToNewsletter(e.target.checked)}
                />
                <span>Subscribe to our newsletter for updates and exclusive offers</span>
              </label>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Social Sign Up */}
          <div className="social-signup">
            <button className="social-button google">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign In Link */}
          <div className="signin-section">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="signin-link">
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms Disclaimer */}
          <div className="terms-disclaimer">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="terms-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

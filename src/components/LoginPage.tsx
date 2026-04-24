import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { publicApiRequest, API_CONFIG } from '../config/api';
import { cartService } from '../services/cartService';
import { useToast } from '../hooks/useToast';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import { handleApiError } from '../utils/errorHandler';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { setLoading } = useGlobalLoading();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      if (form && form.checkValidity()) {
        handleSubmit(e as any);
      }
    }
  };

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field has been touched
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({
        ...prev,
        [name]: name === 'email' ? validateEmail(value) : validatePassword(value)
      }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    setErrors(prev => ({
      ...prev,
      [name]: name === 'email' ? validateEmail(formData.email) : validatePassword(formData.password)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    setTouched({
      email: true,
      password: true
    });

    // Stop submission if there are validation errors
    if (emailError || passwordError) {
      showError('Validation Error', 'Please fix the errors in the form before submitting.');
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const cartToken = cartService.getCartToken();
      const response = await publicApiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(cartToken && { cartToken }),
        }),
      });

      // Extract from response.data
      const { token, user, isAdmin } = response.data;

      // Store token and user data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      localStorage.setItem('loginType', 'user');

      // Store email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      showSuccess('Login successful', `Welcome back, ${user.firstName || user.first_name || ''}!`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = handleApiError(error, 'Login');
      showError('Login Failed', errorMessage);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo-section">
              <img src="/logo.png" alt="BitGadgetz" className="login-logo" />
              <h1>Welcome Back</h1>
              <p>Sign in to your BitGadgetz account</p>
            </div>
          </div>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                  required
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
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
                  onBlur={handleInputBlur}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
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
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>


          {/* Sign Up Link */}
          <div className="signup-section">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

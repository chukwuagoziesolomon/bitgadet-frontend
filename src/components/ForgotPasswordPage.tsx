import React, { useState } from 'react';
import { publicApiRequest, API_CONFIG } from '../config/api';
import { useToast } from '../hooks/useToast';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitted(false);
    try {
      const response = await publicApiRequest<any>(API_CONFIG.ENDPOINTS.AUTH_FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      showSuccess('Email Sent', response.message || 'If that email exists, a reset link has been sent.');
      setSubmitted(true);
    } catch (error: any) {
      showError('Error', error.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading || submitted}
          />
          <button type="submit" disabled={isLoading || submitted || !email}>
            {isLoading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        {submitted && (
          <div className="success-message">
            <p>If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

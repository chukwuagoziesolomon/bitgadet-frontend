import React, { useState } from 'react';
import { publicApiRequest } from '../config/api';
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
      const response = await publicApiRequest<any>('/api/auth/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.success) {
        showSuccess('Success', response.message || 'A new password has been sent to your email.');
        setSubmitted(true);
      } else if (response.error) {
        showError('Error', response.error);
      } else {
        showError('Error', 'An unexpected error occurred.');
      }
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
        <p>Enter your registered email address. If found, a new password will be sent to your email.</p>
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
            <p>A new password has been sent to your email. Please check your inbox and spam folder.</p>
            <p>After logging in, change your password for security.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

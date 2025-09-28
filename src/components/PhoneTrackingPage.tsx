import React, { useState } from 'react';
import { AlertTriangle, Check, X, CheckCircle } from 'lucide-react';
import { apiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './PhoneTrackingPage.css';

const PhoneTrackingPage: React.FC = () => {
  const { showError } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    imeiNumber: '',
    deviceModel: '',
    lastKnownLocation: '',
    additionalInfo: '',
    servicePlan: 'premium',
    communicationPreference: 'email',
    customerEmail: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        imei_number: formData.imeiNumber,
        device_model: formData.deviceModel,
        last_known_location: formData.lastKnownLocation,
        additional_information: formData.additionalInfo,
        service_plan: formData.servicePlan,
        communication_preference: formData.communicationPreference,
        customer_email: formData.customerEmail
      };

      const response = await apiRequest<any>('/api/phone-tracking/submit/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          imeiNumber: '',
          deviceModel: '',
          lastKnownLocation: '',
          additionalInfo: '',
          servicePlan: 'premium',
          communicationPreference: 'email',
          customerEmail: ''
        });
      }
    } catch (error: any) {
      console.error('Failed to submit tracking request:', error);

      // Handle validation errors from API
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Handle non_field_errors specifically
        if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
          const nonFieldErrors = errors.non_field_errors.join(', ');
          showError('Validation Error', nonFieldErrors);
        } else {
          // Handle field-specific errors
          const errorMessages = Object.values(errors).flat().join(', ');
          showError('Validation Error', errorMessages);
        }
      } else if (error.response?.data?.message) {
        showError('Error', error.response.data.message);
      } else {
        showError('Error', 'There was an error submitting your tracking request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="phone-tracking-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Phone Tracking</h1>
          <p>Lost your phone? Our professional tracking service can help you locate and recover your device.</p>
          <div className="hero-badges">
            <span className="badge">95% success rate</span>
            <span className="badge">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Warning Notice */}
      <section className="warning-section">
        <div className="container">
          <div className="warning-notice">
            <AlertTriangle className="warning-icon" size={20} />
            <p>Phone tracking services are provided for legitimate recovery purposes only. You must be the legal owner of the device or have proper authorization. We comply with all local laws and regulations.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Form */}
            <div className="form-section">
              <h2>Submit Tracking Request</h2>
              <form onSubmit={handleSubmit} className="tracking-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number *</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerEmail">Email Address *</label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="imeiNumber">IMEI Number</label>
                    <input
                      type="text"
                      id="imeiNumber"
                      name="imeiNumber"
                      value={formData.imeiNumber}
                      onChange={handleInputChange}
                      placeholder="Dial *#06# to find your IMEI"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deviceModel">Device Model *</label>
                    <input
                      type="text"
                      id="deviceModel"
                      name="deviceModel"
                      value={formData.deviceModel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="lastKnownLocation">Last Known Location</label>
                  <input
                    type="text"
                    id="lastKnownLocation"
                    name="lastKnownLocation"
                    value={formData.lastKnownLocation}
                    onChange={handleInputChange}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="additionalInfo">Additional Information</label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any additional details that might help with the tracking..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="servicePlan">Service Plan *</label>
                    <select
                      id="servicePlan"
                      name="servicePlan"
                      value={formData.servicePlan}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="basic">Basic Recovery - ₦15,000</option>
                      <option value="premium">Premium Tracking - ₦35,000</option>
                      <option value="enterprise">Enterprise Recovery - ₦65,000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="communicationPreference">Communication Preference *</label>
                    <select
                      id="communicationPreference"
                      name="communicationPreference"
                      value={formData.communicationPreference}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Tracking Request'}
                </button>
              </form>
            </div>

            {/* Right Column - Service Plans */}
            <div className="plans-section">
              <h2>Service Plans</h2>
              
              <div className="plan-card">
                <h3>Premium Recovery</h3>
                <div className="price">
                  <span className="amount">₦15,000</span>
                  <span className="currency">10 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> IMEI-based tracking</li>
                  <li><Check size={16} /> Basic location report</li>
                  <li><Check size={16} /> 48-hour investigation</li>
                  <li><Check size={16} /> Email report delivery</li>
                </ul>
              </div>

              <div className="plan-card popular">
                <div className="popular-badge">Popular</div>
                <h3>Advanced Tracking</h3>
                <div className="price">
                  <span className="amount">₦35,000</span>
                  <span className="currency">25 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> GPS + IMEI tracking</li>
                  <li><Check size={16} /> Real-time location updates</li>
                  <li><Check size={16} /> 24-hour investigation</li>
                  <li><Check size={16} /> Phone + email support</li>
                  <li><Check size={16} /> Recovery assistance</li>
                </ul>
              </div>

              <div className="plan-card">
                <h3>Premium Recovery</h3>
                <div className="price">
                  <span className="amount">₦65,000</span>
                  <span className="currency">40 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> Full tracking suite</li>
                  <li><Check size={16} /> Law enforcement liaison</li>
                  <li><Check size={16} /> 12-hour investigation</li>
                  <li><Check size={16} /> Physical recovery attempt</li>
                  <li><Check size={16} /> Insurance documentation</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>Need Help?</h3>
                <p>Our tracking specialists are available 24/7 to assist you with urgent cases.</p>
                <button className="whatsapp-btn">WhatsApp Support</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Our Tracking Service Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Submit Request</h3>
              <p>Fill out the tracking form with your device details and contact information.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Payment & Verification</h3>
              <p>Choose your tracking plan and complete payment. We'll verify your ownership.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Investigation Begins</h3>
              <p>Our team starts the tracking process using advanced tools and techniques.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive Results</h3>
              <p>Get detailed reports and assistance with device recovery if located.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <section className="legal-notice">
        <div className="container">
          <h2>Legal & Privacy Notice</h2>
          <div className="legal-grid">
            <div className="legal-column">
              <h3>Service Limitations:</h3>
              <ul>
                <li>Device must have been active on a network</li>
                <li>Success depends on device settings and condition</li>
                <li>Some locations may be inaccessible</li>
                <li>Results not guaranteed for all cases</li>
              </ul>
            </div>
            <div className="legal-column">
              <h3>Legal Requirements:</h3>
              <ul>
                <li>Proof of ownership required</li>
                <li>Valid ID must be provided</li>
                <li>Police report may be requested</li>
                <li>Service complies with local laws</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              <X size={24} />
            </button>

            <div className="modal-content">
              <div className="success-icon">
                <CheckCircle size={64} />
              </div>

              <h2 className="modal-title">Tracking Request Submitted!</h2>

              <p className="modal-message">
                Thank you, <strong>{formData.fullName}</strong>! Your phone tracking request has been submitted successfully.
                Our team will begin the investigation process and contact you via {formData.communicationPreference === 'email' ? 'email' : formData.communicationPreference === 'phone' ? 'phone' : 'WhatsApp'}
                at <strong>{formData.communicationPreference === 'email' ? formData.customerEmail : formData.phoneNumber}</strong> within 24 hours.
              </p>

              <div className="modal-actions">
                <button
                  className="modal-primary-btn"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Continue Browsing
                </button>
                <button
                  className="modal-secondary-btn"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneTrackingPage;

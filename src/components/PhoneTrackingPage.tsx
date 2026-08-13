import React, { useState } from 'react';
import { AlertTriangle, Check, X, CheckCircle } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import { handleApiError } from '../utils/errorHandler';
import './PhoneTrackingPage.css';
import { useNavigate } from 'react-router-dom';

const PhoneTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useToast();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    imeiNumber: '',
    deviceModel: '',
    lastKnownLocation: '',
    servicePlan: 'basic',
    communicationPreference: 'active_number',
    whatsappNumber: '',
    currentPhoneNumber: '',
    customerEmail: '',
    agreeToTerms: false
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

  const handleWhatsAppSupport = () => {
    const message = `Hello, I need help with phone tracking services.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=2349138666111&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      showError('Terms Agreement Required', 'You must agree to the Terms & Conditions before submitting your request.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const payload = {
        phone_number: formData.phoneNumber,
        imei_number: formData.imeiNumber,
        device_model: formData.deviceModel,
        last_known_location: formData.lastKnownLocation,
        additional_information: '',
        service_plan: formData.servicePlan,
        communication_preference: formData.communicationPreference,
        customer_email: formData.communicationPreference === 'email' ? formData.customerEmail : '',
        customer_active_number: formData.communicationPreference === 'active_number' ? formData.currentPhoneNumber : '',
        agree_to_terms: formData.agreeToTerms
      };

      const response = await publicApiRequest<any>('/api/v1/phone-tracking/submit/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        navigate('/success', {
          state: {
            title: 'Tracking Request Submitted!',
            message: `Thank you! Your phone tracking request has been submitted.`,
            userName: '',
            userContact: formData.communicationPreference === 'email' ? formData.customerEmail : formData.currentPhoneNumber,
            contextType: 'tracking',
            nextSteps: [
              'Our team will begin the investigation process.',
              `You’ll be contacted at ${formData.communicationPreference === 'email' ? formData.customerEmail : formData.currentPhoneNumber}.`,
            ],
            ctaText: 'Back to Home',
          }
        });
        // Reset form
        setFormData({
          phoneNumber: '',
          imeiNumber: '',
          deviceModel: '',
          lastKnownLocation: '',
          servicePlan: 'basic',
          communicationPreference: 'active_number',
          whatsappNumber: '',
          currentPhoneNumber: '',
          customerEmail: '',
          agreeToTerms: false
        });
      }
    } catch (error: any) {
      console.error('Failed to submit tracking request:', error);
      const errorMessage = handleApiError(error, 'Phone Tracking Submission');
      showError('Submission Error', errorMessage);
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
            <span className="badge">Up to 85% success rate</span>
            <span className="badge">24/7 Support</span>
            <span className="badge">Professional Recovery</span>
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
                    <label htmlFor="lastKnownLocation">Last Known Location</label>
                    <input
                      type="text"
                      id="lastKnownLocation"
                      name="lastKnownLocation"
                      value={formData.lastKnownLocation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Single Last Known Location field retained above in the form row */}



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
                      <option value="basic">Basic Plan - ₦15,000 (6 USDT)</option>
                      <option value="standard">Standard Plan - ₦60,000 (25 USDT)</option>
                      <option value="premium">Premium Plan - ₦75,000 (40 USDT)</option>
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
                      <option value="active_number">Active Number</option>
                    </select>
                  </div>
                </div>

                {/* Conditional fields based on communication preference */}
                {formData.communicationPreference === 'email' && (
                  <div className="form-group">
                    <label htmlFor="customerEmail">Customer Email *</label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                )}

                {formData.communicationPreference === 'active_number' && (
                  <div className="form-group">
                    <label htmlFor="currentPhoneNumber">Active Phone Number *</label>
                    <input
                      type="tel"
                      id="currentPhoneNumber"
                      name="currentPhoneNumber"
                      value={formData.currentPhoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your active phone number"
                      required
                    />
                  </div>
                )}

                {/* Terms & Conditions Section */}
                <div className="terms-section">
                  <h3>Terms & Conditions</h3>
                  <div className="terms-content">
                    <div className="terms-item">
                      <h4>1. Service Scope</h4>
                      <p>Our tracking service is designed to assist in locating lost or stolen mobile devices through available tools such as GPS, IMEI-based tracking, and cooperation with network carriers or law enforcement (depending on the selected plan). While we provide reasonable effort and support, recovery is not 100% guaranteed.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>2. User Responsibility</h4>
                      <p>You must provide accurate device details (IMEI, phone model, last known information, etc.) when submitting a request. You agree that any misuse of this service (such as attempting to track a device you do not own) will result in immediate termination and may involve legal action.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>3. Investigation Window</h4>
                      <p>Each plan includes an investigation period during which we actively work on your case (Basic – 48 hrs, Standard – 48 hrs, Premium – 24 hrs). The investigation window refers only to our direct effort and priority handling. It does not mean your payment or case automatically expires once this time ends. Recovery timelines may depend on external parties such as carriers or law enforcement, which are outside our direct control.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>4. Additional Fees</h4>
                      <p>For Premium Plans, physical recovery attempts by professionals may involve additional fees depending on the location and level of intervention required. These fees will be communicated and must be agreed upon before such recovery is attempted.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>5. Refund Policy</h4>
                      <p>Payments are for the tracking service effort and investigation, not guaranteed recovery. Refunds will not be issued once an investigation has started.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>6. Privacy and Data Use</h4>
                      <p>All information you provide (such as IMEI, contact details, or police report) is used strictly for recovery purposes. We do not share your information with third parties except law enforcement or carriers involved in the recovery process.</p>
                    </div>
                    
                    <div className="terms-item">
                      <h4>7. Legal Disclaimer</h4>
                      <p>BitGadgetz is not liable for delays, failure of recovery, or damages caused by third parties (including law enforcement or carriers). By using our service, you accept that results may vary and agree not to hold us responsible for unsuccessful recovery attempts.</p>
                    </div>
                  </div>
                  
                  <div className="terms-agreement">
                    <label className="terms-checkbox">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <span className="checkmark"></span>
                      <span className="terms-text">
                        I have read and agree to the <strong>BitGadgetz Tracking Service Terms & Conditions</strong> outlined above. I understand that recovery is not guaranteed and agree to the terms of service.
                      </span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting || !formData.agreeToTerms}>
                  {isSubmitting ? 'Submitting...' : 'Submit Tracking Request'}
                </button>
              </form>
            </div>

            {/* Right Column - Service Plans */}
            <div className="plans-section">
              <h2>Tracking Plans</h2>
              
              <div className="plan-card">
                <h3>Basic Plan</h3>
                <div className="price">
                  <span className="amount">₦10,000</span>
                  <span className="currency">6 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> Device side tracking only (Google Find My Device or Apple Find My)</li>
                  <li><Check size={16} /> Quick guide to try recovery yourself</li>
                  <li><Check size={16} /> Email support</li>
                  <li><Check size={16} /> Estimated success rate 25 to 40%</li>
                </ul>
              </div>

              <div className="plan-card popular">
                <div className="popular-badge">Popular</div>
                <h3>Standard Plan</h3>
                <div className="price">
                  <span className="amount">₦35,000</span>
                  <span className="currency">25 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> GPS and IMEI based tracking where available</li>
                  <li><Check size={16} /> Real time location updates when device is online</li>
                  <li><Check size={16} /> 48 hour investigation window</li>
                  <li><Check size={16} /> Phone and email support</li>
                  <li><Check size={16} /> Assistance preparing police report and IMEI documentation</li>
                  <li><Check size={16} /> Estimated success rate 40 to 65%</li>
                </ul>
              </div>

              <div className="plan-card">
                <h3>Premium Plan</h3>
                <div className="price">
                  <span className="amount">₦65,000</span>
                  <span className="currency">40 USDT</span>
                </div>
                <ul className="features">
                  <li><Check size={16} /> Full tracking suite GPS IMEI and carrier liaison</li>
                  <li><Check size={16} /> Law enforcement liaison and priority handling</li>
                  <li><Check size={16} /> 24 hour investigation window with assigned recovery agent</li>
                  <li><Check size={16} /> Physical recovery attempt with professional</li>
                  <li><Check size={16} /> Priority phone and email support</li>
                  <li><Check size={16} /> Estimated success rate 65 to 85%</li>
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="disclaimer-section">
                <div className="disclaimer-card">
                  <h4>Important Disclaimer</h4>
                  <p><strong>Recovery is not guaranteed.</strong> Additional fees may apply for physical recovery attempts under the Premium Plan.</p>
                </div>
              </div>

              <div className="help-section">
                <h3>Need Help?</h3>
                <p>Our tracking specialists are available 24/7 to assist you with urgent cases.</p>
                <button className="whatsapp-btn" onClick={handleWhatsAppSupport}>WhatsApp Support</button>
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
      {/* Removed conditional rendering for showSuccessModal */}
    </div>
  );
};

export default PhoneTrackingPage;

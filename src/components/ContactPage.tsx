import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, Send, CheckCircle, X } from 'lucide-react';
import { apiRequest } from '../config/api';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

      const response = await apiRequest<any>('/api/contact/submit/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Get in touch</h1>
          <p>We're here to help! Reach out to us through any of these channels.</p>
          <button className="whatsapp-cta-btn">
            24/7 WhatsApp Support Available
          </button>
        </div>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Contact Information */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-numbers">
                    <span>+2349138666111</span>
                    <span>+2349061728949</span>
                  </div>
                  <a href="tel:+2348123456789" className="contact-link">Contact Now →</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-emails">
                    <span>support@bitgadgetz.com</span>
                    <span>sales@bitgadgetz.com</span>
                  </div>
                  <a href="mailto:support@bitgadgetz.com" className="contact-link">Contact Now →</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <MessageCircle size={20} />
                </div>
                <div className="contact-details">
                  <div className="contact-whatsapp">
                    <span>+234 812 345 6789</span>
                  </div>
                  <a href="https://wa.me/2348123456789" className="contact-link">Contact Now →</a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="business-hours">
                <h3>
                  <Clock size={20} />
                  Business Hours
                </h3>
                <div className="hours-list">
                  <div className="hours-item">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Saturdays:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
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

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  <Send size={18} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Need Immediate Assistance?</h2>
          <p>Our WhatsApp support team is available 24/7 to help with your inquiries.</p>
          <button className="whatsapp-cta-btn">
            Chat on WhatsApp
          </button>
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

              <h2 className="modal-title">Message Sent Successfully!</h2>

              <p className="modal-message">
                Thank you for reaching out to us. Our team will review your message and get back to you
                at <strong>{formData.email}</strong> within 24 hours.
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
                  Send Another Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;

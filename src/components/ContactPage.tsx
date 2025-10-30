import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, CheckCircle, X } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
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
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

      const response = await publicApiRequest<any>('/api/contact/submit/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        setShowSuccessModal(true);
        showSuccess('Success', 'Your message has been sent successfully!');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error: any) {
      console.error('Failed to submit contact form:', error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        showError('Validation Error', errorMessages);
      } else if (error.response?.data?.message) {
        showError('Error', error.response.data.message);
      } else {
        showError('Error', 'Failed to send your message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/2348123456789', '_blank');
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Get in touch</h1>
        <p>We're here to help! Reach out to us through any of these channels.</p>
        <button className="whatsapp-btn" onClick={handleWhatsAppClick}>
          24/7 WhatsApp Support Available
        </button>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <div className="content-wrapper">
          {/* Left Column - Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>

            {/* Phone */}
            <div className="contact-card">
              <div className="card-icon">
                <Phone size={24} />
              </div>
              <div className="card-content">
                <h3>Phone</h3>
                <p className="phone-numbers">
                  +234 812 345 6789<br />
                  +234 901 234 5678
                </p>
                <p className="card-description">Call us for immediate assistance</p>
                <a href="tel:+2348123456789" className="contact-link">Contact Now →</a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-card">
              <div className="card-icon">
                <Mail size={24} />
              </div>
              <div className="card-content">
                <h3>Email</h3>
                <p className="email-addresses">
                  support@bitgadgetz.com<br />
                  sales@bitgadgetz.com
                </p>
                <p className="card-description">Send us an email anytime</p>
                <a href="mailto:support@bitgadgetz.com" className="contact-link">Contact Now →</a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="contact-card">
              <div className="card-icon">
                <MessageCircle size={24} />
              </div>
              <div className="card-content">
                <h3>WhatsApp</h3>
                <p className="whatsapp-number">+234 812 345 6789</p>
                <p className="card-description">Chat with us on WhatsApp</p>
                <a href="https://wa.me/2348123456789" className="contact-link">Contact Now →</a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="business-hours">
              <div className="hours-header">
                <Clock size={20} />
                <h3>Business Hours</h3>
              </div>
              <div className="hours-content">
                <div className="hour-row">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hour-row">
                  <span>Saturdays</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="hour-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="form-section">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
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
              </div>

              <div className="form-row">
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
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Need Immediate Assistance?</h2>
        <p>Our WhatsApp support team is available 24/7 to help with your inquiries.</p>
        <button className="whatsapp-btn" onClick={handleWhatsAppClick}>
          Chat on WhatsApp
        </button>
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

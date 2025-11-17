import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, CheckCircle, X } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './ContactPage.css';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
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

      const response = await publicApiRequest<any>('/api/contact/submit/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response) {
        navigate('/success', {
          state: {
            title: 'Message Sent Successfully!',
            message: `Thank you${formData.fullName ? `, ${formData.fullName}` : ''} for reaching out to us. Our team will review your message and get back to you at ${formData.email || formData.phone}.`,
            userName: formData.fullName,
            userContact: formData.email || formData.phone,
            contextType: 'contact',
            nextSteps: [
              'Our support team will review your query.',
              `You’ll be contacted via ${formData.email || formData.phone} within 24 hours.`,
            ],
            ctaText: 'Back to Home',
          }
        });
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
    window.open('https://wa.me/2349138666111', '_blank');
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
                +2349138666111<br />
                +2349061728949
                </p>
                <p className="card-description">Call us for immediate assistance</p>
                <a href="tel:+2349061728949" className="contact-link">Contact Now →</a>
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
                support@bitgadgetz.store<br />
            
                </p>
                <p className="card-description">Send us an email anytime</p>
                <a href="mailto:support@bitgadgetz.store" className="contact-link">Contact Now →</a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="contact-card">
              <div className="card-icon">
                <MessageCircle size={24} />
              </div>
              <div className="card-content">
                <h3>WhatsApp</h3>
                <p className="whatsapp-number">+2349138666111</p>
                <p className="card-description">Chat with us on WhatsApp</p>
                <a href="https://wa.me/2349138666111" className="contact-link">Contact Now →</a>
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
    </div>
  );
};

export default ContactPage;

import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, Send } from 'lucide-react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
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
                    <span>+234 812 345 6789</span>
                    <span>+234 901 234 5678</span>
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

                <button type="submit" className="submit-btn">
                  <Send size={18} />
                  Send Message
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
    </div>
  );
};

export default ContactPage;

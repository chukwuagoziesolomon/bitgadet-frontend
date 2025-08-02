import React, { useState } from 'react';
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
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help! Reach out to us through any of these channels.</p>
          <button className="whatsapp-support-btn">24/7 WhatsApp Support Available</button>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-container">
        <div className="contact-content">
          {/* Left Column - Contact Information */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>Phone</h3>
                <p className="contact-value">+234 812 345 6789</p>
                <p className="contact-value">+234 901 234 5678</p>
                <p className="contact-description">Call us for immediate assistance</p>
                <a href="tel:+2348123456789" className="contact-link">Contact Now →</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h3>Email</h3>
                <p className="contact-value">support@bitgadgetz.com</p>
                <p className="contact-value">sales@bitgadgetz.com</p>
                <p className="contact-description">Send us an email anytime</p>
                <a href="mailto:support@bitgadgetz.com" className="contact-link">Contact Now →</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <h3>WhatsApp</h3>
                <p className="contact-value">+234 812 345 6789</p>
                <p className="contact-description">Chat with us on WhatsApp</p>
                <a href="https://wa.me/2348123456789" className="contact-link">Contact Now →</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🕒</div>
              <div className="contact-details">
                <h3>Business Hours</h3>
                <p className="contact-value">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="contact-value">Saturdays: 10:00 AM - 4:00 PM</p>
                <p className="contact-value">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name*</label>
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
                <label htmlFor="email">Email Address*</label>
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
                <label htmlFor="subject">Subject*</label>
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
                <label htmlFor="message">Message*</label>
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
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Immediate Assistance Section */}
      <section className="immediate-assistance">
        <div className="container">
          <h2>Need Immediate Assistance?</h2>
          <p>Our WhatsApp support team is available 24/7 to help with your inquiries.</p>
          <button className="whatsapp-btn">Chat on WhatsApp</button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 
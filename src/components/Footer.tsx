import React from 'react';
import Facebook from './icons/Facebook';
import Instagram from './icons/Instagram';
import Twitter from './icons/Twitter';
import Linkedin from './icons/Linkedin';
import Youtube from './icons/Youtube';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Stay Updated with BitGadgetz</h2>
          <p className="newsletter-description">
            Subscribe to our newsletter for the latest tech news, exclusive deals, and special offers.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo-container">
            <img src="/logo.png" alt="BitGadgetz Logo" className="footer-logo" />
          </div>
          <p className="footer-description">
            BitGadgetz is a modern eCommerce platform that sells gadgets and accessories with crypto and Naira payment options.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">ee
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="footer-section">
          <h4 className="footer-heading">Stay Connected</h4>
          <div className="contact-info">
            <p>Email: info@bitgadgetz.com</p>
            <p>Phone: +234 123 000 0000</p>
            <p>WhatsApp: +234 123 000 0000</p>
          </div>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={20} color="#ffffff" />
            </a>
            <a href="https://www.instagram.com/bitgadgetz_tech" aria-label="Instagram">
              <Instagram size={20} color="#ffffff" />
            </a>
            <a href="https://x.com/bitgadgetz" aria-label="Twitter">
              <Twitter size={20} color="#ffffff" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <Linkedin size={20} color="#ffffff" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              <Youtube size={20} color="#ffffff" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BitGadgetz. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

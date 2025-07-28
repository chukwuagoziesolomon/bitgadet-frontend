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
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <img src= "logo.png" alt="BitGadgetz Logo" className="footer-logo" />
          <p className="footer-description">
            Your one-stop shop for all the latest gadgets and tech accessories.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={20} color="#ffffff" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={20} color="#ffffff" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
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

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/phone-tracking">Phone Tracking</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><a href="/categories/smartphones">Smartphones</a></li>
            <li><a href="/categories/laptops">Laptops</a></li>
            <li><a href="/categories/smartwatches">Smartwatches</a></li>
            <li><a href="/categories/accessories">Accessories</a></li>
            <li><a href="/categories/audio">Audio</a></li>
            <li><a href="/categories/gaming">Gaming</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-newsletter-text">
            Subscribe to our newsletter for the latest updates and offers.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
          <div className="contact-info">
            <p>Email: info@bitgadgetz.com</p>
            <p>Phone: +1 234 567 890</p>
            <p>WhatsApp: +1 234 567 890</p>
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import { handleApiError } from '../utils/errorHandler';
import './Footer.css';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await publicApiRequest<any>('/api/waitlist/join/', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
      });

      showSuccess('Success!', response.message || 'Successfully joined the waitlist!');
      setEmail('');
    } catch (error: any) {
      console.error('Waitlist subscription failed:', error);
      const errorMessage = handleApiError(error, 'Waitlist Subscription');
      showError('Subscription Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="BitGadgetz" />
          </Link>
          <p className="footer-description">
            BitGadgetz is a modern eCommerce platform that sells gadgets and accessories with crypto and Naira payment options.
          </p>
          <div className="footer-socials">
            <a href="https://www.facebook.com/share/1T4ZBKdcf1/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/bitgadgetz_tech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://x.com/bitgadgetz" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <X size={20} />
            </a>
            <a href="https://www.linkedin.com/company/bitgadgetz/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://www.youtube.com/@Bitgadgetz" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            <li><Link to="/phone-tracking">Phone Tracking</Link></li>
  
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3 className="footer-heading">Categories</h3>
          <ul className="footer-links">
            <li><Link to="/smartphones">Smartphones</Link></li>
            <li><Link to="/laptops">Laptops</Link></li>
            <li><Link to="/smartwatches">Smartwatches</Link></li>
            <li><Link to="/accessories">Accessories</Link></li>
            <li><Link to="/audio">Audio</Link></li>
            <li><Link to="/gaming">Gaming</Link></li>
          </ul>
        </div>

        {/* Stay Connected - Mobile Only */}
        <div className="footer-section footer-stay-connected">
          <h3 className="footer-heading">Stay connected</h3>
          <div className="stay-connected-info">
            <p>Email: support@bitgadgetz.store</p>
            <p>Phone: +2349138666111</p>
            <p>WhatsApp: +2349061728949</p>
          </div>
          <div className="footer-socials footer-socials-mobile">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://www.instagram.com/bitgadgetz_tech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://x.com/bitgadgetz" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <X size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Newsletter & Contact */}
        <div className="footer-section footer-newsletter">
          <h3 className="footer-heading">Newsletter</h3>
          <p className="newsletter-text">
            Subscribe to our newsletter for the latest products and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn" disabled={isLoading}>
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <div className="footer-contact">
            <h4 className="contact-heading">Contact Us</h4>
            <p>Email: support@bitgadgetz.store</p>
            <p>Phone: +2349138666111</p>
            <p>WhatsApp:+2349061728949 </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2025 BitGadgetz. All rights reserved.</p>
      </div>
    </footer>
  );
};

// X (Twitter) icon component
const X: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
  </svg>
);

export default Footer;
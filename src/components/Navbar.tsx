import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import HeartMinus from './icons/HeartMinus';
import ShoppingCart from './icons/ShoppingCart';
import User from './icons/User';
import PhoneCall from './icons/PhoneCall';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <nav className="navbar">
      {/* Top section with search and contact */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/brand">
              <img className="logo-icon" src="logo.png" alt="logo" />
            </Link>
          </div>

          {/* Search bar */}
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Find your dream device here"
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>

          {/* Phone section - between search and icons */}
          <div className="contact-info">
            <span className="contact-label">Call 24/7</span>
            <div className="contact-number-wrapper">
              <PhoneCall size={24} color="#000" />
              <span className="contact-number">07042567844</span>
            </div>
          </div>

          {/* Icons */}
          <div className="navbar-right">
            <div className="navbar-icons">
              <button className="icon-btn">
                <HeartMinus size={20} />
              </button>
              <button className="icon-btn cart-btn">
                <ShoppingCart size={20} />
                <span className="cart-count">0</span>
              </button>
              <button className="icon-btn">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with navigation */}
      <div className="navbar-bottom">
        <div className="navbar-container navbar-bottom-container">
          {/* Left side - Categories only */}
          <div className="navbar-left">
            {/* Categories dropdown */}
            <div className="categories-dropdown">
              <Link to="/categories" className={`categories-btn ${isActive('/categories') ? 'active' : ''}`}>
                <span className="hamburger">☰</span>
                Categories
                <span className="dropdown-arrow">▼</span>
              </Link>
            </div>
          </div>

          {/* Right side - Navigation links */}
          <div className="navbar-right-bottom">
            <div className="nav-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              <Link to="/brands" className={`nav-link ${isActive('/brands') ? 'active' : ''}`}>
                Brands
                <span className="dropdown-arrow">▼</span>
              </Link>
              <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
              <Link to="/service" className={`nav-link ${isActive('/service') ? 'active' : ''}`}>Service</Link>
              <a href="/about" className="nav-link">About Us</a>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

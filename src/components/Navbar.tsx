import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import HeartMinus from './icons/HeartMinus';
import ShoppingCart from './icons/ShoppingCart';
import User from './icons/User';
import PhoneCall from './icons/PhoneCall';
const Navbar: React.FC = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const categories = [
    { name: 'All Categories', path: '/categories/all' },
    { name: 'Smartphones', path: '/categories/smartphones' },
    { name: 'Laptops', path: '/categories/laptops' },
    { name: 'Tablets', path: '/categories/tablets' },
    { name: 'Smartwatches', path: '/categories/smartwatches' },
    { name: 'Accessories', path: '/categories/accessories' },
    { name: 'Audio', path: '/categories/audio' },
    { name: 'Gaming', path: '/categories/gaming' },
  ];
  
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };
  
  const closeCategories = () => {
    setIsCategoriesOpen(false);
  };
  return (
    <nav className="navbar">
      {/* Top section with search and contact */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <img className="logo-icon" src="logo.png" alt="logo" />
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
            <div className="categories-dropdown" onMouseLeave={closeCategories}>
              <button 
                className={`categories-btn ${isCategoriesOpen ? 'active' : ''}`}
                onClick={toggleCategories}
                onMouseEnter={() => setIsCategoriesOpen(true)}
              >
                <span className="hamburger">☰</span>
                Categories
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isCategoriesOpen && (
                <div className="categories-dropdown-menu">
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      to={category.path}
                      className="category-link"
                      onClick={closeCategories}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Navigation links */}
          <div className="navbar-right-bottom">
            <div className="nav-links">
              <a href="/" className="nav-link active">Home</a>
              <a href="/brands" className="nav-link">
                Brands
                <span className="dropdown-arrow">▼</span>
              </a>
              <a href="/service" className="nav-link">Service</a>
              <a href="/about" className="nav-link">About Us</a>
              <a href="/contact" className="nav-link">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

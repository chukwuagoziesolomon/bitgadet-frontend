import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, RefreshCw, MapPin, HeartPlus, Phone } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <img src="/logo.png" alt="BitGadgetz Logo" className="logo-image" />
          
          </Link>
        </div>

        {/* Search bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Find your dream device here"
              className="search-input"
            />
            <button className="search-button">
              Search
            </button>
          </div>
        </div>

        {/* Phone and Right side icons */}
        <div className="navbar-right">
          <div className="phone-section">
            <Phone size={20} className="phone-icon" />
            <span className="phone-number">07043567844</span>
          </div>
          <button className="icon-btn">
            <HeartPlus size={20} />
          </button>
          <Link to="/cart" className="icon-btn">
            <ShoppingCart size={20} />
          </Link>
          <button className="icon-btn">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="navbar-bottom">
        <div className="navbar-container">
          {/* Categories dropdown */}
          <div className="categories-dropdown">
            <Link to="/categories" className={`categories-btn ${isActive('/categories') ? 'active' : ''}`}>
              <span className="hamburger">☰</span>
              All Categories
              <span className="dropdown-arrow">▼</span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="nav-links">
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>Home</Link>
            <Link to="/brands" className={`nav-link ${isActive('/brands') ? 'active' : ''}`}>
              Brands
              <span className="dropdown-arrow">▼</span>
            </Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>

            {/* Services Dropdown */}
            <div className="services-dropdown" ref={dropdownRef}>
              <button
                className={`nav-link services-btn ${isActive('/phone-swap') || isActive('/phone-tracking') ? 'active' : ''}`}
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                Services
                <ChevronDown size={16} className={`dropdown-icon ${servicesDropdownOpen ? 'open' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="services-dropdown-menu">
                  <Link
                    to="/phone-swap"
                    className="dropdown-item"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <RefreshCw size={18} className="dropdown-icon" />
                    Phone Swapping
                  </Link>
                  <Link
                    to="/phone-tracking"
                    className="dropdown-item"
                    onClick={() => setServicesDropdownOpen(false)}
                  >
                    <MapPin size={18} className="dropdown-icon" />
                    Phone Tracking
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact us</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

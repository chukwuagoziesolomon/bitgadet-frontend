import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Search, Menu, Heart, Phone, FileText, HelpCircle, LogOut } from 'lucide-react';
import TrendingUp from './icons/TrendingUp';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Check if we're in dashboard section
  const isInDashboard = location.pathname.startsWith('/dashboard') || 
                       location.pathname.startsWith('/profile-settings') ||
                       location.pathname.startsWith('/order-history') ||
                       location.pathname.startsWith('/wishlist') ||
                       location.pathname.startsWith('/contact-support');

  // Sidebar items for dashboard
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { id: 'profile', label: 'Profile Settings', icon: User, path: '/profile-settings' },
    { id: 'orders', label: 'Order History', icon: FileText, path: '/order-history' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/contact-support' },
    { id: 'logout', label: 'Sign Out', icon: LogOut, path: '/login' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsAllCategoriesOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (mobileMoreRef.current && !mobileMoreRef.current.contains(event.target as Node)) {
        setIsMobileMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Desktop View */}
      <div className="desktop-view">
        {/* Top Bar */}
        <div className="navbar-top">
          <div className="navbar-container">
            {/* Logo */}
            <Link to="/" className="logo-link">
              <img src="/logo.png" alt="BitGadgetz" className="logo-image" />
            </Link>

            {/* Search bar */}
            <div className="search-container">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="search-input"
                />
                <button className="search-button">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Phone contact */}
            <div className="phone-contact">
              <Phone size={20} />
              <div className="phone-text">
                <span className="phone-label">Call us 24/7</span>
                <span className="phone-number">07043567844</span>
              </div>
            </div>

            {/* Right side icons */}
            <div className="navbar-right">
              <Link to="/wishlist" className="nav-icon">
                <Heart size={20} />
              </Link>
              <Link to="/cart" className="nav-icon">
                <ShoppingCart size={20} />
              </Link>
              <Link to="/login" className="nav-icon">
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="navbar-bottom">
          <div className="navbar-container">
            {/* Categories Dropdown */}
            <div className="categories-dropdown" ref={categoriesRef}>
              <button 
                className="categories-button"
                onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
              >
                All Categories <ChevronDown size={16} />
              </button>
              <div className={`categories-menu ${isAllCategoriesOpen ? 'show' : ''}`}>
                <Link to="/all-products" className="categories-menu-item">
                  All Products
                </Link>
                <Link to="/categories" className="categories-menu-item">
                  Categories
              </Link>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="main-navigation">
              <Link to="/home" className={isActive('/home') ? 'active' : ''}>Home</Link>
              <Link to="/brands" className={isActive('/brands') ? 'active' : ''}>Brands</Link>
              <div className="services-dropdown" ref={servicesRef}>
                <button 
                  className={`services-button ${isServicesOpen || isActive('/services') || isActive('/phone-tracking') || isActive('/phone-swap') ? 'active' : ''}`}
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  Services <ChevronDown size={16} />
                </button>
                <div className={`services-menu ${isServicesOpen ? 'show' : ''}`}>
                  <Link to="/phone-tracking" className={isActive('/phone-tracking') ? 'active' : ''}>Phone Tracking</Link>
                  <Link to="/phone-swap" className={isActive('/phone-swap') ? 'active' : ''}>Phone Swap</Link>
                </div>
              </div>
              <Link to="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link>
              <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        {/* Mobile Top Bar */}
        <div className="mobile-top-bar">
          <div className="mobile-top-container">
            {/* Logo */}
            <Link to="/" className="mobile-logo-link">
              <img src="/logo.png" alt="BitGadgetz" className="mobile-logo-image" />
            </Link>

            {/* Search bar */}
            <div className="mobile-search-container">
              <div className="mobile-search-wrapper">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="mobile-search-input"
                />
                <button className="mobile-search-button">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Right side icons */}
            <div className="mobile-top-icons">
              <Link to="/cart" className="mobile-top-icon">
                <ShoppingCart size={20} />
              </Link>
              <Link to="/login" className="mobile-top-icon">
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mobile-navbar">
          {/* Left: Hamburger Menu with Categories */}
          <div className="mobile-left" ref={mobileMenuRef}>
            <button 
              className="menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <span className="mobile-nav-text">Categories</span>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="mobile-menu-dropdown">
                {isInDashboard ? (
                  // Dashboard sidebar content
                  <div className="mobile-menu-content">
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path || '#'}
                        className="mobile-menu-item"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  // Regular categories content
                  <div className="mobile-menu-content">
                    <Link
                      to="/all-products"
                      className="mobile-menu-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>All Products</span>
                    </Link>
                    <Link
                      to="/categories"
                      className="mobile-menu-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>Categories</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center: Home and Brands */}
          <div className="mobile-center">
            <Link to="/home" className={`mobile-nav-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/brands" className={`mobile-nav-link ${isActive('/brands') ? 'active' : ''}`}>
              Brands
            </Link>
          </div>

          {/* Right: More Dropdown */}
          <div className="mobile-right" ref={mobileMoreRef}>
            <button 
              className="mobile-more-button"
              onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
            >
              <span>More</span>
              <ChevronDown size={16} />
              </button>
            
            {/* More Dropdown */}
            {isMobileMoreOpen && (
              <div className="mobile-more-dropdown">
                <div className="mobile-more-content">
                  <Link
                    to="/phone-tracking"
                    className="mobile-more-item"
                    onClick={() => setIsMobileMoreOpen(false)}
                  >
                    <span>Phone Tracking</span>
                  </Link>
                  <Link
                    to="/phone-swap"
                    className="mobile-more-item"
                    onClick={() => setIsMobileMoreOpen(false)}
                  >
                    <span>Phone Swapping</span>
                  </Link>
                  <Link
                    to="/about"
                    className="mobile-more-item"
                    onClick={() => setIsMobileMoreOpen(false)}
                  >
                    <span>About Us</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="mobile-more-item"
                    onClick={() => setIsMobileMoreOpen(false)}
                  >
                    <span>Contact Us</span>
                  </Link>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

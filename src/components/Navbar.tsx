import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Menu, X, Phone, Heart, BarChart3, FileText, HelpCircle, LogOut } from 'lucide-react';
import { conditionalApiRequest } from '../config/api';
import { cartService } from '../services/cartService';
import './Navbar.css';

// Custom hook for responsive breakpoints
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State management
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHamburgerDropdownOpen, setIsHamburgerDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Check if user is authenticated
  const storedUser = localStorage.getItem('user');
  const isAuthenticated = !!storedUser;

  // Define authenticated pages
  const authenticatedPages = ['/dashboard', '/profile-settings', '/order-history', '/wishlist', '/contact-support'];
  const isOnAuthenticatedPage = authenticatedPages.includes(location.pathname);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const categoriesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cart count
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const summary = await cartService.getCartSummary();
        setCartCount(summary.total_items || 0);
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
    // Since cart token is in localStorage, listen for changes
    const onStorage = () => {
      fetchCartCount();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Search functions
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearchDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await conditionalApiRequest<any>(`/api/search/?q=${encodeURIComponent(query)}`);
      setSearchResults(response);
      setIsSearchDropdownOpen(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchDropdownOpen(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
        setIsHamburgerDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Top Bar */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="BitGadgetz" />
          </Link>

          {/* Desktop Search Bar */}
          {!isMobile && (
            <div className="search-container search-container-desktop" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery && setIsSearchDropdownOpen(true)}
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </form>

              {/* Desktop Search Dropdown */}
              {isSearchDropdownOpen && searchResults && (
                <div className="search-dropdown search-dropdown-desktop">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.has_results ? (
                    <>
                      {searchResults.products?.count > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <h4>Products ({searchResults.products.count})</h4>
                          </div>
                          <div className="search-items">
                            {searchResults.products.results.map((product: any) => (
                              <Link
                                key={product.id}
                                to={product.url}
                                className="search-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={product.main_image} alt={product.name} />
                                <div className="search-item-info">
                                  <div className="search-item-name">{product.name}</div>
                                  <div className="search-item-price">₦{parseFloat(product.current_price).toLocaleString()}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.brands?.count > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <h4>Brands ({searchResults.brands.count})</h4>
                          </div>
                          <div className="search-items">
                            {searchResults.brands.results.map((brand: any) => (
                              <Link
                                key={brand.id}
                                to={brand.url}
                                className="search-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={brand.logo} alt={brand.display_name} />
                                <div className="search-item-info">
                                  <div className="search-item-name">{brand.display_name}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="search-footer">
                        <button
                          className="view-all-results"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setIsSearchDropdownOpen(false);
                          }}
                        >
                          View all {searchResults.total_results} results
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="search-no-results">No results found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile Search Bar */}
          {isMobile && (
            <div className="search-container search-container-mobile">
              <form onSubmit={handleSearchSubmit} className="search-form-mobile">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery && setIsSearchDropdownOpen(true)}
                />
                <button type="submit" className="search-btn-mobile">
                  Search
                </button>
              </form>

              {/* Mobile Search Dropdown */}
              {isSearchDropdownOpen && searchResults && (
                <div className="search-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.has_results ? (
                    <>
                      {searchResults.products?.count > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <h4>Products ({searchResults.products.count})</h4>
                          </div>
                          <div className="search-items">
                            {searchResults.products.results.map((product: any) => (
                              <Link
                                key={product.id}
                                to={product.url}
                                className="search-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={product.main_image} alt={product.name} />
                                <div className="search-item-info">
                                  <div className="search-item-name">{product.name}</div>
                                  <div className="search-item-price">₦{parseFloat(product.current_price).toLocaleString()}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.brands?.count > 0 && (
                        <div className="search-section">
                          <div className="search-section-header">
                            <h4>Brands ({searchResults.brands.count})</h4>
                          </div>
                          <div className="search-items">
                            {searchResults.brands.results.map((brand: any) => (
                              <Link
                                key={brand.id}
                                to={brand.url}
                                className="search-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={brand.logo} alt={brand.display_name} />
                                <div className="search-item-info">
                                  <div className="search-item-name">{brand.display_name}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="search-footer">
                        <button
                          className="view-all-results"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setIsSearchDropdownOpen(false);
                          }}
                        >
                          View all {searchResults.total_results} results
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="search-no-results">No results found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Icons - Always align the three icons horizontally */}
          <div className="navbar-icons">
            <div className="phone-info">
              <Phone size={20} />
              <div className="phone-text">
                <span className="phone-label">Call us 24/7</span>
                <span className="phone-number">+2349138666111</span>
              </div>
            </div>
            <Link to="/wishlist" className="nav-icon">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="nav-icon">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/login" className="nav-icon">
              <User size={22} />
            </Link>
          </div>

          {/* Mobile Icons - remains unchanged for mobile views */}
          <div className="navbar-icons-mobile">
            <Link to="/cart" className="nav-icon">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link to="/login" className="nav-icon">
              <User size={22} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="navbar-bottom">
        <div className="navbar-container">
          {/* Left Side: Hamburger Menu (Always visible) */}
          <div className="navbar-left">
            <div className="hamburger-dropdown" ref={hamburgerRef}>
              <button
                className="hamburger-btn"
                onClick={() => setIsHamburgerDropdownOpen(!isHamburgerDropdownOpen)}
              >
                <Menu size={20} />
                {isMobile && (!isAuthenticated || !isOnAuthenticatedPage) && <span>Categories</span>}
              </button>
              {isHamburgerDropdownOpen && (
                <div className="hamburger-menu">
                  {isAuthenticated && isOnAuthenticatedPage ? (
                    <>
                      <button
                        className="hamburger-menu-item"
                        onClick={() => {
                          navigate('/dashboard');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <BarChart3 size={20} />
                        <span>Dashboard</span>
                      </button>
                      <button
                        className="hamburger-menu-item"
                        onClick={() => {
                          navigate('/profile-settings');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <User size={20} />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        className="hamburger-menu-item"
                        onClick={() => {
                          navigate('/order-history');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <FileText size={20} />
                        <span>Order History</span>
                      </button>
                      <button
                        className="hamburger-menu-item"
                        onClick={() => {
                          navigate('/wishlist');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <Heart size={20} />
                        <span>Wishlist</span>
                      </button>
                      <button
                        className="hamburger-menu-item"
                        onClick={() => {
                          navigate('/contact-support');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <HelpCircle size={20} />
                        <span>Support</span>
                      </button>
                      <button
                        className="hamburger-menu-item logout-item"
                        onClick={() => {
                          localStorage.removeItem('user');
                          navigate('/login');
                          setIsHamburgerDropdownOpen(false);
                        }}
                      >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/all-products" onClick={() => setIsHamburgerDropdownOpen(false)}>All Products</Link>
                      <Link to="/categories" onClick={() => setIsHamburgerDropdownOpen(false)}>Categories</Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {!isMobile && (!isAuthenticated || !isOnAuthenticatedPage) && (
              <Link to="/categories" className={`nav-link ${isActive('/categories') ? 'active' : ''}`}>
                Categories
              </Link>
            )}
          </div>

          {/* Right Side: Navigation Links (Desktop) */}
          <div className="nav-links-desktop">
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/brands" className={`nav-link ${isActive('/brands') ? 'active' : ''}`}>
              Brands
            </Link>
            {/* Services Dropdown */}
            <div className="services-dropdown" ref={servicesRef}>
              <button
                className="services-btn"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                <span>Services</span>
                <ChevronDown size={16} className={isServicesOpen ? 'rotated' : ''} />
              </button>
              {isServicesOpen && (
                <div className="services-menu">
                  <Link to="/phone-tracking" onClick={() => setIsServicesOpen(false)}>Phone Tracking</Link>
                  <Link to="/phone-swap" onClick={() => setIsServicesOpen(false)}>Phone Swapping</Link>
                </div>
              )}
            </div>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About Us
            </Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
              Contact
            </Link>
          </div>

          {/* Right Side: Mobile Navigation */}
          <div className="nav-links-mobile">
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/brands" className={`nav-link ${isActive('/brands') ? 'active' : ''}`}>
              Brands
            </Link>
            {/* More Dropdown */}
            <div className="more-dropdown" ref={moreRef}>
              <button
                className="more-btn"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
              >
                <span>More</span>
                <ChevronDown size={16} className={isMoreOpen ? 'rotated' : ''} />
              </button>
              {isMoreOpen && (
                <div className="more-menu">
                  <Link to="/contact" onClick={() => setIsMoreOpen(false)}>Contact Us</Link>
                  <Link to="/phone-tracking" onClick={() => setIsMoreOpen(false)}>Phone Tracking</Link>
                  <Link to="/phone-swap" onClick={() => setIsMoreOpen(false)}>Phone Swapping</Link>
                  <Link to="/about" onClick={() => setIsMoreOpen(false)}>About Us</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
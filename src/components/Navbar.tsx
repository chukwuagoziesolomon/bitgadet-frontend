import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Menu, Heart, Phone, FileText, HelpCircle, LogOut, X, BarChart3 } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Cart count (localStorage fallback for demonstration)
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    // Check for cart in localStorage
    const cart = localStorage.getItem('cart');
    try {
      const cartArr = cart ? JSON.parse(cart) : [];
      setCartCount(Array.isArray(cartArr) ? cartArr.length : 0);
    } catch {
      setCartCount(0);
    }
    const onStorage = () => {
      const updatedCart = localStorage.getItem('cart');
      try {
        const arr = updatedCart ? JSON.parse(updatedCart) : [];
        setCartCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { id: 'profile', label: 'Profile Settings', icon: User, path: '/profile-settings' },
    { id: 'orders', label: 'Order History', icon: FileText, path: '/order-history' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { id: 'support', label: 'Support', icon: HelpCircle, path: '/contact-support' },
    { id: 'logout', label: 'Sign Out', icon: LogOut, path: '/login' }
  ];

  // Search functions
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearchDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await publicApiRequest<any>(`/api/search/?q=${encodeURIComponent(query)}`);
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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearchDropdownOpen(false);
  };

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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
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
            <div className="search-container" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-wrapper">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-button"
                    onClick={clearSearch}
                  >
                    <X size={16} />
                  </button>
                )}
                <button type="submit" className="search-button">
                  Search
                </button>
              </form>

              {/* Search Results Dropdown */}
              {isSearchDropdownOpen && searchResults && (
                <div className="search-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.has_results ? (
                    <>
                      {/* Products Section */}
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
                                <img src={product.main_image} alt={product.name} className="search-item-image" />
                                <div className="search-item-info">
                                  <div className="search-item-name">{product.name}</div>
                                  <div className="search-item-price">₦{parseFloat(product.current_price).toLocaleString()}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brands Section */}
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
                                className="search-item brand-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={brand.logo} alt={brand.display_name} className="search-item-image brand-logo" />
                                <div className="search-item-info">
                                  <div className="search-item-name">{brand.display_name}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View All Results */}
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
                    <div className="search-no-results">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phone contact */}
            <div className="phone-contact">
              <Phone size={20} />
              <div className="phone-text">
                <span className="phone-label">Call us 24/7</span>
                <span className="phone-number">+2349138666111</span>
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

       {/* Tablet View */}
       <div className="tablet-view">
         {/* Top Bar */}
         <div className="navbar-top">
           <div className="navbar-container">
             {/* Logo */}
             <Link to="/" className="logo-link">
               <img src="/logo.png" alt="BitGadgetz" className="logo-image" />
             </Link>

             {/* Search bar */}
             <div className="search-container" ref={searchRef}>
               <form onSubmit={handleSearchSubmit} className="search-wrapper">
                 <input
                   type="text"
                   placeholder="Find your dream device here"
                   className="search-input"
                   value={searchQuery}
                   onChange={handleSearchInputChange}
                 />
                 {searchQuery && (
                   <button
                     type="button"
                     className="clear-search-button"
                     onClick={clearSearch}
                   >
                     <X size={16} />
                   </button>
                 )}
                 <button type="submit" className="search-button">
                   Search
                 </button>
               </form>

               {/* Search Results Dropdown */}
               {isSearchDropdownOpen && searchResults && (
                 <div className="search-dropdown">
                   {isSearching ? (
                     <div className="search-loading">Searching...</div>
                   ) : searchResults.has_results ? (
                     <>
                       {/* Products Section */}
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
                                 <img src={product.main_image} alt={product.name} className="search-item-image" />
                                 <div className="search-item-info">
                                   <div className="search-item-name">{product.name}</div>
                                   <div className="search-item-price">₦{parseFloat(product.current_price).toLocaleString()}</div>
                                 </div>
                               </Link>
                             ))}
                           </div>
                         </div>
                       )}

                       {/* Brands Section */}
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
                                 className="search-item brand-item"
                                 onClick={() => setIsSearchDropdownOpen(false)}
                               >
                                 <img src={brand.logo} alt={brand.display_name} className="search-item-image brand-logo" />
                                 <div className="search-item-info">
                                   <div className="search-item-name">{brand.display_name}</div>
                                 </div>
                               </Link>
                             ))}
                           </div>
                         </div>
                       )}

                       {/* View All Results */}
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
                     <div className="search-no-results">
                       No results found for "{searchQuery}"
                     </div>
                   )}
                 </div>
               )}
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
             {/* Left: Hamburger Menu with Categories */}
             <div className="tablet-left">
               <button
                 className="tablet-menu-button"
                 onClick={() => setIsTabletMenuOpen(!isTabletMenuOpen)}
               >
                 <Menu size={24} />
               </button>
               <span className="tablet-nav-text">
                 {isInDashboard ? 'Dashboard Menu' : 'Categories'}
               </span>

               {/* Tablet Menu Dropdown */}
               {isTabletMenuOpen && (
                 <div className="tablet-menu-dropdown">
                   {isInDashboard ? (
                     // Dashboard sidebar content
                     <div className="tablet-menu-content">
                       {sidebarItems.map((item) => (
                         <Link
                           key={item.id}
                           to={item.path || '#'}
                           className="tablet-menu-item"
                           onClick={() => setIsTabletMenuOpen(false)}
                         >
                           <item.icon size={18} />
                           <span>{item.label}</span>
                         </Link>
                       ))}
                     </div>
                   ) : (
                     // Regular categories content
                     <div className="tablet-menu-content">
                       <Link
                         to="/all-products"
                         className="tablet-menu-item"
                         onClick={() => setIsTabletMenuOpen(false)}
                       >
                         <span>All Products</span>
                       </Link>
                       <Link
                         to="/categories"
                         className="tablet-menu-item"
                         onClick={() => setIsTabletMenuOpen(false)}
                       >
                         <span>Categories</span>
                       </Link>
                     </div>
                   )}
                 </div>
               )}
             </div>

             {/* Center: Main Navigation */}
             <div className="tablet-navigation">
               <Link to="/home" className={isActive('/home') ? 'active' : ''}>Home</Link>
               <Link to="/brands" className={isActive('/brands') ? 'active' : ''}>Brands</Link>
               <div className="tablet-services-dropdown" ref={servicesRef}>
                 <button
                   className={`tablet-services-button ${isServicesOpen || isActive('/services') || isActive('/phone-tracking') || isActive('/phone-swap') ? 'active' : ''}`}
                   onClick={() => setIsServicesOpen(!isServicesOpen)}
                 >
                   Services <ChevronDown size={16} />
                 </button>
                 <div className={`tablet-services-menu ${isServicesOpen ? 'show' : ''}`}>
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
            {/* Right side icons */}
            <div className="mobile-top-icons">
              <Link to="/cart" className="mobile-top-icon cart-icon-with-badge">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
              <Link to="/login" className="mobile-top-icon">
                <User size={20} />
              </Link>
            </div>
          </div>
          {/* Search bar moves below logo/icons and is full width */}
          <div className="mobile-search-row">
            <div className="mobile-search-container" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className="mobile-search-wrapper">
                <input
                  type="text"
                  placeholder="Find your dream device here"
                  className="mobile-search-input"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="mobile-clear-search-button"
                    onClick={clearSearch}
                  >
                    <X size={14} />
                  </button>
                )}
                <button type="submit" className="mobile-search-button">
                  Search
                </button>
              </form>
              {/* Mobile Search Results Dropdown */}
              {isSearchDropdownOpen && searchResults && (
                <div className="mobile-search-dropdown">
                  {isSearching ? (
                    <div className="search-loading">Searching...</div>
                  ) : searchResults.has_results ? (
                    <>
                      {/* Products Section */}
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
                                <img src={product.main_image} alt={product.name} className="search-item-image" />
                                <div className="search-item-info">
                                  <div className="search-item-name">{product.name}</div>
                                  <div className="search-item-price">₦{parseFloat(product.current_price).toLocaleString()}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Brands Section */}
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
                                className="search-item brand-item"
                                onClick={() => setIsSearchDropdownOpen(false)}
                              >
                                <img src={brand.logo} alt={brand.display_name} className="search-item-image brand-logo" />
                                <div className="search-item-info">
                                  <div className="search-item-name">{brand.display_name}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View All Results */}
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
                    <div className="search-no-results">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
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

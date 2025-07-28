import React, { useState } from 'react';
import PriceFilter from './PriceFilter';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import './FilterSidebar.css';

interface FilterSidebarProps {
  onPriceFilter: (min: number, max: number) => void;
  minPrice: number;
  maxPrice: number;
  children?: React.ReactNode;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onPriceFilter,
  minPrice,
  maxPrice,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter options
  const ramOptions = ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const categoryOptions = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Wearables'];

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <aside className="filter-sidebar">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">
          <SearchIcon />
        </button>
      </div>
      
      {/* Price Filter */}
      <PriceFilter 
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={onPriceFilter}
        currency="₦"
      />
      
      {/* RAM Filter */}
      <div className="filter-dropdown">
        <button 
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('ram')}
        >
          <span>RAM</span>
          <ExpandMoreIcon 
            className={`dropdown-icon ${activeDropdown === 'ram' ? 'active' : ''}`} 
            sx={{ fontSize: 20 }}
          />
        </button>
        {activeDropdown === 'ram' && (
          <div className="dropdown-content">
            {ramOptions.map((ram) => (
              <label key={ram} className="filter-option">
                <input type="checkbox" className="filter-checkbox" />
                <span className="filter-label">{ram}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Storage Filter */}
      <div className="filter-dropdown">
        <button 
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('storage')}
        >
          <span>Storage</span>
          <ExpandMoreIcon 
            className={`dropdown-icon ${activeDropdown === 'storage' ? 'active' : ''}`} 
            sx={{ fontSize: 20 }}
          />
        </button>
        {activeDropdown === 'storage' && (
          <div className="dropdown-content">
            {storageOptions.map((storage) => (
              <label key={storage} className="filter-option">
                <input type="checkbox" className="filter-checkbox" />
                <span className="filter-label">{storage}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Categories Filter */}
      <div className="filter-dropdown">
        <button 
          className="filter-dropdown-btn"
          onClick={() => toggleDropdown('categories')}
        >
          <span>Categories</span>
          <ExpandMoreIcon 
            className={`dropdown-icon ${activeDropdown === 'categories' ? 'active' : ''}`} 
            sx={{ fontSize: 20 }}
          />
        </button>
        {activeDropdown === 'categories' && (
          <div className="dropdown-content">
            {categoryOptions.map((category) => (
              <label key={category} className="filter-option">
                <input type="checkbox" className="filter-checkbox" />
                <span className="filter-label">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {children}
      
      {/* Cart Summary */}
      <div className="cart-summary">
        <h3 className="cart-title">Cart</h3>
        <div className="cart-item">
          <img 
            src="/redmi-14c.jpg" 
            alt="Redmi 14C" 
            className="cart-item-image"
          />
          <div className="cart-item-details">
            <h4>Redmi 14C</h4>
            <p className="cart-item-specs">
              <span>Colors: Aquamarine Blue</span>
              <span>Storage: 256GB</span>
              <span>RAM: 8GB</span>
            </p>
            <p className="cart-item-quantity">1 x ₦170,500.00</p>
          </div>
          <button className="remove-item-btn">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="cart-total">
          <span>Subtotal:</span>
          <span>₦170,500.00</span>
        </div>
        <div className="cart-actions">
          <button className="view-cart-btn">View Cart</button>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

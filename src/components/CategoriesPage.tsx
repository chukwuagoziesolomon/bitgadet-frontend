import React, { useState } from 'react';
import { Search, ChevronDown, Grid3X3, List } from 'lucide-react';
import './CategoriesPage.css';

interface CategoryCard {
  id: number;
  name: string;
  description: string;
  image: string;
  startingPrice: string;
  productCount: number;
}

const CategoriesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: CategoryCard[] = [
    {
      id: 1,
      name: 'Laptops',
      description: 'High-performance laptops and notebooks',
      image: 'laptop.png',
      startingPrice: '₦1,450,000',
      productCount: 28
    },
    {
      id: 2,
      name: 'Phones',
      description: 'Latest smart phones and mobile design',
      image: 'phone.png',
      startingPrice: '₦100,000',
      productCount: 28
    },
    {
      id: 3,
      name: 'Tablets',
      description: 'High-performance laptops and notebooks',
      image: 'laptop.png',
      startingPrice: '₦1,450,000',
      productCount: 28
    },
    {
      id: 4,
      name: 'Smart watches',
      description: 'Smart wearables and fitness trackers',
      image: 'watch.png',
      startingPrice: '₦1,450,000',
      productCount: 28
    },
    {
      id: 5,
      name: 'Accessories',
      description: 'Phone cases, charges and more',
      image: 'headphone.png',
      startingPrice: '₦100,000',
      productCount: 28
    },
    {
      id: 6,
      name: 'Games',
      description: 'High-performance laptops and notebooks',
      image: 'games.png',
      startingPrice: '₦1,450,000',
      productCount: 28
    }
  ];

  return (
    <div className="categories-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Product Categories</h1>
          <p>Explore our wide range of tech products and gadgets</p>
          <div className="hero-features">
            <span>Categories</span>
            <span>216+ Products</span>
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="categories-container">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-section">
            <div className="search-input-container">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search categories..."
                className="search-input"
              />
            </div>
          </div>
          <div className="view-controls">
            <button className="filter-btn">
              <ChevronDown size={16} />
            </button>
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={`categories-grid ${viewMode}`}>
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="product-count-badge">
                  {category.productCount} Products
                </div>
              </div>
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-price">
                  Starting from {category.startingPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage; 
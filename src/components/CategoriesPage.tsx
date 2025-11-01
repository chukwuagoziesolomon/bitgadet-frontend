import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid3X3, List } from 'lucide-react';
import { publicApiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import { Link } from 'react-router-dom';
import './CategoriesPage.css';

interface Category {
  id: number;
  name: string;
  display_name: string;
  description: string;
  image: string;
  is_active: boolean;
  product_count: number;
  created_at?: string;
  updated_at?: string;
}

const CategoriesPage: React.FC = () => {
  const { showError } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await publicApiRequest<Category[]>('/api/categories/');
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
        showError('Error', 'Failed to load categories. Please try again later.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [showError]);

  // Search categories
  useEffect(() => {
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        if (searchTerm.trim().length === 0) {
          const data = await publicApiRequest<Category[]>('/api/categories/');
          setCategories(Array.isArray(data) ? data : []);
        } else {
          const data = await publicApiRequest<Category[]>(`/api/search/categories/?search=${encodeURIComponent(searchTerm)}`);
          setCategories(Array.isArray(data) ? data : []);
        }
        setError(null);
      } catch (err) {
        setError('Search failed.');
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  // Loading state
  if (loading) {
    return (
      <div className="categories-page">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Product Categories</h1>
            <p>Loading categories...</p>
            <div className="hero-features">
              <span>Categories</span>
              <span>Loading...</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="categories-page">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Product Categories</h1>
            <p>Explore our wide range of tech products and gadgets</p>
            <div className="hero-features">
              <span>Categories</span>
              <span>Error Loading</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Categories</h3>
          <p>{error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="categories-page">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Product Categories</h1>
            <p>Explore our wide range of tech products and gadgets</p>
            <div className="hero-features">
              <span>Categories</span>
              <span>No Categories</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Categories Available</h3>
          <p>We're currently updating our category catalog. Please check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Product Categories</h1>
          <p>Explore our wide range of tech products and gadgets</p>
          <div className="hero-features">
            <span>{categories.length} Categories</span>
            <span>{categories.reduce((total, cat) => total + cat.item_count, 0)}+ Products</span>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <Link key={category.id} to={`/categories/${category.name}`} className="category-card">
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.display_name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=No+Image';
                  }}
                />
                <div className="product-count-badge">
                  {category.product_count} products
                </div>
              </div>
              <div className="category-info">
                <h3 className="category-name">{category.display_name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage; 
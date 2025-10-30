import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { conditionalApiRequest } from '../config/api';
import './SearchResultsPage.css';

interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  current_price: string;
  original_price: string | null;
  brand: string;
  main_image: string;
  is_on_sale: boolean;
  is_in_stock: boolean;
  stock_quantity: number;
  url: string;
}

interface Brand {
  id: number;
  display_name: string;
  name: string;
  logo: string;
  url: string;
}

interface Category {
  id: number;
  display_name: string;
  name: string;
  url: string;
}

interface SearchResults {
  query: string;
  products: {
    results: Product[];
    count: number;
  };
  categories: {
    results: Category[];
    count: number;
  };
  brands: {
    results: Brand[];
    count: number;
  };
  total_products: number;
  total_categories: number;
  total_brands: number;
  total_results: number;
  has_results: boolean;
}

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await conditionalApiRequest<SearchResults>(`/api/search/?q=${encodeURIComponent(searchQuery)}`);
      setResults(response);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching for "{query}"...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-error">
            <h2>Search Error</h2>
            <p>{error}</p>
            <Link to="/home" className="back-home-btn">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!results || !results.has_results) {
    return (
      <div className="search-results-page">
        <div className="search-results-container">
          <div className="search-header">
            <h1>Search Results for "{query}"</h1>
          </div>
          <div className="no-results">
            <h2>No results found</h2>
            <p>We couldn't find any products, categories, or brands matching "{query}".</p>
            <p>Try adjusting your search terms or browse our categories:</p>
            <div className="suggestions">
              <Link to="/all-products" className="suggestion-link">All Products</Link>
              <Link to="/smartphones" className="suggestion-link">Smartphones</Link>
              <Link to="/laptops" className="suggestion-link">Laptops</Link>
              <Link to="/gaming" className="suggestion-link">Gaming</Link>
              <Link to="/accessories" className="suggestion-link">Accessories</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        <div className="search-header">
          <h1>Search Results for "{query}"</h1>
          <div className="results-summary">
            Found {results.total_results} results ({results.total_products} products, {results.total_categories} categories, {results.total_brands} brands)
          </div>
        </div>

        {/* Products Section */}
        {results.products && results.products.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Products ({results.products.count})</h2>
              <Link to={`/products?q=${encodeURIComponent(query)}`} className="view-all-link">
                View all products
              </Link>
            </div>
            <div className="products-grid">
              {results.products.results.map((product) => (
                <Link key={product.id} to={product.url} className="product-card">
                  <div className="product-image">
                    <img src={product.main_image} alt={product.name} />
                    {product.is_on_sale && <span className="sale-badge">Sale</span>}
                    {!product.is_in_stock && <span className="out-of-stock-badge">Out of Stock</span>}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category_name}</p>
                    <div className="product-price">
                      <span className="current-price">₦{parseFloat(product.current_price).toLocaleString()}</span>
                      {product.original_price && (
                        <span className="original-price">₦{parseFloat(product.original_price).toLocaleString()}</span>
                      )}
                    </div>
                    <p className="product-brand">by {product.brand}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {results.categories && results.categories.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Categories ({results.categories.count})</h2>
            </div>
            <div className="categories-grid">
              {results.categories.results.map((category) => (
                <Link key={category.id} to={category.url} className="category-card">
                  <h3>{category.display_name}</h3>
                  <p>{category.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Brands Section */}
        {results.brands && results.brands.count > 0 && (
          <section className="results-section">
            <div className="section-header">
              <h2>Brands ({results.brands.count})</h2>
            </div>
            <div className="brands-grid">
              {results.brands.results.map((brand) => (
                <Link key={brand.id} to={brand.url} className="brand-card">
                  <div className="brand-logo">
                    <img src={brand.logo} alt={brand.display_name} />
                  </div>
                  <h3>{brand.display_name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
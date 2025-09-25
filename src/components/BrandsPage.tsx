import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { API_CONFIG, apiRequest } from '../config/api';
import { useToast } from '../hooks/useToast';
import './BrandsPage.css';

interface Brand {
  id: number;
  name: string;
  display_name: string;
  description: string;
  logo: string;
  website: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

const BrandsPage: React.FC = () => {
  const { showError } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<Brand[] | { results: Brand[] }>(API_CONFIG.ENDPOINTS.BRANDS);

        // Handle both direct array response and paginated response
        const brandsArray = Array.isArray(data) ? data : (data as any).results || [];
        setBrands(brandsArray);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch brands:', err);
        setError('Failed to load brands. Please try again later.');
        showError('Error', 'Failed to load brands. Please try again later.');
        // Ensure brands is always an array
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [showError]);

  const handleViewProducts = (brandName: string) => {
    console.log(`Viewing products for ${brandName}`);
    // Add navigation logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="brands-page">
        <div className="brands-container">
          <div className="brands-header">
            <ShoppingBag size={48} className="brands-icon" />
            <h1>Our Brands</h1>
            <p>Loading brands...</p>
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="brands-page">
        <div className="brands-container">
          <div className="brands-header">
            <ShoppingBag size={48} className="brands-icon" />
            <h1>Our Brands</h1>
            <p>Discover products from top technology brands</p>
          </div>
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load Brands</h3>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (brands.length === 0) {
    return (
      <div className="brands-page">
        <div className="brands-container">
          <div className="brands-header">
            <ShoppingBag size={48} className="brands-icon" />
            <h1>Our Brands</h1>
            <p>Discover products from top technology brands</p>
          </div>
          <div className="empty-state">
            <div className="empty-icon">🏪</div>
            <h3>No Brands Available</h3>
            <p>We're currently updating our brand catalog. Please check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="brands-page">
      <div className="brands-container">
        <div className="brands-header">
          <ShoppingBag size={48} className="brands-icon" />
          <h1>Our Brands</h1>
          <p>Discover products from top technology brands</p>
        </div>

        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo-container">
                <img
                  src={brand.logo}
                  alt={brand.display_name}
                  className="brand-logo"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/200x150/f3f4f6/9ca3af?text=No+Logo'; // Cloudinary-style fallback
                  }}
                />
              </div>

              <div className="brand-content">
                <h3 className="brand-name">{brand.display_name}</h3>
                <p className="brand-description">{brand.description}</p>

                <div className="brand-stats">
                  <span className="product-count">{brand.product_count} products available</span>
                </div>

                <button
                  className="view-products-btn"
                  onClick={() => handleViewProducts(brand.name)}
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;

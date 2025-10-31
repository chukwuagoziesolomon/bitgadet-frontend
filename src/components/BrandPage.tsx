import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApiRequest } from '../config/api';
import './BrandPage.css';

interface Product {
  id: number;
  name: string;
  slug: string;
  category_name: string;
  category_slug: string;
  short_description: string;
  current_price: string;
  original_price: string | null;
  brand: string;
  model: string;
  main_image: string;
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  savings_usd: number;
  is_in_stock: boolean;
  is_out_of_stock: boolean;
  stock_status: string;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  product_condition: string;
  condition_display: string;
  stock_quantity: number;
  total_sales: number;
  views_count: number;
  created_at: string;
  is_available: boolean;
  is_new: boolean;
  is_bestseller: boolean;
}

interface BrandData {
  brand: string;
  brand_description: string;
  brand_logo: string;
  total_items: number;
  products: Product[];
}

const BrandPage: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      if (!brandName) return;
      try {
        setLoading(true);
        const endpoint = `/api/brands/${encodeURIComponent(brandName)}/products/`;
        const data = await publicApiRequest<BrandData>(endpoint);
        setBrandData(data);
        setError(null);
      } catch (err: any) {
        setError('Failed to load products for this brand');
        setBrandData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [brandName]);

  if (loading) {
    return (
      <div className="brand-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-page">
        <div className="error-state">
          <h2>Unable to Load Products</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!brandData || brandData.products.length === 0) {
    return (
      <div className="brand-page">
        <div className="brand-header">
          <img src={brandData?.brand_logo} alt={brandData?.brand} className="brand-logo" />
          <h1>{brandData?.brand || brandName}</h1>
          <p>{brandData?.brand_description}</p>
        </div>
        <div className="empty-state">
          <h3>No Products Available</h3>
          <p>This brand currently has no products listed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-page">
      <div className="brand-header">
        <img
          src={brandData.brand_logo}
          alt={brandData.brand}
          className="brand-logo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/200x150/f3f4f6/9ca3af?text=No+Logo';
          }}
        />
        <h1>{brandData.brand}</h1>
        <p>{brandData.brand_description}</p>
        <span className="total-items">{brandData.total_items} products available</span>
      </div>

      <div className="brand-products-grid">
        {brandData.products.map((product) => (
          <div key={product.id} className="brand-product-card">
            <img src={product.main_image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="short-description">{product.short_description}</p>
              <div className="price-section">
                <span className="current-price">₦{product.current_price}</span>
                {product.original_price && (
                  <span className="original-price">₦{product.original_price}</span>
                )}
              </div>
              <div className="product-badges">
                {product.is_new_arrival && <span className="badge new">New</span>}
                {product.is_best_seller && <span className="badge bestseller">Bestseller</span>}
                {product.is_on_sale && <span className="badge sale">Sale</span>}
              </div>
              <p className="stock-status">{product.stock_status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandPage;
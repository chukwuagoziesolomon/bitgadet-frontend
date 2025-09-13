import React from 'react';
import { useFeaturedProducts, Product } from '../hooks/useFeaturedProducts';
import './FeaturedProducts.css';

const FeaturedProducts: React.FC = () => {
  const { products, loading, error } = useFeaturedProducts();

  if (loading) {
    return <div className="loading">Loading featured products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.map((product: Product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                // Fallback image in case of error
                (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
              }}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-meta">
                <span className="price">${product.price.toFixed(2)}</span>
                <span className="category">{product.category}</span>
              </div>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

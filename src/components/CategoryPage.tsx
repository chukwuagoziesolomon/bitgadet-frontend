import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest, API_CONFIG } from '../config/api';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [summary, setSummary] = useState<{ category?: string; total_items?: number; trend?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryName) return;
      try {
        setLoading(true);
        const endpoint = `/api/categories/${encodeURIComponent(categoryName)}/products/`;
        const data = await apiRequest<any>(endpoint);
        const items = Array.isArray(data?.products) ? data.products : [];
        setProducts(items);
        setSummary({ category: data?.category, total_items: data?.total_items, trend: data?.trend });
        setError(null);
      } catch (err: any) {
        setError('Failed to load products');
        setProducts([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="category-page">
      <h1>Category: {categoryName}</h1>
      {summary && (
        <div className="category-summary">
          <span>{summary.category}</span> · <span>{summary.total_items ?? 0} items</span> · <span>trend: {summary.trend}</span>
        </div>
      )}
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products found in this category.</p>
      )}
      <div className="category-products-grid">
        {products.map((p) => (
          <div key={p.id} className="category-product-card">
            <img src={p.main_image} alt={p.name} />
            <div className="info">
              <h3>{p.name}</h3>
              <p className="price">₦{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

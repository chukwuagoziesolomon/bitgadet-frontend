import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApiRequest } from '../config/api';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ id: number; name: string; display_name: string; description: string; product_count: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryName) return;
      try {
        setLoading(true);
        // Use single-category endpoint which includes products array
        const endpoint = `/api/categories/${encodeURIComponent(categoryName)}/`;
        const data = await publicApiRequest<any>(endpoint);
        const items = Array.isArray(data?.products) ? data.products : [];
        setProducts(items);
        setMeta({
          id: data?.id,
          name: data?.name,
          display_name: data?.display_name,
          description: data?.description,
          product_count: data?.product_count ?? items.length,
        });
        setError(null);
      } catch (err: any) {
        setError('Failed to load products');
        setProducts([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="category-page">
      <h1>Category: {meta?.display_name || categoryName}</h1>
      {meta && (
        <div className="category-summary">
          <span>{meta.description}</span> · <span>{meta.product_count} items</span>
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
              <p className="price">₦{parseFloat(p.current_price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

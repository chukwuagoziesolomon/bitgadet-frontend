import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicApiRequest, conditionalApiRequest, API_CONFIG } from '../config/api';
import { cartService } from '../services/cartService';
import ProductCard from './ProductCard';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ id: number; name: string; display_name: string; description: string; product_count: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});

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

    // Fetch wishlist and cart on mount
    const fetchWishlistAndCart = async () => {
      const token = localStorage.getItem('authToken');
      const cartToken = cartService.getCartToken();

      if (!token && !cartToken) {
        setWishlist([]);
        setCart({});
        return;
      }

      try {
        const wishlistUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.WISHLIST_ALL}?cart_token=${cartToken}` : '/api/wishlist/';
        const cartUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.CART_GET}?cart_token=${cartToken}` : '/api/cart/';

        const [wishlistRes, cartRes] = await Promise.all([
          token ? conditionalApiRequest<any>(wishlistUrl) : publicApiRequest<any>(wishlistUrl),
          token ? conditionalApiRequest<any>(cartUrl) : publicApiRequest<any>(cartUrl)
        ]);

        setWishlist(wishlistRes.wishlist || []);
        setCart(cartRes.cart || {});
      } catch (error) {
        // Silent failure - don't show error toast to user
        console.error('Failed to fetch wishlist/cart:', error);
      }
    };

    fetchCategoryProducts();
    fetchWishlistAndCart();
  }, [categoryName]);

  // Get filter props for ProductCard
  const getProductCardProps = (product: any) => {
    return {
      key: product.id,
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand_name || product.brand,
      image: product.main_image,
      price: parseFloat(product.current_price),
      originalPrice: parseFloat(product.original_price),
      usdtPrice: product.current_price_usdt,
      originalUsdtPrice: product.original_price_usdt,
      rating: 4.5,
      reviews: 0,
      badges: product.is_featured ? ['featured'] : product.is_best_seller ? ['best-seller'] : product.is_new_arrival ? ['new-arrival'] : [],
      inStock: product.is_in_stock,
      onAddToCart: handleAddToCart,
      isInCart: cart[product.id] > 0,
      isInWishlist: wishlist.includes(product.id),
      onToggleWishlist: handleToggleWishlist,
      product_condition: product.product_condition,
      condition_display: product.condition_display,
      is_coupon: product.is_coupon,
      coupon_value: product.coupon_value,
    };
  };

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');

    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const res = await publicApiRequest<any>('/api/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      setCart(res.cart || {});
    } catch (error) {
      console.error('❌ Add to cart failed:', error);
      // Revert optimistic update
      setCart(prev => {
        const newCart = { ...prev };
        if (newCart[productId] > 1) {
          newCart[productId]--;
        } else {
          delete newCart[productId];
        }
        return newCart;
      });
      // Only log error if user is actually logged in (has token)
      if (token) {
        console.error('Failed to add to cart:', error);
      }
      // Silent failure - ProductCard already shows success toast
    }
  };

  // Toggle wishlist on single click
  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const token = localStorage.getItem('authToken');
    const endpoint = willBeInWishlist ? '/api/wishlist/add/' : '/api/wishlist/remove/';

    // Optimistic update
    setWishlist(prev => willBeInWishlist ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
      const res = await publicApiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      setWishlist(res.wishlist || []);
    } catch (error) {
      console.error('❌ Wishlist update failed:', error);
      // Revert optimistic update
      setWishlist(prev => willBeInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
      // Only log error if user is actually logged in (has token)
      if (token) {
        console.error('Failed to toggle wishlist:', error);
      }
      // Silent failure - ProductCard already shows appropriate toast
    }
  };

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
        {products.map((product) => (
          <ProductCard
            {...getProductCardProps(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest, publicApiRequest, conditionalApiRequest, API_CONFIG } from '../config/api';
import { cartService } from '../services/cartService';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import ProductCard from './ProductCard';
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
  current_price_usdt: string;
  original_price_usdt: string;
  brand_id: number;
  brand_name: string;
  is_coupon: boolean;
  model: string;
  main_image: string;
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage: number;
  savings_usd: number;
  savings_usdt: number;
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
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

const BrandPage: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const { setLoading } = useGlobalLoading();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchBrandProducts = async () => {
      if (!brandName) return;
      try {
          setLoading(true);
          const endpoint = `/api/v1/brands/${encodeURIComponent(brandName)}/products/`;
          const dataRaw = await publicApiRequest<any>(endpoint);

          // Normalize backend pagination shape: support { products, total_count } and DRF style { results, count }
          const normalized: BrandData = {
            count: dataRaw?.total_count ?? dataRaw?.count ?? (Array.isArray(dataRaw?.products) ? dataRaw.products.length : 0),
            next: dataRaw?.next ?? null,
            previous: dataRaw?.previous ?? null,
            results: Array.isArray(dataRaw?.products) ? dataRaw.products : (Array.isArray(dataRaw?.results) ? dataRaw.results : []),
          };

          // Attach original brand info if present for header rendering
          (normalized as any).brand = dataRaw?.brand ?? null;

          setBrandData(normalized);
          setError(null);
        } catch (err: any) {
        setError('Failed to load products for this brand');
        setBrandData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlistAndCart = async () => {
      const token = localStorage.getItem('authToken');
      const cartToken = cartService.getCartToken();

      if (!token && !cartToken) {
        setWishlist([]);
        setCart({});
        return;
      }

      try {
        const wishlistUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.WISHLIST_ALL}?cart_token=${cartToken}` : '/api/v1/wishlist/';
        const wishlistRes = token
          ? await conditionalApiRequest<any>(wishlistUrl)
          : await publicApiRequest<any>(wishlistUrl);
        const wishlistData = wishlistRes?.data || wishlistRes;
        setWishlist((wishlistData.products || wishlistData.wishlist_items || []).map((p: any) => typeof p === 'number' ? p : (p.product_id || p.id)));
      } catch (error) {
        if (token) console.error('Failed to fetch wishlist:', error);
      }

      try {
        const cartUrl = !token && cartToken ? `${API_CONFIG.ENDPOINTS.CART_GET}?cart_token=${cartToken}` : '/api/v1/cart/';
        const cartRes = token
          ? await conditionalApiRequest<any>(cartUrl)
          : await publicApiRequest<any>(cartUrl);
        const cartData = cartRes?.data || cartRes;
        const cartMap: Record<number, number> = {};
        (cartData.products || []).forEach((p: any) => { cartMap[p.id] = p.quantity; });
        setCart(cartMap);
      } catch (error) {
        if (token) console.error('Failed to fetch cart:', error);
      }
    };

    fetchBrandProducts();
    fetchWishlistAndCart();
  }, [brandName]);

  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken');
    // Optimistic update
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));

    try {
      const res = await (token ? apiRequest : publicApiRequest)<any>('/api/v1/cart/add/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      // optimistic update already applied above
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
    }
  };

  const handleToggleWishlist = async (productId: number, willBeInWishlist?: boolean) => {
    const endpoint = willBeInWishlist ? '/api/v1/wishlist/add/' : '/api/v1/wishlist/remove/';

    // Optimistic update
    setWishlist(prev => willBeInWishlist ? [...prev, productId] : prev.filter(id => id !== productId));

    try {
      const res = await publicApiRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      // optimistic update already applied above
    } catch (error) {
      console.error('❌ Wishlist update failed:', error);
      // Revert optimistic update
      setWishlist(prev => willBeInWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
    }
  };

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

  if (!brandData) {
    return <div className="brand-page">Loading...</div>;
  }

  if (!brandData.results || brandData.results.length === 0) {
    return (
      <div className="brand-page">
        <div className="brand-header">
          <h1>{brandName}</h1>
          <p>Products from {brandName}</p>
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
        <h1>{(brandData as any).brand?.display_name || brandData.results?.[0]?.brand_name || brandName}</h1>
        <p>Products from {(brandData as any).brand?.display_name || brandData.results?.[0]?.brand_name || brandName}</p>
        <span className="total-items">{brandData.count || 0} products available</span>
      </div>

      <div className="brand-products-grid">
        {brandData.results && brandData.results.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            slug={product.slug}
            name={product.name}
            brand={product.brand_name || product.brand}
            price={Number(product.current_price ?? product.price ?? 0)}
            originalPrice={product.original_price ? Number(product.original_price) : undefined}
            usdtPrice={product.current_price_usdt ?? product.price_usdt}
            originalUsdtPrice={product.original_price_usdt}
            rating={4.5} // Default rating
            reviews={0} // Default reviews
            image={product.main_image ?? product.image}
            inStock={product.is_in_stock}
            onAddToCart={handleAddToCart}
            isInCart={cart[product.id] > 0}
            isInWishlist={wishlist.includes(product.id)}
            onToggleWishlist={handleToggleWishlist}
            product_condition={product.product_condition}
            condition_display={product.condition_display}
            is_featured={product.is_featured}
            is_on_sale={product.is_on_sale}
            discount_percentage={product.discount_percentage}
            is_new_arrival={product.is_new_arrival}
            is_best_seller={product.is_best_seller}
            stock_quantity={product.stock_quantity}
            is_coupon={product.is_coupon}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandPage;